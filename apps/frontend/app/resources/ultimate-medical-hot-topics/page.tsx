'use client';

import React, { useState, useRef } from 'react';
import FreeResourceHero from '@/components/free-resources/FreeResourceHero';
import EmailGateForm from '@/components/free-resources/EmailGateForm';
import WhyGetThisGuide from '@/components/free-resources/WhyGetThisGuide';
import SuccessModal from '@/components/free-resources/SuccessModal';

export default function UltimateMedicalHotTopicsPage() {
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
    "Comprehensive coverage of the most current medical hot topics and controversies",
    "Expert analysis of emerging healthcare technologies and treatments",
    "Critical thinking frameworks for discussing complex medical issues",
    "Real-world case studies and scenarios for interview preparation",
    "Up-to-date information on medical research breakthroughs and their implications",
    "Structured approach to forming balanced opinions on controversial topics"
  ];

  const reasons = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Stay Current & Relevant",
      description: "Master the latest medical developments, from AI in healthcare to gene therapy, ensuring you're prepared for any interview question about current issues."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Critical Thinking Skills",
      description: "Develop the analytical framework needed to discuss controversial topics thoughtfully and demonstrate the reasoning skills medical schools value."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Interview Confidence",
      description: "Walk into any interview knowing you can intelligently discuss current medical issues, from healthcare policy to emerging treatments."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Evidence-Based Discussions",
      description: "Learn how to support your opinions with credible research and data, demonstrating the scientific approach that medical schools expect."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Balanced Perspectives",
      description: "Understand multiple viewpoints on controversial issues, showing the nuanced thinking that impresses admissions committees."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2a3 3 0 515.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Future-Ready Knowledge",
      description: "Prepare for the future of medicine by understanding trends that will shape your medical career, from telemedicine to personalized medicine."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FreeResourceHero
        title="The Ultimate Medical Hot Topics Guide"
        subtitle="Stay ahead of the curve with comprehensive coverage of current medical issues, breakthrough research, and controversial topics that matter in today's healthcare landscape."
        imagePath="/guides/UMHT.png"
        imageAlt="Ultimate Medical Hot Topics Guide cover"
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
              What's Inside This Essential Hot Topics Guide
            </h2>
            <p className="text-lg text-gray-600">
              95+ pages of current medical issues, analysis, and discussion frameworks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI in Healthcare</h3>
              <p className="text-gray-600">Comprehensive analysis of artificial intelligence applications in medicine, from diagnostic tools to treatment planning and ethical considerations.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Gene Therapy & CRISPR</h3>
              <p className="text-gray-600">Latest developments in genetic medicine, gene editing technologies, and their potential to revolutionize treatment approaches.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-green-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personalized Medicine</h3>
              <p className="text-gray-600">How precision medicine is changing healthcare delivery, from pharmacogenomics to targeted therapies and individualized treatment plans.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Health Challenges</h3>
              <p className="text-gray-600">Analysis of pandemic preparedness, health inequalities, and international healthcare policy affecting global medical practice.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Digital Health Revolution</h3>
              <p className="text-gray-600">Telemedicine, wearable technology, digital therapeutics, and the transformation of patient-doctor relationships.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Controversial Topics</h3>
              <p className="text-gray-600">Balanced analysis of contentious issues like assisted dying, organ allocation, and reproductive technologies with multiple perspectives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hot Topics Categories Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Key Medical Hot Topics Covered
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed on the most important current issues in medicine
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Emerging Technologies</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Artificial intelligence and machine learning</li>
                <li>• Robotic surgery and automation</li>
                <li>• Virtual and augmented reality in medicine</li>
                <li>• Nanotechnology applications</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Genetic Medicine</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• CRISPR and gene editing ethics</li>
                <li>• Genetic screening and privacy</li>
                <li>• Designer babies controversy</li>
                <li>• Pharmacogenomics advancement</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Healthcare Policy</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Healthcare accessibility and equity</li>
                <li>• NHS funding and sustainability</li>
                <li>• Medical tourism and quality</li>
                <li>• Climate change and health</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ethical Dilemmas</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• End-of-life care decisions</li>
                <li>• Organ allocation fairness</li>
                <li>• Medical research on vulnerable populations</li>
                <li>• Data privacy in digital health</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Preparation Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Perfect for Interview Preparation
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            This guide doesn't just inform—it prepares you to discuss these topics confidently and thoughtfully
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Discussion Frameworks</h3>
              <p className="text-gray-600">Learn structured approaches to discussing complex topics, ensuring you can articulate your thoughts clearly under pressure.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Multiple Perspectives</h3>
              <p className="text-gray-600">Understand different viewpoints on controversial issues, demonstrating the balanced thinking medical schools value.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Examples</h3>
              <p className="text-gray-600">Real-world case studies and recent developments that you can reference in interviews to show your engagement with the field.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Email Gate Form */}
      <div ref={formRef}>
        <EmailGateForm
          onSuccess={handleFormSuccess}
          resourceId="ultimate-medicine-hot-topics-guide"
          guideName="Ultimate Medical Hot Topics Guide"
          source="hot_topics_guide_download"
        />
      </div>

      {/* Final CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay Ahead in the Medical Field
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Don't get caught off guard by current medical issues. Download our comprehensive guide and demonstrate 
            your awareness of the latest developments shaping modern healthcare.
          </p>
          <button
            onClick={scrollToForm}
            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Get Your Free Hot Topics Guide
          </button>
        </div>
      </section>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        downloadUrl={downloadUrl}
        guideName="Ultimate Medical Hot Topics Guide"
        isExistingSubscription={isExistingSubscription}
      />
    </div>
  );
}