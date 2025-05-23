"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface TileData {
  id: string;
  title: string;
  content: string;
  colSpan?: number; // For irregular grid, e.g., 1 or 2, applied tablette and up
  rowSpan?: number; // For irregular grid, e.g., 1 or 2, applied tablette and up
  type: 'explanation' | 'services' | 'stat' | 'comparison' | 'findOutMore'; // Added 'findOutMore'
  link?: string; // Optional link for 'findOutMore' tiles
}

interface MilestoneData {
  id: string;
  name: string;
  tiles: TileData[];
}

// This data remains internal to TimelineMosaic
const milestones: MilestoneData[] = [
  {
    id: 'year9',
    name: 'Year 9: Ignite Your Journey!', // Updated title
    tiles: [
      { id: 'y9-explanation', title: 'Laying the Foundation', content: 'Guidance on subject choices and extracurriculars to build a strong early profile for medicine or dentistry.', type: 'explanation', colSpan: 2 },
      { id: 'y9-services', title: 'Our Early Support', content: 'Personalized consultations, academic tracking, and early exposure to healthcare professions.', type: 'services' },
      { id: 'y9-stat', title: 'Early Birds', content: '95% of students starting with us in Year 9 report feeling more confident about their application path.', type: 'stat' },
      { id: 'y9-comparison', title: 'Medicine vs. Dentistry: Early Thoughts', content: 'Exploring the differences and similarities to help you start thinking about your preferred path.', type: 'comparison', rowSpan: 2 }, 
      { id: 'y9-findoutmore', title: 'Discover Year 9 Path', content: 'Learn more about our tailored Year 9 program.', type: 'findOutMore', link: '/services/year-9-program' },
    ],
  },
  {
    id: 'ucat',
    name: 'UCAT: Conquer the Challenge!', // Updated title
    tiles: [
      { id: 'ucat-explanation', title: 'What is the UCAT?', content: 'The University Clinical Aptitude Test (UCAT) is a crucial admissions test for medical and dental schools in the UK, Australia, and New Zealand.', type: 'explanation', colSpan: 2 },
      { id: 'ucat-services', title: 'UCAT Prep Services', content: 'Intensive workshops, mock exams, and personalized feedback sessions to maximize your UCAT score.', type: 'services' },
      { id: 'ucat-stat', title: 'Our UCAT Success', content: '85% of our students score in the top 20th percentile for the UCAT.', type: 'stat' },
      { id: 'ucat-comparison', title: 'UCAT: Dentistry vs. Medicine', content: 'UCAT requirements and strategic approaches can differ slightly. We guide you on targeting your preparation effectively.', type: 'comparison', colSpan: 2 }, 
      { id: 'ucat-findoutmore', title: 'Boost Your UCAT Score', content: 'Explore our UCAT preparation resources.', type: 'findOutMore', link: '/services/ucat-preparation', colSpan: 2 },
    ],
  },
  {
    id: 'alevels',
    name: 'A-Levels: Ace Your Grades!', // Updated title
    tiles: [
      { id: 'alevels-explanation', title: 'Crucial A-Level Grades', content: 'Achieving top A-Level grades in relevant subjects like Biology and Chemistry is paramount for medical school entry.', type: 'explanation', colSpan: 2, rowSpan: 2 }, 
      { id: 'alevels-services', title: 'A-Level Academic Support', content: 'Targeted tutoring, revision strategies, and exam technique coaching for key A-Level subjects.', type: 'services' },
      { id: 'alevels-stat', title: 'A-Level Achievements', content: '90% of our students achieve A/A* in their science A-Levels.', type: 'stat' },
      { id: 'alevels-findoutmore', title: 'Excel in A-Levels', content: 'Find out how we support A-Level students.', type: 'findOutMore', link: '/services/a-level-support' },
    ],
  },
  {
    id: 'mocks',
    name: 'Interviews: Shine & Secure Your Spot!', // Updated title
    tiles: [
      { id: 'mocks-explanation', title: 'The Interview Hurdle', content: 'Medical and dental school interviews (MMI or traditional) assess your suitability beyond academics.', type: 'explanation', colSpan: 2 },
      { id: 'mocks-services', title: 'Interview Coaching', content: 'Realistic mock interviews, detailed feedback, and strategies for tackling common and challenging questions.', type: 'services', rowSpan: 2 }, 
      { id: 'mocks-stat', title: 'Interview Success Rate', content: 'Our students have a 92% success rate in receiving offers after interviews.', type: 'stat' },
      { id: 'mocks-comparison', title: 'Interview Styles', content: 'Understanding the nuances between medical and dental interview focuses and how to prepare for each.', type: 'comparison' },
      { id: 'mocks-findoutmore', title: 'Ace Your Interviews', content: 'Get comprehensive interview coaching details.', type: 'findOutMore', link: '/services/interview-coaching' },
    ],
  },
];

const tileVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

const hoverVariants = {
  hover: {
    scale: 1.05,
    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
    transition: { duration: 0.3 },
  },
};

// Helper to assign colors based on tile type for a sleek look
const getTileStyle = (type: TileData['type']) => {
  switch (type) {
    case 'explanation':
      return 'bg-sky-600 text-white';
    case 'services':
      return 'bg-teal-500 text-white';
    case 'stat':
      return 'bg-amber-400 text-gray-800';
    case 'comparison':
      return 'bg-slate-700 text-white';
    case 'findOutMore': // Added style for findOutMore
      return 'bg-rose-500 hover:bg-rose-600 text-white cursor-pointer'; // Example: a vibrant call-to-action color
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

interface TimelineMosaicProps {
  milestoneIdToShow: string;
}

const TimelineMosaic: React.FC<TimelineMosaicProps> = ({ milestoneIdToShow }) => {
  const milestone = milestones.find(m => m.id === milestoneIdToShow);

  if (!milestone) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {milestone.tiles.map((tile, index) => {
        const tileContent = (
          <div className="flex flex-col h-full"> {/* Ensure content can fill height for justify-between */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{tile.title}</h3>
              <p className="text-sm opacity-90 flex-grow">{tile.content}</p> {/* flex-grow for text content */}
            </div>
            {tile.type === 'findOutMore' && tile.link && (
              <div className="mt-auto pt-2"> {/* Push link to bottom */}
                <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-white/20 hover:bg-white/30 transition-colors">
                  Learn More &rarr;
                </span>
              </div>
            )}
          </div>
        );

        return (
          <motion.div
            key={tile.id}
            custom={index}
            variants={tileVariants}
            whileHover="hover"
            className={`p-6 rounded-xl shadow-lg flex flex-col justify-between
                        ${getTileStyle(tile.type)}
                        ${tile.colSpan ? `md:col-span-${tile.colSpan}` : ''} 
                        ${tile.rowSpan ? `md:row-span-${tile.rowSpan}` : ''}
                        min-h-[200px] md:min-h-[250px]`}
          >
            {tile.type === 'findOutMore' && tile.link ? (
              <a href={tile.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                {tileContent}
              </a>
            ) : (
              tileContent
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TimelineMosaic;
