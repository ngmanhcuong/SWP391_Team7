import React from 'react';
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
        <header className="space-y-2">
          <h1 className="text-[32px] font-semibold leading-10 tracking-tight text-[#003d9b]">
            Đặt lịch khám mới
          </h1>
          <p className="text-base text-[#434654]">
            Vui lòng cung cấp thông tin để chúng tôi hỗ trợ bạn tốt nhất.
          </p>
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
