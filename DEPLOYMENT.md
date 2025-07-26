# 🚀 Деплой приложения КликТорг

## 📋 Подготовка к продакшену

### 1. Настройка MongoDB

#### Вариант A: Локальная установка
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Проверка
mongosh --eval "db.adminCommand('ping')"
```

#### Вариант B: MongoDB Atlas (рекомендуется)
1. Регистрируемся на [MongoDB Atlas](https://cloud.mongodb.com)
2. Создаем новый кластер
3. Получаем connection string
4. Обновляем `.env` файл:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/board_app
```

#### Вариант C: Docker
```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  mongo:6.0
```

### 2. Настройка переменных окружения

#### Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/board_app
JWT_SECRET=your_strong_jwt_secret_key_here_change_in_production
NODE_ENV=production
```

#### Frontend (.env.production)
```bash
VITE_API_URL=https://your-api-domain.com/api
```

### 3. Заполнение тестовыми данными
```bash
cd backend
npm run seed
```

## 🌐 Деплой на различные платформы

### Vercel (Frontend)

1. **Подготовка:**
```bash
cd frontend
npm run build
```

2. **Деплой:**
```bash
npm install -g vercel
vercel --prod
```

3. **Настройки в Vercel Dashboard:**
- Environment Variables: `VITE_API_URL`
- Build Command: `npm run build`
- Output Directory: `dist`

### Heroku (Backend)

1. **Установка Heroku CLI**
```bash
# Ubuntu
sudo snap install --classic heroku

# macOS  
brew tap heroku/brew && brew install heroku
```

2. **Подготовка проекта:**
```bash
cd backend
heroku create your-app-name
heroku addons:create mongolab:sandbox
```

3. **Настройка переменных:**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_strong_secret
```

4. **Деплой:**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Railway (Full Stack)

1. **Подключаем GitHub репозиторий**
2. **Создаем MongoDB сервис**
3. **Настраиваем переменные окружения**
4. **Деплоим автоматически**

### DigitalOcean App Platform

1. **Создаем App в DO**
2. **Подключаем GitHub**
3. **Настраиваем компоненты:**
   - Backend: Node.js service
   - Frontend: Static site
   - Database: MongoDB

## 🔧 Производственные настройки

### Backend оптимизации

#### package.json (production scripts)
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build needed for backend'",
    "prod": "NODE_ENV=production node server.js"
  }
}
```

#### server.js (production middleware)
```javascript
// Добавляем в server.js
if (process.env.NODE_ENV === 'production') {
  app.use(helmet()); // Безопасность
  app.use(compression()); // Сжатие
  app.use(morgan('combined')); // Логирование
}
```

### Frontend оптимизации

#### vite.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
})
```

## 🔒 Безопасность

### Environment Variables
```bash
# Обязательно измените в продакшене!
JWT_SECRET=super_secure_random_string_min_32_chars
MONGODB_URI=your_production_db_url
CORS_ORIGIN=https://your-frontend-domain.com
```

### HTTPS настройка
```javascript
// server.js
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## 📊 Мониторинг

### Логирование
```bash
# Установка
npm install winston morgan helmet compression

# Настройка в server.js
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check
```javascript
// Добавляем в server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

## 🚀 CI/CD Pipeline

### GitHub Actions (.github/workflows/deploy.yml)
```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
          
      - name: Build frontend
        run: cd frontend && npm run build
        
      - name: Deploy to production
        run: |
          # Ваши команды деплоя
```

## 📱 Мобильное приложение (будущее)

### React Native версия
- Переиспользование API
- Общие компоненты
- Push уведомления
- Оффлайн режим

### PWA возможности
```javascript
// В frontend добавить
// service-worker.js для кеширования
// manifest.json для установки
```

## 🎯 Масштабирование

### База данных
- Индексы для оптимизации запросов
- Репликация для отказоустойчивости
- Шардинг для больших данных

### Backend
- Load balancer (nginx)
- Кластеризация Node.js
- Redis для сессий и кеша

### Frontend
- CDN для статики
- Code splitting
- Lazy loading компонентов

## 🔄 Обновления

### Continuous Deployment
1. Разработка → feature branch
2. Тестирование → staging
3. Code review → main branch  
4. Автодеплой → production

### Версионирование
```bash
# Semantic versioning
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0
```

Приложение готово к продакшену! 🎉