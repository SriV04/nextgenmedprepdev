'use client';

import React, { useState } from 'react';
import ComparisonSection from '../../components/personal-statements/ComparisonSection';
import AdviceSection from '../../components/personal-statements/AdviceSection';
import PersonalStatementUploadForm from '../../components/personal-statements/PersonalStatementUploadForm';
import ReviewSuccessModal from '../../components/personal-statements/ReviewSuccessModal';

const PersonalStatementPage = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleReviewSuccess = () => {
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white py-20 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-10 rounded-3xl backdrop-blur-sm mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Perfect Your
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Personal Statement
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto mb-8">
            Your personal statement is your chance to shine. Get expert guidance, understand the differences 
            between medicine and dentistry applications, and secure professional feedback for just £10.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Expert Review - £10
            </button>
            <button 
              onClick={() => document.getElementById('advice-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300"
            >
              Free Writing Tips
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
              <div className="text-3xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
              <div className="text-3xl font-bold text-green-400 mb-2">48hrs</div>
              <div className="text-blue-100">Feedback Time</div>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
              <div className="text-3xl font-bold text-orange-400 mb-2">2000+</div>
              <div className="text-blue-100">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Personal Statement Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              What is a Personal Statement?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Your personal statement is a critical component of your UCAS application that can make or break your chances of securing a place
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Your Golden Opportunity</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  A personal statement is your 4,000-character pitch to admissions committees. It's where you demonstrate 
                  your passion, commitment, and suitability for your chosen healthcare career.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Showcase your unique journey and motivations</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Demonstrate understanding of your chosen field</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Highlight relevant skills and experiences</span>
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Stand out from thousands of other applicants</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">The Reality Check</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-lg">!</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Highly Competitive</h4>
                    <p className="text-blue-100">Medicine: 3-4 applicants per place. Dentistry: 2-3 applicants per place.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-lg">⏰</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Limited Space</h4>
                    <p className="text-blue-100">Only 4,000 characters to tell your entire story. Every word matters.</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-500 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-white font-bold text-lg">🎯</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Make It Count</h4>
                    <p className="text-blue-100">This could be the deciding factor between acceptance and rejection.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Advice Section */}
      <div id="advice-section">
        <AdviceSection />
      </div>

      {/* Review Service Section */}
      <div id="review-section">
        <PersonalStatementUploadForm onSuccess={handleReviewSuccess} />
      </div>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What Our Students Say
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Real feedback from students who secured their dream university places
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  "The feedback was incredibly detailed and helped me completely restructure my statement. 
                  I got offers from 4 out of 5 universities including my dream choice!"
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">SR</span>
                </div>
                <div>
                  <div className="font-semibold">Sarah R.</div>
                  <div className="text-blue-200 text-sm">Medicine at Cambridge</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  "Best £10 I ever spent! The reviewer caught mistakes I never would have seen and 
                  gave me specific suggestions that made my statement so much stronger."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MK</span>
                </div>
                <div>
                  <div className="font-semibold">Marcus K.</div>
                  <div className="text-blue-200 text-sm">Dentistry at KCL</div>
                </div>
              </div>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 border border-white border-opacity-20">
              <div className="mb-6">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-blue-100 text-lg leading-relaxed mb-4">
                  "The turnaround was incredibly fast and the feedback was so actionable. 
                  I felt much more confident submitting my application after the review."
                </p>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">AP</span>
                </div>
                <div>
                  <div className="font-semibold">Aisha P.</div>
                  <div className="text-blue-200 text-sm">Medicine at Imperial</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Perfect Your Personal Statement?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Don't let a weak personal statement derail your dreams. Get expert feedback and increase your chances of success.
          </p>
          
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20 mb-8">
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div>
                <h3 className="text-xl font-bold mb-4">✨ What You Get:</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Line-by-line detailed feedback</li>
                  <li>• Structure and flow analysis</li>
                  <li>• Content enhancement suggestions</li>
                  <li>• Admissions criteria alignment check</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">🚀 Why Choose Us:</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Expert reviewers with admissions experience</li>
                  <li>• 48-hour turnaround guaranteed</li>
                  <li>• Proven track record of success</li>
                  <li>• Affordable at just £10</li>
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={() => document.getElementById('review-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-4 rounded-2xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Get Your Review - £10 →
          </button>
        </div>
      </section>

      {/* Success Modal */}
      <ReviewSuccessModal 
        isOpen={showSuccessModal} 
        onClose={closeSuccessModal} 
      />
    </div>
  );
};

export default PersonalStatementPage;