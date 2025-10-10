'use client'

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, UsersIcon, AcademicCapIcon, ClipboardDocumentListIcon, UserIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import '@/styles/prometheus.css';

interface InterviewFormData {
  packageType: 'single' | 'multiple' | '';
  serviceType: 'generated' | 'actual' | '';
  universities: string[];
  contactDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  preferredDate?: string;
  additionalNotes?: string;
  packageId?: string;
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
    packageType: '',
    serviceType: '',
    universities: [],
    contactDetails: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    preferredDate: '',
    additionalNotes: '',
    packageId: ''
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  // Refs for smooth scrolling
  const packageRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const universitiesRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start',
      inline: 'nearest'
    });
  };

  const handlePackageTypeChange = (packageType: 'single' | 'multiple') => {
    setFormData(prev => ({ 
      ...prev, 
      packageType,
      packageId: packageType === 'single' ? '' : prev.packageId,
      universities: packageType === 'single' ? prev.universities.slice(0, 1) : prev.universities
    }));
    
    // Auto-scroll to service type section
    setTimeout(() => scrollToSection(serviceRef), 300);
  };

  const handleServiceTypeChange = (serviceType: 'generated' | 'actual') => {
    setFormData(prev => ({ ...prev, serviceType }));
    
    // Auto-scroll to universities section
    setTimeout(() => scrollToSection(universitiesRef), 300);
  };

  const handleUniversityToggle = (universityId: string) => {
    setFormData(prev => {
      const isSelected = prev.universities.includes(universityId);
      let newUniversities;
      
      if (isSelected) {
        newUniversities = prev.universities.filter(id => id !== universityId);
      } else {
        if (prev.packageType === 'single') {
          newUniversities = [universityId]; // Replace if single
        } else {
          newUniversities = [...prev.universities, universityId]; // Add if multiple
        }
      }
      
      return { ...prev, universities: newUniversities };
    });
  };

  const handlePackageSelection = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    setFormData(prev => ({ ...prev, packageId }));
    setSelectedPackage(pkg || null);
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

  const canShowServiceSection = () => formData.packageType;
  const canShowUniversitiesSection = () => formData.packageType && formData.serviceType;
  const canShowDetailsSection = () => formData.packageType && formData.serviceType && formData.universities.length > 0;
  const canShowCheckoutSection = () => {
    return canShowDetailsSection() && 
           formData.contactDetails.firstName && 
           formData.contactDetails.lastName && 
           formData.contactDetails.email &&
           (formData.packageType === 'single' || formData.packageId);
  };

  const calculatePrice = () => {
    if (formData.packageType === 'multiple' && selectedPackage) {
      return formData.serviceType === 'generated' ? selectedPackage.generatedPrice : selectedPackage.tutorPrice;
    } else if (formData.packageType === 'single') {
      // Base price for single session
      const basePrice = formData.serviceType === 'generated' ? 25 : 89;
      return basePrice * formData.universities.length;
    }
    return 0;
  };

  const handleProceedToPayment = () => {
    const bookingData = {
      packageType: formData.packageType,
      serviceType: formData.serviceType,
      universities: formData.universities,
      contactDetails: formData.contactDetails,
      packageId: formData.packageId || '',
      price: calculatePrice().toString(),
      preferredDate: formData.preferredDate || '',
      notes: formData.additionalNotes || '',
      timestamp: new Date().toISOString()
    };
    
    sessionStorage.setItem('interview_booking', JSON.stringify(bookingData));
    
    const params = new URLSearchParams({
      packageType: formData.packageType,
      serviceType: formData.serviceType,
      universities: formData.universities.join(','),
      packageId: formData.packageId || '',
      price: calculatePrice().toString(),
      preferredDate: formData.preferredDate || '',
      notes: formData.additionalNotes || '',
      firstName: formData.contactDetails.firstName,
      lastName: formData.contactDetails.lastName,
      email: formData.contactDetails.email,
      phone: formData.contactDetails.phone
    });
    window.location.href = `/interviews/payment/complete?${params.toString()}`;
  };

  const getUniversityName = (id: string) => {
    const university = universities.find(uni => uni.id === id);
    return university?.name || '';
  };

  // Auto-scroll to next section after university selection
  useEffect(() => {
    if (canShowDetailsSection()) {
      setTimeout(() => scrollToSection(detailsRef), 300);
    }
  }, [formData.universities]);

  // Auto-scroll to checkout after contact details
  useEffect(() => {
    if (canShowCheckoutSection()) {
      setTimeout(() => scrollToSection(checkoutRef), 300);
    }
  }, [formData.contactDetails.firstName, formData.contactDetails.lastName, formData.contactDetails.email, formData.packageId]);

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

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient-aurora">Interview</span> Preparation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tailored mock interviews for medical school applications
          </p>
        </div>

        {/* Step 1: Package Type Selection */}
        <motion.div
          ref={packageRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-indigo-400" />
            1. Choose Your Package Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => handlePackageTypeChange('single')}
              className={`p-6 rounded-lg border-2 text-center transition-all feature-card ${
                formData.packageType === 'single'
                  ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                  : 'border-gray-600 bg-black/40 hover:border-purple-400 hover:bg-purple-500/10'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <h4 className="text-xl font-semibold mb-3 text-purple-400">Single Session</h4>
              <p className="text-gray-300 mb-4">Perfect for targeted practice</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Choose one university</li>
                <li>• Focused preparation</li>
                <li>• Flexible scheduling</li>
              </ul>
            </motion.button>
            
            <motion.button
              onClick={() => handlePackageTypeChange('multiple')}
              className={`p-6 rounded-lg border-2 text-center transition-all feature-card ${
                formData.packageType === 'multiple'
                  ? 'border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/25'
                  : 'border-gray-600 bg-black/40 hover:border-yellow-400 hover:bg-yellow-500/10'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <h4 className="text-xl font-semibold mb-3 text-yellow-400">Package Deal</h4>
              <p className="text-gray-300 mb-4">Save money with multiple sessions</p>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Multiple universities</li>
                <li>• Significant savings</li>
                <li>• Comprehensive preparation</li>
              </ul>
            </motion.button>
          </div>
        </motion.div>

        {/* Step 2: Service Type Selection */}
        {canShowServiceSection() && (
          <motion.div
            ref={serviceRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold flex items-center">
              <VideoCameraIcon className="w-8 h-8 mr-3 text-indigo-400" />
              2. Select Service Type
            </h3>
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
                <div className="mt-4 text-lg font-bold text-green-400">From £25</div>
              </motion.button>
              
              <motion.button
                onClick={() => handleServiceTypeChange('actual')}
                className={`p-6 rounded-lg border-2 text-left transition-all feature-card ${
                  formData.serviceType === 'actual'
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
                <div className="mt-4 text-lg font-bold text-indigo-400">From £89</div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Step 3: University Selection */}
        {canShowUniversitiesSection() && (
          <motion.div
            ref={universitiesRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold flex items-center mb-2">
                <AcademicCapIcon className="w-8 h-8 mr-3 text-indigo-400" />
                3. Select {formData.packageType === 'single' ? 'Your Target' : 'Target'} Universities
              </h3>
              <p className="text-gray-400">
                {formData.packageType === 'single' 
                  ? 'Choose one university for focused preparation'
                  : 'Select multiple universities for comprehensive preparation'
                }
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            {formData.packageType === 'multiple' && formData.universities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-400 font-semibold mb-2">💰 Package Savings Available</h4>
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
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Step 4: Contact Details and Scheduling */}
        {canShowDetailsSection() && (
          <motion.div
            ref={detailsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold flex items-center">
              <UserIcon className="w-8 h-8 mr-3 text-indigo-400" />
              4. Contact Details & Scheduling
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <CalendarIcon className="w-4 h-4 inline mr-1" />
                  Preferred Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>
            
            <div>
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
          </motion.div>
        )}

        {/* Step 5: Checkout */}
        {canShowCheckoutSection() && (
          <motion.div
            ref={checkoutRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold flex items-center">
              <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-indigo-400" />
              5. Review & Checkout
            </h3>
            
            {/* Booking Summary */}
            <div className="bg-black/60 border border-indigo-500/30 rounded-lg p-6 backdrop-blur-sm">
              <h4 className="text-xl font-bold mb-4 text-indigo-400">Booking Summary</h4>
              <div className="space-y-3 text-gray-300">
                <div className="flex justify-between">
                  <span>Package Type:</span>
                  <span className="font-semibold capitalize">{formData.packageType} Session{formData.packageType === 'multiple' ? 's' : ''}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Type:</span>
                  <span className="font-semibold capitalize">
                    {formData.serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Session'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Universities:</span>
                  <span className="font-semibold text-right">
                    {formData.universities.map(id => getUniversityName(id)).join(', ')}
                  </span>
                </div>
                {formData.packageType === 'multiple' && selectedPackage && (
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <span className="font-semibold">{selectedPackage.name}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Contact:</span>
                  <span className="font-semibold">
                    {formData.contactDetails.firstName} {formData.contactDetails.lastName}
                  </span>
                </div>
                {formData.preferredDate && (
                  <div className="flex justify-between">
                    <span>Preferred Date:</span>
                    <span className="font-semibold">{formData.preferredDate}</span>
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

            {/* Checkout Button */}
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
          </motion.div>
        )}
      </div>
    </main>
  );
}