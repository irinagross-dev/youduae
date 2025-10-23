# 🚀 Быстрый старт: Обновление процесса через терминал

## ✅ Что уже сделано

- ✓ Обновлён файл `process.edn` с decline-offer
- ✓ Исправлены actor'ы (provider для inquire, customer для accept-offer)
- ✓ Добавлен action/update-listing для установки hired=true
- ✓ Добавлено состояние :state/declined
- ✓ Созданы email шаблоны для offer-declined
- ✓ Создан автоматический скрипт для обновления

---

## 📋 Быстрые команды (копируйте и выполняйте)

### Вариант 1: Автоматический скрипт (рекомендуется)

```bash
# 1. Залогиниться в flex-cli (если ещё не залогинены)
flex-cli login

# 2. Запустить автоматический скрипт
./scripts/update-process.sh
```

### Вариант 2: Ручные команды

```bash
# 1. Залогиниться
flex-cli login

# 2. Загрузить процесс
flex-cli process push --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/process.edn

# 3. Проверить обновление
flex-cli process pull --process assignment-flow-v3 --path ./check-process.edn
grep -A5 "decline-offer" ./check-process.edn
rm ./check-process.edn
```

---

## 🔑 Получение API ключа для flex-cli login

### Шаг 1: Откройте Sharetribe Console
```
https://console.sharetribe.com/
```

### Шаг 2: Перейдите в Build → Integrations
- Выберите **API applications**
- Нажмите **+ Add new**

### Шаг 3: Создайте приложение
- **Name**: CLI Access (или любое другое)
- **Scope**: Выберите **write** (для возможности обновления процессов)
- Нажмите **Create**

### Шаг 4: Скопируйте Client ID и Client Secret
После создания вы увидите:
- **Client ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- **Client Secret**: `xxxx-xxxx-xxxx-xxxx-xxxx` (показывается только один раз!)

### Шаг 5: Используйте в flex-cli login

```bash
flex-cli login
```

При запросе введите:
- **Marketplace ID**: Можно узнать в Console (URL вида: `console.sharetribe.com/a/{marketplace-id}/...`)
- **API Key**: Вставьте Client ID
- **API Secret**: Вставьте Client Secret

---

## 📊 Что изменилось в процессе

### 1. Добавлен новый transition

```clojure
{:name :transition/decline-offer,
 :actor :actor.role/customer,
 :actions [],
 :from :state/inquiry,
 :to :state/declined,
 :privileged? true}
```

### 2. Обновлён transition/accept-offer

```clojure
{:name :transition/accept-offer,
 :actor :actor.role/customer,  # Исправлено с provider
 :actions [{:name :action/update-protected-data}
           {:name :action/update-listing,  # 🆕 НОВОЕ
            :config {:fn/select-listing-fields
                     [{:key :publicData, :value {:fn/const {:hired true}}}]}}],
 :from :state/inquiry,
 :to :state/accepted,
 :privileged? true}
```

### 3. Исправлен transition/inquire

```clojure
{:name :transition/inquire,
 :actor :actor.role/provider,  # Исправлено с customer
 :actions [{:name :action/update-protected-data}],
 :to :state/inquiry}
```

### 4. Добавлено новое состояние

```clojure
{:id :state/declined, :type :final}
```

### 5. Добавлено email уведомление

```clojure
{:name :notification/offer-declined,
 :on :transition/decline-offer,
 :to :actor.role/provider,
 :template :offer-declined}
```

---

## ✅ Проверка обновлений

После успешного push выполните:

```bash
# Просмотр списка процессов
flex-cli process list

# Скачать обновлённый процесс
flex-cli process pull --process assignment-flow-v3 --path ./check.edn

# Проверить decline-offer
grep -B2 -A5 "decline-offer" ./check.edn

# Проверить update-listing
grep -B2 -A5 "update-listing" ./check.edn

# Удалить временный файл
rm ./check.edn
```

---

## 🧪 Тестирование

### 1. Мониторинг событий в реальном времени

```bash
flex-cli events tail
```

Оставьте эту команду запущенной в отдельном терминале.

### 2. Тестовый сценарий

1. **Создать задание** (как Customer)
2. **Отправить отклик** (как Provider) → должно появиться событие `transition/inquire`
3. **Отклонить отклик** (как Customer через UI) → должно появиться событие `transition/decline-offer`
4. **Проверить email** Provider'а → должно прийти "Ваш отклик не был принят"

### 3. Проверка publicData.hired

После принятия отклика через accept-offer:

```bash
# В events tail вы должны увидеть:
# - transition/accept-offer
# - listing.updated (с publicData.hired: true)
```

---

## 🔧 Устранение проблем

### Ошибка: "Could not parse arguments: --marketplace is required"

**Решение**: Сначала выполните `flex-cli login`

### Ошибка: "Process not found"

**Решение**: Проверьте название процесса:
```bash
flex-cli process list
```

### Ошибка: "Invalid process definition"

**Решение**: Проверьте синтаксис process.edn:
```bash
flex-cli process --path ./ext/transaction-processes/assignment-flow-v3/process.edn
```

### Ошибка: "Unauthorized"

**Решение**: 
1. Проверьте Client Secret (копируется только один раз!)
2. Убедитесь что приложение имеет **write** scope
3. Перелогиньтесь: `flex-cli logout && flex-cli login`

---

## 📚 Дополнительные команды

### Просмотр описания процесса (локально)

```bash
flex-cli process --path ./ext/transaction-processes/assignment-flow-v3/process.edn
```

### Откат к предыдущей версии

```bash
# Восстановить из backup
cp ./ext/transaction-processes/assignment-flow-v3/process.edn.backup ./ext/transaction-processes/assignment-flow-v3/process.edn

# Загрузить старую версию
flex-cli process push --process assignment-flow-v3 --path ./ext/transaction-processes/assignment-flow-v3/process.edn
```

### Просмотр всех transitions в процессе

```bash
grep -n ":name :transition/" ./ext/transaction-processes/assignment-flow-v3/process.edn
```

---

## 🎯 Следующие шаги после обновления

1. ✅ Процесс обновлён
2. 🧪 Протестировать decline-offer
3. 📧 Проверить email уведомления
4. 🎨 Убедиться что UI работает (кнопки "Отклонить")
5. 🔒 Проверить права доступа
6. 🚀 Деплой frontend изменений

---

## 📖 Полезные ссылки

- [Sharetribe Flex CLI](https://www.sharetribe.com/docs/flex-cli/getting-started/)
- [Transaction Process Format](https://www.sharetribe.com/docs/references/transaction-process-format/)
- [Process Actions](https://www.sharetribe.com/docs/references/transaction-process-actions/)
- [Email Templates](https://www.sharetribe.com/docs/references/email-templates/)

---

## 💡 Подсказки

- **Backup**: Всегда создавайте backup перед изменениями (`process.edn.backup` уже создан)
- **Testing**: Используйте `flex-cli events tail` для мониторинга
- **Версии**: Sharetribe сохраняет историю версий процессов
- **Email шаблоны**: Созданы в `templates/offer-declined-*`




