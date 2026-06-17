import { AiMedicationSuggestion } from '../types';
import {
  ClinicalContextInput,
  ClinicalMatch,
  ClinicalRecommendationResult,
  ScoredClinicalItem,
} from './clinicalContext';
import {
  STANDARD_MEDICATIONS,
  StandardMedication,
} from './standardMedications';
import {
  STANDARD_PARACLINICAL_INDICATIONS,
  StandardParaclinicalIndication,
} from './standardParaclinicalIndications';

const ICD10_PATTERN = /\b([A-Z]\d{2}(?:\.\d{1,2})?)\b/gi;

const ICD10_LABELS: Record<string, string> = {
  I10: 'Tăng huyết áp vô căn',
  I11: 'Bệnh tim tăng huyết áp',
  I20: 'Đau thắt ngực',
  J20: 'Viêm phế quản cấp',
  J06: 'Nhiễm trùng đường hô hấp cấp',
  E11: 'Đái tháo đường type 2',
  E78: 'Rối loạn lipid máu',
  'E78.5': 'Rối loạn lipid máu không đặc hiệu',
  K29: 'Viêm dạ dày và tá tràng',
  K21: 'Trào ngược dạ dày-thực quản',
  R07: 'Đau ngực',
  'R07.4': 'Đau ngực không đặc hiệu',
  E03: 'Suy giáp',
};

const SYMPTOM_KEYWORDS: Record<string, string> = {
  'đau ngực': 'Đau ngực',
  'khó thở': 'Khó thở',
  'ho khan': 'Ho khan',
  'ho': 'Ho',
  'sốt': 'Sốt',
  'đau đầu': 'Đau đầu',
  'chóng mặt': 'Chóng mặt',
  'đau bụng': 'Đau bụng',
  'thượng vị': 'Đau thượng vị',
  'mệt mỏi': 'Mệt mỏi',
  'khát nước': 'Khát nước',
  'tiểu đêm': 'Tiểu đêm',
  'tiểu nhiều': 'Tiểu nhiều',
  'nôn': 'Nôn',
  'ợ chua': 'Ợ chua',
  'khó thở khi gắng sức': 'Khó thở khi gắng sức',
};

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const extractIcd10Codes = (text: string): string[] => {
  const codes = new Set<string>();
  const matches = Array.from(text.matchAll(ICD10_PATTERN));
  for (const match of matches) {
    codes.add(match[1].toUpperCase());
  }
  return Array.from(codes);
};

const extractSymptomKeywords = (text: string): string[] => {
  const normalized = normalizeText(text);
  const found: string[] = [];
  const sortedKeys = Object.keys(SYMPTOM_KEYWORDS).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    if (normalized.includes(normalizeText(key))) {
      found.push(SYMPTOM_KEYWORDS[key]);
    }
  }
  return found;
};

const matchesIcd = (itemCodes: string[] | undefined, contextCodes: string[]): ClinicalMatch[] => {
  if (!itemCodes?.length || !contextCodes.length) return [];

  return contextCodes
    .filter((code) =>
      itemCodes.some(
        (itemCode) =>
          code === itemCode ||
          code.startsWith(`${itemCode}.`) ||
          itemCode.startsWith(`${code}.`),
      ),
    )
    .map((code) => ({
      source: 'icd10' as const,
      label: ICD10_LABELS[code] ?? code,
    }));
};

const matchesKeywords = (
  keywords: string[] | undefined,
  text: string,
  source: 'symptom' | 'history' | 'note',
): ClinicalMatch[] => {
  if (!keywords?.length || !text) return [];
  const normalized = normalizeText(text);

  return keywords
    .filter((keyword) => normalized.includes(normalizeText(keyword)))
    .map((keyword) => ({
      source,
      label: keyword,
    }));
};

const scoreItem = <T extends { id: string; clinicalLinks?: ClinicalLinkMeta[] }>(
  item: T,
  context: ParsedClinicalContext,
): ScoredClinicalItem<T> | null => {
  const links = item.clinicalLinks ?? [];
  if (!links.length) return null;

  let bestScore = 0;
  let bestRationale = '';
  let bestWhoRef: string | undefined;
  let bestPriority = 99;
  const allMatches: ClinicalMatch[] = [];

  for (const link of links) {
    const icdMatches = matchesIcd(link.icd10Codes, context.icd10Codes);
    const symptomMatches = matchesKeywords(link.symptomKeywords, context.symptomsText, 'symptom');
    const historyMatches = matchesKeywords(link.symptomKeywords, context.historyText, 'history');
    const noteMatches = matchesKeywords(link.symptomKeywords, context.notesText, 'note');

    const linkMatches = [...icdMatches, ...symptomMatches, ...historyMatches, ...noteMatches];
    if (!linkMatches.length) continue;

    const score =
      icdMatches.length * 100 +
      symptomMatches.length * 55 +
      historyMatches.length * 35 +
      noteMatches.length * 20 +
      (link.priority ? Math.max(0, 10 - link.priority) : 0);

    if (score > bestScore) {
      bestScore = score;
      bestRationale = link.rationale;
      bestWhoRef = link.whoRef;
      bestPriority = link.priority ?? 5;
      allMatches.splice(0, allMatches.length, ...linkMatches);
    }
  }

  if (bestScore <= 0) return null;

  return {
    item,
    score: bestScore,
    priority: bestPriority,
    rationale: bestRationale,
    whoRef: bestWhoRef,
    matches: allMatches,
  };
};

interface ClinicalLinkMeta {
  icd10Codes?: string[];
  symptomKeywords?: string[];
  rationale: string;
  whoRef?: string;
  priority?: number;
}

interface ParsedClinicalContext {
  icd10Codes: string[];
  symptomsText: string;
  historyText: string;
  notesText: string;
  matchedDiagnoses: string[];
  matchedSymptoms: string[];
  hasClinicalContext: boolean;
}

const parseClinicalContext = (input: ClinicalContextInput): ParsedClinicalContext => {
  const icd10Codes = extractIcd10Codes(input.preliminaryDiagnosis);
  const matchedSymptoms = extractSymptomKeywords(input.clinicalSymptoms);
  const matchedDiagnoses = icd10Codes.map((code) => ICD10_LABELS[code] ?? code);

  const hasClinicalContext =
    icd10Codes.length > 0 ||
    matchedSymptoms.length > 0 ||
    Boolean(input.medicalHistory?.length) ||
    Boolean(normalizeText(input.clinicalSymptoms));

  return {
    icd10Codes,
    symptomsText: input.clinicalSymptoms,
    historyText: (input.medicalHistory ?? []).join(' '),
    notesText: [input.additionalNotes ?? '', input.preliminaryDiagnosis].join(' '),
    matchedDiagnoses,
    matchedSymptoms,
    hasClinicalContext,
  };
};

const rankClinicalItems = <T extends { id: string; clinicalLinks?: ClinicalLinkMeta[] }>(
  items: T[],
  context: ParsedClinicalContext,
): ScoredClinicalItem<T>[] =>
  items
    .map((item) => scoreItem(item, context))
    .filter((entry): entry is ScoredClinicalItem<T> => entry !== null)
    .sort((a, b) => b.score - a.score || a.priority - b.priority);

export const getParaclinicalRecommendations = (
  input: ClinicalContextInput,
): ClinicalRecommendationResult<StandardParaclinicalIndication> => {
  const context = parseClinicalContext(input);
  const recommended = rankClinicalItems(STANDARD_PARACLINICAL_INDICATIONS, context);

  return {
    recommended,
    hasClinicalContext: context.hasClinicalContext,
    matchedDiagnoses: context.matchedDiagnoses,
    matchedSymptoms: context.matchedSymptoms,
  };
};

const isAllergyConflict = (medication: StandardMedication, allergies: string[]): boolean => {
  if (!medication.contraindicatedAllergies?.length || !allergies.length) return false;
  const normalizedAllergies = allergies.map(normalizeText);

  return medication.contraindicatedAllergies.some((group) =>
    normalizedAllergies.some(
      (allergy) => allergy.includes(normalizeText(group)) || normalizeText(group).includes(allergy),
    ),
  );
};

export const getMedicationRecommendations = (
  input: ClinicalContextInput,
): ClinicalRecommendationResult<StandardMedication> & {
  contraindicated: ScoredClinicalItem<StandardMedication>[];
} => {
  const context = parseClinicalContext(input);
  const allergies = input.allergies ?? [];

  const scored = rankClinicalItems(STANDARD_MEDICATIONS, context);
  const contraindicated = scored.filter((entry) => isAllergyConflict(entry.item, allergies));
  const contraindicatedIds = new Set(contraindicated.map((entry) => entry.item.id));
  const recommended = scored.filter((entry) => !contraindicatedIds.has(entry.item.id));

  return {
    recommended,
    contraindicated,
    hasClinicalContext: context.hasClinicalContext,
    matchedDiagnoses: context.matchedDiagnoses,
    matchedSymptoms: context.matchedSymptoms,
  };
};

export const getClinicalMedicationSuggestions = (
  input: ClinicalContextInput,
): AiMedicationSuggestion[] => {
  const { recommended, contraindicated } = getMedicationRecommendations(input);

  const suggestions: AiMedicationSuggestion[] = recommended.slice(0, 4).map((entry) => ({
    id: `clinical-${entry.item.id}`,
    name: entry.item.name,
    reason: `${entry.rationale}${entry.whoRef ? ` (${entry.whoRef})` : ''}`,
  }));

  contraindicated.slice(0, 2).forEach((entry) => {
    suggestions.push({
      id: `warn-${entry.item.id}`,
      name: `${entry.item.name} — chống chỉ định`,
      reason: `Không kê do tiền sử dị ứng: ${(input.allergies ?? []).join(', ')}`,
    });
  });

  return suggestions;
};

export const isMedicationContraindicated = (
  medication: StandardMedication,
  allergies: string[],
): boolean => isAllergyConflict(medication, allergies);

export const formatClinicalContextSummary = (input: ClinicalContextInput): string => {
  const context = parseClinicalContext(input);
  const parts: string[] = [];

  if (context.matchedDiagnoses.length) {
    parts.push(`Chẩn đoán: ${context.matchedDiagnoses.join(', ')}`);
  }
  if (context.matchedSymptoms.length) {
    parts.push(`Triệu chứng: ${context.matchedSymptoms.join(', ')}`);
  }

  return parts.join(' · ') || 'Chưa có đủ thông tin khám lâm sàng';
};
