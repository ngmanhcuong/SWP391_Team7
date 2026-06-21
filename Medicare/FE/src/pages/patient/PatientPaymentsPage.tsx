import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';
import {
  FloatingChatButton,
  PaymentInvoiceCard,
  PaymentsEmptyState,
  PaymentsFilterNav,
  PaymentsInfoPanel,
  PaymentsPageHeader,
  PaymentsStatCard,
} from '../../features/patient/components';
import { usePatientPayments } from '../../features/patient/hooks';
import { PaymentFilter, PaymentInvoice } from '../../features/patient/types';

const VALID_FILTERS: PaymentFilter[] = ['all', 'unpaid', 'paid', 'awaiting_visit'];

const isPaymentFilter = (value: string | null): value is PaymentFilter =>
  value !== null && VALID_FILTERS.includes(value as PaymentFilter);

const matchesSearch = (query: string, invoice: PaymentInvoice): boolean => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [
    invoice.invoiceCode,
    invoice.doctorName,
    invoice.specialtyName,
    invoice.bookingReferenceCode ?? '',
  ].some((value) => value.toLowerCase().includes(normalized));
};

const matchesFilter = (filter: PaymentFilter, invoice: PaymentInvoice): boolean => {
  if (filter === 'all') return true;
  if (filter === 'unpaid') return invoice.status === 'pending_payment';
  if (filter === 'awaiting_visit') return invoice.status === 'awaiting_visit';
  return invoice.status === 'paid';
};

export const PatientPaymentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data, isLoading, isError, payInvoice, isPaying } = usePatientPayments(user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [payingInvoiceId, setPayingInvoiceId] = useState<string | null>(null);

  const filterParam = searchParams.get('filter');
  const activeFilter: PaymentFilter = isPaymentFilter(filterParam) ? filterParam : 'all';

  const setActiveFilter = useCallback(
    (filter: PaymentFilter) => {
      setSearchParams(filter === 'all' ? {} : { filter }, { replace: true });
    },
    [setSearchParams],
  );

  const filteredInvoices = useMemo(() => {
    if (!data) return [];
    return data.invoices.filter(
      (item) => matchesFilter(activeFilter, item) && matchesSearch(searchQuery, item),
    );
  }, [data, activeFilter, searchQuery]);

  const filterCounts = useMemo((): Record<PaymentFilter, number> => {
    if (!data) {
      return { all: 0, unpaid: 0, paid: 0, awaiting_visit: 0 };
    }

    const base = data.invoices.filter((item) => matchesSearch(searchQuery, item));
    return {
      all: base.length,
      unpaid: base.filter((item) => item.status === 'pending_payment').length,
      awaiting_visit: base.filter((item) => item.status === 'awaiting_visit').length,
      paid: base.filter((item) => item.status === 'paid').length,
    };
  }, [data, searchQuery]);

  const handlePay = async (invoiceId: string, method: Parameters<typeof payInvoice>[1]) => {
    setPayingInvoiceId(invoiceId);
    try {
      await payInvoice(invoiceId, method);
    } finally {
      setPayingInvoiceId(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#434654]">Vui lòng đăng nhập để xem hóa đơn.</p>
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
        <p className="text-[#434654]">Không thể tải dữ liệu thanh toán. Vui lòng thử lại.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 pb-16">
      <PaymentsPageHeader
        totalUnpaid={data.totalUnpaid}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <PaymentsStatCard
            key={stat.id}
            stat={stat}
            isActive={activeFilter === stat.filter}
            onSelect={setActiveFilter}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <div className="bg-white border border-[#c3c6d6]/60 rounded-2xl shadow-sm shadow-[#003d9b]/5 p-4 sm:p-6 space-y-4 min-w-0">
          <PaymentsFilterNav
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={filterCounts}
          />

          {filteredInvoices.length === 0 ? (
            <PaymentsEmptyState filter={activeFilter} />
          ) : (
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <PaymentInvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  isPaying={isPaying && payingInvoiceId === invoice.id}
                  onPay={handlePay}
                />
              ))}
            </div>
          )}
        </div>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <PaymentsInfoPanel />
        </div>
      </div>

      <FloatingChatButton />
    </div>
  );
};

export default PatientPaymentsPage;
