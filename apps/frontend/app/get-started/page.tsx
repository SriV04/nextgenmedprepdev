import React from 'react';
import Link from 'next/link';
import { 
  MapIcon, 
  PhoneIcon, 
  UserGroupIcon, 
  LightBulbIcon,
  HeartIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function GetStartedPage() {
  const services = [
    {
      title: "Career Path Consultation",
      description: "One-on-one guidance to help you discover whether medicine or dentistry aligns with your goals, interests, and strengths.",
      features: ["Personalized assessment", "Career exploration", "Goal alignment", "Decision framework"],
      icon: MapIcon,
      color: "bg-blue-50 border-blue-200",
      buttonColor: "bg-blue-600 hover:bg-blue-700"
    },
    {
      title: "Medicine vs Dentistry Workshop",
      description: "Comprehensive group sessions exploring both career paths with current professionals and recent graduates.",
      features: ["Professional panels", "Day-in-the-life insights", "Q&A sessions", "Peer discussions"],
      icon: UserGroupIcon,
      color: "bg-green-50 border-green-200",
      buttonColor: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Specialty Exploration Call",
      description: "Deep dive into different medical and dental specialties to help you understand your options.",
      features: ["Specialty overviews", "Entry requirements", "Career prospects", "Work-life balance"],
      icon: LightBulbIcon,
      color: "bg-purple-50 border-purple-200",
      buttonColor: "bg-purple-600 hover:bg-purple-700"
    },
    {
      title: "Mentorship Network Access",
      description: "Connect with our network of medical and dental professionals for ongoing guidance and support.",
      features: ["Professional mentors", "Ongoing support", "Network events", "Career updates"],
      icon: ChatBubbleLeftRightIcon,
      color: "bg-orange-50 border-orange-200",
      buttonColor: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  const careerComparison = [
    {
      aspect: "Patient Interaction",
      medicine: "Varied patient ages and conditions, often long-term relationships",
      dentistry: "Regular patients, often preventative care, family-oriented practice",
      icon: HeartIcon
    },
    {
      aspect: "Work Environment",
      medicine: "Hospitals, clinics, diverse settings, potential for emergency work",
      dentistry: "Private practice, controlled environment, regular hours",
      icon: BeakerIcon
    },
    {
      aspect: "Training Duration",
      medicine: "5-6 years degree + 2+ years foundation + 3-8 years specialty training",
      dentistry: "5 years degree + 1 year foundation + optional specialty training",
      icon: AcademicCapIcon
    },
    {
      aspect: "Career Flexibility",
      medicine: "Multiple specialties, research, public health, global opportunities",
      dentistry: "General practice, specialties, teaching, practice ownership",
      icon: ClipboardDocumentCheckIcon
    }
  ];

  const testimonials = [
    {
      name: "Emma T.",
      career: "Now studying Medicine at Oxford",
      quote: "The career consultation helped me realize that medicine's variety and research opportunities matched my interests perfectly.",
      rating: 5,
      initialConfusion: "Was torn between medicine and dentistry"
    },
    {
      name: "David R.",
      career: "Now studying Dentistry at King's",
      quote: "Understanding the work-life balance in dentistry made my decision clear. I wanted a stable practice with regular patients.",
      rating: 5,
      initialConfusion: "Unsure about career direction"
    },
    {
      name: "Sophie L.",
      career: "Medicine at Imperial",
      quote: "The mentorship program connected me with amazing doctors who guided me through my application journey.",
      rating: 5,
      initialConfusion: "Needed clarity on medical specialties"
    }
  ];

  const nextSteps = [
    {
    step: "1", 
    title: "Complete Career Assessment",
    description: "Take our comprehensive assessment to understand your strengths and interests",
    action: "Start Assessment",
    color: "bg-blue-600"
    },
    {
      step: "2",
      title: "Book Your Free Consultation",
      description: "Schedule a 30-minute career guidance call with our expert advisors",
      action: "Book Now",
      color: "bg-green-600"
    },
    {
      step: "3",
      title: "Join Our Network",
      description: "Get connected with mentors and ongoing support throughout your journey",
      action: "Join Network", 
      color: "bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <span className="text-6xl mb-4 block">🚀</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="block text-gradient-primary">Healthcare Career Path</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Confused between medicine and dentistry? Our expert career guidance will help you make an informed decision and connect you with ongoing support throughout your journey.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Link href="#consultation" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300">
              Book Free Consultation
            </Link>
            <Link href="#comparison" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-gray-400 transition-all duration-300">
              Compare Careers
            </Link>
          </div>
        </div>
      </section>

      {/* Why Career Guidance Matters */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose the Right Career Path?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Making the right choice early saves years of uncertainty and helps you focus your preparation efforts effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 border border-blue-100">
              <StarIcon className="w-12 h-12 mx-auto text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Avoid Wrong Turns</h3>
              <p className="text-gray-600">Many students switch careers mid-study, losing valuable time and resources</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-green-50 border border-green-100">
              <LightBulbIcon className="w-12 h-12 mx-auto text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Maximize Success</h3>
              <p className="text-gray-600">Targeted preparation for your chosen path increases admission chances</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-purple-50 border border-purple-100">
              <HeartIcon className="w-12 h-12 mx-auto text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Your Passion</h3>
              <p className="text-gray-600">Align your career with your values, interests, and lifestyle goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Medicine vs Dentistry Comparison */}
      <section id="comparison" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Medicine vs Dentistry: Key Differences</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Understanding the core differences helps you make an informed decision
            </p>
          </div>
          
          <div className="space-y-8">
            {careerComparison.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4 mb-4">
                  <item.icon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                  <h3 className="text-xl font-bold text-gray-900">{item.aspect}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6 ml-12">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900 mb-2">Medicine</h4>
                    <p className="text-gray-700">{item.medicine}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900 mb-2">Dentistry</h4>
                    <p className="text-gray-700">{item.dentistry}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="consultation" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Career Guidance Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Personalized support to help you discover and pursue your ideal healthcare career
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div key={index} className={`p-8 rounded-xl border-2 ${service.color} hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-start gap-4 mb-6">
                  <service.icon className="w-10 h-10 text-current" />
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600">
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

      {/* Next Steps */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-lg text-gray-600">Your journey to the right healthcare career starts here</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {nextSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm text-center relative">
                <div className={`w-12 h-12 ${step.color} text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-6">{step.description}</p>
                <button className={`${step.color} text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-all duration-300`}>
                  {step.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Student Success Stories</h2>
            <p className="text-lg text-gray-600">See how our career guidance helped students find their path</p>
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
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                    Success Story
                  </span>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.quote}"</p>
                <div className="mb-2">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.career}</p>
                </div>
                <p className="text-xs text-gray-400">Initially: {testimonial.initialConfusion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Path?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network of successful students and get the guidance you need to make the right career choice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              Book Free Consultation
            </Link>
            <Link href="/about-us" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
              Learn About Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}