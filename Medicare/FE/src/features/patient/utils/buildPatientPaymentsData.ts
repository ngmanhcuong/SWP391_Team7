import { User } from '../../../types';
import { formatCurrencyVnd } from '../constants/consultationFees';
import {
  PatientPaymentsData,
  PaymentInvoice,
  PaymentLineItem,
  PaymentStat,
} from '../types';
import { getPendingAppointments } from './appointmentBookingStore';
import { getPaidInvoiceIds } from './paymentInvoiceStore';

const computeChargeSubtotal = (lineItems: PaymentLineItem[]): number =>
  lineItems.filter((item) => item.type === 'charge').reduce((sum, item) => sum + item.amount, 0);

const applyPaidState = (invoices: PaymentInvoice[]): PaymentInvoice[] => {
  const paidIds = getPaidInvoiceIds();
  return invoices.map((invoice) => {
    if (!paidIds.has(invoice.id) || invoice.status === 'awaiting_visit') {
      return invoice;
    }
    return {
      ...invoice,
      status: 'paid',
      totalDue: 0,
      paidAt: invoice.paidAt ?? new Date().toISOString(),
    };
  });
};

const buildBookingInvoices = (user: User): PaymentInvoice[] =>
  getPendingAppointments()
    .filter((booking) => booking.patientId === user.id && booking.status !== 'cancelled')
    .map((booking) => {
      const estimatedRemaining = Math.max(booking.consultationFee - booking.depositAmount, 0);
      const lineItems: PaymentLineItem[] = [
        {
          id: `${booking.id}-consultation`,
          label: `Phí khám ${booking.specialtyName}`,
          amount: booking.consultationFee,
          type: 'charge',
        },
      ];

      return {
        id: `booking-invoice-${booking.id}`,
        invoiceCode: booking.referenceCode,
        bookingReferenceCode: booking.referenceCode,
        visitDate: booking.appointmentDate,
        doctorName: booking.doctorName,
        specialtyName: booking.specialtyName,
        status: 'awaiting_visit' as const,
        lineItems,
        subtotal: booking.consultationFee,
        depositAmount: booking.depositAmount,
        depositPaymentMethod: booking.depositPaymentMethod,
        depositPaidAt: booking.depositPaidAt,
        totalDue: 0,
        estimatedRemaining,
        createdAt: booking.submittedAt,
      };
    });

const buildMockCompletedInvoices = (): PaymentInvoice[] => {
  const depositAmount = 100_000;
  const lineItems: PaymentLineItem[] = [
    { id: 'consultation', label: 'Phí khám Tim mạch', amount: 350_000, type: 'charge' },
    { id: 'lab', label: 'Xét nghiệm máu tổng quát', amount: 450_000, type: 'charge' },
    { id: 'meds', label: 'Thuốc theo đơn (Paracetamol, Amoxicillin)', amount: 150_000, type: 'charge' },
    {
      id: 'deposit-credit',
      label: 'Tiền cọc đã thanh toán khi đặt lịch',
      amount: depositAmount,
      type: 'credit',
    },
  ];
  const subtotal = computeChargeSubtotal(lineItems);

  return [
    {
      id: 'invoice-cardiology-2026-06-05',
      invoiceCode: 'HD-240605',
      visitDate: '05/06/2026',
      doctorName: 'BS. Trần Văn Hùng',
      specialtyName: 'Tim mạch',
      status: 'pending_payment',
      lineItems,
      subtotal,
      depositAmount,
      depositPaymentMethod: 'vnpay',
      depositPaidAt: '2026-06-01T09:30:00.000Z',
      totalDue: subtotal - depositAmount,
      dueDate: '12/06/2026',
      createdAt: '2026-06-05T15:00:00.000Z',
    },
    {
      id: 'invoice-general-2026-04-20',
      invoiceCode: 'HD-240420',
      visitDate: '20/04/2026',
      doctorName: 'BS. Nguyễn Thị Lan',
      specialtyName: 'Nội tổng quát',
      status: 'paid',
      lineItems: [
        { id: 'consultation', label: 'Phí khám Nội tổng quát', amount: 300_000, type: 'charge' },
        { id: 'deposit-credit', label: 'Tiền cọc đã thanh toán khi đặt lịch', amount: 100_000, type: 'credit' },
        { id: 'meds', label: 'Thuốc theo đơn', amount: 80_000, type: 'charge' },
      ],
      subtotal: 380_000,
      depositAmount: 100_000,
      depositPaymentMethod: 'momo',
      depositPaidAt: '2026-04-18T10:00:00.000Z',
      totalDue: 0,
      paidAt: '2026-04-20T16:30:00.000Z',
      createdAt: '2026-04-20T14:00:00.000Z',
    },
  ];
};

export const buildPatientPaymentsData = (user: User): PatientPaymentsData => {
  const bookingInvoices = buildBookingInvoices(user);
  const mockInvoices = buildMockCompletedInvoices();
  const invoices = applyPaidState(
    [...bookingInvoices, ...mockInvoices].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
  );

  const pendingInvoices = invoices.filter((item) => item.status === 'pending_payment');
  const awaitingInvoices = invoices.filter((item) => item.status === 'awaiting_visit');
  const paidInvoices = invoices.filter((item) => item.status === 'paid');
  const totalUnpaid = pendingInvoices.reduce((sum, item) => sum + item.totalDue, 0);
  const totalDepositHeld = awaitingInvoices.reduce((sum, item) => sum + item.depositAmount, 0);

  const stats: PaymentStat[] = [
    {
      id: 'unpaid',
      label: 'Chưa thanh toán',
      value: pendingInvoices.length,
      filter: 'unpaid',
      icon: 'receipt',
      iconBg: 'bg-[rgba(255,218,214,0.3)]',
      trend: totalUnpaid > 0 ? formatCurrencyVnd(totalUnpaid) : undefined,
      trendType: 'negative',
    },
    {
      id: 'awaiting',
      label: 'Đã cọc · Chờ khám',
      value: awaitingInvoices.length,
      filter: 'awaiting_visit',
      icon: 'calendar',
      iconBg: 'bg-[rgba(0,82,204,0.1)]',
      trend: totalDepositHeld > 0 ? formatCurrencyVnd(totalDepositHeld) : undefined,
      trendType: 'neutral',
    },
    {
      id: 'paid',
      label: 'Đã thanh toán',
      value: paidInvoices.length,
      filter: 'paid',
      icon: 'clock',
      iconBg: 'bg-[rgba(130,249,190,0.2)]',
      trendType: 'positive',
    },
    {
      id: 'all',
      label: 'Tổng hóa đơn',
      value: invoices.length,
      filter: 'all',
      icon: 'receipt',
      iconBg: 'bg-[#edeef0]',
      trendType: 'neutral',
    },
  ];

  return { invoices, stats, totalUnpaid, totalDepositHeld };
};

export const getDashboardBillStat = (data: PatientPaymentsData) => {
  const pendingCount = data.invoices.filter((item) => item.status === 'pending_payment').length;
  return {
    value: pendingCount,
    trend: data.totalUnpaid > 0 ? formatCurrencyVnd(data.totalUnpaid).replace('₫', 'VND') : undefined,
  };
};
