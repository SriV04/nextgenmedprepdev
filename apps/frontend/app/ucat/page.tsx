import React from 'react';
import Link from 'next/link';
import UCATCalculator from '../../components/ucat/UCATCalculator';
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
      title: "Personalised Revision Plan", // payment screen with info email, phone number - 20 quid text every week 
      description: "Tailored study plan to maximize your strengths and address weaknesses.",
      features: ["Calculator techniques", "Data interpretation", "Formula shortcuts"],
      icon: CalculatorIcon,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },

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

            <Link href="#tutoring-packages" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Join our Programs
            </Link>
          </div>
        </div>
      </section>

      {/* UCAT Calculator Component */}
      <UCATCalculator />

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
              <div key={index} className={`p-6 rounded-xl border-2 ${service.color} hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
                <div className="flex items-start gap-4 mb-6">
                  <service.icon className="w-10 h-10 text-current flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.description}</p>
                  </div>
                </div>
                
                <div className="mb-6 flex-grow">
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
                
                <Link href="/resources/ultimate-ucat-prep-guide" className="mt-auto">
                  <button className={`w-full ${service.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                  Learn More
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* UCAT Tutoring Packages 
        make into a table better 
      */}
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
                  <Link href="/ucat/payment?package=ucat_kickstart" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 block text-center">
                    Get Started
                  </Link>
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
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Everything in Kickstart:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">4 hours of essential background knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">24/7 Business Line access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Tracked quantitative performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Personalised content plan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">15%+ score increase guarantee</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Plus these advanced features:</h4>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>8 hours of targeted question-specific perfection sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Deep-dives into the exact areas the data shows you're weakest in</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Smart drills and focused practice to convert weaknesses into strengths</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£375</span>
                  </div>
                  <Link href="/ucat/payment?package=ucat_advance" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300 block text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
            
            {/* UCAT Mastery Package */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <div className="bg-indigo-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">UCAT Mastery</h3>
                <p className="opacity-90">For those aiming for top 10% scores.</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-3">Everything in Kickstart & Advance:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">4 hours of essential background knowledge</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Tracked quantitative performance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Personalised content plan</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">15%+ score increase guarantee</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">8 hours of targeted perfection sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Deep-dive weakness analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-0.5">✓</span>
                      <span className="text-gray-600">Smart drills and focused practice</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Plus these mastery features:</h4>
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
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Priority support and accelerated response times</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span>Advanced test-taking strategies for top percentile scores</span>
                    </li>
                  </ul>
                </div>
                <div className="border-t pt-6 mt-4">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-3xl font-bold text-gray-900">£550</span>
                  </div>
                  <Link href="/ucat/payment?package=ucat_mastery" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all duration-300 block text-center">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Boost Your UCAT Score?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our proven program and unlock your medical school dreams
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#tutoring-packages" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
              Join Our Programs
            </Link>
            <Link 
              href="#ucat-calculator"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Calculate Hours Needed
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}