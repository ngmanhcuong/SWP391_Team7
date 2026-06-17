import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Stethoscope } from 'lucide-react';
import { Avatar } from '../../../../components/ui';
import { DOCTOR_PATHS } from '../../utils/doctorPaths';
import {
  APPOINTMENT_STATUS_CONFIG,
  APPOINTMENT_TYPE_CONFIG,
  groupAppointmentsByTimeSlot,
} from '../../utils/scheduleUtils';
import { ScheduleTimeFilter, TodayAppointment } from '../../types';
import ScheduleListPagination from './ScheduleListPagination';

export const SCHEDULE_PAGE_SIZE = 5;

interface TodayAppointmentsTableProps {
  appointments: TodayAppointment[];
  timeFilter?: ScheduleTimeFilter;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const AppointmentRow: React.FC<{ appointment: TodayAppointment }> = ({ appointment: appt }) => {
  const typeStyle = APPOINTMENT_TYPE_CONFIG[appt.type];
  const statusStyle = APPOINTMENT_STATUS_CONFIG[appt.status];
  const isCancelled = appt.status === 'cancelled';
  const isCompleted = appt.status === 'completed';

  return (
    <tr
      className={`border-b border-[#c3c6d6]/20 last:border-0 transition-colors ${
        isCancelled ? 'opacity-55 bg-gray-50/40' : 'hover:bg-[#f8f9fb]/60'
      } ${isCompleted ? 'bg-emerald-50/20' : ''}`}
    >
      <td className="px-5 py-4 align-top">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full shrink-0 ${statusStyle.dotClassName}`} />
          <span className="text-sm font-bold text-[#003d9b] tabular-nums">{appt.time}</span>
        </div>
      </td>
      <td className="px-4 py-4 align-top">
        <div className="flex items-start gap-3 min-w-[220px]">
          <Avatar name={appt.patientName} size="sm" />
          <div className="min-w-0">
            {appt.patientId ? (
              <Link
                to={DOCTOR_PATHS.record(appt.patientId)}
                className="text-sm font-semibold text-[#191c1e] hover:text-[#003d9b] hover:underline"
              >
                {appt.patientName}
              </Link>
            ) : (
              <p className="text-sm font-semibold text-[#191c1e]">{appt.patientName}</p>
            )}
            {appt.patientNote && (
              <p className="text-xs text-[#737685] mt-1 line-clamp-2">{appt.patientNote}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-4 align-top text-sm text-[#434654]">{appt.department}</td>
      <td className="px-4 py-4 align-top">
        <span
          className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${typeStyle.className}`}
        >
          {typeStyle.label}
        </span>
      </td>
      <td className="px-4 py-4 align-top">
        <span
          className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.className}`}
        >
          {statusStyle.label}
        </span>
      </td>
      <td className="px-4 py-4 align-top">
        {appt.patientId && !isCancelled ? (
          <div className="flex items-center gap-2">
            <Link
              to={DOCTOR_PATHS.record(appt.patientId)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#003d9b] text-white text-xs font-bold uppercase tracking-wide hover:bg-[#002d75] transition-colors"
            >
              <Stethoscope size={14} />
              Khám
            </Link>
            <Link
              to={DOCTOR_PATHS.record(appt.patientId)}
              className="p-1.5 rounded-lg text-[#737685] hover:bg-gray-100 hover:text-[#003d9b] transition-colors"
              aria-label={`Xem hồ sơ ${appt.patientName}`}
            >
              <FileText size={16} />
            </Link>
          </div>
        ) : (
          <span className="text-xs text-[#737685]">—</span>
        )}
      </td>
    </tr>
  );
};

const TableHeader: React.FC = () => (
  <thead>
    <tr className="border-b border-[#c3c6d6]/30 bg-[#f8f9fb]/80">
      <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-5 py-3 w-[100px]">
        Giờ hẹn
      </th>
      <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
        Bệnh nhân
      </th>
      <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
        Chuyên khoa
      </th>
      <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
        Loại hình
      </th>
      <th className="text-left text-[11px] font-semibold uppercase tracking-wider text-[#737685] px-4 py-3">
        Trạng thái
      </th>
      <th className="w-28 px-4 py-3" aria-hidden />
    </tr>
  </thead>
);

const TodayAppointmentsTable: React.FC<TodayAppointmentsTableProps> = ({
  appointments,
  timeFilter = 'all',
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(appointments.length / SCHEDULE_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedAppointments = useMemo(() => {
    const start = (safePage - 1) * SCHEDULE_PAGE_SIZE;
    return appointments.slice(start, start + SCHEDULE_PAGE_SIZE);
  }, [appointments, safePage]);

  const showGrouped = timeFilter === 'all';
  const groups = showGrouped ? groupAppointmentsByTimeSlot(paginatedAppointments) : [];

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40">
        <h2 className="text-base font-semibold text-[#191c1e]">Danh sách lịch hẹn</h2>
        <p className="text-[11px] text-[#737685] mt-0.5">
          {appointments.length} lịch phù hợp bộ lọc · {SCHEDULE_PAGE_SIZE} ca/trang
        </p>
      </div>

      {appointments.length === 0 ? (
        <p className="px-5 py-10 text-center text-sm text-[#737685]">
          Không có lịch hẹn phù hợp với bộ lọc hiện tại.
        </p>
      ) : showGrouped ? (
        <div className="divide-y divide-[#c3c6d6]/30">
          {groups.map((group) => (
            <div key={group.slot}>
              <div className="flex items-center justify-between px-5 sm:px-6 py-3 bg-[#e8f0fe]/30">
                <div>
                  <p className="text-sm font-semibold text-[#003d9b]">{group.label}</p>
                  <p className="text-[11px] text-[#737685]">{group.range}</p>
                </div>
                <span className="text-xs font-medium text-[#737685]">{group.items.length} ca</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[780px]">
                  <TableHeader />
                  <tbody>
                    {group.items.map((appt) => (
                      <AppointmentRow key={appt.id} appointment={appt} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px]">
            <TableHeader />
            <tbody>
              {paginatedAppointments.map((appt) => (
                <AppointmentRow key={appt.id} appointment={appt} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {appointments.length > 0 && (
        <ScheduleListPagination
          currentPage={safePage}
          totalPages={totalPages}
          totalCount={appointments.length}
          pageSize={SCHEDULE_PAGE_SIZE}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default TodayAppointmentsTable;
