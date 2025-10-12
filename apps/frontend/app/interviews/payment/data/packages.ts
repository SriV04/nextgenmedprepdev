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
