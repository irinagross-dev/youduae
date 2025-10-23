import React from 'react';
import { NamedLink } from '../../components';
import css from './FooterCustom.module.css';
import logo from '../../assets/Logo.png'; // проверь путь к картинке

const FooterCustom = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className={css.container}>

        {/* Логотип */}
        <NamedLink name="LandingPage" className={css.logoName} aria-label="На главную">
          <div className={css.logoPic}>
            <img src={logo} alt="YouDu" className={css.logoImg} />
          </div>
          <div className={css.logoText}>YouDu</div>
        </NamedLink>

        {/* Колонка 1 */}
        <div className={css.column1}>
          <NamedLink name="PrivacyPolicyPage" className={css.col1Item}>Создать задачу</NamedLink>
          <NamedLink name="PrivacyPolicyPage" className={css.col1Item}>Все услуги</NamedLink>
          <NamedLink name="PrivacyPolicyPage" className={css.col1Item}>О компании</NamedLink>
        </div>

        {/* Колонка 2 */}
        <div className={css.column2}>
          <NamedLink name="PrivacyPolicyPage" className={css.col2Item}>Для специалистов</NamedLink>
          <NamedLink name="PrivacyPolicyPage" className={css.col2Item}>Контакты</NamedLink>
          <NamedLink name="PrivacyPolicyPage" className={css.col2Item}>Блог</NamedLink>
        </div>

        {/* Колонка 3 */}
        <div className={css.column3}>
          <div className={css.frame2}>
            <div className={css.supportTitle}>Связаться с нами:</div>
            <NamedLink name="PrivacyPolicyPage" className={css.btnSupport}>
              <span className={css.btnText}>Telegram-чат</span>
            </NamedLink>
          </div>
          <div className={css.supportNote}>*отвечаем круглосуточно</div>
        </div>

        {/* Разделительная линия */}
        <div className={css.line}></div>

        {/* Нижние строки */}
        <div className={css.bottomRow}>
          <div className={css.copyright}>© {year}. Все права защищены.</div>
          <NamedLink name="PrivacyPolicyPage" className={css.policy}>
            Политика обработки и защиты информации
          </NamedLink>
        </div>
      </div>
    </footer>
  );
};

export default FooterCustom;