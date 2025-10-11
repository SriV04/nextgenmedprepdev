'use client'

import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/prometheus.css';

// Import refactored components and hooks
import { usePaymentForm } from './hooks/usePaymentForm';
import Step1ServiceType from '../../../components/interview-payment/Step1ServiceType';
import Step2Package from '../../../components/interview-payment/Step2Package';
import Step3Universities from '../../../components/interview-payment/Step3Universities';
import Step4Contact from '../../../components/interview-payment/Step4Contact';

export default function InterviewsPaymentPage() {
  const {
    // State
    serviceType,
    packageId,
    universities,
    contact,
    personalStatement,
    additionalNotes,
    selectedPackage,
    currentStep,
    
    // Validation functions
    canProceedToUniversities,
    canProceedToDetails,
    canProceedToPayment,
    
    // Handlers
    handleServiceTypeChange,
    handlePackageSelection,
    handleUniversityToggle,
    handleContactChange,
    handleProceedToNext,
    handleProceedToPayment,
    goBack,
    setPersonalStatement,
    setAdditionalNotes,
    
    // Utilities
    calculatePrice
  } = usePaymentForm();

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Starfield background */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
        {Array.from({length: 144}).map((_, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              repeatType: "mirror", 
              delay: i * 0.01 % 3
            }}
            className="border border-indigo-500/20"
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/80 border-b border-indigo-500/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {currentStep > 1 ? (
              <button onClick={goBack} className="text-gray-400 hover:text-indigo-400 transition-colors">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            ) : (
              <Link href="/interviews" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
            )}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mock Interview Preparation</h1>
                <p className="text-gray-400">Powered by Prometheus Intelligence</p>
              </div>
            </div>
            <div className="ml-auto">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>Step {currentStep} of 4</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`w-2 h-2 rounded-full ${
                        step <= currentStep ? 'bg-indigo-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Service Type Selection */}
          {currentStep === 1 && (
            <Step1ServiceType
              serviceType={serviceType}
              onServiceTypeChange={handleServiceTypeChange}
            />
          )}

          {/* Step 2: Package Selection */}
          {currentStep === 2 && (
            <Step2Package
              serviceType={serviceType}
              packageId={packageId}
              onPackageSelect={handlePackageSelection}
            />
          )}

          {/* Step 3: University Selection */}
          {currentStep === 3 && canProceedToUniversities() && (
            <Step3Universities
              selectedUniversities={universities}
              selectedPackage={selectedPackage}
              onUniversityToggle={handleUniversityToggle}
              onProceedToNext={handleProceedToNext}
            />
          )}

          {/* Step 4: Contact Details & Checkout */}
          {currentStep === 4 && canProceedToDetails() && (
            <Step4Contact
              contact={contact}
              personalStatement={personalStatement}
              additionalNotes={additionalNotes}
              selectedPackage={selectedPackage}
              serviceType={serviceType}
              selectedUniversities={universities}
              calculatePrice={calculatePrice}
              canProceedToPayment={canProceedToPayment}
              onContactChange={handleContactChange}
              onPersonalStatementChange={setPersonalStatement}
              onAdditionalNotesChange={setAdditionalNotes}
              onProceedToPayment={handleProceedToPayment}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}