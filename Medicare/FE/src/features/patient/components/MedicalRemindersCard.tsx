import React from 'react';
import { Link } from 'react-router-dom';
import { BellRing, CalendarClock, ChevronRight, Pill } from 'lucide-react';
import { Prescription, TodayAppointment } from '../types';

interface MedicalRemindersCardProps {
  prescriptions: Prescription[];
  appointment: TodayAppointment | null;
}

interface ReminderItem {
  id: string;
  title: string;
  detail: string;
  icon: React.ElementType;
  tone: { bg: string; color: string; chip: string };
  chip: string;
}

const TONES = {
  blue: { bg: 'bg-blue-50 ring-1 ring-blue-100', color: 'text-[#2563eb]', chip: 'bg-blue-50 text-[#2563eb]' },
  cyan: { bg: 'bg-cyan-50 ring-1 ring-cyan-100', color: 'text-cyan-600', chip: 'bg-cyan-50 text-cyan-600' },
  amber: { bg: 'bg-amber-50 ring-1 ring-amber-100', color: 'text-amber-600', chip: 'bg-amber-50 text-amber-600' },
};

const MedicalRemindersCard: React.FC<MedicalRemindersCardProps> = ({ prescriptions, appointment }) => {
  const reminders: ReminderItem[] = [];

  if (appointment) {
    reminders.push({
      id: 'appt',
      title: appointment.description,
      detail: `${appointment.doctorName} · ${appointment.time}`,
      icon: CalendarClock,
      tone: TONES.blue,
      chip: 'Hôm nay',
    });
  }

  prescriptions.slice(0, 2).forEach((rx, index) => {
    reminders.push({
      id: rx.id,
      title: `Uống thuốc ${rx.name}`,
      detail: rx.dosage,
      icon: Pill,
      tone: index === 0 ? TONES.cyan : TONES.amber,
      chip: index === 0 ? 'Sáng' : 'Tối',
    });
  });

  return (
    <div className="bg-white border border-slate-200/70 rounded-[24px] shadow-soft p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 ring-1 ring-rose-100">
            <BellRing size={18} className="text-rose-500" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-900">Nhắc nhở y tế</h2>
            <p className="text-xs text-slate-500 mt-0.5">Lịch uống thuốc &amp; tái khám</p>
          </div>
        </div>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-slate-500 py-4 text-center">Hiện chưa có nhắc nhở nào.</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {reminders.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 px-3.5 py-3 hover:border-[#2563eb]/25 hover:bg-white transition-all"
              >
                <span className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${item.tone.bg}`}>
                  <Icon size={17} className={item.tone.color} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                  <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.tone.chip}`}>
                  {item.chip}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <Link
        to="/patient/lich-hen"
        className="inline-flex items-center justify-center gap-1 text-[13px] font-semibold text-[#2563eb] hover:gap-1.5 transition-all"
      >
        Quản lý nhắc nhở
        <ChevronRight size={15} />
      </Link>
    </div>
  );
};

export default MedicalRemindersCard;
