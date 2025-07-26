import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Показываем все страницы, если их мало
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Показываем ограниченное количество страниц
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className={styles.pagination}>
      <button
        className={`${styles.button} ${styles.navButton}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Назад
      </button>

      <div className={styles.pages}>
        {pageNumbers[0] > 1 && (
          <>
            <button
              className={styles.button}
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className={styles.ellipsis}>...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${styles.button} ${
              page === currentPage ? styles.active : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className={styles.ellipsis}>...</span>
            )}
            <button
              className={styles.button}
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        className={`${styles.button} ${styles.navButton}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Вперед →
      </button>
    </div>
  );
};