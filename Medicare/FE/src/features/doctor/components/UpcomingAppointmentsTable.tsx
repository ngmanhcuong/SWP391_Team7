import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock3, Stethoscope } from 'lucide-react';
import { Avatar } from '../../../components/ui';
import { DOCTOR_PATHS } from '../utils/doctorPaths';
import {
  APPOINTMENT_STATUS_CONFIG,
  APPOINTMENT_TYPE_CONFIG,
} from '../utils/scheduleUtils';
import { AppointmentStatus, UpcomingAppointment } from '../types';
import ScheduleListPagination from './schedule/ScheduleListPagination';
import ScheduleProgressBar from './schedule/ScheduleProgressBar';

const DASHBOARD_PAGE_SIZE = 5;

interface UpcomingAppointmentsTableProps {
  appointments: UpcomingAppointment[];
  progress?: {
    completed: number;
    total: number;
    pending: number;
  };
}

const dashboardStatusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  arrived: { label: 'Đã khám', className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' },
  waiting: { label: 'Chờ khám', className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100' },
  upcoming: { label: 'Đã xác nhận', className: 'bg-[#e8f0fe] text-[#003d9b] ring-1 ring-[#003d9b]/10' },
};

const UpcomingAppointmentsTable: React.FC<UpcomingAppointmentsTableProps> = ({
  appointments,
  progress,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(appointments.length / DASHBOARD_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  useEffect(() => {
    setCurrentPage(1);
  }, [appointments.length]);

  const paginatedAppointments = useMemo(() => {
    const start = (safePage - 1) * DASHBOARD_PAGE_SIZE;
    return appointments.slice(start, start + DASHBOARD_PAGE_SIZE);
  }, [appointments, safePage]);

  return (
    <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-[#c3c6d6]/40 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#191c1e]">Lịch hẹn hôm nay</h2>
            <p className="text-[11px] text-[#737685] mt-0.5">
              {appointments.length} ca chưa khám · đồng bộ thời khóa biểu
            </p>
          </div>
          <Link
            to={DOCTOR_PATHS.schedule}
            className="inline-flex items-center gap-1 text-sm font-medium text-[#003d9b] hover:underline shrink-0"
          >
            Thời khóa biểu
            <ArrowRight size={14} />
          </Link>
        </div>
        {progress && (
          <ScheduleProgressBar
            completed={progress.completed}
            total={progress.total}
            pending={progress.pending}
            compact
          />
        )}
      </div>

      {appointments.length === 0 ? (
        <p className="px-5 py-8 text-sm text-[#737685]">Đã hoàn thành tất cả lịch hẹn hôm nay.</p>
      ) : (
        <>
          <div className="divide-y divide-[#c3c6d6]/25">
            {paginatedAppointments.map((appt) => {
              const recordId = appt.patientId;
              const statusStyle = dashboardStatusConfig[appt.status];
              const scheduleStatusStyle = appt.scheduleStatus
                ? APPOINTMENT_STATUS_CONFIG[appt.scheduleStatus]
                : null;
              const typeStyle = appt.type ? APPOINTMENT_TYPE_CONFIG[appt.type] : null;

              return (
                <div
                  key={appt.id}
                  className={`relative px-5 sm:px-6 py-4 transition-colors hover:bg-[#f8f9fb]/60 ${
                    appt.isNext ? 'bg-[#e8f0fe]/25' : ''
                  }`}
                >
                  {appt.isNext && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#003d9b] rounded-r" />
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="shrink-0 text-center w-14">
                        <p className="text-sm font-bold text-[#003d9b]">{appt.time}</p>
                        <Clock3 size={12} className="mx-auto mt-1 text-[#c3c6d6]" />
                      </div>

                      <Avatar name={appt.patientName} size="sm" className="mt-0.5" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {recordId ? (
                            <Link
                              to={DOCTOR_PATHS.record(recordId)}
                              className="text-sm font-semibold text-[#191c1e] hover:text-[#003d9b] hover:underline"
                            >
                              {appt.patientName}
                            </Link>
                          ) : (
                            <span className="text-sm font-semibold text-[#191c1e]">{appt.patientName}</span>
                          )}
                          {appt.isNext && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#003d9b] text-white">
                              Tiếp theo
                            </span>
                          )}
                        </div>
                        {appt.patientCode && (
                          <p className="text-xs text-[#737685] mt-0.5">{appt.patientCode}</p>
                        )}
                        <p className="text-xs text-[#434654] mt-1 line-clamp-2">{appt.reason}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {typeStyle && (
                            <span
                              className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeStyle.className}`}
                            >
                              {typeStyle.label}
                            </span>
                          )}
                          <span className="text-[11px] text-[#737685]">{appt.department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-2 pl-[68px] sm:pl-0">
                      <span
                        className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle.className}`}
                      >
                        {scheduleStatusStyle?.label ?? statusStyle.label}
                      </span>
                      {recordId ? (
                        <Link
                          to={DOCTOR_PATHS.record(recordId)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#003d9b] text-white text-[10px] font-bold uppercase tracking-wide hover:bg-[#002d75] transition-colors"
                        >
                          <Stethoscope size={12} />
                          Khám
                        </Link>
                      ) : (
                        <Link
                          to={DOCTOR_PATHS.schedule}
                          className="text-xs font-medium text-[#003d9b] hover:underline"
                        >
                          Chi tiết
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <ScheduleListPagination
            currentPage={safePage}
            totalPages={totalPages}
            totalCount={appointments.length}
            pageSize={DASHBOARD_PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default UpcomingAppointmentsTable;
