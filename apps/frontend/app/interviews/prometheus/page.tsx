"use client";
import React from 'react';
import Link from 'next/link';
import CalendlyPopup from '../../../components/CalendlyPopup';
import '@/styles/globals.css';

const PrometheusPage = () => {
  const features = [
    "150+ expertly written MMI and panel-style questions",
    "Covers all major themes: ethics, passion for medicine, communication, empathy, NHS, data interpretation, and role plays",
    "Each question is tagged, tracked, and linked to a bespoke mark scheme",
    "New questions added and refined daily (in interview season) based on tutor insights and medical school trends",
    "Built to power our unique mock interview generator — no two mocks are the same"
  ];

  const packages = [
    {
      id: 1,
      name: "Single Mock",
      price: "£4.99",
      description: "Perfect for focused practice on a specific university",
      features: [
        "Access to 1 full mock interview",
        "University-specific questions",
        "Complete mark schemes",
        "24-hour access"
      ],
      popular: false
    },
    {
      id: 2,
      name: "Triple Mock Bundle",
      price: "£9.99",
      description: "Our most popular choice for comprehensive preparation",
      features: [
        "Access to 3 full mock interviews",
        "University-specific questions",
        "Complete mark schemes",
        "7-day access",
        "Performance tracking"
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🔥</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Prometheus: 
              <span className="block text-gradient-primary">The Ultimate Medical Interview Question Bank</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our cutting-edge interview question bank, designed to replicate the exact structure, style, and challenge level of real medical school interviews specific to your chosen university.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="#packages" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Access Prometheus
            </Link>
            <CalendlyPopup 
              url="https://calendly.com/sri-nextgenmedprep/30min" 
              className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300"
              prefill={{
                  name: "Potential Student"
              }}
              utm={{
                utmCampaign: 'prometheus-page',
                utmSource: 'website',
                utmMedium: 'hero-button'
              }}
            >
              Book Free Consultation
            </CalendlyPopup>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Always Up-to-Date</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Updated daily throughout the interview season, Prometheus ensures every mock interview is as accurate, realistic, and up-to-date as possible, reflecting current hot topics, ethical dilemmas, NHS developments, and real applicant feedback all bespoke to your chosen university.
            </p>
          </div>
          
          {/* Video or Image Placeholder */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-lg overflow-hidden mb-16">
            <div className="aspect-w-16 aspect-h-9 md:aspect-h-7">
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Precision-Targeted Preparation</h3>
                  <p className="text-gray-700">
                    Every question tailored to match the exact style and content of your target medical schools.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Features List */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center bg-blue-100 text-blue-600 p-2 rounded-full mb-4">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What sets Prometheus apart?</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-full w-8 h-8 mt-1 shrink-0">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-700 max-w-3xl mx-auto font-medium">
              Whether you're a student preparing for top-tier med schools or a tutor running high-fidelity simulations, <span className="font-bold">Prometheus</span> is the backbone of our proven mock interview system.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="packages" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Prometheus Today</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the package that suits your preparation needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
                  pkg.popular ? 'border-blue-500' : 'border-gray-200'
                } relative hover:shadow-xl transition-shadow duration-300`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 transform translate-x-3 translate-y-3 rotate-45">
                      POPULAR
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-blue-600">{pkg.price}</span>
                  </div>
                  <p className="text-gray-600 mb-6">{pkg.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <button className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    pkg.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}>
                    Get Access Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">Need a custom solution for your school or multiple students? <Link href="/contact" className="text-blue-600 hover:underline">Contact us</Link> for special pricing.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Prometheus Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From our expert question bank to your personalized mock interview
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Select Your University</h3>
              <p className="text-gray-600">Choose your target medical school to access university-specific questions and formats.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Access Your Mock</h3>
              <p className="text-gray-600">Our system generates a unique mock interview with precisely targeted questions.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Practice & Perfect</h3>
              <p className="text-gray-600">Review your performance using our detailed mark schemes and expert guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how Prometheus has helped students secure their medical school offers
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Using Prometheus transformed my interview preparation. The questions were exactly what I encountered in my actual interviews at UCL and Edinburgh. I received offers from both!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah J.</h4>
                  <p className="text-sm text-gray-600">Medical Student at UCL</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-500 mr-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-500">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The level of detail in the mark schemes was incredible. I could see exactly what the interviewers were looking for and tailor my responses accordingly. I'm now at Cambridge!"
              </p>
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">James M.</h4>
                  <p className="text-sm text-gray-600">Medical Student at Cambridge</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Medical School Interview?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get access to Prometheus today and prepare with the most accurate and up-to-date question bank available
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#packages" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Access Prometheus Now
            </Link>
            <CalendlyPopup 
              url="https://calendly.com/sri-nextgenmedprep/30min" 
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              prefill={{
                name: "Potential Student"
              }}
              utm={{
                utmCampaign: 'prometheus-cta',
                utmSource: 'website',
                utmMedium: 'footer-section'
              }}
            >
              Speak to an Advisor
            </CalendlyPopup>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrometheusPage;
