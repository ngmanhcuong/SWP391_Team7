import { useCallback, useMemo, useState } from 'react';
import { DoctorNotification } from '../types';
import { buildDoctorNotificationsData } from '../utils/buildDoctorNotificationsData';
import {
  getDoctorReadNotificationIds,
  markAllDoctorNotificationsRead,
  markDoctorNotificationRead,
} from '../utils/doctorNotificationStore';

export const useDoctorNotifications = () => {
  const [readVersion, setReadVersion] = useState(0);

  const notifications = useMemo(() => {
    void readVersion;
    const readIds = getDoctorReadNotificationIds();
    return buildDoctorNotificationsData().map((notif) => ({
      ...notif,
      isUnread: !readIds.has(notif.id),
    }));
  }, [readVersion]);

  const unreadCount = useMemo(
    () => notifications.filter((notif) => notif.isUnread).length,
    [notifications],
  );

  const markRead = useCallback((id: string) => {
    markDoctorNotificationRead(id);
    setReadVersion((v) => v + 1);
  }, []);

  const markAllRead = useCallback(() => {
    markAllDoctorNotificationsRead(notifications.map((notif) => notif.id));
    setReadVersion((v) => v + 1);
  }, [notifications]);

  return { notifications, unreadCount, markRead, markAllRead };
};

export type DoctorNotificationItem = DoctorNotification & { isUnread: boolean };
