import React from 'react';
import Link from 'next/link';
import UCATCalculator from '../../components/ucat/UCATCalculator';
import { ucatPackages } from '@/data/packages';
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
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      link: "resources/ultimate-ucat-prep-guide", 
      buttonText: "Get the Guide"
    },
    {
      title: "Tutoring",
      description: "Master reading comprehension, critical thinking, and inference skills for the VR section.",
      features: ["Speed reading techniques", "Question analysis", "Inference strategies", "Time management"],
      icon: BookOpenIcon,
      color: "bg-green-50 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700",
      link: "#tutoring-packages",
      buttonText: "Book Now"
    },
    {
      title: "Personalised Revision Plan", // payment screen with info email, phone number - 20 quid text every week hours a day target score and intensity. 
      description: "Tailored study plan to maximize your strengths and address weaknesses.",
      features: ["Personalised Reminders", "Weekly Check-ins", "Progress Tracking"],
      icon: CalculatorIcon,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
      link: "/personalised-revision-plan",
      buttonText: "Get Started"
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
      <section className="relative bg-white py-24 px-6 overflow-hidden">
        
        {/* --- Soft Background Washes --- */}
        {/* These replace the 'dark mode' glows with light, airy colors */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[60%] bg-purple-100/60 rounded-full blur-[100px]" />
            <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-100/40 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Friendly Icon Badge */}
          <div className="mx-auto w-20 h-20 mb-8 bg-white rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 rotate-[-6deg] hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl">🧠</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6 leading-tight">
            Master the <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600">
              UCAT Exam
            </span>
          </h1>

          {/* Description - Lighter text for a welcoming vibe */}
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Turn test anxiety into test mastery. Join the program designed to guide you 
            through every section with expert tutoring and unlimited practice.
          </p>
          
          {/* Buttons - Soft shadows and gradients */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="#tutoring-packages" 
                className="px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-1 transition-all duration-300"
              >
                Join Our Programs
              </Link>

              <Link 
                  href="/ucat/free-test" 
                  className="group px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-full font-semibold hover:border-violet-200 hover:text-violet-600 hover:bg-violet-50 transition-all duration-300 flex items-center gap-2"
              >
                  Free Resources
                  <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
              </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-semibold text-slate-400">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              5-Star Rated Tutoring
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>100+ Practice Questions</span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span>1-on-1 Strategy</span>
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
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">UCAT Test Sections</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding each section is key to effective preparation
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {ucatSections.map((section, index) => (
              <div 
                key={index} 
                className={`bg-white p-8 rounded-2xl border-2 ${section.color} shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group`}
              >
                <div className="flex items-start gap-5 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${
                    section.color.includes('blue') ? 'from-blue-50 to-blue-100' :
                    section.color.includes('green') ? 'from-green-50 to-green-100' :
                    section.color.includes('orange') ? 'from-orange-50 to-orange-100' :
                    'from-indigo-50 to-indigo-100'
                  } group-hover:scale-110 transition-transform duration-300`}>
                    <section.icon className={`w-8 h-8 ${
                      section.color.includes('blue') ? 'text-blue-600' :
                      section.color.includes('green') ? 'text-green-600' :
                      section.color.includes('orange') ? 'text-orange-600' :
                      'text-indigo-600'
                    } flex-shrink-0`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {section.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">{section.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PuzzlePieceIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">{section.questions}</span>
                  </div>
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

                <Link href={service.link} className="mt-auto">
                  <button className={`w-full ${service.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300`}>
                  {service.buttonText}
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
            {ucatPackages.map((pkg) => (
              <div 
                key={pkg.id}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 relative"
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className={`${pkg.color} p-6 text-white`}>
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className="opacity-90">{pkg.description}</p>
                </div>
                <div className="p-6">
                  {pkg.baseFeatures && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700 mb-3">
                        {pkg.id === 'ucat_advance' ? 'Everything in Kickstart:' : 'Everything in Kickstart & Advance:'}
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {pkg.baseFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-0.5">✓</span>
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {pkg.advancedFeatures && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        {pkg.id === 'ucat_advance' ? 'Plus these advanced features:' : 'Plus these mastery features:'}
                      </h4>
                      <ul className="space-y-3 mb-8">
                        {pkg.advancedFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="text-green-500 mr-2 mt-1">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {!pkg.baseFeatures && (
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-1">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  <div className="border-t pt-6 mt-4">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-3xl font-bold text-gray-900">£{pkg.price}</span>
                    </div>
                    <Link 
                      href={`/ucat/payment?package=${pkg.id}`} 
                      className={`w-full ${pkg.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300 block text-center`}
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
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