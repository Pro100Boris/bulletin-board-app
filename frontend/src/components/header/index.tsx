import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Header.module.scss';

export const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className={styles.container}>
      <div className={styles.content}>
        <Link to="/" className={styles.logoWrapper}>
          <svg className={styles.logoImage} viewBox="0 0 40 40">
            <rect width="40" height="40" rx="8" fill="#FFFFFF"/>
            <path d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10" stroke="#667eea" strokeWidth="2"/>
          </svg>
          <h1 className={styles.title}>КликТорг</h1>
        </Link>

        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Объявления
          </Link>
          {isAuthenticated && (
            <Link to="/create-ad" className={styles.navLink}>
              Разместить объявление
            </Link>
          )}
        </nav>

        <div className={styles.userSection}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.userButton}
                onClick={toggleUserMenu}
              >
                <div className={styles.avatar}>
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className={styles.username}>
                  {user?.username}
                </span>
                <svg 
                  className={`${styles.chevron} ${showUserMenu ? styles.open : ''}`}
                  width="20" 
                  height="20" 
                  viewBox="0 0 20 20"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
              </button>

              {showUserMenu && (
                <div className={styles.dropdown}>
                  <Link 
                    to="/profile" 
                    className={styles.menuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    Профиль
                  </Link>
                  <Link 
                    to="/my-ads" 
                    className={styles.menuItem}
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                    </svg>
                    Мои объявления
                  </Link>
                  <hr className={styles.divider} />
                  <button 
                    className={styles.menuItem}
                    onClick={handleLogout}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                    </svg>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginButton}>
                Войти
              </Link>
              <Link to="/register" className={styles.registerButton}>
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};