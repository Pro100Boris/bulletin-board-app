import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createAd, getCategories } from '../../api/ads.api';
import { AdFormData } from '../../types';
import styles from './CreateAd.module.scss';

export const CreateAd: React.FC = () => {
  const [formData, setFormData] = useState<AdFormData>({
    title: '',
    description: '',
    price: 0,
    category: '',
    location: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Загружаем категории
    const loadCategories = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };

    loadCategories();
  }, [isAuthenticated, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? Number(value) : value
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 10) {
      setError('Можно загрузить максимум 10 изображений');
      return;
    }

    // Проверяем размер файлов
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`Файл ${file.name} слишком большой. Максимальный размер: 5MB`);
        return false;
      }
      return true;
    });

    setImages([...images, ...validFiles]);

    // Создаем URL для превью
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls]);
    setError('');
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    // Освобождаем URL
    URL.revokeObjectURL(imagePreviewUrls[index]);
    
    setImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Создаем FormData с изображениями
      const formDataWithImages: AdFormData = {
        ...formData,
        images: images.length > 0 ? createFileList(images) : undefined
      };

      await createAd(formDataWithImages);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ошибка при создании объявления');
    } finally {
      setLoading(false);
    }
  };

  // Вспомогательная функция для создания FileList из массива File
  const createFileList = (files: File[]): FileList => {
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    return dt.files;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Разместить объявление</h1>
        <p className={styles.subtitle}>Заполните форму, чтобы добавить ваше объявление</p>
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Заголовок объявления *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength={100}
            className={styles.input}
            placeholder="Например: Продаю iPhone 14 Pro"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="category" className={styles.label}>
            Категория *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className={styles.select}
          >
            <option value="">Выберите категорию</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="price" className={styles.label}>
            Цена (₽) *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            className={styles.input}
            placeholder="0"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location" className={styles.label}>
            Местоположение *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Город, район"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Описание *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            maxLength={2000}
            rows={5}
            className={styles.textarea}
            placeholder="Подробное описание товара или услуги..."
          />
          <div className={styles.charCount}>
            {formData.description.length}/2000
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="images" className={styles.label}>
            Фотографии (до 10 штук)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
          />
          
          {imagePreviewUrls.length > 0 && (
            <div className={styles.imagePreview}>
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className={styles.imageItem}>
                  <img src={url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => navigate('/')}
            className={styles.cancelButton}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className={styles.submitButton}
          >
            {loading ? (
              <div className={styles.spinner}></div>
            ) : (
              'Опубликовать объявление'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};