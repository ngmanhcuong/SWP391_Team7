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
  <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft overflow-hidden">
    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563eb]/10 ring-1 ring-[#2563eb]/15">
          <Calendar size={18} className="text-[#2563eb]" />
        </span>
        <div>
          <h2 className="text-base font-bold text-slate-900">Lịch khám sắp tới</h2>
          <p className="text-[13px] text-slate-500 mt-0.5 capitalize">{formatToday()}</p>
        </div>
      </div>
      <Link
        to="/patient/lich-hen"
        className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2563eb] hover:gap-1.5 transition-all"
      >
        Xem tất cả
        <ChevronRight size={16} />
      </Link>
    </div>

    {!appointment ? (
      <div className="px-6 py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2563eb]/10 to-[#06b6d4]/10 flex items-center justify-center ring-1 ring-[#2563eb]/10">
          <Calendar size={26} className="text-[#2563eb]" />
        </div>
        <p className="text-base font-semibold text-slate-900">Hôm nay bạn chưa có lịch khám</p>
        <p className="text-sm text-slate-500 mt-1 mb-5">Đặt lịch khi bạn cần gặp bác sĩ.</p>
        <Link to="/patient/lich-hen">
          <Button leftIcon={<Calendar size={16} />}>Đặt lịch khám</Button>
        </Link>
      </div>
    ) : (
      <div className="p-6">
        <div className="relative overflow-hidden rounded-[18px] border border-[#2563eb]/15 bg-gradient-to-br from-[#2563eb]/[0.06] via-white to-[#06b6d4]/[0.06] p-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563eb]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#06b6d4] text-white flex flex-col items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              <Clock size={16} />
              <span className="text-xs font-bold mt-0.5">{appointment.time}</span>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-900">{appointment.description}</p>
              <p className="text-sm text-slate-600 mt-1.5 flex items-center gap-1.5">
                <Stethoscope size={14} className="text-[#2563eb] shrink-0" />
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
