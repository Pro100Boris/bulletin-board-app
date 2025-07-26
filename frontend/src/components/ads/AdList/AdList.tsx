import React from 'react';
import { Ad, Pagination } from '../../../types';
import { AdCard } from '../AdCard/AdCard';
import { Pagination as PaginationComponent } from '../../Pagination/Pagination';
import styles from './AdList.module.scss';

interface AdListProps {
  ads: Ad[];
  loading: boolean;
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export const AdList: React.FC<AdListProps> = ({ 
  ads, 
  loading, 
  pagination, 
  onPageChange 
}) => {
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка объявлений...</p>
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>Объявления не найдены</h3>
        <p className={styles.emptyText}>
          Попробуйте изменить параметры поиска или фильтры
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {ads.map((ad) => (
          <AdCard key={ad._id} ad={ad} />
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <PaginationComponent
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};