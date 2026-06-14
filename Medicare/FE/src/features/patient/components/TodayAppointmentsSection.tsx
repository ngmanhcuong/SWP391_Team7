import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Clock, Stethoscope } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { TodayAppointment } from '../types';

interface TodayAppointmentsSectionProps {
  appointment: TodayAppointment | null;
}

const statusConfig: Record<TodayAppointment['status'], { label: string; className: string }> = {
  arrived: { label: 'Đã check-in', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
  waiting: { label: 'Chờ khám', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' },
  completed: { label: 'Đã khám xong', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
  cancelled: { label: 'Đã hủy', className: 'bg-rose-50 text-rose-600 ring-1 ring-rose-100' },
};

const formatToday = (): string =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

const TodayAppointmentsSection: React.FC<TodayAppointmentsSectionProps> = ({ appointment }) => (
  <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-[#c3c6d6]/40 bg-gradient-to-r from-[#f8f9fb] to-white">
      <div>
        <h2 className="text-lg font-semibold text-[#191c1e]">Lịch khám hôm nay</h2>
        <p className="text-sm text-[#737685] mt-0.5 capitalize">{formatToday()}</p>
      </div>
      <Link
        to="/patient/lich-hen"
        className="inline-flex items-center gap-1 text-sm font-medium text-[#003d9b] hover:underline"
      >
        Xem tất cả
        <ChevronRight size={16} />
      </Link>
    </div>

    {!appointment ? (
      <div className="px-6 py-12 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#003d9b]/10 to-[#1a56db]/5 flex items-center justify-center ring-1 ring-[#003d9b]/10">
          <Calendar size={24} className="text-[#003d9b]" />
        </div>
        <p className="text-base font-semibold text-[#191c1e]">Hôm nay bạn chưa có lịch khám</p>
        <p className="text-sm text-[#737685] mt-1 mb-5">Đặt lịch khi bạn cần gặp bác sĩ.</p>
        <Link to="/patient/lich-hen">
          <Button leftIcon={<Calendar size={16} />}>Đặt lịch khám</Button>
        </Link>
      </div>
    ) : (
      <div className="p-6">
        <div className="relative overflow-hidden rounded-2xl border border-[#003d9b]/15 bg-gradient-to-br from-[#003d9b]/5 via-white to-[#82f9be]/5 p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#003d9b]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003d9b] to-[#1a56db] text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-[#003d9b]/25">
              <Clock size={16} />
              <span className="text-xs font-bold mt-0.5">{appointment.time}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-[#191c1e]">{appointment.description}</p>
              <p className="text-sm text-[#434654] mt-1.5 flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[#003d9b] shrink-0" />
                {appointment.doctorName}
              </p>
              <span
                className={`inline-flex mt-3 text-xs font-semibold px-3 py-1 rounded-full ${statusConfig[appointment.status].className}`}
              >
                {statusConfig[appointment.status].label}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default TodayAppointmentsSection;
