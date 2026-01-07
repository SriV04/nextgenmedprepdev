/**
 * Events Data Configuration
 * 
 * This file contains all event data for the conferences page.
 * Update this file to add new events or modify existing ones.
 */

export interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: 'interview' | 'pathways' | 'ucat';
  description: string;
  spots: number;
  price?: number;
  details?: string;
  benefits?: string[];
  whatToExpect?: string[];
  auxiliaryInfo?: string[];
}

// Extended event interface for upcoming event (needs string ID for URLs)
export interface UpcomingEvent extends Omit<Event, 'id'> {
  id: string;
}

/**
 * CURRENT/UPCOMING EVENT
 * This is the featured event that appears at the top of the page
 * Note: id is a string for payment URLs
 */
export const upcomingEvent: UpcomingEvent = {
    id: "Pathways_to_Medicine_Conference_2026_02_18",
    title: "Pathways to Medicine",
    date: "2026-02-15",
    time: "10:00 AM - 12:00 PM",
    type: "pathways" as const,
    description: "Everything You Need to Know to Get into Medical School",
    spots: 50,
    price: 15,
    details: "Your complete roadmap to becoming a doctor — from GCSE choices to UCAT, interviews and beyond. This interactive conference breaks down the entire journey into medicine in a way schools never teach. Whether you're in Year 8 just starting to think about medicine or in Year 12 preparing your application, you'll leave knowing exactly what to do next.",
    benefits: [
        "Choosing the Right Subjects: Which GCSEs & A-levels matter — and which don't.",
        "How to Revise Like a Top Medical Applicant: Proven study systems used by high-scoring medical students.",
        "UCAT Made Simple: What it is, when to take it, how to prepare, and how to avoid the biggest mistakes.",
        "Personal Statement & Work Experience: What medical schools actually care about (and how to stand out).",
        "Interview Preparation: What interviewers look for — explained by students who just got in.",
        "Timeline to Medicine: A clear step-by-step plan from Year 8 → Medical School."
    ],
    whatToExpect: [
        "Live Q&A with Medical Students & Admissions Experts: Ask anything — no awkward school assembly answers.",
        "Real strategies that successful applicants use — not vague advice, but real systems, real examples, and real answers.",
        "Interactive session designed for Years 8–12 students considering medicine and parents who want to understand the admissions process.",
        "Perfect for students who feel overwhelmed and don't know where to start."
    ],
    auxiliaryInfo: [
        "🎁 Bonus: All attendees receive a free Medicine Application Starter Pack including revision templates, UCAT resources, and application timeline checklist.",
        "🚀 Limited spaces available - Don't leave your future to guesswork. Start your journey to medicine today."
    ]
};

/**
 * PREVIOUS EVENTS
 * List of past events shown in the "Previous Events" section
 * Add new previous events to the TOP of this array
 */
export const previousEvents: Event[] = [
  {
    id: 0,
    title: "All The Ethics & Hot Topics You Need for the Med Interview",
    date: "2025-01-04",
    time: "10:00 AM - 11:00 AM",
    type: "interview",
    description: "Master medical ethics and current hot topics for your interview!",
    spots: 30,
    price: 15
  },
  {
    id: 1,
    title: "Interview Question Approaches",
    date: "2025-11-29",
    time: "10:00 AM - 11:00 AM",
    type: "interview",
    description: "Change how to approach the questions?",
    spots: 30,
    price: 15
  },
  {
    id: 2,
    title: "Interview Background Knowledge Conference",
    date: "2025-11-02",
    time: "10:00 AM - 11:00 AM",
    type: "interview",
    description: "Master the background knowledge needed for medical school interviews",
    spots: 30
  },
  {
    id: 3,
    title: "Pathways to Medicine Conference",
    date: "2025-02-15",
    time: "10:00 AM - 2:00 PM",
    type: "pathways",
    description: "Interactive session for Years 9-12",
    spots: 25
  },
  {
    id: 4,
    title: "UCAT Crash Course",
    date: "2025-02-22",
    time: "9:00 AM - 4:00 PM",
    type: "ucat",
    description: "Intensive preparation for Year 12 students",
    spots: 30
  },
  {
    id: 5,
    title: "Ace the Interview Conference",
    date: "2025-03-08",
    time: "11:00 AM - 3:00 PM",
    type: "interview",
    description: "Master your med school interview",
    spots: 20
  },
  {
    id: 6,
    title: "Pathways to Medicine Conference",
    date: "2025-03-22",
    time: "10:00 AM - 2:00 PM",
    type: "pathways",
    description: "Interactive session for Years 9-12",
    spots: 25
  }
];

/**
 * CONFERENCE TYPES
 * General information about each type of conference (used for marketing/info sections)
 */
export interface ConferenceType {
  id: number;
  title: string;
  audience: string;
  description: string;
  details?: string;
  benefits: string[];
  additionalInfo?: string[];
  successRate?: string;
  cta?: string;
  color: string;
  icon: string;
  type: 'interview' | 'pathways' | 'ucat';
}

export const conferenceTypes: ConferenceType[] = [
  {
    id: 1,
    title: "Pathways to Medicine Conference: Your Journey to Medicine",
    audience: "For Years 9–12",
    description: "Dreaming of becoming a doctor but not sure where to start? Pathways to Medicine is the place to understand precisely what it takes to get into medical school.",
    details: "This interactive session breaks down each step of the journey—from subject selection and extracurriculars, to UCAT, applications, and interviews. Whether you're in Year 9 just exploring your options or in Year 12 ready to apply, this session will give you clarity and direction.",
    benefits: [
      "Learn what top medical schools are looking for",
      "Discover how to stand out with your academics and experiences",
      "Get your questions answered in real-time"
    ],
    cta: "Walk away with a clear action plan—no matter your year.",
    color: "bg-blue-50 border-blue-200",
    icon: "🎯",
    type: "pathways"
  },
  {
    id: 2,
    title: "UCAT Crash Course: Start Strong, Stay Ahead",
    audience: "For Year 12 Students",
    description: "The UCAT is one of the most important—and challenging—parts of the medical school application. In our UCAT Crash Course, we give you everything you need to kickstart your preparation the right way.",
    details: "This fast-paced, interactive session covers all four sections of the UCAT. It provides you with strategies, example questions, and tips that work.",
    benefits: [
      "Understand the format, timing, and common pitfalls",
      "Practice with real-style questions",
      "Learn how to build an effective UCAT study plan"
    ],
    additionalInfo: [
      "Learn in the style of a doctor with fast-paced interactive quizzes designed by top 5% scorers.",
      "Equips you with all the background knowledge to succeed in every stage of the UCAT.",
      "Perfect for students early in their prep or looking to sharpen their strategy."
    ],
    color: "bg-green-50 border-green-200",
    icon: "📚",
    type: "ucat"
  },
  {
    id: 3,
    title: "Ace the Interview Conference: Master Your Med School Interview",
    audience: "For Years 12–13",
    description: "Getting an interview is a huge achievement—now it's time to make it count. Ace the Interview is an interactive workshop where we break down the most common interview questions, teach you proven answering techniques, and help you gain the confidence to stand out.",
    benefits: [
      "Learn how to tackle MMI and panel-style questions",
      "Practice ethical scenarios, role plays, and personal reflections",
      "Get live feedback and practical tools to improve instantly"
    ],
    successRate: "We are proud to say that last year, 4/5 of the students we tutored got an offer after sitting an interview, so our tips work.",
    additionalInfo: [
      "Learn how to stand out to your chosen university and walk away with an offer.",
      "We will walk you through all the background knowledge required for interview success – consent, capacity, Gillick competence and more so you can smash your interview.",
      "With a Question bank updated daily throughout interview season with the most utilised questions we can say that we make our interviews as realistic as possible"
    ],
    cta: "Be calm, be clear, be memorable—walk into your interview ready to shine.",
    color: "bg-purple-50 border-purple-200",
    icon: "🎤",
    type: "interview"
  }
];
