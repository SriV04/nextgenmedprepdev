'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserGroupIcon, RocketLaunchIcon, HeartIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import JoinTeamForm from '@/components/JoinTeamForm';

export default function JoinTheTeamPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const benefits = [
    {
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      title: "Make a Real Impact",
      description: "Help aspiring medical professionals achieve their dreams and transform lives through education."
    },
    {
      icon: <UserGroupIcon className="w-8 h-8" />,
      title: "Collaborative Team",
      description: "Work with passionate educators and mentors who share your commitment to excellence."
    },
    {
      icon: <AcademicCapIcon className="w-8 h-8" />,
      title: "Professional Growth",
      description: "Develop your skills in education, mentoring, and supporting the next generation of healthcare professionals."
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: "Flexible Opportunities",
      description: "Join us in various capacities - from tutoring and content creation to administrative support."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Join Our <span className="text-gradient-primary">Team</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Be part of a mission-driven team that's revolutionizing medical school preparation. 
            Help shape the future of healthcare by supporting aspiring medical professionals.
          </motion.p>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <UserGroupIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Join NextGen Med Prep?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                We're more than just a tutoring company - we're a community dedicated to excellence in medical education.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerChildren}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                variants={fadeInUp}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 text-blue-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <RocketLaunchIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                We're always looking for talented individuals to join our team. Fill out the application form below to get started.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Application Form</h3>
              <p className="text-blue-100">Tell us about yourself and how you'd like to contribute to our mission.</p>
            </div>
            
            <div className="p-8">
              <JoinTeamForm />
            </div>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            className="mt-8 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">What Happens Next?</h4>
              <div className="text-gray-600 space-y-2">
                <p>📝 <strong>Review:</strong> We'll carefully review your application within 5-7 business days</p>
                <p>📞 <strong>Interview:</strong> Qualified candidates will be contacted for a brief interview</p>
                <p>🎉 <strong>Welcome:</strong> Successful applicants will receive onboarding materials and training</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              We'd love to hear from you! Reach out if you have any questions about joining our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:team@nextgenmedprep.com" 
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Email Us</span>
              </a>
              <a 
                href="/about" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
              >
                Learn More About Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
