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
  upcoming: { label: 'Đã xác nhận', className: 'bg-blue-50 text-[#2563eb] ring-1 ring-[#2563eb]/10' },
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
    <div className="bg-white border border-slate-200/70 rounded-[20px] shadow-soft overflow-hidden">
      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Lịch hẹn hôm nay</h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {appointments.length} ca chưa khám · đồng bộ thời khóa biểu
            </p>
          </div>
          <Link
            to={DOCTOR_PATHS.schedule}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2563eb] hover:gap-1.5 transition-all shrink-0"
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
        <p className="px-5 py-8 text-sm text-slate-500">Đã hoàn thành tất cả lịch hẹn hôm nay.</p>
      ) : (
        <>
          <div className="divide-y divide-slate-100">
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
                  className={`relative px-5 sm:px-6 py-4 transition-colors hover:bg-slate-50 ${
                    appt.isNext ? 'bg-blue-50/40' : ''
                  }`}
                >
                  {appt.isNext && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#2563eb] rounded-r" />
                  )}

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="shrink-0 text-center w-14">
                        <p className="text-sm font-bold text-[#2563eb]">{appt.time}</p>
                        <Clock3 size={12} className="mx-auto mt-1 text-slate-300" />
                      </div>

                      <Avatar name={appt.patientName} size="sm" className="mt-0.5" />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {recordId ? (
                            <Link
                              to={DOCTOR_PATHS.record(recordId)}
                              className="text-sm font-semibold text-slate-900 hover:text-[#2563eb] hover:underline"
                            >
                              {appt.patientName}
                            </Link>
                          ) : (
                            <span className="text-sm font-semibold text-slate-900">{appt.patientName}</span>
                          )}
                          {appt.isNext && (
                            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#2563eb] text-white">
                              Tiếp theo
                            </span>
                          )}
                        </div>
                        {appt.patientCode && (
                          <p className="text-xs text-slate-500 mt-0.5">{appt.patientCode}</p>
                        )}
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{appt.reason}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {typeStyle && (
                            <span
                              className={`inline-flex text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${typeStyle.className}`}
                            >
                              {typeStyle.label}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500">{appt.department}</span>
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wide hover:bg-[#1d4ed8] transition-colors"
                        >
                          <Stethoscope size={12} />
                          Khám
                        </Link>
                      ) : (
                        <Link
                          to={DOCTOR_PATHS.schedule}
                          className="text-xs font-medium text-[#2563eb] hover:underline"
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
