'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Calendar from '@/components/Calendar';
import MoodTracker from '@/components/MoodTracker';
import EventForm from '@/components/EventForm';
import WishList from '@/components/WishList';
import InsightsPanel from '@/components/InsightsPanel';
import RemindersPanel from '@/components/RemindersPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { useStore } from '@/store/useStore';
import type { CalendarEvent } from '@/types';
import { Calendar as CalendarIcon, Heart, Gift, Sparkles, Settings, Bell } from 'lucide-react';

const AvatarDisplay = dynamic(() => import('@/components/AvatarDisplay'), { ssr: false });

type Tab = 'calendar' | 'mood' | 'wishes' | 'insights' | 'reminders' | 'settings';

export default function ClientApp() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  useEffect(() => {
    const store = useStore as unknown as { persist?: { rehydrate: () => void } };
    store.persist?.rehydrate();
  }, []);

  const tabs = [
    { id: 'calendar' as Tab, label: 'Календарь', icon: CalendarIcon },
    { id: 'mood' as Tab, label: 'Настроение', icon: Heart },
    { id: 'wishes' as Tab, label: 'Хотелки', icon: Gift },
    { id: 'insights' as Tab, label: 'Инсайты', icon: Sparkles },
    { id: 'reminders' as Tab, label: 'Напоминания', icon: Bell },
    { id: 'settings' as Tab, label: 'Настройки', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
            💕 Relationship Tracker
          </h1>
          <p className="text-gray-600">Отслеживайте ваши отношения и важные моменты</p>
        </header>

        <div className="mb-8 flex justify-center">
          <AvatarDisplay />
        </div>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          {activeTab === 'calendar' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Календарь событий</h2>
                <button
                  onClick={() => {
                    setSelectedEvent(null);
                    setShowEventForm(true);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  + Добавить событие
                </button>
              </div>
              <Calendar
                onEventClick={(event) => {
                  setSelectedEvent(event);
                  setShowEventForm(true);
                }}
              />
            </div>
          )}

          {activeTab === 'mood' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Отслеживание настроения</h2>
              <MoodTracker />
            </div>
          )}

          {activeTab === 'wishes' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Список желаний</h2>
              <WishList />
            </div>
          )}

          {activeTab === 'insights' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Инсайты и аналитика</h2>
              <InsightsPanel />
            </div>
          )}

          {activeTab === 'reminders' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Напоминания</h2>
              <RemindersPanel />
            </div>
          )}

          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>

      {showEventForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
          }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <EventForm
              event={selectedEvent ?? undefined}
              onClose={() => {
                setShowEventForm(false);
                setSelectedEvent(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
