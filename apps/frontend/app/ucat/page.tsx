"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import CalendlyPopup from '../../components/CalendlyPopup';
import { 
  PuzzlePieceIcon, 
  ChartBarIcon, 
  BookOpenIcon, 
  UserGroupIcon,
  ClockIcon,
  TrophyIcon,
  AcademicCapIcon,
  CalculatorIcon
} from '@heroicons/react/24/outline';

export default function UCATPage() {
  const [currentScore, setCurrentScore] = useState<number>(2000);
  const [targetScore, setTargetScore] = useState<number>(2500);
  const [calculatedHours, setCalculatedHours] = useState<number>(0);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);

  const calculateTutoringHours = () => {
    const scoreDifference = targetScore - currentScore;
    
    // If current score is higher than target, recommend maintenance hours
    if (scoreDifference <= 0) {
      setCalculatedHours(2); // Minimum 2 hours for score maintenance
      return;
    }
    
    let baseHours = Math.max(3, Math.ceil(scoreDifference / 25)); // At least 3 hours minimum
    
    // Add extra hours for higher target scores (premium positioning)
    if (targetScore >= 2500) {
      baseHours += 3;
    } else if (targetScore >= 2400) {
      baseHours += 2;
    }
    
    // Add complexity factor for lower starting scores
    if (currentScore < 2300) {
      baseHours += 4;
    } else if (currentScore < 2500) {
      baseHours += 2;
    }
    
    // Ensure minimum of 3 hours
    setCalculatedHours(Math.max(3, baseHours));
  };

  const services = [
    {
      title: "Free ",
      description: "Complete preparation covering all four UCAT sections with expert tutoring and proven strategies.",
      features: ["All section coverage", "Practice tests", "Expert tutoring", "Score improvement guarantee"],
      icon: AcademicCapIcon,
      color: "bg-blue-50 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Tutoring",
      description: "Master reading comprehension, critical thinking, and inference skills for the VR section.",
      features: ["Speed reading techniques", "Question analysis", "Inference strategies", "Time management"],
      icon: BookOpenIcon,
      color: "bg-green-50 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Personalised Revision Plan",
      description: "Excel in mathematical problem-solving with our structured QR preparation program.",
      features: ["Math fundamentals", "Calculator techniques", "Data interpretation", "Formula shortcuts"],
      icon: CalculatorIcon,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },

  ];

  const testimonials = [
    {
      name: "Alex K.",
      school: "Imperial Medicine",
      quote: "Improved my UCAT score from 2400 to 2890! The strategies really work.",
      rating: 5,
      improvement: "+490 points"
    },
    {
      name: "Maya P.",
      school: "Cambridge Medicine",
      quote: "The quantitative reasoning section was my weakness, but now it's my strongest!",
      rating: 5,
      improvement: "+380 points"
    },
    {
      name: "Jordan L.",
      school: "UCL Medicine",
      quote: "Excellent teaching and mock tests. Felt completely prepared on test day.",
      rating: 5,
      improvement: "+420 points"
    }
  ];

  const ucatSections = [
    {
      name: "Verbal Reasoning",
      description: "Reading comprehension and critical thinking",
      duration: "22 minutes",
      questions: "44 questions",
      icon: BookOpenIcon,
      color: "border-blue-500"
    },
    {
      name: "Quantitative Reasoning", 
      description: "Mathematical problem solving and data analysis",
      duration: "26 minutes",
      questions: "36 questions", 
      icon: CalculatorIcon,
      color: "border-green-500"
    },
    {
      name: "Decision Making",
      description: "Logical reasoning and problem solving",
      duration: "37 minutes", 
      questions: "35 questions",
      icon: TrophyIcon,
      color: "border-orange-500"
    },
    {
      name: "Situational Judgement",
      description: "Professional behavior and ethics",
      duration: "26 minutes",
      questions: "69 questions",
      icon: UserGroupIcon,
      color: "border-indigo-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🧠</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Master the
              <span className="block text-gradient-primary">UCAT</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Achieve your target UCAT score with our comprehensive preparation program. Expert tutoring, proven strategies, and unlimited practice tests.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="/ucat/free-resources" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Improve My Score!
            </Link>
            <Link href="#services" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Join our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* Tutoring Hours Calculator */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">UCAT Tutoring Hours Calculator</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find out how many tutoring hours you need to reach your target UCAT score
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Current UCAT Score (or Expected Score)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1800"
                    max="3000"
                    step="10"
                    value={currentScore}
                    onChange={(e) => setCurrentScore(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1800</span>
                    <span>3000</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-2xl font-bold text-blue-600">{currentScore}</span>
                  <p className="text-sm text-gray-500">Current Score</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Target UCAT Score
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="2200"
                    max="3200"
                    step="10"
                    value={targetScore}
                    onChange={(e) => setTargetScore(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>2200</span>
                    <span>3200</span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="text-2xl font-bold text-purple-600">{targetScore}</span>
                  <p className="text-sm text-gray-500">Target Score</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mb-8">
              <button
                onClick={calculateTutoringHours}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
              >
                Calculate Required Hours
              </button>
            </div>
            
            {calculatedHours > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200 text-center">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-blue-600">{calculatedHours}</span>
                  <span className="text-lg text-gray-700 ml-2">hours</span>
                </div>
                
                {/* 0-4 hours: UCAT Kickstart */}
                {calculatedHours >= 0 && calculatedHours <= 4 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      You matched with UCAT Kickstart! 🎯
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Perfect for building strong foundations. Our Kickstart package will give you the essential background knowledge across all UCAT sections to boost your performance.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <CalendlyPopup 
                        url="https://calendly.com/sri-nextgenmedprep/30min"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                        prefill={{
                          name: "UCAT Kickstart Inquiry"
                        }}
                        utm={{
                          utmCampaign: 'ucat-kickstart',
                          utmSource: 'calculator',
                          utmMedium: 'recommendation'
                        }}
                      >
                        Book UCAT Kickstart - £200
                      </CalendlyPopup>
                    </div>
                  </>
                )}
                
                {/* 4-8 hours: UCAT Advance */}
                {calculatedHours > 4 && calculatedHours <= 8 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      This suits UCAT Advance! 📈
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ideal for refining and targeting performance. Our Advance package includes everything in Kickstart plus 8 hours of targeted question-specific perfection sessions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <CalendlyPopup 
                        url="https://calendly.com/sri-nextgenmedprep/30min"
                        className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
                        prefill={{
                          name: "UCAT Advance Inquiry"
                        }}
                        utm={{
                          utmCampaign: 'ucat-advance',
                          utmSource: 'calculator',
                          utmMedium: 'recommendation'
                        }}
                      >
                        Book UCAT Advance - £375
                      </CalendlyPopup>
                    </div>
                  </>
                )}
                
                {/* 8-12 hours: UCAT Mastery */}
                {calculatedHours > 8 && calculatedHours <= 12 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Matches with UCAT Mastery! 🎖️
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Perfect for aiming for top 10% scores. Our Mastery package includes everything in Advance plus 12 hours of high-intensity question-perfection sessions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <CalendlyPopup 
                        url="https://calendly.com/sri-nextgenmedprep/30min"
                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300"
                        prefill={{
                          name: "UCAT Mastery Inquiry"
                        }}
                        utm={{
                          utmCampaign: 'ucat-mastery',
                          utmSource: 'calculator',
                          utmMedium: 'recommendation'
                        }}
                      >
                        Book UCAT Mastery - £550
                      </CalendlyPopup>
                    </div>
                  </>
                )}
                
                {/* Above 12 hours: Contact form */}
                {calculatedHours > 12 && (
                  <>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Custom Tutoring Plan Needed 📚
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Your score gap requires more intensive tutoring. Let's create a personalized plan that fits your specific needs and timeline.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                      <button
                        onClick={() => setShowContactForm(true)}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300"
                      >
                        Get Custom Tutoring Plan
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Contact Form Modal */}
            {showContactForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Get Custom Tutoring Plan</h3>
                    <button
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your phone number"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current UCAT Score</label>
                      <input
                        type="text"
                        value={currentScore}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target UCAT Score</label>
                      <input
                        type="text"
                        value={targetScore}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours Needed</label>
                      <input
                        type="text"
                        value={`${calculatedHours} hours`}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tell us about your UCAT preparation timeline, specific challenges, or any other relevant information..."
                      ></textarea>
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                      >
                        Submit Request
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This calculator provides an estimate based on typical score improvements. Individual results may vary based on starting ability, study habits, and commitment level.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why UCAT Prep Matters */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why UCAT Preparation is Essential</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The UCAT is a crucial component of your medical school application. Don't leave it to chance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <ClockIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Pressure</h3>
              <p className="text-gray-600">Only 2 hours to complete 233 questions across 5 sections</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <TrophyIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High Stakes</h3>
              <p className="text-gray-600">UCAT scores significantly impact medical school admission chances</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <ChartBarIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Skill-Based</h3>
              <p className="text-gray-600">Success requires specific strategies and extensive practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* UCAT Sections Overview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">UCAT Test Sections</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding each section is key to effective preparation
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {ucatSections.map((section, index) => (
              <div key={index} className={`bg-white p-6 rounded-xl border-l-4 ${section.color} shadow-sm hover:shadow-md transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-4">
                  <section.icon className="w-8 h-8 text-current flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{section.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{section.description}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>{section.duration}</span>
                  <span>{section.questions}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our UCAT Preparation Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive courses designed to maximize your UCAT score
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`p-6 rounded-xl border-2 ${service.color} hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-6">
                  <service.icon className="w-10 h-10 text-current flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className={`w-full ${service.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Score Improvement Stats */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Proven Results</h2>
            <p className="text-lg text-gray-600">Our students consistently achieve significant score improvements</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">+450</div>
              <div className="text-gray-600">Average Score Increase</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-gray-600">Students Improve Score</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">2100+</div>
              <div className="text-gray-600">Average Final Score</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Students Helped</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from students who achieved their target UCAT scores</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">⭐</span>
                    ))}
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">
                    {testimonial.improvement}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UCAT Tutoring Packages */}
      <section id="tutoring-packages" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">UCAT Tutoring Packages</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Join our expert UCAT tutoring program and get one-on-one guidance from current medical and dental students who scored in the top 1% of UCAT test-takers.
            </p>
          </div>
          
          <div className="mb-10">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mb-12">
              <p className="text-lg text-gray-700 mb-6">
                Each student receives a fully personalised 10-week action plan tailored to their strengths and weaknesses, with weekly updates and structured days to help you maximise your study time outside tutoring sessions.
              </p>
              <p className="text-lg text-gray-700">
                Whether you're just starting out or looking to fine-tune your skills, our structured, strategic approach will keep you on track and boost your confidence every step of the way.
              </p>
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">All packages include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span> Tutors scored in the top 1% internationally
                  </li>
                  <li className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span> Continuous updated question bank with worked examples
                  </li>
                  <li className="flex items-center text-gray-700 col-span-1 md:col-span-2">
                    <span className="text-green-500 mr-2">✓</span> Free cheat sheets for each area, including the best approaches – available for everyone
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* UCAT Kickstart Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-500 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">UCAT Kickstart</h3>
                <p className="opacity-90">For those ready to build strong foundations.</p>
              </div>
              <div className="p-6">
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>4 hours of essential background knowledge across all UCAT sections</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>24/7 access to our Business Line – ask questions anytime, send in tricky problems, and receive step-by-step video solutions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Tracked quantitative performance – every question you complete feeds into our analytics</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Personalised content plan – weekly text messages guide your revision using performance data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>After one session all our students thus far saw a 15% or more increase in score across all areas</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Data-driven intervention on weak areas begins from day one</span>
                  </li>
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£200</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            
            {/* UCAT Advance Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-purple-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">UCAT Advance</h3>
                <p className="opacity-90">For those who want to refine and target performance.</p>
              </div>
              <div className="p-6">
                <p className="mb-4 font-medium text-gray-700">Everything in Kickstart, plus:</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>8 hours of targeted question-specific perfection sessions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Deep-dives into the exact areas the data shows you're weakest in based on the data from our tracking system</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Smart drills and focused practice to convert weaknesses into strengths</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Increased data input = sharper, more accurate performance tracking</span>
                  </li>
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£375</span>
                  </div>
                  <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
            
            {/* UCAT Mastery Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300">
              <div className="bg-indigo-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">UCAT Mastery</h3>
                <p className="opacity-90">For those aiming for top 10% scores.</p>
              </div>
              <div className="p-6">
                <p className="mb-4 font-medium text-gray-700">Everything in Advance, plus:</p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>12 hours of high-intensity question-perfection sessions based on your data</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Double the time, double the refinement – a laser-focused approach to peak performance</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span>Designed to bring students to test-day readiness with total confidence</span>
                  </li>
                </ul>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£550</span>
                  </div>
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300">
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your UCAT Score?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our proven program and unlock your medical school dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* TODO: update link  go to courses */}
            <Link href="/get-started" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Join Our Programs
            </Link>
            <CalendlyPopup 
              url="https://calendly.com/nextgenmedprep/consultation"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              utm={{
                utmCampaign: 'ucat-page',
                utmSource: 'website',
                utmMedium: 'cta-section'
              }}
            >
              Calculate Hours Needed
            </CalendlyPopup>
          </div>
        </div>
      </section>
    </div>
  );
}