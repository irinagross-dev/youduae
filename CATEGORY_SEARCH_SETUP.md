# Настройка поиска по категориям на главной странице

## Что было реализовано

Вместо Google Places поиска по местоположению на главной странице теперь отображается список категорий услуг. При клике на категорию пользователь перенаправляется на страницу создания нового листинга с предвыбранной категорией.

## Категории услуг

На главной странице доступны следующие категории:

1. **Ремонт и строительство** (`repair-construction`)
2. **Курьерские услуги** (`courier-services`)
3. **Уборка и помощь в доме** (`cleaning-home-help`)
4. **Грузоперевозки** (`cargo-transport`)
5. **Установка бытовой техники** (`appliance-installation`)
6. **Красота и здоровье** (`beauty-health`)
7. **Фото, видео, аудио** (`photo-video-audio`)
8. **Ремонт цифровой техники** (`digital-tech-repair`)
9. **Юридическая и бухгалтерская помощь** (`legal-accounting`)
10. **Репетиторы и обучение** (`tutoring-education`)
11. **Автомобильные услуги** (`automotive-services`)

## Созданные компоненты

### 1. CategoryList
**Файл:** `/src/containers/PageBuilder/Primitives/SearchCTA/CategoryList/CategoryList.js`

Компонент отображает выпадающий список категорий. При клике на категорию:
- Пользователь перенаправляется на страницу создания листинга
- Категория передается как query параметр `?category=<category-id>`

### 2. FilterCategory
**Файл:** `/src/containers/PageBuilder/Primitives/SearchCTA/FilterCategory/FilterCategory.js`

Компонент поля поиска, который:
- Отображает кликабельное поле с текстом "Выберите категорию услуги..."
- При клике показывает/скрывает список категорий
- Закрывается при клике вне компонента

### 3. Стили
- `/src/containers/PageBuilder/Primitives/SearchCTA/CategoryList/CategoryList.module.css`
- `/src/containers/PageBuilder/Primitives/SearchCTA/FilterCategory/FilterCategory.module.css`

## Измененные файлы

### SearchCTA.js
**Файл:** `/src/containers/PageBuilder/Primitives/SearchCTA/SearchCTA.js`

Заменен `FilterLocation` на `FilterCategory` в рендере поисковой строки.

### Переводы
Добавлены ключи перевода:
- **Русский:** `"PageBuilder.SearchCTA.categoryPlaceholder": "Выберите категорию услуги..."`
- **Английский:** `"PageBuilder.SearchCTA.categoryPlaceholder": "Select a service category..."`

## Как работает

1. **Пользователь открывает главную страницу**
   - Видит поисковую строку с текстом "Выберите категорию услуги..."

2. **Клик по поисковой строке**
   - Открывается выпадающий список с 11 категориями услуг

3. **Выбор категории**
   - Пользователь кликает на нужную категорию
   - Происходит перенаправление на `/l/new?category=<category-id>`
   - На странице создания листинга категория будет предвыбрана

4. **Закрытие списка**
   - Клик вне компонента закрывает список категорий
   - Клик на категорию также закрывает список

## Как добавить новую категорию

Отредактируйте файл `/src/containers/PageBuilder/Primitives/SearchCTA/CategoryList/CategoryList.js`:

```javascript
const CATEGORIES = [
  // ... существующие категории
  { id: 'your-new-category-id', label: 'Название новой категории' },
];
```

**Важно:**
- `id` должен совпадать с ID категории в вашей конфигурации Sharetribe
- `label` - это текст, который увидит пользователь

## Как вернуть поиск по местоположению

Если нужно вернуть Google Places поиск:

1. Откройте `/src/containers/PageBuilder/Primitives/SearchCTA/SearchCTA.js`
2. Найдите блок `locationSearch`
3. Замените `<FilterCategory alignLeft={alignLeft} />` обратно на:
   ```javascript
   <FilterLocation setSubmitDisabled={setSubmitDisabled} alignLeft={alignLeft} />
   ```

## Проверка работы

1. Перезагрузите сайт (`Cmd+Shift+R`)
2. На главной странице кликните по поисковой строке
3. Должен открыться список из 11 категорий
4. Выберите любую категорию
5. Вас перенаправит на страницу создания листинга

## Стилизация

Все стили находятся в CSS модулях:
- **Список категорий:** Белый фон, тень, скругленные углы, hover эффект
- **Кнопки категорий:** Сдвиг вправо при наведении, смена цвета на `marketplaceColor`
- **Поле поиска:** Иконка поиска, placeholder текст, border при наведении

Вы можете изменить стили в соответствующих `.module.css` файлах.

