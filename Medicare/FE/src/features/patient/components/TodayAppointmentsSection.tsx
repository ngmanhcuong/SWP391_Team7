import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Stethoscope } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { TodayAppointment } from '../types';

interface TodayAppointmentsSectionProps {
  appointment: TodayAppointment | null;
}

const statusConfig: Record<TodayAppointment['status'], { label: string; className: string }> = {
  arrived: { label: 'Đã check-in', className: 'bg-green-50 text-green-700 border-green-100' },
  waiting: { label: 'Chờ khám', className: 'bg-amber-50 text-amber-700 border-amber-100' },
  completed: { label: 'Đã khám xong', className: 'bg-green-50 text-green-700 border-green-100' },
  cancelled: { label: 'Đã hủy', className: 'bg-red-50 text-red-600 border-red-100' },
};

const formatToday = (): string =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

const TodayAppointmentsSection: React.FC<TodayAppointmentsSectionProps> = ({ appointment }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Lịch khám của bạn hôm nay</h2>
        <p className="text-sm text-gray-500 mt-0.5 capitalize">{formatToday()}</p>
      </div>
      <Link to="/patient/lich-hen" className="text-sm font-medium text-[#1a56db] hover:underline">
        Xem tất cả
      </Link>
    </div>

    {!appointment ? (
      <div className="px-5 py-10 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 flex items-center justify-center">
          <Calendar size={22} className="text-[#1a56db]" />
        </div>
        <p className="text-base font-medium text-gray-900">Hôm nay bạn chưa có lịch khám</p>
        <p className="text-sm text-gray-500 mt-1 mb-4">Đặt lịch khi bạn cần gặp bác sĩ.</p>
        <Link to="/patient/lich-hen">
          <Button leftIcon={<Calendar size={16} />}>Đặt lịch khám</Button>
        </Link>
      </div>
    ) : (
      <div className="p-5">
        <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1a56db] text-white flex flex-col items-center justify-center shrink-0">
              <Clock size={16} />
              <span className="text-xs font-semibold mt-0.5">{appointment.time}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-gray-900">{appointment.description}</p>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[#1a56db] shrink-0" />
                {appointment.doctorName}
              </p>
              <span
                className={`inline-flex mt-3 text-xs font-medium px-2.5 py-1 rounded-full border ${statusConfig[appointment.status].className}`}
              >
                {statusConfig[appointment.status].label}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 mt-3 text-center">
          Đây là lịch khám cá nhân của bạn trong ngày hôm nay.
        </p>
      </div>
    )}
  </div>
);

export default TodayAppointmentsSection;
