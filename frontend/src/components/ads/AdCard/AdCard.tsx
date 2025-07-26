import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Ad } from '../../../types';
import styles from './AdCard.module.scss';

interface AdCardProps {
  ad: Ad;
  onClick?: (ad: Ad) => void;
}

export const AdCard: React.FC<AdCardProps> = ({ ad, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(ad);
    } else {
      // Навигация к детальной странице объявления
      navigate(`/ad/${ad._id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getMainImage = () => {
    if (ad.images && ad.images.length > 0) {
      // Если путь изображения начинается с http, используем его как есть
      if (ad.images[0].startsWith('http')) {
        return ad.images[0];
      }
      // Иначе добавляем базовый URL сервера
      return `http://localhost:5000/${ad.images[0]}`;
    }
    return '/placeholder-image.svg'; // Заглушка для отсутствующих изображений
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.imageContainer}>
        <img 
          src={getMainImage()} 
          alt={ad.title}
          className={styles.image}
          onError={(e) => {
            // Обработка ошибки загрузки изображения
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
        <div className={styles.category}>
          {ad.category}
        </div>
        {ad.images && ad.images.length > 1 && (
          <div className={styles.imageCount}>
            +{ad.images.length - 1}
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>
          {ad.title}
        </h3>
        
        <p className={styles.description}>
          {ad.description.length > 100 
            ? `${ad.description.substring(0, 100)}...` 
            : ad.description
          }
        </p>

        <div className={styles.price}>
          {formatPrice(ad.price)} ₽
        </div>

        <div className={styles.footer}>
          <div className={styles.location}>
            📍 {ad.location}
          </div>
          <div className={styles.date}>
            {formatDate(ad.createdAt)}
          </div>
        </div>

        <div className={styles.seller}>
          <div className={styles.sellerInfo}>
            <span className={styles.sellerName}>
              {ad.user.username}
            </span>
            {ad.user.phone && (
              <span className={styles.phone}>
                📞 {ad.user.phone}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};