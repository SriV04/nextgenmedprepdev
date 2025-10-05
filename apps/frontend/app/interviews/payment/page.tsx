'use client'

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ChatBubbleLeftRightIcon, VideoCameraIcon, UsersIcon } from '@heroicons/react/24/outline';
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

const mockInterviewPackages: PaymentPackage[] = [
  {
    id: 'mmi_single_session',
    name: 'Single MMI Session',
    price: 89,
    currency: 'GBP',
    description: 'One-on-one MMI practice session with detailed feedback and improvement strategies.',
    turnaroundTime: 'Schedule within 48 hours',
    features: [
      '60-minute MMI practice session',
      '8-10 realistic MMI stations',
      'Real-time feedback and scoring',
      'Personalized improvement plan',
      'Written feedback report'
    ],
    included: [
      '1-hour live video session',
      'Detailed feedback report',
      'Station-by-station breakdown',
      'Follow-up email support'
    ]
  },
  {
    id: 'traditional_interview_prep',
    name: 'Traditional Interview Prep',
    price: 129,
    currency: 'GBP',
    description: 'Comprehensive preparation for traditional medical school interviews with mock scenarios.',
    turnaroundTime: 'Schedule within 48 hours',
    popular: true,
    features: [
      '90-minute interview practice',
      'Common medical ethics scenarios',
      'Personal statement discussion',
      'NHS and healthcare system questions',
      'Motivation and commitment assessment',
      'Body language and communication tips'
    ],
    included: [
      '1.5-hour live video session',
      'Question bank access',
      'Performance assessment',
      '7-day follow-up support'
    ]
  },
  {
    id: 'panel_interview_intensive',
    name: 'Panel Interview Intensive',
    price: 199,
    originalPrice: 249,
    currency: 'GBP',
    description: 'Realistic panel interview simulation with multiple interviewers and comprehensive feedback.',
    turnaroundTime: 'Schedule within 24 hours',
    features: [
      '2-hour panel interview simulation',
      'Multiple qualified interviewers',
      'Realistic medical school setting',
      'Video recording for self-review',
      'Individual interviewer feedback',
      'Post-interview debrief session'
    ],
    included: [
      '2-hour panel simulation',
      'Video recording access',
      'Multi-perspective feedback',
      '30-minute debrief call',
      '14-day support period'
    ]
  },
  {
    id: 'complete_interview_package',
    name: 'Complete Interview Package',
    price: 349,
    originalPrice: 449,
    currency: 'GBP',
    description: 'Comprehensive interview preparation covering MMI, traditional, and panel interview formats.',
    turnaroundTime: 'Flexible scheduling',
    features: [
      'All interview formats covered',
      'Multiple practice sessions',
      'Personalized coaching throughout',
      'University-specific preparation',
      'Unlimited email support',
      'Progress tracking and improvement'
    ],
    included: [
      '1x MMI session (60 minutes)',
      '1x Traditional interview (90 minutes)',
      '1x Panel interview (120 minutes)',
      'Ongoing coaching support',
      '30-day support period'
    ]
  }
];

export default function InterviewsPaymentPage() {
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
    console.log('Payment successful:', data);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowPaymentForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/interviews" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mock Interview Preparation</h1>
                <p className="text-gray-600">Practice with experienced medical school interviewers</p>
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
                Choose Your Interview Preparation
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Practice with real medical school interviewers and current medical students. 
                Build confidence and improve your performance with realistic interview simulations.
              </p>
            </div>

            {/* Features Overview */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <VideoCameraIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Video Sessions</h3>
                <p className="text-gray-600 text-sm">
                  One-on-one or panel interviews conducted via secure video platform
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <UsersIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Interviewers</h3>
                <p className="text-gray-600 text-sm">
                  Practice with actual medical school admissions tutors and experienced interviewers
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Feedback</h3>
                <p className="text-gray-600 text-sm">
                  Comprehensive feedback on performance with specific improvement recommendations
                </p>
              </div>
            </div>

            {/* Package Selection */}
            <div className="grid lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              {mockInterviewPackages.map((pkg) => (
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
                  Book {selectedPackage.name} - £{selectedPackage.price}
                </button>
              </div>
            )}

            {/* Interview Types Information */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Multiple Mini Interviews (MMI)</h3>
                <p className="text-gray-600 mb-4">
                  Practice the MMI format used by most UK medical schools. Multiple short stations 
                  testing different competencies.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Ethical scenarios</li>
                  <li>• Communication tasks</li>
                  <li>• Problem-solving stations</li>
                  <li>• Role-playing exercises</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Traditional Interviews</h3>
                <p className="text-gray-600 mb-4">
                  One-on-one or small panel interviews focusing on motivation, 
                  personal experiences, and medical knowledge.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Personal statement discussion</li>
                  <li>• Motivation for medicine</li>
                  <li>• Healthcare system knowledge</li>
                  <li>• Current affairs in medicine</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Panel Interviews</h3>
                <p className="text-gray-600 mb-4">
                  Practice with multiple interviewers to simulate high-pressure 
                  interview environments.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Multiple interviewer perspectives</li>
                  <li>• Time management under pressure</li>
                  <li>• Confident communication</li>
                  <li>• Professional demeanor</li>
                </ul>
              </div>
            </div>

            {/* Process Information */}
            <div className="mt-12 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Book Session</h4>
                  <p className="text-gray-600 text-sm">Choose and pay for your preferred interview package</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Schedule Session</h4>
                  <p className="text-gray-600 text-sm">Pick a convenient time that works for your schedule</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Practice Interview</h4>
                  <p className="text-gray-600 text-sm">Join live video session with experienced interviewers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
                  <h4 className="font-semibold text-gray-900 mb-2">Get Feedback</h4>
                  <p className="text-gray-600 text-sm">Receive detailed feedback and improvement strategies</p>
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
                Complete Your Booking
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