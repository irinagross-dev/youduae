# Инструкция по обновлению process.edn через терминал

## 🔧 Шаг 1: Логин в Flex CLI

```bash
flex-cli login
```

При запросе введите:
- **API Key**: Получите из Sharetribe Console → Build → Integrations → API applications
- **Marketplace ID**: Обычно это первая часть client ID или можно узнать в Console

## 📥 Шаг 2: Скачать текущий процесс

```bash
flex-cli process pull --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/
```

Это скачает файл `process.edn` в локальную папку.

## ✏️ Шаг 3: Редактировать process.edn

Откройте файл `./ext/transaction-processes/assignment-flow-v3/process.edn` и внесите изменения:

### 3.1. Добавить новый transition

Найдите секцию `:transitions` и **после** `transition/accept-offer` добавьте:

```clojure
  ;; 🆕 НОВЫЙ ПЕРЕХОД - Отклонение отклика
  {:name :transition/decline-offer,
   :actor :actor.role/customer,
   :actions [],
   :from :state/inquiry,
   :to :state/declined,
   :privileged? true}
```

### 3.2. Обновить transition/accept-offer

Найдите `transition/accept-offer` и **добавьте** action для обновления listing:

```clojure
  {:name :transition/accept-offer,
   :actor :actor.role/customer,
   :actions [{:name :action/update-protected-data}
             ;; 🆕 ДОБАВЬТЕ ЭТО:
             {:name :action/update-listing,
              :config {:fn/select-listing-fields
                       [{:key :publicData, :value {:fn/const {:hired true}}}]}}],
   :to :state/accepted,
   :privileged? true}
```

### 3.3. Добавить новое состояние

В секции `:states` (в самом начале файла после `:transitions`) добавьте:

```clojure
  {:id :state/declined,
   :type :final}
```

### 3.4. Добавить email notification (опционально)

В секцию `:notifications` добавьте:

```clojure
  {:name :notification/offer-declined,
   :on :transition/decline-offer,
   :to :actor.role/provider,
   :template :offer-declined}
```

## 📤 Шаг 4: Загрузить обновленный процесс

```bash
flex-cli process push --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/process.edn
```

## ✅ Шаг 5: Проверить изменения

```bash
flex-cli process pull --process assignment-flow-v3 --path ./check-process.edn
cat ./check-process.edn | grep -A5 "decline-offer"
```

---

## 📝 Полный пример обновленного process.edn

<details>
<summary>Развернуть полный код секции transitions</summary>

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
              :config {:fn/select-listing-fields
                       [{:key :publicData, :value {:fn/const {:hired true}}}]}}],
   :to :state/accepted,
   :privileged? true}
  
  ;; 🆕 НОВЫЙ ПЕРЕХОД
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
  
  ;; ... остальные transitions (reviews) ...
  ],

 :states
 [{:id :state/inquiry}
  {:id :state/accepted}
  {:id :state/declined, :type :final}  ;; 🆕 НОВОЕ СОСТОЯНИЕ
  {:id :state/completed}
  {:id :state/reviewed-by-customer}
  {:id :state/reviewed-by-provider}
  {:id :state/reviewed, :type :final}],

 :notifications
 [{:name :notification/new-offer-received,
   :on :transition/inquire,
   :to :actor.role/customer,
   :template :new-offer-received}
  
  {:name :notification/offer-accepted,
   :on :transition/accept-offer,
   :to :actor.role/provider,
   :template :offer-accepted}
  
  ;; 🆕 НОВОЕ УВЕДОМЛЕНИЕ
  {:name :notification/offer-declined,
   :on :transition/decline-offer,
   :to :actor.role/provider,
   :template :offer-declined}
  
  ;; ... остальные notifications ...
  ]}
```

</details>

---

## 🔍 Команды для проверки

### Просмотреть список процессов
```bash
flex-cli process list
```

### Просмотреть описание процесса
```bash
flex-cli process --path ./ext/transaction-processes/assignment-flow-v3/process.edn
```

### Проверить события в реальном времени
```bash
flex-cli events tail
```

---

## ⚠️ Важные замечания

1. **Backup**: Перед обновлением сделайте backup:
   ```bash
   cp ./ext/transaction-processes/assignment-flow-v3/process.edn ./ext/transaction-processes/assignment-flow-v3/process.edn.backup
   ```

2. **Тестирование**: После обновления обязательно протестируйте:
   - Создание отклика (inquire)
   - Принятие отклика (accept-offer)
   - Отклонение отклика (decline-offer) ✨ новое
   - Завершение работы (complete)

3. **Версионирование**: Sharetribe автоматически создает новую версию процесса при push

4. **Откат**: Если что-то пошло не так, можно откатиться:
   ```bash
   flex-cli process push --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/process.edn.backup
   ```

---

## 🚀 Быстрая команда (all-in-one)

После редактирования файла выполните:

```bash
# 1. Логин (если не залогинены)
flex-cli login

# 2. Backup
cp ./ext/transaction-processes/assignment-flow-v3/process.edn ./ext/transaction-processes/assignment-flow-v3/process.edn.backup

# 3. Push обновления
flex-cli process push --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/process.edn

# 4. Проверка
flex-cli process pull --process assignment-flow-v3 --path ./check-process.edn && grep -A3 "decline-offer" ./check-process.edn
```

---

## 📚 Дополнительные ресурсы

- [Sharetribe Flex CLI Documentation](https://www.sharetribe.com/docs/flex-cli/getting-started/)
- [Transaction Process Format](https://www.sharetribe.com/docs/references/transaction-process-format/)
- [Transaction Process Actions](https://www.sharetribe.com/docs/references/transaction-process-actions/)




