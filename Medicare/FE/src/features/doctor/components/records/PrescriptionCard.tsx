import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ChevronDown, Link2, Lock, Plus, Sparkles, Trash2, X } from 'lucide-react';
import { Toggle } from '../../../../components/ui';
import { AiMedicationSuggestion, PrescriptionItem } from '../../types';
import {
  formatClinicalContextSummary,
  getClinicalMedicationSuggestions,
  getMedicationRecommendations,
  isMedicationContraindicated,
} from '../../utils/clinicalRecommendations';
import { ClinicalContextInput } from '../../utils/clinicalContext';
import {
  getMedicationsByCategory,
  STANDARD_MEDICATION_CATEGORIES,
  StandardMedication,
  toPrescriptionItem,
} from '../../utils/standardMedications';

interface PrescriptionCardProps {
  prescriptions: PrescriptionItem[];
  clinicalContext: ClinicalContextInput;
  aiSuggestions?: AiMedicationSuggestion[];
  aiLoading?: boolean;
  aiError?: string;
  isEditing: boolean;
  aiEnabled: boolean;
  onAiToggle: (enabled: boolean) => void;
  onAdd: (item: PrescriptionItem) => void;
  onRemovePrescription: (id: string) => void;
}

const emptyCustomForm = {
  name: '',
  dosage: '',
  quantity: '',
  instructions: '',
};

const containsHardWarning = (suggestion: AiMedicationSuggestion) =>
  suggestion.name.toLowerCase().includes('chống chỉ định') ||
  String(suggestion.warning || '').toLowerCase().includes('chống chỉ định');

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescriptions,
  clinicalContext,
  aiSuggestions: remoteAiSuggestions = [],
  aiLoading = false,
  aiError = '',
  isEditing,
  aiEnabled,
  onAiToggle,
  onAdd,
  onRemovePrescription,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(STANDARD_MEDICATION_CATEGORIES[0]);
  const [customForm, setCustomForm] = useState(emptyCustomForm);

  useEffect(() => {
    if (!isEditing) {
      setPickerOpen(false);
    }
  }, [isEditing]);

  const recommendations = useMemo(
    () => getMedicationRecommendations(clinicalContext),
    [clinicalContext],
  );

  const localAiSuggestions = useMemo(
    () => getClinicalMedicationSuggestions(clinicalContext),
    [clinicalContext],
  );

  const aiSuggestions = useMemo(() => {
    if (remoteAiSuggestions.length === 0) return localAiSuggestions;

    const merged = [...remoteAiSuggestions];
    localAiSuggestions.forEach((suggestion) => {
      const exists = merged.some((item) => item.name.toLowerCase() === suggestion.name.toLowerCase());
      if (!exists) merged.push(suggestion);
    });
    return merged;
  }, [localAiSuggestions, remoteAiSuggestions]);

  const recommendedIds = useMemo(
    () => new Set(recommendations.recommended.map((entry) => entry.item.id)),
    [recommendations.recommended],
  );

  const recommendationMap = useMemo(
    () => new Map(recommendations.recommended.map((entry) => [entry.item.id, entry])),
    [recommendations.recommended],
  );

  const contraindicatedIds = useMemo(
    () => new Set(recommendations.contraindicated.map((entry) => entry.item.id)),
    [recommendations.contraindicated],
  );

  const contextSummary = useMemo(
    () => formatClinicalContextSummary(clinicalContext),
    [clinicalContext],
  );

  const existingNames = useMemo(
    () => new Set(prescriptions.map((item) => item.name.toLowerCase())),
    [prescriptions],
  );

  const categoryMedications = useMemo(() => {
    const items = getMedicationsByCategory(activeCategory);
    return [...items].sort((left, right) => {
      const leftRank = contraindicatedIds.has(left.id) ? 2 : recommendedIds.has(left.id) ? 0 : 1;
      const rightRank = contraindicatedIds.has(right.id) ? 2 : recommendedIds.has(right.id) ? 0 : 1;
      return leftRank - rightRank;
    });
  }, [activeCategory, contraindicatedIds, recommendedIds]);

  const handleAddStandard = (medication: StandardMedication) => {
    if (existingNames.has(medication.name.toLowerCase())) return;
    if (isMedicationContraindicated(medication, clinicalContext.allergies ?? [])) return;
    onAdd(toPrescriptionItem(medication));
  };

  const handleAddFromAi = (suggestion: AiMedicationSuggestion) => {
    if (containsHardWarning(suggestion)) return;
    if (existingNames.has(suggestion.name.toLowerCase())) return;

    const matchedMed = recommendations.recommended.find(
      (entry) => entry.item.name === suggestion.name,
    )?.item;

    if (matchedMed) {
      onAdd(toPrescriptionItem(matchedMed, `ai-${suggestion.id}`));
      return;
    }

    onAdd({
      id: `rx-ai-${suggestion.id}-${Date.now()}`,
      name: suggestion.name,
      dosage: suggestion.dosage?.trim() || 'Theo chỉ định',
      quantity: suggestion.quantity?.trim() || 'Theo liệu trình',
      instructions: suggestion.instructions?.trim() || 'Theo hướng dẫn bác sĩ và gợi ý lâm sàng',
    });
  };

  const handleAddCustom = () => {
    const name = customForm.name.trim();
    const dosage = customForm.dosage.trim();
    const quantity = customForm.quantity.trim();
    const instructions = customForm.instructions.trim();

    if (!name || !dosage || !quantity || !instructions) return;
    if (existingNames.has(name.toLowerCase())) return;

    onAdd({
      id: `rx-custom-${Date.now()}`,
      name,
      dosage,
      quantity,
      instructions,
    });
    setCustomForm(emptyCustomForm);
    setPickerOpen(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#c3c6d6]/60 bg-white shadow-sm shadow-[#2563eb]/5">
      <div className="flex items-center justify-between gap-3 border-b border-[#c3c6d6]/40 px-5 py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[#191c1e]">Kê đơn thuốc</h3>
            {!isEditing && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#c3c6d6]/50 bg-[#f8f9fb] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#737685]">
                <Lock size={10} />
                Chỉ xem
              </span>
            )}
          </div>
          <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-[#737685]">
            <Link2 size={11} className="shrink-0" />
            Liên kết khám lâm sàng: {contextSummary}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-[#434654]">Gợi ý lâm sàng</span>
          <Toggle checked={aiEnabled} onChange={onAiToggle} disabled={!isEditing} />
          {aiEnabled && <span className="text-[10px] font-bold uppercase text-emerald-600">On</span>}
        </div>
      </div>

      {aiEnabled && (
        <div className="mx-5 mt-4 rounded-xl border border-[#2563eb]/10 bg-gradient-to-br from-[#e8f0fe] to-indigo-50 p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-[#2563eb]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#2563eb]">
              Đề xuất theo chẩn đoán ICD-10 / AI / WHO
            </span>
            {!isEditing && (
              <span className="text-[10px] font-normal normal-case text-[#737685]">(chỉ xem)</span>
            )}
          </div>

          {aiSuggestions.length === 0 && !aiLoading ? (
            <p className="text-xs text-[#737685]">
              Cập nhật triệu chứng và chẩn đoán sơ bộ để nhận gợi ý thuốc phù hợp.
            </p>
          ) : (
            <div className="space-y-2">
              {aiLoading && (
                <p className="text-xs text-[#2563eb]">AI đang phân tích thêm thuốc phù hợp...</p>
              )}
              {!aiLoading && aiError && (
                <p className="text-xs text-amber-700">{aiError}</p>
              )}

              {aiSuggestions.map((suggestion) => {
                const isWarning = containsHardWarning(suggestion) || Boolean(suggestion.warning);
                const alreadyAdded = !isWarning && existingNames.has(suggestion.name.toLowerCase());

                return (
                  <div
                    key={suggestion.id}
                    className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${
                      isWarning ? 'border border-rose-100 bg-rose-50/80' : ''
                    }`}
                  >
                    {isWarning && (
                      <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-600" />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-semibold ${isWarning ? 'text-rose-700' : 'text-[#191c1e]'}`}>
                        {suggestion.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#737685]">{suggestion.reason}</p>
                      {(suggestion.dosage || suggestion.quantity || suggestion.instructions) && (
                        <p className="mt-1 text-[11px] text-[#5d6472]">
                          {[suggestion.dosage, suggestion.quantity, suggestion.instructions]
                            .filter(Boolean)
                            .join(' · ')}
                        </p>
                      )}
                      {suggestion.warning && (
                        <p className="mt-1 text-[11px] text-rose-700">{suggestion.warning}</p>
                      )}
                    </div>

                    {!isWarning && isEditing && (
                      <button
                        type="button"
                        onClick={() => handleAddFromAi(suggestion)}
                        disabled={alreadyAdded}
                        className="shrink-0 rounded-lg p-1.5 text-[#2563eb] transition-colors hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Thêm ${suggestion.name}`}
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="p-5">
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[280px]">
            <thead>
              <tr className="border-b border-[#c3c6d6]/30">
                <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685]">
                  Thuốc
                </th>
                <th className="pb-2 pr-3 text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685]">
                  SL
                </th>
                <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685]">
                  Hướng dẫn
                </th>
                {isEditing && <th className="w-8 pb-2" aria-hidden />}
              </tr>
            </thead>
            <tbody>
              {prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={isEditing ? 4 : 3} className="py-6 text-center text-sm text-[#737685]">
                    Chưa có thuốc trong đơn. Thêm từ gợi ý lâm sàng hoặc danh mục mẫu.
                  </td>
                </tr>
              ) : (
                prescriptions.map((item) => (
                  <tr key={item.id} className="last:border-0 border-b border-[#c3c6d6]/15">
                    <td className="py-3 pr-3">
                      <p className="text-sm font-medium text-[#191c1e]">{item.name}</p>
                      <p className="text-xs text-[#737685]">{item.dosage}</p>
                    </td>
                    <td className="whitespace-nowrap py-3 pr-3 text-sm text-[#434654]">{item.quantity}</td>
                    <td className="py-3 text-xs text-[#434654]">{item.instructions}</td>
                    {isEditing && (
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => onRemovePrescription(item.id)}
                          className="rounded-lg p-1 text-[#737685] transition-colors hover:bg-rose-50 hover:text-rose-600"
                          aria-label="Xóa thuốc"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {isEditing && (
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563eb] hover:underline"
            >
              <Plus size={16} />
              Thêm thuốc thủ công
              <ChevronDown size={14} className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {pickerOpen && (
              <div className="mt-3 overflow-hidden rounded-xl border border-[#c3c6d6]/60 bg-[#f8f9fb]/50">
                <div className="flex items-center justify-between border-b border-[#c3c6d6]/40 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#191c1e]">Thuốc theo khám lâm sàng</p>
                    <p className="mt-0.5 text-xs text-[#737685]">
                      Lọc theo ICD-10, triệu chứng; kiểm tra dị ứng theo chuẩn lâm sàng
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(false)}
                    className="rounded-lg p-1.5 text-[#737685] hover:bg-[#f8f9fb]"
                    aria-label="Đóng"
                  >
                    <X size={16} />
                  </button>
                </div>

                {recommendations.recommended.length > 0 && (
                  <div className="border-b border-[#c3c6d6]/30 bg-gradient-to-br from-[#e8f0fe]/60 to-white px-4 py-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#2563eb]">
                      Đề xuất theo chẩn đoán & triệu chứng
                    </p>
                    <div className="max-h-40 space-y-2 overflow-y-auto">
                      {recommendations.recommended.slice(0, 5).map((entry) => {
                        const alreadyAdded = existingNames.has(entry.item.name.toLowerCase());
                        return (
                          <button
                            key={`rec-${entry.item.id}`}
                            type="button"
                            onClick={() => handleAddStandard(entry.item)}
                            disabled={alreadyAdded}
                            className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors ${
                              alreadyAdded
                                ? 'cursor-not-allowed border-[#c3c6d6]/40 bg-[#f8f9fb]/60 opacity-60'
                                : 'border-[#2563eb]/15 bg-white hover:border-[#2563eb]/30 hover:bg-[#e8f0fe]/30'
                            }`}
                          >
                            <p className="text-sm font-medium text-[#191c1e]">{entry.item.name}</p>
                            <p className="mt-0.5 line-clamp-2 text-[11px] text-[#737685]">
                              {entry.rationale}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 border-b border-[#c3c6d6]/30 bg-white px-4 py-3">
                  {STANDARD_MEDICATION_CATEGORIES.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeCategory === category
                          ? 'bg-[#2563eb] text-white'
                          : 'bg-[#f8f9fb] text-[#434654] hover:bg-[#e8f0fe] hover:text-[#2563eb]'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="max-h-56 divide-y divide-[#c3c6d6]/20 overflow-y-auto bg-white">
                  {categoryMedications.map((medication) => {
                    const alreadyAdded = existingNames.has(medication.name.toLowerCase());
                    const isRecommended = recommendedIds.has(medication.id);
                    const isContraindicated = contraindicatedIds.has(medication.id);
                    const recommendation = recommendationMap.get(medication.id);

                    return (
                      <button
                        key={medication.id}
                        type="button"
                        onClick={() => handleAddStandard(medication)}
                        disabled={alreadyAdded || isContraindicated}
                        className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors ${
                          alreadyAdded || isContraindicated
                            ? 'cursor-not-allowed bg-[#f8f9fb]/40 opacity-50'
                            : isRecommended
                              ? 'bg-[#e8f0fe]/25 hover:bg-[#e8f0fe]/50'
                              : 'hover:bg-[#e8f0fe]/40'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-medium text-[#191c1e]">{medication.name}</p>
                            {isRecommended && (
                              <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
                                Phù hợp
                              </span>
                            )}
                            {isContraindicated && (
                              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-700">
                                Chống chỉ định
                              </span>
                            )}
                          </div>
                          <p className="mt-0.5 text-xs text-[#737685]">
                            {medication.quantity} · {medication.instructions}
                          </p>
                          {recommendation && (
                            <p className="mt-0.5 line-clamp-1 text-[11px] text-[#737685]">
                              {recommendation.rationale}
                            </p>
                          )}
                        </div>
                        {alreadyAdded ? (
                          <span className="shrink-0 text-xs text-[#737685]">Đã có</span>
                        ) : isContraindicated ? (
                          <AlertTriangle size={14} className="mt-0.5 shrink-0 text-rose-600" />
                        ) : (
                          <Plus size={14} className="mt-0.5 shrink-0 text-[#2563eb]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-2 border-t border-[#c3c6d6]/30 bg-white px-4 py-3">
                  <p className="text-xs font-medium text-[#737685]">Hoặc nhập thuốc tùy chỉnh</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      value={customForm.name}
                      onChange={(event) => setCustomForm((form) => ({ ...form, name: event.target.value }))}
                      placeholder="Tên thuốc (VD: Amlodipine 5mg)"
                      className="rounded-lg border border-[#c3c6d6]/60 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                    />
                    <input
                      type="text"
                      value={customForm.dosage}
                      onChange={(event) => setCustomForm((form) => ({ ...form, dosage: event.target.value }))}
                      placeholder="Liều dùng (VD: 5mg)"
                      className="rounded-lg border border-[#c3c6d6]/60 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                    />
                    <input
                      type="text"
                      value={customForm.quantity}
                      onChange={(event) => setCustomForm((form) => ({ ...form, quantity: event.target.value }))}
                      placeholder="Số lượng (VD: 30 viên)"
                      className="rounded-lg border border-[#c3c6d6]/60 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                    />
                    <input
                      type="text"
                      value={customForm.instructions}
                      onChange={(event) => setCustomForm((form) => ({ ...form, instructions: event.target.value }))}
                      placeholder="Hướng dẫn dùng"
                      className="rounded-lg border border-[#c3c6d6]/60 px-3 py-2 text-sm outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    disabled={
                      !customForm.name.trim() ||
                      !customForm.dosage.trim() ||
                      !customForm.quantity.trim() ||
                      !customForm.instructions.trim()
                    }
                    className="w-full rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Thêm vào đơn
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionCard;
