"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TileData {
  id: string;
  title: string;
  content: string;
  colSpan?: number; // For irregular grid, e.g., 1 or 2, applied tablette and up
  rowSpan?: number; // For irregular grid, e.g., 1 or 2, applied tablette and up
  type: 'explanation' | 'service' | 'statistic' | 'comparison' | 'moreInfo'; 
  link?: string; // Optional link for 'moreInfo' tiles
  statValue?: string; // New: For 'statistic' tiles, the main number/value
  statLabel?: string; // New: For 'statistic' tiles, the descriptive text below the value
}

interface MilestoneData {
  id: string;
  name: string;
  tiles: TileData[];
}

const milestones: MilestoneData[] = [
  {
    id: 'year9',
    name: 'Year 9: Foundation & Exploration', // More concise title
    tiles: [
    //   { id: 'y9-explanation', title: 'Subject Choices', content: 'Guidance on early subject selections and extracurriculars to build a strong profile for medicine or dentistry.', type: 'explanation', colSpan: 2 },
      { id: 'y9-service', title: 'Early Mentorship', content: 'Personalized consultations, academic tracking, and initial exposure to healthcare careers.', type: 'service' },
      {
        id: 'y9-stat',
        title: 'Confident Start',
        content: 'Students starting early feel significantly more prepared.',
        type: 'statistic',
        statValue: '95%',
        statLabel: 'more confident in their path',
      },
      { id: 'y9-comparison', title: 'Med vs. Dentistry', content: 'Explore career differences and similarities to help you consider your preferred path early on.', type: 'comparison', rowSpan: 2 },
      { id: 'y9-moreinfo', title: 'Year 9 Program', content: 'Discover our tailored Year 9 program details.', type: 'moreInfo', link: '/services/year-9-program' },
    ],
  },
  {
    id: 'ucat',
    name: 'UCAT: Mastering the Test', // More concise title
    tiles: [
    //   { id: 'ucat-explanation', title: 'What is UCAT?', content: 'The University Clinical Aptitude Test (UCAT) is a critical admissions exam for medical and dental schools.', type: 'explanation', colSpan: 2 },
      { id: 'ucat-service', title: 'UCAT Prep', content: 'Intensive workshops, realistic mock exams, and personalized feedback to boost your UCAT score.', type: 'service' },
      {
        id: 'ucat-stat',
        title: 'Top Percentile Scores',
        content: 'Our students consistently achieve high UCAT scores.',
        type: 'statistic',
        statValue: '85%',
        statLabel: 'score in the top 20th percentile',
      },
      { id: 'ucat-comparison', title: 'UCAT for Both', content: 'Understand subtle UCAT differences and strategic preparation for medicine vs. dentistry.', type: 'comparison', colSpan: 2 },
      { id: 'ucat-moreinfo', title: 'UCAT Resources', content: 'Access our comprehensive UCAT preparation materials.', type: 'moreInfo', link: '/services/ucat-preparation', colSpan: 2 },
    ],
  },
  {
    id: 'alevels',
    name: 'A-Levels: Academic Excellence', // More concise title
    tiles: [
    //   { id: 'alevels-explanation', title: 'Crucial Grades', content: 'Achieving top A-Level grades, especially in sciences, is essential for medical and dental school entry.', type: 'explanation', colSpan: 2, rowSpan: 2 },
      { id: 'alevels-service', title: 'A-Level Tutoring', content: 'Targeted tutoring, effective revision strategies, and exam technique coaching for key subjects.', type: 'service' },
      {
        id: 'alevels-stat',
        title: 'A/A* Success',
        content: 'We help students achieve their desired A-Level results.',
        type: 'statistic',
        statValue: '90%',
        statLabel: 'achieve A/A* in science A-Levels',
      },
      { id: 'alevels-moreinfo', title: 'A-Level Support', content: 'Learn how we support A-Level students.', type: 'moreInfo', link: '/services/a-level-support' },
    ],
  },
  {
    id: 'interviews', // Renamed 'mocks' to 'interviews' for clarity
    name: 'Interviews: Secure Your Offer', // More concise title
    tiles: [
    //   { id: 'interviews-explanation', title: 'The Interview Process', content: 'Medical and dental interviews (MMI or traditional) assess your suitability beyond academics.', type: 'explanation', colSpan: 2 },
      { id: 'interviews-service', title: 'Interview Coaching', content: 'Realistic mock interviews, detailed feedback, and strategies for common and challenging questions.', type: 'service', rowSpan: 2 },
      {
        id: 'interviews-stat',
        title: 'High Offer Rate',
        content: 'Our interview coaching leads to outstanding offer rates.',
        type: 'statistic',
        statValue: '92%',
        statLabel: 'success rate in receiving offers',
      },
      { id: 'interviews-comparison', title: 'Interview Nuances', content: 'Understand the distinct focuses of medical vs. dental interviews and how to prepare for each.', type: 'comparison' },
      { id: 'interviews-moreinfo', title: 'Interview Prep', content: 'Explore comprehensive interview coaching details.', type: 'moreInfo', link: '/services/interview-coaching' },
    ],
  },
];

const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08, // Slightly reduced delay for snappier appearance
      duration: 0.5,
    },
  }),
};

const hoverVariants = {
  hover: {
    scale: 1.03, // Reduced scale for subtler hover
    boxShadow: '0px 12px 25px rgba(0,0,0,0.25)', // Slightly more pronounced shadow
    transition: { duration: 0.3 },
  },
};

const getTileStyle = (type: TileData['type']) => {
  switch (type) {
    case 'explanation':
      return 'bg-sky-700 text-white'; // Darker sky blue
    case 'service':
      return 'bg-teal-600 text-white'; // Darker teal
    case 'statistic':
      return 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white'; // Gradient for stat tiles
    case 'comparison':
      return 'bg-slate-700 text-white';
    case 'moreInfo':
      return 'bg-rose-600 hover:bg-rose-700 text-white cursor-pointer'; // Darker rose
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

interface TimelineMosaicProps {
  milestoneIdToShow: string;
}

const TimelineMosaic: React.FC<TimelineMosaicProps> = ({ milestoneIdToShow }) => {
  const milestone = milestones.find(m => m.id === milestoneIdToShow || (milestoneIdToShow === 'mocks' && m.id === 'interviews'));

  if (!milestone) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mt-6 px-4" // Added responsive columns and padding
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {milestone.tiles.map((tile, index) => {
        const isStatistic = tile.type === 'statistic';
        const linkWrapperProps = tile.type === 'moreInfo' && tile.link
          ? {
              as: 'a',
              href: tile.link,
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'block h-full', // Ensure the anchor tag fills the tile
            }
          : {};

        return (
          <motion.div
            key={tile.id}
            custom={index}
            variants={tileVariants}
            whileHover="hover"
            className={`p-6 rounded-xl shadow-lg flex flex-col ${isStatistic ? 'justify-center items-center text-center' : 'justify-between'}
                        ${getTileStyle(tile.type)}
                        ${tile.colSpan ? `sm:col-span-${tile.colSpan}` : ''}
                        ${tile.rowSpan ? `sm:row-span-${tile.rowSpan}` : ''}
                        min-h-[180px] md:min-h-[220px] lg:min-h-[200px]`} // Adjusted min-heights for better screen fit
            {...linkWrapperProps} // Apply link wrapper props if it's a moreInfo tile
          >
            {isStatistic ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-5xl md:text-6xl font-extrabold text-white leading-tight"> {/* Larger, bolder number */}
                  {tile.statValue}
                </div>
                <p className="text-sm md:text-base mt-2 opacity-90">
                  {tile.statLabel}
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-2 leading-tight">{tile.title}</h3> {/* Concise title */}
                  <p className="text-sm opacity-90 flex-grow">{tile.content}</p>
                </div>
                {tile.type === 'moreInfo' && tile.link && (
                  <div className="mt-auto pt-3">
                    <span className="inline-block px-4 py-2 text-xs font-semibold rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      Learn More &rarr;
                    </span>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TimelineMosaic;