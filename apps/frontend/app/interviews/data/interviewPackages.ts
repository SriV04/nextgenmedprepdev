
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
        '3 university-specific mock interview sets',
        'Additional practice questions for each university',
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
    interviews: 5,
    generatedPrice: 12,
    tutorPrice: 250,
    originalPrice: 275,
    features: [
      '3 sets of Prometheus-powered university-specific mock questions',
      '2 Background knowledge session for success at the interview',
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