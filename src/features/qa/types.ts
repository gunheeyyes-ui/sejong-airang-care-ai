import type { AgeBand } from '../recommendation/types';

export type QuestionCategory =
  | 'childcare'
  | 'time-based-care'
  | 'vaccination'
  | 'health-warning'
  | 'family-center'
  | 'outing'
  | 'emergency'
  | 'general';

export interface OfficialInfoSource {
  id: string;
  sourceName: string;
  agency: string;
  category: QuestionCategory;
  ageBands: AgeBand[];
  summary: string;
  url: string;
  updatedAt: string;
  keywords: string[];
}

export interface OfficialAnswer {
  question: string;
  category: QuestionCategory;
  answerSummary: string;
  sources: OfficialInfoSource[];
  recommendedActions: string[];
  safetyNotice?: string;
  isMedicalAdvice: false;
  requiresEmergencyEscalation: boolean;
}
