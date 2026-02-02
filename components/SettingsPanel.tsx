'use client';

import { useStore } from '@/store/useStore';
import { Crown, User, Save } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPanel() {
  const { settings, updateSettings } = useStore();
  const [partnerName, setPartnerName] = useState(settings.partnerName);
  const [isPremium, setIsPremium] = useState(settings.isPremium);

  const handleSave = () => {
    updateSettings({
      partnerName,
      isPremium,
    });
    alert('Настройки сохранены!');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Настройки</h2>

      {/* Partner Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <User size={16} />
          Имя партнера
        </label>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          placeholder="Введите имя партнера"
        />
      </div>

      {/* Premium Toggle */}
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border-2 border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="text-yellow-600" size={20} />
          <label className="text-sm font-medium text-gray-700">Премиум версия</label>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="premium"
            checked={isPremium}
            onChange={(e) => setIsPremium(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="premium" className="text-sm text-gray-600">
            Включить премиум функции (3D аватар)
          </label>
        </div>
        {!isPremium && (
          <p className="text-xs text-gray-500 mt-2">
            В бесплатной версии доступен parallax эффект с фотографией
          </p>
        )}
      </div>

      {/* Formula Settings */}
      <div>
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Формула значимости</h3>
        <p className="text-sm text-gray-600 mb-4">
          Настройте веса для расчета значимости подарков/событий
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Вес стоимости: {((settings.significanceFormula?.costWeight || 0.3) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.significanceFormula?.costWeight || 0.3}
              onChange={(e) =>
                updateSettings({
                  significanceFormula: {
                    ...settings.significanceFormula!,
                    costWeight: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Вес романтичности: {((settings.significanceFormula?.romanticismWeight || 0.5) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.significanceFormula?.romanticismWeight || 0.5}
              onChange={(e) =>
                updateSettings({
                  significanceFormula: {
                    ...settings.significanceFormula!,
                    romanticismWeight: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Вес масштабности: {((settings.significanceFormula?.scaleWeight || 0.2) * 100).toFixed(0)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.significanceFormula?.scaleWeight || 0.2}
              onChange={(e) =>
                updateSettings({
                  significanceFormula: {
                    ...settings.significanceFormula!,
                    scaleWeight: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2"
      >
        <Save size={20} />
        Сохранить настройки
      </button>
    </div>
  );
}
