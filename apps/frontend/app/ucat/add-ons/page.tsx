'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, AcademicCapIcon, CheckIcon, UserIcon, EnvelopeIcon, PhoneIcon, SparklesIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../../components/payment/PaymentForm';
import { trackInitiateCheckout, trackViewContent } from '@/components/MetaPixel';

interface AddOnPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  color: string;
  icon: 'conference' | 'support';
}

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const addOnPackages: { [key: string]: AddOnPackage } = {
  'complete_ucat_conference_pack': {
    id: 'complete_ucat_conference_pack',
    name: 'Complete UCAT Conference Pack',
    price: 50,
    currency: 'GBP',
    description: 'All four section-specific UCAT conferences in one bundle.',
    color: 'bg-blue-600',
    icon: 'conference',
    features: [
      'Verbal Reasoning Mastery (1.5 hours)',
      'Decision Making Workshop (1.5 hours)',
      'Quantitative Reasoning Deep Dive (1.5 hours)',
      'Abstract Reasoning Techniques (1.5 hours)',
      '6 hours of expert-led content',
      'Lifetime access to recordings',
      'Interactive Q&A sessions',
      'Downloadable strategy guides'
    ]
  },
  'unlimited_support_package': {
    id: 'unlimited_support_package',
    name: 'Unlimited Question Submissions',
    price: 65,
    currency: 'GBP',
    description: '24/7 access to expert tutors for unlimited UCAT question help.',
    color: 'bg-emerald-600',
    icon: 'support',
    features: [
      'Unlimited question submissions',
      'Detailed video explanations',
      'Direct tutor phone access',
      'Step-by-step solution walkthroughs',
      '24/7 availability',
      'Fast response times',
      'Expert tutors who scored top 5%',
      'Perfect for last-minute prep'
    ]
  }
};

function AddOnsPaymentContent() {
  const searchParams = useSearchParams();
  const [selectedPackage, setSelectedPackage] = useState<AddOnPackage | null>(null);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const packageId = searchParams.get('package');
    if (packageId && addOnPackages[packageId]) {
      setSelectedPackage(addOnPackages[packageId]);
      trackViewContent(
        addOnPackages[packageId].name,
        addOnPackages[packageId].price,
        addOnPackages[packageId].currency
      );
    } else {
      // Default to conference pack if no package specified
      setSelectedPackage(addOnPackages['complete_ucat_conference_pack']);
      trackViewContent(
        addOnPackages['complete_ucat_conference_pack'].name,
        addOnPackages['complete_ucat_conference_pack'].price,
        addOnPackages['complete_ucat_conference_pack'].currency
      );
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    console.log('Add-on payment successful');
    sessionStorage.removeItem('ucat_addon_booking_details');
    const successUrl = `/payment/success?service=ucat_addon&package=${selectedPackage?.id}&price=${selectedPackage?.price}`;
    window.location.href = successUrl;
  };

  const handlePaymentError = (error: string) => {
    console.error('Add-on payment error:', error);
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
      trackInitiateCheckout(
        selectedPackage.price,
        selectedPackage.currency,
        selectedPackage.name
      );
      
      const bookingData = {
        package: selectedPackage,
        customerDetails,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('ucat_addon_booking_details', JSON.stringify(bookingData));
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

  const IconComponent = selectedPackage.icon === 'conference' ? SparklesIcon : ChatBubbleLeftRightIcon;

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
              <div className={`p-2 ${selectedPackage.color.replace('bg-', 'bg-').replace('600', '100')} rounded-lg`}>
                <IconComponent className={`w-6 h-6 ${selectedPackage.color.replace('bg-', 'text-')}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">UCAT Add-On</h1>
                <p className="text-gray-600">Complete your purchase to enhance your preparation</p>
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

              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What's included:</h3>
                <ul className="space-y-3">
                  {selectedPackage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Package Selector */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your add-on:</h3>
              <div className="space-y-3">
                {Object.values(addOnPackages).map((pkg) => {
                  const PkgIcon = pkg.icon === 'conference' ? SparklesIcon : ChatBubbleLeftRightIcon;
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedPackage.id === pkg.id
                          ? `border-${pkg.color.replace('bg-', '')} bg-${pkg.color.replace('bg-', '').replace('600', '50')}`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${pkg.color.replace('600', '100')}`}>
                          <PkgIcon className={`w-5 h-5 ${pkg.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{pkg.name}</div>
                          <div className="text-sm text-gray-500">{pkg.description}</div>
                        </div>
                        <div className="text-xl font-bold text-gray-900">£{pkg.price}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            {currentStep === 1 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">1</div>
                  <h3 className="text-xl font-semibold text-gray-900">Your Details</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <UserIcon className="w-4 h-4 inline mr-1" />
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerDetailsChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="John"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <EnvelopeIcon className="w-4 h-4 inline mr-1" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <PhoneIcon className="w-4 h-4 inline mr-1" />
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="+44 7123 456789"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleProceedToPayment}
                      disabled={!isCustomerDetailsValid()}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                        isCustomerDetailsValid()
                          ? `${selectedPackage.color} text-white hover:opacity-90 shadow-lg`
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">2</div>
                  <h3 className="text-xl font-semibold text-gray-900">Payment</h3>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-gray-900">{selectedPackage.name}</div>
                      <div className="text-sm text-gray-500">{customerDetails.email}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">£{selectedPackage.price}</div>
                  </div>
                </div>

                <PaymentForm
                  key={selectedPackage.id}
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
                      type: 'ucat_addon',
                      package_id: selectedPackage.id,
                      package_name: selectedPackage.name,
                      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                      customer_email: customerDetails.email,
                      customer_phone: customerDetails.phone,
                      first_name: customerDetails.firstName,
                      last_name: customerDetails.lastName
                    }
                  }}
                  onError={handlePaymentError}
                />

                <button
                  onClick={() => setCurrentStep(1)}
                  className="mt-4 w-full py-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Back to details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UCATAddOnsPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <AddOnsPaymentContent />
    </Suspense>
  );
}
