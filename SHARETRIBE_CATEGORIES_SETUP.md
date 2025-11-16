# 📋 Настройка Categories в Sharetribe Console

## 🎯 Цель
Добавить **listing categories** с **subcategories** в Sharetribe Console для вашего маркетплейса YouDu.

---

## 🔑 Доступ к Console

1. Откройте: https://console.sharetribe.com
2. Войдите в ваш проект **YouDu**
3. Перейдите: **Build** → **Listing types**

---

## 📂 Структура Categories

### Важно понимать:
- **Listing Categories** = категории для **листингов** (заданий)
- **User Extended Data** = категории для **исполнителей** (serviceCategories уже настроены в коде)

---

## 🛠️ Шаг 1: Создать Listing Categories

### 1.1 Откройте Listing Type:
```
Build → Listing types → free-listing (или ваш тип) → Edit
```

### 1.2 Найдите секцию "Categories":
```
Categories → Add category
```

---

## 📝 Шаг 2: Добавить Категории

### Категория 1: **Construction** (Строительство и ремонт)

```json
{
  "id": "construction",
  "name": {
    "en": "Construction and Repair",
    "ru": "Строительство и ремонт"
  },
  "subcategories": [
    { "id": "const-general", "name": { "en": "General Construction", "ru": "Общестроительные работы" } },
    { "id": "const-electrical", "name": { "en": "Electrical", "ru": "Электрика" } },
    { "id": "const-plumbing", "name": { "en": "Plumbing", "ru": "Сантехника" } },
    { "id": "const-painting", "name": { "en": "Painting", "ru": "Малярные работы" } },
    { "id": "const-hvac", "name": { "en": "HVAC", "ru": "Кондиционеры и вентиляция" } },
    { "id": "const-flooring", "name": { "en": "Flooring", "ru": "Напольные покрытия" } },
    { "id": "const-windows", "name": { "en": "Windows & Doors", "ru": "Окна и двери" } }
  ]
}
```

### Категория 2: **Beauty** (Красота и здоровье)

```json
{
  "id": "beauty",
  "name": {
    "en": "Beauty and Health",
    "ru": "Красота и здоровье"
  },
  "subcategories": [
    { "id": "beauty-hair", "name": { "en": "Hair Services", "ru": "Парикмахерские услуги" } },
    { "id": "beauty-nails", "name": { "en": "Manicure/Pedicure", "ru": "Маникюр/педикюр" } },
    { "id": "beauty-makeup", "name": { "en": "Makeup", "ru": "Макияж" } },
    { "id": "beauty-massage", "name": { "en": "Massage", "ru": "Массаж" } },
    { "id": "beauty-spa", "name": { "en": "SPA Treatments", "ru": "SPA процедуры" } },
    { "id": "beauty-cosmetology", "name": { "en": "Cosmetology", "ru": "Косметология" } }
  ]
}
```

### Категория 3: **Tutoring** (Репетиторы)

```json
{
  "id": "tutoring",
  "name": {
    "en": "Tutoring and Education",
    "ru": "Репетиторы и обучение"
  },
  "subcategories": [
    { "id": "tutor-languages", "name": { "en": "Languages", "ru": "Языки" } },
    { "id": "tutor-math", "name": { "en": "Mathematics", "ru": "Математика" } },
    { "id": "tutor-programming", "name": { "en": "Programming", "ru": "Программирование" } },
    { "id": "tutor-music", "name": { "en": "Music", "ru": "Музыка" } },
    { "id": "tutor-school", "name": { "en": "School Subjects", "ru": "Школьные предметы" } },
    { "id": "tutor-university", "name": { "en": "University Subjects", "ru": "Университетские предметы" } }
  ]
}
```

### Категория 4: **Cleaning** (Уборка)

```json
{
  "id": "cleaning",
  "name": {
    "en": "Cleaning and Home Help",
    "ru": "Уборка и помощь в доме"
  },
  "subcategories": [
    { "id": "clean-house", "name": { "en": "House/Apartment Cleaning", "ru": "Уборка квартиры/дома" } },
    { "id": "clean-office", "name": { "en": "Office Cleaning", "ru": "Уборка офиса" } },
    { "id": "clean-deep", "name": { "en": "Deep Cleaning", "ru": "Генеральная уборка" } },
    { "id": "clean-window", "name": { "en": "Window Cleaning", "ru": "Мытьё окон" } },
    { "id": "clean-laundry", "name": { "en": "Laundry & Ironing", "ru": "Стирка и глажка" } },
    { "id": "clean-babysitter", "name": { "en": "Babysitter Services", "ru": "Услуги няни" } }
  ]
}
```

### Категория 5: **Legal** (Юридические услуги)

```json
{
  "id": "legal",
  "name": {
    "en": "Legal and Accounting Services",
    "ru": "Юридическая и бухгалтерская помощь"
  },
  "subcategories": [
    { "id": "legal-consultation", "name": { "en": "Legal Consultation", "ru": "Юридическая консультация" } },
    { "id": "legal-documents", "name": { "en": "Document Preparation", "ru": "Составление документов" } },
    { "id": "legal-registration", "name": { "en": "Company Registration", "ru": "Регистрация компаний" } },
    { "id": "legal-accounting", "name": { "en": "Accounting", "ru": "Бухгалтерия" } },
    { "id": "legal-tax", "name": { "en": "Tax Consulting", "ru": "Налоговое консультирование" } }
  ]
}
```

### Категория 6-14: Остальные

(Следуйте тому же формату для оставшихся категорий: appliances, media, courier, moving, tech-repair, auto, Interior_designer, Tourist_services, Web_design)

---

## ⚙️ Шаг 3: Настроить Обязательность

### В Console для каждой категории:

1. **Make category required**: ✅ ВКЛ
2. **Make subcategory required**: ✅ ВКЛ
3. **Allow multiple subcategories**: ❌ ВЫКЛ (для листингов)

**Важно:** Для исполнителей (serviceCategories) разрешим multiple subcategories в коде!

---

## 🔍 Шаг 4: Проверка

### После настройки в Console:

1. Создайте тестовое задание через `/l/new`
2. Убедитесь, что видны категории и подкатегории
3. Проверьте сохранение в publicData

---

## 📊 Ожидаемая Структура в publicData

### Для Listing:
```json
{
  "publicData": {
    "category": "construction",
    "subcategory": "const-electrical",
    "categoryPath": "construction/const-electrical"
  }
}
```

### Для User (Customer):
```json
{
  "publicData": {
    "serviceCategories": ["construction", "beauty"],
    "subcategories": {
      "construction": ["const-electrical", "const-plumbing"],
      "beauty": ["beauty-hair", "beauty-nails"]
    }
  }
}
```

---

## ⚠️ Важные Заметки

### 1. ID должны совпадать
```
Console ID = serviceCategories.js ID
```

### 2. Порядок добавления
```
1. Сначала основная категория
2. Потом subcategories к ней
3. Сохранить
4. Повторить для всех 14 категорий
```

### 3. Локализация
Обязательно добавьте переводы для:
- **en** (English)
- **ru** (Russian)

---

## 🚀 После Настройки

### Проверьте:
- [ ] Все 14 категорий добавлены
- [ ] У каждой есть subcategories
- [ ] Переводы на ru/en корректны
- [ ] ID совпадают с кодом
- [ ] Required fields настроены

### Затем:
1. Обновите frontend код
2. Протестируйте создание листинга
3. Протестируйте регистрацию исполнителя
4. Проверьте фильтрацию по категориям

---

**Время настройки:** ~30-40 минут  
**Сложность:** Средняя 🟡  
**Документация Sharetribe:** https://www.sharetribe.com/docs/references/extended-data/#listing-categories

