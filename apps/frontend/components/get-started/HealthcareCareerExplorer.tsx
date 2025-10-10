'use client';

import { useState } from 'react';
import CareerCard from './CareerCard';
import StageSelector from './StageSelector';
import ServiceCard from './ServiceCard';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  LightBulbIcon, 
  UserGroupIcon, 
  HeartIcon, 
  SparklesIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const careerPaths = [
  {
    id: 'medicine',
    title: 'Medicine',
    icon: HeartIcon,
    description: 'Become a doctor and make a direct impact on patients\' lives through diagnosis, treatment, and ongoing care across diverse medical specialties',
    gradient: 'from-blue-500 to-cyan-500',
    keyPoints: [
      '5-6 years medical degree + foundation years',
      '40+ specialties from GP to neurosurgery',
      'Starting salary £29k, consultants £88k-£119k',
      'Global career opportunities',
      'Lifelong learning and research',
      'High job security and respect'
    ]
  },
  {
    id: 'dentistry',
    title: 'Dentistry',
    icon: SparklesIcon,
    description: 'Specialize in oral health, dental surgery, and cosmetic procedures with excellent work-life balance and entrepreneurial opportunities',
    gradient: 'from-purple-500 to-pink-500',
    keyPoints: [
      '5 years dental degree (BDS/BChD)',
      'Better work-life balance than medicine',
      'Starting salary £35k, experienced £80k+',
      'Own practice potential (avg £100k-£200k)',
      'Mix of medical, surgical & aesthetic work',
      'Growing cosmetic dentistry market'
    ]
  }
];

const academicStages = [
  {
    id: 'gcse',
    title: 'GCSE',
    description: 'Building strong foundations',
    icon: BookOpenIcon
  },
  {
    id: 'a-level',
    title: 'A Level',
    description: 'Mastering key subjects',
    icon: AcademicCapIcon
  },
  {
    id: 'ucat',
    title: 'UCAT',
    description: 'Preparing for entrance exams',
    icon: LightBulbIcon
  },
  {
    id: 'interviews',
    title: 'Interviews',
    description: 'Preparing for university interviews',
    icon: UserGroupIcon
  }
];

const services = {
  'gcse': [
    {
      name: 'Career Guidance Consultation',
      description: 'Explore which healthcare path suits you best',
      path: '/free-consultation',
      badge: 'Peronalised',
      color: 'green' as const
    },
    {
      name: 'Ultimate Medical Application Guide',
      description: 'Choose the right subjects for healthcare careers',
      path: '/resources/ultimate-medicine-application-guide',
      badge: 'Free',
      color: 'purple' as const
    },
    {
      name: 'GCSE Tutoring',
      description: 'Excel in core subjects with expert tutoring',
      path: '/gcse-tutoring',
      badge: 'Core Service',
      color: 'blue' as const
    }
  ],
  'a-level': [
    {
      name: 'A-Level Prep & Tutoring',
      description: 'Excel in Biology, Chemistry, and other key subjects',
      path: '/alevel-prep',
      badge: 'Core Service',
      color: 'blue' as const
    },
    {
      name: 'Personal Statement Review',
      description: 'Craft a compelling application statement',
      path: '/personal-statements',
      badge: 'Service',
      color: 'purple' as const
    },
    {
      name: 'University Application Consultation',
      description: 'Find the best-fit medical or dental schools for you',
      path: '/resources/work-experience', // TODO - change to payment form 
      badge: 'Personalised',
      color: 'green' as const
    }
  ],
  'ucat': [
    {
      name: 'UCAT Tutoring',
      description: '1-on-1 expert coaching for top scores',
      path: '/ucat',
      badge: 'Tutoring',
      color: 'blue' as const
    },
    {
      name: 'UCAT Ultimate Prep Guide',
      description: 'Complete guide to mastering the UCAT',
      path: '/resources/ultimate-ucat-prep-guide',
      badge: 'Free',
      color: 'purple' as const
    },
    {
      name: 'UCAT Personal Revision Plan',
      description: 'Tailored study plan to maximize your strengths and address weaknesses.',   
      path: '/resources/ucat-personal-revision-plan',
      badge: 'Personalized',
      color: 'green' as const
    }
  ],
  'interviews': [
    {
      name: 'MMI Interview Coaching',
      description: '1-on-1 coaching for Multiple Mini Interviews',
      path: '/interviews/mmi',
      badge: 'Premium',
      color: 'purple' as const
    },
    {
      name: 'Panel Interview Preparation',
      description: 'Expert coaching for traditional panel interviews',
      path: '/interviews/panel-interviews',
      badge: 'Premium',
      color: 'blue' as const
    },
    {
      name: 'Medical Ethics Guide',
      description: 'Master medical ethics for your interviews',
      path: '/resources/ultimate-ethics-guide',
      badge: 'Guide',
      color: 'green' as const
    },
    {
      name: 'Medical Hot Topics',
      description: 'Stay updated on current healthcare issues',
      path: '/resources/ultimate-medical-hot-topics',
      badge: 'Guide',
      color: 'green' as const
    },
    { 
      name: 'Interview Background Knowledge',
      description: 'Conference to prep you on key medical topics',
      path: '/events',
      badge: 'Conference',
      color: 'purple' as const
    }
  ]
};

export default function HealthcareCareerExplorer() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);

  const currentServices = selectedStage ? services[selectedStage as keyof typeof services] || [] : [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Step 1: Career Selection */}
      <section>
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4">
            Step 1
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Which Healthcare Career Interests You?
          </h2>
          <p className="text-gray-600 text-lg">
            Explore different paths and find what resonates with your goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {careerPaths.map((career) => (
            <CareerCard
              key={career.id}
              career={career}
              isSelected={selectedCareer === career.id}
              onClick={() => setSelectedCareer(career.id)}
            />
          ))}
        </div>
      </section>

      {/* Step 2: Academic Stage */}
      {selectedCareer && (
        <section className="transition-all duration-500 ease-in-out">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-bold mb-4">
              Step 2
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              What Stage Are You At?
            </h2>
            <p className="text-gray-600 text-lg">
              We'll recommend the right resources for your journey
            </p>
          </div>
          
          <StageSelector
            stages={academicStages}
            selectedStage={selectedStage}
            onSelect={setSelectedStage}
          />
        </section>
      )}

      {/* Step 3: Recommended Services */}
      {selectedCareer && selectedStage && (
        <section className="transition-all duration-500 ease-in-out">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold mb-4">
              Step 3
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Your Personalised Resources
            </h2>
            <p className="text-gray-600 text-lg">
              Services tailored to your current stage and goals
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {currentServices.map((service, idx) => (
              <ServiceCard key={idx} service={service} />
            ))}
          </div>

          {/* Featured: Prometheus - TODO Make the nextgen better */}
          {(selectedStage === 'ucat' || selectedStage === 'interviews') && (
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_60%)]" />
              <div className="relative flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <SparklesIcon className="w-4 h-4" />
                    <span className="text-sm font-bold">Featured Tool</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-3">
                    Prometheus - Our NextGen Interview Simulator
                  </h3>
                  <p className="text-white/90 text-lg mb-6">
                    Practice with our AI-powered mock interview generator. Get instant feedback, access hundreds of questions, and build confidence before the real thing.
                  </p>
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:shadow-xl transition-all inline-flex items-center gap-2">
                    Try Prometheus
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <LightBulbIcon className="w-24 h-24 text-white/80" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          {/* <div className="text-center mt-12 p-8 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-2xl border-2 border-indigo-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Still not sure where to start?
            </h3>
            <p className="text-gray-600 mb-6">
              Book a consultation with our expert advisors
            </p>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all inline-flex items-center gap-2">
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              Book a Consultation
            </button>
          </div> */}
        </section>
      )}


    </div>
  );
}