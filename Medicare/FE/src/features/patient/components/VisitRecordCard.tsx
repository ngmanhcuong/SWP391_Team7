import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, FlaskConical, Pill, Stethoscope } from 'lucide-react';
import { LabResult, VisitRecord } from '../types';

interface VisitRecordCardProps {
  visit: VisitRecord;
  relatedLabs?: LabResult[];
  onViewLabs?: () => void;
}

const VisitRecordCard: React.FC<VisitRecordCardProps> = ({
  visit,
  relatedLabs = [],
  onViewLabs,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-colors ${
        expanded ? 'border-[#003d9b]/40' : 'border-[#c3c6d6]'
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2 min-w-0 border-l-4 border-[#003d9b] pl-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#003d9b] bg-[#003d9b]/10 px-2.5 py-1 rounded">
                {visit.date}
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded ${
                  visit.status === 'completed'
                    ? 'bg-[#006c47]/10 text-[#006c47]'
                    : 'bg-[#fff8e6] text-[#7a4f01]'
                }`}
              >
                {visit.status === 'completed' ? 'Đã khám' : 'Đang điều trị'}
              </span>
              {relatedLabs.length > 0 && (
                <span className="text-xs font-medium px-2 py-1 rounded bg-[rgba(176,35,0,0.1)] text-[#b02300]">
                  {relatedLabs.length} xét nghiệm
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-[#191c1e]">{visit.diagnosis}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#434654]">
              <span className="inline-flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[#003d9b]" />
                {visit.doctorName} · {visit.specialty}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Building2 size={14} className="text-[#003d9b]" />
                {visit.facility}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#003d9b] hover:underline shrink-0"
          >
            {expanded ? (
              <>
                Thu gọn
                <ChevronUp size={16} />
              </>
            ) : (
              <>
                Xem chi tiết
                <ChevronDown size={16} />
              </>
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-5 pt-5 border-t border-[#c3c6d6] space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-[#737685] mb-1">Triệu chứng</p>
              <p className="text-sm text-[#191c1e]">{visit.symptoms}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-[#737685] mb-1">Hướng điều trị</p>
              <p className="text-sm text-[#191c1e]">{visit.treatment}</p>
            </div>
            {visit.prescriptions.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-[#737685] mb-2 flex items-center gap-1.5">
                  <Pill size={12} />
                  Đơn thuốc kê
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {visit.prescriptions.map((rx) => (
                    <div
                      key={rx.id}
                      className="rounded-lg border border-[#c3c6d6] bg-[#f8f9fb] px-3 py-2.5"
                    >
                      <p className="text-sm font-medium text-[#003d9b]">{rx.name}</p>
                      <p className="text-xs text-[#434654] mt-0.5">{rx.dosage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {relatedLabs.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-xs uppercase tracking-wide text-[#737685] flex items-center gap-1.5">
                    <FlaskConical size={12} />
                    Kết quả xét nghiệm liên quan
                  </p>
                  {onViewLabs && (
                    <button
                      type="button"
                      onClick={onViewLabs}
                      className="text-xs font-medium text-[#003d9b] hover:underline"
                    >
                      Xem tất cả
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {relatedLabs.map((lab) => (
                    <div
                      key={lab.id}
                      className="rounded-lg border border-[#c3c6d6] bg-white px-3 py-2.5 text-sm text-[#434654]"
                    >
                      <span className="font-medium text-[#191c1e]">{lab.name}</span>
                      <span className="mx-2">·</span>
                      {lab.summary}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default VisitRecordCard;
