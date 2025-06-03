'use client';

import React, { useState, useRef } from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import EmailGateForm from '@/components/free-resources/EmailGateForm';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import SuccessModal from '@/components/free-resources/SuccessModal';

export default function PanelInterviewGuidePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [isExistingSubscription, setIsExistingSubscription] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSuccess = (downloadUrl: string, isExistingSubscription: boolean) => {
    setDownloadUrl(downloadUrl);
    setIsExistingSubscription(isExistingSubscription);
    setIsModalOpen(true);
  };

  const benefits = [
    "Complete panel interview preparation strategy and framework",
    "100+ practice questions with expert model answers",
    "Advanced techniques for handling challenging panel dynamics",
    "Body language and presentation skills for maximum impact",
    "Strategies for demonstrating leadership and teamwork",
    "Insider tips from successful medical school interview panels"
  ];

  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Panel Interview Mastery",
      description: "Our panel interview strategies have helped over 600 students excel in traditional interviews, with an 89% success rate at competitive medical schools."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Handle Multiple Interviewers",
      description: "Learn advanced techniques for managing panel dynamics, engaging with multiple personalities, and maintaining composure under pressure."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Avoid Interview Disasters",
      description: "Discover the critical mistakes that cause instant rejections in panel interviews and learn foolproof strategies to avoid them."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Real Panel Insights",
      description: "Written with input from actual medical school interview panel members and admissions tutors who conduct these interviews daily."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Comprehensive Question Bank",
      description: "Access our extensive collection of panel interview questions categorized by topic, with detailed guidance on crafting winning responses."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Join Top Performers",
      description: "Connect with our community of successful panel interview candidates and current medical students who mastered traditional interviews."
    }
  ];

  const testimonials = [
    {
      name: "Oliver C.",
      university: "Oxford Medical School",
      quote: "The panel dynamics section was invaluable. I learned how to read the room and engage with each interviewer effectively. It made such a difference!",
      achievement: "Panel Interview Success"
    },
    {
      name: "Priya S.",
      university: "King's College London",
      quote: "The question bank was comprehensive and the model answers helped me structure my responses perfectly. I felt confident throughout my 45-minute panel.",
      achievement: "First Choice Offer"
    },
    {
      name: "Thomas W.",
      university: "Bristol Medical School",
      quote: "As someone who gets nervous in group settings, this guide taught me techniques to stay calm and articulate under pressure. Game-changer!",
      achievement: "Overcame Interview Anxiety"
    },
    {
      name: "Fatima A.",
      university: "Leeds Medical School",
      quote: "The body language and presentation tips were spot-on. The interviewers commented on how confident and professional I appeared.",
      achievement: "Standout Performance"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FreeResourceHero
        title="The Ultimate Panel Interview Guide"
        subtitle="Master traditional panel interviews with confidence and poise. This comprehensive guide contains everything you need to excel in panel interview settings, from handling multiple interviewers to delivering compelling answers that secure your medical school place."
        imagePath="/guides/UGPI.png"
        imageAlt="Ultimate Panel Interview Guide cover"
        benefits={benefits}
        onGetResource={scrollToForm}
      />

      {/* Why Get This Guide Section */}
      <WhyGetThisGuide reasons={reasons} />

      {/* What's Inside Preview Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What's Inside This Panel Interview Masterclass
            </h2>
            <p className="text-lg text-gray-600">
              90+ pages of expert panel interview strategies, question banks, and presentation techniques
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Panel Dynamics Mastery</h3>
              <p className="text-gray-600">Learn how to read and engage with multiple interviewers, handling different personalities and questioning styles.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced Communication</h3>
              <p className="text-gray-600">Master verbal and non-verbal communication techniques that create lasting positive impressions with interview panels.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">❓</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">100+ Practice Questions</h3>
              <p className="text-gray-600">Comprehensive question bank covering motivation, ethics, current affairs, and scenario-based challenges.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">STAR Method Mastery</h3>
              <p className="text-gray-600">Perfect the Situation, Task, Action, Result framework for delivering structured, compelling interview answers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎭</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Confidence & Presence</h3>
              <p className="text-gray-600">Develop commanding presence, overcome interview nerves, and project the confidence medical schools seek.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Follow-up Strategies</h3>
              <p className="text-gray-600">Learn how to handle unexpected follow-up questions and maintain consistency throughout your interview.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Gate Form */}
      <div ref={formRef}>
        <EmailGateForm
          onSuccess={handleFormSuccess}
          resourceId="ultimate-panel-interview-guide"
          guideName="Ultimate Panel Interview Guide"
          source="panel_interview_guide_download"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Turn Your Panel Interview Into Your Strongest Asset
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful medical students who used our proven panel interview strategies to impress admissions committees. 
            Download your free guide now and walk into your interview with unshakeable confidence.
          </p>
          <button
            onClick={scrollToForm}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Your Free Panel Interview Guide Now
          </button>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadUrl={downloadUrl}
        guideName="Ultimate Panel Interview Guide"
        isExistingSubscription={isExistingSubscription}
      />
    </div>
  );
}