const mongoose = require('mongoose');

// Создаем схему объявления
const adSchema = new mongoose.Schema({
  // Заголовок объявления
  title: {
    type: String,
    required: [true, 'Объявление должно иметь заголовок'],
    trim: true,
    maxlength: [100, 'Заголовок не может быть длиннее 100 символов']
  },
  
  // Описание
  description: {
    type: String,
    required: [true, 'Объявление должно иметь описание'],
    trim: true,
    maxlength: [2000, 'Описание не может быть длиннее 2000 символов']
  },
  
  // Цена
  price: {
    type: Number,
    required: [true, 'Укажите цену'],
    min: [0, 'Цена не может быть отрицательной']
  },
  
  // Категория
  category: {
    type: String,
    required: true,
    enum: {  // Допустимые значения
      values: [
        'Недвижимость',
        'Транспорт',
        'Работа',
        'Услуги',
        'Электроника',
        'Для дома',
        'Хобби',
        'Животные',
        'Мода'
      ],
      message: 'Выберите корректную категорию'
    }
  },
  
  // Массив изображений
  images: {
    type: [String],  // Массив строк (путей к файлам)
    validate: {      // Валидация количества изображений
      validator: function(arr) {
        return arr.length <= 10;  // Не более 10 изображений
      },
      message: 'Можно загрузить не более 10 изображений'
    }
  },
  
  // Местоположение
  location: {
    type: String,
    required: [true, 'Укажите местоположение']
  },
  
  // Ссылка на пользователя
  user: {
    type: mongoose.Schema.Types.ObjectId,  // ID пользователя
    ref: 'User',                          // Ссылается на модель User
    required: [true, 'Объявление должно принадлежать пользователю']
  },
  
  // Статус объявления
  status: {
    type: String,
    enum: ['active', 'sold', 'archived'],
    default: 'active'
  }
}, {
  timestamps: true,  // Добавляет createdAt и updatedAt
  toJSON: { virtuals: true },  // Включаем виртуальные поля при преобразовании в JSON
  toObject: { virtuals: true }
});

// Виртуальное поле для отзывов (пример)
adSchema.virtual('reviews', {
  ref: 'Review',       // Модель, с которой связываем
  foreignField: 'ad',  // Поле в модели Review
  localField: '_id'    // Поле в текущей модели
});

// Индексы для ускорения поиска
adSchema.index({ price: 1 });         // Индекс по цене
adSchema.index({ title: 'text' });    // Текстовый индекс по заголовку

// Middleware для удаления связанных данных
adSchema.pre('remove', async function(next) {
  // Удаляем все отзывы к этому объявлению
  await this.model('Review').deleteMany({ ad: this._id });
  next();
});

module.exports = mongoose.model('Ad', adSchema);