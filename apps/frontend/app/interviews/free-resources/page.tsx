'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon, DocumentArrowDownIcon, AcademicCapIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function FreeInterviewResourcesPage() {
  const freeResources = [
    {
      title: "Ultimate Guide to MMI",
      description: "Master Multiple Mini Interviews with comprehensive preparation strategies, example scenarios, and expert tips from successful medical students.",
      image: "/guides/UGMMI.png",
      downloadUrl: "/resources/mmi",
      category: "MMI Preparation",
      pages: "45 pages",
      features: [
        "Understanding MMI format and structure",
        "Station-by-station breakdown and strategies",
        "20+ practice scenarios with model answers",
        "Common mistakes to avoid",
        "Time management techniques"
      ]
    },
    {
      title: "Ultimate Guide to Panel Interviews", 
      description: "Excel in traditional medical school panel interviews with proven strategies, common questions, and detailed guidance on how to impress your interviewers.",
      image: "/guides/UGPI.png",
      downloadUrl: "/resources/panel-interviews",
      category: "Panel Interviews",
      pages: "38 pages",
      features: [
        "Panel interview format and expectations",
        "50+ common interview questions",
        "How to structure compelling answers",
        "Body language and presentation tips",
        "Handling difficult questions with confidence"
      ]
    },
    {
      title: "Ultimate Guide to Medical Ethics",
      description: "Navigate complex ethical scenarios in medical school interviews with confidence. Learn the four pillars of medical ethics and how to apply them.",
      image: "/guides/UGME.png",
      downloadUrl: "/resources/ultimate-ethics-guide",
      category: "Medical Ethics",
      pages: "52 pages",
      features: [
        "Four pillars of medical ethics explained",
        "25+ ethical scenarios with analysis",
        "Framework for approaching ethical dilemmas",
        "Current ethical debates in medicine",
        "How to demonstrate ethical reasoning"
      ]
    },
    {
      title: "Ultimate Medical Hot Topics",
      description: "Stay updated with the latest medical trends, healthcare policies, and current affairs that frequently appear in medical school interviews.",
      image: "/guides/UMHT.png",
      downloadUrl: "/resources/ultimate-medical-hot-topics",
      category: "Current Affairs",
      pages: "60 pages",
      features: [
        "NHS structure and recent reforms",
        "AI and technology in healthcare",
        "Climate change and health",
        "Mental health and pandemic impacts",
        "Medical innovations and controversies"
      ]
    },
    {
      title: "Ultimate Guide to Medical Applications",
      description: "Complete guide to medical school applications, from choosing universities to crafting the perfect personal statement and acing the UCAT.",
      image: "/guides/UGAM.png",
      downloadUrl: "/resources/ultimate-medicine-application-guide",
      category: "Application Guide",
      pages: "72 pages",
      features: [
        "University selection strategies",
        "Personal statement writing masterclass",
        "UCAT and BMAT preparation overview",
        "Application timeline and checklist",
        "Work experience and volunteering guidance"
      ]
    },
    {
      title: "Ultimate UCAT Guide",
      description: "Comprehensive preparation guide for the UCAT exam with strategies, practice questions, and expert tips to maximize your score.",
      image: "/guides/UCAT-guide.jpeg",
      downloadUrl: "/resources/ultimate-ucat-prep-guide",
      category: "UCAT Preparation",
      pages: "65 pages",
      features: [
        "Complete breakdown of all UCAT subtests",
        "Time-saving strategies to maximize score",
        "Practice questions with detailed solutions",
        "Expert tips from top 10% scorers",
        "Step-by-step preparation timeline"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link 
            href="/interviews" 
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors group"
          >
            <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Interviews
          </Link>
          
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <SparklesIcon className="w-5 h-5" />
              <span className="font-semibold">100% Free Resources</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Free Interview Preparation Resources
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Download our comprehensive guides crafted by successful medical students and interview experts. 
              Everything you need to ace your medical school interviews, completely free.
            </p>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 px-4 bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentArrowDownIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Download</h3>
              <p className="text-gray-600">No signup required. Click and download immediately.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Content</h3>
              <p className="text-gray-600">Written by current medical students who succeeded.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Comprehensive Coverage</h3>
              <p className="text-gray-600">Over 250 pages of detailed guidance and examples.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">All Free Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {freeResources.length} comprehensive guides covering every aspect of medical school interview preparation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {freeResources.map((resource, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                {/* Image Section */}
                <div className="relative h-80 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-8">
                  <div className="relative w-48 h-64">
                    <Image
                      src={resource.image}
                      alt={resource.title}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xl"
                    />
                  </div>
                  {/* Badge */}
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    FREE
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {resource.pages}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {resource.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {resource.description}
                  </p>

                  {/* Features List */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">What's included:</h4>
                    <ul className="space-y-1">
                      {resource.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                      {resource.features.length > 3 && (
                        <li className="text-xs text-gray-500 italic pl-5">
                          +{resource.features.length - 3} more topics...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <Link 
                    href={resource.downloadUrl}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <DocumentArrowDownIcon className="w-5 h-5" />
                      Download Free Guide
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Your Preparation Further?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get personalised feedback and practice with our mock interview packages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/interviews/payment" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Book Mock Interview
            </Link>
            <Link 
              href="/prometheus" 
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Try Prometheus AI Generator
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Are these resources really free?</h3>
              <p className="text-gray-600">
                Yes! All our guides are 100% free with no hidden costs. We believe everyone should have access to quality interview preparation materials.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Do I need to create an account to download?</h3>
              <p className="text-gray-600">
                No account required. Simply click the download button and access your guide immediately.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Who wrote these guides?</h3>
              <p className="text-gray-600">
                Our guides are written by current medical students from top UK medical schools who successfully navigated the interview process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">How often are the guides updated?</h3>
              <p className="text-gray-600">
                We regularly update our resources to reflect the latest interview trends, medical hot topics, and NHS policies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
