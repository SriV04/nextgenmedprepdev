import React from 'react';
import Link from 'next/link';
import ConferenceCalendar from '../../components/events/ConferenceCalendar';
import '@/styles/globals.css';

// Enhanced upcoming events data with full descriptions
const upcomingEvents = [
  {
    id: 1,
    title: "Pathways to Medicine Conference",
    date: "2025-02-15",
    time: "10:00 AM - 2:00 PM",
    type: "pathways",
    description: "Your Journey to Medicine - Interactive session for Years 9-12",
    fullDescription: "Dreaming of becoming a doctor but not sure where to start? This interactive session breaks down each step of the journey—from subject selection and extracurriculars, to UCAT, applications, and interviews.",
    benefits: [
      "Learn what top medical schools are looking for",
      "Discover how to stand out with your academics and experiences", 
      "Get your questions answered in real-time"
    ],
    spots: 25,
    icon: "🎯",
    color: "bg-blue-50 border-blue-200"
  },
  {
    id: 2,
    title: "UCAT Crash Course",
    date: "2025-02-22",
    time: "9:00 AM - 4:00 PM",
    type: "ucat",
    description: "Start Strong, Stay Ahead - Intensive preparation for Year 12 students",
    fullDescription: "The UCAT is one of the most important—and challenging—parts of the medical school application. This fast-paced, interactive session covers all four sections of the UCAT with strategies, example questions, and tips that work.",
    benefits: [
      "Understand the format, timing, and common pitfalls",
      "Practice with real-style questions",
      "Learn how to build an effective UCAT study plan"
    ],
    spots: 30,
    icon: "📚",
    color: "bg-green-50 border-green-200"
  },
  {
    id: 3,
    title: "Ace the Interview Conference",
    date: "2025-03-08",
    time: "11:00 AM - 3:00 PM",
    type: "interview",
    description: "Master Your Med School Interview - For Years 12-13",
    fullDescription: "Getting an interview is a huge achievement—now it's time to make it count. This interactive workshop breaks down the most common interview questions and teaches you proven answering techniques.",
    benefits: [
      "Learn how to tackle MMI and panel-style questions",
      "Practice ethical scenarios, role plays, and personal reflections",
      "Get live feedback and practical tools to improve instantly"
    ],
    spots: 20,
    icon: "🎤",
    color: "bg-purple-50 border-purple-200"
  },
  {
    id: 4,
    title: "Pathways to Medicine Conference",
    date: "2025-03-22",
    time: "10:00 AM - 2:00 PM",
    type: "pathways",
    description: "Your Journey to Medicine - Interactive session for Years 9-12",
    fullDescription: "Whether you're in Year 9 just exploring your options or in Year 12 ready to apply, this session will give you clarity and direction for your medical school journey.",
    benefits: [
      "Learn what top medical schools are looking for",
      "Discover how to stand out with your academics and experiences",
      "Get your questions answered in real-time"
    ],
    spots: 25,
    icon: "🎯",
    color: "bg-blue-50 border-blue-200"
  }
];

const conferences = [
  {
    id: 1,
    title: "Pathways to Medicine Conference: Your Journey to Medicine",
    audience: "For Years 9–12",
    description: "Dreaming of becoming a doctor but not sure where to start? Pathways to Medicine is the place to understand precisely what it takes to get into medical school.",
    details: "This interactive session breaks down each step of the journey—from subject selection and extracurriculars, to UCAT, applications, and interviews. Whether you're in Year 9 just exploring your options or in Year 12 ready to apply, this session will give you clarity and direction.",
    benefits: [
      "Learn what top medical schools are looking for",
      "Discover how to stand out with your academics and experiences",
      "Get your questions answered in real-time"
    ],
    cta: "Walk away with a clear action plan—no matter your year.",
    color: "bg-blue-50 border-blue-200",
    icon: "🎯"
  },
  {
    id: 2,
    title: "UCAT Crash Course: Start Strong, Stay Ahead",
    audience: "For Year 12 Students",
    description: "The UCAT is one of the most important—and challenging—parts of the medical school application. In our UCAT Crash Course, we give you everything you need to kickstart your preparation the right way.",
    details: "This fast-paced, interactive session covers all four sections of the UCAT. It provides you with strategies, example questions, and tips that work.",
    benefits: [
      "Understand the format, timing, and common pitfalls",
      "Practice with real-style questions",
      "Learn how to build an effective UCAT study plan"
    ],
    additionalInfo: [
      "Learn in the style of a doctor with fast-paced interactive quizzes designed by top 5% scorers.",
      "Equips you with all the background knowledge to succeed in every stage of the UCAT.",
      "Perfect for students early in their prep or looking to sharpen their strategy."
    ],
    color: "bg-green-50 border-green-200",
    icon: "📚"
  },
  {
    id: 3,
    title: "Ace the Interview Conference: Master Your Med School Interview",
    audience: "For Years 12–13",
    description: "Getting an interview is a huge achievement—now it's time to make it count. Ace the Interview is an interactive workshop where we break down the most common interview questions, teach you proven answering techniques, and help you gain the confidence to stand out.",
    benefits: [
      "Learn how to tackle MMI and panel-style questions",
      "Practice ethical scenarios, role plays, and personal reflections",
      "Get live feedback and practical tools to improve instantly"
    ],
    successRate: "We are proud to say that last year, 4/5 of the students we tutored got an offer after sitting an interview, so our tips work.",
    additionalInfo: [
      "Learn how to stand out to your chosen university and walk away with an offer.",
      "We will walk you through all the background knowledge required for interview success – consent, capacity, Gillick competence and more so you can smash your interview.",
      "With a Question bank updated daily throughout interview season with the most utilised questions we can say that we make our interviews as realistic as possible"
    ],
    cta: "Be calm, be clear, be memorable—walk into your interview ready to shine.",
    color: "bg-purple-50 border-purple-200",
    icon: "🎤"
  }
];

const ConferencesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🎓</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Medical School
              <span className="block text-gradient-primary">Conferences</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Interactive workshops designed to accelerate your medical school journey with expert guidance and practical strategies.
            </p>
          </div>
        </div>
      </section>

      {/* Calendar Section - Interactive component */}
      <ConferenceCalendar upcomingEvents={upcomingEvents} />

      {/* Conferences Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Conference Programs</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive workshops tailored to different stages of your medical school journey
            </p>
          </div>
          
          <div className="space-y-8">
            {conferences.map((conference, index) => (
              <div key={conference.id} className={`p-8 rounded-xl border-2 ${conference.color} hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">{conference.icon}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{conference.title}</h3>
                    <p className="text-lg font-semibold text-gray-700 mb-4">{conference.audience}</p>
                    <p className="text-gray-700 mb-4">{conference.description}</p>
                    {conference.details && (
                      <p className="text-gray-700 mb-6">{conference.details}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2">
                    {conference.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
                        <span className="text-green-500">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {conference.successRate && (
                  <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-lg">
                    <p className="text-green-800 font-semibold">{conference.successRate}</p>
                  </div>
                )}

                {conference.additionalInfo && (
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Benefits:</h4>
                    <ul className="space-y-2">
                      {conference.additionalInfo.map((info, idx) => (
                        <li key={idx} className="text-gray-600">• {info}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {conference.cta && (
                  <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                    <p className="font-semibold text-gray-900">{conference.cta}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our interactive conferences and get the guidance you need to succeed in medical school admissions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-started" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferencesPage;
