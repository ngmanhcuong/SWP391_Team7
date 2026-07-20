import React from 'react';
import { Check } from 'lucide-react';
import { APPOINTMENT_BOOKING_STEPS } from '../constants/appointmentBookingSteps';
import { AppointmentBookingStep } from '../types';

interface AppointmentBookingStepperProps {
  currentStep: AppointmentBookingStep;
}

const AppointmentBookingStepper: React.FC<AppointmentBookingStepperProps> = ({ currentStep }) => (
  <div className="rounded-2xl border border-gray-100 bg-white px-4 py-6 shadow-sm sm:px-8 sm:py-8">
    <div className="flex items-start">
      {APPOINTMENT_BOOKING_STEPS.map(({ step, label }, index) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isLast = index === APPOINTMENT_BOOKING_STEPS.length - 1;
        /* The connector AFTER this step should be filled if the NEXT step is completed or active */
        const isConnectorFilled = step < currentStep;

        return (
          <React.Fragment key={step}>
            {/* Step circle + label */}
            <div className="relative z-10 flex flex-col items-center gap-2.5" style={{ minWidth: 64 }}>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-[#006c47] to-[#10b981] text-white shadow-md shadow-emerald-200'
                    : isActive
                      ? 'bg-gradient-to-br from-[#003d9b] to-[#2563eb] text-white shadow-lg shadow-blue-200 ring-4 ring-blue-100'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : step}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap sm:text-sm ${
                  isActive
                    ? 'font-bold text-[#003d9b]'
                    : isCompleted
                      ? 'font-semibold text-[#006c47]'
                      : 'text-gray-400'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <span className="absolute -bottom-2 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#003d9b] to-[#2563eb]" />
              )}
            </div>

            {/* Connector line between steps */}
            {!isLast && (
              <div className="mt-5 flex-1 px-1">
                <div className="relative h-[3px] w-full rounded-full bg-gray-100">
                  <div
                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out ${
                      isConnectorFilled
                        ? 'w-full bg-gradient-to-r from-[#006c47] to-[#10b981]'
                        : 'w-0'
                    }`}
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  </div>
);

export default AppointmentBookingStepper;
