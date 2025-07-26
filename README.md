# Доска объявлений КликТорг

Современное веб-приложение доски объявлений с функциями регистрации, создания и поиска объявлений.

## Технологии

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT аутентификация
- Multer для загрузки файлов
- bcryptjs для хеширования паролей

### Frontend
- React 19 + TypeScript
- Vite
- SCSS модули
- Axios для HTTP запросов
- React Router для роутинга

## Установка и запуск

### Предварительные требования
- Node.js (версия 18+)
- MongoDB
- npm или yarn

### 1. Установка MongoDB

#### Ubuntu/Debian:
```bash
# Установка MongoDB
sudo apt update
sudo apt install -y mongodb

# Запуск MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### macOS:
```bash
# Установка через Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Windows:
Скачайте и установите MongoDB Community Server с официального сайта.

### 2. Установка зависимостей

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Настройка окружения

Файл `backend/.env` уже создан со следующими настройками:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/board_app
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Файл `frontend/.env` также создан:
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Запуск приложения

#### Запуск backend:
```bash
cd backend
npm run dev
```
Backend запустится на http://localhost:5000

#### Запуск frontend:
```bash
cd frontend
npm run dev
```
Frontend запустится на http://localhost:5173

## Функциональность

### Реализовано
- ✅ Модели данных (User, Ad)
- ✅ API для объявлений (CRUD операции)
- ✅ API для аутентификации (регистрация, вход)
- ✅ Компонент главной страницы
- ✅ Компонент списка объявлений
- ✅ Компонент карточки объявления
- ✅ Компонент фильтров поиска
- ✅ Пагинация
- ✅ Responsive дизайн
- ✅ **Страницы аутентификации (Login/Register)**
- ✅ **Функциональный Header с меню пользователя**
- ✅ **Страница создания объявлений с загрузкой изображений**
- ✅ **Детальная страница объявления с галереей**
- ✅ **Защищенные роуты**
- ✅ **Контекст управления состоянием аутентификации**

### В планах
- 🔄 Личный кабинет пользователя
- 🔄 Страница "Мои объявления"
- 🔄 Редактирование объявлений
- 🔄 Система избранного
- 🔄 Чат между пользователями

## API Endpoints

### Объявления
- `GET /api/ads` - получить список объявлений
- `GET /api/ads/:id` - получить объявление по ID
- `POST /api/ads` - создать объявление (требует авторизации)
- `PUT /api/ads/:id` - обновить объявление (требует авторизации)
- `DELETE /api/ads/:id` - удалить объявление (требует авторизации)
- `GET /api/ads/categories` - получить список категорий

### Аутентификация
- `POST /api/auth/register` - регистрация
- `POST /api/auth/login` - вход
- `GET /api/auth/profile` - получить профиль (требует авторизации)
- `PUT /api/auth/profile` - обновить профиль (требует авторизации)

## Структура проекта

```
.
├── backend/
│   ├── controllers/         # Контроллеры
│   ├── models/             # Модели данных
│   ├── routes/             # Роуты API
│   ├── middleware/         # Middleware функции
│   ├── uploads/            # Папка для загруженных файлов
│   └── server.js           # Главный файл сервера
└── frontend/
    ├── src/
    │   ├── api/            # API клиенты
    │   ├── components/     # React компоненты
    │   ├── contexts/       # React контексты
    │   ├── pages/          # Страницы приложения
    │   ├── types/          # TypeScript типы
    │   └── styles/         # Глобальные стили
    └── public/             # Статические файлы
```

## Разработка

Для удобства разработки рекомендуется:

1. Запустить MongoDB
2. Открыть два терминала
3. В первом терминале запустить backend: `cd backend && npm run dev`
4. Во втором терминале запустить frontend: `cd frontend && npm run dev`

Приложение автоматически перезагрузится при изменении файлов.

## Troubleshooting

### MongoDB не запускается
- Убедитесь, что MongoDB установлен корректно
- Проверьте статус сервиса: `sudo systemctl status mongodb`
- Проверьте логи: `sudo journalctl -u mongodb`

### Backend не запускается
- Проверьте, что MongoDB запущен
- Убедитесь, что порт 5000 свободен
- Проверьте файл `.env` в папке backend

### Frontend не подключается к backend
- Убедитесь, что backend запущен на порту 5000
- Проверьте файл `.env` в папке frontend
- Проверьте настройки CORS в backend