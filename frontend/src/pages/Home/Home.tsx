import React, { useState, useEffect } from 'react';
import { Ad, AdFilters } from '../../types';
import { getAds } from '../../api/ads.api';
import { AdList } from '../../components/ads/AdList';
import { SearchFilters } from '../../components/SearchFilters/SearchFilters';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  });

  const [filters, setFilters] = useState<AdFilters>({
    sort: 'newest'
  });

  const loadAds = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAds({ ...filters, page, limit: 12 });
      setAds(response.ads);
      setPagination(response.pagination);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке объявлений');
      console.error('Error loading ads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAds(1);
  }, [filters]);

  const handleFilterChange = (newFilters: AdFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    loadAds(page);
  };

  if (loading && ads.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка объявлений...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Найдите всё, что нужно
          </h1>
          <p className={styles.heroSubtitle}>
            Тысячи объявлений от частных лиц и компаний
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <SearchFilters 
            filters={filters} 
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className={styles.main}>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <div className={styles.resultsHeader}>
            <h2 className={styles.resultsTitle}>
              Объявления
              {pagination.totalItems > 0 && (
                <span className={styles.resultsCount}>
                  ({pagination.totalItems})
                </span>
              )}
            </h2>
          </div>

          <AdList 
            ads={ads} 
            loading={loading}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};