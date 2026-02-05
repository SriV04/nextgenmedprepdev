import React from 'react';
import Link from 'next/link';
import UCATCalculator from '../../components/ucat/UCATCalculator';
import FreeConferenceSignup from '../../components/ucat/FreeConferenceSignup';
import { ucatPackages } from '@/data/packages';
import { 
  ClockIcon,
  CheckIcon,
  ArrowRightIcon,
  BookOpenIcon,
  AcademicCapIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default function UCATPage() {
  const highlightHours = (text: string) => {
    const parts = text.split(/(\+?\d+\s*hours?)/i);
    return parts.map((part, index) => {
      if (!part) return null;
      if (/^\+?\d+\s*hours?$/i.test(part)) {
        return (
          <span key={`${part}-${index}`} className="font-semibold text-slate-900">
            {part}
          </span>
        );
      }
      return <span key={`${part}-${index}`}>{part}</span>;
    });
  };

  const getTotalTeachingHours = (pkg: {
    baseFeatures?: string[];
    advancedFeatures?: string[];
    features: string[];
  }) => {
    const featuresSource =
      pkg.baseFeatures || pkg.advancedFeatures
        ? [...(pkg.baseFeatures ?? []), ...(pkg.advancedFeatures ?? [])]
        : pkg.features;
    const hoursMatches = featuresSource
      .flatMap((feature) => feature.match(/\+?\d+\s*hours?/gi) ?? [])
      .map((match) => parseInt(match.replace(/[^\d]/g, ''), 10))
      .filter((value) => Number.isFinite(value));
    if (!hoursMatches.length) return null;
    return hoursMatches.reduce((sum, value) => sum + value, 0);
  };

  const ucatSections = [
    { name: "Verbal Reasoning", time: "22 min", questions: 44 },
    { name: "Quantitative Reasoning", time: "26 min", questions: 36 },
    { name: "Decision Making", time: "37 min", questions: 35 },
    { name: "Situational Judgement", time: "26 min", questions: 69 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto text-center z-10">
          
          {/* Badge */}
          <a 
            href="#tutoring-packages" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-200 shadow-sm backdrop-blur-md mb-8 hover:bg-slate-900/10 hover:border-slate-300 transition-all duration-200"
          >
             <span className="text-sm font-semibold text-slate-700 tracking-wide">15%+ Score Increase Guaranteed</span>
             <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
             </svg>
          </a>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
            Master the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600">
              UCAT Exam
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop guessing what the test requires. Build confidence with expert tutoring from top 5% scorers, 
            proven strategies, and unlimited support.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link 
              href="#tutoring-packages" 
              className="px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              View Packages
            </Link>
            
            <Link 
              href="/ucat/resources" 
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/50 transition-all duration-300 shadow-sm"
            >
              Free Resources
            </Link>
          </div>

          {/* Stats / Social Proof */}
          <div className="inline-flex flex-col md:flex-row items-center gap-8 md:gap-12 px-8 py-6 bg-white/40 backdrop-blur-lg border border-white/60 rounded-2xl shadow-xl shadow-blue-900/5">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">500+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Students Helped</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200/60"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">92%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Improve Score</p>
            </div>
            <div className="hidden md:block w-px h-10 bg-slate-200/60"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-900">+450</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. Increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* UCAT Overview - Condensed */}
      <section className="py-16 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">The Test</h2>
              <p className="text-slate-500 mt-1">2 hours. 233 questions. 4 sections.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ucatSections.map((section) => (
              <div 
                key={section.name}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <h3 className="font-medium text-slate-900 mb-3">{section.name}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span>{section.time}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full" />
                  <span>{section.questions}q</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conferences */}
      <section className="py-20 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-amber-700 font-medium tracking-wide uppercase text-sm mb-3">
              Free Introduction
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Start with our free UCAT conference
            </h2>
            <p className="text-lg text-slate-600">
              Join us for an expert-led introduction covering test structure, timing strategy, and proven techniques for each section. 
              No experience needed. Perfect for beginners and those looking to refine their approach.
            </p>
          </div>

          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-6">
              <span>✨ Completely Free</span>
            </div>

            <h3 className="text-2xl font-semibold text-slate-900 mb-2">
              Introduction to UCAT
            </h3>
            <p className="text-slate-600 mb-6">
              Expert-led session covering strategy, techniques, and practice for all sections.
            </p>

            <ul className="space-y-3 mb-8">
              {['Test format & structure', 'Timing strategies for each section', 'Core problem-solving techniques', 'How to create an effective study plan', 'Q&A with top scorers'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckIcon className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-100">
              <h4 className="font-semibold text-slate-900 mb-3">Ready to get started?</h4>
              <p className="text-sm text-slate-600 mb-4">
                Enter your email below and we'll send you direct access to the conference with all the details.
              </p>
              <FreeConferenceSignup />
            </div>

            <p className="text-xs text-slate-500 text-center">
              Spots are limited. Register now to secure your place.
            </p>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-20 px-6 bg-white border-t border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="max-w-2xl mb-12">
            <p className="text-amber-700 font-medium tracking-wide uppercase text-sm mb-3">
              Add-ons
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              Extra support tools
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Revision Plan */}
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <BookOpenIcon className="w-6 h-6 text-violet-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Personalised Revision Plan
              </h3>
              <p className="text-slate-600 mb-6">
                Custom study schedule delivered weekly via text. Tailored to your target score, 
                available hours, and intensity preferences.
              </p>

              <ul className="space-y-2 mb-8">
                {['Weekly personalised schedule', 'Text message reminders', 'Progress tracking', 'Intensity customization'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckIcon className="w-4 h-4 text-violet-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">£30</span>
                <Link 
                  href="/personalised-revision-plan"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Unlimited Questions */}
            <div className="group p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <AcademicCapIcon className="w-6 h-6 text-sky-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Unlimited Question Support
              </h3>
              <p className="text-slate-600 mb-6">
                24/7 access to expert tutors. Submit any question via phone, get detailed 
                video explanations. Never feel stuck again.
              </p>

              <ul className="space-y-2 mb-8">
                {['Unlimited submissions', 'Video explanations', 'Direct tutor access', 'Fast turnaround'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckIcon className="w-4 h-4 text-sky-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-slate-900">£65</span>
                <Link 
                  href="ucat/add-ons"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Complete Conference Pack */}
            <div className="group p-8 rounded-2xl border border-amber-300 hover:border-amber-400 hover:shadow-md transition-all bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <SparklesIcon className="w-6 h-6 text-amber-600" />
              </div>
              
              <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-900 px-2 py-1 rounded text-xs font-semibold mb-3">
                Save £10
              </div>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Complete Conference Pack
              </h3>
              <p className="text-slate-600 mb-6">
                Master all four UCAT sections with expert-led sessions. 1.5 hours each: VR, DM, QR, and AR.
              </p>

              <ul className="space-y-2 mb-8">
                {['Verbal Reasoning Mastery', 'Decision Making Workshop', 'Quantitative Reasoning', 'Abstract Reasoning Techniques'].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckIcon className="w-4 h-4 text-amber-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-semibold text-slate-900">£50</span>
                  <span className="text-sm text-slate-500 line-through ml-2">£60</span>
                </div>
                <Link 
                  href="/ucat/add-ons"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-full font-medium hover:bg-amber-700 transition-colors"
                >
                  Get Bundle
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <UCATCalculator />

      {/* Tutoring Packages */}
      <section id="packages" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="text-amber-700 font-medium tracking-wide uppercase text-sm mb-3">
              Tutoring Packages
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-4">
              1-on-1 expert guidance
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Work directly with tutors who scored in the top 5%. Each package includes a 
              personalised 10-week action plan tailored to your strengths and weaknesses.
            </p>
          </div>

          {/* What's included banner */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mb-10">
            <p className="text-amber-400 font-medium text-sm mb-3">Included in all packages</p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Tutors scored in the top 5% internationally</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Updated question bank with worked examples</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">Free strategy cheat sheets for each section</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ucatPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative bg-white rounded-2xl border-2 transition-all hover:shadow-lg ${
                  pkg.popular ? 'border-amber-400' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-6 bg-amber-400 text-slate-900 px-3 py-1 rounded-full text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                
                <div className="p-6 md:p-8">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{pkg.name}</h3>
                    <p className="text-slate-500 text-sm">{pkg.description}</p>
                    {getTotalTeachingHours(pkg) && (
                      <div className="mt-3 inline-flex items-center gap-2 text-sm">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">
                          {getTotalTeachingHours(pkg)} hours total
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {pkg.baseFeatures && (
                      <div>
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                          {pkg.id === 'ucat_advance' ? 'Includes Kickstart' : 'Includes Kickstart & Advance'}
                        </p>
                        <ul className="space-y-2">
                          {pkg.baseFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className={feature.includes('FREE') || feature.includes('£') ? 'font-medium text-emerald-600' : 'text-slate-600'}>
                                {highlightHours(feature)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {pkg.advancedFeatures && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs font-medium text-amber-600 uppercase tracking-wide mb-2">
                          Plus
                        </p>
                        <ul className="space-y-2">
                          {pkg.advancedFeatures.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className={feature.includes('FREE') || feature.includes('£') ? 'font-medium text-emerald-600' : 'text-slate-600'}>
                                {highlightHours(feature)}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {!pkg.baseFeatures && (
                      <ul className="space-y-2">
                        {pkg.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckIcon className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span className={feature.includes('FREE') || feature.includes('£') ? 'font-medium text-emerald-600' : 'text-slate-600'}>
                              {highlightHours(feature)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-semibold text-slate-900">£{pkg.price}</span>
                    </div>
                    <Link 
                      href={`/ucat/payment?package=${pkg.id}`}
                      className={`block w-full py-3 rounded-full font-medium text-center transition-colors ${
                        pkg.popular 
                          ? 'bg-slate-900 text-white hover:bg-slate-800' 
                          : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
            Ready to start?
          </h2>
          <p className="text-lg text-slate-400 mb-10">
            Join hundreds of students who've transformed their UCAT preparation with our proven approach.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#packages" 
              className="inline-flex items-center justify-center px-8 py-4 bg-amber-400 text-slate-900 rounded-full font-semibold hover:bg-amber-300 transition-colors"
            >
              View Packages
            </Link>
            <Link 
              href="/ucat/conference/intro"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border border-slate-700 rounded-full font-medium hover:border-slate-500 hover:bg-slate-800 transition-colors"
            >
              Start with Free Intro
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}