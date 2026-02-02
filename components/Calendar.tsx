'use client';

import { useState, useRef, useEffect } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useStore } from '@/store/useStore';
import type { CalendarEvent } from '@/types';
import { ChevronLeft, ChevronRight, Gift, Heart, Calendar as CalendarIcon, AlertTriangle, Plus } from 'lucide-react';

type ViewMode = 'week' | '2weeks' | 'month';

const EVENT_TYPES: { value: CalendarEvent['type']; label: string; icon: typeof Gift }[] = [
  { value: 'gift', label: 'Подарок', icon: Gift },
  { value: 'date', label: 'Свидание', icon: Heart },
  { value: 'activity', label: 'Активность', icon: CalendarIcon },
  { value: 'reminder', label: 'Напоминание', icon: CalendarIcon },
  { value: 'fight', label: 'Ссора', icon: AlertTriangle },
];

interface CalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: string, type: CalendarEvent['type']) => void;
}

export default function Calendar({ onEventClick, onAddEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [dropdownAnchor, setDropdownAnchor] = useState<{ day: Date; element: HTMLElement } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { events } = useStore();

  const getDaysToShow = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    }
    if (viewMode === '2weeks') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const days: Date[] = [];
      for (let i = 0; i < 14; i++) {
        days.push(addDays(weekStart, i));
      }
      return days;
    }
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const getEmptyCellsCount = () => {
    if (viewMode === 'month') {
      const monthStart = startOfMonth(currentDate);
      return (monthStart.getDay() + 6) % 7;
    }
    return 0;
  };

  const navigate = (direction: 1 | -1) => {
    if (viewMode === 'month') {
      setCurrentDate(direction === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else {
      const weeks = viewMode === '2weeks' ? 2 : 1;
      setCurrentDate(direction === 1 ? addWeeks(currentDate, weeks) : subWeeks(currentDate, weeks));
    }
  };

  const getTitle = () => {
    if (viewMode === 'week') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'd MMM', { locale: ru })} — ${format(weekEnd, 'd MMM yyyy', { locale: ru })}`;
    }
    if (viewMode === '2weeks') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = addDays(weekStart, 13);
      return `${format(weekStart, 'd MMM', { locale: ru })} — ${format(weekEnd, 'd MMM yyyy', { locale: ru })}`;
    }
    return format(currentDate, 'LLLL yyyy', { locale: ru });
  };

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

  const handleDayClick = (day: Date, e: React.MouseEvent) => {
    const target = e.currentTarget as HTMLElement;
    setDropdownAnchor({ day, element: target });
  };

  const handleTypeSelect = (type: CalendarEvent['type']) => {
    if (dropdownAnchor && onAddEvent) {
      const dateStr = format(dropdownAnchor.day, "yyyy-MM-dd'T'00:00:00.000'Z'");
      onAddEvent(dateStr, type);
      setDropdownAnchor(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) && !(e.target as Element).closest('[data-day-cell]')) {
        setDropdownAnchor(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const days = getDaysToShow();
  const emptyCells = getEmptyCellsCount();
  const gridCols = viewMode === 'month' ? 7 : viewMode === '2weeks' ? 7 : 7;

  return (
    <div className="w-full">
      {/* View mode selector */}
      <div className="flex items-center gap-2 mb-4 flex-shrink-0">
        {(['week', '2weeks', 'month'] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === mode
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
            }`}
          >
            {mode === 'week' ? 'Неделя' : mode === '2weeks' ? '2 недели' : 'Месяц'}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h3 className="text-lg font-bold text-gray-800 min-w-[200px] text-center">{getTitle()}</h3>
        <button
          type="button"
          onClick={() => navigate(1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}>
        {/* Empty cells for month view */}
        {viewMode === 'month' &&
          Array.from({ length: emptyCells }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square min-h-[80px]" />
          ))}

        {/* Days */}
        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = viewMode === 'month' ? isSameMonth(day, currentDate) : true;

          return (
            <div
              key={day.toISOString()}
              data-day-cell
              onClick={(e) => {
                if ((e.target as HTMLElement).closest('[data-event]')) return;
                handleDayClick(day, e);
              }}
              className={`relative aspect-square min-h-[80px] border-2 rounded-lg p-2 transition-all cursor-pointer ${
                isToday ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
              } ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${isToday ? 'text-pink-600' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </span>
                {onAddEvent && (
                  <Plus size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 hover:opacity-100" />
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, viewMode === 'month' ? 3 : 5).map((event) => (
                  <div
                    key={event.id}
                    data-event
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className={`flex items-center gap-1 text-xs bg-white rounded px-1 py-0.5 shadow-sm text-black ${
                      onEventClick ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''
                    }`}
                    title={event.title}
                  >
                    {getEventIcon(event.type)}
                    <span className="truncate">{event.title}</span>
                  </div>
                ))}
                {dayEvents.length > (viewMode === 'month' ? 3 : 5) && (
                  <div className="text-xs text-gray-500">+{dayEvents.length - (viewMode === 'month' ? 3 : 5)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dropdown for adding event */}
      {dropdownAnchor && onAddEvent && (
        <div
          ref={dropdownRef}
          className="fixed z-50 mt-1 py-1 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[180px]"
          style={{
            top: dropdownAnchor.element.getBoundingClientRect().bottom + 4,
            left: dropdownAnchor.element.getBoundingClientRect().left,
          }}
        >
          <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">
            {format(dropdownAnchor.day, 'd MMMM yyyy', { locale: ru })}
          </div>
          {EVENT_TYPES.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => handleTypeSelect(value)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-gray-800 hover:bg-pink-50 transition-colors"
            >
              <Icon size={18} className={value === 'gift' ? 'text-pink-500' : value === 'date' ? 'text-red-500' : value === 'fight' ? 'text-orange-500' : 'text-blue-500'} />
              {label}
            </button>
          ))}
        </div>
      )}

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
