import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import {
  DailyStatsCard,
  DoctorScheduleFilters,
  DoctorScheduleHeader,
  ScheduleAlertCard,
  ScheduleMonthView,
  ScheduleWeekView,
  TodayAppointmentsTable,
} from '../../features/doctor/components/schedule';
import {
  getCalendarAppointmentsForMonth,
  getCalendarAppointmentsForWeek,
} from '../../features/doctor/utils/buildScheduleCalendarData';
import {
  buildDoctorScheduleData,
  filterAppointments,
} from '../../features/doctor/utils/buildDoctorScheduleData';
import {
  formatMonthLabel,
  formatWeekRangeLabel,
  getScheduleProgress,
} from '../../features/doctor/utils/scheduleUtils';
import {
  ScheduleTimeFilter,
  ScheduleViewMode,
  TodayAppointmentStatus,
} from '../../features/doctor/types';

export const DoctorSchedulePage: React.FC = () => {
  const scheduleData = useMemo(() => buildDoctorScheduleData(), []);
  const progress = useMemo(
    () => getScheduleProgress(scheduleData.appointments),
    [scheduleData.appointments],
  );

  const [viewMode, setViewMode] = useState<ScheduleViewMode>('list');
  const [statusFilter, setStatusFilter] = useState<TodayAppointmentStatus | 'all'>('all');
  const [timeFilter, setTimeFilter] = useState<ScheduleTimeFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [referenceDate, setReferenceDate] = useState(() => new Date());

  const filteredAppointments = useMemo(
    () => filterAppointments(scheduleData.appointments, statusFilter, timeFilter),
    [scheduleData.appointments, statusFilter, timeFilter],
  );

  const weekAppointments = useMemo(
    () => getCalendarAppointmentsForWeek(referenceDate, statusFilter, timeFilter),
    [referenceDate, statusFilter, timeFilter],
  );

  const monthAppointments = useMemo(
    () =>
      getCalendarAppointmentsForMonth(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        statusFilter,
        timeFilter,
      ),
    [referenceDate, statusFilter, timeFilter],
  );

  const headerDateLabel = useMemo(() => {
    if (viewMode === 'week') return `Tuần ${formatWeekRangeLabel(referenceDate)}`;
    if (viewMode === 'month') return formatMonthLabel(referenceDate);
    return scheduleData.dateLabel;
  }, [viewMode, referenceDate, scheduleData.dateLabel]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, timeFilter, filteredAppointments.length, viewMode]);

  const handleRefresh = () => {
    setStatusFilter('all');
    setTimeFilter('all');
    setCurrentPage(1);
    setReferenceDate(new Date());
    setViewMode('list');
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
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center hover:bg-emerald-600 transition-colors"
        aria-label="Nhắn tin"
      >
        <MessageCircle size={24} />
      </Link>
    </div>
  );
};

export default DoctorSchedulePage;
