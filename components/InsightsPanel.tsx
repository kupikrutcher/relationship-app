'use client';

import { useStore } from '@/store/useStore';
import { TrendingUp, TrendingDown, Minus, Gift, Heart, AlertTriangle, Lightbulb } from 'lucide-react';

export default function InsightsPanel() {
  const insights = useStore((state) => state.getInsights());

  const getMoodEmoji = (mood: string) => {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      excited: '✨',
      calm: '😌',
      anxious: '😰',
      romantic: '💕',
      neutral: '😐',
    };
    return emojiMap[mood] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* Mood Summary */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-xl border-2 border-pink-200">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Heart className="text-pink-500" size={20} />
          Среднее настроение
        </h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{getMoodEmoji(insights.averageMood)}</div>
          <div>
            <div className="text-2xl font-bold text-gray-800 capitalize">
              {insights.averageMood === 'happy' && 'Счастливое'}
              {insights.averageMood === 'sad' && 'Грустное'}
              {insights.averageMood === 'excited' && 'Взволнованное'}
              {insights.averageMood === 'calm' && 'Спокойное'}
              {insights.averageMood === 'anxious' && 'Тревожное'}
              {insights.averageMood === 'romantic' && 'Романтичное'}
              {insights.averageMood === 'neutral' && 'Нейтральное'}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Тренд: {insights.moodTrend === 'improving' && 'Улучшается'}
              {insights.moodTrend === 'stable' && 'Стабильное'}
              {insights.moodTrend === 'declining' && 'Ухудшается'}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="text-pink-500" size={20} />
            <span className="text-sm text-gray-600">Всего подарков</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{insights.totalGifts}</div>
        </div>

        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-purple-500" size={20} />
            <span className="text-sm text-gray-600">Средняя значимость</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {insights.averageSignificance.toFixed(1)}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-orange-500" size={20} />
            <span className="text-sm text-gray-600">Ссор за месяц</span>
          </div>
          <div className="text-3xl font-bold text-gray-800">{insights.fightFrequency}</div>
        </div>
      </div>

      {/* Last Gift Info */}
      {insights.lastGiftDate && (
        <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
          <div className="text-sm text-gray-600 mb-1">Последний подарок</div>
          <div className="text-lg font-semibold text-gray-800">
            {insights.daysSinceLastGift !== undefined && (
              <>
                {insights.daysSinceLastGift === 0 && 'Сегодня'}
                {insights.daysSinceLastGift === 1 && 'Вчера'}
                {insights.daysSinceLastGift > 1 && `${insights.daysSinceLastGift} дней назад`}
              </>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {insights.recommendations.length > 0 && (
        <div className="bg-yellow-50 p-6 rounded-xl border-2 border-yellow-200">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="text-yellow-600" size={20} />
            Рекомендации
          </h3>
          <ul className="space-y-2">
            {insights.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-700">
                <span className="text-yellow-600 mt-1">💡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {insights.recommendations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
          <p>Все отлично! Продолжайте в том же духе 💕</p>
        </div>
      )}
    </div>
  );
}
