import React from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import ResourcePageWrapper from '@/components/free-resources/ResourcePageWrapper';
import CTAButton from '@/components/free-resources/CTAButton';

export default function UltimateEthicsGuidePage() {

  const benefits = [
    "Complete framework for tackling ethical dilemmas in medical interviews",
    "40+ real ethical scenarios with expert analysis and model answers",
    "Key ethical principles explained with practical applications",
    "Common pitfalls in ethical reasoning and how to avoid them",
    "Structured approach to ethical decision-making under pressure",
    "Insider tips from medical ethics professors and admissions experts"
  ];

  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Master Medical Ethics",
      description: "Our comprehensive guide covers all major ethical principles including autonomy, beneficence, non-maleficence, and justice with real-world applications."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Proven Interview Success",
      description: "Developed by medical school professors and tested by hundreds of successful applicants who excelled in their ethics interviews."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Structured Decision Framework",
      description: "Learn our proven 5-step ethical decision-making framework that works under pressure and impresses interview panels."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Real Scenario Practice",
      description: "Practice with 40+ authentic ethical scenarios based on real medical interview questions from top UK medical schools."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Expert Analysis",
      description: "Every scenario includes detailed expert analysis explaining the ethical considerations and demonstrating best-practice answers."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Build Confidence",
      description: "Develop the confidence to tackle any ethical dilemma with our systematic approach and extensive practice materials."
    }
  ];

  return (
    <ResourcePageWrapper
      resourceId="ultimate-medicine-ethics-guide"
      guideName="Ultimate Medicine Ethics Guide"
      source="ethics_guide_download"
    >
      {/* Hero Section */}
      <FreeResourceHero
        title="The Ultimate Medicine Ethics Guide"
        subtitle="Master medical ethics for interviews and beyond. This comprehensive guide provides everything you need to confidently tackle ethical dilemmas in medical school interviews and your future medical career."
        imagePath="/guides/UGME.png"
        imageAlt="Ultimate Medicine Ethics Guide cover"
        benefits={benefits}
      />

      {/* Why Get This Guide Section */}
      <WhyGetThisGuide reasons={reasons} />

      {/* What's Inside Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Inside This Essential Ethics Guide
            </h2>
            <p className="text-lg text-gray-600">
              85+ pages of ethical frameworks, scenarios, and expert analysis
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚖️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">The Four Pillars</h3>
              <p className="text-gray-600">Comprehensive breakdown of autonomy, beneficence, non-maleficence, and justice with practical examples and applications.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Decision Framework</h3>
              <p className="text-gray-600">Our proven 5-step ethical decision-making process that works under pressure and impresses interview panels.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">40+ Real Scenarios</h3>
              <p className="text-gray-600">Authentic ethical dilemmas based on real interview questions, each with detailed analysis and model answers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Clinical Context</h3>
              <p className="text-gray-600">Understand how ethical principles apply in real medical settings, from patient care to research and healthcare policy.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expert Insights</h3>
              <p className="text-gray-600">Tips and insights from medical ethics professors, admissions tutors, and practicing doctors with years of experience.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Strategy</h3>
              <p className="text-gray-600">Specific strategies for ethics questions in MMIs, panel interviews, and traditional interviews at different medical schools.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Topics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Ethical Topics Covered
            </h2>
            <p className="text-lg text-gray-600">
              Master the most important ethical concepts for medical interviews
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Patient Care Ethics</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Informed consent and capacity</li>
                <li>• Confidentiality and disclosure</li>
                <li>• End-of-life care decisions</li>
                <li>• Treatment refusal</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Professional Ethics</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Truth-telling and honesty</li>
                <li>• Professional boundaries</li>
                <li>• Conflicts of interest</li>
                <li>• Whistleblowing and reporting</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Research Ethics</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Clinical trial participation</li>
                <li>• Research consent</li>
                <li>• Data protection</li>
                <li>• Publication ethics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Policy</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Resource allocation</li>
                <li>• Public health measures</li>
                <li>• Healthcare rationing</li>
                <li>• Global health equity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Master Medical Ethics Today
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't let ethics questions catch you off guard. Download our comprehensive guide and approach 
            every ethical dilemma with confidence and clarity.
          </p>
          <CTAButton className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Your Free Ethics Guide
          </CTAButton>
        </div>
      </section>
    </ResourcePageWrapper>
  );
}