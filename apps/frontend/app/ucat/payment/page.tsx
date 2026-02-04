'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon, CheckIcon, ClockIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../../components/payment/PaymentForm';
import { trackInitiateCheckout, trackViewContent } from '@/components/MetaPixel';

interface UCATPackage {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  hours: number;
  features: string[];
  popular?: boolean;
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
    name: 'Kickstart',
    price: 200,
    currency: 'GBP',
    hours: 4,
    description: 'Build a solid foundation',
    features: [
      '4 hours of core teaching across all UCAT sections',
      'Performance tracking for every question',
      'Personalised weekly revision plan',
      'Data-led support on weak areas from day one',
      '15%+ score increase after four sessions'
    ]
  },
  'ucat_advance': {
    id: 'ucat_advance',
    name: 'Advance',
    price: 375,
    currency: 'GBP',
    hours: 8,
    description: 'Targeted improvement',
    features: [
      'Everything in Kickstart',
      '+4 hours of targeted refinement sessions',
      'Deep dives into your weakest areas',
      'Focused drills to convert weaknesses into strengths',
      'Increased data input for sharper tracking'
    ]
  },
  'ucat_mastery': {
    id: 'ucat_mastery',
    name: 'Mastery',
    price: 575,
    currency: 'GBP',
    hours: 12,
    description: 'Top 10% scores',
    popular: true,
    features: [
      'Everything in Advance',
      '+4 hours of high-intensity refinement',
      'Priority support and accelerated response',
      'Advanced test-taking strategies',
      'Four conference tickets included (£50 value)',
      'Test-day readiness with total confidence'
    ]
  },
  'ucat_elite': {
    id: 'ucat_elite',
    name: 'Elite',
    price: 800,
    currency: 'GBP',
    hours: 20,
    description: 'Exceptional results',
    features: [
      'Everything in Mastery',
      '20 hours comprehensive intensive teaching',
      'Maximum contact time with expert tutors',
      'Extended practice with live feedback',
      'Exam day prep & mental strategies',
      'Full mock exam analysis',
      'Leave nothing to chance'
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
      trackViewContent(
        ucatPackages[packageId].name,
        ucatPackages[packageId].price,
        ucatPackages[packageId].currency
      );
    } else {
      setSelectedPackage(ucatPackages['ucat_kickstart']);
      trackViewContent(
        ucatPackages['ucat_kickstart'].name,
        ucatPackages['ucat_kickstart'].price,
        ucatPackages['ucat_kickstart'].currency
      );
    }
  }, [searchParams]);

  const handlePaymentSuccess = () => {
    sessionStorage.removeItem('ucat_booking_details');
    const successUrl = `/payment/success?service=ucat&package=${selectedPackage?.id}&price=${selectedPackage?.price}`;
    window.location.href = successUrl;
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  const isCustomerDetailsValid = () => {
    return customerDetails.firstName.trim() !== '' && 
           customerDetails.lastName.trim() !== '' && 
           customerDetails.email.trim() !== '' && 
           customerDetails.email.includes('@');
  };

  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({ ...prev, [field]: value }));
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
      sessionStorage.setItem('ucat_booking_details', JSON.stringify(bookingData));
      setCurrentStep(2);
    }
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <Link 
              href="/ucat" 
              className="p-2 -ml-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">UCAT Tutoring</h1>
              <p className="text-sm text-slate-500">Complete your purchase</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Left Column - Package Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Package Card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{selectedPackage.name}</h2>
                  {selectedPackage.popular && (
                    <span className="bg-amber-400 text-slate-900 text-xs font-semibold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-slate-400 text-sm mb-4">{selectedPackage.description}</p>
                <div className="flex items-baseline gap-4">
                  <span className="text-3xl font-semibold">£{selectedPackage.price}</span>
                  <span className="flex items-center gap-1 text-slate-400 text-sm">
                    <ClockIcon className="w-4 h-4" />
                    {selectedPackage.hours} hours
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
                  What's included
                </p>
                <ul className="space-y-3">
                  {selectedPackage.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Package Selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <p className="text-sm font-medium text-slate-900 mb-4">Change package</p>
              <div className="space-y-2">
                {Object.values(ucatPackages).map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      selectedPackage.id === pkg.id
                        ? 'border-slate-900 bg-slate-50'
                        : 'border-slate-100 hover:border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-slate-900">{pkg.name}</span>
                          {pkg.popular && (
                            <span className="bg-amber-100 text-amber-700 text-xs font-medium px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{pkg.hours} hours</div>
                      </div>
                      <span className="font-semibold text-slate-900">£{pkg.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="bg-slate-900 rounded-2xl p-6 text-white">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-4">
                Why students choose us
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span className="text-slate-300">92% of students improve their scores</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  <span className="text-slate-300">Tutors scored in top 1% internationally</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full" />
                  <span className="text-slate-300">Average +450 point improvement</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-3">
            {currentStep === 1 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-2">Your details</h2>
                  <p className="text-sm text-slate-500">
                    Enter your contact information to proceed.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        First name
                      </label>
                      <input
                        type="text"
                        value={customerDetails.firstName}
                        onChange={(e) => handleCustomerDetailsChange('firstName', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={customerDetails.lastName}
                        onChange={(e) => handleCustomerDetailsChange('lastName', e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                        placeholder="Smith"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      value={customerDetails.email}
                      onChange={(e) => handleCustomerDetailsChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone number <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={customerDetails.phone}
                      onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-slate-600">Total</span>
                    <span className="text-2xl font-semibold text-slate-900">£{selectedPackage.price}</span>
                  </div>
                  
                  <button
                    onClick={handleProceedToPayment}
                    disabled={!isCustomerDetailsValid()}
                    className={`w-full py-4 rounded-full font-medium text-lg transition-all ${
                      isCustomerDetailsValid()
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Continue to payment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900 mb-1">Payment</h2>
                      <p className="text-sm text-slate-500">Secure checkout powered by Stripe</p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Edit details
                    </button>
                  </div>

                  {/* Customer Summary */}
                  <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Booking for</span>
                      <span className="text-slate-900 font-medium">
                        {customerDetails.firstName} {customerDetails.lastName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-slate-500">Email</span>
                      <span className="text-slate-900">{customerDetails.email}</span>
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
                </div>

                {/* Guarantee */}
                <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 mb-1">Score improvement guarantee</h4>
                      <p className="text-sm text-slate-600">
                        If you don't improve after following our program, we'll work with you until you do.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UCATPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    }>
      <UCATPaymentContent />
    </Suspense>
  );
}