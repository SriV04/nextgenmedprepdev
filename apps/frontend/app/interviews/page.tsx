import React from 'react';
import Link from 'next/link';
import { UserGroupIcon, AcademicCapIcon, ReceiptPercentIcon, SparklesIcon, FireIcon } from '@heroicons/react/24/outline';
import { interviewPackages } from '../../data/packages';
import FreeResourcesCarousel from '@/components/interviews/FreeResourcesCarousel';
import ServicesSection from '@/components/interviews/ServicesSection';
import GeneratedMocks from '@/components/interviews/GeneratedMocks';
import HeroSection from '@/components/interviews/HeroSection';
import BlackFridayCTA from '@/components/black-friday/BlackFridayCTA';
import CTASection from '@/components/interviews/CTAsection';
import BlackFridayBanner from '@/components/black-friday/BlackFridayBanner';
import BlackFridayHeroSection from '@/components/black-friday/BlackFridayHeroSection';

export default function InterviewsPage() {

  return (
    <div className="min-h-screen bg-slate-50">
      <BlackFridayBanner /> 

      <BlackFridayHeroSection />

      <ServicesSection />

      <section id="interview-packages" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Black Friday Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Limited time offers to maximize your interview success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {interviewPackages.map((pkg, index) => {
              // Determine border/styling based on popularity or pricing
              const isPopular = pkg.popular;
              const hasDiscount = !!pkg.blackFridayPrice;

              return (
                <div key={pkg.id} className={`
                  relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 flex flex-col
                  ${isPopular ? 'border-2 border-yellow-400 transform scale-105 z-10 ring-4 ring-yellow-400/20' : 'border border-gray-200 hover:shadow-xl'}
                `}>
                  
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        POPULAR
                      </span>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`p-6 text-white ${
                    index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-purple-600' : 'bg-indigo-600'
                  }`}>
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <p className="opacity-90">{pkg.description}</p>
                  </div>

                  {/* Features */}
                  <div className="p-6 flex-grow">
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span className="text-sm text-gray-600">
                            {feature.includes('Prometheus') ? (
                              <>
                                {feature.split('Prometheus')[0]}
                                <Link href="/prometheus" className="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 underline decoration-dotted">Prometheus</Link>
                                {feature.split('Prometheus')[1]}
                              </>
                            ) : feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Pricing Section */}
                    <div className="border-t pt-6 mt-auto">
                      <div className="flex flex-col mb-6">
                        {hasDiscount ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-gray-400 line-through decoration-red-500 decoration-2">
                                £{pkg.tutorPrice}
                              </span>
                              <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                SAVE {Math.round(((pkg.tutorPrice - (pkg.blackFridayPrice || 0)) / pkg.tutorPrice) * 100)}%
                              </span>
                            </div>
                            <div className="flex justify-between items-end">
                               <span className="text-4xl font-extrabold text-gray-900">£{pkg.blackFridayPrice}</span>
                               <span className="text-sm text-gray-500 mb-1">complete package</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex justify-between items-center">
                            <span className="text-3xl font-bold text-gray-900">£{pkg.tutorPrice}</span>
                            <span className="text-sm text-gray-500">complete package</span>
                          </div>
                        )}
                      </div>

                      <Link 
                        href={`/interviews/payment?service=live&package=${pkg.id}`} 
                        className={`
                          block w-full py-3 rounded-lg font-bold transition-all duration-300 text-center text-white shadow-lg
                          ${index === 0 ? 'bg-blue-600 hover:bg-blue-700' : index === 1 ? 'bg-purple-600 hover:bg-purple-700' : 'bg-indigo-600 hover:bg-indigo-700'}
                          ${hasDiscount ? 'ring-2 ring-offset-2 ring-red-500' : ''}
                        `}
                      >
                        {hasDiscount ? 'Claim Offer Now' : 'Book Now'}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <GeneratedMocks />


      <section className="py-16 px-4 bg-white">
         <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Understanding Interview Formats</h2>
          </div>
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             <div>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Traditional Panel Interviews</h3>
                  <p className="text-gray-600">Face a panel of 2-4 interviewers in a formal setting. Duration: 15-30 minutes.</p>
                </div>
                <div className="border-l-4 border-green-500 pl-6">
                   <h3 className="text-xl font-semibold text-gray-900 mb-2">Multiple Mini Interviews (MMI)</h3>
                  <p className="text-gray-600">Rotate through 6-10 stations, each lasting 5-8 minutes with different scenarios.</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Online Interviews</h3>
                  <p className="text-gray-600">Video-based interviews requiring technical preparation and different presentation skills.</p>
                </div>
              </div>
            </div>
            <div className="text-center">
               <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
                <span className="text-6xl block mb-4">🎭</span>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Practice Makes Perfect</h3>
                <p className="text-gray-600">
                  Our realistic simulations prepare you for the exact format your target schools use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FreeResourcesCarousel />

      {/* CTA Section with slight BF tweak */}
      <BlackFridayCTA />
    </div>
  );
}