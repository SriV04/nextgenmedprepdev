import React from 'react';
import Link from 'next/link';
import EventsClientWrapper from '../../components/events/EventsClientWrapper';
import '@/styles/globals.css';

const ConferencesPage = () => {
  // Upcoming event
  const upcomingEvent = {
    id: "Interview_Background_Knowledge_Conference_2025_11_02",
    title: "Interview Background Knowledge Conference",
    date: "2025-11-02",
    time: "10:00 AM - 11:00 AM",
    type: "interview",
    description: "Master the background knowledge needed for medical school interviews",
    spots: 30,
    price: 15,
    details: "This comprehensive conference will equip you with all the essential background knowledge required to excel in your medical school interviews. From ethical frameworks to healthcare systems, we'll cover everything you need to know.",
    benefits: [
      "Master the Four Pillars of Medical Ethics",
      "Understand NHS structure and current healthcare issues",
      "Practice applying knowledge to real interview scenarios",
      "Interactive Session with expert tutors",
      "Q&A with Admissions Experts", 
    ],
    whatToExpect: [
      "Interactive session with real interview questions",
      "Comprehensive background knowledge materials",
      "Small group discussions and practice",
      "Q&A with medical students and doctors",
      "Downloadable resource pack"
    ], 
    auxiliaryInfo: [
      "£10 Voucher towards a mock interview!"
    ]
  };

  // Previous events data
  const previousEvents = [
    {
      id: 2,
      title: "Pathways to Medicine Conference",
      date: "2025-02-15",
      time: "10:00 AM - 2:00 PM",
      type: "pathways",
      description: "Interactive session for Years 9-12",
      spots: 25
    },
    {
      id: 3,
      title: "UCAT Crash Course",
      date: "2025-02-22",
      time: "9:00 AM - 4:00 PM",
      type: "ucat",
      description: "Intensive preparation for Year 12 students",
      spots: 30
    },
    {
      id: 4,
      title: "Ace the Interview Conference",
      date: "2025-03-08",
      time: "11:00 AM - 3:00 PM",
      type: "interview",
      description: "Master your med school interview",
      spots: 20
    },
    {
      id: 5,
      title: "Pathways to Medicine Conference",
      date: "2025-03-22",
      time: "10:00 AM - 2:00 PM",
      type: "pathways",
      description: "Interactive session for Years 9-12",
      spots: 25
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
      icon: "🎯",
      type: "pathways"
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
      icon: "📚",
      type: "ucat"
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
      icon: "🎤",
      type: "interview"
    }
  ];

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

      {/* Upcoming Event - Featured Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              🎉 Upcoming Event
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {upcomingEvent.title}
            </h2>
            <p className="text-xl text-white/90 mb-2">
              📅 November 2nd, 2025 | ⏰ {upcomingEvent.time}
            </p>
            <p className="text-lg text-white/80">
              {upcomingEvent.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Event Details */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What You'll Learn</h3>
              <p className="text-gray-600 mb-6">{upcomingEvent.details}</p>
              
              <h4 className="font-semibold text-gray-900 mb-3">Key Topics Covered:</h4>
              <ul className="space-y-3 mb-6">
                {upcomingEvent.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-purple-600 font-bold text-xl">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">What to Expect:</h4>
                <ul className="space-y-2">
                  {upcomingEvent.whatToExpect.map((item, index) => (
                    <li key={index} className="text-purple-800 text-sm flex items-start gap-2">
                      <span>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl flex flex-col">
              <div className="flex-grow">
                {/* £10 Coupon Banner */}
                <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg p-4 mb-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                  <p className="text-white font-bold text-lg mb-1">
                    🎁 BONUS OFFER 🎁
                  </p>
                  <p className="text-white text-2xl font-extrabold mb-1">
                    £10 Voucher Included!
                  </p>
                  <p className="text-white text-sm font-medium">
                    Towards any mock interview
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-600 mb-2">£{upcomingEvent.price}</div>
                  <p className="text-gray-600">per ticket</p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-semibold text-center">
                    ⚡︎ Selling fast - Get them while you can 🔥
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-semibold">Date</p>
                      <p className="text-sm text-gray-600">November 2nd, 2025</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">⏰</span>
                    <div>
                      <p className="font-semibold">Time</p>
                      <p className="text-sm text-gray-600">{upcomingEvent.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold">Format</p>
                      <p className="text-sm text-gray-600">Interactive Workshop</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                href={`/event-pay?eventId=${upcomingEvent.id}&event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                Book Your Spot Now →
              </Link>

              <p className="text-center text-gray-500 text-sm mt-4">
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Previous Events Section */}
      <section id="previous-events" className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Previous Events
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our past conferences and workshops that have helped hundreds of students succeed in their medical school journey.
            </p>
          </div>

          <EventsClientWrapper 
            events={previousEvents} 
            conferences={conferences} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Don't miss out on the Interview Background Knowledge Conference - your key to interview success!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/event-pay?event=${encodeURIComponent(upcomingEvent.title)}&date=${upcomingEvent.date}&price=${upcomingEvent.price}`}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Book November 2nd Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ConferencesPage;
