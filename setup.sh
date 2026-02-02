#!/bin/bash

# Скрипт для установки Node.js и запуска приложения

echo "🚀 Установка Node.js для Relationship App"
echo ""

# Проверка наличия Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js уже установлен: $(node --version)"
    echo "✅ npm уже установлен: $(npm --version)"
else
    echo "❌ Node.js не найден"
    echo ""
    echo "Пожалуйста, установите Node.js одним из способов:"
    echo ""
    echo "📦 Вариант 1 (РЕКОМЕНДУЕТСЯ): Официальный установщик"
    echo "   1. Откройте https://nodejs.org/"
    echo "   2. Скачайте LTS версию для macOS"
    echo "   3. Запустите установщик"
    echo "   4. Перезапустите терминал"
    echo ""
    echo "🍺 Вариант 2: Через Homebrew"
    echo "   sudo chown -R $(whoami) /opt/homebrew"
    echo "   brew install node"
    echo ""
    echo "📚 Вариант 3: Через nvm (Node Version Manager)"
    echo "   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash"
    echo "   # Затем перезапустите терминал и выполните:"
    echo "   nvm install --lts"
    echo "   nvm use --lts"
    echo ""
    exit 1
fi

echo ""
echo "📦 Установка зависимостей проекта..."
cd "$(dirname "$0")"
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Зависимости установлены успешно!"
    echo ""
    echo "🚀 Запуск приложения..."
    echo "   Приложение будет доступно по адресу: http://localhost:3000"
    echo ""
    npm run dev
else
    echo ""
    echo "❌ Ошибка при установке зависимостей"
    exit 1
fi
