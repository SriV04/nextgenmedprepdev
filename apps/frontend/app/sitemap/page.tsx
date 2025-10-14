'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Home, 
  Info, 
  Users, 
  Rocket, 
  MessageSquare, 
  FileText, 
  Brain, 
  Calendar, 
  CreditCard,
  BookOpen,
  Microscope,
  Stethoscope,
  Scale,
  Newspaper,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Map
} from 'lucide-react';

interface SiteMapItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  description?: string;
  children?: SiteMapItem[];
}

const siteStructure: SiteMapItem[] = [
  {
    title: 'Home',
    path: '/',
    icon: <Home className="w-5 h-5" />,
    description: 'Welcome to Next Gen Med Prep - Your pathway to medical school success',
  },
  {
    title: 'About',
    path: '/about',
    icon: <Info className="w-5 h-5" />,
    description: 'Learn about our mission and team',
    children: [
      {
        title: 'Join The Team',
        path: '/about/join-the-team',
        icon: <Users className="w-4 h-4" />,
        description: 'Become part of the Next Gen Med Prep family',
      },
    ],
  },
  {
    title: 'Get Started',
    path: '/get-started',
    icon: <Rocket className="w-5 h-5" />,
    description: 'Begin your medical school preparation journey',
  },
  {
    title: 'Prometheus Question Bank',
    path: '/prometheus',
    icon: <Brain className="w-5 h-5" />,
    description: 'Comprehensive medical & dental school interview question bank',
    children: [
      {
        title: 'Prometheus Satellite (New)',
        path: '/prometheus-2',
        icon: <Brain className="w-4 h-4" />,
        description: 'New satellite command center interface',
      },
    ],
  },
  {
    title: 'Interview Preparation',
    path: '/interviews',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Master your medical school interviews',
    children: [
      {
        title: 'MMI Practice',
        path: '/interviews/mmis',
        icon: <MessageSquare className="w-4 h-4" />,
        description: 'Multiple Mini Interview preparation',
      },
      {
        title: 'Panel Interviews',
        path: '/interviews/panel-interviews',
        icon: <Users className="w-4 h-4" />,
        description: 'Traditional panel interview prep',
      },
      {
        title: 'Interview Payment',
        path: '/interviews/payment',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Purchase interview preparation services',
      },
    ],
  },
  {
    title: 'Personal Statements',
    path: '/personal-statements',
    icon: <FileText className="w-5 h-5" />,
    description: 'Craft compelling personal statements',
    children: [
      {
        title: 'Payment',
        path: '/personal-statements/payment',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Purchase personal statement review',
      },
    ],
  },
  {
    title: 'UCAT Preparation',
    path: '/ucat',
    icon: <Microscope className="w-5 h-5" />,
    description: 'Ace the UCAT exam',
    children: [
      {
        title: 'UCAT Payment',
        path: '/ucat/payment',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Purchase UCAT preparation materials',
      },
    ],
  },
  {
    title: 'Events',
    path: '/events',
    icon: <Calendar className="w-5 h-5" />,
    description: 'Upcoming webinars and workshops',
    children: [
      {
        title: 'Event Booking',
        path: '/event-pay',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Book and pay for events',
      },
      {
        title: 'Career Consultation',
        path: '/career-consultation-pay',
        icon: <CreditCard className="w-4 h-4" />,
        description: 'Book one-on-one career consultation',
      },
    ],
  },
  {
    title: 'Resources & Guides',
    path: '/resources',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Comprehensive application guides and resources',
    children: [
      {
        title: 'Medicine Application Guide',
        path: '/resources/ultimate-medicine-application-guide',
        icon: <Stethoscope className="w-4 h-4" />,
        description: 'Complete guide to medical school applications',
      },
      {
        title: 'Dentistry Application Guide',
        path: '/resources/ultimate-dentistry-application-guide',
        icon: <GraduationCap className="w-4 h-4" />,
        description: 'Complete guide to dental school applications',
      },
      {
        title: 'Ethics Guide',
        path: '/resources/ultimate-ethics-guide',
        icon: <Scale className="w-4 h-4" />,
        description: 'Navigate medical ethics scenarios',
      },
      {
        title: 'Medical Hot Topics',
        path: '/resources/ultimate-medical-hot-topics',
        icon: <Newspaper className="w-4 h-4" />,
        description: 'Stay updated on healthcare issues',
      },
      {
        title: 'UCAT Prep Guide',
        path: '/resources/ultimate-ucat-prep-guide',
        icon: <Microscope className="w-4 h-4" />,
        description: 'Comprehensive UCAT preparation',
      },
      {
        title: 'MMI Resources',
        path: '/resources/mmi',
        icon: <MessageSquare className="w-4 h-4" />,
        description: 'MMI-specific resources and tips',
      },
      {
        title: 'Panel Interview Resources',
        path: '/resources/panel-interviews',
        icon: <Users className="w-4 h-4" />,
        description: 'Panel interview resources and tips',
      },
    ],
  },
];

export default function SitemapPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (path: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    const allPaths = new Set<string>();
    siteStructure.forEach(item => {
      if (item.children) {
        allPaths.add(item.path);
      }
    });
    setExpandedSections(allPaths);
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Map className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Site Map</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Navigate through all the resources and services Next Gen Med Prep has to offer
          </p>
          
          {/* Expand/Collapse Controls */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={expandAll}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Collapse All
            </button>
          </div>
        </motion.div>

        {/* Site Structure */}
        <div className="space-y-4">
          {siteStructure.map((item, index) => (
            <SiteMapCard
              key={item.path}
              item={item}
              index={index}
              isExpanded={expandedSections.has(item.path)}
              onToggle={() => toggleSection(item.path)}
            />
          ))}
        </div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help Navigating?</h3>
          <p className="text-gray-600 mb-4">
            Can&apos;t find what you&apos;re looking for? Visit our{' '}
            <Link href="/get-started" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
              Get Started
            </Link>{' '}
            page or{' '}
            <Link href="/about" className="text-indigo-600 hover:text-indigo-700 font-medium underline">
              contact our team
            </Link>
            .
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Return to Home
            </Link>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium border border-gray-300"
            >
              View XML Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function SiteMapCard({
  item,
  index,
  isExpanded,
  onToggle,
  isChild = false,
}: {
  item: SiteMapItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isChild?: boolean;
}) {
  const hasChildren = item.children && item.children.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${
        isChild
          ? 'bg-white border-l-4 border-indigo-300 ml-8'
          : 'bg-white border-l-4 border-indigo-600'
      } rounded-lg shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <Link
            href={item.path}
            className="flex-1 group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className={`${
                isChild ? 'text-indigo-500' : 'text-indigo-600'
              } group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className={`${
                isChild ? 'text-lg' : 'text-xl'
              } font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors`}>
                {item.title}
              </h3>
              <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">
                {item.path}
              </span>
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm ml-8">{item.description}</p>
            )}
          </Link>

          {hasChildren && (
            <button
              onClick={onToggle}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-3"
          >
            {item.children!.map((child, childIndex) => (
              <div key={child.path} className="border-l-2 border-gray-200 pl-4 ml-4">
                <Link href={child.path} className="group block">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-indigo-500 group-hover:scale-110 transition-transform">
                      {child.icon}
                    </div>
                    <h4 className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {child.title}
                    </h4>
                    <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded">
                      {child.path}
                    </span>
                  </div>
                  {child.description && (
                    <p className="text-gray-600 text-sm ml-6">{child.description}</p>
                  )}
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
