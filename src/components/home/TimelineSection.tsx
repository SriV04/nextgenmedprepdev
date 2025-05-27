'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TimelineMosaic from './TimelineMosaic'; // Ensure this path is correct

const medicineAppSteps = [
  {
    id: 'year9',
    title: 'Year 9 - Just Starting Out',
    information:
      'Focus on achieving strong GCSE grades, particularly in science subjects (Biology, Chemistry, Physics) and Maths. Begin exploring medicine as a career path: research what it means to be a doctor, the different specialties, and the challenges involved. Start looking for volunteering opportunities (e.g., in care homes, hospitals, or charities) and work experience placements to gain insight into healthcare environments and develop crucial skills like empathy and communication. These experiences are vital for your personal statement and interviews.',
    moreInfoLink: '/services/year-9-program',
  },
  {
    id: 'ucat',
    title: 'UCAT Preparation',
    information:
      'The University Clinical Aptitude Test (UCAT) is a mandatory admissions test for most UK medical and dental schools. It assesses cognitive abilities and professional behaviours. Typically, you will register and sit the UCAT in the summer between Year 12 and Year 13 (or equivalent). Thorough preparation is crucial. Familiarise yourself with the five sections: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement. Utilise official practice materials and timed mock tests.',
    moreInfoLink: '/services/ucat-preparation',
  },
  {
    id: 'personalStatement',
    title: 'Personal Statement Excellence',
    information:
      'Your personal statement is your chance to showcase your passion for medicine and stand out from thousands of applicants. This 4,000-character statement should demonstrate your motivation, experiences, skills, and understanding of the medical profession. Start drafting early, go through multiple revisions, and seek feedback from teachers and mentors. A compelling personal statement can make the difference between an interview invitation and rejection.',
    moreInfoLink: '/personal-statements',
  },
  {
    id: 'alevels',
    title: 'A-Levels Excellence',
    information:
      'Achieving the required A-Level grades (or equivalent qualifications) is the final academic hurdle. Most medical schools require A*AA-AAA, typically including Chemistry and Biology. Some may also prefer or require a third science/maths subject. Consistent revision, deep understanding of the curriculum, and effective exam technique throughout Year 12 and Year 13 are vital. Your final exams will usually take place in May-June of Year 13.',
    moreInfoLink: '/services/a-level-support',
  },
  {
    id: 'mocks',
    title: 'Interviews: Secure Your Offer',
    information:
      'After submitting your UCAS application (by October 15th in Year 13), strong candidates are invited for interviews, usually held between November and March. Universities use various formats, including Multiple Mini Interviews (MMIs) and traditional panel interviews. Prepare to discuss your motivation for medicine, understanding of the NHS, ethical scenarios, work experience reflections, and personal qualities. Practice articulating your thoughts clearly and confidently.',
    moreInfoLink: '/services/interview-coaching',
  },
  {
    id: 'dreamUni',
    title: 'Dream University! Completed Journey',
    information:
      'Congratulations! You\'ve navigated the challenging path to medical or dental school. All your hard work, dedication, and perseverance have paid off. This is the beginning of an incredible new chapter. We are immensely proud to have been a part of your journey!',
    moreInfoLink: '/about-us',
  },
];

const TimelineSection: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateActiveStep = React.useCallback((stepIndex: number) => {
    setActiveStep(Math.max(stepIndex, activeStep));
  }, [activeStep]);

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3 }}
        >
          Your Journey to Medical School
        </motion.h2>
        <motion.p
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          Follow the proven path that thousands of students have taken to achieve their dreams
        </motion.p>
      </div>

      {/* Vertical Timeline Path */}
      <div className="absolute left-8 md:left-16 top-48 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-blue-500 to-purple-600 opacity-30"></div>

      {/* Timeline Steps */}
      <div className="relative space-y-16">
        {medicineAppSteps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          
          return (
            <motion.div
              key={step.id}
              className={`relative flex items-start ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ 
                duration: 0.4, 
                delay: idx * 0.1,
                type: 'spring',
                stiffness: 120
              }}
            >
              {/* Timeline Node */}
              <div className={`absolute left-8 md:left-16 transform -translate-x-1/2 z-10 ${
                isEven ? 'md:relative md:left-0 md:transform-none md:mr-8' : 'md:relative md:left-0 md:transform-none md:ml-8'
              }`}>
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: idx * 0.1,
                    type: 'spring',
                    stiffness: 150
                  }}
                >
                  {/* Outer Ring */}
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-sky-400 to-purple-600 p-1 shadow-2xl">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
                      {/* Progress Ring */}
                      <svg className="w-16 h-16 transform -rotate-90 absolute">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-slate-200 dark:text-slate-700"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="url(#stepGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: (idx + 1) / medicineAppSteps.length }}
                          viewport={{ once: false, amount: 0.5 }}
                          transition={{ duration: 0.8, delay: idx * 0.15 }}
                        />
                        <defs>
                          <linearGradient id="stepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      
                      {/* Step Number */}
                      <motion.div
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-sky-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg relative z-10"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: false, amount: 0.5 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 + 0.2 }}
                      >
                        {idx + 1}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content Card */}
              <motion.div
                className={`flex-1 ml-20 md:ml-0 ${isEven ? 'md:ml-0' : 'md:mr-0'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.3, delay: idx * 0.1 + 0.1 }}
              >
                <div className={`relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 group max-w-lg ${
                  idx === medicineAppSteps.length - 1 ? 'bg-gradient-to-br from-emerald-50/90 to-sky-50/90 dark:from-emerald-900/30 dark:to-sky-900/30 border-emerald-200 dark:border-emerald-700' : ''
                } ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  
                  {/* Step Badge */}
                  <div className={`absolute -top-3 ${isEven ? 'left-6' : 'right-6'}`}>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-lg">
                      Step {idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4 mt-4 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + 0.2 }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Information */}
                  <motion.p
                    className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + 0.3 }}
                  >
                    {step.information}
                  </motion.p>

                  {/* More Info Button */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: false, amount: 0.3 }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + 0.4 }}
                  >
                    <a
                      href={step.moreInfoLink}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-purple-600 text-white rounded-lg font-medium hover:from-sky-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      Learn More
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  </motion.div>

                  {/* TimelineMosaic */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false, amount: 0.1 }}
                    transition={{ duration: 0.2, delay: idx * 0.1 + 0.5 }}
                  >
                    <TimelineMosaic milestoneIdToShow={step.id} />
                  </motion.div>

                  {/* Success Glow for Final Step */}
                  {idx === medicineAppSteps.length - 1 && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Tracker */}
      <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 hidden lg:flex flex-col items-center space-y-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-slate-200/50 dark:border-slate-700/50">
        {medicineAppSteps.map((step, idx) => (
          <motion.div
            key={idx}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
            onViewportEnter={() => updateActiveStep(idx)}
          >
            <motion.div
              className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-transparent relative overflow-hidden"
              transition={{ duration: 0.5 }}
            >
              {/* Fill circle */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-sky-500 to-purple-600 rounded-full"
                initial={{ scale: 0 }}
                whileInView={{ 
                  scale: 1,
                }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
              />
            </motion.div>
            
            {/* Step label on hover */}
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                {step.title.split(' - ')[0] || step.title.split(':')[0]}
              </div>
            </div>
            
            {/* Connecting line */}
            {idx < medicineAppSteps.length - 1 && (
              <motion.div
                className="absolute top-6 left-1/2 w-0.5 h-6 bg-slate-300 dark:bg-slate-600 transform -translate-x-1/2"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.2, delay: idx * 0.05 + 0.1 }}
                style={{ transformOrigin: 'top' }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TimelineSection;