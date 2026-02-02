'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, CheckIcon, UserIcon, EnvelopeIcon, ClockIcon, BoltIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../components/payment/PaymentForm';
import { trackInitiateCheckout, trackViewContent } from '@/components/MetaPixel';

interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface RevisionPlanOptions {
  weeks: number;
  intensity: 'low' | 'medium' | 'high';
  platform: 'medify' | 'medentry';
}

function PersonalisedRevisionPlanPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [planOptions, setPlanOptions] = useState<RevisionPlanOptions>({
    weeks: 7,
    intensity: 'medium',
    platform: 'medify'
  });

  const price = 15;
  const currency = 'GBP';

  const intensityDescriptions = {
    low: 'Light revision - 1-2 hours per day, ideal for students with other commitments',
    medium: 'Balanced approach - 2-3 hours per day, most popular choice',
    high: 'Intensive prep - 4-5 hours per day, for maximum score improvement'
  };

  const platformDescriptions = {
    medify: 'Medify - Most popular UCAT prep platform with extensive question banks',
    medentry: 'MedEntry - Comprehensive Australian-style UCAT preparation'
  };

  const handleCustomerDetailsChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlanOptionChange = (field: keyof RevisionPlanOptions, value: any) => {
    setPlanOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isCustomerDetailsValid = () => {
    return customerDetails.firstName.trim() !== '' && 
           customerDetails.lastName.trim() !== '' && 
           customerDetails.email.trim() !== '' && 
           customerDetails.email.includes('@');
  };

  const handleProceedToPayment = () => {
    if (isCustomerDetailsValid()) {
      // Track InitiateCheckout
      trackInitiateCheckout(
        price,
        currency,
        'Personalised UCAT Revision Plan'
      );
      
      // Store booking details in session storage
      const bookingData = {
        planOptions,
        customerDetails,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('revision_plan_details', JSON.stringify(bookingData));
      setCurrentStep(2);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

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
              <div className="p-2 bg-purple-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personalised UCAT Revision Plan</h1>
                <p className="text-gray-600">Get a customised study schedule tailored to your needs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Plan Details */}
          <div className="space-y-8">
            {/* Package Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Personalised Revision Plan</h2>
                <p className="text-xl opacity-90">Customised study schedule designed for your success</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-bold">£{price}</span>
                  <span className="ml-2 text-lg opacity-80">one-time payment</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What You'll Get</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Customised weekly study schedule based on your timeline</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Daily practice targets tailored to your intensity level</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Platform-specific resource recommendations and question allocations</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Progress tracking milestones for each week</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Breakdown by UCAT section (Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, SJT)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Mock exam schedule and timing strategies</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Rest and recovery recommendations to avoid burnout</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Delivered as downloadable PDF within 24 hours</span>
                </div>
              </div>
            </div>

            {/* Benefits Banner */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Why Get a Personalised Plan?</h3>
              <div className="grid gap-3">
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-3">✓</span>
                  <span>Remove guesswork - know exactly what to study and when</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-3">✓</span>
                  <span>Maximize efficiency with structured daily targets</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-3">✓</span>
                  <span>Avoid burnout with balanced study and rest periods</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="text-purple-500 mr-3">✓</span>
                  <span>Track progress with clear weekly milestones</span>
                </div>
              </div>
            </div>

            {/* Current Selection Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Plan Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-900">{planOptions.weeks} weeks</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Intensity:</span>
                  <span className="font-semibold text-gray-900 capitalize">{planOptions.intensity}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Platform:</span>
                  <span className="font-semibold text-gray-900 capitalize">{planOptions.platform}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-8">
            {currentStep === 1 ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Customise Your Plan
                  </h2>
                  <p className="text-gray-600">
                    Select your preferences to create the perfect revision schedule for you.
                  </p>
                </div>

                {/* Plan Options */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" />
                    Plan Options
                  </h3>
                  
                  {/* Time Period Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Study Duration (weeks) *
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {[5, 6, 7, 8, 9].map((weeks) => (
                        <button
                          key={weeks}
                          onClick={() => handlePlanOptionChange('weeks', weeks)}
                          className={`p-4 rounded-lg border-2 text-center transition-all duration-200 ${
                            planOptions.weeks === weeks
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-2xl font-bold">{weeks}</div>
                          <div className="text-xs mt-1">weeks</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensity Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <BoltIcon className="w-4 h-4" />
                      Study Intensity *
                    </label>
                    <div className="grid gap-3">
                      {(['low', 'medium', 'high'] as const).map((intensity) => (
                        <button
                          key={intensity}
                          onClick={() => handlePlanOptionChange('intensity', intensity)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            planOptions.intensity === intensity
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 capitalize mb-1">{intensity}</div>
                              <div className="text-sm text-gray-600">{intensityDescriptions[intensity]}</div>
                            </div>
                            {planOptions.intensity === intensity && (
                              <CheckIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Platform Selection */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <BookOpenIcon className="w-4 h-4" />
                      UCAT Revision Platform *
                    </label>
                    <div className="grid gap-3">
                      {(['medify', 'medentry'] as const).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => handlePlanOptionChange('platform', platform)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                            planOptions.platform === platform
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-gray-900 capitalize mb-1">{platform}</div>
                              <div className="text-sm text-gray-600">{platformDescriptions[platform]}</div>
                            </div>
                            {planOptions.platform === platform && (
                              <CheckIcon className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Customer Details Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Your Contact Information
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your email address"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">We'll send your personalised plan to this email</p>
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        value={customerDetails.phone}
                        onChange={(e) => handleCustomerDetailsChange('phone', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    disabled={!isCustomerDetailsValid()}
                    className={`w-full mt-8 px-8 py-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                      isCustomerDetailsValid()
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 cursor-pointer shadow-lg hover:shadow-xl'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Proceed to Payment - £{price}
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
                    Secure checkout powered by Stripe. Get your personalised plan within 24 hours.
                  </p>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="mt-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    ← Edit Details
                  </button>
                </div>
                
                <PaymentForm
                  selectedPackage={{
                    id: 'personalised-revision-plan',
                    name: 'Personalised UCAT Revision Plan',
                    price: price,
                    currency: currency,
                    description: `${planOptions.weeks}-week ${planOptions.intensity} intensity plan for ${planOptions.platform}`
                  }}
                  initialData={{
                    customer_email: customerDetails.email,
                    customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`.trim(),
                    metadata: {
                      type: 'revision_plan',
                      weeks: planOptions.weeks.toString(),
                      intensity: planOptions.intensity,
                      platform: planOptions.platform,
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
              <h4 className="font-semibold text-gray-900 mb-4">Why Students Love Our Plans</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Receive your plan within 24 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Created by UCAT experts who scored 3000+</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Tailored to your specific timeline and goals</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Structured to prevent burnout and maximize retention</span>
                </div>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-2">✨</div>
                <h4 className="font-bold text-gray-900 mb-2">Satisfaction Guaranteed</h4>
                <p className="text-sm text-gray-700">
                  If you're not completely satisfied with your personalised plan, we'll revise it for free 
                  or provide a full refund within 7 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalisedRevisionPlanPage;
