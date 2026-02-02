export type Mood = 'happy' | 'sad' | 'excited' | 'calm' | 'anxious' | 'romantic' | 'neutral';

export interface CalendarEvent {
  id: string;
  date: string; // ISO date string
  type: 'gift' | 'date' | 'activity' | 'reminder' | 'fight';
  title: string;
  description?: string;
  mood?: Mood;
  ratings?: {
    cost: number; // 1-10
    romanticism: number; // 1-10
    scale: number; // 1-10
  };
  significance?: number; // calculated significance
  fightDetails?: {
    reason: string;
    notes: string;
  };
  completed: boolean;
}

export interface Wish {
  id: string;
  title: string;
  description?: string;
  category?: string;
  fulfilled: boolean;
  fulfilledDate?: string;
}

export interface Reminder {
  id: string;
  eventType: 'gift' | 'date' | 'activity';
  lastDone?: string; // ISO date string
  frequencyDays: number; // how often should remind
  enabled: boolean;
}

export interface MoodEntry {
  id: string;
  date: string; // ISO date string
  mood: Mood;
  notes?: string;
}

export interface UserSettings {
  isPremium: boolean;
  avatarPhoto?: string; // URL or base64
  partnerName: string;
  significanceFormula?: {
    costWeight: number;
    romanticismWeight: number;
    scaleWeight: number;
  };
}

export interface Insights {
  averageMood: Mood;
  moodTrend: 'improving' | 'stable' | 'declining';
  totalGifts: number;
  averageSignificance: number;
  lastGiftDate?: string;
  daysSinceLastGift?: number;
  fightFrequency: number; // fights per month
  recommendations: string[];
}
