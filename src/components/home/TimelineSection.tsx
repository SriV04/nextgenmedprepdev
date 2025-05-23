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
  },
  {
    id: 'ucat',
    title: 'UCAT Preparation', // Title made slightly more descriptive
    information:
      'The University Clinical Aptitude Test (UCAT) is a mandatory admissions test for most UK medical and dental schools. It assesses cognitive abilities and professional behaviours. Typically, you will register and sit the UCAT in the summer between Year 12 and Year 13 (or equivalent). Thorough preparation is crucial. Familiarise yourself with the five sections: Verbal Reasoning, Decision Making, Quantitative Reasoning, Abstract Reasoning, and Situational Judgement. Utilise official practice materials and timed mock tests.',
  },
  {
    id: 'alevels',
    title: 'A-Levels Excellence', // Title made slightly more descriptive
    information:
      'Achieving the required A-Level grades (or equivalent qualifications) is the final academic hurdle. Most medical schools require A*AA-AAA, typically including Chemistry and Biology. Some may also prefer or require a third science/maths subject. Consistent revision, deep understanding of the curriculum, and effective exam technique throughout Year 12 and Year 13 are vital. Your final exams will usually take place in May-June of Year 13.',
  },
  {
    id: 'mocks',
    title: 'Mastering Mock Interviews', // Title made slightly more descriptive
    information:
      'After submitting your UCAS application (by October 15th in Year 13), strong candidates are invited for interviews, usually held between November and March. Universities use various formats, including Multiple Mini Interviews (MMIs) and traditional panel interviews. Prepare to discuss your motivation for medicine, understanding of the NHS, ethical scenarios, work experience reflections, and personal qualities. Practice articulating your thoughts clearly and confidently.',
  },
  {
    id: 'dreamUni',
    title: 'Dream University! Completed Journey',
    information:
      'Congratulations! You\'ve navigated the challenging path to medical or dental school. All your hard work, dedication, and perseverance have paid off. This is the beginning of an incredible new chapter. We are immensely proud to have been a part of your journey!',
  },
];

const TimelineSection: React.FC = () => {
  return (
    <div className="relative max-w-5xl mx-auto px-4"> {/* Max width and horizontal padding for timeline content alignment */}
      {medicineAppSteps.map((step, idx) => (
        <motion.div
          key={step.id}
          className="relative py-12 md:py-20 snap-start" // Added snap-start and adjusted padding
        >
          {/* Timeline Decorator */}
          <div className="absolute left-2 sm:left-3 md:left-4 top-0 h-full flex flex-col items-center w-auto">
            <div
              className={`w-1 flex-grow ${
                idx === 0 ? 'bg-transparent' : 'bg-sky-300 dark:bg-sky-700' // Softer line color
              }`}
            ></div>
            <motion.div
              className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-sky-500 dark:bg-sky-400 ring-4 ring-offset-2 ring-offset-[var(--color-background-primary,white)] ring-sky-500 dark:ring-sky-400 shadow-md z-10 my-2 shrink-0"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: false, amount: 0.8 }}
              transition={{ duration: 0.4, delay: 0.2, ease: 'backOut' }}
            ></motion.div>
            <div
              className={`w-1 flex-grow ${
                idx === medicineAppSteps.length - 1 ? 'bg-transparent' : 'bg-sky-300 dark:bg-sky-700'
              }`}
            ></div>
          </div>

          {/* Content Area */}
          <div className="ml-10 sm:ml-12 md:ml-16 lg:ml-18 relative"> {/* Adjusted left margin */}
            {/* Enhanced Title Styling */}
            <motion.h2
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6, type: 'spring', stiffness: 100, delay: 0.1 }}
              className="mb-6 sm:mb-8 text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-text-primary)] dark:text-slate-100 relative pb-3 sm:pb-4"
              // font-karla will be inherited. font-bold is applied.
            >
              {step.title}
              <span className="absolute bottom-0 left-0 h-1 sm:h-[5px] w-16 sm:w-24 bg-gradient-to-r from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600 rounded-full"></span>
            </motion.h2>

            {/* Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay:0.1 }}
              className="bg-[var(--color-background-primary,white)] dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl"
              // Using background primary for card base, enhanced shadow, subtle border, more rounded
            >
              <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg leading-relaxed sm:leading-loose">
                {step.information}
              </p>
              {/* TimelineMosaic component for additional details */}
              <div className="mt-6 sm:mt-8"> {/* Add margin top for mosaic */}
                 <TimelineMosaic milestoneIdToShow={step.id} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TimelineSection;