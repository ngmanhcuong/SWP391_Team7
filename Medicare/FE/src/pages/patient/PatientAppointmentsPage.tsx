import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  AiMedicalAssistantPanel,
  AiSpecialtySuggestionBanner,
  AppointmentBookingFooter,
  AppointmentBookingStepper,
  AppointmentBookingSuccess,
  ConfirmationSection,
  DoctorSelectionHeader,
  DoctorSelectionSection,
  FloatingChatButton,
  SpecialtySelectionSection,
  SymptomInputSection,
  TimeSelectionSection,
} from '../../features/patient/components';
import { useAppointmentBooking } from '../../features/patient/hooks';

export const PatientAppointmentsPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
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
    isPayingDeposit,
    aiAnalysis,
    isAnalyzing,
    isSubmitting,
    bookingResult,
    canContinue,
    canAnalyze,
    setSymptoms,
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
    goToPreviousStep,
    goToStep,
    resetBooking,
    handleContinue,
  } = useAppointmentBooking();

  if (bookingResult) {
    return (
      <div className="relative mx-auto max-w-6xl space-y-6 pb-16">
        <AppointmentBookingSuccess
          result={bookingResult}
          doctor={selectedDoctor}
          specialtyName={selectedSpecialty?.name}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onBookAnother={resetBooking}
        />
        <FloatingChatButton unreadCount={2} />
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-6xl space-y-6 pb-16">
      {currentStep === 1 && (
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003d9b] via-[#1a56db] to-[#2563eb] p-6 sm:p-8 shadow-lg shadow-[#003d9b]/20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#82f9be]/20 blur-3xl" />
          <div className="relative space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              <CalendarPlus size={14} />
              Đặt lịch khám
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight text-white">
              Đặt lịch khám mới
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 max-w-xl">
              Vui lòng cung cấp thông tin để chúng tôi hỗ trợ bạn tốt nhất.
            </p>
          </div>
        </header>
      )}

      <AppointmentBookingStepper currentStep={currentStep} />

      {currentStep === 1 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SymptomInputSection
              symptoms={symptoms}
              isAnalyzing={isAnalyzing}
              canAnalyze={canAnalyze}
              onSymptomsChange={setSymptoms}
              onAnalyze={analyzeSymptoms}
            />
          </div>
          <div className="lg:col-span-1">
            <AiMedicalAssistantPanel analysis={aiAnalysis} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <header className="space-y-1 pt-2">
            <h2 className="text-2xl font-semibold text-[#191c1e]">Chọn chuyên khoa phù hợp</h2>
            <p className="text-base text-[#434654]">
              Dựa trên tình trạng sức khỏe của bạn, hãy chọn khoa cần khám.
            </p>
          </header>

          <AiSpecialtySuggestionBanner symptoms={symptoms} analysis={aiAnalysis} />

          <SpecialtySelectionSection
            selectedSpecialtyId={selectedSpecialtyId}
            aiAnalysis={aiAnalysis}
            onSelect={selectSpecialty}
          />
        </div>
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <DoctorSelectionHeader
            specialty={selectedSpecialty}
            searchQuery={doctorSearchQuery}
            onSearchChange={setDoctorSearchQuery}
          />

          <DoctorSelectionSection
            doctors={availableDoctors}
            selectedDoctorId={selectedDoctorId}
            searchQuery={doctorSearchQuery}
            onSelect={selectDoctor}
            onSuggest={suggestDoctor}
          />
        </div>
      )}

      {currentStep === 4 && (
        <TimeSelectionSection
          doctor={selectedDoctor}
          specialtyName={selectedSpecialty?.name}
          weekOffset={scheduleWeekOffset}
          selectedDate={selectedDate}
          selectedSlotId={selectedSlotId}
          onWeekOffsetChange={setScheduleWeekOffset}
          onSelectDate={selectDate}
          onSelectSlot={selectSlot}
          onClearSelection={clearScheduleSelection}
        />
      )}

      {currentStep === 5 && (
        <ConfirmationSection
          patient={user}
          symptoms={symptoms}
          specialty={selectedSpecialty}
          doctor={selectedDoctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          aiAnalysis={aiAnalysis}
          additionalNotes={additionalNotes}
          agreedToTerms={agreedToTerms}
          depositPaymentMethod={depositPaymentMethod}
          depositPaid={depositPaid}
          isPayingDeposit={isPayingDeposit}
          onAdditionalNotesChange={setAdditionalNotes}
          onAgreedToTermsChange={setAgreedToTerms}
          onDepositPaymentMethodChange={setDepositPaymentMethod}
          onPayDeposit={payDeposit}
          onEditStep={goToStep}
        />
      )}

      <AppointmentBookingFooter
        currentStep={currentStep}
        canContinue={canContinue}
        isSubmitting={isSubmitting}
        depositPaid={depositPaid}
        onContinue={handleContinue}
        onBack={goToPreviousStep}
        selectedDoctorName={selectedDoctor?.name}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      <FloatingChatButton unreadCount={2} />
    </div>
  );
};

export default PatientAppointmentsPage;
