'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AcademicCapIcon, UserGroupIcon, ChatBubbleLeftRightIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';

// Team member types
type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image?: string;
  section: 'founders' | 'tutors' | 'support';
};

// Team member data
const teamMembers: TeamMember[] = [
  // Founders
  {
    name: 'Isaac Butler-King',
    role: 'Co-founder',
    bio: 'Isaac co-founded NextGen Med Prep with a vision to revolutionize medical school preparation. With experience in education and a passion for helping students achieve their dreams, he leads our strategic direction.',
    image: '/headshots/[NGMP] Isaac2.png', // Replace with actual image when available
    section: 'founders'
  },
  {
    name: 'Dan Leach',
    role: 'Co-founder',
    bio: 'Dan brings extensive experience in medical education to NextGen Med Prep. His innovative approach to teaching and deep understanding of the medical school application process has helped shape our unique methodology.',
    image: '/headshots/[NGMP] Dan.png', 
    section: 'founders'
  },
  
  // Expert Tutors
  {
    name: 'Matthew Cranfield',
    role: 'Expert Tutor',
    bio: 'Matthew specializes in UCAT preparation and interview coaching. With top percentile scores in all medical admissions tests and multiple medical school offers, he helps students navigate the complexities of the application process.',
    image: '/headshots/[NGMP] Matthew.png',
    section: 'tutors'
  },
  {
    name: 'Lucinda Slack',
    role: 'Expert Tutor',
    bio: 'Lucinda excels in personal statement development and interview preparation. Her background in medical admissions gives her unique insights into what medical schools are looking for in candidates.',
    image: '/headshots/[NGMP] Lucinda.png', 
    section: 'tutors'
  },
  
  // Support Team
  {
    name: 'Srihasha Vitta',
    role: 'Support Team',
    bio: 'Srihasha ensures our students have the best possible experience with NextGen Med Prep. Managing our operational processes and student support systems, she is dedicated to helping each student succeed.',
    image: '/headshots/[NGMP] Sriharsha.png', // Replace with actual image when available
    section: 'support'
  }
];

// Our story information
const ourStory = {
  title: 'Our Story',
  tagline: 'Creating a different kind of medical preparation experience',
  sections: [
    {
      heading: 'A Vision for Excellence',
      content: 'NextGen Med Prep was founded with a simple idea - medical school preparation should be accessible, effective, and tailored to each student\'s unique needs. We\'re more than just tutors; we\'re mentors who have successfully navigated the path you\'re on now.'
    },
    {
      heading: 'The Gillick Approach',
      content: 'Our approach combines personalized attention, data-driven methods, and a focus on building confidence. We call it the Gillick Approach - a comprehensive system that addresses every aspect of medical school applications.'
    },
    {
      heading: 'Affordable Excellence',
      content: 'We believe quality medical school preparation shouldn\'t break the bank. By being efficient, technology-driven, and focused on what really matters, we provide premium services at accessible prices.'
    },
    {
      heading: 'A Different Experience',
      content: 'We wanted to be different from other preparation services. Our students don\'t just learn content - they develop skills, confidence, and strategies that will serve them throughout their medical careers.'
    }
  ]
};

// About Page component
export default function AboutPage() {
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
            About <span className="text-gradient-primary">NextGen Med Prep</span>
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We're a team of dedicated professionals committed to helping you achieve your medical school dreams.
          </motion.p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <RocketLaunchIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{ourStory.title}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {ourStory.tagline}
              </p>
            </motion.div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {ourStory.sections.map((section, index) => (
              <motion.div 
                key={index}
                className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md p-6 border border-gray-100"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">{section.heading}</h3>
                <p className="text-gray-600">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Founders Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <UserGroupIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Founders</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the visionaries behind NextGen Med Prep
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
            {teamMembers
              .filter(member => member.section === 'founders')
              .map((founder, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row"
                  variants={fadeInUp}
                >
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-6 flex items-center justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                      {founder.image ? (
                        <Image 
                          src={founder.image} 
                          alt={founder.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                          {founder.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{founder.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{founder.role}</p>
                    <p className="text-gray-600">{founder.bio}</p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Our Expert Tutors Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <AcademicCapIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Expert Tutors</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Learn from experienced medical professionals who know what it takes to succeed
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
            {teamMembers
              .filter(member => member.section === 'tutors')
              .map((tutor, index) => (
                <motion.div 
                  key={index}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-md overflow-hidden border border-gray-100"
                  variants={fadeInUp}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500 mr-4">
                        {tutor.image ? (
                          <Image 
                            src={tutor.image} 
                            alt={tutor.name} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
                            {tutor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{tutor.name}</h3>
                        <p className="text-blue-600">{tutor.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">{tutor.bio}</p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* Our Support Team Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUp}
            >
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Support Team</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet the people who ensure your journey with us is smooth and successful
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerChildren}
          >
            {teamMembers
              .filter(member => member.section === 'support')
              .map((support, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row"
                  variants={fadeInUp}
                >
                  <div className="md:w-1/3 bg-gradient-to-br from-green-400 to-blue-500 p-6 flex items-center justify-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                      {support.image ? (
                        <Image 
                          src={support.image} 
                          alt={support.name} 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl">
                          {support.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{support.name}</h3>
                    <p className="text-green-600 font-semibold mb-4">{support.role}</p>
                    <p className="text-gray-600">{support.bio}</p>
                  </div>
                </motion.div>
              ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Medical School Journey?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the hundreds of students who have achieved their dreams with NextGen Med Prep
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300">
                Get Started Today
              </Link>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}