'use client'

import { motion } from 'framer-motion';
import { packages, Package } from '../../app/interviews/payment/data/packages';

interface Step2PackageProps {
  serviceType: 'generated' | 'actual' | '';
  packageId: string;
  onPackageSelect: (packageId: string) => void;
}

export default function Step2Package({ serviceType, packageId, onPackageSelect }: Step2PackageProps) {
  if (!serviceType) return null;

  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Select Your <span className="text-gradient-aurora">Package</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Choose the package that best fits your preparation needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <motion.button
            key={pkg.id}
            onClick={() => onPackageSelect(pkg.id)}
            className={`p-6 rounded-lg border-2 text-left transition-all feature-card relative ${
              packageId === pkg.id
                ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
            }`}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            {pkg.popular && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                  POPULAR
                </span>
              </div>
            )}
            <h4 className="text-xl font-semibold mb-2">{pkg.name}</h4>
            <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
            <div className="text-center mb-4">
              <div className="text-sm text-gray-400">
                {serviceType === 'generated' ? 'Generated Questions' : 'With Tutor'}
              </div>
              <div className="text-3xl font-bold text-indigo-400">
                £{serviceType === 'generated' ? pkg.generatedPrice : pkg.tutorPrice}
              </div>
              {pkg.originalPrice && (
                <div className="text-sm text-gray-500 line-through">
                  £{pkg.originalPrice}
                </div>
              )}
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-green-400 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}