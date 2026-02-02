'use client';

import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useStore } from '@/store/useStore';
import type { CalendarEvent } from '@/types';
import { ChevronLeft, ChevronRight, Gift, Heart, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react';

interface CalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
}

export default function Calendar({ onEventClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events } = useStore();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => isSameDay(new Date(event.date), day));
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'gift':
        return <Gift size={16} className="text-pink-500" />;
      case 'date':
        return <Heart size={16} className="text-red-500" />;
      case 'fight':
        return <AlertTriangle size={16} className="text-orange-500" />;
      default:
        return <CalendarIcon size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="w-full">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-xl font-bold text-gray-800">
          {format(currentDate, 'LLLL yyyy')}
        </h3>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before month start */}
        {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {/* Days of the month */}
        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={`aspect-square border-2 rounded-lg p-2 transition-all ${
                isToday
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              } ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-pink-600' : 'text-gray-700'}`}>
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className={`flex items-center gap-1 text-xs bg-white rounded px-1 py-0.5 shadow-sm text-black ${
                      onEventClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                    }`}
                    title={event.title}
                  >
                    {getEventIcon(event.type)}
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - 3}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm text-black">
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-pink-500" />
          <span>Подарок</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart size={16} className="text-red-500" />
          <span>Свидание</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-orange-500" />
          <span>Ссора</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-blue-500" />
          <span>Событие</span>
        </div>
      </div>
    </div>
  );
}
