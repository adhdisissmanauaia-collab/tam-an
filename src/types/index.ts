export type TabType = "home" | "chat" | "breathing" | "exam" | "resources";

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isCrisis?: boolean;
  isDemo?: boolean;
}

export type MoodType = "happy" | "calm" | "anxious" | "stressed" | "sad" | "exhausted";

export interface JournalEntry {
  id: string;
  date: string;
  mood: MoodType;
  tags: string[];
  content: string;
}

export interface ExamTask {
  id: string;
  subject: string;
  title: string;
  date: string;
  estimatedMinutes: number;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface ExamSubject {
  id: string;
  name: string;
  targetScore: string;
  examDate: string;
  dailyHours: number;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  category: "mental_health" | "relationships" | "study_skills" | "family";
  readTime: string;
  author: string;
  content: string;
  tips: string[];
}
