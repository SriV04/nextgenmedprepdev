'use client'

import { motion } from 'framer-motion';
import { ExtendedPackage } from '../../data/packages';

interface GeneratedMockInfoProps {
  selectedPackage: ExtendedPackage | null;
}

export default function GeneratedMockInfo({ selectedPackage }: GeneratedMockInfoProps) {
  if (!selectedPackage || !selectedPackage.generatedMocks) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-8 p-6 rounded-lg border border-green-500/30 bg-black/40"
    >
      <h3 className="text-xl font-semibold text-green-400 mb-4">
        {selectedPackage.generatedMocks.description}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Features:</h4>
          <ul className="space-y-2">
            {selectedPackage.generatedMocks.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 flex-shrink-0">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Benefits:</h4>
          <ul className="space-y-2">
            {selectedPackage.generatedMocks.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-300">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}