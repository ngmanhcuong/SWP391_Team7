const STORAGE_KEY = 'medicare_read_notifications';

export const getReadNotificationIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

export const markNotificationRead = (id: string): void => {
  const readIds = getReadNotificationIds();
  readIds.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
};

export const markAllNotificationsRead = (ids: string[]): void => {
  const readIds = getReadNotificationIds();
  ids.forEach((id) => readIds.add(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
};
