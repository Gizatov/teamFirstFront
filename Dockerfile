# Установите node как базовый образ
FROM node:16-alpine

# Установите рабочую директорию в контейнере
WORKDIR /app

# Копируйте package.json и package-lock.json (если доступен)
COPY package.json package-lock.json* ./

# Установите зависимости проекта
RUN npm install --legacy-peer-deps

# Копируйте исходный код проекта в контейнер
COPY . .

# Экспортируйте порт, на котором работает сервер Angular
EXPOSE 4200

# Запуск сервера Angular с увеличенным лимитом памяти
CMD ["node", "--max_old_space_size=4096", "node_modules/@angular/cli/bin/ng", "serve", "--host", "0.0.0.0"]
