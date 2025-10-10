'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon, CheckIcon, UserIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../../components/payment/PaymentForm';

interface UCATPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  color: string;
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const ucatPackages: { [key: string]: UCATPackage } = {
  'ucat_kickstart': {
    id: 'ucat_kickstart',
    name: 'UCAT Kickstart',
    price: 200,
    currency: 'GBP',
    description: 'For those ready to build strong foundations.',
    color: 'bg-blue-500',
    features: [
      '4 hours of essential background knowledge across all UCAT sections',
      '24/7 access to our Business Line – ask questions anytime, send in tricky problems, and receive step-by-step video solutions',
      'Tracked quantitative performance – every question you complete feeds into our analytics',
      'Personalised content plan – weekly text messages guide your revision using performance data',
      'After one session all our students thus far saw a 15% or more increase in score across all areas',
      'Data-driven intervention on weak areas begins from day one'
    ]
  },
  'ucat_advance': {
    id: 'ucat_advance',
    name: 'UCAT Advance',
    price: 375,
    currency: 'GBP',
    description: 'For those who want to refine and target performance.',
    color: 'bg-purple-600',
    features: [
      'Everything in Kickstart package',
      '8 hours of targeted question-specific perfection sessions',
      'Deep-dives into the exact areas the data shows you\'re weakest in based on the data from our tracking system',
      'Smart drills and focused practice to convert weaknesses into strengths',
      'Increased data input = sharper, more accurate performance tracking'
    ]
  },
  'ucat_mastery': {
    id: 'ucat_mastery',
    name: 'UCAT Mastery',
    price: 550,
    currency: 'GBP',
    description: 'For those aiming for top 10% scores.',
    color: 'bg-indigo-600',
    features: [
      'Everything in Advance package',
      '12 hours of high-intensity question-perfection sessions based on your data',
      'Double the time, double the refinement – a laser-focused approach to peak performance',
      'Designed to bring students to test-day readiness with total confidence'
    ]
  }
};

function UCATPaymentContent() {
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<UCATPackage | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const packageId = searchParams.get('package');
    if (packageId && ucatPackages[packageId]) {
      setSelectedPackage(ucatPackages[packageId]);
    } else {
      // Default to kickstart if no package specified
      setSelectedPackage(ucatPackages['ucat_kickstart']);
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    console.log('UCAT payment successful');
    // Clear stored details
    sessionStorage.removeItem('ucat_booking_details');
    // Redirect to success page with UCAT details
    const successUrl = `/payment/success?service=ucat&package=${selectedPackage?.id}&price=${selectedPackage?.price}`;
    window.location.href = successUrl;
  };

  const handlePaymentError = (error: string) => {
    console.error('UCAT payment error:', error);
  };

  const isCustomerDetailsValid = () => {
    return customerDetails.firstName.trim() !== '' && 
           customerDetails.lastName.trim() !== '' && 
           customerDetails.email.trim() !== '' && 
           customerDetails.email.includes('@');
  };

  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToPayment = () => {
    if (isCustomerDetailsValid() && selectedPackage) {
      // Store booking details in session storage
      const bookingData = {
        package: selectedPackage,
        customerDetails,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('ucat_booking_details', JSON.stringify(bookingData));
      setCurrentStep(2);
    }
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/ucat" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <AcademicCapIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UCAT Tutoring Package</h1>
                <p className="text-gray-600">Complete your purchase to start your UCAT preparation journey</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Package Overview */}
          <div className="space-y-8">
            {/* Package Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className={`${selectedPackage.color} p-6 text-white`}>
                <h2 className="text-3xl font-bold mb-2">{selectedPackage.name}</h2>
                <p className="text-xl opacity-90">{selectedPackage.description}</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">£{selectedPackage.price}</span>
                  <span className="ml-2 text-lg opacity-80">one-time payment</span>
                </div>
              </div>
            </div>

            {/* Package Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What's Included</h3>
              <div className="space-y-4">
                {selectedPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Benefits */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border border-blue-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">All Packages Include</h3>
              <div className="grid gap-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Tutors scored in the top 1% internationally</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Continuous updated question bank with worked examples</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Free cheat sheets for each area, including the best approaches</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-3">✓</span>
                  <span>Personalised 10-week action plan tailored to your strengths and weaknesses</span>
                </div>
              </div>
            </div>

            {/* Package Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Want a different package?</h3>
              <div className="grid gap-3">
                {Object.values(ucatPackages).map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                      selectedPackage.id === pkg.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-gray-900">{pkg.name}</div>
                        <div className="text-sm text-gray-600">{pkg.description}</div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">£{pkg.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-8">
            {currentStep === 1 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Your Details
                  </h2>
                  <p className="text-gray-600">
                    Please provide your contact information to proceed with your UCAT package purchase.
                  </p>
                </div>

                {/* Customer Details Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerDetailsChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) => handleCustomerDetailsChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!isCustomerDetailsValid()}
                    className={`w-full mt-8 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isCustomerDetailsValid()
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Proceed to Payment - £{selectedPackage.price}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Complete Your Purchase
                  </h2>
                  <p className="text-gray-600">
                    Secure checkout powered by Stripe. Start your UCAT preparation today.
                  </p>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    ← Edit Contact Details
                  </button>
                </div>
                
                <PaymentForm
                  key={selectedPackage.id} // Force re-render when package changes
                  selectedPackage={{
                    id: selectedPackage.id,
                    name: selectedPackage.name,
                    price: selectedPackage.price,
                    currency: selectedPackage.currency,
                    description: `${selectedPackage.name} - ${selectedPackage.description}`
                  }}
                  initialData={{
                    customer_email: customerDetails.email,
                    customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                    metadata: {
                      type: 'ucat_tutoring',
                      package_id: selectedPackage.id,
                      package_name: selectedPackage.name,
                      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                      customer_email: customerDetails.email,
                      customer_phone: customerDetails.phone
                    }
                  }}
                  onError={handlePaymentError}
                />
              </>
            )}

            {/* Trust Signals */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Why Choose NextGen MedPrep?</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Proven track record: 92% of students improve their scores</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Expert tutors: All scored in top 1% internationally</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Personalized approach: Data-driven performance tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Average improvement: +450 points across all sections</span>
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🛡️</div>
                <h4 className="font-bold text-gray-900 mb-2">Score Improvement Guarantee</h4>
                <p className="text-sm text-gray-700">
                  We're so confident in our methods that we guarantee you'll see improvement. 
                  If you don't improve after following our program, we'll work with you until you do.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UCATPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <UCATPaymentContent />
    </Suspense>
  );
}