import React from 'react';
import { Clock, Lock, MapPin } from 'lucide-react';
import { MedicalRecordExamination } from '../../types';

interface CurrentExaminationCardProps {
  examination: MedicalRecordExamination;
  isEditing: boolean;
  onChange: (field: keyof MedicalRecordExamination, value: string) => void;
}

const editableFieldClassName =
  'w-full px-4 py-2.5 text-sm border border-[#c3c6d6]/60 rounded-xl outline-none transition-all bg-white text-[#191c1e] placeholder:text-[#737685] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 resize-y';

const readOnlyFieldClassName =
  'w-full px-4 py-2.5 text-sm border border-transparent rounded-xl bg-[#f8f9fb] text-[#434654] resize-y cursor-default';

const CurrentExaminationCard: React.FC<CurrentExaminationCardProps> = ({
  examination,
  isEditing,
  onChange,
}) => (
  <div
    className={`bg-white border rounded-2xl shadow-sm shadow-[#2563eb]/5 overflow-hidden transition-colors ${
      isEditing ? 'border-[#c3c6d6]/60' : 'border-[#c3c6d6]/40'
    }`}
  >
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-[#c3c6d6]/40 bg-[#f8f9fb]/40">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-[#191c1e]">Khám lâm sàng hiện tại</h3>
        {!isEditing && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-[#737685] bg-white px-2 py-0.5 rounded-full border border-[#c3c6d6]/50">
            <Lock size={10} />
            Chỉ xem
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm text-[#434654]">
        <span className="inline-flex items-center gap-1.5">
          <Clock size={14} className="text-[#737685]" />
          Bắt đầu {examination.startTime}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={14} className="text-[#737685]" />
          {examination.room}
        </span>
        <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Đang khám
        </span>
      </div>
    </div>

    <div className="p-5 space-y-4">
      <div>
        <label className="text-sm font-medium text-[#191c1e] block mb-1.5">
          Triệu chứng lâm sàng
        </label>
        <textarea
          rows={3}
          readOnly={!isEditing}
          value={examination.clinicalSymptoms}
          onChange={(e) => onChange('clinicalSymptoms', e.target.value)}
          className={isEditing ? editableFieldClassName : readOnlyFieldClassName}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#191c1e] block mb-1.5">
          Chẩn đoán sơ bộ
          <span className="text-xs font-normal text-[#737685] ml-2">(Gợi ý mã ICD-10)</span>
        </label>
        <textarea
          rows={2}
          readOnly={!isEditing}
          value={examination.preliminaryDiagnosis}
          onChange={(e) => onChange('preliminaryDiagnosis', e.target.value)}
          className={isEditing ? editableFieldClassName : readOnlyFieldClassName}
        />
      </div>
      <div>
        <label className="text-sm font-medium text-[#191c1e] block mb-1.5">Ghi chú thêm</label>
        <textarea
          rows={2}
          readOnly={!isEditing}
          value={examination.additionalNotes}
          onChange={(e) => onChange('additionalNotes', e.target.value)}
          className={isEditing ? editableFieldClassName : readOnlyFieldClassName}
        />
      </div>
    </div>
  </div>
);

export default CurrentExaminationCard;
