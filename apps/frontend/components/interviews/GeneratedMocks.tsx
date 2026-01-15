import React from 'react';
import Link from 'next/link';
import { SparklesIcon, BoltIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { interviewPackages } from '../../data/packages';

export default function GeneratedMocks() {
  const essentials = interviewPackages.find(pkg => pkg.id === 'essentials');
  const core = interviewPackages.find(pkg => pkg.id === 'core');
  const premium = interviewPackages.find(pkg => pkg.id === 'premium');
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 px-4 py-2 rounded-full font-bold text-sm mb-4 shadow-lg">
            <SparklesIcon className="w-5 h-5" />
            AI-POWERED • 24HR TURNAROUND
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Prometheus Generated Mock Interviews
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            University-specific mock interview questions powered by our Prometheus Technology. Get access to tailored practice materials at a fraction of the cost.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BoltIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Same Day Access</h3>
            <p className="text-purple-200">
              Receive your personalised mock interview questions same day of purchase. No waiting for tutor availability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">University-Specific</h3>
            <p className="text-purple-200">
              Questions tailored to your target universities' interview formats, including MMI, panel, and traditional styles.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ClockIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Practice On Your Schedule</h3>
            <p className="text-purple-200">
              Complete model answers included. Practice at your own pace, review as many times as needed, perfect for self-directed learners.
            </p>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <h4 className="text-lg font-semibold mb-2">Essentials</h4>
            <div className="text-4xl font-bold mb-2">£{essentials?.generatedPrice}</div>
            <p className="text-purple-200 text-sm mb-4">{essentials?.interviews} complete mock interview set</p>
            <Link href="/interviews/payment?service=generated&package=essentials" className="block w-full bg-white text-purple-900 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors">
              Get Started
            </Link>
          </div>

          <div className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-md border-2 border-yellow-400 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h4 className="text-lg font-semibold mb-2">Core</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              {core?.originalGeneratedPrice && (
                <span className="text-2xl text-gray-300 line-through">£{core.originalGeneratedPrice}</span>
              )}
              <span className="text-4xl font-bold text-yellow-400">£{core?.generatedPrice}</span>
            </div>
            <p className="text-purple-200 text-sm mb-4">{core?.interviews} complete mock interview sets</p>
            <Link href="/interviews/payment?service=generated&package=core" className="block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
              Best Value
            </Link>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/30 rounded-xl p-6 text-center hover:transform hover:scale-105 transition-all duration-300">
            <h4 className="text-lg font-semibold mb-2">Premium</h4>
            <div className="flex items-center justify-center gap-2 mb-2">
              {premium?.originalGeneratedPrice && (
                <span className="text-2xl text-gray-300 line-through">£{premium.originalGeneratedPrice}</span>
              )}
              <span className="text-4xl font-bold">£{premium?.generatedPrice}</span>
            </div>
            <p className="text-purple-200 text-sm mb-4">{premium?.interviews} complete mock interview sets</p>
            <Link href="/interviews/payment?service=generated&package=premium" className="block w-full bg-white text-purple-900 py-3 rounded-lg font-semibold hover:bg-purple-100 transition-colors">
              Go Premium
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/prometheus" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors group">
            <span>Learn more about Prometheus AI Technology</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
