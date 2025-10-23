import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { NamedLink, Menu, MenuLabel, MenuContent, MenuItem, Avatar, LanguageSwitcher } from '../../components';
import { useRouteConfiguration } from '../../context/routeConfigurationContext';
import { useConfiguration } from '../../context/configurationContext';
import { pathByRouteName } from '../../util/routes';
import { FormattedMessage } from '../../util/reactIntl';
import { getCurrentUserTypeRoles } from '../../util/userHelpers';
import css from './TopbarCustom.module.css';

/**
 * Кастомный топ-бар без зависимостей от шаблона Sharetribe.
 * Линки:
 *  - логотип -> LandingPage
 *  - "Для специалистов" -> (пока) SearchPage
 *  - "Создать задачу" -> NewListingPage
 *  - "Войти" -> LoginPage (для неавторизованных)
 *  - Меню профиля (для авторизованных)
 *
 * При необходимости просто поменяй name="" на нужные роуты.
 */
const TopbarCustom = (props) => {
  const { isAuthenticated, currentUser, notificationCount = 0, onLogout } = props;
  const history = useHistory();
  const routeConfiguration = useRouteConfiguration();
  const config = useConfiguration();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Определяем роль пользователя
  const userRoles = getCurrentUserTypeRoles(config, currentUser);
  const isCustomer = userRoles.customer && !userRoles.provider;
  const isProvider = userRoles.provider;

  console.log('🔍 TopbarCustom - Auth & Roles:', { 
    isAuthenticated, 
    currentUser: currentUser?.id?.uuid,
    userRoles,
    isCustomer,
    isProvider,
    showManageListings: isProvider
  });

  // Обработчик для кнопки "Войти"
  const handleLoginClick = (e) => {
    e.preventDefault();
    console.log('🔘 Login button clicked!');
    const loginPath = pathByRouteName('LoginPage', routeConfiguration);
    console.log('🔀 Navigating to:', loginPath);
    history.push(loginPath);
  };

  // Обработчик для выхода
  const handleLogout = () => {
    onLogout().then(() => {
      const landingPath = pathByRouteName('LandingPage', routeConfiguration);
      history.push(landingPath);
    });
  };

  // Рендер кнопки входа или меню профиля
  const renderAuthSection = () => {
    if (isAuthenticated && currentUser) {
      // Авторизованный пользователь - показываем меню
      const currentUserName = currentUser.attributes.profile.displayName || 'User';
      
      return (
        <Menu>
          <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
            <Avatar className={css.avatar} user={currentUser} disableProfileLink />
            <span className={css.profileName}>{currentUserName}</span>
          </MenuLabel>
          <MenuContent className={css.profileMenuContent}>
            <MenuItem key="inbox">
              <NamedLink name="InboxPage" params={{ tab: isProvider ? 'sales' : 'orders' }} className={css.menuLink}>
                <FormattedMessage id="TopbarDesktop.inbox" />
              </NamedLink>
            </MenuItem>
            {/* "Мои задания" показываем ТОЛЬКО для Provider (заказчиков), Customer (исполнители) не создают задания */}
            {isProvider && (
              <MenuItem key="manage-listings">
                <NamedLink name="ManageListingsPage" className={css.menuLink}>
                  <FormattedMessage id="TopbarDesktop.yourListingsLink" />
                </NamedLink>
              </MenuItem>
            )}
            <MenuItem key="profile">
              <NamedLink name="ProfilePage" params={{ id: currentUser.id.uuid }} className={css.menuLink}>
                <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
              </NamedLink>
            </MenuItem>
            <MenuItem key="account">
              <NamedLink name="ContactDetailsPage" className={css.menuLink}>
                <FormattedMessage id="TopbarDesktop.accountSettingsLink" />
              </NamedLink>
            </MenuItem>
            <MenuItem key="logout">
              <button className={css.logoutButton} onClick={handleLogout}>
                <FormattedMessage id="TopbarDesktop.logout" />
              </button>
            </MenuItem>
          </MenuContent>
        </Menu>
      );
    } else {
      // Не авторизован - показываем кнопку "Войти"
      return (
        <button 
          type="button"
          className={css.enterBtn}
          onClick={handleLoginClick}
        >
          <FormattedMessage id="TopbarDesktop.login" defaultMessage="Войти" />
        </button>
      );
    }
  };

  return (
    <header className={css.wrapper}>
      <div className={css.container}>
        {/* Левая секция: только Логотип */}
        <div className={css.leftSection}>
          <NamedLink name="LandingPage" className={css.logoLink} aria-label="На главную">
            <div className={css.logoBox}>
              <div className={css.logoBadge}>
                {/* Временный SVG-логотип. Замените на свое изображение через background-image в CSS */}
                <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
                  <rect width="60" height="60" rx="15" fill="#FFFFFF"/>
                  <text x="10" y="38" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="700" fill="#BADEEF">Y</text>
                  <text x="28" y="38" fontFamily="Arial, sans-serif" fontSize="32" fontWeight="700" fill="#BADEEF">D</text>
                </svg>
              </div>
              <span className={css.logoText}>YouDu</span>
            </div>
          </NamedLink>
        </div>

        {/* Правая секция: единый блок с навигацией */}
        {isAuthenticated ? (
          /* Для авторизованных: разные кнопки для Customer и Provider */
          <nav className={css.rightSection} aria-label="Главная навигация">
            {isCustomer ? (
              /* Для Customer */
              <>
                <NamedLink name="SearchPage" className={css.navLinkUnified}>
                  <FormattedMessage id="TopbarDesktop.findTasks" defaultMessage="Найти задания" />
                </NamedLink>
                <NamedLink 
                  name="ProfilePage" 
                  params={{ id: currentUser?.id?.uuid }} 
                  className={css.navLinkUnified}
                >
                  <FormattedMessage id="TopbarDesktop.myReviews" defaultMessage="Мои отзывы" />
                </NamedLink>
                <NamedLink name="InboxPage" params={{ tab: 'orders' }} className={css.navLinkUnified}>
                  <FormattedMessage id="TopbarDesktop.inbox" defaultMessage="Входящие" />
                </NamedLink>
              </>
            ) : (
              /* Для Provider */
              <>
                <NamedLink name="NewListingPage" className={css.navLinkUnified}>
                  <FormattedMessage id="TopbarDesktop.createListing" defaultMessage="Создать задание" />
                </NamedLink>
                <NamedLink name="ManageListingsPage" className={css.navLinkUnified}>
                  <FormattedMessage id="TopbarDesktop.yourListingsLink" defaultMessage="Мои задания" />
                </NamedLink>
                <NamedLink name="InboxPage" params={{ tab: 'sales' }} className={css.navLinkUnified}>
                  <FormattedMessage id="TopbarDesktop.inbox" defaultMessage="Входящие" />
                </NamedLink>
              </>
            )}
            {renderAuthSection()}
            <div className={css.languageSwitcherWrapper}>
              <LanguageSwitcher />
            </div>
          </nav>
        ) : (
          /* Для неавторизованных: старая структура */
          <nav className={css.nav} aria-label="Главная навигация">
            <NamedLink name="SearchPage" className={css.navLink}>
              <FormattedMessage id="TopbarDesktop.forSpecialists" defaultMessage="Для специалистов" />
            </NamedLink>

            <div className={css.rightButtons}>
              <NamedLink name="NewListingPage" className={css.navLink}>
                <FormattedMessage id="TopbarDesktop.createListing" defaultMessage="Создать задание" />
              </NamedLink>
              {renderAuthSection()}
              <div className={css.languageSwitcherWrapper}>
                <LanguageSwitcher />
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default TopbarCustom;

