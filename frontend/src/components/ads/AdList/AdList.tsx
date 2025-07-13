import { useEffect, useState } from 'react';
import styles from './AdList.module.scss';
import type { Ad } from './types';
export const AdList = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/ads');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        setAds(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (ads.length === 0) return <div className={styles.empty}>Нет объявлений</div>;

  return (
    <div className={styles.list}>
      {ads.map(ad => (
        <div key={ad._id} className={styles.card}>
          <h3>{ad.title}</h3>
          <p className={styles.price}>{ad.price} ₽</p>
          <p className={styles.description}>{ad.description}</p>
          {ad.images?.[0] && (
            <img 
              src={ad.images[0]} 
              alt={ad.title}
              className={styles.image}
            />
          )}
        </div>
      ))}
    </div>
  );
};