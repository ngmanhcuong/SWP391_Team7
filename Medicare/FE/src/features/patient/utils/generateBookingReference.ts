export const generateBookingReference = (): string => {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `MC-${suffix}`;
};
