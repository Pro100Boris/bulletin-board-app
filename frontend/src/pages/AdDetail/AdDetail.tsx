import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Ad } from '../../types';
import { getAdById } from '../../api/ads.api';
import styles from './AdDetail.module.scss';

export const AdDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    const loadAd = async () => {
      try {
        const adData = await getAdById(id);
        setAd(adData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Объявление не найдено');
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:5000/${imagePath}`;
  };

  const nextImage = () => {
    if (ad && ad.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad && ad.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Загрузка объявления...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Ошибка</h2>
          <p>{error || 'Объявление не найдено'}</p>
          <button onClick={() => navigate('/')} className={styles.backButton}>
            Вернуться к объявлениям
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => navigate('/')} className={styles.backLink}>
        ← Назад к объявлениям
      </button>

      <div className={styles.content}>
        <div className={styles.imageSection}>
          {ad.images && ad.images.length > 0 ? (
            <div className={styles.imageGallery}>
              <div className={styles.mainImage}>
                <img 
                  src={getImageUrl(ad.images[currentImageIndex])} 
                  alt={ad.title}
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-image.svg';
                  }}
                />
                {ad.images.length > 1 && (
                  <>
                    <button 
                      className={`${styles.navButton} ${styles.prevButton}`}
                      onClick={prevImage}
                    >
                      ←
                    </button>
                    <button 
                      className={`${styles.navButton} ${styles.nextButton}`}
                      onClick={nextImage}
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {ad.images.length > 1 && (
                <div className={styles.thumbnails}>
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${index === currentImageIndex ? styles.active : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img 
                        src={getImageUrl(image)} 
                        alt={`${ad.title} ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className={styles.noImage}>
              <img src="/placeholder-image.svg" alt="Нет изображения" />
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.header}>
            <div className={styles.category}>{ad.category}</div>
            <h1 className={styles.title}>{ad.title}</h1>
            <div className={styles.price}>{formatPrice(ad.price)} ₽</div>
          </div>

          <div className={styles.description}>
            <h3>Описание</h3>
            <p>{ad.description}</p>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Местоположение:</span>
              <span className={styles.value}>📍 {ad.location}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Опубликовано:</span>
              <span className={styles.value}>{formatDate(ad.createdAt)}</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Статус:</span>
              <span className={`${styles.status} ${styles[ad.status]}`}>
                {ad.status === 'active' ? 'Активное' : 
                 ad.status === 'sold' ? 'Продано' : 'В архиве'}
              </span>
            </div>
          </div>

          <div className={styles.seller}>
            <h3>Контакты продавца</h3>
            <div className={styles.sellerInfo}>
              <div className={styles.sellerName}>
                <strong>{ad.user.username}</strong>
              </div>
              {ad.user.phone && (
                <div className={styles.sellerPhone}>
                  <a href={`tel:${ad.user.phone}`}>
                    📞 {ad.user.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};