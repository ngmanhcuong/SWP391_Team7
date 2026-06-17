const STORAGE_KEY = 'medicare_doctor_read_notifications';

export const getDoctorReadNotificationIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

export const markDoctorNotificationRead = (id: string): void => {
  const readIds = getDoctorReadNotificationIds();
  readIds.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
};

export const markAllDoctorNotificationsRead = (ids: string[]): void => {
  const readIds = getDoctorReadNotificationIds();
  ids.forEach((id) => readIds.add(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(readIds)));
};
