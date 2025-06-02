// components/ServiceCard.tsx
import { motion } from 'framer-motion';
import { JSX } from 'react';
import { FiUsers, FiBookOpen, FiAward, FiMessageSquare, FiMic } from 'react-icons/fi'; // Example icons

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string; // Could be a name to map to an icon component or direct SVG
}

// A simple mapping for demo icons
const iconMap: { [key: string]: JSX.Element } = {
  'ucat': <FiBookOpen className="w-8 h-8 mb-3 text-indigo-500" />,
  'tutoring': <FiUsers className="w-8 h-8 mb-3 text-indigo-500" />,
  'mock_interviews': <FiMic className="w-8 h-8 mb-3 text-indigo-500" />,
  'journals': <FiAward className="w-8 h-8 mb-3 text-indigo-500" />,
  'guidance': <FiMessageSquare className="w-8 h-8 mb-3 text-indigo-500" />,
  // Add more icons based on your service.id or title
};


const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 }, // Start slightly scaled down and translated
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full cursor-pointer" // h-full to fill grid cell
      variants={cardVariants}
      // whileInView is handled by parent MosaicFeatures for staggered effect
      // `initial` and `animate` props are implicitly used by `variants` when parent controls them.
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
    >
      {icon && iconMap[icon.toLowerCase().replace(/\s+/g, '_')] ? iconMap[icon.toLowerCase().replace(/\s+/g, '_')] : <FiAward className="w-8 h-8 mb-3 text-indigo-500" /> /* Default icon */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm flex-grow">{description}</p> {/* flex-grow to push button down if any */}
       <motion.button
        className="mt-4 self-start px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-sm"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Learn More
      </motion.button>
    </motion.div>
  );
};

export default ServiceCard;