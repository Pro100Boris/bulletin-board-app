import styles from './Header.module.scss';

export const Header = () => {
  return (
    <header className={styles.container}>
      <div className={styles.logoWrapper}>
        <svg className={styles.logoImage} viewBox="0 0 40 40">
          <rect width="40" height="40" rx="8" fill="#FFFFFF"/>
          <path d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10" stroke="#FF0000" strokeWidth="2"/>
        </svg>
        <h1 className={styles.title}>КликТорг</h1>
      </div>
      <button className={styles.authButton}>Войти</button>
    </header>
  );
};