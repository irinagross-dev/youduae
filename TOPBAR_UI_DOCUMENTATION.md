# 📐 Документация UI Топбара (Topbar) - Полная инструкция для дизайнера

## 📋 Содержание
1. [Обзор структуры](#обзор-структуры)
2. [Архитектура компонентов](#архитектура-компонентов)
3. [TopbarCustom (Кастомный топбар)](#topbarcustom)
4. [TopbarDesktop (Стандартный десктоп)](#topbardesktop)
5. [TopbarMobileMenu (Мобильное меню)](#topbarmobilemenu)
6. [CSS коды и стили](#css-коды-и-стили)
7. [JavaScript логика](#javascript-логика)
8. [Состояния интерфейса](#состояния-интерфейса)
9. [Адаптивность](#адаптивность)
10. [Цветовая палитра](#цветовая-палитра)

---

## 🏗 Обзор структуры

### Основные компоненты топбара:

```
Топбар (Topbar)
├── TopbarCustom (Кастомная версия - используется сейчас)
│   ├── Левая секция: Логотип
│   └── Правая секция: Навигация + Авторизация
│
├── TopbarDesktop (Стандартная версия для десктопа)
│   ├── Левая секция: Логотип
│   └── Правая секция: Ссылки + Профиль
│
└── TopbarMobileMenu (Мобильное меню)
    ├── Аватар пользователя
    ├── Навигационные ссылки
    └── Футер с языковым переключателем
```

### Файловая структура:
```
src/containers/
├── TopbarCustom/
│   ├── TopbarCustom.js          (Кастомный компонент)
│   └── TopbarCustom.module.css  (Стили кастомного топбара)
│
└── TopbarContainer/Topbar/
    ├── Topbar.js                        (Основной контейнер)
    ├── Topbar.module.css                (Базовые стили)
    ├── TopbarDesktop/
    │   ├── TopbarDesktop.js             (Десктопная версия)
    │   └── TopbarDesktop.module.css     (Стили десктопа)
    └── TopbarMobileMenu/
        ├── TopbarMobileMenu.js          (Мобильное меню)
        └── TopbarMobileMenu.module.css  (Стили мобильного меню)
```

---

## 🎨 TopbarCustom

### Описание
**TopbarCustom** — кастомная версия топбара без зависимостей от шаблона Sharetribe. Используется в проекте YouDo.

### Структура макета (из Figma):

```
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═══════════════╗  ╔═══════════════════════════════════════════╗   │
│  ║   Логотип     ║  ║  Навигация + Кнопки + Профиль + Язык     ║   │
│  ╚═══════════════╝  ╚═══════════════════════════════════════════╝   │
└─────────────────────────────────────────────────────────────────────┘
```

### Визуальные элементы:

#### 1. **Левая секция (logopart)**
- **Размер**: `146px × 78px`
- **Фон**: `#F7F7F7`
- **Скругление**: `25px`
- **Тень**: `0px 4px 10px rgba(0, 0, 0, 0.1)`
- **Содержимое**: 
  - Логотип (60×60px, SVG или PNG)
  - Текст "YouDu" (Inter, 700, 16px)

#### 2. **Правая секция (buttonpart)**
- **Размер**: `flex: 1 × 78px`
- **Фон**: `#F7F7F7`
- **Скругление**: `25px`
- **Тень**: `0px 4px 10px rgba(0, 0, 0, 0.1)`
- **Содержимое** (для неавторизованных):
  - "Для специалистов" (серая ссылка)
  - "Создать задание" (черная ссылка)
  - "Войти" (желтая кнопка)
  - Переключатель языков

### CSS Код (TopbarCustom.module.css):

```css
/* === ОБЩЕЕ ОФОРМЛЕНИЕ ХЕДЕРА === */
.wrapper {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: transparent;
  pointer-events: none; /* Отключаем события на обертке */
}

.container {
  box-sizing: border-box;
  max-width: 1200px;
  height: 90px;
  margin: 0 auto;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 19px;
  pointer-events: auto; /* Включаем события на контейнере */
}

/* === ЛЕВАЯ СЕКЦИЯ (только логотип) === */
.leftSection {
  display: flex;
  align-items: center;
}

/* === ЛОГО === */
.logoLink {
  text-decoration: none;
  pointer-events: auto;
}

.logoBox {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 78px;
  padding: 9px 10px;
  background: #f7f7f7;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.logoBadge {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 15px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1));
  overflow: hidden;
  /* Для использования своего изображения: */
  background: url('../../assets/Logo.png') center center / cover no-repeat;
}

.logoText {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  color: #000;
  transition: color 0.2s ease;
}

/* === ПРАВАЯ СЕКЦИЯ (единый блок для авторизованных) === */
.rightSection {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 15px;
  padding: 9px 10px;
  height: 78px;
  background: #F7F7F7;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  border-radius: 25px;
  pointer-events: auto;
}

/* === ССЫЛКИ ВНУТРИ ЕДИНОГО БЛОКА (без фона) === */
.navLinkUnified {
  display: inline-flex;
  align-items: center;
  height: 60px;
  padding: 0 20px;
  color: #000;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  background: transparent;
  border-radius: 15px;
  transition: background-color 0.2s ease, color 0.2s ease;
  pointer-events: auto;
  cursor: pointer;
}

.navLinkUnified:hover {
  background: #EFEFEF;
  text-decoration: none;
  color: #000;
}

/* === КНОПКА ВОЙТИ === */
.enterBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  padding: 20px 28px;
  text-decoration: none;
  border: none;
  
  background: #FFC934;
  color: #000;
  border-radius: 25px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.02s ease;
  cursor: pointer;
  pointer-events: auto;
  position: relative;
  z-index: 10;
}

.enterBtn:hover {
  background: #000000;
  color: #ffffff;
  text-decoration: none;
}

.enterBtn:active {
  transform: scale(0.98);
}

/* === МЕНЮ ПРОФИЛЯ (для авторизованных пользователей) === */
.profileMenuLabel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  height: 60px;
  cursor: pointer;
  background: transparent;
  border-radius: 15px;
  transition: background-color 0.2s ease;
}

.profileMenuLabel:hover {
  background: #EFEFEF;
}

.profileMenuIsOpen {
  background: #E5E5E5;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.profileName {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: #000;
}

/* === ПЕРЕКЛЮЧАТЕЛЬ ЯЗЫКОВ === */
.languageSwitcherWrapper {
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 10px;
}

/* Вертикальное отображение переключателя */
.languageSwitcherWrapper :global(div) {
  flex-direction: column !important;
  gap: 4px !important;
  padding: 6px 8px !important;
  background-color: transparent !important;
  height: auto !important;
}

.languageSwitcherWrapper :global(button) {
  font-size: 13px !important;
  padding: 4px 8px !important;
  font-weight: 600 !important;
  line-height: 1.2 !important;
  min-width: auto !important;
}

/* === АДАПТИВНОСТЬ === */
@media (max-width: 768px) {
  .container {
    height: auto;
    padding: 8px;
  }
  
  .logoBox,
  .nav {
    height: auto;
  }
  
  .navLink,
  .enterBtn {
    height: 48px;
  }
}
```

### JavaScript логика (TopbarCustom.js):

```javascript
// Определение роли пользователя
const userRoles = getCurrentUserTypeRoles(config, currentUser);
const isCustomer = userRoles.customer && !userRoles.provider;
const isProvider = userRoles.provider;

// Рендер секции авторизации
const renderAuthSection = () => {
  if (isAuthenticated && currentUser) {
    // Авторизованный пользователь - показываем меню профиля
    return (
      <Menu>
        <MenuLabel className={css.profileMenuLabel}>
          <Avatar user={currentUser} />
          <span className={css.profileName}>{currentUserName}</span>
        </MenuLabel>
        <MenuContent className={css.profileMenuContent}>
          <MenuItem><Link to="/inbox">Входящие</Link></MenuItem>
          <MenuItem><Link to="/manage-listings">Мои задания</Link></MenuItem>
          <MenuItem><Link to="/profile">Профиль</Link></MenuItem>
          <MenuItem><Link to="/account">Настройки</Link></MenuItem>
          <MenuItem><button onClick={handleLogout}>Выход</button></MenuItem>
        </MenuContent>
      </Menu>
    );
  } else {
    // Не авторизован - показываем кнопку "Войти"
    return (
      <button className={css.enterBtn} onClick={handleLoginClick}>
        Войти
      </button>
    );
  }
};

// Разные кнопки для Customer и Provider
{isAuthenticated ? (
  <nav className={css.rightSection}>
    {isCustomer ? (
      // Для Customer (исполнителей)
      <>
        <Link to="/search">Найти задания</Link>
        <Link to="/profile">Мои отзывы</Link>
        <Link to="/inbox">Входящие</Link>
      </>
    ) : (
      // Для Provider (заказчиков)
      <>
        <Link to="/new-listing">Создать задание</Link>
        <Link to="/manage-listings">Мои задания</Link>
        <Link to="/inbox">Входящие</Link>
      </>
    )}
    {renderAuthSection()}
    <LanguageSwitcher />
  </nav>
) : (
  // Для неавторизованных
  <nav className={css.nav}>
    <Link to="/search">Для специалистов</Link>
    <div className={css.rightButtons}>
      <Link to="/new-listing">Создать задание</Link>
      {renderAuthSection()}
      <LanguageSwitcher />
    </div>
  </nav>
)}
```

---

## 💻 TopbarDesktop

### Описание
Стандартная версия топбара для десктопных устройств (>1024px).

### Структура:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ╔═════════╗  ╔════════════════════════════════════════════════╗    │
│  ║ Логотип ║  ║ Навигация | Профиль | Уведомления | Аватар   ║    │
│  ╚═════════╝  ╚════════════════════════════════════════════════╝    │
└─────────────────────────────────────────────────────────────────────┘
```

### Визуальные элементы:

#### Левая секция (leftSection)
- **Размер**: `146px × 78px`
- **Padding**: `9px 10px`
- **Gap**: `15px`
- **Фон**: `#F7F7F7`
- **Скругление**: `25px`
- **Тень**: `0px 4px 10px rgba(0, 0, 0, 0.1)`

#### Правая секция (rightSection)
- **Размер**: `flex: 1 × 78px`
- **Padding**: `9px 10px`
- **Gap**: `15px`
- **Justify**: `space-between`
- **Фон**: `#F7F7F7`
- **Скругление**: `25px`

### CSS Код (TopbarDesktop.module.css):

```css
/* Desktop - новый дизайн из Figma */
.root {
  width: 100%;
  max-width: 1200px;
  height: var(--topbarHeightDesktop);
  margin: 0 auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  gap: 19px;
  background-color: transparent;
  box-shadow: none;
}

/* Левая секция (logopart) */
.leftSection {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 9px 10px;
  gap: 15px;
  width: 146px;
  height: 78px;
  background: #F7F7F7;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  flex-shrink: 0;
}

/* Правая секция (buttonpart) */
.rightSection {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 9px 10px;
  gap: 15px;
  flex: 1;
  height: 78px;
  background: #F7F7F7;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
}

/* Обычные ссылки топбара */
.topbarLink {
  flex-shrink: 0;
  border: none;
  background: none;
  transition: all 0.2s ease;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  color: #000000;
  display: flex;
  align-items: center;
  height: auto;
  padding: 0;
  margin: 0;
  text-decoration: none;
}

.topbarLink:hover {
  color: #000000;
  opacity: 0.8;
  text-decoration: none;
}

/* Ссылка "Для специалистов" - серым цветом */
.forSpecialistsLink {
  composes: topbarLink;
  color: #909090;
}

.forSpecialistsLink:hover {
  color: #606060;
}

/* Желтая кнопка "Войти" из Figma */
.loginButton {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 28px;
  gap: 15px;
  height: 60px;
  background: #FFC934;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: -0.03em;
  color: #000000;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.loginButton:hover {
  background: #FFD34A;
  transform: translateY(-1px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  text-decoration: none;
  color: #000000;
}

.loginButton:active {
  transform: translateY(0);
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.1);
}

/* Бейдж с уведомлениями */
.notificationBadge {
  position: relative;
  display: inline-block;
  margin-left: 6px;
  vertical-align: middle;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  padding: 2px 4px;
  font-size: 11px;
  line-height: 12px;
}

/* Меню профиля */
.profileMenuLabel {
  border-bottom: 0px solid;
  transition: var(--transitionStyleButton);
  font-weight: var(--fontWeightMedium);
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0;
  color: var(--colorGrey700);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  height: 100%;
  margin: 0;
  padding: 0 12px 0 12px;
}

.profileMenuLabel:hover {
  border-bottom: 4px solid var(--marketplaceColor);
  border-radius: 0;
  text-decoration: none;
}

.avatar {
  margin: 16px 0;
}

.profileMenuContent {
  min-width: 276px;
  padding-top: 20px;
  z-index: 1000;
}

/* Ссылки в меню профиля */
.menuLink {
  position: relative;
  display: block;
  width: 100%;
  min-width: 276px;
  margin: 0;
  padding: 4px 24px;
  color: var(--colorGrey700);
  text-align: left;
  transition: var(--transitionStyleButton);
}

.menuLink:hover {
  color: var(--colorBlack);
  text-decoration: none;
}

/* Кнопка выхода */
.logoutButton {
  display: inline;
  text-decoration: none;
  font-weight: var(--fontWeightMedium);
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0;
  position: relative;
  width: 100%;
  min-width: 276px;
  margin: 0;
  padding: 20px 24px;
  color: var(--colorGrey300);
  text-align: left;
  white-space: nowrap;
  transition: var(--transitionStyleButton);
  border: none;
  border-top: 1px solid var(--colorGrey100);
}

.logoutButton:hover {
  cursor: pointer;
  color: var(--colorBlack);
  text-decoration: none;
}
```

### JavaScript логика (TopbarDesktop.js):

```javascript
// Определение ролей пользователя
const userRoles = getCurrentUserTypeRoles(config, currentUser);
const isOnlyCustomer = userRoles.customer && !userRoles.provider;

// Ссылка "Найти задания" для Customer
const searchLinkForCustomer = authenticatedOnClientSide && isOnlyCustomer 
  ? <SearchLink /> 
  : null;

// Ссылка "Найти задания" для неавторизованных
const searchLinkForGuest = !isAuthenticatedOrJustHydrated 
  ? <SearchLink /> 
  : null;

// Итоговая ссылка поиска
const searchLinkMaybe = searchLinkForCustomer || searchLinkForGuest;

// Ссылка на вход для неавторизованных
const loginLinkMaybe = isAuthenticatedOrJustHydrated 
  ? null 
  : <LoginLink />;

// Ссылка "Входящие" с уведомлениями
const inboxLinkMaybe = authenticatedOnClientSide ? (
  <InboxLink 
    notificationCount={notificationCount} 
    inboxTab={inboxTab} 
  />
) : null;

// Меню профиля для авторизованных
const profileMenuMaybe = authenticatedOnClientSide ? (
  <ProfileMenu
    currentPage={currentPage}
    currentUser={currentUser}
    onLogout={onLogout}
    showManageListingsLink={showCreateListingsLink}
    inboxTab={inboxTab}
  />
) : null;

// Структура топбара
return (
  <nav className={css.root}>
    {/* Левая часть: ТОЛЬКО логотип */}
    <div className={css.leftSection}>
      <LinkedLogo layout="desktop" />
    </div>

    {/* Правая часть: навигация + авторизация */}
    <div className={css.rightSection}>
      <ForSpecialistsLink />
      <CustomLinksMenu />
      {loginLinkMaybe}
    </div>
  </nav>
);
```

---

## 📱 TopbarMobileMenu

### Описание
Мобильное меню, которое открывается через гамбургер-икону (для устройств <1024px).

### Структура:

```
┌─────────────────────────────────┐
│  ╔══════════════════════════╗   │
│  ║  Аватар                  ║   │
│  ║  Имя пользователя        ║   │
│  ║  Кнопка "Выход"          ║   │
│  ╠══════════════════════════╣   │
│  ║  • Входящие [badge]      ║   │
│  ║  • Мои задания           ║   │
│  ║  • Настройки профиля     ║   │
│  ║  • Настройки аккаунта    ║   │
│  ╠══════════════════════════╣   │
│  ║  Кастомные ссылки        ║   │
│  ╚══════════════════════════╝   │
│  ┌──────────────────────────┐   │
│  │ [Создать задачу]         │   │
│  │ Переключатель языков     │   │
│  └──────────────────────────┘   │
└─────────────────────────────────┘
```

### Визуальные элементы:

#### Аватар
- **Размер**: Большой аватар (определен в компоненте `AvatarLarge`)
- **Margin**: `var(--TopbarMobileMenu_topMargin) 0 0 0`

#### Приветствие
- **Шрифт**: Black, 24px (mobile) / 40px (tablet)
- **Цвет**: По умолчанию
- **Margin**: `16px 0 0 0` (mobile) / `24px 0 0 0` (tablet)

#### Навигационные ссылки
- **Шрифт**: Bold, 21px (mobile) / 30px (tablet)
- **Цвет**: `var(--marketplaceColor)`
- **Padding**: `4px 0 2px 0`
- **Margin**: `24px 0 18px 0` (mobile)

### CSS Код (TopbarMobileMenu.module.css):

```css
.root {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  height: auto;
}

.content {
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.accountLinksWrapper,
.customLinksWrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.accountLinksWrapper {
  margin-bottom: 36px;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  padding: 24px;
  background-color: var(--colorWhite);
  box-shadow: var(--boxShadowTop);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.languageSwitcherWrapper {
  display: flex;
  justify-content: center;
  padding-top: 12px;
  border-top: 1px solid var(--colorGrey100);
}

.avatar {
  flex-shrink: 0;
  margin: var(--TopbarMobileMenu_topMargin) 0 0 0;
}

.greeting {
  font-weight: var(--fontWeightBlack);
  font-size: 24px;
  line-height: 24px;
  padding: 3px 0 3px 0;
  margin-bottom: 1px;
  margin-top: 16px;
}

@media (--viewportMedium) {
  .greeting {
    font-size: 40px;
    line-height: 56px;
    padding: 5px 0 3px 0;
    margin-top: 24px;
  }
}

.logoutButton {
  display: inline;
  border: none;
  text-decoration: none;
  font-weight: var(--fontWeightSemiBold);
  font-size: 18px;
  line-height: 24px;
  color: var(--colorGrey300);
  width: initial;
  margin: 4px 0 24px 0;
  padding: 0;
}

.logoutButton:hover {
  text-decoration: underline;
  cursor: pointer;
}

.customLinkFont {
  font-weight: var(--fontWeightBold);
  font-size: 21px;
  line-height: 24px;
  padding: 4px 0 2px 0;
  margin-top: 24px;
  margin-bottom: 18px;
}

@media (--viewportMedium) {
  .customLinkFont {
    font-size: 30px;
    line-height: 40px;
    padding: 1px 0 7px 0;
  }
}

.inbox {
  composes: customLinkFont;
  color: var(--marketplaceColor);
  position: relative;
  margin-top: auto;
  margin-bottom: 13px;
}

.navigationLink {
  composes: customLinkFont;
  color: var(--marketplaceColor);
  margin-top: 0;
  margin-bottom: 11px;
}

.currentPageLink {
  color: var(--marketplaceColorDark);
}

.notificationBadge {
  position: absolute;
  top: 4px;
  right: -26px;
}

.notificationBadge:hover {
  text-decoration: none;
}

.createNewListingLink {
  composes: buttonPrimary from global;
}

.authenticationGreeting {
  composes: h1 from global;
  margin-bottom: 48px;
  margin-top: var(--TopbarMobileMenu_topMargin);
}

.authenticationLinks {
  white-space: nowrap;
}

.signupLink,
.loginLink {
  text-decoration: none;
  white-space: nowrap;
  color: var(--marketplaceColor);
}

.currentPage {
  color: var(--colorBlack);
  border-left: 5px solid black;
  margin-left: -24px;
  padding-left: 19px;
}

.spacer {
  width: 100%;
  height: 124px;
}
```

### JavaScript логика (TopbarMobileMenu.js):

```javascript
// Для неавторизованных пользователей
if (!isAuthenticated) {
  return (
    <nav className={css.root}>
      <div className={css.content}>
        <div className={css.authenticationGreeting}>
          <FormattedMessage id="TopbarMobileMenu.unauthorizedGreeting" />
        </div>
        
        <div className={css.customLinksWrapper}>
          <NamedLink name="NewListingPage">
            Создать задачу
          </NamedLink>
          <NamedLink name="SearchPage">
            Найти задания
          </NamedLink>
          {extraLinks}
          <NamedLink name="LoginPage">
            Войти
          </NamedLink>
        </div>
      </div>
      
      <div className={css.footer}>
        {createListingsLinkMaybe}
        <LanguageSwitcher />
      </div>
    </nav>
  );
}

// Для авторизованных пользователей
return (
  <div className={css.root}>
    <AvatarLarge user={currentUser} />
    <div className={css.content}>
      <span className={css.greeting}>
        Привет, {displayName}!
      </span>
      <InlineTextButton onClick={onLogout}>
        Выход
      </InlineTextButton>
      
      <div className={css.accountLinksWrapper}>
        <NamedLink name="InboxPage" params={{ tab: inboxTab }}>
          Входящие {notificationCountBadge}
        </NamedLink>
        {manageListingsLinkMaybe}
        <NamedLink name="ProfileSettingsPage">
          Настройки профиля
        </NamedLink>
        <NamedLink name="AccountSettingsPage">
          Настройки аккаунта
        </NamedLink>
      </div>
      
      <div className={css.customLinksWrapper}>
        {extraLinks}
      </div>
    </div>
    
    <div className={css.footer}>
      {createListingsLinkMaybe}
      <LanguageSwitcher />
    </div>
  </div>
);
```

---

## 🎭 Состояния интерфейса

### 1. **Неавторизованный пользователь (Guest)**

**Desktop:**
```
[Логотип] [Для специалистов] [Создать задание] [Войти (желтая)] [RU/EN]
```

**Mobile (меню):**
```
Привет!
• Создать задачу
• Найти задания
• Войти
─────────────
[Создать задачу]
RU/EN
```

### 2. **Customer (Исполнитель)**

**Desktop:**
```
[Логотип] [Найти задания] [Мои отзывы] [Входящие] [Аватар ▼] [RU/EN]
```

**Mobile (меню):**
```
[Аватар]
Привет, Иван!
Выход
• Входящие [3]
• Настройки профиля
• Настройки аккаунта
─────────────
[Создать задачу]
RU/EN
```

### 3. **Provider (Заказчик)**

**Desktop:**
```
[Логотип] [Создать задание] [Мои задания] [Входящие] [Аватар ▼] [RU/EN]
```

**Mobile (меню):**
```
[Аватар]
Привет, Мария!
Выход
• Входящие
• Мои задания
• Настройки профиля
• Настройки аккаунта
─────────────
RU/EN
```

---

## 📐 Адаптивность

### Точки останова (Breakpoints):

```css
/* Мобильные устройства */
@media (max-width: 768px) {
  /* Уменьшенные размеры */
}

/* Планшеты */
@media (min-width: 769px) and (max-width: 1023px) {
  /* Средние размеры */
}

/* Мобильный топбар (гамбургер меню) */
@media (max-width: 1023px) {
  .container { display: flex; }
  .desktop { display: none; }
}

/* Десктопный топбар */
@media (min-width: 1024px) {
  .container { display: none; }
  .desktop { display: block; }
}
```

### Изменения на мобильных:

1. **Высота контейнера**: `height: auto` вместо `90px`
2. **Padding**: `8px` вместо `6px 10px`
3. **Высота кнопок**: `48px` вместо `60px`
4. **Гамбургер-меню**: Появляется вместо полного топбара
5. **Gap**: `20px` вместо `19px`

---

## 🎨 Цветовая палитра

### Основные цвета:

```css
/* Фоны */
--background-main: #F7F7F7;        /* Фон блоков топбара */
--background-hover: #EFEFEF;       /* Фон при наведении */
--background-active: #E5E5E5;      /* Фон при активном состоянии */

/* Текст */
--text-primary: #000000;           /* Основной текст */
--text-secondary: #909090;         /* Вторичный текст */
--text-hover: #606060;             /* Текст при наведении */
--text-light: var(--colorGrey300); /* Светлый текст (Выход) */
--text-dark: var(--colorGrey700);  /* Темный текст */

/* Акценты */
--accent-yellow: #FFC934;          /* Желтая кнопка "Войти" */
--accent-yellow-hover: #FFD34A;    /* Желтая кнопка при наведении */
--accent-black: #000000;           /* Черная кнопка при hover */
--accent-white: #FFFFFF;           /* Белый текст на черном фоне */

/* Прочее */
--shadow: 0 4px 10px rgba(0, 0, 0, 0.1);  /* Тень блоков */
--border-color: var(--colorGrey100);      /* Цвет границ */
--notification-color: var(--colorFail);   /* Красный для уведомлений */
--marketplace-color: var(--marketplaceColor); /* Цвет маркетплейса */
```

### Применение цветов:

| Элемент | Цвет | Использование |
|---------|------|---------------|
| Фон блоков | `#F7F7F7` | Логотип, навигация |
| Основной текст | `#000000` | Ссылки, названия |
| Вторичный текст | `#909090` | "Для специалистов" |
| Кнопка "Войти" | `#FFC934` | Акцентная кнопка |
| Hover (кнопка) | `#000000` | Черный фон |
| Hover (ссылка) | `#EFEFEF` | Светло-серый фон |
| Тень | `rgba(0,0,0,0.1)` | Все блоки |

---

## 🔧 Технические детали

### z-index иерархия:

```css
.wrapper { z-index: 1000; }           /* Основная обертка */
.enterBtn { z-index: 10; }            /* Кнопка "Войти" */
.profileMenuContent { z-index: 1000; } /* Выпадающее меню */
```

### pointer-events:

```css
.wrapper { pointer-events: none; }    /* Отключаем на обертке */
.container { pointer-events: auto; }  /* Включаем на контейнере */
.navLink { pointer-events: auto; }    /* Включаем на ссылках */
```

### Transitions:

```css
/* Быстрые переходы (кнопки) */
transition: all 0.2s ease;

/* Трансформации */
transition: background-color 0.2s ease, color 0.2s ease, transform 0.02s ease;

/* Анимация уведомлений */
animation-name: notificationPop;
animation-duration: 0.1s;
animation-delay: 0.1s;
```

---

## 📝 Контрольный список для дизайнера

### ✅ Что учитывать при изменении дизайна:

- [ ] **Sticky positioning**: Топбар всегда остается сверху
- [ ] **Max-width**: Контейнер ограничен `1200px`
- [ ] **Gaps**: Расстояние между элементами `15-19px`
- [ ] **Border-radius**: Скругления `15px` (элементы), `25px` (блоки)
- [ ] **Shadows**: Единообразные тени `0 4px 10px rgba(0,0,0,0.1)`
- [ ] **Font**: Inter, 700 (bold), 16px, -0.03em letter-spacing
- [ ] **Heights**: 60px (кнопки), 78px (блоки), 90px (контейнер)
- [ ] **Hover states**: Изменение фона/цвета при наведении
- [ ] **Active states**: Transform scale при клике
- [ ] **Accessibility**: Focus states с outline
- [ ] **Responsive**: Адаптация для <1024px

### 🎯 Ключевые метрики:

```
Container:    1200px max-width, 90px height
Logo block:   146px × 78px
Nav block:    flex: 1 × 78px
Gap:          19px (между блоками), 15px (внутри)
Buttons:      60px height, 25px border-radius
Links:        60px height, 15px border-radius
Font:         Inter 700, 16px, -0.03em
Shadows:      0 4px 10px rgba(0,0,0,0.1)
```

---

## 📚 Дополнительные компоненты

### LinkedLogo
Отображает логотип с ссылкой на главную страницу.

**Пропсы:**
- `layout`: `'mobile'` или `'desktop'`
- `alt`: Альтернативный текст
- `linkToExternalSite`: Внешняя ссылка (опционально)

### Avatar / AvatarLarge
Отображает аватар пользователя.

**Пропсы:**
- `user`: Объект пользователя
- `disableProfileLink`: Отключить ссылку на профиль

### NotificationBadge
Отображает бейдж с количеством уведомлений.

**Пропсы:**
- `count`: Количество уведомлений
- `className`: Дополнительные CSS классы

### LanguageSwitcher
Переключатель языков (RU/EN).

### Menu / MenuLabel / MenuContent / MenuItem
Компоненты для создания выпадающих меню.

---

## 🔗 Полезные ссылки

- [Figma дизайн](https://www.figma.com) (замените на вашу ссылку)
- [Sharetribe Documentation](https://www.sharetribe.com/docs/)
- [Inter Font](https://fonts.google.com/specimen/Inter)
- [CSS Custom Media Queries](./src/styles/customMediaQueries.css)

---

## 📞 Контакты

Если возникли вопросы по топбару:
1. Проверьте код в `src/containers/TopbarCustom/`
2. Изучите стили в `TopbarCustom.module.css`
3. Протестируйте на разных разрешениях экрана

---

**Версия документации:** 1.0  
**Дата:** Октябрь 2025  
**Проект:** YouDo Marketplace



