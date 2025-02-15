# Используем официальный образ Node.js
FROM node:18-alpine 

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Открываем порт 3001
EXPOSE 3001

# Запускаем сервер
CMD ["npm", "start"]
