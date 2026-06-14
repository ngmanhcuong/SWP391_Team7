export const CONSULTATION_FEES: Record<string, number> = {
  cardiology: 350_000,
  musculoskeletal: 300_000,
  'obstetrics-pediatrics': 320_000,
  ophthalmology: 280_000,
};

export const DEFAULT_CONSULTATION_FEE = 300_000;

export const getConsultationFee = (specialtyId: string | null): number =>
  specialtyId ? CONSULTATION_FEES[specialtyId] ?? DEFAULT_CONSULTATION_FEE : DEFAULT_CONSULTATION_FEE;

export const formatCurrencyVnd = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export const DEPOSIT_RATE = 0.3;
export const MIN_DEPOSIT_AMOUNT = 100_000;

export const getDepositAmount = (specialtyId: string | null): number => {
  const fee = getConsultationFee(specialtyId);
  return Math.max(Math.round(fee * DEPOSIT_RATE / 1000) * 1000, MIN_DEPOSIT_AMOUNT);
};
