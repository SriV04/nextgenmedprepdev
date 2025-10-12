'use client'

import { motion } from 'framer-motion';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ContactDetails } from '../../app/interviews/payment/hooks/usePaymentForm';
import { ExtendedPackage } from '../../app/interviews/data/interviewPackages';
import { universities } from '../../app/interviews/payment/data/packages';

interface Step4ContactProps {
  contact: ContactDetails;
  personalStatement: File | null;
  additionalNotes: string;
  selectedPackage: ExtendedPackage | null;
  serviceType: 'generated' | 'actual' | '';
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
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <DocumentTextIcon className="w-4 h-4 inline mr-1" />
            Personal Statement (Optional)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => onPersonalStatementChange(e.target.files?.[0] || null)}
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-xs text-gray-400 mt-1">Upload your personal statement for personalised interview preparation (PDF, DOC, DOCX)</p>
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

      {canProceedToPayment() && (
        <div className="text-center">
          <motion.button
            onClick={onProceedToPayment}
            className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/30 glow-aurora"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Complete Purchase - £{calculatePrice()}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}