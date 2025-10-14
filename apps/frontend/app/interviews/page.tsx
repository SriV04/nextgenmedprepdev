"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserGroupIcon, AcademicCapIcon, ReceiptPercentIcon, BookOpenIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

import { interviewPackages } from './data/interviewPackages';

export default function InterviewsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const freeResources = [
    {
      title: "Ultimate Guide to MMI",
      description: "Master Multiple Mini Interviews with comprehensive preparation strategies",
      image: "/guides/UGMMI.png",
      downloadUrl: "/resources/mmi"
    },
    {
      title: "Ultimate Guide to Panel Interviews", 
      description: "Excel in traditional medical school panel interviews",
      image: "/guides/UGPI.png",
      downloadUrl: "/resources/panel-interviews"
    },
    {
      title: "Ultimate Guide to Medical Ethics",
      description: "Navigate ethical scenarios in medical school interviews",
      image: "/guides/UGME.png",
      downloadUrl: "/resources/ultimate-ethics-guide"
    },
    {
      title: "Ultimate Medical Hot Topics",
      description: "Stay updated with the latest medical trends and topics",
      image: "/guides/UMHT.png",
      downloadUrl: "/resources/ultimate-medical-hot-topics"
    },
    {
      title: "Ultimate Guide to Medical Applications",
      description: "Complete guide to medical school applications",
      image: "/guides/UGAM.png",
      downloadUrl: "/resources/ultimate-medicine-application-guide"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(freeResources.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(freeResources.length / 3)) % Math.ceil(freeResources.length / 3));
  };

  const services = [
    {
      title: "Mock MMIs (Multiple Mini Interviews)",
      description: "Excel in MMI stations with targeted practice and expert guidance from our tutors.",
      features: ["Station-based practice", "Ethical scenarios", "Communication skills", "Time management"],
      icon: ReceiptPercentIcon,
      color: "bg-green-50 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Mock Panel Interviews",
      description: "Master traditional medical school interviews with our experienced panel of medical professionals.",
      features: ["Mock interview sessions", "Personalised feedback", "Question bank practice", "Confidence building"],
      icon: UserGroupIcon,
      color: "bg-blue-50 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Interview Background Knowledge",
      description: "Interview Conference sessions to cover all the essential background knowledge for medical school interviews.",
      features: ["Individual coaching", "Tailored preparation", "Personal statement alignment", "Body language tips"],
      icon: AcademicCapIcon,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Interview Conferences",
      description: "Join our intensive group sessions and learn alongside fellow medical school applicants.",
      features: ["Group workshops", "Peer learning", "Expert seminars", "Networking opportunities"],
      icon: ReceiptPercentIcon,
      color: "bg-orange-50 border-orange-200",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🎤</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Master Your Medical School
              <span className="block text-gradient-primary">Interviews</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Build confidence, refine your responses, and showcase your passion for medicine with our comprehensive interview preparation services.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link 
              href="/interviews/payment" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Book Mock Interview
            </Link>
            <Link href="/interviews/payment" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Try Generated Questions
            </Link>
          </div>
        </div>
      </section>

      {/* Why Interview Prep Matters */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Interview Preparation Matters</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Medical school interviews are your chance to shine beyond grades and test scores.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Boost Success Rate</h3>
              <p className="text-gray-600">Students who practice interviews are 3x more likely to receive offers</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Confidence</h3>
              <p className="text-gray-600">Reduce anxiety and nervousness through realistic practice scenarios</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Stand Out</h3>
              <p className="text-gray-600">Learn to articulate your passion and unique qualities effectively</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Interview Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive preparation for every type of medical school interview
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`p-8 rounded-xl border-2 ${service.color} hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
                <div className="flex items-start gap-4 mb-6">
                  {/* <span className="text-4xl">{service.icon}</span> */}
                  <service.icon className="w-10 h-10 text-current" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex-grow">
                  <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                    {/* Prometheus link excluded from Interview Background knowledger service */}
                    {service.title !== "Interview Background knowledger" && !service.title.toLowerCase().includes("background") && (
                      <li className="mt-4 pt-2 border-t border-dashed border-gray-200">
                        <Link href="/prometheus" className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-all duration-200 group">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">NEW</span>
                          <span className="font-medium">Powered by our innovative <span className="underline decoration-2 decoration-purple-400 group-hover:decoration-purple-600">Prometheus</span> mock generator</span>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
                
                <Link 
                  href={
                    service.title.toLowerCase().includes("background") || service.title.toLowerCase().includes("conference") 
                      ? "/events" 
                      : "/interviews/payment"
                  } 
                  className={`block w-full ${service.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300 text-center mt-auto`}
                >
                  {service.title.toLowerCase().includes("background") || service.title.toLowerCase().includes("conference") 
                    ? "View Events" 
                    : "Book Now"
                  }
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Packages */}
      <section id="interview-packages" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Packages</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our tailored interview preparation packages to maximize your success
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Essentials Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{interviewPackages[0].name}</h3>
                <p className="opacity-90">{interviewPackages[0].description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {interviewPackages[0].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{feature.includes('Prometheus') ? (
                        <>
                          {feature.split('Prometheus')[0]}
                          <Link href="/prometheus" className="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 underline decoration-dotted">Prometheus</Link>
                          {feature.split('Prometheus')[1]}
                        </>
                      ) : feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£{interviewPackages[0].tutorPrice}</span>
                    <span className="text-sm text-gray-500">per interview</span>
                  </div>
                  <Link href={`/interviews/payment?service=actual&package=${interviewPackages[0].id}`} className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Core Package */}
            <div className="relative bg-white rounded-xl shadow-md overflow-hidden border-2 border-yellow-400 hover:shadow-lg transition-all duration-300 transform scale-105 z-10 ring-2 ring-yellow-200">
              {/* Popular Tag */}
              <div className="absolute -top-2 -right-2 z-20">
                <span className="bg-yellow-400 text-purple-900 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  POPULAR
                </span>
              </div>

              <div className="bg-purple-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{interviewPackages[1].name}</h3>
                <p className="opacity-90">{interviewPackages[1].description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {interviewPackages[1].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{feature.includes('Prometheus') ? (
                        <>
                          {feature.split('Prometheus')[0]}
                          <Link href="/prometheus" className="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 underline decoration-dotted">Prometheus</Link>
                          {feature.split('Prometheus')[1]}
                        </>
                      ) : feature}</span>
                      {idx === 1 && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium ml-2">FREE</span>}
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£{interviewPackages[1].tutorPrice}</span>
                    <span className="text-sm text-gray-500">complete package</span>
                  </div>
                  <Link href={`/interviews/payment?service=actual&package=${interviewPackages[1].id}`} className="block w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>

            
            {/* Premium Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-indigo-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{interviewPackages[2].name}</h3>
                <p className="opacity-90">{interviewPackages[2].description}</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  {interviewPackages[2].features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>{feature.includes('Prometheus') ? (
                        <>
                          {feature.split('Prometheus')[0]}
                          <Link href="/prometheus" className="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 underline decoration-dotted">Prometheus</Link>
                          {feature.split('Prometheus')[1]}
                        </>
                      ) : feature}</span>
                      {idx === 1 && <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium ml-2">FREE</span>}
                    </li>
                  ))}
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£{interviewPackages[2].tutorPrice}</span>
                    <span className="text-sm text-gray-500">complete package</span>
                  </div>
                  <Link href={`/interviews/payment?service=actual&package=${interviewPackages[2].id}`} className="block w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 text-center">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Interview Types Info */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Understanding Interview Formats</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Different medical schools use different interview formats. We'll prepare you for all of them.
            </p>
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

      {/* Free Resources Shopping Carousel */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Free Interview Preparation Resources</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Download our comprehensive guides to boost your interview preparation
            </p>
          </div>
          
          <div className="relative">
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: Math.ceil(freeResources.length / 3) }, (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid md:grid-cols-3 gap-6 px-4">
                      {freeResources
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((resource, index) => (
                          <div key={slideIndex * 3 + index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                            {/* Thumbnail Image */}
                            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-6">
                              <div className="relative w-32 h-48">
                                <Image
                                  src={resource.image}
                                  alt={resource.title}
                                  fill
                                  className="object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
                                />
                              </div>
                              {/* Quick View Badge */}
                              <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                                FREE
                              </div>
                            </div>
                            
                            {/* Content */}
                            <div className="p-6">
                              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
                                {resource.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                                {resource.description}
                              </p>
                              
                              {/* Features */}
                              <div className="space-y-2 mb-6">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="text-green-500">✓</span>
                                  Expert-written content
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="text-green-500">✓</span>
                                  Practical examples & scenarios
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span className="text-green-500">✓</span>
                                  Proven strategies
                                </div>
                              </div>
                              
                              {/* Download Button */}
                              <Link 
                                href={resource.downloadUrl}
                                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 group-hover:from-blue-700 group-hover:to-purple-700"
                              >
                                Download Free Guide
                              </Link>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-50"
              disabled={currentSlide === 0}
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 z-10 disabled:opacity-50"
              disabled={currentSlide === Math.ceil(freeResources.length / 3) - 1}
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-600" />
            </button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: Math.ceil(freeResources.length / 3) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need More than Free Resources</h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of successful applicants who prepared with NextGenMedPrep
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/interviews/payment?service=actual&package=core" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Book Mock Interview Now!
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Ask Questions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
