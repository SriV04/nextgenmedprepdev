import { universities as importedUniversities, type University as ImportedUniversity } from '@/data/universities';

// Re-export for backwards compatibility
export const universities = importedUniversities;
export type University = ImportedUniversity;

export interface InterviewType {
  id: string;
  name: string;
  description: string;
  duration: string;
  generatedPrice: number;
  tutorPrice: number;
}

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
