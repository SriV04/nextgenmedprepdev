import React from 'react';
import Link from 'next/link';
import { UserGroupIcon, AcademicCapIcon, ReceiptPercentIcon } from '@heroicons/react/24/outline';

export default function ServicesSection() {
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
                href={service.title.toLowerCase().includes("background") || service.title.toLowerCase().includes("conference") ? "/events" : "/interviews/payment"} 
                className={`block w-full ${service.buttonColor} text-white py-3 rounded-lg font-semibold transition-all duration-300 text-center mt-auto`}
              >
                {service.title.toLowerCase().includes("background") || service.title.toLowerCase().includes("conference") ? "View Events" : "Book Now"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}