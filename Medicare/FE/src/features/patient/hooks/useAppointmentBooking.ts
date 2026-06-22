import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MIN_SYMPTOM_LENGTH } from '../constants/appointmentBookingSteps';
import { getDepositAmount } from '../constants/consultationFees';
import { getSpecialtyByName, getSpecialtyPresentation, MEDICAL_SPECIALTIES, MedicalSpecialty } from '../constants/medicalSpecialties';
import {
  AiSymptomAnalysis,
  AppointmentScheduleDay,
  AppointmentBookingResult,
  AppointmentBookingStep,
  BookingDoctor,
  DepositPaymentMethod,
} from '../types';
import { aiApi, AiAnalysisError } from '../api/aiApi';
import { patientApi, PatientSpecialty } from '../api/patientApi';

const FALLBACK_DOCTORS: BookingDoctor[] = [
  {
    id: 'fallback-doc-1',
    name: 'BS. Nguyễn Văn An',
    specialtyId: 'cardiology',
    departmentLabel: 'Khoa Tim mạch',
    rating: 4.9,
    reviewCount: 128,
    experienceYears: 15,
    tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' },
    nextAvailableSlot: 'Hôm nay, 14:30',
    isAvailable: true,
    avatarBg: 'rgba(218,226,255,0.3)',
  },
  {
    id: 'fallback-doc-2',
    name: 'BS. Trần Minh Bách',
    specialtyId: 'cardiology',
    departmentLabel: 'Khoa Tim mạch',
    rating: 4.8,
    reviewCount: 95,
    experienceYears: 10,
    tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' },
    nextAvailableSlot: 'Mai, 08:00',
    isAvailable: true,
    avatarBg: 'rgba(255,218,210,0.3)',
  },
  {
    id: 'fallback-doc-3',
    name: 'BS. Lê Hoàng Cường',
    specialtyId: 'cardiology',
    departmentLabel: 'Khoa Tim mạch',
    rating: 5.0,
    reviewCount: 210,
    experienceYears: 22,
    tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' },
    nextAvailableSlot: null,
    isAvailable: false,
    avatarBg: 'rgba(130,249,190,0.3)',
  },
  {
    id: 'fallback-doc-4',
    name: 'BS. Phạm Thu Dung',
    specialtyId: 'musculoskeletal',
    departmentLabel: 'Khoa Cơ xương khớp',
    rating: 4.7,
    reviewCount: 52,
    experienceYears: 8,
    tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' },
    nextAvailableSlot: 'Hôm nay, 16:00',
    isAvailable: true,
    avatarBg: 'rgba(218,226,255,0.3)',
  },
  {
    id: 'fallback-doc-5',
    name: 'BS. Hoàng Văn Đức',
    specialtyId: 'musculoskeletal',
    departmentLabel: 'Khoa Cơ xương khớp',
    rating: 4.9,
    reviewCount: 143,
    experienceYears: 18,
    tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' },
    nextAvailableSlot: 'Hôm nay, 10:00',
    isAvailable: true,
    avatarBg: 'rgba(255,218,210,0.3)',
  },
  {
    id: 'fallback-doc-6',
    name: 'BS. Trần Thị Phương',
    specialtyId: 'musculoskeletal',
    departmentLabel: 'Khoa Cơ xương khớp',
    rating: 4.6,
    reviewCount: 67,
    experienceYears: 12,
    tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' },
    nextAvailableSlot: 'Mai, 15:30',
    isAvailable: true,
    avatarBg: 'rgba(130,249,190,0.3)',
  },
  {
    id: 'fallback-doc-7',
    name: 'BS. Nguyễn Thị Giang',
    specialtyId: 'obstetrics-pediatrics',
    departmentLabel: 'Khoa Sản & Nhi',
    rating: 4.9,
    reviewCount: 186,
    experienceYears: 16,
    tag: { label: 'Chuyên gia đầu ngành', variant: 'expert' },
    nextAvailableSlot: 'Hôm nay, 09:00',
    isAvailable: true,
    avatarBg: 'rgba(255,218,210,0.3)',
  },
  {
    id: 'fallback-doc-8',
    name: 'BS. Lê Văn Hùng',
    specialtyId: 'obstetrics-pediatrics',
    departmentLabel: 'Khoa Sản & Nhi',
    rating: 4.8,
    reviewCount: 112,
    experienceYears: 14,
    tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' },
    nextAvailableSlot: 'Mai, 11:00',
    isAvailable: true,
    avatarBg: 'rgba(218,226,255,0.3)',
  },
  {
    id: 'fallback-doc-9',
    name: 'BS. Trần Thị Mai',
    specialtyId: 'obstetrics-pediatrics',
    departmentLabel: 'Khoa Sản & Nhi',
    rating: 4.7,
    reviewCount: 89,
    experienceYears: 12,
    tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' },
    nextAvailableSlot: 'Hôm nay, 15:00',
    isAvailable: true,
    avatarBg: 'rgba(130,249,190,0.3)',
  },
  {
    id: 'fallback-doc-10',
    name: 'BS. Phạm Hoàng Long',
    specialtyId: 'ophthalmology',
    departmentLabel: 'Khoa Mắt',
    rating: 5.0,
    reviewCount: 210,
    experienceYears: 22,
    tag: { label: 'Bác sĩ Ưu tú', variant: 'elite' },
    nextAvailableSlot: null,
    isAvailable: false,
    avatarBg: 'rgba(130,249,190,0.3)',
  },
  {
    id: 'fallback-doc-11',
    name: 'BS. Trần Anh Khoa',
    specialtyId: 'ophthalmology',
    departmentLabel: 'Khoa Mắt',
    rating: 4.7,
    reviewCount: 78,
    experienceYears: 11,
    tag: { label: 'Bác sĩ trẻ tiềm năng', variant: 'potential' },
    nextAvailableSlot: 'Hôm nay, 16:00',
    isAvailable: true,
    avatarBg: 'rgba(218,226,255,0.3)',
  },
  {
    id: 'fallback-doc-12',
    name: 'BS. Võ Minh Lâm',
    specialtyId: 'ophthalmology',
    departmentLabel: 'Khoa Mắt',
    rating: 4.8,
    reviewCount: 99,
    experienceYears: 13,
    tag: { label: 'Tiến sĩ Y khoa', variant: 'phd' },
    nextAvailableSlot: 'Mai, 14:00',
    isAvailable: true,
    avatarBg: 'rgba(255,218,210,0.3)',
  },
];

export const useAppointmentBooking = () => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<AppointmentBookingStep>(1);
  const [symptoms, setSymptoms] = useState('');
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string | null>(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [scheduleWeekOffset, setScheduleWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [depositPaymentMethod, setDepositPaymentMethod] = useState<DepositPaymentMethod | null>(null);
  const [depositPaid, setDepositPaid] = useState(false);
  const [isPayingDeposit, setIsPayingDeposit] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AiSymptomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<AppointmentBookingResult | null>(null);

  const { data: doctors = [] } = useQuery({
    queryKey: ['patient', 'doctors'],
    queryFn: () => patientApi.getDoctors(),
    staleTime: 5 * 60_000,
  });
  const { data: specialties = [] } = useQuery({
    queryKey: ['patient', 'specialties'],
    queryFn: () => patientApi.getSpecialties(),
    staleTime: 5 * 60_000,
  });
  const { data: availabilityDays = [] } = useQuery<AppointmentScheduleDay[]>({
    queryKey: ['patient', 'doctor-availability', selectedDoctorId, scheduleWeekOffset],
    queryFn: async () => {
      if (!selectedDoctorId) return [];

      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      startDate.setDate(startDate.getDate() + scheduleWeekOffset * 7);

      const year = startDate.getFullYear();
      const month = `${startDate.getMonth() + 1}`.padStart(2, '0');
      const day = `${startDate.getDate()}`.padStart(2, '0');

      return patientApi.getDoctorAvailability(selectedDoctorId, `${year}-${month}-${day}`, 14);
    },
    enabled: Boolean(selectedDoctorId),
    staleTime: 30_000,
  });

  const effectiveDoctors = useMemo(
    () => (doctors.length > 0 ? doctors : FALLBACK_DOCTORS),
    [doctors],
  );

  const fallbackSpecialties = useMemo<MedicalSpecialty[]>(
    () =>
      MEDICAL_SPECIALTIES.map((specialty) => ({
        ...specialty,
        doctorCount: FALLBACK_DOCTORS.filter((doctor) => doctor.specialtyId === specialty.id).length,
      })),
    [],
  );

  const specialtyOptions = useMemo<MedicalSpecialty[]>(
    () => {
      if (specialties.length === 0) {
        return fallbackSpecialties;
      }

      return specialties.map((specialty: PatientSpecialty) => ({
        id: specialty.id,
        name: specialty.name,
        departmentLabel: specialty.departmentLabel,
        ...getSpecialtyPresentation(specialty.id),
        consultationFee: specialty.consultationFee,
        depositAmount: specialty.depositAmount,
        doctorCount: specialty.doctorCount,
      }));
    },
    [fallbackSpecialties, specialties],
  );

  const selectedSpecialty = useMemo(
    () => (selectedSpecialtyId ? specialtyOptions.find((item) => item.id === selectedSpecialtyId) ?? null : null),
    [selectedSpecialtyId, specialtyOptions],
  );

  const selectedDoctor = useMemo(
    () =>
      selectedDoctorId
        ? effectiveDoctors.find((doc: BookingDoctor) => doc.id === selectedDoctorId) ?? null
        : null,
    [selectedDoctorId, effectiveDoctors],
  );

  const availableDoctors = useMemo(
    () =>
      selectedSpecialtyId
        ? effectiveDoctors.filter((doc: BookingDoctor) => doc.specialtyId === selectedSpecialtyId)
        : [],
    [selectedSpecialtyId, effectiveDoctors],
  );

  const depositAmount = useMemo(
    () => selectedSpecialty?.depositAmount ?? getDepositAmount(selectedSpecialtyId),
    [selectedSpecialty, selectedSpecialtyId],
  );

  const selectedTime = useMemo(() => {
    if (!selectedDate || !selectedSlotId) return null;
    const day = availabilityDays.find((item: AppointmentScheduleDay) => item.date === selectedDate);
    return day?.slots.find((slot: AppointmentScheduleDay['slots'][number]) => slot.id === selectedSlotId)?.time ?? null;
  }, [availabilityDays, selectedDate, selectedSlotId]);

  const isBookingDataComplete = useMemo(
    () =>
      symptoms.trim().length >= MIN_SYMPTOM_LENGTH &&
      selectedSpecialtyId !== null &&
      selectedDoctorId !== null &&
      selectedDate !== null &&
      selectedSlotId !== null &&
      selectedTime !== null,
    [symptoms, selectedSpecialtyId, selectedDoctorId, selectedDate, selectedSlotId, selectedTime],
  );

  const canAnalyze = symptoms.trim().length >= MIN_SYMPTOM_LENGTH && !isAnalyzing;

  const canContinue = useMemo(() => {
    if (currentStep === 1) return symptoms.trim().length >= MIN_SYMPTOM_LENGTH;
    if (currentStep === 2) return selectedSpecialtyId !== null;
    if (currentStep === 3) return selectedDoctorId !== null;
    if (currentStep === 4) return selectedDate !== null && selectedSlotId !== null;
    if (currentStep === 5) {
      return (
        agreedToTerms &&
        depositPaid &&
        isBookingDataComplete &&
        depositPaymentMethod !== null &&
        !isSubmitting &&
        !isPayingDeposit
      );
    }
    return false;
  }, [
    currentStep,
    symptoms,
    selectedSpecialtyId,
    selectedDoctorId,
    selectedDate,
    selectedSlotId,
    agreedToTerms,
    depositPaid,
    depositPaymentMethod,
    isBookingDataComplete,
    isSubmitting,
    isPayingDeposit,
  ]);

  const analyzeSymptoms = useCallback(async () => {
    if (!canAnalyze) return;

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const analysis = await aiApi.analyzeSymptoms(symptoms.trim());
      setAiAnalysis(analysis);

      const suggested =
        specialtyOptions.find((item) => item.name === analysis.suggestedSpecialty)
        ?? getSpecialtyByName(analysis.suggestedSpecialty);
      if (suggested) {
        setSelectedSpecialtyId(suggested.id);
      }
    } catch (error) {
      setAiAnalysis(null);
      setAnalysisError(
        error instanceof AiAnalysisError
          ? error.message
          : 'Không thể kết nối tới trợ lý AI lúc này. Vui lòng thử lại sau hoặc tự chọn chuyên khoa.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }, [canAnalyze, specialtyOptions, symptoms]);

  const goToNextStep = useCallback(() => {
    if (!canContinue || currentStep >= 5) return;
    setCurrentStep((step) => (step + 1) as AppointmentBookingStep);
  }, [canContinue, currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep <= 1) return;
    setCurrentStep((step) => (step - 1) as AppointmentBookingStep);
  }, [currentStep]);

  const goToStep = useCallback((step: AppointmentBookingStep) => {
    if (bookingResult || step >= currentStep) return;
    setCurrentStep(step);
  }, [bookingResult, currentStep]);

  const handleSymptomsChange = useCallback((value: string) => {
    setSymptoms(value);
    setAiAnalysis(null);
    setAnalysisError(null);
  }, []);

  const clearScheduleSelection = useCallback(() => {
    setSelectedDate(null);
    setSelectedSlotId(null);
  }, []);

  const selectSpecialty = useCallback((specialtyId: string) => {
    setSelectedSpecialtyId(specialtyId);
    setSelectedDoctorId(null);
    clearScheduleSelection();
    setDepositPaid(false);
    setDepositPaymentMethod(null);
  }, [clearScheduleSelection]);

  const selectDoctor = useCallback((doctorId: string) => {
    setSelectedDoctorId(doctorId);
    clearScheduleSelection();
    setScheduleWeekOffset(0);
  }, [clearScheduleSelection]);

  const selectDate = useCallback((date: string) => {
    setSelectedDate(date);
    setSelectedSlotId(null);
  }, []);

  const selectSlot = useCallback((slotId: string) => {
    setSelectedSlotId(slotId);
  }, []);

  const suggestDoctor = useCallback(() => {
    if (!selectedSpecialtyId) return;
    const suggested = [...availableDoctors]
      .filter((doc: BookingDoctor) => doc.isAvailable)
      .sort((a, b) => b.rating - a.rating)[0];
    if (suggested) {
      selectDoctor(suggested.id);
    }
  }, [selectedSpecialtyId, availableDoctors, selectDoctor]);

  const payDeposit = useCallback(async () => {
    if (!depositPaymentMethod || depositPaid || isPayingDeposit) return;

    setIsPayingDeposit(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setDepositPaid(true);
    setIsPayingDeposit(false);
  }, [depositPaymentMethod, depositPaid, isPayingDeposit]);

  const submitBooking = useCallback(async () => {
    if (
      currentStep !== 5 ||
      !canContinue ||
      !depositPaymentMethod ||
      !selectedSpecialtyId ||
      !selectedDoctorId ||
      !selectedDate ||
      !selectedTime ||
      !selectedSpecialty ||
      !selectedDoctor
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await patientApi.createAppointment({
        specialtyId: selectedSpecialtyId,
        doctorId: selectedDoctorId,
        doctorName: selectedDoctor.name,
        date: selectedDate,
        time: selectedTime,
        symptoms: symptoms.trim(),
        additionalNotes: additionalNotes.trim() || undefined,
        depositPaymentMethod,
      });

      setBookingResult(result);
      queryClient.invalidateQueries({ queryKey: ['patient'] });
    } catch {
      setSubmitError('Không thể hoàn tất đặt lịch lúc này. Vui lòng thử lại sau ít phút.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    currentStep,
    canContinue,
    depositPaymentMethod,
    selectedSpecialtyId,
    selectedDoctorId,
    selectedDate,
    selectedTime,
    selectedSpecialty,
    selectedDoctor,
    symptoms,
    additionalNotes,
    queryClient,
  ]);

  const resetBooking = useCallback(() => {
    setCurrentStep(1);
    setSymptoms('');
    setSelectedSpecialtyId(null);
    setSelectedDoctorId(null);
    setDoctorSearchQuery('');
    setScheduleWeekOffset(0);
    setSelectedDate(null);
    setSelectedSlotId(null);
    setAdditionalNotes('');
    setAgreedToTerms(false);
    setDepositPaymentMethod(null);
    setDepositPaid(false);
    setIsPayingDeposit(false);
    setAiAnalysis(null);
    setIsAnalyzing(false);
    setAnalysisError(null);
    setIsSubmitting(false);
    setSubmitError(null);
    setBookingResult(null);
  }, []);

  const handleContinue = useCallback(() => {
    if (currentStep === 5) {
      submitBooking();
      return;
    }
    goToNextStep();
  }, [currentStep, goToNextStep, submitBooking]);

  return {
    currentStep,
    symptoms,
    selectedSpecialtyId,
    selectedSpecialty,
    selectedDoctorId,
    selectedDoctor,
    doctorSearchQuery,
    availableDoctors,
    specialtyOptions,
    availabilityDays,
    scheduleWeekOffset,
    selectedDate,
    selectedSlotId,
    selectedTime,
    additionalNotes,
    agreedToTerms,
    depositPaymentMethod,
    depositPaid,
    depositAmount,
    isPayingDeposit,
    aiAnalysis,
    isAnalyzing,
    analysisError,
    isSubmitting,
    submitError,
    bookingResult,
    isBookingDataComplete,
    canContinue,
    canAnalyze,
    setSymptoms: handleSymptomsChange,
    setDoctorSearchQuery,
    setScheduleWeekOffset,
    setAdditionalNotes,
    setAgreedToTerms,
    setDepositPaymentMethod,
    selectSpecialty,
    selectDoctor,
    selectDate,
    selectSlot,
    clearScheduleSelection,
    suggestDoctor,
    payDeposit,
    analyzeSymptoms,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    submitBooking,
    resetBooking,
    handleContinue,
  };
};
