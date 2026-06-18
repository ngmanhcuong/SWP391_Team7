import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { MedicalRecordPatient } from '../../types';

interface ImportantWarningCardProps {
  patient: MedicalRecordPatient;
}

const ImportantWarningCard: React.FC<ImportantWarningCardProps> = ({ patient }) => (
  <div className="bg-white border border-rose-200/80 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-rose-50 to-orange-50 border-b border-rose-100">
      <AlertTriangle size={16} className="text-rose-500 shrink-0" />
      <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wide">Cảnh báo quan trọng</h3>
    </div>

    <div className="p-5 space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#737685] mb-2">Dị ứng</p>
        <div className="flex flex-wrap gap-2">
          {patient.allergies.map((allergy) => (
            <span
              key={allergy}
              className="inline-flex text-xs font-bold uppercase px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 ring-1 ring-rose-200"
            >
              {allergy}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-[#737685] mb-2">Tiền sử bệnh</p>
        <ul className="space-y-1.5">
          {patient.medicalHistory.map((item) => (
            <li key={item} className="text-sm text-[#434654] flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#737685] mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default ImportantWarningCard;
