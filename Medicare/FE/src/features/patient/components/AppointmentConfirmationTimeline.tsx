import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { AppointmentConfirmationStatus } from '../types';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  state: 'completed' | 'current' | 'upcoming';
}

interface AppointmentConfirmationTimelineProps {
  status: AppointmentConfirmationStatus;
}

const getTimelineSteps = (status: AppointmentConfirmationStatus): TimelineStep[] => {
  const depositDone = true;
  const receptionDone =
    status === 'pending_doctor_confirm' || status === 'confirmed';
  const doctorDone = status === 'confirmed';

  return [
    {
      id: 'deposit',
      title: 'Đặt cọc online',
      description: 'Bạn đã thanh toán tiền cọc giữ lịch',
      state: depositDone ? 'completed' : 'current',
    },
    {
      id: 'reception',
      title: 'Lễ tân xác nhận cọc',
      description: receptionDone
        ? 'Lễ tân đã xác nhận khoản cọc'
        : 'Đang chờ lễ tân kiểm tra và xác nhận cọc',
      state: receptionDone ? 'completed' : depositDone ? 'current' : 'upcoming',
    },
    {
      id: 'doctor',
      title: 'Bác sĩ xác nhận lịch',
      description: doctorDone
        ? 'Bác sĩ đã xác nhận lịch hẹn'
        : receptionDone
          ? 'Đang chờ bác sĩ xác nhận lịch khám'
          : 'Sẽ xác nhận sau khi lễ tân duyệt cọc',
      state: doctorDone ? 'completed' : receptionDone ? 'current' : 'upcoming',
    },
  ];
};

const AppointmentConfirmationTimeline: React.FC<AppointmentConfirmationTimelineProps> = ({
  status,
}) => {
  const steps = getTimelineSteps(status);

  return (
    <div className="bg-white border border-[#c3c6d6] rounded-lg shadow-sm overflow-hidden">
      <div className="border-b border-[#c3c6d6] px-6 py-4">
        <h3 className="text-lg font-medium text-[#191c1e]">Trạng thái xác nhận lịch</h3>
      </div>
      <div className="p-6 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const Icon =
            step.state === 'completed'
              ? CheckCircle2
              : step.state === 'current'
                ? Clock
                : Circle;

          return (
            <div key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <Icon
                  size={22}
                  className={
                    step.state === 'completed'
                      ? 'text-[#006c47]'
                      : step.state === 'current'
                        ? 'text-[#003d9b]'
                        : 'text-[#c3c6d6]'
                  }
                />
                {!isLast && (
                  <div
                    className={`w-0.5 flex-1 min-h-[32px] my-1 ${
                      step.state === 'completed' ? 'bg-[#006c47]' : 'bg-[#e7e8ea]'
                    }`}
                  />
                )}
              </div>
              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`text-base font-medium ${
                    step.state === 'upcoming' ? 'text-[#737685]' : 'text-[#191c1e]'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-sm text-[#434654] mt-0.5">{step.description}</p>
                {step.state === 'current' && (
                  <span className="inline-block mt-2 text-xs font-medium text-[#003d9b] bg-[#003d9b]/10 px-2 py-1 rounded">
                    Đang xử lý
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentConfirmationTimeline;
