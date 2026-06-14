const STORAGE_KEY = 'medicare_paid_invoices';

export const getPaidInvoiceIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

export const markInvoicePaid = (id: string): void => {
  const paidIds = getPaidInvoiceIds();
  paidIds.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(paidIds)));
};

export const isInvoicePaid = (id: string): boolean => getPaidInvoiceIds().has(id);
