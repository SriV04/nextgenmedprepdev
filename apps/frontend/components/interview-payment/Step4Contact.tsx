'use client'

import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ContactDetails } from '../../app/interviews/payment/hooks/usePaymentForm';
import { ExtendedPackage } from '../../data/packages';
import { universities } from '@/data/universities';
import Link from 'next/link';
import { useState } from 'react';

interface Step4ContactProps {
  contact: ContactDetails;
  personalStatement: File | null;
  additionalNotes: string;
  selectedPackage: ExtendedPackage | null;
  serviceType: 'generated' | 'live' | '';
  selectedUniversities: string[];
  calculatePrice: () => number;
  canProceedToPayment: () => boolean;
  onContactChange: (field: keyof ContactDetails, value: string) => void;
  onPersonalStatementChange: (file: File | null) => void;
  onAdditionalNotesChange: (notes: string) => void;
  onProceedToPayment: () => void;
}

export default function Step4Contact({
  contact,
  personalStatement,
  additionalNotes,
  selectedPackage,
  serviceType,
  selectedUniversities,
  calculatePrice,
  canProceedToPayment,
  onContactChange,
  onPersonalStatementChange,
  onAdditionalNotesChange,
  onProceedToPayment
}: Step4ContactProps) {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  if (!selectedPackage) return null;

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.name || '';
  };

  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Contact <span className="text-gradient-aurora">Details</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Complete your booking information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={contact.firstName}
            onChange={(e) => onContactChange('firstName', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={contact.lastName}
            onChange={(e) => onContactChange('lastName', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter your last name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => onContactChange('email', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter your email address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={contact.phone}
            onChange={(e) => onContactChange('phone', e.target.value)}
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      {/* Field Selection: Medicine vs Dentistry */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Field of Study *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onContactChange('field', 'medicine')}
            className={`p-6 rounded-lg border-2 transition-all ${
              contact.field === 'medicine'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                : 'border-gray-600 bg-black/60 hover:border-indigo-400'
            }`}
          >
            <div className="text-4xl mb-2">🏥</div>
            <div className="text-xl font-bold text-white mb-1">Medicine</div>
            <div className="text-sm text-gray-400">Medical school interviews</div>
          </button>
          <button
            type="button"
            onClick={() => onContactChange('field', 'dentistry')}
            className={`p-6 rounded-lg border-2 transition-all ${
              contact.field === 'dentistry'
                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/20'
                : 'border-gray-600 bg-black/60 hover:border-indigo-400'
            }`}
          >
            <div className="text-4xl mb-2">🦷</div>
            <div className="text-xl font-bold text-white mb-1">Dentistry</div>
            <div className="text-sm text-gray-400">Dental school interviews</div>
          </button>
        </div>
      </div>
      
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <DocumentTextIcon className="w-4 h-4 inline mr-1" />
          Personal Statement (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-indigo-500 transition-colors">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => onPersonalStatementChange(e.target.files?.[0] || null)}
            className="hidden"
            id="personal-statement-upload"
          />
          <label 
            htmlFor="personal-statement-upload" 
            className="cursor-pointer block"
          >
            {personalStatement ? (
              <div className="space-y-2">
                <div className="text-green-400 text-4xl">✓</div>
                <p className="text-gray-300 font-medium">{personalStatement.name}</p>
                <p className="text-xs text-gray-400">
                  {(personalStatement.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  className="text-indigo-400 hover:text-indigo-300 text-sm underline"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-400 text-4xl">📄</div>
                <p className="text-gray-300 font-medium">
                  Click to upload your personal statement
                </p>
                <p className="text-xs text-gray-400">
                  PDF, DOC, or DOCX (Max 10MB)
                </p>
                <p className="text-xs text-indigo-400 mt-2">
                  Optional - helps us provide more personalized preparation
                </p>
              </div>
            )}
          </label>
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <DocumentTextIcon className="w-4 h-4 inline mr-1" />
          Additional Notes (Optional)
        </label>
        <textarea
          rows={4}
          value={additionalNotes}
          onChange={(e) => onAdditionalNotesChange(e.target.value)}
          placeholder="Any specific areas you'd like to focus on, concerns, or scheduling preferences..."
          className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
        />
      </div>

      {/* Booking Summary */}
      <div className="bg-black/60 border border-indigo-500/30 rounded-lg p-6 backdrop-blur-sm mb-8">
        <h4 className="text-xl font-bold mb-4 text-indigo-400">Booking Summary</h4>
        <div className="space-y-3 text-gray-300">
          <div className="flex justify-between">
            <span>Service Type:</span>
            <span className="font-semibold">
              {serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Sessions'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Package:</span>
            <span className="font-semibold">{selectedPackage.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Universities:</span>
            <span className="font-semibold text-right">
              {selectedUniversities.map(id => getUniversityName(id)).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Contact:</span>
            <span className="font-semibold">
              {contact.firstName} {contact.lastName}
            </span>
          </div>
          {personalStatement && (
            <div className="flex justify-between">
              <span>Personal Statement:</span>
              <span className="font-semibold">{personalStatement.name}</span>
            </div>
          )}
          <div className="border-t border-gray-600 pt-3 mt-4">
            <div className="flex justify-between text-2xl font-bold">
              <span>Total Price:</span>
              <span className="text-indigo-400">£{calculatePrice()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-yellow-900/20 border-2 border-yellow-500/50 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="terms-checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-yellow-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-gray-900 cursor-pointer"
          />
          <label htmlFor="terms-checkbox" className="text-gray-200 text-sm cursor-pointer">
            I have read and agree to the{' '}
            <Link 
              href="/interviews/terms" 
              target="_blank"
              className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
            >
              Terms and Conditions
            </Link>
            , including the <span className="text-yellow-300 font-semibold">no refund policy</span> and{' '}
            <span className="text-yellow-300 font-semibold">24-hour rescheduling restriction</span>. *
          </label>
        </div>
      </div>

      {canProceedToPayment() && (
        <div className="text-center">
          <motion.button
            onClick={onProceedToPayment}
            disabled={!acceptedTerms}
            className={`px-12 py-4 text-xl font-bold rounded-lg transition-all shadow-xl ${
              acceptedTerms
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-indigo-500/30 glow-aurora cursor-pointer'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
            }`}
            whileHover={acceptedTerms ? { scale: 1.05 } : {}}
            whileTap={acceptedTerms ? { scale: 0.98 } : {}}
          >
            Complete Purchase - £{calculatePrice()}
          </motion.button>
          {!acceptedTerms && (
            <p className="text-yellow-400 text-sm mt-3">
              Please accept the terms and conditions to continue
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}