'use client';

import React from 'react';
import { motion } from 'framer-motion';
import TimelineMosaic from './TimelineMosaic'; // Ensure this path is correct
import { timelineCardStyles, timelineNodeStyles, timelineProgressStyles } from './TimelineStyles';

const medicineAppSteps = [
  {
    id: 'year9',
    title: 'Year 9 - Just Starting Out',
    information:
      'Focus on achieving strong GCSE grades, particularly in science subjects (Biology, Chemistry, Physics) and Maths. Begin exploring medicine as a career path: research what it means to be a doctor, the different specialties, and the challenges involved. Start looking for volunteering opportunities (e.g., in care homes, hospitals, or charities) and work experience placements to gain insight into healthcare environments and develop crucial skills like empathy and communication. These experiences are vital for your personal statement and interviews.',
    moreInfoLink: '/get-started',
  },
  {
    id: 'ucat',
    title: 'UCAT Preparation',
    information:
      'The University Clinical Aptitude Test (UCAT) is a mandatory admissions test for most UK medical and dental schools. It assesses cognitive abilities and professional behaviours. Typically, you will register and sit the UCAT in the summer between Year 12 and Year 13 (or equivalent). Thorough preparation is crucial. Familiarise yourself with the five sections: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement. Utilise official practice materials and timed mock tests.',
    moreInfoLink: '/ucat',
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
      'Achieving the required A-Level grades (or equivalent qualifications) is the final academic hurdle. Most medical schools require AAA with some, typically including Chemistry and Biology. Some may also prefer or require a third science/maths subject. Consistent revision, deep understanding of the curriculum, and effective exam technique throughout Year 12 and Year 13 are vital. Your final exams will usually take place in May-June of Year 13.',
    moreInfoLink: '/services/a-level-support',
  },
  {
    id: 'mocks',
    title: 'Interviews: Secure Your Offer',
    information:
      'After submitting your UCAS application (by October 15th in Year 13), strong candidates are invited for interviews, usually held between November and March. Universities use various formats, including Multiple Mini Interviews (MMIs) and traditional panel interviews. Prepare to discuss your motivation for medicine, understanding of the NHS, ethical scenarios, work experience reflections, and personal qualities. Practice articulating your thoughts clearly and confidently.',
    moreInfoLink: '/interviews',
  },
  {
    id: 'dreamUni',
    title: 'Dream University! Completed Journey',
    information:
      'Congratulations! You\'ve navigated the challenging path to medical or dental school. All your hard work, dedication, and perseverance have paid off. This is the beginning of an incredible new chapter. We are immensely proud to have been a part of your journey!',
  },
];

const TimelineSection: React.FC = () => {
  const [scrollY, setScrollY] = React.useState(0);
  const [activeStep, setActiveStep] = React.useState(0);
  const [visibleSteps, setVisibleSteps] = React.useState<boolean[]>(new Array(medicineAppSteps.length).fill(false));
  const [renderedSteps, setRenderedSteps] = React.useState<boolean[]>(new Array(medicineAppSteps.length).fill(false));
  const stepRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which steps are in view
      const newVisibleSteps = stepRefs.current.map((ref, index) => {
        if (!ref) return false; // Reset to false if ref is not available
        const rect = ref.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Consider a step "active" if it's in the upper half of the viewport
        const isInView = rect.top <= windowHeight * 0.6 && rect.bottom >= 0;
        return isInView;
      });
      
      // Update visible steps
      setVisibleSteps(prevVisible => {
        const hasChanged = prevVisible.some((prev, index) => prev !== newVisibleSteps[index]);
        return hasChanged ? newVisibleSteps : prevVisible;
      });
      
      // Update rendered steps - once a step is visible, mark it as rendered permanently
      setRenderedSteps(prevRendered => {
        const updatedRendered = prevRendered.map((wasRendered, index) => 
          wasRendered || newVisibleSteps[index]
        );
        const hasChanged = prevRendered.some((prev, index) => prev !== updatedRendered[index]);
        return hasChanged ? updatedRendered : prevRendered;
      });
      
      // Update active step to the highest visible step
      const lastVisibleIndex = newVisibleSteps.lastIndexOf(true);
      if (lastVisibleIndex >= 0) {
        setActiveStep(prevActive => Math.max(lastVisibleIndex, prevActive)); // Never go backwards
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Remove dependencies to prevent infinite loop

  const scrollToStep = React.useCallback((stepIndex: number) => {
    const stepRef = stepRefs.current[stepIndex];
    if (stepRef) {
      stepRef.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center'
      });
    }
  }, []);

  const updateActiveStep = React.useCallback((stepIndex: number) => {
    setActiveStep(prevActive => Math.max(stepIndex, prevActive));
  }, []);

  return (
    <div className="relative max-w-5xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2 }}
        >
          Your Journey to Medical School
        </motion.h2>
        <motion.p
          className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          Follow the proven path that thousands of students have taken to achieve their dreams
        </motion.p>
      </div>

      {/* Vertical Timeline Path - Hidden on mobile */}
      <div className="absolute left-0 md:left-4 top-48 bottom-0 w-1 bg-gradient-to-b from-sky-400 via-blue-500 to-purple-600 opacity-30 hidden md:block"></div>

      {/* Timeline Steps */}
      <div className="relative space-y-24">
        {medicineAppSteps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          
          return (
            <motion.div
              key={step.id}
              id={step.id}
              ref={(el) => { stepRefs.current[idx] = el; }}
              className={`relative flex items-start ${
                isEven ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.25, 
                delay: idx * 0.05,
                type: 'spring',
                stiffness: 150
              }}
            >
              {/* Timeline Node - Hidden on mobile */}
              <div className={`absolute left-0 md:left-4 transform -translate-x-1/2 z-10 hidden md:block ${
                isEven ? 'md:relative md:left-0 md:transform-none md:mr-8' : 'md:relative md:left-0 md:transform-none md:ml-8'
              }`}>
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: idx * 0.05,
                    type: 'spring',
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {/* Outer Ring */}
                  <div className={timelineNodeStyles.outer}>
                    <div className={timelineNodeStyles.inner}>
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
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{ duration: 0.5, delay: idx * 0.08 }}
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
                        className={timelineNodeStyles.number}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.2, delay: idx * 0.05 + 0.1 }}
                      >
                        {idx + 1}
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content Card */}
              <motion.div
                className={`flex-1 ml-0 ${isEven ? 'md:ml-0' : 'md:mr-0'}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.2, delay: idx * 0.05 + 0.05 }}
              >
                <div className={`${timelineCardStyles.base} max-w-3xl ${
                  idx === medicineAppSteps.length - 1 ? timelineCardStyles.final : ''
                } ${isEven ? 'md:mr-auto' : 'md:ml-auto'}`}>
                  
                  {/* Step Badge */}
                  <div className={`${timelineCardStyles.badge.container} ${isEven ? 'left-6' : 'right-6'}`}>
                    <span className={timelineCardStyles.badge.content}>
                      Step {idx + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <motion.h3
                    className={timelineCardStyles.title}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.15, delay: idx * 0.05 + 0.1 }}
                  >
                    {step.title}
                  </motion.h3>

                  {/* Information */}
                  <motion.p
                    className={timelineCardStyles.content}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.15, delay: idx * 0.05 + 0.15 }}
                  >
                    {step.information}
                  </motion.p>

                  {/* More Info Button - Only show if moreInfoLink exists */}
                  {step.moreInfoLink && (
                    <motion.div
                      className="mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.15, delay: idx * 0.05 + 0.2 }}
                    >
                      <a
                        href={step.moreInfoLink}
                        className={timelineCardStyles.button}
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
                  )}

                  {/* TimelineMosaic */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.15, delay: idx * 0.05 + 0.25 }}
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
      <div className={timelineProgressStyles.container}>
        {medicineAppSteps.map((step, idx) => {
          // A step is completed if it's been visited (activeStep >= idx)
          const isCompleted = activeStep >= idx;
          // A step is currently active if it's the current step being viewed
          const isCurrent = activeStep === idx;
          // Check if this is the final step
          const isFinalStep = idx === medicineAppSteps.length - 1;
          
          return (
            <motion.div
              key={idx}
              className="relative group cursor-pointer flex flex-col items-center"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
              onClick={() => scrollToStep(idx)}
            >
              <motion.div
                className={`${isFinalStep ? 'w-5 h-5' : 'w-4 h-4'} rounded-full border-2 relative overflow-hidden ${
                  isCompleted 
                    ? isFinalStep 
                      ? 'border-emerald-500 dark:border-emerald-400' 
                      : 'border-sky-500 dark:border-sky-400'
                    : 'border-slate-300 dark:border-slate-600'
                } ${
                  isCurrent 
                    ? isFinalStep
                      ? 'shadow-lg shadow-emerald-500/50 scale-110'
                      : 'shadow-lg shadow-sky-500/50 scale-110'
                    : ''
                }`}
                animate={{ 
                  scale: isCurrent ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Fill circle */}
                <motion.div
                  className={`absolute inset-0 rounded-full ${
                    isFinalStep 
                      ? 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500'
                      : 'bg-gradient-to-r from-sky-500 to-purple-600'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: isCompleted ? 1 : 0,
                  }}
                  transition={{ 
                    duration: 0.4, 
                    ease: "easeInOut",
                    delay: isCompleted ? idx * 0.1 : 0
                  }}
                />
                
                {/* Special crown icon for final step when completed */}
                {isCompleted && isFinalStep && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 150 }}
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </motion.div>
                )}
                
                {/* Checkmark for completed steps (except final step) */}
                {isCompleted && !isCurrent && !isFinalStep && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
                
                {/* Pulse effect for current step */}
                {isCurrent && (
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isFinalStep ? 'bg-emerald-500/30' : 'bg-sky-500/30'
                    }`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}
                
                {/* Golden glow effect for final step when completed */}
                {isCompleted && isFinalStep && (
                  <motion.div
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-green-400 opacity-30 blur-sm"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  />
                )}
              </motion.div>
              
              {/* Step label on hover */}
              <div className="absolute right-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                  {step.title.split(' - ')[0] || step.title.split(':')[0]}
                </div>
              </div>
              
              {/* Connecting line */}
              {idx < medicineAppSteps.length - 1 && (
                <motion.div
                  className="w-0.5 h-6 mt-2 relative"
                >
                  {/* Background line */}
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 rounded-full" />
                  
                  {/* Progress line */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-sky-500 to-purple-600 rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ 
                      scaleY: isCompleted ? 1 : 0,
                    }}
                    transition={{ 
                      duration: 0.4, 
                      ease: "easeInOut",
                      delay: isCompleted ? idx * 0.1 + 0.2 : 0
                    }}
                    style={{ transformOrigin: 'top' }}
                  />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineSection;