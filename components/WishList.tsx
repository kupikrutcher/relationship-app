'use client';

import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, X, Check, Gift } from 'lucide-react';

export default function WishList() {
  const { wishes, addWish, updateWish, deleteWish } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      addWish({
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category || undefined,
        fulfilled: false,
      });
      setFormData({ title: '', description: '', category: '' });
      setShowForm(false);
    }
  };

  const unfulfilledWishes = wishes.filter((w) => !w.fulfilled);
  const fulfilledWishes = wishes.filter((w) => w.fulfilled);

  return (
    <div className="space-y-6">
      {/* Add Wish Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
      >
        <Plus size={20} />
        <span>Добавить желание</span>
      </button>

      {/* Add Wish Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <input
            type="text"
            placeholder="Название желания"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
          <textarea
            placeholder="Описание (необязательно)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
          <input
            type="text"
            placeholder="Категория (необязательно)"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 text-black"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600 transition-colors"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData({ title: '', description: '', category: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {/* Unfulfilled Wishes */}
      {unfulfilledWishes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Активные желания</h3>
          <div className="space-y-2">
            {unfulfilledWishes.map((wish) => (
              <div
                key={wish.id}
                className="flex items-start gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-pink-300 transition-colors"
              >
                <Gift size={20} className="text-pink-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{wish.title}</div>
                  {wish.description && (
                    <div className="text-sm text-gray-600 mt-1">{wish.description}</div>
                  )}
                  {wish.category && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs bg-pink-100 text-pink-700 rounded">
                      {wish.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateWish(wish.id, { fulfilled: true, fulfilledDate: new Date().toISOString() })}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Отметить выполненным"
                  >
                    <Check size={20} />
                  </button>
                  <button
                    onClick={() => deleteWish(wish.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fulfilled Wishes */}
      {fulfilledWishes.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Выполненные желания</h3>
          <div className="space-y-2">
            {fulfilledWishes.map((wish) => (
              <div
                key={wish.id}
                className="flex items-start gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75"
              >
                <Check size={20} className="text-green-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-gray-600 line-through">{wish.title}</div>
                  {wish.description && (
                    <div className="text-sm text-gray-500 mt-1">{wish.description}</div>
                  )}
                  {wish.fulfilledDate && (
                    <div className="text-xs text-gray-400 mt-1">
                      Выполнено: {new Date(wish.fulfilledDate).toLocaleDateString('ru-RU')}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteWish(wish.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {wishes.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Gift size={48} className="mx-auto mb-4 opacity-50" />
          <p>Список желаний пуст</p>
          <p className="text-sm mt-2">Добавьте первое желание, чтобы начать отслеживать</p>
        </div>
      )}
    </div>
  );
}
