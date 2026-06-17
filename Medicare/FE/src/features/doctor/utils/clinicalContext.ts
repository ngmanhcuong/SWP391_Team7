export interface ClinicalContextInput {
  clinicalSymptoms: string;
  preliminaryDiagnosis: string;
  additionalNotes?: string;
  allergies?: string[];
  medicalHistory?: string[];
}

export interface ClinicalMatch {
  source: 'icd10' | 'symptom' | 'history' | 'note';
  label: string;
}

export interface ScoredClinicalItem<T> {
  item: T;
  score: number;
  priority: number;
  rationale: string;
  whoRef?: string;
  matches: ClinicalMatch[];
}

export interface ClinicalRecommendationResult<T> {
  recommended: ScoredClinicalItem<T>[];
  hasClinicalContext: boolean;
  matchedDiagnoses: string[];
  matchedSymptoms: string[];
}
