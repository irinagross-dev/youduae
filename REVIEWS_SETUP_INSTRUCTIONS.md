# 🌟 Инструкция по настройке системы отзывов

## ✅ Что реализовано

### 1. Система взаимных отзывов
- ⭐ Рейтинг от 1 до 5 звёзд
- 💬 Текстовый комментарий к отзыву
- 🔄 Взаимные отзывы между Customer и Provider
- 🔒 Защита от дублирующихся отзывов (каждая сторона может оставить только один отзыв)
- 📅 Автоматическая публикация отзывов через 7 дней, если вторая сторона не оставила отзыв

### 2. UI компоненты
- `ReviewModal` - модальное окно для оставления отзыва
- Кнопка "Leave a review" появляется автоматически после завершения работы
- Отзывы отображаются в профиле пользователя
- История отзывов в Activity Feed сделки

### 3. Процесс отзывов

```
COMPLETED (работа завершена)
    ↓
    ├─→ Customer оставляет отзыв → REVIEWED_BY_CUSTOMER
    │                                      ↓
    │                              Provider оставляет отзыв → REVIEWED
    │
    └─→ Provider оставляет отзыв → REVIEWED_BY_PROVIDER
                                           ↓
                                   Customer оставляет отзыв → REVIEWED
```

### 4. Email уведомления
Созданы шаблоны для всех этапов:
- 📧 Новый отклик (`new-inquiry`)
- 📧 Отклик принят (`offer-accepted`)
- 📧 Работа завершена (`work-completed`)
- 📧 Первый отзыв от Customer (`review-by-customer-first`)
- 📧 Первый отзыв от Provider (`review-by-provider-first`)
- 📧 Второй отзыв - отзывы опубликованы (`review-by-customer-second`, `review-by-provider-second`)

## 🚀 Следующие шаги: Настройка в Sharetribe Console

### Шаг 1: Загрузите обновлённый процесс в Console

⚠️ **ВАЖНО:** Нужно обновить процесс `assignment-flow-v3` в Sharetribe Console, добавив поддержку отзывов.

#### Вариант А: Через flex-cli (рекомендуется)

```bash
# Установите flex-cli если ещё не установлен
npm install -g @sharetribe/flex-cli

# Авторизуйтесь
flex-cli login

# Загрузите процесс
flex-cli process push --process assignment-flow-v3 --path ext/transaction-processes/assignment-flow-v3/process.edn --marketplace your-marketplace-id
```

#### Вариант Б: Через Console UI

1. Откройте [Sharetribe Console](https://flex-console.sharetribe.com/)
2. Перейдите в **Build** → **Transaction processes**
3. Найдите процесс `assignment-flow-v3/release-1`
4. Нажмите **Edit process**
5. Скопируйте содержимое файла `ext/transaction-processes/assignment-flow-v3/process.edn`
6. Вставьте в редактор и сохраните
7. Опубликуйте новую версию процесса

### Шаг 2: Создайте Email Templates

В Console перейдите в **Build** → **Email templates** и создайте следующие шаблоны:

#### 1. new-inquiry (уже существует, но проверьте)
- **Template ID:** `new-inquiry`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/new-inquiry-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/new-inquiry-html.html`

#### 2. offer-accepted (уже существует, но проверьте)
- **Template ID:** `offer-accepted`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/offer-accepted-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/offer-accepted-html.html`

#### 3. work-completed (уже существует, но проверьте)
- **Template ID:** `work-completed`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/work-completed-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/work-completed-html.html`

#### 4. review-by-provider-first (НОВЫЙ шаблон)
- **Template ID:** `review-by-provider-first`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-provider-first-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-provider-first-html.html`

#### 5. review-by-customer-first (НОВЫЙ шаблон)
- **Template ID:** `review-by-customer-first`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-customer-first-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-customer-first-html.html`

#### 6. review-by-provider-second (НОВЫЙ шаблон)
- **Template ID:** `review-by-provider-second`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-provider-second-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-provider-second-html.html`

#### 7. review-by-customer-second (НОВЫЙ шаблон)
- **Template ID:** `review-by-customer-second`
- **Subject:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-customer-second-subject.txt`
- **HTML body:** скопируйте из `ext/transaction-processes/assignment-flow-v3/templates/review-by-customer-second-html.html`

### Шаг 3: Проверьте настройки листингов

1. В Console перейдите в **Build** → **Listing types**
2. Выберите **free-listing**
3. Убедитесь, что **Transaction process** установлен на `assignment-flow-v3/release-1`
4. Сохраните изменения

## 🧪 Тестирование

После настройки Console протестируйте полный цикл:

### Тест 1: Базовый workflow
1. ✅ Создайте листинг от Provider
2. ✅ Отправьте отклик от Customer
3. ✅ Примите отклик от Provider
4. ✅ Завершите работу от Provider
5. ✅ Оставьте отзыв от Customer (должна появиться кнопка "Leave a review")
6. ✅ Оставьте отзыв от Provider
7. ✅ Проверьте, что оба отзыва опубликованы

### Тест 2: Email уведомления
Проверьте, что email приходят на каждом этапе:
- ✉️ Provider получает email при новом отклике
- ✉️ Customer получает email при принятии отклика
- ✉️ Customer получает email при завершении работы
- ✉️ Provider получает email когда Customer оставляет отзыв
- ✉️ Customer получает email когда Provider оставляет отзыв

### Тест 3: Защита от дублирования
1. ✅ Попробуйте оставить второй отзыв от той же стороны
2. ✅ Убедитесь, что система блокирует повторный отзыв

### Тест 4: Отображение отзывов
1. ✅ Откройте профиль Customer → должны быть видны отзывы
2. ✅ Откройте профиль Provider → должны быть видны отзывы
3. ✅ Проверьте, что рейтинг (звёзды) и комментарии отображаются корректно

## 📝 Изменённые файлы

### Backend
- `src/transactions/transactionProcessAssignment.js` - добавлены переходы и состояния для отзывов
- `src/containers/TransactionPage/TransactionPage.stateDataAssignment.js` - логика UI для состояний отзывов

### Translations
- `src/translations/ru.json` - добавлены переводы для всех состояний отзывов

### Process files
- `ext/transaction-processes/assignment-flow-v3/process.edn` - процесс с поддержкой отзывов
- `ext/transaction-processes/assignment-flow-v3/templates/*.txt` - email subject templates
- `ext/transaction-processes/assignment-flow-v3/templates/*.html` - email body templates
- `ext/transaction-processes/assignment-flow-v3/README.md` - документация процесса

## 🔍 Дополнительная информация

### Как работают отзывы в Sharetribe

1. **Двойная слепота:** Отзывы не публикуются сразу. Они становятся видимыми только после того, как:
   - Обе стороны оставили отзывы
   - ИЛИ прошло 7 дней с момента первого отзыва

2. **Хранение:** Отзывы хранятся в виде review entities, связанных с transaction и user

3. **Отображение:** Отзывы автоматически подтягиваются и отображаются в профиле пользователя

### Где посмотреть отзывы пользователя

```javascript
// В ProfilePage компоненте отзывы автоматически загружаются через:
currentUser.attributes.profile.publicData.reviews
```

### Полезные ссылки

- [Sharetribe Reviews Documentation](https://www.sharetribe.com/docs/concepts/reviews/)
- [Transaction Process Documentation](https://www.sharetribe.com/docs/concepts/transaction-process/)
- [Email Templates](https://www.sharetribe.com/docs/template/how-to-customize-email-templates/)

## ⚠️ Важные замечания

1. **Обязательно обновите процесс в Console** - без этого отзывы не будут работать на уровне API
2. **Создайте все email templates** - иначе пользователи не будут получать уведомления
3. **Протестируйте на тестовом окружении** - перед деплоем на продакшен

## 🎉 Готово!

После выполнения всех шагов система отзывов будет полностью функциональна!

Если возникнут вопросы или проблемы, обратитесь к документации Sharetribe или напишите в поддержку.

