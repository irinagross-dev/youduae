import React from 'react';
import { NamedLink } from '../../components';
import css from './LandingPage.module.css';

const LandingHero = () => {
  return (
    <section className={css.heroWrap} aria-labelledby="heroTitle">
      {/* фоновая иллюстрация + подложка */}
      <div className={css.mainBg} />
      <div className={css.illustrationBack} />

      {/* контент слева */}
      <div className={css.hero}>
        <div className={css.heroTexts}>
          <h1 id="heroTitle" className={css.heroTitle}>
            Освободим вас от бытовых забот в ОАЭ
          </h1>
          <p className={css.heroSubtitle}>
            Найдите надежного исполнителя для любой задачи
          </p>

          <div className={css.searchLine}>
            <input
              className={css.searchInput}
              type="text"
              placeholder="Услуга или специалист"
              aria-label="Поиск услуги или специалиста"
            />
            <NamedLink name="SearchPage" className={css.findBtn}>
              Найти
            </NamedLink>
          </div>
        </div>

        {/* преимущества */}
        <div className={css.advantages}>
          <div className={css.advItem}>
            <div className={css.advIcon} />
            <div className={css.advTexts}>
              <div className={css.advTitle}>Специалисты напишут сами</div>
              <div className={css.advDesc}>
                Создайте задание, исполнители увидят его и сами напишут вам, предложив цену
              </div>
            </div>
          </div>

          <div className={css.advItem}>
            <div className={css.advIcon} />
            <div className={css.advTexts}>
              <div className={css.advTitle}>Лучшие мастера и цены</div>
              <div className={css.advDesc}>
                Вы выбираете из предложений, кому доверить вашу задачу
              </div>
            </div>
          </div>

          <div className={css.advItem}>
            <div className={css.advIcon} />
            <div className={css.advTexts}>
              <div className={css.advTitle}>Настоящие отзывы</div>
              <div className={css.advDesc}>
                Отзыв можно оставить только после выполненных работ — мы всё проверяем
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;