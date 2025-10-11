'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, DocumentTextIcon, ChevronLeftIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/prometheus.css';

interface InterviewFormData {
  serviceType: 'generated' | 'actual' | '';
  packageId: string;
  universities: string[];
  contactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  personalStatement?: File | null;
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
    generatedPrice: 7,
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
    generatedPrice: 10,
    tutorPrice: 130,
    originalPrice: 150,
    popular: true,
    features: [
      '3 sets of University-specific mock questions',
      '+3 Prometheus mocks for self-practice',
      'Strategy Session with background knowledge',
      'Coverage of ethical scenarios and techniques',
      'Personalised feedback (tutor option)'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Interview Intensive',
    description: 'The ultimate interview preparation',
    interviews: 5,
    generatedPrice: 12,
    tutorPrice: 210,
    originalPrice: 270,
    features: [
      '5 sets of University-specific mock questions',
      '+5 Prometheus mocks for self-practice',
      '24/7 business phone support',
      'Premium booking and support',
      'Complete strategy session coverage'
    ]
  }
];

export default function InterviewsPaymentPage() {
  const [formData, setFormData] = useState<InterviewFormData>({
    serviceType: '',
    packageId: '',
    universities: [],
    contactDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    personalStatement: null,
    additionalNotes: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('package');
    const serviceType = urlParams.get('service') as 'generated' | 'actual' | null;

    if (packageId && serviceType) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        setFormData(prev => ({
          ...prev,
          serviceType,
          packageId
        }));
        setSelectedPackage(pkg);
        setCurrentStep(3); // Jump to university selection
      }
    }
  }, []);

  const handleServiceTypeChange = (serviceType: 'generated' | 'actual') => {
    setFormData(prev => ({ ...prev, serviceType }));
    setCurrentStep(2);
  };

  const handlePackageSelection = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    setFormData(prev => ({ ...prev, packageId }));
    setSelectedPackage(pkg || null);
    setCurrentStep(3);
  };

  const handleUniversityToggle = (universityId: string) => {
    if (!selectedPackage) return;
    
    setFormData(prev => {
      const isSelected = prev.universities.includes(universityId);
      let newUniversities;
      
      if (isSelected) {
        newUniversities = prev.universities.filter(id => id !== universityId);
      } else {
        // Check if we've reached the package limit
        const maxUniversities = selectedPackage.interviews;
        if (prev.universities.length < maxUniversities) {
          newUniversities = [...prev.universities, universityId];
        } else {
          // Replace the first one if at limit
          newUniversities = [...prev.universities.slice(1), universityId];
        }
      }
      
      return { ...prev, universities: newUniversities };
    });
  };

  const handleContactChange = (field: keyof InterviewFormData['contactDetails'], value: string) => {
    setFormData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value
      }
    }));
  };

  const canProceedToUniversities = () => {
    return formData.serviceType && formData.packageId && selectedPackage;
  };

  const canProceedToDetails = () => {
    return canProceedToUniversities() && formData.universities.length > 0;
  };

  const canProceedToPayment = () => {
    return canProceedToDetails() && 
           formData.contactDetails.firstName && 
           formData.contactDetails.lastName && 
           formData.contactDetails.email;
  };

  const calculatePrice = () => {
    if (selectedPackage && formData.serviceType) {
      return formData.serviceType === 'generated' ? selectedPackage.generatedPrice : selectedPackage.tutorPrice;
    }
    return 0;
  };

  const handleProceedToNext = () => {
    if (currentStep === 3 && canProceedToDetails()) {
      setCurrentStep(4);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedPackage) return;
    
    const bookingData = {
      serviceType: formData.serviceType,
      packageId: formData.packageId,
      universities: formData.universities,
      contactDetails: formData.contactDetails,
      price: calculatePrice().toString(),
      personalStatement: formData.personalStatement,
      notes: formData.additionalNotes || '',
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('interview_booking', JSON.stringify(bookingData));
    
    const params = new URLSearchParams({
      serviceType: formData.serviceType,
      packageId: formData.packageId,
      universities: formData.universities.join(','),
      price: calculatePrice().toString(),
      notes: formData.additionalNotes || '',
      firstName: formData.contactDetails.firstName,
      lastName: formData.contactDetails.lastName,
      email: formData.contactDetails.email,
      phone: formData.contactDetails.phone
    });

    console.log(`hey ${params.toString()}`);
    window.location.href = `/interviews/payment/complete?${params.toString()}`;
  };

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.name || '';
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
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
                  onClick={() => handleServiceTypeChange('generated')}
                  className={`p-8 rounded-lg border-2 text-left transition-all feature-card ${
                    formData.serviceType === 'generated'
                      ? 'border-green-500 bg-green-500/20 shadow-lg shadow-green-500/25'
                      : 'border-gray-600 bg-black/40 hover:border-green-400 hover:bg-green-500/10'
                  }`}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="text-2xl font-semibold mb-4 text-green-400">🤖 Generated Mock Questions</h4>
                  <ul className="space-y-3 text-gray-300 mb-6">
                    <li>• AI-powered question generation</li>
                    <li>• Instant access to practice materials</li>
                    <li>• University-specific questions</li>
                    <li>• Self-paced preparation</li>
                    <li>• Prometheus question bank access</li>
                  </ul>
                  <div className="text-2xl font-bold text-green-400">From £7</div>
                </motion.button>
                
                <motion.button
                  onClick={() => handleServiceTypeChange('actual')}
                  className={`p-8 rounded-lg border-2 text-left transition-all feature-card ${
                    formData.serviceType === 'actual'
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
                  <div className="text-2xl font-bold text-indigo-400">From £45</div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Package Selection */}
          {currentStep === 2 && formData.serviceType && (
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
                    onClick={() => handlePackageSelection(pkg.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all feature-card relative ${
                      formData.packageId === pkg.id
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
                        {formData.serviceType === 'generated' ? 'Generated Questions' : 'With Tutor'}
                      </div>
                      <div className="text-3xl font-bold text-indigo-400">
                        £{formData.serviceType === 'generated' ? pkg.generatedPrice : pkg.tutorPrice}
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
          )}

          {/* Step 3: University Selection */}
          {currentStep === 3 && canProceedToUniversities() && (
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
                  Choose up to {selectedPackage?.interviews} universities (selected: {formData.universities.length})
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {universities.map((university) => (
                  <motion.button
                    key={university.id}
                    onClick={() => handleUniversityToggle(university.id)}
                    className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                      formData.universities.includes(university.id)
                        ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/25'
                        : 'border-gray-600 bg-black/40 hover:border-indigo-400 hover:bg-indigo-500/10'
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-lg font-semibold">{university.name}</h4>
                      {formData.universities.includes(university.id) && (
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

              {formData.universities.length > 0 && (
                <div className="text-center">
                  <motion.button
                    onClick={handleProceedToNext}
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue to Contact Details
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 4: Contact Details & Checkout */}
          {currentStep === 4 && canProceedToDetails() && (
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
                    value={formData.contactDetails.firstName}
                    onChange={(e) => handleContactChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.contactDetails.lastName}
                    onChange={(e) => handleContactChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Enter your last name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.contactDetails.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contactDetails.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, personalStatement: e.target.files?.[0] || null }))}
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
                  value={formData.additionalNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
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
                      {formData.serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Sessions'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-semibold">{selectedPackage?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Universities:</span>
                    <span className="font-semibold text-right">
                      {formData.universities.map(id => getUniversityName(id)).join(', ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contact:</span>
                    <span className="font-semibold">
                      {formData.contactDetails.firstName} {formData.contactDetails.lastName}
                    </span>
                  </div>
                  {formData.personalStatement && (
                    <div className="flex justify-between">
                      <span>Personal Statement:</span>
                      <span className="font-semibold">{formData.personalStatement.name}</span>
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
                    onClick={handleProceedToPayment}
                    className="px-12 py-4 text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-xl shadow-indigo-500/30 glow-aurora"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Complete Purchase - £{calculatePrice()}
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}