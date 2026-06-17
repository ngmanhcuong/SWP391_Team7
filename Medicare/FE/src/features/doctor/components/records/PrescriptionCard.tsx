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

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  prescriptions,
  clinicalContext,
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

  const aiSuggestions = useMemo(
    () => getClinicalMedicationSuggestions(clinicalContext),
    [clinicalContext],
  );

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
    return [...items].sort((a, b) => {
      const aRank = contraindicatedIds.has(a.id) ? 2 : recommendedIds.has(a.id) ? 0 : 1;
      const bRank = contraindicatedIds.has(b.id) ? 2 : recommendedIds.has(b.id) ? 0 : 1;
      return aRank - bRank;
    });
  }, [activeCategory, recommendedIds, contraindicatedIds]);

  const handleAddStandard = (medication: StandardMedication) => {
    if (existingNames.has(medication.name.toLowerCase())) return;
    if (isMedicationContraindicated(medication, clinicalContext.allergies ?? [])) return;
    onAdd(toPrescriptionItem(medication));
  };

  const handleAddFromAi = (suggestion: AiMedicationSuggestion) => {
    if (suggestion.name.includes('chống chỉ định')) return;
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
      dosage: 'Theo chỉ định',
      quantity: 'Theo liệu trình',
      instructions: 'Theo hướng dẫn bác sĩ và gợi ý lâm sàng',
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
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-[#c3c6d6]/40">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#191c1e]">Kê đơn thuốc</h3>
            {!isEditing && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#737685] bg-[#f8f9fb] px-2 py-0.5 rounded-full border border-[#c3c6d6]/50">
                <Lock size={10} />
                Chỉ xem
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#737685] mt-0.5 flex items-center gap-1 truncate">
            <Link2 size={11} className="shrink-0" />
            Liên kết khám lâm sàng: {contextSummary}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-medium text-[#434654]">Gợi ý lâm sàng</span>
          <Toggle checked={aiEnabled} onChange={onAiToggle} disabled={!isEditing} />
          {aiEnabled && (
            <span className="text-[10px] font-bold uppercase text-emerald-600">On</span>
          )}
        </div>
      </div>

      {aiEnabled && (
        <div className="mx-5 mt-4 p-4 rounded-xl bg-gradient-to-br from-[#e8f0fe] to-indigo-50 border border-[#003d9b]/10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#003d9b]" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#003d9b]">
              Đề xuất theo chẩn đoán ICD-10 / WHO
            </span>
            {!isEditing && (
              <span className="text-[10px] text-[#737685] font-normal normal-case">(chỉ xem)</span>
            )}
          </div>
          {aiSuggestions.length === 0 ? (
            <p className="text-xs text-[#737685]">
              Cập nhật triệu chứng và chẩn đoán sơ bộ để nhận gợi ý thuốc phù hợp.
            </p>
          ) : (
            <div className="space-y-2">
              {aiSuggestions.map((suggestion) => {
                const isWarning = suggestion.name.includes('chống chỉ định');
                const alreadyAdded = !isWarning && existingNames.has(suggestion.name.toLowerCase());
                return (
                  <div
                    key={suggestion.id}
                    className={`flex items-start gap-2 rounded-lg px-2 py-1.5 ${
                      isWarning ? 'bg-rose-50/80 border border-rose-100' : ''
                    }`}
                  >
                    {isWarning && (
                      <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-semibold ${
                          isWarning ? 'text-rose-700' : 'text-[#191c1e]'
                        }`}
                      >
                        {suggestion.name}
                      </p>
                      <p className="text-xs text-[#737685] mt-0.5">{suggestion.reason}</p>
                    </div>
                    {!isWarning && isEditing && (
                      <button
                        type="button"
                        onClick={() => handleAddFromAi(suggestion)}
                        disabled={alreadyAdded}
                        className="shrink-0 p-1.5 rounded-lg text-[#003d9b] hover:bg-white/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        <div className="overflow-x-auto -mx-1">
          <table className="w-full min-w-[280px]">
            <thead>
              <tr className="border-b border-[#c3c6d6]/30">
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685] pb-2 pr-3">
                  Thuốc
                </th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685] pb-2 pr-3">
                  SL
                </th>
                <th className="text-left text-[10px] font-semibold uppercase tracking-wider text-[#737685] pb-2">
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
                  <tr key={item.id} className="border-b border-[#c3c6d6]/15 last:border-0">
                    <td className="py-3 pr-3">
                      <p className="text-sm font-medium text-[#191c1e]">{item.name}</p>
                      <p className="text-xs text-[#737685]">{item.dosage}</p>
                    </td>
                    <td className="py-3 pr-3 text-sm text-[#434654] whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-xs text-[#434654]">{item.instructions}</td>
                    {isEditing && (
                      <td className="py-3">
                        <button
                          type="button"
                          onClick={() => onRemovePrescription(item.id)}
                          className="p-1 rounded-lg text-[#737685] hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline"
            >
              <Plus size={16} />
              Thêm thuốc thủ công
              <ChevronDown
                size={14}
                className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {pickerOpen && (
            <div className="mt-3 rounded-xl border border-[#c3c6d6]/60 bg-[#f8f9fb]/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#c3c6d6]/40 bg-white">
                <div>
                  <p className="text-sm font-semibold text-[#191c1e]">Thuốc theo khám lâm sàng</p>
                  <p className="text-xs text-[#737685] mt-0.5">
                    Lọc theo ICD-10, triệu chứng; kiểm tra dị ứng theo chuẩn lâm sàng
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPickerOpen(false)}
                  className="p-1.5 rounded-lg text-[#737685] hover:bg-[#f8f9fb]"
                  aria-label="Đóng"
                >
                  <X size={16} />
                </button>
              </div>

              {recommendations.recommended.length > 0 && (
                <div className="px-4 py-3 border-b border-[#c3c6d6]/30 bg-gradient-to-br from-[#e8f0fe]/60 to-white">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#003d9b] mb-2">
                    Đề xuất theo chẩn đoán & triệu chứng
                  </p>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {recommendations.recommended.slice(0, 5).map((entry) => {
                      const alreadyAdded = existingNames.has(entry.item.name.toLowerCase());
                      return (
                        <button
                          key={`rec-${entry.item.id}`}
                          type="button"
                          onClick={() => handleAddStandard(entry.item)}
                          disabled={alreadyAdded}
                          className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                            alreadyAdded
                              ? 'border-[#c3c6d6]/40 bg-[#f8f9fb]/60 opacity-60 cursor-not-allowed'
                              : 'border-[#003d9b]/15 bg-white hover:border-[#003d9b]/30 hover:bg-[#e8f0fe]/30'
                          }`}
                        >
                          <p className="text-sm font-medium text-[#191c1e]">{entry.item.name}</p>
                          <p className="text-[11px] text-[#737685] mt-0.5 line-clamp-2">
                            {entry.rationale}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-[#c3c6d6]/30 bg-white">
                {STANDARD_MEDICATION_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === category
                        ? 'bg-[#003d9b] text-white'
                        : 'bg-[#f8f9fb] text-[#434654] hover:bg-[#e8f0fe] hover:text-[#003d9b]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="max-h-56 overflow-y-auto divide-y divide-[#c3c6d6]/20 bg-white">
                {categoryMedications.map((medication) => {
                  const alreadyAdded = existingNames.has(medication.name.toLowerCase());
                  const isRecommended = recommendedIds.has(medication.id);
                  const isContraindicated = contraindicatedIds.has(medication.id);
                  const rec = recommendationMap.get(medication.id);
                  return (
                    <button
                      key={medication.id}
                      type="button"
                      onClick={() => handleAddStandard(medication)}
                      disabled={alreadyAdded || isContraindicated}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        alreadyAdded || isContraindicated
                          ? 'opacity-50 cursor-not-allowed bg-[#f8f9fb]/40'
                          : isRecommended
                            ? 'bg-[#e8f0fe]/25 hover:bg-[#e8f0fe]/50'
                            : 'hover:bg-[#e8f0fe]/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-[#191c1e]">{medication.name}</p>
                          {isRecommended && (
                            <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Phù hợp
                            </span>
                          )}
                          {isContraindicated && (
                            <span className="text-[10px] font-semibold uppercase text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                              Chống chỉ định
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#737685] mt-0.5">
                          {medication.quantity} · {medication.instructions}
                        </p>
                        {rec && (
                          <p className="text-[11px] text-[#737685] mt-0.5 line-clamp-1">{rec.rationale}</p>
                        )}
                      </div>
                      {alreadyAdded ? (
                        <span className="text-xs text-[#737685] shrink-0">Đã có</span>
                      ) : isContraindicated ? (
                        <AlertTriangle size={14} className="text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <Plus size={14} className="text-[#003d9b] shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t border-[#c3c6d6]/30 bg-white space-y-2">
                <p className="text-xs font-medium text-[#737685]">Hoặc nhập thuốc tùy chỉnh</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    type="text"
                    value={customForm.name}
                    onChange={(e) => setCustomForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Tên thuốc (VD: Amlodipine 5mg)"
                    className="px-3 py-2 text-sm border border-[#c3c6d6]/60 rounded-lg outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                  />
                  <input
                    type="text"
                    value={customForm.dosage}
                    onChange={(e) => setCustomForm((f) => ({ ...f, dosage: e.target.value }))}
                    placeholder="Liều dùng (VD: 5mg)"
                    className="px-3 py-2 text-sm border border-[#c3c6d6]/60 rounded-lg outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                  />
                  <input
                    type="text"
                    value={customForm.quantity}
                    onChange={(e) => setCustomForm((f) => ({ ...f, quantity: e.target.value }))}
                    placeholder="Số lượng (VD: 30 viên)"
                    className="px-3 py-2 text-sm border border-[#c3c6d6]/60 rounded-lg outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                  />
                  <input
                    type="text"
                    value={customForm.instructions}
                    onChange={(e) => setCustomForm((f) => ({ ...f, instructions: e.target.value }))}
                    placeholder="Hướng dẫn dùng"
                    className="px-3 py-2 text-sm border border-[#c3c6d6]/60 rounded-lg outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
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
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-[#003d9b] rounded-lg hover:bg-[#002d75] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
