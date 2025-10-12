export interface University {
  id: string;
  name: string;
  country: string;
  interviewTypes: string[];
  displayName?: string;
}

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  duration: string;
  generatedPrice: number;
  tutorPrice: number;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  interviews: number;
  generatedPrice: number;
  tutorPrice: number;
  originalPrice?: number;
  popular?: boolean;
  features: string[];
}

export const universities: University[] = [
  {
    id: 'oxford',
    name: 'University of Oxford',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional', 'panel'],
    displayName: 'Oxford'
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    country: 'UK',
    interviewTypes: ['traditional', 'panel'],
    displayName: 'Cambridge'
  },
  {
    id: 'imperial',
    name: 'Imperial College London',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional'], 
    displayName: 'ICL'
  },
  {
    id: 'ucl',
    name: 'University College London',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional'],
    displayName: 'UCL'
  },
  {
    id: 'kings',
    name: "King's College London",
    country: 'UK',
    interviewTypes: ['mmi', 'traditional', 'panel'],
    displayName: "KCL"
  },
  {
    id: 'edinburgh',
    name: 'University of Edinburgh',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional'],
    displayName: 'Edinburgh'
  },
  {
    id: 'glasgow',
    name: 'University of Glasgow',
    country: 'UK',
    interviewTypes: ['mmi', 'traditional'],
    displayName: 'Glasgow'
  },
  {
    id: 'manchester',
    name: 'University of Manchester',
    country: 'UK',
    interviewTypes: ['mmi'],
    displayName: 'Manchester'
  }
];

export const interviewTypes: InterviewType[] = [
  {
    id: 'mmi',
    name: 'Multiple Mini Interview (MMI)',
    description: 'Practice with realistic MMI stations covering ethical scenarios, communication tasks, and problem-solving.',
    duration: '60 minutes',
    generatedPrice: 15,
    tutorPrice: 89
  },
  {
    id: 'traditional',
    name: 'Traditional Interview',
    description: 'One-on-one interview practice focusing on motivation, personal statement, and medical knowledge.',
    duration: '90 minutes',
    generatedPrice: 20,
    tutorPrice: 129
  },
  {
    id: 'panel',
    name: 'Panel Interview',
    description: 'Simulation with multiple interviewers to practice handling pressure and diverse questioning styles.',
    duration: '120 minutes',
    generatedPrice: 25,
    tutorPrice: 199
  }
];

export const packages: Package[] = [
  {
    id: 'essentials',
    name: 'Essentials Package',
    description: 'Perfect for individual interview practice',
    interviews: 1,
    generatedPrice: 7,
    tutorPrice: 45,
    features: [
      'A mock interview tailored to your university',
      'Using our Prometheus Question bank',
      'Realistic interview simulation',
      'Match with experienced tutor (tutor option)',
      'Instant access to questions (generated option)'
    ]
  },
  {
    id: 'core',
    name: 'Core Interview Preparation',
    description: 'Comprehensive interview training',
    interviews: 3,
    generatedPrice: 10,
    tutorPrice: 130,
    originalPrice: 150,
    popular: true,
    features: [
      '3 sets of University-specific mock questions',
      '+3 Prometheus mocks for self-practice',
      'Strategy Session with background knowledge',
      'Coverage of ethical scenarios and techniques',
      'Personalised feedback (tutor option)'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Interview Intensive',
    description: 'The ultimate interview preparation',
    interviews: 5,
    generatedPrice: 12,
    tutorPrice: 210,
    originalPrice: 270,
    features: [
      '5 sets of University-specific mock questions',
      '+5 Prometheus mocks for self-practice',
      '24/7 business phone support',
      'Premium booking and support',
      'Complete strategy session coverage'
    ]
  }
];