'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import type { CalendarEvent, Mood } from '@/types';
import { X, Trash2 } from 'lucide-react';

interface EventFormProps {
  onClose: () => void;
  event?: CalendarEvent;
  initialDate?: string;
  initialType?: CalendarEvent['type'];
}

export default function EventForm({ onClose, event, initialDate, initialType }: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useStore();
  const [formData, setFormData] = useState({
    type: event?.type || initialType || ('gift' as CalendarEvent['type']),
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? event.date.split('T')[0] : (initialDate ? initialDate.split('T')[0] : new Date().toISOString().split('T')[0]),
    mood: event?.mood || ('neutral' as Mood),
    cost: event?.ratings?.cost || 5,
    romanticism: event?.ratings?.romanticism || 5,
    scale: event?.ratings?.scale || 5,
    completed: event?.completed || false,
    fightReason: event?.fightDetails?.reason || '',
    fightNotes: event?.fightDetails?.notes || '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        type: event.type,
        title: event.title,
        description: event.description || '',
        date: event.date.split('T')[0],
        mood: event.mood || 'neutral',
        cost: event.ratings?.cost || 5,
        romanticism: event.ratings?.romanticism || 5,
        scale: event.ratings?.scale || 5,
        completed: event.completed,
        fightReason: event.fightDetails?.reason || '',
        fightNotes: event.fightDetails?.notes || '',
      });
    } else if (initialDate || initialType) {
      setFormData((prev) => ({
        ...prev,
        type: initialType || prev.type,
        date: initialDate ? initialDate.split('T')[0] : prev.date,
      }));
    }
  }, [event, initialDate, initialType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData: Omit<CalendarEvent, 'id'> = {
      type: formData.type,
      title: formData.title,
      description: formData.description || undefined,
      date: new Date(formData.date).toISOString(),
      mood: formData.mood,
      ratings:
        formData.type !== 'fight'
          ? {
              cost: formData.cost,
              romanticism: formData.romanticism,
              scale: formData.scale,
            }
          : undefined,
      fightDetails:
        formData.type === 'fight'
          ? {
              reason: formData.fightReason,
              notes: formData.fightNotes,
            }
          : undefined,
      completed: formData.completed,
    };

    if (event) {
      updateEvent(event.id, eventData);
    } else {
      addEvent(eventData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {event ? 'Редактировать событие' : 'Новое событие'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Тип события</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as CalendarEvent['type'] })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          >
            <option value="gift">Подарок</option>
            <option value="date">Свидание</option>
            <option value="activity">Активность</option>
            <option value="reminder">Напоминание</option>
            <option value="fight">Ссора</option>
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Название</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Дата</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Описание</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
        </div>

        {/* Mood */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Настроение</label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value as Mood })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          >
            <option value="happy">Счастливый</option>
            <option value="sad">Грустный</option>
            <option value="excited">Взволнованный</option>
            <option value="calm">Спокойный</option>
            <option value="anxious">Тревожный</option>
            <option value="romantic">Романтичный</option>
            <option value="neutral">Нейтральный</option>
          </select>
        </div>

        {/* Fight Details */}
        {formData.type === 'fight' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Причина ссоры</label>
              <input
                type="text"
                value={formData.fightReason}
                onChange={(e) => setFormData({ ...formData, fightReason: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Заметки</label>
              <textarea
                value={formData.fightNotes}
                onChange={(e) => setFormData({ ...formData, fightNotes: e.target.value })}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
              />
            </div>
          </>
        )}

        {/* Ratings */}
        {formData.type !== 'fight' && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-700">Оценки</h3>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Стоимость: {formData.cost}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Романтичность: {formData.romanticism}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.romanticism}
                onChange={(e) => setFormData({ ...formData, romanticism: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Масштабность: {formData.scale}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.scale}
                onChange={(e) => setFormData({ ...formData, scale: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Completed */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="completed"
            checked={formData.completed}
            onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="completed" className="text-sm text-gray-700">
            Уже выполнено
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col gap-2">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium"
          >
            {event ? 'Сохранить изменения' : 'Добавить событие'}
          </button>
          {event && (
            <button
              type="button"
              onClick={() => {
                if (confirm('Удалить это событие?')) {
                  deleteEvent(event.id);
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
              Удалить событие
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
