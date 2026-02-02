import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CalendarEvent, Wish, Reminder, MoodEntry, UserSettings, Insights, Mood } from '@/types';

interface AppState {
  // Data
  events: CalendarEvent[];
  wishes: Wish[];
  reminders: Reminder[];
  moodEntries: MoodEntry[];
  settings: UserSettings;
  
  // Actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  addWish: (wish: Omit<Wish, 'id'>) => void;
  updateWish: (id: string, updates: Partial<Wish>) => void;
  deleteWish: (id: string) => void;
  
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
  
  updateSettings: (updates: Partial<UserSettings>) => void;
  
  getInsights: () => Insights;
  calculateSignificance: (ratings: CalendarEvent['ratings']) => number;
}

const defaultFormula = {
  costWeight: 0.3,
  romanticismWeight: 0.5,
  scaleWeight: 0.2,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      events: [],
      wishes: [],
      reminders: [],
      moodEntries: [],
      settings: {
        isPremium: false,
        partnerName: 'Партнер',
        significanceFormula: defaultFormula,
      },
      
      addEvent: (event) => {
        const id = Date.now().toString();
        const ratings = event.ratings;
        const significance = ratings ? get().calculateSignificance(ratings) : undefined;
        
        set((state) => ({
          events: [...state.events, { ...event, id, significance }],
        }));
      },
      
      updateEvent: (id, updates) => {
        set((state) => {
          const event = state.events.find((e) => e.id === id);
          if (!event) return state;
          
          const updatedEvent = { ...event, ...updates };
          if (updates.ratings && updatedEvent.ratings) {
            updatedEvent.significance = get().calculateSignificance(updatedEvent.ratings);
          }
          
          return {
            events: state.events.map((e) => (e.id === id ? updatedEvent : e)),
          };
        });
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        }));
      },
      
      addWish: (wish) => {
        const id = Date.now().toString();
        set((state) => ({
          wishes: [...state.wishes, { ...wish, id }],
        }));
      },
      
      updateWish: (id, updates) => {
        set((state) => ({
          wishes: state.wishes.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        }));
      },
      
      deleteWish: (id) => {
        set((state) => ({
          wishes: state.wishes.filter((w) => w.id !== id),
        }));
      },
      
      addReminder: (reminder) => {
        const id = Date.now().toString();
        set((state) => ({
          reminders: [...state.reminders, { ...reminder, id }],
        }));
      },
      
      updateReminder: (id, updates) => {
        set((state) => ({
          reminders: state.reminders.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },
      
      deleteReminder: (id) => {
        set((state) => ({
          reminders: state.reminders.filter((r) => r.id !== id),
        }));
      },
      
      addMoodEntry: (entry) => {
        const id = Date.now().toString();
        set((state) => ({
          moodEntries: [...state.moodEntries, { ...entry, id }],
        }));
      },
      
      updateMoodEntry: (id, updates) => {
        set((state) => ({
          moodEntries: state.moodEntries.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      calculateSignificance: (ratings) => {
        if (!ratings) return 0;
        const { settings } = get();
        const formula = settings.significanceFormula || defaultFormula;
        
        return (
          ratings.cost * formula.costWeight +
          ratings.romanticism * formula.romanticismWeight +
          ratings.scale * formula.scaleWeight
        );
      },
      
      getInsights: () => {
        const state = get();
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Mood analysis
        const recentMoods = state.moodEntries.filter(
          (m) => new Date(m.date) >= thirtyDaysAgo
        );
        const moodCounts: Record<string, number> = {};
        recentMoods.forEach((m) => {
          moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1;
        });
        const moodKeys = Object.keys(moodCounts);
        const averageMood = (moodKeys.length > 0
          ? moodKeys.reduce((a, b) => (moodCounts[a] > moodCounts[b] ? a : b))
          : 'neutral') as Mood;
        
        // Gift analysis
        const gifts = state.events.filter((e) => e.type === 'gift' && e.completed);
        const recentGifts = gifts.filter((e) => new Date(e.date) >= thirtyDaysAgo);
        const avgSignificance =
          recentGifts.length > 0
            ? recentGifts.reduce((sum, e) => sum + (e.significance || 0), 0) / recentGifts.length
            : 0;
        
        const lastGift = [...gifts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
        const daysSinceLastGift = lastGift
          ? Math.floor((now.getTime() - new Date(lastGift.date).getTime()) / (24 * 60 * 60 * 1000))
          : undefined;
        
        // Fight analysis
        const fights = state.events.filter((e) => e.type === 'fight');
        const recentFights = fights.filter((e) => new Date(e.date) >= thirtyDaysAgo);
        const fightFrequency = recentFights.length;
        
        // Recommendations
        const recommendations: string[] = [];
        if (daysSinceLastGift && daysSinceLastGift > 14) {
          recommendations.push(`Прошло ${daysSinceLastGift} дней с последнего подарка. Время удивить партнера!`);
        }
        if (fightFrequency > 2) {
          recommendations.push('Заметили несколько ссор за последний месяц. Возможно, стоит обсудить проблемы.');
        }
        if (avgSignificance < 5) {
          recommendations.push('Попробуйте увеличить романтичность или масштабность ваших подарков.');
        }
        if (recentMoods.length < 7) {
          recommendations.push('Отмечайте настроение чаще для более точных инсайтов.');
        }
        
        return {
          averageMood,
          moodTrend: 'stable', // Simplified for now
          totalGifts: gifts.length,
          averageSignificance: avgSignificance,
          lastGiftDate: lastGift?.date,
          daysSinceLastGift,
          fightFrequency,
          recommendations,
        };
      },
    }),
    {
      name: 'relationship-app-storage',
      skipHydration: true,
      partialize: (state) =>
        ({
          events: state.events,
          wishes: state.wishes,
          reminders: state.reminders,
          moodEntries: state.moodEntries,
          settings: state.settings,
        }) as AppState,
      storage:
        typeof window === 'undefined'
          ? {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
          : {
              getItem: async () => {
                try {
                  const res = await fetch('/api/data');
                  const data = await res.json();
                  return data;
                } catch {
                  return null;
                }
              },
              setItem: async (_, value) => {
                await fetch('/api/data', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(value),
                });
              },
              removeItem: () => {},
            },
    }
  )
);
