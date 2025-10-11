"use client";
import React, { useEffect } from 'react';
import CalendlyPopup from '../../components/CalendlyPopup';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: object;
        utm?: object;
      }) => void;
    };
  }
}

export default function FreeConsultationPage() {
  // Auto-open Calendly popup when page loads
  useEffect(() => {
    // Small delay to ensure script loads
    const timer = setTimeout(() => {
      if (window.Calendly) {
        window.Calendly.initPopupWidget({
          url: 'https://calendly.com/nextgenmedprep/consultation',
          utm: {
            utmCampaign: 'free-consultation-page',
            utmSource: 'website',
            utmMedium: 'direct-link'
          }
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">📞</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Book Your Free
              <span className="block text-gradient-primary">Consultation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Get personalised guidance from our medical education experts. Discuss your goals, 
              create a tailored preparation plan, and take the first step towards your medical career.
            </p>
          </div>

          {/* Manual trigger button if auto-open doesn't work */}
          <CalendlyPopup 
            url="https://calendly.com/nextgenmedprep/consultation" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transition-all duration-300 inline-flex items-center gap-2"
            utm={{
              utmCampaign: 'free-consultation-page',
              utmSource: 'website',
              utmMedium: 'manual-button'
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Schedule Your Free Consultation
          </CalendlyPopup>
        </div>
      </section>

      {/* What to Expect Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What to Expect</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your 30-minute consultation will cover everything you need to know about your medical career journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Assessment</h3>
              <p className="text-gray-600">We'll discuss your aspirations, current situation, and create a personalised roadmap</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Custom Strategy</h3>
              <p className="text-gray-600">Get a tailored preparation plan based on your timeline and target schools</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Insights</h3>
              <p className="text-gray-600">Learn insider tips and proven strategies from successful medical school applicants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Book a Consultation?</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">✅</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalised Guidance</h3>
                  <p className="text-gray-600">Get advice tailored specifically to your situation, goals, and timeline</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">🚀</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast-Track Your Success</h3>
                  <p className="text-gray-600">Learn from our expertise and avoid common pitfalls that delay applications</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Track Record</h3>
                  <p className="text-gray-600">Join hundreds of successful students who started with a consultation</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-subtle border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">💰</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Completely Free</h3>
                  <p className="text-gray-600">No hidden costs or obligations - just valuable insights to help you succeed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Take the first step towards your medical career with a free consultation
          </p>
          <CalendlyPopup 
            url="https://calendly.com/nextgenmedprep/consultation"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2"
            utm={{
              utmCampaign: 'free-consultation-page',
              utmSource: 'website',
              utmMedium: 'bottom-cta'
            }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Your Free Consultation Now
          </CalendlyPopup>
        </div>
      </section>
    </div>
  );
}