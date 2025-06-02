'use client';

import React, { useState, useRef } from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import EmailGateForm from '@/components/free-resources/EmailGateForm';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import TestimonialsSection from '@/components/TestimonialsSection';
import SuccessModal from '@/components/free-resources/SuccessModal';

export default function UltimateGuideApplicationMedicinePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleEmailSubmit = async (email: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call to backend
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          subscriptionTier: 'free_guide',
          source: 'ugam_download',
        }),
      });

      if (response.ok) {
        setIsModalOpen(true);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Complete step-by-step roadmap from Year 9 to medical school",
    "Insider secrets from current medical students and admissions experts",
    "Proven strategies that helped 1000+ students get accepted",
    "Timeline templates and checklists to keep you on track",
    "Common mistakes to avoid that could ruin your application",
    "Exclusive tips for UCAT, personal statements, and interviews"
  ];

  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Proven Success Rate",
      description: "Our guide has helped over 1,000 students secure their places at top medical schools across the UK, with a 94% success rate."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Start Early, Finish Strong",
      description: "Learn how to build the perfect medical school application from Year 9 onwards, giving you a competitive edge over other applicants."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Avoid Costly Mistakes",
      description: "Discover the top 10 mistakes that cause rejections and how to avoid them. This alone could save you years of reapplying."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Expert Insider Knowledge",
      description: "Written by current medical students and admissions experts who know exactly what universities are looking for in successful applicants."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Complete Action Plan",
      description: "Get detailed timelines, checklists, and templates that break down exactly what you need to do each year to maximize your chances."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Join a Winning Community",
      description: "Access our exclusive community of aspiring medical students, current students, and successful applicants who support each other."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      university: "Oxford Medical School",
      quote: "This guide was a game-changer! The step-by-step approach helped me stay organized and confident throughout my application. I couldn't have done it without these insights.",
      achievement: "5 Offers Received"
    },
    {
      name: "James T.",
      university: "Cambridge Medical School", 
      quote: "The timeline templates and common mistakes section saved me so much time and stress. I knew exactly what to focus on at each stage of my journey.",
      achievement: "First Time Applicant Success"
    },
    {
      name: "Aisha K.",
      university: "Imperial College London",
      quote: "As a mature student, I was worried about competing with younger applicants. This guide showed me how to leverage my unique experiences effectively.",
      achievement: "Mature Student Success"
    },
    {
      name: "Michael R.",
      university: "Edinburgh Medical School",
      quote: "The UCAT and interview preparation sections were incredibly detailed. I felt so prepared compared to other candidates on interview day.",
      achievement: "Top 10% UCAT Score"
    },
    {
      name: "Emma L.",
      university: "King's College London",
      quote: "This guide helped me understand what medical schools really want. My personal statement was so much stronger after following their framework.",
      achievement: "4 Interview Invitations"
    },
    {
      name: "David P.",
      university: "Manchester Medical School",
      quote: "The insights from current medical students were invaluable. It felt like having a mentor guiding me through every step of the process.",
      achievement: "Second Time Success"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FreeResourceHero
        title="The Ultimate Guide on Applying to Medicine"
        subtitle="Everything you need to know to get into medical school - from Year 9 to receiving your offer. This comprehensive guide has helped over 1,000 students secure their places at top UK medical schools."
        imagePath="/guides/UGAM.png"
        imageAlt="Ultimate Guide on Applying to Medicine cover"
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
              What's Inside This Comprehensive Guide
            </h2>
            <p className="text-lg text-gray-600">
              120+ pages of expert insights, practical strategies, and insider knowledge
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Year-by-Year Timeline</h3>
              <p className="text-gray-600">Detailed roadmap from Year 9 to medical school entry, with specific goals and milestones for each stage.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">UCAT Mastery Strategy</h3>
              <p className="text-gray-600">Proven techniques to excel in each UCAT section, with practice schedules and top-scorer secrets.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Statement Secrets</h3>
              <p className="text-gray-600">Step-by-step framework for crafting compelling personal statements that stand out to admissions committees.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Interview Excellence</h3>
              <p className="text-gray-600">Comprehensive preparation for MMIs and panel interviews, including practice questions and model answers.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Common Pitfalls</h3>
              <p className="text-gray-600">Top 10 mistakes that lead to rejections and exactly how to avoid them in your own application.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Work Experience Guide</h3>
              <p className="text-gray-600">How to find, secure, and maximize healthcare work experience and volunteering opportunities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <TestimonialsSection testimonials={testimonials} /> */}

      {/* Email Gate Form */}
      <div ref={formRef}>
        <EmailGateForm
          onSubmit={handleEmailSubmit}
          isLoading={isLoading}
          guideName="Ultimate Guide on Applying to Medicine"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't Leave Your Medical School Dreams to Chance
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join the thousands of successful medical students who used our proven strategies to secure their place. 
            Download your free guide now and start your journey to becoming a doctor today.
          </p>
          <button
            onClick={scrollToForm}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Your Free Guide Now
          </button>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadUrl="/guides/UGAM.png" // This would be the actual PDF in production
        guideName="Ultimate Guide on Applying to Medicine"
      />
    </div>
  );
}