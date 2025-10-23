import React from 'react';
import css from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  // Получаем текущий язык из localStorage или используем 'ru' по умолчанию
  const getCurrentLanguage = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('preferredLanguage') || 'ru';
    }
    return 'ru';
  };

  const currentLanguage = getCurrentLanguage();

  const handleLanguageChange = (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lang);
      // Перезагружаем страницу для применения нового языка
      window.location.reload();
    }
  };

  return (
    <div className={css.languageSwitcher}>
      <button
        className={`${css.languageButton} ${currentLanguage === 'ru' ? css.active : ''}`}
        onClick={() => handleLanguageChange('ru')}
        aria-label="Русский"
      >
        RU
      </button>
      <button
        className={`${css.languageButton} ${currentLanguage === 'en' ? css.active : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

