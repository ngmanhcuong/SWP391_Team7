import { useCallback, useMemo, useState } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { getDoctorsBySpecialty, getDoctorById, getSuggestedDoctor } from '../constants/bookingDoctors';
import { MIN_SYMPTOM_LENGTH } from '../constants/appointmentBookingSteps';
import { getConsultationFee, getDepositAmount } from '../constants/consultationFees';
import { getSpecialtyById, getSpecialtyByName } from '../constants/medicalSpecialties';
import {
  AiSymptomAnalysis,
  AppointmentBookingResult,
  AppointmentBookingStep,
  DepositPaymentMethod,
} from '../types';
import { savePendingAppointment } from '../utils/appointmentBookingStore';
import { buildDoctorSchedule } from '../utils/buildDoctorSchedule';
import { generateBookingReference } from '../utils/generateBookingReference';
import { mockAiSymptomAnalysis } from '../utils/mockAiSymptomAnalysis';

export const useAppointmentBooking = () => {
  const { user } = useAuthStore();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState<AppointmentBookingResult | null>(null);

  const selectedSpecialty = useMemo(
    () => (selectedSpecialtyId ? getSpecialtyById(selectedSpecialtyId) ?? null : null),
    [selectedSpecialtyId],
  );

  const selectedDoctor = useMemo(
    () => (selectedDoctorId ? getDoctorById(selectedDoctorId) ?? null : null),
    [selectedDoctorId],
  );

  const availableDoctors = useMemo(
    () => (selectedSpecialtyId ? getDoctorsBySpecialty(selectedSpecialtyId) : []),
    [selectedSpecialtyId],
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    const analysis = mockAiSymptomAnalysis(symptoms.trim());
    setAiAnalysis(analysis);

    const suggested = getSpecialtyByName(analysis.suggestedSpecialty);
    if (suggested) {
      setSelectedSpecialtyId(suggested.id);
    }

    setIsAnalyzing(false);
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
    const suggested = getSuggestedDoctor(selectedSpecialtyId);
    if (suggested) {
      selectDoctor(suggested.id);
    }
  }, [selectedSpecialtyId, selectDoctor]);

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
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const referenceCode = generateBookingReference();
    const submittedAt = new Date().toISOString();
    const depositPaidAt = submittedAt;
    const consultationFee = getConsultationFee(selectedSpecialtyId);

    const result: AppointmentBookingResult = {
      referenceCode,
      submittedAt,
      depositAmount,
      depositPaymentMethod,
      depositPaidAt,
      consultationFee,
      status: 'pending_reception_deposit',
    };

    savePendingAppointment({
      id: `${referenceCode}-${Date.now()}`,
      referenceCode,
      patientId: user?.id ?? user?._id ?? 'guest',
      patientName: user?.fullName ?? 'Khách',
      patientEmail: user?.email ?? '',
      patientPhone: user?.phone,
      symptoms: symptoms.trim(),
      specialtyId: selectedSpecialtyId,
      specialtyName: selectedSpecialty.name,
      doctorId: selectedDoctorId,
      doctorName: selectedDoctor.name,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      additionalNotes: additionalNotes.trim() || undefined,
      consultationFee,
      depositAmount,
      depositPaymentMethod,
      depositPaidAt,
      submittedAt,
      receptionDepositConfirmed: false,
      doctorConfirmed: false,
      status: 'pending_reception_deposit',
    });

    setBookingResult(result);
    setIsSubmitting(false);
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
    depositAmount,
    user,
    symptoms,
    additionalNotes,
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
    setIsSubmitting(false);
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
    isSubmitting,
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
