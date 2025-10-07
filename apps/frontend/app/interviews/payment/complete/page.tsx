'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CheckCircleIcon, CreditCardIcon, CalendarIcon } from '@heroicons/react/24/outline';
import PaymentForm from '../../../../components/payment/PaymentForm';
import '@/styles/prometheus.css';

interface BookingDetails {
  university: string;
  interviewType: string;
  serviceType: string;
  packageType: string;
  packageId: string;
  price: string;
  preferredDate: string;
  notes: string;
}

const universities = [
  { id: 'oxford', name: 'University of Oxford' },
  { id: 'cambridge', name: 'University of Cambridge' },
  { id: 'imperial', name: 'Imperial College London' },
  { id: 'ucl', name: 'University College London' },
  { id: 'kings', name: "King's College London" },
  { id: 'edinburgh', name: 'University of Edinburgh' },
  { id: 'glasgow', name: 'University of Glasgow' },
  { id: 'manchester', name: 'University of Manchester' }
];

const interviewTypes = [
  { id: 'mmi', name: 'Multiple Mini Interview (MMI)', generatedPrice: 15, tutorPrice: 89, duration: '60 minutes' },
  { id: 'traditional', name: 'Traditional Interview', generatedPrice: 20, tutorPrice: 129, duration: '90 minutes' },
  { id: 'panel', name: 'Panel Interview', generatedPrice: 25, tutorPrice: 199, duration: '120 minutes' }
];

const packages = [
  {
    id: 'essentials',
    name: 'Essentials Package',
    description: 'Perfect for individual interview practice',
    interviews: 1,
    generatedPrice: 45,
    tutorPrice: 45
  },
  {
    id: 'core',
    name: 'Core Interview Preparation',
    description: 'Comprehensive interview training',
    interviews: 3,
    generatedPrice: 99,
    tutorPrice: 130
  },
  {
    id: 'premium',
    name: 'Premium Interview Intensive',
    description: 'The ultimate interview preparation',
    interviews: 5,
    generatedPrice: 159,
    tutorPrice: 210
  }
];

// Loading component for Suspense fallback
function PageLoading() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-400">Loading payment details...</p>
      </div>
    </main>
  );
}

// Component that uses useSearchParams
function CompletePurchaseContent() {
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails>({
    university: '',
    interviewType: '',
    serviceType: '',
    packageType: '',
    packageId: '',
    price: '',
    preferredDate: '',
    notes: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    console.log('=== DEBUGGING PAYMENT COMPLETE PAGE ===');
    console.log('Current URL:', window.location.href);
    console.log('SearchParams object:', searchParams);
    console.log('All sessionStorage keys:', Object.keys(sessionStorage));
    
    // Get booking details from URL params first, then sessionStorage
    const university = searchParams.get('university') || '';
    const interviewType = searchParams.get('interviewType') || '';
    const serviceType = searchParams.get('serviceType') || '';
    const packageType = searchParams.get('packageType') || '';
    const packageId = searchParams.get('packageId') || '';
    const price = searchParams.get('price') || '';
    const preferredDate = searchParams.get('preferredDate') || '';
    const notes = searchParams.get('notes') || '';

    console.log('URL params extracted:', {
      university, interviewType, serviceType, packageType, packageId, price, preferredDate, notes
    });

    // Try to get from sessionStorage as backup - check multiple possible keys
    const storedData = sessionStorage.getItem('interview_booking');
    const altStoredData = sessionStorage.getItem('interviewBookingDetails');
    let sessionData = null;
    
    console.log('SessionStorage interview_booking:', storedData);
    console.log('SessionStorage interviewBookingDetails:', altStoredData);
    
    if (storedData) {
      try {
        sessionData = JSON.parse(storedData);
        console.log('Parsed session data:', sessionData);
      } catch (e) {
        console.error('Error parsing session data:', e);
      }
    } else if (altStoredData) {
      try {
        sessionData = JSON.parse(altStoredData);
        console.log('Parsed alt session data:', sessionData);
      } catch (e) {
        console.error('Error parsing alt session data:', e);
      }
    }

    const finalBookingDetails = {
      university: university || sessionData?.university || '',
      interviewType: interviewType || sessionData?.interviewType || '',
      serviceType: (serviceType || sessionData?.serviceType || '') as 'generated' | 'tutor',
      packageType: (packageType || sessionData?.packageType || '') as 'individual' | 'package',
      packageId: packageId || sessionData?.packageId || '',
      price: price || sessionData?.price || '', 
      preferredDate: preferredDate || sessionData?.preferredDate || '',
      notes: notes || sessionData?.notes || ''
    };

    console.log('Final booking details set:', finalBookingDetails);
    setBookingDetails(finalBookingDetails);
  }, [searchParams]);

  const getUniversityName = () => {
    const university = universities.find(uni => uni.id === bookingDetails.university);
    return university?.name || 'Selected University';
  };

  const getInterviewTypeDetails = () => {
    return interviewTypes.find(type => type.id === bookingDetails.interviewType);
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful for interview booking');
    // Clear booking details from session storage
    sessionStorage.removeItem('interviewBookingDetails');
    // Redirect to success page with booking details
    const university = getUniversityName();
    const serviceTypeLabel = bookingDetails.serviceType === 'generated' ? 'generated' : 'tutor';
    const successUrl = bookingDetails.packageType === 'package' 
      ? `/payment/success?service=interviews&university=${bookingDetails.university}&type=${bookingDetails.interviewType}&package=${bookingDetails.packageId}&serviceType=${serviceTypeLabel}`
      : `/payment/success?service=interviews&university=${bookingDetails.university}&type=${bookingDetails.interviewType}&individual=true&serviceType=${serviceTypeLabel}`;
    
    window.location.href = successUrl;
  };

  const handlePaymentError = (error: string) => {
    console.error('Interview payment failed:', error);
    // You could show an error modal or redirect to an error page
    alert(`Payment failed: ${error}. Please try again or contact support.`);
  };

  const getSelectedPackage = (): {
    id: string;
    name: string;
    price: number;
    currency: string;
    description: string;
  } | null => {
    const university = getUniversityName();
    const serviceTypeLabel = bookingDetails.serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Sessions';
    const interviewTypeDetails = getInterviewTypeDetails();
    
    // Parse price with fallback
    const price = parseFloat(bookingDetails.price) || 0;
    
    console.log('Getting selected package:', {
      bookingDetails,
      parsedPrice: price,
      priceString: bookingDetails.price,
      interviewTypeDetails
    });

    // If no booking details available, return a default package to prevent payment form from breaking
    if (!bookingDetails.university || !bookingDetails.interviewType || !bookingDetails.serviceType) {
      console.log('Missing booking details, returning default package');
      return {
        id: 'default_interview_session',
        name: 'Interview Preparation Session',
        price: 45,
        currency: 'GBP',
        description: 'Interview preparation session - Please complete the booking form first'
      };
    }
    
    if (bookingDetails.packageType === 'package' && bookingDetails.packageId) {
      const pkg = packages.find(p => p.id === bookingDetails.packageId);
      if (pkg) {
        // Calculate correct price based on service type if price is 0
        const correctPrice = price > 0 ? price : (
          bookingDetails.serviceType === 'generated' ? pkg.generatedPrice : pkg.tutorPrice
        );
        
        return {
          id: `interview_${pkg.id}_${bookingDetails.serviceType}_${bookingDetails.university}`,
          name: `${pkg.name} - ${serviceTypeLabel}`,
          price: correctPrice,
          currency: 'GBP',
          description: `${pkg.name} - ${serviceTypeLabel} for ${university} ${interviewTypeDetails?.name || 'Interview'} preparation. ${pkg.interviews} session${pkg.interviews > 1 ? 's' : ''} included.`
        };
      }
    }
    
    // Individual session
    if (interviewTypeDetails) {
      // Calculate correct price based on service type if price is 0
      const correctPrice = price > 0 ? price : (
        bookingDetails.serviceType === 'generated' ? interviewTypeDetails.generatedPrice : interviewTypeDetails.tutorPrice
      );

      console.log('Individual session selected, returning package:', {
        id: `interview_${bookingDetails.interviewType}_${bookingDetails.serviceType}_${bookingDetails.university}`,
        name: `${interviewTypeDetails.name} - ${serviceTypeLabel}`,
        price: correctPrice,
        currency: 'GBP',
        description: `Individual ${interviewTypeDetails.name} preparation session for ${university}. ${serviceTypeLabel} format.`
      });
      
      
      return {
        id: `interview_${bookingDetails.interviewType}_${bookingDetails.serviceType}_${bookingDetails.university}`,
        name: `${interviewTypeDetails.name} - ${serviceTypeLabel}`,
        price: correctPrice,
        currency: 'GBP',
        description: `Individual ${interviewTypeDetails.name} preparation session for ${university}. ${serviceTypeLabel} format.`
      };
    }
    
    return null;
  };

  const interviewType = getInterviewTypeDetails();

  if (paymentComplete) {
    return (
      <main className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
        {/* Success Animation Background */}
        <div className="absolute inset-0">
          {Array.from({length: 50}).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          ))}
        </div>

        <motion.div 
          className="relative z-10 text-center max-w-2xl mx-auto px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <CheckCircleIcon className="w-24 h-24 text-green-400 mx-auto mb-6" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Booking <span className="text-green-400">Confirmed!</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Your interview preparation session has been successfully booked. 
            You'll receive a confirmation email with scheduling details within 24 hours.
          </p>

          <div className="bg-black/60 border border-green-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold mb-4 text-green-400">Booking Reference</h3>
            <p className="text-2xl font-mono text-white">NGMP-{Date.now().toString().slice(-6)}</p>
          </div>

          <div className="space-y-4">
            <Link 
              href="/interviews" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
            >
              Back to Interviews
            </Link>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Grid */}
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
            className="border border-purple-500/20"
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/80 border-b border-purple-500/30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/interviews/payment" className="text-gray-400 hover:text-purple-400 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
                <CreditCardIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Complete Purchase</h1>
                <p className="text-gray-400">Secure payment powered by Prometheus</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Booking Summary</h2>
            
            <div className="bg-black/60 border border-purple-500/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">University:</span>
                  <span className="font-semibold text-right">{getUniversityName()}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">Interview Type:</span>
                  <span className="font-semibold text-right">{interviewType?.name}</span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">Service Type:</span>
                  <span className="font-semibold text-right">
                    {bookingDetails.serviceType === 'generated' ? 'Generated Questions' : 'Live Tutor Session'}
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">Package:</span>
                  <span className="font-semibold text-right">
                    {bookingDetails.packageType === 'package' ? 'Package Deal' : 'Single Session'}
                  </span>
                </div>
                
                <div className="flex justify-between items-start">
                  <span className="text-gray-300">Duration:</span>
                  <span className="font-semibold">{interviewType?.duration}</span>
                </div>

                {bookingDetails.preferredDate && (
                  <div className="flex justify-between items-start">
                    <span className="text-gray-300">Preferred Date:</span>
                    <span className="font-semibold">
                      {new Date(bookingDetails.preferredDate).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                )}

                {bookingDetails.notes && (
                  <div className="pt-4 border-t border-gray-600">
                    <span className="text-gray-300 block mb-2">Additional Notes:</span>
                    <p className="text-sm text-gray-400 bg-black/40 p-3 rounded">
                      {bookingDetails.notes}
                    </p>
                  </div>
                )}
                
                <div className="border-t border-purple-500/30 pt-4 mt-6">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total Price:</span>
                    <span className="text-purple-400">£{bookingDetails.price}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="mt-8 bg-black/40 border border-gray-600 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-indigo-400">What's Included</h3>
              <ul className="space-y-2 text-gray-300">
                {bookingDetails.serviceType === 'generated' ? (
                  <>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      AI-generated mock questions
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      University-specific question bank
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Prometheus intelligence system
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Instant access to materials
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Self-paced preparation
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Live video interview session
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Expert interviewer from medical field
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Detailed performance feedback
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      University-specific preparation
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      Written feedback report
                    </li>
                    <li className="flex items-center">
                      <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      7-day email support
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-400">Payment Details</h2>
            
            <div className="payment-form-container [&_.bg-white]:bg-black/60 [&_.bg-white]:border-purple-500/30 [&_.text-gray-900]:text-white [&_.text-gray-700]:text-gray-300 [&_.text-gray-600]:text-gray-400 [&_.border-gray-300]:border-gray-600 [&_.bg-blue-50]:bg-purple-500/10 [&_.border-blue-200]:border-purple-500/30 [&_input]:bg-black [&_input]:text-white [&_textarea]:bg-black [&_textarea]:text-white [&_select]:bg-black [&_select]:text-white">
              <PaymentForm
                selectedPackage={{
                                      id: getSelectedPackage()?.id,
                                      name: getSelectedPackage()?.name,
                                      price: getSelectedPackage()?.price,
                                      currency: getSelectedPackage()?.currency,
                                      description: `${getSelectedPackage()?.name} - ${getSelectedPackage()?.description}`
                                  }}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </div>

            {/* Trust Signals */}
            <div className="mt-6 bg-black/40 border border-gray-600 rounded-lg p-6">
              <h4 className="font-semibold text-gray-300 mb-4">Why Choose NextGen MedPrep?</h4>
              <div className="space-y-3 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Expert tutors: Current medical students with 3+ offers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>University-specific preparation tailored to your target school</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Prometheus AI-powered question generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Proven track record of interview success</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

// Main page component with Suspense boundary
export default function CompletePurchasePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <CompletePurchaseContent />
    </Suspense>
  );
}