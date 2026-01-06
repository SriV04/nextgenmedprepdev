'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, UserIcon, ClockIcon, BriefcaseIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../components/payment/PaymentForm';
import { trackViewContent } from '@/components/MetaPixel';

export default function CareerConsultationPaymentPage() {
  const consultationPackage = {
    id: 'career_consultation_30min',
    name: '30-Minute Career Consultation',
    price: 30,
    currency: 'GBP',
    description: 'One-to-one career consultation with a medical professional to discuss your medical career path.'
  };

  // Track ViewContent when user lands on career consultation page
  useEffect(() => {
    trackViewContent(
      consultationPackage.name,
      consultationPackage.price,
      consultationPackage.currency
    );
  }, []);

  const handlePaymentSuccess = (data: any) => {
    // Handle successful payment
    console.log('Payment successful:', data);
    if (data?.checkout_url) {
      // Redirect to Stripe checkout
      window.location.href = data.checkout_url;
    } else {
      // Fallback to success page
      window.location.href = '/payment/success';
    }
  };

  const handlePaymentError = (error: string) => {
    // Handle payment error
    console.error('Payment error:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Career Consultation</h1>
                <p className="text-gray-600">Get expert career advice from medical professionals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Service Overview */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              30-Minute Career Consultation
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Book a personalized one-to-one consultation with a medical professional to discuss your career path, 
              options, and receive guidance tailored to your specific situation.
            </p>
          </div>

          {/* Features Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <UserIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Expert Advice</h3>
              <p className="text-gray-600 text-sm">
                Guidance from experienced medical professionals
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <BriefcaseIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Plan</h3>
              <p className="text-gray-600 text-sm">
                Tailored career advice for your specific situation
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <ClockIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30 Minutes</h3>
              <p className="text-gray-600 text-sm">
                Focused session to address your key questions
              </p>
            </div>
          </div>

          {/* Package Summary Card */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-10">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-900">30-Minute Career Consultation</h3>
              <div className="text-3xl font-bold text-blue-600">£30</div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Get personalized career guidance from a medical professional who understands the unique challenges
              and opportunities in the medical field.
            </p>
            
            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">30-minute video consultation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Career path discussion and planning</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Personalized advice and recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  <span className="text-gray-700">Follow-up resources via email</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Complete Your Booking</h3>
            <PaymentForm
              selectedPackage={consultationPackage}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              initialData={{
                metadata: {
                  type: 'career_consultation',
                  service_type: '30min'
                }
              }}
            />
          </div>

          {/* Process Information */}
          <div className="mt-16 bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">1</div>
                <h4 className="font-semibold text-gray-900 mb-2">Book & Pay</h4>
                <p className="text-gray-600 text-sm">Complete your payment for the consultation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">2</div>
                <h4 className="font-semibold text-gray-900 mb-2">Receive Confirmation</h4>
                <p className="text-gray-600 text-sm">Get booking details and preparation instructions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">3</div>
                <h4 className="font-semibold text-gray-900 mb-2">Attend Session</h4>
                <p className="text-gray-600 text-sm">Join your consultation via video call link</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">4</div>
                <h4 className="font-semibold text-gray-900 mb-2">Follow Up</h4>
                <p className="text-gray-600 text-sm">Receive follow-up resources via email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
