import { useCallback, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MIN_SYMPTOM_LENGTH } from '../constants/appointmentBookingSteps';
import { getDepositAmount } from '../constants/consultationFees';
import { getSpecialtyById, getSpecialtyByName } from '../constants/medicalSpecialties';
import {
  AiSymptomAnalysis,
  AppointmentBookingResult,
  AppointmentBookingStep,
  BookingDoctor,
  DepositPaymentMethod,
} from '../types';
import { buildDoctorSchedule } from '../utils/buildDoctorSchedule';
import { aiApi, AiAnalysisError } from '../api/aiApi';
import { patientApi } from '../api/patientApi';

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

  const selectedSpecialty = useMemo(
    () => (selectedSpecialtyId ? getSpecialtyById(selectedSpecialtyId) ?? null : null),
    [selectedSpecialtyId],
  );

  const selectedDoctor = useMemo(
    () =>
      selectedDoctorId
        ? doctors.find((doc: BookingDoctor) => doc.id === selectedDoctorId) ?? null
        : null,
    [selectedDoctorId, doctors],
  );

  const availableDoctors = useMemo(
    () =>
      selectedSpecialtyId
        ? doctors.filter((doc: BookingDoctor) => doc.specialtyId === selectedSpecialtyId)
        : [],
    [selectedSpecialtyId, doctors],
  );

  const depositAmount = useMemo(
    () => getDepositAmount(selectedSpecialtyId),
    [selectedSpecialtyId],
  );

  const selectedTime = useMemo(() => {
    if (!selectedDoctor || !selectedDate || !selectedSlotId) return null;
    const day = buildDoctorSchedule(selectedDoctor.id, scheduleWeekOffset).find(
      (item) => item.date === selectedDate,
    );
    return day?.slots.find((slot) => slot.id === selectedSlotId)?.time ?? null;
  }, [selectedDoctor, selectedDate, selectedSlotId, scheduleWeekOffset]);

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

      const suggested = getSpecialtyByName(analysis.suggestedSpecialty);
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
  }, [canAnalyze, symptoms]);

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
