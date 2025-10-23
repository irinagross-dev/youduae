# Настройка двуязычного маркетплейса

## Реализованные функции

Ваш маркетплейс теперь поддерживает два языка:
- **Русский (RU)** - язык по умолчанию
- **Английский (EN)**

## Как это работает

### 1. Переключатель языка
Переключатель языка (`LanguageSwitcher`) добавлен в:
- **Desktop Topbar** - в правой части навигации
- **Mobile Menu** - внизу меню в footer

### 2. Хранение выбора языка
Выбранный язык сохраняется в `localStorage` браузера под ключом `preferredLanguage`.

### 3. Файлы переводов
- `/src/translations/ru.json` - русский перевод
- `/src/translations/en.json` - английский перевод

### 4. Конфигурация
Настройка выполнена в следующих файлах:
- `/src/config/configDefault.js` - загрузка правильного языка из localStorage
- `/src/app.js` - загрузка файлов переводов и локали для Moment.js

## Как добавить новые переводы

### Для русского языка:
Редактируйте файл `/src/translations/ru.json`:
```json
{
  "YourComponent.yourKey": "Ваш текст на русском"
}
```

### Для английского языка:
Редактируйте файл `/src/translations/en.json`:
```json
{
  "YourComponent.yourKey": "Your text in English"
}
```

### Использование в компонентах:
```javascript
import { FormattedMessage } from '../../util/reactIntl';

<FormattedMessage id="YourComponent.yourKey" />
```

## Важные моменты

1. **Перезагрузка страницы**: При смене языка страница автоматически перезагружается для применения изменений.

2. **Язык по умолчанию**: Если пользователь не выбрал язык, используется русский.

3. **Момент.js**: Библиотека Moment.js автоматически переключается между русской и английской локалями для форматирования дат.

4. **Синхронизация**: Убедитесь, что все ключи переводов существуют в обоих файлах (ru.json и en.json).

## Проверка работы

1. Откройте сайт - должен отображаться русский язык
2. Нажмите "EN" в переключателе - страница перезагрузится на английском
3. Нажмите "RU" - вернётся русский язык
4. Закройте и откройте браузер - выбранный язык должен сохраниться

## Стилизация переключателя

Стили находятся в:
- `/src/components/LanguageSwitcher/LanguageSwitcher.module.css` - основные стили
- `/src/containers/TopbarContainer/Topbar/TopbarMobileMenu/TopbarMobileMenu.module.css` - стили для мобильной версии

## Добавление третьего языка

Если нужно добавить ещё один язык (например, арабский):

1. Создайте файл `/src/translations/ar.json`
2. Добавьте кнопку в `LanguageSwitcher.js`:
   ```javascript
   <button
     className={`${css.languageButton} ${currentLanguage === 'ar' ? css.active : ''}`}
     onClick={() => handleLanguageChange('ar')}
     aria-label="العربية"
   >
     AR
   </button>
   ```
3. Добавьте импорт в `configDefault.js` и `app.js`
4. Импортируйте локаль для Moment: `import 'moment/locale/ar';`

