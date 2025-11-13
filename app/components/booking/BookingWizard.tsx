'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Branch, Service, Staff, BookingWizardState } from '@/app/types';
import { ModernCard } from '@/components/ui/ModernCard';
import { Step1BranchSelection } from './Step1BranchSelection';
import { Step2ServiceSelection } from './Step2ServiceSelection';
import { Step3StaffSelection } from './Step3StaffSelection';
import { Step4DateTimeSelection } from './Step4DateTimeSelection';
import { Step5CustomerInfo } from './Step5CustomerInfo';
import { Step6Confirmation } from './Step6Confirmation';
import { CheckCircle2 } from 'lucide-react';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const BookingWizard: React.FC = () => {
  const [state, setState] = useState<BookingWizardState>({
    step: 1,
    selectedBranch: null,
    selectedService: null,
    selectedStaff: null,
    selectedDate: null,
    selectedTime: null,
  });
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [bookingCode, setBookingCode] = useState<string>('');

  const handleBranchSelect = (branch: Branch) => {
    setState((prev) => ({
      ...prev,
      selectedBranch: branch,
    }));
  };

  const handleServiceSelect = (service: Service) => {
    setState((prev) => ({
      ...prev,
      selectedService: service,
    }));
  };

  const handleStaffSelect = (staff: Staff) => {
    setState((prev) => ({
      ...prev,
      selectedStaff: staff,
    }));
  };

  const handleDateSelect = (date: string) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleTimeSelect = (time: string) => {
    setState((prev) => ({
      ...prev,
      selectedTime: time,
    }));
  };

  const handleNext = () => {
    if (state.step < 6) {
      setState((prev) => ({
        ...prev,
        step: (prev.step + 1) as any,
      }));
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setState((prev) => ({
        ...prev,
        step: (prev.step - 1) as any,
      }));
    }
  };

  const handleCustomerInfoSubmit = (info: CustomerInfo) => {
    setCustomerInfo(info);
    handleNext();
  };

  const handleBookingComplete = async () => {
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          branchId: state.selectedBranch?.id,
          branchName: state.selectedBranch?.name,
          serviceId: state.selectedService?.id,
          serviceName: state.selectedService?.name,
          staffId: state.selectedStaff?.id,
          staffName: state.selectedStaff?.name,
          date: state.selectedDate,
          startTime: state.selectedTime,
          duration: state.selectedService?.duration,
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerNotes: customerInfo.notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setBookingCode(data.bookingCode);
        handleNext();
      } else {
        alert('Failed to create booking: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    }
  };

  const steps = [
    { number: 1, name: 'Branch', description: 'Select location' },
    { number: 2, name: 'Service', description: 'Choose service' },
    { number: 3, name: 'Staff', description: 'Pick specialist' },
    { number: 4, name: 'Date & Time', description: 'Schedule' },
    { number: 5, name: 'Your Info', description: 'Contact details' },
    { number: 6, name: 'Confirm', description: 'Complete' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Stepper */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ModernCard className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-100">
          <div className="pt-6">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <motion.div
                    className="flex flex-col items-center flex-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        state.step > step.number
                          ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg'
                          : state.step === step.number
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <AnimatePresence mode="wait">
                        {state.step > step.number ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                          >
                            <CheckCircle2 className="w-6 h-6" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="number"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            {step.number}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                    <motion.div
                      className="mt-2 text-center hidden sm:block"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className={`text-sm font-medium transition-colors ${
                        state.step >= step.number ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </div>
                      <div className="text-xs text-gray-500">{step.description}</div>
                    </motion.div>
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        state.step > step.number
                          ? 'bg-gradient-to-r from-green-400 to-green-600'
                          : 'bg-gray-200'
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ModernCard>
      </motion.div>

      {/* Steps Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ModernCard className="shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-8">
            <AnimatePresence mode="wait">
            {state.step === 1 && (
              <Step1BranchSelection
                key="step1"
                onSelect={handleBranchSelect}
                selectedBranch={state.selectedBranch}
                onNext={handleNext}
              />
            )}

            {state.step === 2 && (
              <Step2ServiceSelection
                key="step2"
                branchId={state.selectedBranch?.id || null}
                onSelect={handleServiceSelect}
                selectedService={state.selectedService}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {state.step === 3 && (
              <Step3StaffSelection
                key="step3"
                serviceId={state.selectedService?.id || null}
                branchId={state.selectedBranch?.id || null}
                onSelect={handleStaffSelect}
                selectedStaff={state.selectedStaff}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {state.step === 4 && (
              <Step4DateTimeSelection
                key="step4"
                staff={state.selectedStaff}
                service={state.selectedService}
                branch={state.selectedBranch}
                selectedDate={state.selectedDate}
                selectedTime={state.selectedTime}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                onNext={handleNext}
                onBack={handleBack}
              />
            )}

            {state.step === 5 && (
              <Step5CustomerInfo
                key="step5"
                customerInfo={customerInfo}
                onSubmit={handleCustomerInfoSubmit}
                onBack={handleBack}
              />
            )}

            {state.step === 6 && (
              <Step6Confirmation
                key="step6"
                bookingCode={bookingCode}
                branch={state.selectedBranch}
                service={state.selectedService}
                staff={state.selectedStaff}
                date={state.selectedDate}
                time={state.selectedTime}
                customerInfo={customerInfo}
                onConfirm={handleBookingComplete}
                onBack={handleBack}
              />
            )}
          </AnimatePresence>
          </div>
        </ModernCard>
      </motion.div>
    </div>
  );
};

