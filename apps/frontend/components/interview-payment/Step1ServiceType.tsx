'use client'

import { motion } from 'framer-motion';
import { interviewPackages } from '../../data/packages';

interface Step1ServiceTypeProps {
  serviceType: 'generated' | 'actual' | '';
  onServiceTypeChange: (serviceType: 'generated' | 'actual') => void;
}

export default function Step1ServiceType({ serviceType, onServiceTypeChange }: Step1ServiceTypeProps) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Choose Your <span className="text-gradient-aurora">Interview</span> Type
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Select the type of mock interview preparation you need
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.button
          onClick={() => onServiceTypeChange('generated')}
          className={`p-8 rounded-lg border-2 text-left transition-all feature-card ${
            serviceType === 'generated'
              ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
              : 'border-gray-600 bg-black/40 hover:border-green-400 hover:bg-green-500/10'
          }`}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <h4 className="text-2xl font-semibold mb-4 text-green-400">🤖 Generated Mock Questions</h4>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li>• AI-powered Prometheus question generation</li>
            <li>• Instant access to practice materials</li>
            <li>• University-specific questions</li>
            <li>• Self-paced preparation</li>
            <li>• Detailed model answers included</li>
          </ul>
          <div className="text-2xl font-bold text-green-400">From £{interviewPackages[0].generatedPrice}</div>
        </motion.button>
        
        <motion.button
          onClick={() => onServiceTypeChange('actual')}
          className={`p-8 rounded-lg border-2 text-left transition-all feature-card ${
            serviceType === 'actual'
              ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
              : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
          }`}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
        >
          <h4 className="text-2xl font-semibold mb-4 text-indigo-400">👨‍🎓 Live Tutor Sessions</h4>
          <ul className="space-y-3 text-gray-300 mb-6">
            <li>• One-on-one with experienced tutors</li>
            <li>• Real-time feedback and guidance</li>
            <li>• Personalised coaching session</li>
            <li>• Current medical students as tutors</li>
            <li>• Interactive interview simulation</li>
          </ul>
          <div className="text-2xl font-bold text-indigo-400">From £{interviewPackages[0].tutorPrice}</div>
        </motion.button>
      </div>
    </motion.div>
  );
}