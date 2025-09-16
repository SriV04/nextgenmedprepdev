'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

// Define application stages
const applicationStages = {
  medicine: [
    { id: 'research', name: 'Research & Planning', 
      description: 'Researching medical schools and planning your application strategy' },
    { id: 'ucat', name: 'UCAT Preparation', 
      description: 'Preparing for the University Clinical Aptitude Test' },
    { id: 'personal-statement', name: 'Personal Statement', 
      description: 'Drafting and refining your personal statement' },
    { id: 'interviews', name: 'Interviews', 
      description: 'Preparing for MMIs and Panel interviews' },
    { id: 'post-offer', name: 'Post-Offer', 
      description: 'After receiving offers, preparing for medical school' },
  ],
  dentistry: [
    { id: 'research', name: 'Research & Planning', 
      description: 'Researching dental schools and planning your application strategy' },
    { id: 'ucat', name: 'UCAT Preparation', 
      description: 'Preparing for the University Clinical Aptitude Test' },
    { id: 'personal-statement', name: 'Personal Statement', 
      description: 'Crafting a compelling personal statement for dentistry' },
    { id: 'interviews', name: 'Interviews', 
      description: 'Preparing for dental school interviews' },
    { id: 'post-offer', name: 'Post-Offer', 
      description: 'After receiving offers, preparing for dental school' },
  ]
};

// Define resources for each stage and course type
const resources = {
  medicine: {
    research: [
      { name: 'Ultimate Medicine Application Guide', path: '/resources/ultimate-medicine-application-guide', type: 'Guide' },
      { name: 'Medical School Events', path: '/events', type: 'Event' },
      { name: 'Free Consultation', path: '/free-consultation', type: 'Service' },
    ],
    ucat: [
      { name: 'UCAT Preparation Services', path: '/ucat', type: 'Service' },
      { name: 'Free UCAT Resources', path: '/ucat/free-resources', type: 'Resource' },
    ],
    'personal-statement': [
      { name: 'Personal Statement Review', path: '/personal-statements', type: 'Service' },
      { name: 'Personal Statement Workshops', path: '/events', type: 'Event' },
    ],
    interviews: [
      { name: 'MMI Preparation', path: '/interviews/mmi', type: 'Service' },
      { name: 'Panel Interview Preparation', path: '/interviews/panel', type: 'Service' },
      { name: 'Ethics Guide', path: '/resources/ultimate-ethics-guide', type: 'Guide' },
      { name: 'Medical Hot Topics Guide', path: '/resources/ultimate-medical-hot-topics', type: 'Guide' },
    ],
    'post-offer': [
      { name: 'Medical School Preparation', path: '/events', type: 'Event' },
      { name: 'Free Consultation', path: '/free-consultation', type: 'Service' },
    ],
  },
  dentistry: {
    research: [
      { name: 'Dental School Application Guide', path: '/free-consultation', type: 'Service' },
      { name: 'Dentistry Events', path: '/events', type: 'Event' },
      { name: 'Free Consultation', path: '/free-consultation', type: 'Service' },
    ],
    ucat: [
      { name: 'UCAT Preparation Services', path: '/ucat', type: 'Service' },
      { name: 'Free UCAT Resources', path: '/ucat/free-resources', type: 'Resource' },
    ],
    'personal-statement': [
      { name: 'Dentistry Personal Statement Review', path: '/personal-statements', type: 'Service' },
      { name: 'Personal Statement Workshops', path: '/events', type: 'Event' },
    ],
    interviews: [
      { name: 'Dentistry MMI Preparation', path: '/interviews/mmi', type: 'Service' },
      { name: 'Panel Interview Preparation', path: '/interviews/panel', type: 'Service' },
      { name: 'Ethics Guide', path: '/resources/ultimate-ethics-guide', type: 'Guide' },
    ],
    'post-offer': [
      { name: 'Dental School Preparation', path: '/events', type: 'Event' },
      { name: 'Free Consultation', path: '/free-consultation', type: 'Service' },
    ],
  }
};

// Type definitions
type CourseType = 'medicine' | 'dentistry';
type StageId = string;

// Resource type icon mapping
const resourceIcons = {
  Guide: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  Event: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Service: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Resource: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
};

const StageCard = ({ 
  stage, 
  isSelected, 
  onClick 
}: { 
  stage: { id: string; name: string; description: string }; 
  isSelected: boolean; 
  onClick: () => void 
}) => (
  <div 
    className={`p-5 rounded-xl cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'bg-gradient-to-br from-blue-600 to-cyan-700 text-white shadow-lg transform scale-105' 
        : 'bg-white border border-gray-200 hover:shadow-md hover:border-blue-300'
    }`}
    onClick={onClick}
  >
    <h3 className={`text-xl font-bold mb-2 ${isSelected ? 'text-white' : 'text-gray-800'}`}>
      {stage.name}
    </h3>
    <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
      {stage.description}
    </p>
  </div>
);

const ResourceCard = ({ resource }: { resource: { name: string; path: string; type: string } }) => (
  <Link href={resource.path} className="block">
    <div className="p-5 rounded-xl bg-white border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-300">
      <div className="flex items-center mb-3 text-blue-600">
        {resourceIcons[resource.type as keyof typeof resourceIcons]}
        <span className="text-sm font-semibold">{resource.type}</span>
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">{resource.name}</h3>
      <div className="flex items-center text-blue-600 text-sm font-semibold">
        Learn more
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
);

export default function GetStarted() {
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);
  const [selectedStage, setSelectedStage] = useState<StageId | null>(null);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const handleCourseSelect = (course: CourseType) => {
    setSelectedCourse(course);
    setSelectedStage(null); // Reset stage selection when course changes
  };

  const handleStageSelect = (stageId: StageId) => {
    setSelectedStage(stageId);
  };

  // Get resources for the selected course and stage
  const getResources = () => {
    if (!selectedCourse || !selectedStage) return [];
    return resources[selectedCourse][selectedStage as keyof typeof resources[typeof selectedCourse]];
  };

  return (
    <div className="bg-[var(--color-background-primary)] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('/grid.svg')] bg-cover" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Find Your Path to <span className="text-cyan-300">Success</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Discover tailored resources and services to support your medical or dental school application journey
          </p>
        </div>
      </div>

      
      {/* Service Finder */}
      <div className="max-w-6xl mx-auto px-4 -mt-8">
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 md:p-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Step 1: Choose Course */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-center">Step 1: Select Your Course</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Medicine Card */}
              <div 
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                  selectedCourse === 'medicine' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105' 
                    : 'bg-white border border-gray-200 hover:shadow-md hover:border-blue-300'
                }`}
                onClick={() => handleCourseSelect('medicine')}
              >
                <div className="w-20 h-20 mb-4 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-full h-full ${selectedCourse === 'medicine' ? 'text-white' : 'text-blue-600'}`}>
                    <path fill="currentColor" d="M10.5 15.429h1.5v1.5h-1.5v-1.5zm0-9h1.5v7.5h-1.5v-7.5zm7.125-3h-11.25c-.825 0-1.5.675-1.5 1.5v15c0 .825.675 1.5 1.5 1.5h11.25c.825 0 1.5-.675 1.5-1.5v-15c0-.825-.675-1.5-1.5-1.5zm0 16.5h-11.25v-15h11.25v15z"/>
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${selectedCourse === 'medicine' ? 'text-white' : 'text-gray-800'}`}>
                  Medicine
                </h3>
                <p className={`text-sm ${selectedCourse === 'medicine' ? 'text-white/90' : 'text-gray-600'}`}>
                  Preparing for medical school applications
                </p>
              </div>
              
              {/* Dentistry Card */}
              <div 
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                  selectedCourse === 'dentistry' 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg transform scale-105' 
                    : 'bg-white border border-gray-200 hover:shadow-md hover:border-blue-300'
                }`}
                onClick={() => handleCourseSelect('dentistry')}
              >
                <div className="w-20 h-20 mb-4 relative">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`w-full h-full ${selectedCourse === 'dentistry' ? 'text-white' : 'text-blue-600'}`}>
                    <path fill="currentColor" d="M12 2c-4.97 0-9 4.03-9 9 0 3.63 2.5 7.53 5.04 9.83.79.74 1.34 1.18 1.68 1.38.35.21.62.28.96.28s.61-.07.96-.28c.34-.2.89-.64 1.68-1.38 2.54-2.3 5.04-6.2 5.04-9.83 0-4.97-4.03-9-9-9zm0 12.75c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${selectedCourse === 'dentistry' ? 'text-white' : 'text-gray-800'}`}>
                  Dentistry
                </h3>
                <p className={`text-sm ${selectedCourse === 'dentistry' ? 'text-white/90' : 'text-gray-600'}`}>
                  Preparing for dental school applications
                </p>
              </div>
            </div>
          </div>
          
          {/* Step 2: Choose Stage */}
          {selectedCourse && (
            <motion.div 
              className="mb-10"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Step 2: Select Your Application Stage</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {applicationStages[selectedCourse].map((stage) => (
                  <StageCard
                    key={stage.id}
                    stage={stage}
                    isSelected={selectedStage === stage.id}
                    onClick={() => handleStageSelect(stage.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          {/* Step 3: Recommended Resources */}
          {selectedCourse && selectedStage && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-8"
            >
              <h2 className="text-2xl font-bold mb-6 text-center">Recommended Resources & Services</h2>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {getResources().map((resource, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <ResourceCard resource={resource} />
                  </motion.div>
                ))}
              </motion.div>
              
              <motion.div 
                className="mt-12 text-center"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4">Need personalized guidance?</h3>
                <Link href="/free-consultation" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  Book a Free Consultation
                </Link>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold mb-2">When should I start preparing for medical/dental school?</h3>
                <p className="text-gray-700">
                  Ideally, you should start preparing at least 12-18 months before you plan to submit your application. 
                  This gives you ample time to prepare for entrance exams, gain relevant experience, and craft a compelling application.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold mb-2">What UCAT score do I need?</h3>
                <p className="text-gray-700">
                  UCAT score requirements vary by institution. Competitive medical schools typically look for scores in the top 25-30%, 
                  which is around 2700+. However, some universities place less emphasis on the UCAT and more on other aspects of your application.
                </p>
              </div>
              
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-xl font-bold mb-2">How should I prepare for interviews?</h3>
                <p className="text-gray-700">
                  Preparation should include understanding different interview formats (MMI vs. traditional), practicing common scenarios and questions,
                  staying updated on medical ethics and current healthcare topics, and participating in mock interviews for feedback.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-2">What makes a good personal statement?</h3>
                <p className="text-gray-700">
                  A strong personal statement demonstrates your motivation for studying medicine/dentistry, relevant experiences, understanding of the profession,
                  and key skills and qualities. It should be reflective, specific, and authentic to you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
