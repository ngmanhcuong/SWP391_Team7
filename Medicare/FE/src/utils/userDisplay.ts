const HONORIFIC_PATTERN = /^(bác|sĩ|bs\.?|ts\.?|ths\.?|pgs\.?|gs\.?|dr\.?)$/i;

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const stripHonorifics = (fullName: string): string =>
  fullName
    .trim()
    .replace(/^(bác sĩ|bs\.?)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .filter((part) => !HONORIFIC_PATTERN.test(part))
    .join(' ')
    .trim();

export const getUserInitials = (fullName: string): string => {
  const parts = stripHonorifics(fullName).split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    const fallback = fullName.trim();
    return fallback ? fallback.slice(0, 2).toUpperCase() : '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(-2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
};

export const getDoctorDisplayName = (fullName: string): string => {
  const trimmed = fullName.trim();
  if (!trimmed) return 'Bác Sĩ';

  const subject = stripHonorifics(trimmed) || trimmed;
  const shortName = subject.split(/\s+/).slice(-1)[0] || subject;
  return toTitleCase(`Bác Sĩ ${shortName}`);
};
