'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, UsersIcon, AcademicCapIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import '@/styles/prometheus.css';

interface InterviewFormData {
  university: string;
  interviewType: string;
  serviceType: 'generated' | 'tutor' | '';
  packageType: 'individual' | 'package' | '';
  packageId?: string;
  preferredDate?: string;
  additionalNotes?: string;
}

interface University {
  id: string;
  name: string;
  country: string;
  interviewTypes: string[];
}

interface InterviewType {
  id: string;
  name: string;
  description: string;
  duration: string;
  generatedPrice: number;
  tutorPrice: number;
}

interface Package {
  id: string;
  name: string;
  description: string;
  interviews: number;
  generatedPrice: number;
  tutorPrice: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
}

const universities: University[] = [
  {
    id: 'oxford',
    name: 'University of Oxford',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional', 'panel']
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    country: 'UK',
    interviewTypes: ['traditional', 'panel']
  },
  {
    id: 'imperial',
    name: 'Imperial College London',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional']
  },
  {
    id: 'ucl',
    name: 'University College London',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional']
  },
  {
    id: 'kings',
    name: "King's College London",
    country: 'UK',
    interviewTypes: ['mmi', 'traditional', 'panel']
  },
  {
    id: 'edinburgh',
    name: 'University of Edinburgh',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional']
  },
  {
    id: 'glasgow',
    name: 'University of Glasgow',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional']
  },
  {
    id: 'manchester',
    name: 'University of Manchester',
    country: 'UK',
    interviewTypes: ['mmi']
  }
];

const interviewTypes: InterviewType[] = [
  {
    id: 'mmi',
    name: 'Multiple Mini Interview (MMI)',
    description: 'Practice with realistic MMI stations covering ethical scenarios, communication tasks, and problem-solving.',
    duration: '60 minutes',
    generatedPrice: 15,
    tutorPrice: 89
  },
  {
    id: 'traditional',
    name: 'Traditional Interview',
    description: 'One-on-one interview practice focusing on motivation, personal statement, and medical knowledge.',
    duration: '90 minutes',
    generatedPrice: 20,
    tutorPrice: 129
  },
  {
    id: 'panel',
    name: 'Panel Interview',
    description: 'Simulation with multiple interviewers to practice handling pressure and diverse questioning styles.',
    duration: '120 minutes',
    generatedPrice: 25,
    tutorPrice: 199
  }
];

const packages: Package[] = [
  {
    id: 'essentials',
    name: 'Essentials Package',
    description: 'Perfect for individual interview practice',
    interviews: 1,
    generatedPrice: 45,
    tutorPrice: 45,
    features: [
      'A mock interview tailored to your university',
      'Using our Prometheus Question bank',
      'Realistic interview simulation',
      'Match with experienced tutor (tutor option)',
      'Instant access to questions (generated option)'
    ]
  },
  {
    id: 'core',
    name: 'Core Interview Preparation',
    description: 'Comprehensive interview training',
    interviews: 3,
    generatedPrice: 99,
    tutorPrice: 130,
    originalPrice: 150,
    popular: true,
    features: [
      '3 University-specific mock interviews',
      '+3 Prometheus mocks for self-practice',
      'Strategy Session with background knowledge',
      'Coverage of ethical scenarios and techniques',
      'Personalized feedback (tutor option)'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Interview Intensive',
    description: 'The ultimate interview preparation',
    interviews: 5,
    generatedPrice: 159,
    tutorPrice: 210,
    originalPrice: 270,
    features: [
      '5 University-specific mock interviews',
      '+5 Prometheus mocks for self-practice',
      '24/7 business phone support',
      'Premium booking and support',
      'Complete strategy session coverage'
    ]
  }
];

export default function InterviewsPaymentPage() {
  const [formData, setFormData] = useState<InterviewFormData>({
    university: '',
    interviewType: '',
    serviceType: '',
    packageType: '',
    packageId: '',
    preferredDate: '',
    additionalNotes: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedInterviewType, setSelectedInterviewType] = useState<InterviewType | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const handleUniversityChange = (universityId: string) => {
    setFormData(prev => ({ 
      ...prev, 
      university: universityId,
      interviewType: '', // Reset interview type when university changes
      packageType: '',
      packageId: ''
    }));
  };

  const handleInterviewTypeChange = (interviewTypeId: string) => {
    const interviewType = interviewTypes.find(type => type.id === interviewTypeId);
    setFormData(prev => ({ ...prev, interviewType: interviewTypeId }));
    setSelectedInterviewType(interviewType || null);
  };

  const handleServiceTypeChange = (serviceType: 'generated' | 'tutor') => {
    setFormData(prev => ({ ...prev, serviceType }));
  };

  const handlePackageTypeChange = (packageType: 'individual' | 'package') => {
    setFormData(prev => ({ 
      ...prev, 
      packageType,
      packageId: packageType === 'individual' ? '' : prev.packageId
    }));
    if (packageType === 'individual') {
      setSelectedPackage(null);
    }
  };

  const handlePackageSelection = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    setFormData(prev => ({ ...prev, packageId }));
    setSelectedPackage(pkg || null);
  };

  const handleNextStep = () => {
    if (currentStep === 1 && formData.university && formData.interviewType && formData.serviceType) {
      if (formData.packageType === 'package' && !formData.packageId) return;
      setCurrentStep(2);
    }
  };

  const calculatePrice = () => {
    if (formData.packageType === 'package' && selectedPackage) {
      return formData.serviceType === 'generated' ? selectedPackage.generatedPrice : selectedPackage.tutorPrice;
    } else if (formData.packageType === 'individual' && selectedInterviewType) {
      return formData.serviceType === 'generated' ? selectedInterviewType.generatedPrice : selectedInterviewType.tutorPrice;
    }
    return 0;
  };

  const handleProceedToPayment = () => {
    // Store booking details in sessionStorage for payment completion
    const bookingData = {
      university: formData.university,
      interviewType: formData.interviewType,
      serviceType: formData.serviceType,
      packageType: formData.packageType,
      packageId: formData.packageId || '',
      price: calculatePrice().toString(),
      preferredDate: formData.preferredDate || '',
      notes: formData.additionalNotes || '',
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('interview_booking', JSON.stringify(bookingData));
    
    const params = new URLSearchParams({
      university: formData.university,
      interviewType: formData.interviewType,
      serviceType: formData.serviceType,
      packageType: formData.packageType,
      packageId: formData.packageId || '',
      price: calculatePrice().toString(),
      preferredDate: formData.preferredDate || '',
      notes: formData.additionalNotes || ''
    });
    window.location.href = `/interviews/payment/complete?${params.toString()}`;
  };

  const getAvailableInterviewTypes = () => {
    if (!formData.university) return [];
    const university = universities.find(uni => uni.id === formData.university);
    if (!university) return [];
    return interviewTypes.filter(type => university.interviewTypes.includes(type.id));
  };

  const getUniversityName = () => {
    const university = universities.find(uni => uni.id === formData.university);
    return university?.name || '';
  };

  const canProceedToStep2 = () => {
    return formData.university && 
           formData.interviewType && 
           formData.serviceType &&
           formData.packageType &&
           (formData.packageType === 'individual' || formData.packageId);
  };

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
            <Link href="/interviews" className="text-gray-400 hover:text-indigo-400 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Mock Interview Preparation</h1>
                <p className="text-gray-400">Powered by Prometheus Intelligence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 1 ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-600 text-gray-400'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep >= 1 ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              1
            </motion.div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-indigo-500' : 'bg-gray-600'} transition-all duration-300`} />
            <motion.div 
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                currentStep >= 2 ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-gray-600 text-gray-400'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep >= 2 ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              2
            </motion.div>
          </div>
          <div className="flex justify-between max-w-xs mx-auto mt-2 text-sm text-gray-400">
            <span>Select Details</span>
            <span>Complete Booking</span>
          </div>
        </div>

        {currentStep === 1 ? (
          /* Step 1: University, Interview Type, Service Type, and Package Selection */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Choose Your <span className="text-gradient-aurora">Interview</span> Preparation
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Select your target university, interview format, and service type
              </p>
            </div>

            {/* University Selection */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <AcademicCapIcon className="w-8 h-8 mr-3 text-indigo-400" />
                Select Your Target University
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {universities.map((university) => (
                  <motion.button
                    key={university.id}
                    onClick={() => handleUniversityChange(university.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                      formData.university === university.id
                        ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-lg font-semibold mb-2">{university.name}</h4>
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
            </div>

            {/* Interview Type Selection */}
            {formData.university && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-indigo-400" />
                  Choose Interview Type
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {getAvailableInterviewTypes().map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() => handleInterviewTypeChange(type.id)}
                      className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                        formData.interviewType === type.id
                          ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                          : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-semibold">{type.name}</h4>
                        <div className="text-sm text-gray-400">{type.duration}</div>
                      </div>
                      <p className="text-gray-300 mb-4">{type.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 p-3 rounded border border-gray-600">
                          <div className="text-sm text-gray-400">Generated Questions</div>
                          <div className="text-lg font-bold text-green-400">£{type.generatedPrice}</div>
                        </div>
                        <div className="bg-black/40 p-3 rounded border border-gray-600">
                          <div className="text-sm text-gray-400">With Tutor</div>
                          <div className="text-lg font-bold text-indigo-400">£{type.tutorPrice}</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Service Type Selection */}
            {formData.interviewType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold mb-6">Select Service Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.button
                    onClick={() => handleServiceTypeChange('generated')}
                    className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                      formData.serviceType === 'generated'
                        ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-green-400 hover:bg-green-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-green-400">🤖 Generated Mock Questions</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• AI-powered question generation</li>
                      <li>• Instant access to practice materials</li>
                      <li>• University-specific questions</li>
                      <li>• Self-paced preparation</li>
                      <li>• Prometheus question bank access</li>
                    </ul>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handleServiceTypeChange('tutor')}
                    className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                      formData.serviceType === 'tutor'
                        ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-indigo-400">👨‍🎓 Live Tutor Session</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• One-on-one with experienced tutors</li>
                      <li>• Real-time feedback and guidance</li>
                      <li>• Personalized coaching session</li>
                      <li>• Current medical students as tutors</li>
                      <li>• Interactive interview simulation</li>
                    </ul>
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Package Type Selection */}
            {formData.serviceType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12"
              >
                <h3 className="text-2xl font-bold mb-6">Choose Package Option</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <motion.button
                    onClick={() => handlePackageTypeChange('individual')}
                    className={`p-6 rounded-lg border-2 text-center transition-all feature-card ${
                      formData.packageType === 'individual'
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-purple-400 hover:bg-purple-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-purple-400">Single Session</h4>
                    <p className="text-gray-300">Perfect for targeted practice</p>
                  </motion.button>
                  
                  <motion.button
                    onClick={() => handlePackageTypeChange('package')}
                    className={`p-6 rounded-lg border-2 text-center transition-all feature-card ${
                      formData.packageType === 'package'
                        ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-yellow-400 hover:bg-yellow-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="text-xl font-semibold mb-3 text-yellow-400">Package Deal</h4>
                    <p className="text-gray-300">Save money with multiple sessions</p>
                  </motion.button>
                </div>

                {/* Package Selection */}
                {formData.packageType === 'package' && (
                  <>
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <h4 className="text-green-400 font-semibold mb-2">💰 Package Savings</h4>
                      <p className="text-gray-300 text-sm">
                        Package deals offer significant savings compared to booking individual sessions. 
                        The more sessions you book, the more you save!
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {packages.map((pkg) => (
                      <motion.button
                        key={pkg.id}
                        onClick={() => handlePackageSelection(pkg.id)}
                        className={`p-6 rounded-lg border-2 text-left transition-all feature-card relative ${
                          formData.packageId === pkg.id
                            ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                            : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-2 -right-2">
                            <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-2 py-1 rounded-full">
                              POPULAR
                            </span>
                          </div>
                        )}
                        <h4 className="text-lg font-semibold mb-2">{pkg.name}</h4>
                        <p className="text-gray-400 text-sm mb-4">{pkg.description}</p>
                        <div className="text-center mb-4">
                          <div className="text-sm text-gray-400">
                            {formData.serviceType === 'generated' ? 'Generated Questions' : 'With Tutor'}
                          </div>
                          <div className="text-2xl font-bold text-indigo-400">
                            £{formData.serviceType === 'generated' ? pkg.generatedPrice : pkg.tutorPrice}
                          </div>
                          {pkg.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              £{pkg.originalPrice}
                            </div>
                          )}
                        </div>
                        <ul className="space-y-1 text-gray-300 text-xs">
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
                  </>
                )}
              </motion.div>
            )}

            {/* Next Step Button */}
            {canProceedToStep2() && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <motion.button
                  onClick={handleNextStep}
                  className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/30 glow-aurora"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Details →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Step 2: Additional Details and Confirmation */
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Complete Your Booking</h2>
              <p className="text-gray-300">Add final details for your interview preparation session</p>
            </div>

            {/* Booking Summary */}
            <div className="bg-black/60 border border-indigo-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
              <h3 className="text-xl font-bold mb-4 text-indigo-400">Booking Summary</h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>University:</span>
                  <span className="font-semibold">{getUniversityName()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interview Type:</span>
                  <span className="font-semibold">{selectedInterviewType?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Type:</span>
                  <span className="font-semibold capitalize">
                    {formData.serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Session'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Package:</span>
                  <span className="font-semibold">
                    {formData.packageType === 'package' ? selectedPackage?.name : 'Single Session'}
                  </span>
                </div>
                {formData.packageType === 'package' && selectedPackage && (
                  <div className="flex justify-between">
                    <span>Sessions Included:</span>
                    <span className="font-semibold">{selectedPackage.interviews}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-semibold">{selectedInterviewType?.duration}</span>
                </div>
                <div className="border-t border-gray-600 pt-2 mt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Price:</span>
                    <span className="text-indigo-400">£{calculatePrice()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details Form */}
            <div className="bg-black/40 border border-gray-600 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-6">Additional Details</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Preferred Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                    placeholder="Any specific areas you'd like to focus on, concerns, or scheduling preferences..."
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <motion.button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 hover:text-white transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ← Back
              </motion.button>
              <motion.button
                onClick={handleProceedToPayment}
                className="px-12 py-3 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/30 glow-aurora"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Complete Purchase - £{calculatePrice()}
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}