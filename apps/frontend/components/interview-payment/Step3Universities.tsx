'use client'

import { motion } from 'framer-motion';
import { universities } from '../../app/interviews/payment/data/packages';
import { Package } from '../../app/interviews/payment/hooks/usePaymentForm';

interface Step3UniversitiesProps {
  selectedUniversities: string[];
  selectedPackage: Package | null;
  onUniversityToggle: (universityId: string) => void;
  onProceedToNext: () => void;
}

export default function Step3Universities({ 
  selectedUniversities, 
  selectedPackage, 
  onUniversityToggle, 
  onProceedToNext 
}: Step3UniversitiesProps) {
  if (!selectedPackage) return null;

  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Select <span className="text-gradient-aurora">Universities</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Choose up to {selectedPackage.interviews} universities (selected: {selectedUniversities.length})
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {universities.map((university) => (
          <motion.button
            key={university.id}
            onClick={() => onUniversityToggle(university.id)}
            className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
              selectedUniversities.includes(university.id)
                ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold">{university.name}</h4>
              {selectedUniversities.includes(university.id) && (
                <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-3">{university.country}</p>
            <div className="flex flex-wrap gap-1">
              {university.interviewTypes.map((type) => (
                <span key={type} className="px-2 py-1 bg-gray-700 text-xs rounded text-gray-300">
                  {type.toUpperCase()}
                </span>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {selectedUniversities.length > 0 && (
        <div className="text-center">
          <motion.button
            onClick={onProceedToNext}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue to Contact Details
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}