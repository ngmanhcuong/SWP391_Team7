import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { doctorApi } from '../../features/doctor/api/doctorApi';
import {
  DailyStatsCard,
  DoctorScheduleFilters,
  DoctorScheduleHeader,
  ScheduleAlertCard,
  ScheduleMonthView,
  ScheduleWeekView,
  TodayAppointmentsTable,
} from '../../features/doctor/components/schedule';
import { filterAppointments } from '../../features/doctor/utils/buildDoctorScheduleData';
import {
  buildScheduleStats,
  buildStatusCounts,
  endOfWeekSunday,
  formatMonthLabel,
  formatVietnameseDate,
  formatWeekRangeLabel,
  getScheduleProgress,
  getWeekDays,
  parseTimeToMinutes,
  startOfWeekMonday,
  toDateKey,
} from '../../features/doctor/utils/scheduleUtils';
import {
  ScheduledAppointment,
  ScheduleTimeFilter,
  ScheduleViewMode,
  TodayAppointmentStatus,
} from '../../features/doctor/types';

export const DoctorSchedulePage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('list');
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [statusFilter, setStatusFilter] = useState<TodayAppointmentStatus | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<ScheduleTimeFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const appointmentQueryParams = useMemo(() => {
    if (viewMode === 'week') {
      const start = startOfWeekMonday(referenceDate);
      const end = endOfWeekSunday(referenceDate);
      return {
        fromDate: toDateKey(start),
        toDate: toDateKey(end),
      };
    }

    if (viewMode === 'month') {
      const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1);
      const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0);
      return {
        fromDate: toDateKey(start),
        toDate: toDateKey(end),
      };
    }

    const today = new Date();
    return {
      fromDate: toDateKey(today),
      toDate: toDateKey(today),
    };
  }, [referenceDate, viewMode]);

  const isTodayRange = useMemo(() => {
    const todayKey = toDateKey(new Date());
    return (
      appointmentQueryParams.fromDate === todayKey &&
      appointmentQueryParams.toDate === todayKey
    );
  }, [appointmentQueryParams.fromDate, appointmentQueryParams.toDate]);

  const { data: scheduleAppointments = [], refetch } = useQuery({
    queryKey: ['doctor', 'appointments', appointmentQueryParams.fromDate, appointmentQueryParams.toDate],
    queryFn: () => doctorApi.getAppointments(appointmentQueryParams),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchInterval: isTodayRange ? 10_000 : 30_000,
    refetchIntervalInBackground: true,
  });

  const scheduleData = useMemo(() => {
    const appointments = [...scheduleAppointments].sort(
      (left, right) => parseTimeToMinutes(left.time) - parseTimeToMinutes(right.time),
    );
    const waiting = appointments.filter((appt) => appt.status === 'waiting');
    const activeWaiting = waiting
      .slice(0, 3)
      .map((appt) => appt.patientName.split(' ').slice(-1)[0]);

    return {
      appointments,
      stats: {
        ...buildScheduleStats(appointments),
        waitingPatientNames: activeWaiting,
      },
      alertNote:
        waiting.length > 0
          ? `Có ${waiting.length} bệnh nhân đang chờ khám. Ưu tiên hoàn tất hồ sơ trước khi gọi bệnh nhân tiếp theo.`
          : 'Không có bệnh nhân chờ khám. Bạn có thể xem lại các ca đã hoàn thành trong ngày.',
      statusCounts: buildStatusCounts(appointments),
    };
  }, [scheduleAppointments]);

  const progress = useMemo(
    () => getScheduleProgress(scheduleData.appointments),
    [scheduleData.appointments],
  );

  const filteredAppointments = useMemo(
    () => filterAppointments(scheduleData.appointments, statusFilter, timeFilter),
    [scheduleData.appointments, statusFilter, timeFilter],
  );

  const matchesFilters = (appt: ScheduledAppointment) =>
    (statusFilter === 'all' ? appt.status !== 'cancelled' : appt.status === statusFilter) &&
    (timeFilter === 'all' || appt.timeSlot === timeFilter);

  const weekAppointments = useMemo(() => {
    const weekKeys = new Set(getWeekDays(referenceDate).map(toDateKey));
    return scheduleAppointments.filter(
      (appt: ScheduledAppointment) => weekKeys.has(appt.date) && matchesFilters(appt),
    );
  }, [referenceDate, scheduleAppointments, statusFilter, timeFilter]);

  const monthAppointments = useMemo(
    () =>
      scheduleAppointments.filter((appt: ScheduledAppointment) => {
        const [year, month] = appt.date.split('-').map(Number);
        return (
          year === referenceDate.getFullYear() &&
          month === referenceDate.getMonth() + 1 &&
          matchesFilters(appt)
        );
      }),
    [referenceDate, scheduleAppointments, statusFilter, timeFilter],
  );

  const headerDateLabel = useMemo(() => {
    if (viewMode === 'week') return `Tuần ${formatWeekRangeLabel(referenceDate)}`;
    if (viewMode === 'month') return formatMonthLabel(referenceDate);
    return formatVietnameseDate(new Date());
  }, [referenceDate, scheduleAppointments.length, viewMode]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, timeFilter, filteredAppointments.length, viewMode]);

  const handleRefresh = () => {
    void refetch();
  };

  const handleWeekChange = (direction: -1 | 1) => {
    setReferenceDate((current) => {
      const next = new Date(current);
      next.setDate(current.getDate() + direction * 7);
      return next;
    });
  };

  const handleMonthChange = (direction: -1 | 1) => {
    setReferenceDate((current) => {
      const next = new Date(current);
      next.setMonth(current.getMonth() + direction);
      return next;
    });
  };

  const handleToday = () => setReferenceDate(new Date());

  const renderMainView = () => {
    if (viewMode === 'week') {
      return (
        <ScheduleWeekView
          referenceDate={referenceDate}
          appointments={weekAppointments}
          onWeekChange={handleWeekChange}
          onToday={handleToday}
        />
      );
    }

    if (viewMode === 'month') {
      return (
        <ScheduleMonthView
          referenceDate={referenceDate}
          appointments={monthAppointments}
          onMonthChange={handleMonthChange}
          onToday={handleToday}
        />
      );
    }

    return (
      <TodayAppointmentsTable
        appointments={filteredAppointments}
        timeFilter={timeFilter}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    );
  };

  return (
    <div className="relative space-y-5 pb-20">
      <DoctorScheduleHeader
        dateLabel={headerDateLabel}
        viewMode={viewMode}
        completed={progress.completed}
        total={progress.total}
        pending={progress.pending}
        cancelledCount={scheduleData.statusCounts.cancelled}
        onViewModeChange={setViewMode}
      />

      <DoctorScheduleFilters
        activeStatus={statusFilter}
        activeTimeSlot={timeFilter}
        statusCounts={scheduleData.statusCounts}
        onStatusChange={setStatusFilter}
        onTimeSlotChange={setTimeFilter}
        onRefresh={handleRefresh}
      />

      <div className="grid gap-5 xl:grid-cols-12 items-start">
        <div className="xl:col-span-8 min-w-0">{renderMainView()}</div>

        <div className="xl:col-span-4 min-w-0 flex flex-col gap-4">
          <DailyStatsCard stats={scheduleData.stats} progress={progress} />
          <ScheduleAlertCard note={scheduleData.alertNote} />
        </div>
      </div>

      <Link
        to="/doctor"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-600"
        aria-label="Nhắn tin"
      >
        <MessageCircle size={24} />
      </Link>
    </div>
  );
};

export default DoctorSchedulePage;
