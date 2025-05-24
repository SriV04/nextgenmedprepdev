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
    name: 'Year 9: Foundation Building',
    tiles: [
      { id: 'y9-service', title: 'Early Guidance', content: 'Subject choices & career exploration', type: 'service' },
      {
        id: 'y9-stat',
        title: 'Early Success',
        content: 'Students feel more prepared',
        type: 'statistic',
        statValue: '95%',
        statLabel: 'confidence boost',
      },
      { id: 'y9-comparison', title: 'Career Paths', content: 'Medicine vs. Dentistry overview', type: 'comparison' },
    ],
  },
  {
    id: 'ucat',
    name: 'UCAT: Test Mastery',
    tiles: [
      { id: 'ucat-service', title: 'UCAT Training', content: 'Mock exams & targeted practice', type: 'service' },
      {
        id: 'ucat-stat',
        title: 'Top Scores',
        content: 'High UCAT achievements',
        type: 'statistic',
        statValue: '85%',
        statLabel: 'top 20th percentile',
      },
      { id: 'ucat-comparison', title: 'Strategy Focus', content: 'Med vs. Dental UCAT prep', type: 'comparison' },
    ],
  },
  {
    id: 'personalStatement',
    name: 'Personal Statement: Stand Out',
    tiles: [
      { id: 'ps-service', title: 'Statement Coaching', content: 'Expert guidance & feedback', type: 'service' },
      {
        id: 'ps-stat',
        title: 'Success Rate',
        content: 'Strong personal statements',
        type: 'statistic',
        statValue: '98%',
        statLabel: 'satisfaction rate',
      },
      { id: 'ps-comparison', title: 'Unique Approach', content: 'Medicine vs. Dental focus', type: 'comparison' },
    ],
  },
  {
    id: 'alevels',
    name: 'A-Levels: Academic Excellence',
    tiles: [
      { id: 'alevels-service', title: 'Subject Tutoring', content: 'Science & exam technique focus', type: 'service' },
      {
        id: 'alevels-stat',
        title: 'Grade Success',
        content: 'A-Level achievements',
        type: 'statistic',
        statValue: '90%',
        statLabel: 'A/A* grades',
      },
      { id: 'alevels-comparison', title: 'Grade Requirements', content: 'Medicine vs. Dental requirements', type: 'comparison' },
    ],
  },
  {
    id: 'mocks',
    name: 'Interviews: Final Step',
    tiles: [
      { id: 'interviews-service', title: 'Interview Prep', content: 'MMI & panel interview training', type: 'service' },
      {
        id: 'interviews-stat',
        title: 'Offer Success',
        content: 'Outstanding offer rates',
        type: 'statistic',
        statValue: '92%',
        statLabel: 'success rate',
      },
      { id: 'interviews-comparison', title: 'Interview Types', content: 'Medical vs. Dental focus areas', type: 'comparison' },
    ],
  },
  {
    id: 'dreamUni',
    name: 'Success: Dream Achieved',
    tiles: [
      { id: 'success-service', title: 'Ongoing Support', content: 'Continued mentorship & guidance', type: 'service' },
      {
        id: 'success-stat',
        title: 'Dreams Realized',
        content: 'Student success stories',
        type: 'statistic',
        statValue: '100%',
        statLabel: 'journey complete',
      },
      { id: 'success-celebration', title: 'Celebration', content: 'Welcome to medical school!', type: 'comparison' },
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
      return 'bg-gradient-to-br from-sky-500 to-sky-600 text-white';
    case 'service':
      return 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white';
    case 'statistic':
      return 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white';
    case 'comparison':
      return 'bg-gradient-to-br from-slate-600 to-slate-700 text-white';
    case 'moreInfo':
      return 'bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white cursor-pointer';
    default:
      return 'bg-gradient-to-br from-gray-400 to-gray-500 text-white';
  }
};

interface TimelineMosaicProps {
  milestoneIdToShow: string;
}

const TimelineMosaic: React.FC<TimelineMosaicProps> = ({ milestoneIdToShow }) => {
  const milestone = milestones.find(m => m.id === milestoneIdToShow || (milestoneIdToShow === 'mocks' && m.id === 'mocks') || (milestoneIdToShow === 'dreamUni' && m.id === 'dreamUni'));

  if (!milestone) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4"
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
              className: 'block h-full',
            }
          : {};

        return (
          <motion.div
            key={tile.id}
            custom={index}
            variants={tileVariants}
            whileHover="hover"
            className={`p-4 rounded-xl shadow-lg flex flex-col ${isStatistic ? 'justify-center items-center text-center' : 'justify-between'}
                        ${getTileStyle(tile.type)}
                        min-h-[120px]`}
            {...linkWrapperProps}
          >
            {isStatistic ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {tile.statValue}
                </div>
                <p className="text-xs md:text-sm mt-1 opacity-90">
                  {tile.statLabel}
                </p>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div>
                  <h3 className="text-sm font-semibold mb-2 leading-tight">{tile.title}</h3>
                  <p className="text-xs opacity-90">{tile.content}</p>
                </div>
                {tile.type === 'moreInfo' && tile.link && (
                  <div className="mt-auto pt-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                      Learn More →
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