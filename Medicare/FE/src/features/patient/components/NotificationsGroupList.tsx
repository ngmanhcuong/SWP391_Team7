import React, { useMemo } from 'react';
import { PatientNotification } from '../types';
import NotificationItemCard from './NotificationItemCard';

interface NotificationsGroupListProps {
  notifications: PatientNotification[];
  onMarkRead: (id: string) => void;
}

const startOfDay = (date: Date): Date => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

const getGroupLabel = (isoDate: string): string => {
  const date = startOfDay(new Date(isoDate));
  const today = startOfDay(new Date());
  const diffDays = Math.round((today.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));

  if (diffDays <= 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays <= 7) return 'Tuần này';
  return 'Trước đó';
};

const GROUP_ORDER = ['Hôm nay', 'Hôm qua', 'Tuần này', 'Trước đó'];

const NotificationsGroupList: React.FC<NotificationsGroupListProps> = ({
  notifications,
  onMarkRead,
}) => {
  const groups = useMemo(() => {
    const map = new Map<string, PatientNotification[]>();

    notifications.forEach((item) => {
      const label = getGroupLabel(item.createdAt);
      const existing = map.get(label) ?? [];
      map.set(label, [...existing, item]);
    });

    return GROUP_ORDER.filter((label) => map.has(label)).map((label) => ({
      label,
      items: map.get(label) ?? [],
    }));
  }, [notifications]);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <section key={group.label} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#737685]">
            {group.label}
          </h2>
          <div className="space-y-3">
            {group.items.map((notification) => (
              <NotificationItemCard
                key={notification.id}
                notification={notification}
                onMarkRead={onMarkRead}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default NotificationsGroupList;
