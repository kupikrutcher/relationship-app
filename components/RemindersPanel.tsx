'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, X, Bell, BellOff, Gift, Heart, Calendar } from 'lucide-react';

export default function RemindersPanel() {
  const { reminders, addReminder, updateReminder, deleteReminder, events } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    eventType: 'gift' as 'gift' | 'date' | 'activity',
    frequencyDays: 14,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReminder({
      eventType: formData.eventType,
      frequencyDays: formData.frequencyDays,
      enabled: true,
    });
    setFormData({ eventType: 'gift', frequencyDays: 14 });
    setShowForm(false);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <Gift size={20} className="text-pink-500" />;
      case 'date':
        return <Heart size={20} className="text-red-500" />;
      default:
        return <Calendar size={20} className="text-blue-500" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'gift':
        return 'Подарок';
      case 'date':
        return 'Свидание';
      case 'activity':
        return 'Активность';
      default:
        return type;
    }
  };

  const checkReminderStatus = (reminder: typeof reminders[0]) => {
    if (!reminder.enabled) return null;
    
    const now = new Date();
    const lastEvent = events
      .filter((e) => e.type === reminder.eventType && e.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (!lastEvent) {
      return { needsReminder: true, message: 'Никогда не выполнялось' };
    }

    const lastEventDate = new Date(lastEvent.date);
    const daysSince = Math.floor((now.getTime() - lastEventDate.getTime()) / (24 * 60 * 60 * 1000));

    if (daysSince >= reminder.frequencyDays) {
      return {
        needsReminder: true,
        message: `Прошло ${daysSince} дней (напоминать каждые ${reminder.frequencyDays})`,
      };
    }

    return {
      needsReminder: false,
      message: `Осталось ${reminder.frequencyDays - daysSince} дней`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Add Reminder Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
      >
        <Plus size={20} />
        <span>Добавить напоминание</span>
      </button>

      {/* Add Reminder Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Тип события</label>
            <select
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
            >
              <option value="gift">Подарок</option>
              <option value="date">Свидание</option>
              <option value="activity">Активность</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Напоминать каждые (дней): {formData.frequencyDays}
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={formData.frequencyDays}
              onChange={(e) => setFormData({ ...formData, frequencyDays: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const status = checkReminderStatus(reminder);
            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-lg border-2 ${
                  status?.needsReminder
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getEventTypeIcon(reminder.eventType)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {getEventTypeLabel(reminder.eventType)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Напоминать каждые {reminder.frequencyDays} дней
                      </div>
                      {status && (
                        <div
                          className={`text-sm mt-1 ${
                            status.needsReminder ? 'text-red-600 font-semibold' : 'text-gray-500'
                          }`}
                        >
                          {status.message}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateReminder(reminder.id, { enabled: !reminder.enabled })}
                      className={`p-2 rounded-lg transition-colors ${
                        reminder.enabled
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={reminder.enabled ? 'Отключить' : 'Включить'}
                    >
                      {reminder.enabled ? <Bell size={20} /> : <BellOff size={20} />}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Bell size={48} className="mx-auto mb-4 opacity-50" />
          <p>Нет активных напоминаний</p>
          <p className="text-sm mt-2">Добавьте напоминание, чтобы не забывать о важных событиях</p>
        </div>
      )}
    </div>
  );
}
