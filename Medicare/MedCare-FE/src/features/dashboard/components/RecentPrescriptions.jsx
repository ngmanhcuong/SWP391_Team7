import { Pill } from 'lucide-react';

const RecentPrescriptions = ({ prescriptions = [] }) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Đơn thuốc gần đây
        </h3>
        <Pill className="h-4 w-4 text-blue-600" />
      </div>

      <div className="space-y-3">
        {prescriptions.map((item) => (
          <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
            <p className="text-sm font-semibold text-blue-700">{item.name}</p>
            <p className="text-sm text-gray-500">{item.dosage}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecentPrescriptions;
