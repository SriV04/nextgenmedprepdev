'use client'

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaymentStatus {
  order_id: string;
  status: 'approved' | 'declined' | 'processing' | 'expired' | 'reversed';
  amount: string;
  currency: string;
  payment_system?: string;
  masked_card?: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    const checkoutSessionId = searchParams.get('session_id');
    
    if (checkoutSessionId) {
      setSessionId(checkoutSessionId);
      fetchPaymentStatus(checkoutSessionId);
    } else {
      setError('No checkout session ID provided');
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentStatus = async (checkoutSessionId: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/v1/payments/status/${checkoutSessionId}`);
      const data = await response.json();

      if (data.success) {
        setPaymentStatus(data.data);
      } else {
        setError(data.error || 'Failed to fetch payment status');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Payment status error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying your payment...</p>
          <p className="text-sm text-gray-500 mt-2">Session ID: {sessionId}</p>
        </div>
      </div>
    );
  }

  const formatAmount = (amount: string, currency: string) => {
    const numAmount = parseInt(amount) / 100;
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency
    }).format(numAmount);
  };

  const getStatusIcon = (status: string) => {
    if (status === 'approved') {
      return (
        <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );
    }
    return (
      <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          
          {error ? (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-red-800">Payment Error</h1>
              <div className="p-4 rounded-lg bg-red-50 border-red-200 border mb-6">
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          ) : paymentStatus ? (
            <div className="text-center">
              {getStatusIcon(paymentStatus.status)}
              <h1 className={`text-3xl font-bold mb-3 ${
                paymentStatus.status === 'approved' ? 'text-green-800' : 'text-red-800'
              }`}>
                {paymentStatus.status === 'approved' ? 'Payment Successful!' : 'Payment Failed'}
              </h1>
              <div className={`p-4 rounded-lg mb-6 border ${
                paymentStatus.status === 'approved' 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`font-medium ${
                  paymentStatus.status === 'approved' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {paymentStatus.status === 'approved' 
                    ? 'Thank you for your payment. Your transaction has been processed successfully.'
                    : 'Your payment could not be processed. Please try again with a different payment method.'
                  }
                </p>
              </div>
            </div>
          ) : null}

          {/* Checkout Session Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Transaction Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Checkout Session ID:</span>
                <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded max-w-xs truncate">
                  {sessionId}
                </span>
              </div>
              
              {paymentStatus && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Amount:</span>
                    <span className="font-bold text-lg text-gray-900">
                      {formatAmount(paymentStatus.amount, paymentStatus.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Status:</span>
                    <span className={`font-semibold capitalize px-3 py-1 rounded-full text-xs ${
                      paymentStatus.status === 'approved' ? 'bg-green-100 text-green-800' :
                      paymentStatus.status === 'declined' ? 'bg-red-100 text-red-800' :
                      paymentStatus.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {paymentStatus.status}
                    </span>
                  </div>
                  {paymentStatus.payment_system && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Payment Method:</span>
                      <span className="font-medium capitalize">{paymentStatus.payment_system}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentStatus?.status === 'approved' && (
              <Link 
                href="/" 
                className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Continue to Dashboard
              </Link>
            )}
            
            {(error || paymentStatus?.status === 'declined' || paymentStatus?.status === 'expired') && (
              <Link 
                href="/payment" 
                className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Payment Again
              </Link>
            )}
            
            <Link 
              href="/" 
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium"
            >
              Return to Home
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by Stripe</span>
            </div>
            <p className="text-xs text-gray-500">
              If you have any questions about your payment, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment status...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
