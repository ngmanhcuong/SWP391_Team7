import { ClipboardList } from 'lucide-react';

const ExaminationStatus = ({ steps = [] }) => {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900" style={{ fontFamily: 'Lexend' }}>
          Trạng thái khám
        </h3>
        <ClipboardList className="h-4 w-4 text-blue-600" />
      </div>

      <div className="relative space-y-6 pl-6">
        <div className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-gray-200" />
        {steps.map((step) => (
          <div key={step.id} className={`relative ${step.active ? '' : 'opacity-50'}`}>
            <span
              className={`absolute -left-6 top-1 h-3 w-3 rounded-full ${
                step.active ? 'bg-[#1a56db] ring-4 ring-blue-100' : 'bg-gray-300'
              }`}
            />
            <p className="text-sm font-semibold text-gray-900">{step.title}</p>
            <p className="text-sm text-gray-500">{step.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ExaminationStatus;
