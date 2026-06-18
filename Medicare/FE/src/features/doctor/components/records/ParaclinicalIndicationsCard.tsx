import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, FlaskConical, Link2, Lock, Plus, X } from 'lucide-react';
import { ParaclinicalTest } from '../../types';
import {
  formatClinicalContextSummary,
  getParaclinicalRecommendations,
} from '../../utils/clinicalRecommendations';
import { ClinicalContextInput } from '../../utils/clinicalContext';
import {
  getIndicationsByCategory,
  STANDARD_INDICATION_CATEGORIES,
  StandardParaclinicalIndication,
} from '../../utils/standardParaclinicalIndications';

interface ParaclinicalIndicationsCardProps {
  tests: ParaclinicalTest[];
  clinicalContext: ClinicalContextInput;
  isEditing: boolean;
  onToggle: (id: string) => void;
  onAdd: (test: ParaclinicalTest) => void;
}

const ParaclinicalIndicationsCard: React.FC<ParaclinicalIndicationsCardProps> = ({
  tests,
  clinicalContext,
  isEditing,
  onToggle,
  onAdd,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>(STANDARD_INDICATION_CATEGORIES[0]);
  const [customName, setCustomName] = useState('');

  useEffect(() => {
    if (!isEditing) {
      setPickerOpen(false);
    }
  }, [isEditing]);

  const recommendations = useMemo(
    () => getParaclinicalRecommendations(clinicalContext),
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

  const contextSummary = useMemo(
    () => formatClinicalContextSummary(clinicalContext),
    [clinicalContext],
  );

  const existingNames = useMemo(
    () => new Set(tests.map((test) => test.name.toLowerCase())),
    [tests],
  );

  const categoryIndications = useMemo(() => {
    const items = getIndicationsByCategory(activeCategory);
    return [...items].sort((a, b) => {
      const aRecommended = recommendedIds.has(a.id) ? 0 : 1;
      const bRecommended = recommendedIds.has(b.id) ? 0 : 1;
      return aRecommended - bRecommended;
    });
  }, [activeCategory, recommendedIds]);

  const handleAddStandard = (indication: StandardParaclinicalIndication, priority?: boolean) => {
    if (existingNames.has(indication.name.toLowerCase())) {
      const existing = tests.find(
        (test) => test.name.toLowerCase() === indication.name.toLowerCase(),
      );
      if (existing && !existing.checked) {
        onToggle(existing.id);
      }
      return;
    }

    onAdd({
      id: `custom-${indication.id}-${Date.now()}`,
      name: indication.name,
      checked: true,
      priority,
    });
  };

  const handleAddCustom = () => {
    const trimmed = customName.trim();
    if (!trimmed || existingNames.has(trimmed.toLowerCase())) {
      return;
    }

    onAdd({
      id: `custom-${Date.now()}`,
      name: trimmed,
      checked: true,
    });
    setCustomName('');
    setPickerOpen(false);
  };

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#c3c6d6]/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#e8f0fe]">
          <FlaskConical size={16} className="text-[#003d9b]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-[#191c1e]">Chỉ định Cận lâm sàng</h3>
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
      </div>

      <div className="p-5 space-y-3">
        {tests.map((test) => (
          <label
            key={test.id}
            className={`flex items-center gap-3 p-3 rounded-xl border border-[#c3c6d6]/40 transition-colors ${
              isEditing ? 'hover:bg-[#f8f9fb]/60 cursor-pointer' : 'bg-[#f8f9fb]/30 cursor-default'
            }`}
          >
            <input
              type="checkbox"
              checked={test.checked}
              disabled={!isEditing}
              onChange={() => onToggle(test.id)}
              className="h-4 w-4 rounded border-[#c3c6d6] text-[#003d9b] focus:ring-[#003d9b]/20 disabled:opacity-60"
            />
            <span className="text-sm text-[#434654] flex-1">{test.name}</span>
            {test.priority && test.checked && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                Ưu tiên
              </span>
            )}
          </label>
        ))}

        {isEditing && (
          <div className="relative pt-1">
            <button
              type="button"
              onClick={() => setPickerOpen((open) => !open)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline"
            >
              <Plus size={16} />
              Thêm chỉ định mới
              <ChevronDown
                size={14}
                className={`transition-transform ${pickerOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {pickerOpen && (
            <div className="mt-3 rounded-xl border border-[#c3c6d6]/60 bg-[#f8f9fb]/50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#c3c6d6]/40 bg-white">
                <div>
                  <p className="text-sm font-semibold text-[#191c1e]">Chỉ định theo khám lâm sàng</p>
                  <p className="text-xs text-[#737685] mt-0.5">
                    Gợi ý theo ICD-10, triệu chứng và hướng dẫn WHO/BYT
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

              {recommendations.recommended.length > 0 ? (
                <div className="px-4 py-3 border-b border-[#c3c6d6]/30 bg-gradient-to-br from-[#e8f0fe]/60 to-white">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#003d9b] mb-2">
                    Đề xuất theo chẩn đoán & triệu chứng
                  </p>
                  <div className="space-y-2 max-h-44 overflow-y-auto">
                    {recommendations.recommended.slice(0, 6).map((entry) => {
                      const alreadyAdded = existingNames.has(entry.item.name.toLowerCase());
                      return (
                        <button
                          key={`rec-${entry.item.id}`}
                          type="button"
                          onClick={() => handleAddStandard(entry.item, entry.priority <= 2)}
                          disabled={alreadyAdded}
                          className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                            alreadyAdded
                              ? 'border-[#c3c6d6]/40 bg-[#f8f9fb]/60 opacity-60 cursor-not-allowed'
                              : 'border-[#003d9b]/15 bg-white hover:border-[#003d9b]/30 hover:bg-[#e8f0fe]/30'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#003d9b] text-white">
                              {entry.item.code}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#191c1e]">{entry.item.name}</p>
                              <p className="text-[11px] text-[#737685] mt-0.5 line-clamp-2">
                                {entry.rationale}
                              </p>
                            </div>
                            {!alreadyAdded && <Plus size={14} className="text-[#003d9b] shrink-0 mt-0.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3 border-b border-[#c3c6d6]/30 bg-amber-50/50 text-xs text-amber-800">
                  Nhập triệu chứng và chẩn đoán sơ bộ (mã ICD-10) ở phần Khám lâm sàng để nhận gợi ý chính xác.
                </div>
              )}

              <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-[#c3c6d6]/30 bg-white">
                {STANDARD_INDICATION_CATEGORIES.map((category) => (
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

              <div className="max-h-52 overflow-y-auto divide-y divide-[#c3c6d6]/20 bg-white">
                {categoryIndications.map((indication) => {
                  const alreadyAdded = existingNames.has(indication.name.toLowerCase());
                  const isRecommended = recommendedIds.has(indication.id);
                  const rec = recommendationMap.get(indication.id);
                  return (
                    <button
                      key={indication.id}
                      type="button"
                      onClick={() => handleAddStandard(indication, rec?.priority ? rec.priority <= 2 : false)}
                      disabled={alreadyAdded}
                      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                        alreadyAdded
                          ? 'opacity-50 cursor-not-allowed bg-[#f8f9fb]/40'
                          : isRecommended
                            ? 'bg-[#e8f0fe]/25 hover:bg-[#e8f0fe]/50'
                            : 'hover:bg-[#e8f0fe]/40'
                      }`}
                    >
                      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-[#e8f0fe] text-[#003d9b]">
                        {indication.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-[#434654]">{indication.name}</span>
                          {isRecommended && (
                            <span className="text-[10px] font-semibold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Phù hợp
                            </span>
                          )}
                        </div>
                        {rec && (
                          <p className="text-[11px] text-[#737685] mt-0.5 line-clamp-1">{rec.rationale}</p>
                        )}
                      </div>
                      {alreadyAdded ? (
                        <span className="text-xs text-[#737685] shrink-0">Đã có</span>
                      ) : (
                        <Plus size={14} className="text-[#003d9b] shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-3 border-t border-[#c3c6d6]/30 bg-white">
                <p className="text-xs font-medium text-[#737685] mb-2">Hoặc nhập chỉ định tùy chỉnh</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
                    placeholder="Ví dụ: Xét nghiệm CRP, định lượng Ferritin..."
                    className="flex-1 px-3 py-2 text-sm border border-[#c3c6d6]/60 rounded-lg outline-none focus:border-[#003d9b] focus:ring-2 focus:ring-[#003d9b]/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustom}
                    disabled={!customName.trim()}
                    className="px-3 py-2 text-sm font-medium text-white bg-[#003d9b] rounded-lg hover:bg-[#002d75] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ParaclinicalIndicationsCard;
