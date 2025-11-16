# 🚀 Быстрый Старт: Subcategories

## ✅ Что Уже Сделано

1. ✅ Обновлён `src/config/serviceCategories.js` с subcategories
2. ✅ Добавлены helper функции:
   - `getCategoryLabel()`
   - `getSubcategoryLabel()`
   - `getSubcategoryEnumOptions()`
   - `getAllSubcategoriesFlat()`
3. ✅ Создана документация

---

## 📋 Что Нужно Сделать Дальше

### Шаг 1: Настроить Sharetribe Console (30-40 мин)
📄 **Инструкция:** `SHARETRIBE_CATEGORIES_SETUP.md`

**Действия:**
1. Откройте Console → Build → Listing types
2. Добавьте categories с subcategories
3. Настройте required fields
4. Сохраните

---

### Шаг 2: Тестирование (локально)

#### 2.1 Проверьте создание листинга:
```bash
# Откройте http://localhost:3000/l/new
# Должны появиться:
# 1. Dropdown "Категория"
# 2. После выбора категории → Dropdown "Подкатегория"
```

#### 2.2 Проверьте регистрацию исполнителя:
```bash
# Откройте http://localhost:3000/signup/customer
# В форме должны быть:
# 1. Выбор основных категорий (multi-select)
# 2. Для каждой категории → выбор подкатегорий
```

---

### Шаг 3: Обновить Форму Регистрации (опционально)

Если хотите **более красивый UI** для выбора subcategories:

**Файл:** `src/containers/AuthenticationPage/SignupForm/SignupForm.js`

**Добавить:**
```javascript
import { getSubcategoryEnumOptions } from '../../../config/serviceCategories';

// В компоненте:
const [selectedCategories, setSelectedCategories] = useState([]);

// Для каждой выбранной категории показать subcategories
{selectedCategories.map(categoryId => {
  const subcategories = getSubcategoryEnumOptions(categoryId, locale);
  return (
    <FieldCheckboxGroup
      key={categoryId}
      id={`subcategories-${categoryId}`}
      name={`subcategories.${categoryId}`}
      label={`Выберите услуги (${getCategoryLabel(categoryId, locale)})`}
      options={subcategories}
    />
  );
})}
```

---

### Шаг 4: Обновить Страницу Категорий

**Файл:** `src/containers/CategoryExecutorsPage/CategoryExecutorsPage.js`

**Добавить фильтр по subcategory:**
```javascript
// URL: /category/construction?sub=const-electrical

const { category, sub } = useParams();

// Фильтровать исполнителей по subcategory
const filteredExecutors = executors.filter(executor => {
  if (!sub) return true; // Показать всех
  return executor.attributes.profile.publicData
    .subcategories?.[category]?.includes(sub);
});
```

---

## 🎯 Ожидаемый Результат

### Для Листингов:
```javascript
// publicData листинга
{
  "category": "construction",
  "subcategory": "const-electrical"
}
```

### Для Исполнителей:
```javascript
// publicData исполнителя
{
  "serviceCategories": ["construction", "beauty"],
  "subcategories": {
    "construction": ["const-electrical", "const-plumbing"],
    "beauty": ["beauty-hair"]
  }
}
```

---

## 🧪 Проверочный Список

- [ ] Categories настроены в Console
- [ ] Subcategories видны при создании листинга
- [ ] Subcategories видны при регистрации Customer
- [ ] Данные сохраняются в publicData
- [ ] Фильтрация по subcategory работает
- [ ] Переводы ru/en корректны

---

## 📞 Следующие Шаги

1. **Настройте Console** (SHARETRIBE_CATEGORIES_SETUP.md)
2. **Протестируйте локально**
3. **Сообщите мне результат** - я помогу с frontend, если нужно!

---

**Статус:** ✅ Backend готов, нужна настройка Console  
**Время:** ~30-40 минут на настройку Console  
**Приоритет:** 🔥 Высокий

