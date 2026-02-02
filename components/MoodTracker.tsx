'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { useStore } from '@/store/useStore';
import type { Mood } from '@/types';
import { Smile, Frown, Heart, Meh, AlertCircle, Sparkles, Coffee } from 'lucide-react';

const moods: { value: Mood; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'happy', label: 'Счастливый', icon: <Smile size={24} />, color: 'bg-yellow-400' },
  { value: 'sad', label: 'Грустный', icon: <Frown size={24} />, color: 'bg-blue-400' },
  { value: 'excited', label: 'Взволнованный', icon: <Sparkles size={24} />, color: 'bg-purple-400' },
  { value: 'calm', label: 'Спокойный', icon: <Coffee size={24} />, color: 'bg-green-400' },
  { value: 'anxious', label: 'Тревожный', icon: <AlertCircle size={24} />, color: 'bg-orange-400' },
  { value: 'romantic', label: 'Романтичный', icon: <Heart size={24} />, color: 'bg-pink-400' },
  { value: 'neutral', label: 'Нейтральный', icon: <Meh size={24} />, color: 'bg-gray-400' },
];

export default function MoodTracker() {
  const { moodEntries, addMoodEntry } = useStore();
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (selectedMood) {
      addMoodEntry({
        date: new Date().toISOString(),
        mood: selectedMood,
        notes: notes || undefined,
      });
      setSelectedMood(null);
      setNotes('');
    }
  };

  const recentEntries = moodEntries
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Mood Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Отметить настроение сегодня</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {moods.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedMood === mood.value
                  ? 'border-pink-500 bg-pink-50 scale-105'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-12 h-12 ${mood.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                {mood.icon}
              </div>
              <div className="text-sm font-medium text-gray-700">{mood.label}</div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-4">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Добавить заметку (необязательно)..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-black"
              rows={3}
            />
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Сохранить
            </button>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Последние записи</h3>
          <div className="space-y-2">
            {recentEntries.map((entry) => {
              const mood = moods.find((m) => m.value === entry.mood);
              return (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <div className={`w-10 h-10 ${mood?.color} rounded-full flex items-center justify-center`}>
                    {mood?.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{mood?.label}</div>
                    <div className="text-sm text-gray-500">
                      {format(new Date(entry.date), 'dd.MM.yyyy HH:mm')}
                    </div>
                    {entry.notes && (
                      <div className="text-sm text-gray-600 mt-1">{entry.notes}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
