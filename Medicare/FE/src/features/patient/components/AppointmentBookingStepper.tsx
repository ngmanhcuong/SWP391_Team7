import React from 'react';
import { Check } from 'lucide-react';
import { APPOINTMENT_BOOKING_STEPS } from '../constants/appointmentBookingSteps';
import { AppointmentBookingStep } from '../types';

interface AppointmentBookingStepperProps {
  currentStep: AppointmentBookingStep;
}

const AppointmentBookingStepper: React.FC<AppointmentBookingStepperProps> = ({ currentStep }) => (
  <div className={`${currentStep === 1 ? 'bg-white border border-[#c3c6d6] rounded-2xl shadow-sm px-6 py-8' : 'px-4 py-2'}`}>
    <div className="relative flex items-start justify-between">
      <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#e1e2e4]" aria-hidden />

      {APPOINTMENT_BOOKING_STEPS.map(({ step, label }) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div
            key={step}
            className={`relative z-10 flex flex-col items-center gap-2 px-3 sm:px-4 min-w-0 ${
              currentStep === 1 ? 'bg-white' : 'bg-[#f8f9fb]'
            }`}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-xl text-base font-bold transition-colors ${
                isCompleted
                  ? 'bg-[#006c47] text-white'
                  : isActive
                    ? 'bg-[#003d9b] text-white shadow-[0_0_0_4px_rgba(0,82,204,0.1)]'
                    : 'bg-[#e1e2e4] text-[#434654]'
              }`}
            >
              {isCompleted ? <Check size={18} strokeWidth={3} /> : step}
            </div>
            <span
              className={`text-sm sm:text-base whitespace-nowrap ${
                isActive ? 'text-[#003d9b] font-bold' : 'text-[#434654]'
              }`}
            >
              {label}
            </span>
            {isActive && currentStep === 1 && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-[#003d9b]" />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

export default AppointmentBookingStepper;
