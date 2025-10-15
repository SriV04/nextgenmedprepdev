import React from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import ResourcePageWrapper from '@/components/free-resources/ResourcePageWrapper';
import CTAButton from '@/components/free-resources/CTAButton';

export default function MMIGuidePage() {

  const benefits = [
    "Complete MMI preparation framework with proven strategies",
    "50+ practice scenarios with model answers and scoring rubrics",
    "Station-by-station breakdown of common MMI formats",
    "Expert techniques for ethical dilemmas and role-playing",
    "Time management strategies for high-pressure situations",
    "Insider tips from successful medical school applicants"
  ];

  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Proven MMI Success",
      description: "Our MMI strategies have helped over 800 students excel in their multiple mini-interviews, with a 92% success rate at top medical schools."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Master Every Station Type",
      description: "Learn how to excel in ethics stations, role-play scenarios, teamwork exercises, and data interpretation with confidence and precision."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Avoid Common Pitfalls",
      description: "Discover the most frequent MMI mistakes that cost applicants their offers and learn exactly how to avoid them in your interview."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Expert Assessor Insights",
      description: "Written with input from actual MMI assessors and medical school admissions committees who know exactly what they're looking for."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Structured Practice Plan",
      description: "Get a detailed 4-week preparation timeline with daily exercises, mock scenarios, and self-assessment tools to track your progress."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Join Successful Candidates",
      description: "Access our exclusive community of MMI success stories and connect with current medical students who aced their interviews."
    }
  ];

  const testimonials = [
    {
      name: "Rachel H.",
      university: "Cambridge Medical School",
      quote: "The MMI scenarios in this guide were incredibly realistic. I felt so prepared on interview day - it was like I'd already practiced the exact stations!",
      achievement: "8/8 MMI Stations Passed"
    },
    {
      name: "Ahmed K.",
      university: "Imperial College London",
      quote: "The ethical framework they teach is brilliant. I used it in every ethics station and felt confident tackling even the most complex dilemmas.",
      achievement: "Top Quartile MMI Score"
    },
    {
      name: "Sophie L.",
      university: "UCL Medical School",
      quote: "As someone who struggles with role-play, this guide completely transformed my approach. The techniques really work under pressure.",
      achievement: "MMI Success on First Attempt"
    },
    {
      name: "Marcus T.",
      university: "Edinburgh Medical School",
      quote: "The time management strategies were game-changing. I never felt rushed and always had time to think through my responses properly.",
      achievement: "Perfect MMI Performance"
    }
  ];

  return (
    <ResourcePageWrapper
      resourceId="ultimate-mmi-guide"
      guideName="Ultimate Guide to MMI Success"
      source="mmi_guide_download"
    >
      {/* Hero Section */}
      <FreeResourceHero
        title="The Ultimate Guide to MMI Success"
        subtitle="Master multiple mini-interviews with confidence. This comprehensive guide contains everything you need to excel in MMI scenarios, from ethical dilemmas to role-playing exercises, helping you secure your place at medical school."
        imagePath="/guides/UGMMI.png"
        imageAlt="Ultimate Guide to MMI Success cover"
        benefits={benefits}
      />

      {/* Why Get This Guide Section */}
      <WhyGetThisGuide reasons={reasons} />

      {/* What's Inside Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Inside This MMI Masterclass
            </h2>
            <p className="text-lg text-gray-600">
              80+ pages of expert MMI strategies, practice scenarios, and insider knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Ethics Station Mastery</h3>
              <p className="text-gray-600">Learn the PEACE framework for tackling any ethical dilemma with confidence and structured reasoning.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Role-Play Excellence</h3>
              <p className="text-gray-600">Master communication scenarios with patients, colleagues, and difficult situations using proven techniques.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Teamwork Scenarios</h3>
              <p className="text-gray-600">Demonstrate leadership and collaboration skills in group exercises and team-based problem solving.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Data Interpretation</h3>
              <p className="text-gray-600">Analyze charts, graphs, and research data effectively while communicating findings clearly to assessors.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Time Management</h3>
              <p className="text-gray-600">Master the art of using your limited time effectively in each station to maximize your performance.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">50+ Practice Scenarios</h3>
              <p className="text-gray-600">Comprehensive collection of MMI scenarios with model answers and detailed scoring criteria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Let MMI Anxiety Hold You Back
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful medical students who used our proven MMI strategies to ace their interviews. 
            Download your free guide now and walk into your MMI with complete confidence.
          </p>
          <CTAButton className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Your Free MMI Guide Now
          </CTAButton>
        </div>
      </section>
    </ResourcePageWrapper>
  );
}