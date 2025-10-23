# ✅ Исправлена ошибка "Disallowed key" при закрытии листинга

## 🐛 Проблема

**Ошибка:** "Disallowed key" при выборе исполнителя (accept-offer)

**Логи:**
```
❌ OfferList accept error: 400 Object
errors: [{…}]
```

**Причина:**
Попытка напрямую изменить `state='closed'` через `sdk.ownListings.update({ state: 'closed' })` - это запрещено в Sharetribe API.

---

## ✅ Решение

Использовать отдельный метод `sdk.ownListings.close()` для закрытия листинга.

### Файл: `server/api/update-listing-status.js`

**До (НЕ РАБОТАЛО):**
```javascript
if (status === 'in-progress') {
  updateParams.publicData.hired = true;
  updateParams.state = 'closed'; // ❌ Ошибка: Disallowed key
}

sdk.ownListings.update(updateParams)
```

**После (РАБОТАЕТ):**
```javascript
// Шаг 1: Обновляем publicData
sdk.ownListings.update(updateParams)
  .then(response => {
    // Шаг 2: Если нужно закрыть листинг, делаем отдельный вызов
    if (status === 'in-progress') {
      return sdk.ownListings.close({ id: listingId }); // ✅ Правильно
    }
    return response;
  })
```

---

## 🔧 Дополнительные исправления

### Предупреждение: `isVerified` должен быть boolean

**Файл:** `src/components/OfferList.jsx`

**До:**
```javascript
const isVerified = customerProfile.publicData?.isVerified || false;
// Проблема: может вернуть объект вместо boolean
```

**После:**
```javascript
const isVerified = customerProfile.publicData?.isVerified === true;
// ✅ Всегда boolean
```

---

## 📊 Жизненный цикл листинга (обновлённый)

```
1. Provider создаёт задание
   └─> state = 'published'
   └─> publicData.status = undefined
   └─> Виден в поиске ✅

2. Customer отправляет отклик
   └─> Листинг всё ещё published
   └─> Виден в поиске ✅

3. Provider выбирает Customer (accept-offer)
   └─> Шаг 1: sdk.ownListings.update()
       ├─> publicData.status = 'in-progress'
       ├─> publicData.hired = true
       └─> publicData.assignedTo = customerId
   └─> Шаг 2: sdk.ownListings.close()
       └─> state = 'closed' 🔒
   └─> СКРЫТ из поиска ❌
   └─> Виден только Provider и выбранному Customer

4. Customer завершает работу (transition/complete)
   └─> Листинг остаётся closed
   └─> publicData.status = 'in-progress' (пока)

5. Обе стороны оставляют отзывы
   └─> Транзакция: state = 'reviewed' (финал)
   └─> Листинг: state = 'closed' (навсегда)
   └─> Provider видит в "Мои задания" с бейджем "Завершено"
```

---

## 🧪 Тестирование

### Сценарий: Provider выбирает Customer

1. **Provider** создаёт листинг
2. **Customer** отправляет отклик
3. **Provider** нажимает "Выбрать исполнителя"

**Ожидаемый результат:**
- ✅ Нет ошибки "Disallowed key"
- ✅ Листинг закрывается (state='closed')
- ✅ publicData.status='in-progress'
- ✅ publicData.hired=true
- ✅ Листинг НЕ виден в поиске для других Customer
- ✅ Листинг виден Provider в "Мои задания"
- ✅ Листинг доступен выбранному Customer

**Логи (успешно):**
```
✅ update-listing-status: publicData updated
  → Closing listing to hide from search...
✅ update-listing-status: complete (listing closed if needed)
```

---

## 🔍 Проверка в консоли браузера

После выбора исполнителя откройте DevTools → Network:

```
POST /api/update-listing-status
Response: 200 OK

Не должно быть:
❌ 400 Bad Request
❌ "Disallowed key"
```

---

## 📝 Изменённые файлы

1. ✅ `server/api/update-listing-status.js`
   - Разделили обновление на 2 шага: `update()` + `close()`
   - Используем `sdk.ownListings.close()` вместо прямого изменения state

2. ✅ `src/components/OfferList.jsx`
   - Исправлен тип `isVerified`: `=== true` вместо `|| false`
   - Убрано предупреждение React PropTypes

---

## ✅ Готово!

Теперь система корректно:
- ✅ Закрывает листинг после выбора исполнителя
- ✅ Скрывает листинг из поиска
- ✅ Показывает листинг только участникам
- ✅ Нет ошибок "Disallowed key"
- ✅ Нет предупреждений PropTypes




