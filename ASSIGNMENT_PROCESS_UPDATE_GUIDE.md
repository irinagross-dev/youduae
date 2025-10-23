# Обновление процесса assignment-flow-v3 в Sharetribe Console

## 📋 Обзор изменений

Добавлен новый переход `transition/decline-offer`, который позволяет владельцу листинга отклонять неподходящие отклики от исполнителей.

## 🔧 Шаги для обновления процесса в Sharetribe Console

### 1. Открыть Sharetribe Console

1. Перейдите на https://console.sharetribe.com/
2. Выберите ваш маркетплейс
3. Перейдите в **Build → Transaction processes**
4. Найдите процесс `assignment-flow-v3`
5. Нажмите **Edit**

### 2. Обновить `process.edn`

Найдите секцию `:transitions` и добавьте новый переход `decline-offer` после `accept-offer`:

```clojure
{:format :v3,
 :transitions
 [{:name :transition/inquire,
   :actor :actor.role/provider,
   :actions [{:name :action/update-protected-data}],
   :to :state/inquiry}
  
  {:name :transition/accept-offer,
   :actor :actor.role/customer,
   :actions [{:name :action/update-protected-data}
             {:name :action/update-listing,
              :config {:listingFields [[:publicData [:hired] "hired=true"]]}}],
   :to :state/accepted,
   :privileged? true}
  
  ;; 🆕 НОВЫЙ ПЕРЕХОД - Отклонение отклика
  {:name :transition/decline-offer,
   :actor :actor.role/customer,
   :actions [],
   :from :state/inquiry,
   :to :state/declined,
   :privileged? true}
  
  {:name :transition/complete,
   :actor :actor.role/provider,
   :actions [],
   :from :state/accepted,
   :to :state/completed}
  
  ;; ... остальные transitions ...
  ]}
```

### 3. Добавить новое состояние `declined`

В секции `:states` добавьте:

```clojure
{:id :state/declined,
 :type :final}
```

### 4. Обновить email уведомления (опционально)

Добавьте уведомление для отклонённых офферов:

```clojure
{:name :notification/offer-declined,
 :on :transition/decline-offer,
 :to :actor.role/provider,
 :template :offer-declined}
```

### 5. Сохранить и протестировать

1. Нажмите **Save** в Console
2. Процесс автоматически обновится для новых транзакций
3. Протестируйте:
   - Создайте новый листинг
   - Отправьте несколько откликов от разных провайдеров
   - Примите один отклик
   - Отклоните другие отклики

## 🎯 Что делает каждый переход

### `transition/accept-offer`
- **Актёр**: Customer (владелец листинга)
- **Действия**:
  - Обновляет `protectedData` транзакции
  - **🆕 Обновляет `publicData.hired` листинга на `true`** (скрывает форму отклика для других)
- **Результат**: Листинг помечен как "в работе", форма отклика скрыта

### `transition/decline-offer`
- **Актёр**: Customer (владелец листинга)
- **Действия**: Нет (просто переводит транзакцию в терминальное состояние)
- **Результат**: Транзакция завершена, отклик больше не отображается в списке активных

## 📊 Диаграмма процесса

```
[initial]
    ↓ inquire (Provider)
[inquiry] ←── Отклики от исполнителей
    ↓ accept-offer (Customer) → [accepted] → complete → [completed] → reviews
    ↓ decline-offer (Customer) → [declined] (✓ финал)
```

## ⚠️ Важные замечания

1. **`privileged? true`** - Оба перехода (`accept-offer` и `decline-offer`) должны быть privileged, так как они управляются через backend
2. **`:from :state/inquiry`** - `decline-offer` может быть выполнен только из состояния `inquiry`
3. **`action/update-listing`** в `accept-offer` обновляет `publicData.hired` листинга, что автоматически скрывает форму отклика
4. **Email шаблоны** - Для уведомлений нужно создать шаблоны в Console → Build → Email templates

## 🔗 Связанные файлы

- `src/transactions/transactionProcessAssignment.js` - Frontend описание процесса
- `src/components/OfferList.jsx` - UI для принятия/отклонения откликов
- `server/api/transition-privileged.js` - Backend обработка transitions
- `src/containers/ListingPage/ListingPageCarousel.js` - Логика скрытия формы отклика

## 📚 Дополнительная информация

- [Sharetribe Documentation: Transaction Process](https://www.sharetribe.com/docs/howto/edit-transaction-process-with-flex-cli/)
- [Sharetribe Documentation: Transaction Process Actions](https://www.sharetribe.com/docs/references/transaction-process-actions/)




