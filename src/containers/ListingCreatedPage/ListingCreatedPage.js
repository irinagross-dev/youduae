import React from 'react';
import { FormattedMessage } from '../../util/reactIntl';
import { Page, LayoutSingleColumn, PrimaryButton, IconSuccess, NamedLink } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import css from './ListingCreatedPage.module.css';

const ListingCreatedPage = () => {
  const title = 'Задание создано!';

  return (
    <Page title={title} scrollingDisabled={false}>
      <LayoutSingleColumn
        topbar={<TopbarContainer />}
        footer={<FooterContainer />}
      >
        <div className={css.root}>
          <div className={css.content}>
            {/* Success Icon */}
            <div className={css.iconWrapper}>
              <IconSuccess className={css.icon} />
            </div>
            
            {/* Main Title */}
            <h1 className={css.title}>
              Ваше задание успешно создано! 🎉
            </h1>
            
            {/* Moderation Notice */}
            <div className={css.moderationNotice}>
              <div className={css.moderationIcon}>⏳</div>
              <div className={css.moderationText}>
                <h3>Задание отправлено на модерацию</h3>
                <p>
                  Пожалуйста, дождитесь одобрения публикации задания на нашем сайте после модерации.
                  Обычно это занимает не более 24 часов.
                </p>
              </div>
            </div>
            
            {/* Info Box */}
            <div className={css.infoBox}>
              <div className={css.infoIcon}>💡</div>
              <div className={css.infoContent}>
                <p className={css.infoTitle}>Где найти мои задания?</p>
                <p className={css.infoDescription}>
                  Все ваши задания находятся в личном кабинете - <strong>"Мои задания"</strong>
                </p>
              </div>
            </div>

            {/* Success Steps */}
            <div className={css.successSteps}>
              <div className={css.step}>
                <div className={css.stepNumber}>✓</div>
                <div className={css.stepContent}>
                  <h4>Регистрация завершена</h4>
                  <p>Ваш аккаунт успешно создан</p>
                </div>
              </div>
              <div className={css.step}>
                <div className={css.stepNumber}>✓</div>
                <div className={css.stepContent}>
                  <h4>Задание создано</h4>
                  <p>Все данные сохранены</p>
                </div>
              </div>
              <div className={css.step}>
                <div className={css.stepNumber}>⏳</div>
                <div className={css.stepContent}>
                  <h4>Ожидает модерацию</h4>
                  <p>Скоро будет опубликовано</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={css.actions}>
              <NamedLink 
                name="ManageListingsPage"
                className={css.primaryButton}
              >
                <PrimaryButton>
                  Перейти в "Мои задания"
                </PrimaryButton>
              </NamedLink>
              
              <NamedLink 
                name="LandingPage" 
                className={css.secondaryLink}
              >
                Вернуться на главную
              </NamedLink>
            </div>
          </div>
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

export default ListingCreatedPage;

