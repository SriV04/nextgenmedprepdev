'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, DocumentTextIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import PaymentCard from '../../../components/payment/PaymentCard';
import PaymentForm from '../../../components/payment/PaymentForm';

interface PaymentPackage {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  features: string[];
  popular?: boolean;
  turnaroundTime: string;
  included: string[];
}

const personalStatementPackages: PaymentPackage[] = [
  {
    id: 'ps_basic_review',
    name: 'Basic Review',
    price: 149,
    currency: 'GBP',
    description: 'Comprehensive feedback on your personal statement with detailed suggestions for improvement.',
    turnaroundTime: '5-7 business days',
    features: [
      'Line-by-line detailed feedback',
      'Structure and flow analysis',
      'Grammar and language review',
      'Overall assessment and rating',
      'Written feedback report (3-4 pages)'
    ],
    included: [
      'One round of detailed written feedback',
      'Downloadable PDF report',
      'Email support for questions'
    ]
  },
  {
    id: 'ps_premium_review',
    name: 'Premium Review',
    price: 249,
    originalPrice: 299,
    currency: 'GBP',
    description: 'Comprehensive review with 1-on-1 video consultation to discuss feedback and improvements.',
    turnaroundTime: '3-5 business days',
    popular: true,
    features: [
      'Everything in Basic Review',
      '30-minute 1-on-1 video consultation',
      'Live feedback discussion',
      'Personalised improvement strategy',
      'Second review after revisions (optional)',
      'Priority review processing'
    ],
    included: [
      'Written feedback report (4-5 pages)',
      '30-minute video consultation',
      'Optional second review',
      'Direct tutor contact for 7 days'
    ]
  },
  {
    id: 'ps_complete_package',
    name: 'Complete Package',
    price: 399,
    originalPrice: 499,
    currency: 'GBP',
    description: 'Full personal statement development from draft to final version with unlimited revisions.',
    turnaroundTime: '2-3 business days',
    features: [
      'Everything in Premium Review',
      'Unlimited revisions until satisfied',
      'Two 45-minute video consultations',
      'Personal statement structure planning',
      'Medical school specific customization',
      '24/7 support during application period'
    ],
    included: [
      'Initial consultation call (45 minutes)',
      'Draft development assistance',
      'Unlimited revision cycles',
      'Final review consultation (45 minutes)',
      '30-day support period'
    ]
  }
];

export default function PersonalStatementPaymentPage() {
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handlePackageSelect = (pkg: PaymentPackage) => {
    setSelectedPackage(pkg);
  };

  const handleProceedToPayment = () => {
    if (selectedPackage) {
      setShowPaymentForm(true);
    }
  };

  const handlePaymentSuccess = (data: any) => {
    // Handle successful payment
    console.log('Payment successful:', data);
  };

  const handlePaymentError = (error: string) => {
    // Handle payment error
    console.error('Payment error:', error);
    setShowPaymentForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/personal-statements" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Personal Statement Review</h1>
                <p className="text-gray-600">Get expert feedback from medical school admissions tutors</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {!showPaymentForm ? (
          <>
            {/* Service Overview */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Choose Your Review Package
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Get your personal statement reviewed by current medical students and admissions tutors 
                who have successfully gained places at top UK medical schools.
              </p>
            </div>

            {/* Features Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <UserIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Reviewers</h3>
                <p className="text-gray-600 text-sm">
                  All reviews conducted by current medical students and admissions tutors
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <DocumentTextIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive line-by-line feedback with specific improvement suggestions
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <ClockIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Turnaround</h3>
                <p className="text-gray-600 text-sm">
                  Quick review processing to meet your application deadlines
                </p>
              </div>
            </div>

            {/* Package Selection */}
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {personalStatementPackages.map((pkg) => (
                <PaymentCard
                  key={pkg.id}
                  package={pkg}
                  selected={selectedPackage?.id === pkg.id}
                  onSelect={handlePackageSelect}
                />
              ))}
            </div>

            {/* Proceed Button */}
            {selectedPackage && (
              <div className="text-center">
                <button
                  onClick={handleProceedToPayment}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Proceed with {selectedPackage.name} - £{selectedPackage.price}
                </button>
              </div>
            )}

            {/* Process Information */}
            <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Purchase Package</h4>
                  <p className="text-gray-600 text-sm">Choose and pay for your preferred review package</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Submit Statement</h4>
                  <p className="text-gray-600 text-sm">Upload your personal statement via secure portal</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Expert Review</h4>
                  <p className="text-gray-600 text-sm">Our tutors provide detailed feedback and suggestions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Receive Feedback</h4>
                  <p className="text-gray-600 text-sm">Get comprehensive feedback and optional consultation</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Payment Form */
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                Complete Your Purchase
              </h2>
            </div>
            
            <PaymentForm
              selectedPackage={selectedPackage ? {
                id: selectedPackage.id,
                name: selectedPackage.name,
                price: selectedPackage.price,
                currency: selectedPackage.currency,
                description: selectedPackage.description
              } : undefined}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        )}
      </div>
    </div>
  );
}