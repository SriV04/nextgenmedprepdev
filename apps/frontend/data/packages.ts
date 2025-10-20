
// Extend the Package interface to include generatedMocks
export interface ExtendedPackage {
  id: string;
  name: string;
  description: string;
  interviews: number;
  generatedPrice: number;
  tutorPrice: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
  generatedMocks?: {
    description: string;
    features: string[];
    benefits: string[];
  };
}

export interface UCATPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  popular?: boolean;
  features: string[];
  baseFeatures?: string[];
  advancedFeatures?: string[];
  color: string;
  buttonColor: string;
}

export const interviewPackages: ExtendedPackage[] = [
  {
    id: 'essentials',
    name: 'Tailored Mock Interview – Essentials',
    description: 'Perfect for individual interview practice',
    interviews: 1,
    generatedPrice: 7,
    tutorPrice: 45,
    features: [
      'A mock interview with Prometheus-powered university-specific questions',
      'Ensuring that your mock interview is as realistic as possible',
      'All of our tutors are current medical students',
    ],
    generatedMocks: {
      description: 'AI-powered university-specific mock questions',
      features: [
        'Instant access to university-specific questions',
        'Questions generated using our Prometheus AI system',
        'Includes model answers for self-assessment',
        'Current and relevant for 2025/26 interviews'
      ],
      benefits: [
        'Practice at your own pace',
        'Review answers against model responses',
        'Instant access - no waiting for tutor availability',
        'Cost-effective practice option'
      ]
    }
  },
  {
    id: 'core',
    name: 'Core Interview Preparation',
    description: 'Comprehensive interview training',
    interviews: 3,
    generatedPrice: 10,
    tutorPrice: 125,
    originalPrice: 150,
    popular: true,
    features: [
      '3 sets of Prometheus-powered university-specific mock questions',
      'Mock interviews tailored to the universities you are applying to',
      'Coverage of ethical scenarios, common trick questions, and general interview technique',
      'We will aim to match you with a tutor who has sat the interview you are sitting'
    ],
    generatedMocks: {
      description: 'Complete AI-powered interview preparation package',
      features: [
        '3 sets of Prometheus-powered university-specific mock questions',
        'Covers all common interview formats (MMI, panel, traditional)',
        'Ethical scenarios with detailed analysis',
        'Up to date question bank'
      ],
      benefits: [
        'Comprehensive preparation at a fraction of tutor cost',
        'Instant delivery to your email',
        'Practice answering questions from multiple universities',
        'Structured preparation with clear progression',
        'Ideal for building confidence through repetition'
      ]
    }
  },
  {
    id: 'premium',
    name: 'Premium Interview Intensive',
    description: 'The ultimate interview preparation',
    interviews: 4,
    generatedPrice: 12,
    tutorPrice: 250,
    originalPrice: 275,
    features: [
      '4 sets of Prometheus-powered university-specific mock questions',
      'A Background knowledge session for success at the interview',
      'Mock interviews tailored to the universities you are applying to',
      'Coverage of ethical scenarios, common trick questions, and general interview technique',
      'Access to 24/7 business phone for medicine related questions'
    ],
    generatedMocks: {
      description: 'Ultimate AI-powered interview preparation system',
      features: [
        '5 complete university-specific mock interview sets',
        'Advanced personalization based on your personal statement',
        'Deep dive into specialty areas of interest',
        'Comprehensive MMI station preparation',
        'Strategic interview approach guidance',
        'Personal strengths and weaknesses analysis'
      ],
      benefits: [
        'Most extensive question coverage available',
        'Tailored to match your personal application profile',
        'Advanced ethical scenario discussion guides',
        'Preparation for challenging or unexpected questions',
        'Access to premium question bank not available in other packages',
        'Ideal for serious applicants targeting competitive programs'
      ]
    }
  }
];

export const ucatPackages: UCATPackage[] = [
  {
    id: 'ucat_kickstart',
    name: 'UCAT Kickstart',
    description: 'For those ready to build strong foundations.',
    price: 200,
    color: 'bg-blue-500',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    features: [
      '4 hours of essential background knowledge across all UCAT sections',
      '24/7 access to our Business Line – ask questions anytime, send in tricky problems, and receive step-by-step video solutions',
      'Tracked quantitative performance – every question you complete feeds into our analytics',
      'Personalised content plan – weekly text messages guide your revision using performance data',
      'After one session all our students thus far saw a 15% or more increase in score across all areas',
      'Data-driven intervention on weak areas begins from day one'
    ]
  },
  {
    id: 'ucat_advance',
    name: 'UCAT Advance',
    description: 'For those who want to refine and target performance.',
    price: 375,
    color: 'bg-purple-600',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    baseFeatures: [
      '4 hours of essential background knowledge',
      '24/7 Business Line access',
      'Tracked quantitative performance',
      'Personalised content plan',
      '15%+ score increase guarantee'
    ],
    advancedFeatures: [
      '8 hours of targeted question-specific perfection sessions',
      'Deep-dives into the exact areas the data shows you\'re weakest in',
      'Smart drills and focused practice to convert weaknesses into strengths'
    ],
    features: [
      '4 hours of essential background knowledge',
      '24/7 Business Line access',
      'Tracked quantitative performance',
      'Personalised content plan',
      '15%+ score increase guarantee',
      '8 hours of targeted question-specific perfection sessions',
      'Deep-dives into the exact areas the data shows you\'re weakest in',
      'Smart drills and focused practice to convert weaknesses into strengths'
    ]
  },
  {
    id: 'ucat_mastery',
    name: 'UCAT Mastery',
    description: 'For those aiming for top 10% scores.',
    price: 550,
    popular: true,
    color: 'bg-indigo-600',
    buttonColor: 'bg-indigo-600 hover:bg-indigo-700',
    baseFeatures: [
      '4 hours of essential background knowledge',
      'Tracked quantitative performance',
      'Personalised content plan',
      '15%+ score increase guarantee',
      '8 hours of targeted perfection sessions',
      'Deep-dive weakness analysis',
      'Smart drills and focused practice'
    ],
    advancedFeatures: [
      '12 hours of high-intensity question-perfection sessions based on your data',
      'Double the time, double the refinement – a laser-focused approach to peak performance',
      'Designed to bring students to test-day readiness with total confidence',
      'Priority support and accelerated response times',
      'Advanced test-taking strategies for top percentile scores'
    ],
    features: [
      '4 hours of essential background knowledge',
      'Tracked quantitative performance',
      'Personalised content plan',
      '15%+ score increase guarantee',
      '8 hours of targeted perfection sessions',
      'Deep-dive weakness analysis',
      'Smart drills and focused practice',
      '12 hours of high-intensity question-perfection sessions based on your data',
      'Double the time, double the refinement – a laser-focused approach to peak performance',
      'Designed to bring students to test-day readiness with total confidence',
      'Priority support and accelerated response times',
      'Advanced test-taking strategies for top percentile scores'
    ]
  }
];