import React, { useState, useEffect } from 'react';
import { AdFilters, AD_CATEGORIES } from '../../types';
import styles from './SearchFilters.module.scss';

interface SearchFiltersProps {
  filters: AdFilters;
  onFilterChange: (filters: AdFilters) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState<AdFilters>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field: keyof AdFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [field]: value };
    setLocalFilters(newFilters);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { sort: 'newest' as const };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Фильтры поиска</h3>
        <button 
          type="button" 
          onClick={handleReset}
          className={styles.resetButton}
        >
          Сбросить
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.group}>
          <label className={styles.label}>
            Поиск по тексту
          </label>
          <input
            type="text"
            placeholder="Введите ключевые слова..."
            value={localFilters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.group}>
          <label className={styles.label}>
            Категория
          </label>
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value || undefined)}
            className={styles.select}
          >
            <option value="">Все категории</option>
            {AD_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>
            Местоположение
          </label>
          <input
            type="text"
            placeholder="Город, регион..."
            value={localFilters.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.priceGroup}>
          <label className={styles.label}>
            Цена (₽)
          </label>
          <div className={styles.priceInputs}>
            <input
              type="number"
              placeholder="От"
              min="0"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleInputChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className={styles.priceInput}
            />
            <span className={styles.priceSeparator}>—</span>
            <input
              type="number"
              placeholder="До"
              min="0"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleInputChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className={styles.priceInput}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label className={styles.label}>
            Сортировка
          </label>
          <select
            value={localFilters.sort || 'newest'}
            onChange={(e) => handleInputChange('sort', e.target.value as any)}
            className={styles.select}
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
            <option value="price_asc">Цена по возрастанию</option>
            <option value="price_desc">Цена по убыванию</option>
          </select>
        </div>

        <button type="submit" className={styles.submitButton}>
          Применить фильтры
        </button>
      </form>
    </div>
  );
};