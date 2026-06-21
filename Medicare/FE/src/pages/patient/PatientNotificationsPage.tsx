import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  FloatingChatButton,
  NotificationsEmptyState,
  NotificationsFilterNav,
  NotificationsGroupList,
  NotificationsPageHeader,
  NotificationsPreferencesPanel,
  NotificationsStatCard,
} from '../../features/patient/components';
import { usePatientNotifications } from '../../features/patient/hooks';
import { NotificationFilter, PatientNotification } from '../../features/patient/types';

const VALID_FILTERS: NotificationFilter[] = [
  'all',
  'unread',
  'appointment',
  'lab',
  'prescription',
  'payment',
  'system',
];

const isNotificationFilter = (value: string | null): value is NotificationFilter =>
  value !== null && VALID_FILTERS.includes(value as NotificationFilter);

const matchesSearch = (query: string, notification: PatientNotification): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [notification.title, notification.description, notification.type]
    .some((value) => value.toLowerCase().includes(normalized));
};

const matchesFilter = (filter: NotificationFilter, notification: PatientNotification): boolean => {
  if (filter === 'all') return true;
  if (filter === 'unread') return notification.isUnread;
  return notification.type === filter;
};

export const PatientNotificationsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, markRead, markAllRead } = usePatientNotifications(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const filterParam = searchParams.get('filter');
  const activeFilter: NotificationFilter = isNotificationFilter(filterParam) ? filterParam : 'all';

  const setActiveFilter = useCallback(
    (filter: NotificationFilter) => {
      setSearchParams(filter === 'all' ? {} : { filter }, { replace: true });
    },
    [setSearchParams],
  );

  const filteredNotifications = useMemo(() => {
    if (!data) return [];
    return data.notifications.filter(
      (item) => matchesFilter(activeFilter, item) && matchesSearch(searchQuery, item),
    );
  }, [data, activeFilter, searchQuery]);

  const filterCounts = useMemo((): Record<NotificationFilter, number> => {
    if (!data) {
      return {
        all: 0,
        unread: 0,
        appointment: 0,
        lab: 0,
        prescription: 0,
        payment: 0,
        system: 0,
      };
    }

    const base = data.notifications.filter((item) => matchesSearch(searchQuery, item));
    return {
      all: base.length,
      unread: base.filter((item) => item.isUnread).length,
      appointment: base.filter((item) => item.type === 'appointment').length,
      lab: base.filter((item) => item.type === 'lab').length,
      prescription: base.filter((item) => item.type === 'prescription').length,
      payment: base.filter((item) => item.type === 'payment').length,
      system: base.filter((item) => item.type === 'system').length,
    };
  }, [data, searchQuery]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem thông báo.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Không thể tải thông báo. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      <NotificationsPageHeader
        unreadCount={data.unreadCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onMarkAllRead={markAllRead}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <NotificationsStatCard
            key={stat.id}
            stat={stat}
            isActive={activeFilter === stat.filter}
            onSelect={setActiveFilter}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-4 sm:p-6 space-y-4 min-w-0">
          <NotificationsFilterNav
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />

          {filteredNotifications.length === 0 ? (
            <NotificationsEmptyState filter={activeFilter} />
          ) : (
            <NotificationsGroupList
              notifications={filteredNotifications}
              onMarkRead={markRead}
            />
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <NotificationsPreferencesPanel />
        </div>
      </div>

      <FloatingChatButton unreadCount={data.unreadCount > 0 ? 1 : 0} />
    </div>
  );
};

export default PatientNotificationsPage;
