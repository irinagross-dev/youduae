# Assignment Flow v3 - Transaction Process

Это пользовательский процесс транзакций для маркетплейса в стиле YouDo.

## Workflow

1. **inquiry** - Customer (исполнитель) отправляет отклик с ценой и комментарием
2. **accepted** - Provider (заказчик) принимает отклик
3. **completed** - Provider завершает работу
4. **reviewed** - Обе стороны оставляют отзывы друг о друге

## Установка в Sharetribe Console

### 1. Загрузите процесс

```bash
flex-cli process push --process assignment-flow-v3 --path ext/transaction-processes/assignment-flow-v3/process.edn
```

Или через Console UI:
1. Откройте [Sharetribe Console](https://flex-console.sharetribe.com/)
2. Перейдите в **Build** → **Transaction processes**
3. Нажмите **Add new process**
4. Загрузите файл `process.edn`
5. Укажите alias: `assignment-flow-v3/release-1`

### 2. Создайте email templates

В разделе **Build** → **Email templates** создайте следующие шаблоны:

#### new-inquiry
- **Subject:** используйте содержимое файла `templates/new-inquiry-subject.txt`
- **HTML body:** используйте содержимое файла `templates/new-inquiry-html.html`

#### offer-accepted
- **Subject:** используйте содержимое файла `templates/offer-accepted-subject.txt`
- **HTML body:** используйте содержимое файла `templates/offer-accepted-html.html`

#### work-completed
- **Subject:** используйте содержимое файла `templates/work-completed-subject.txt`
- **HTML body:** используйте содержимое файла `templates/work-completed-html.html`

#### review-by-provider-first
- **Subject:** используйте содержимое файла `templates/review-by-provider-first-subject.txt`
- **HTML body:** используйте содержимое файла `templates/review-by-provider-first-html.html`

#### review-by-customer-first
- **Subject:** используйте содержимое файла `templates/review-by-customer-first-subject.txt`
- **HTML body:** используйте содержимое файла `templates/review-by-customer-first-html.html`

#### review-by-provider-second
- **Subject:** используйте содержимое файла `templates/review-by-provider-second-subject.txt`
- **HTML body:** используйте содержимое файла `templates/review-by-provider-second-html.html`

#### review-by-customer-second
- **Subject:** используйте содержимое файла `templates/review-by-customer-second-subject.txt`
- **HTML body:** используйте содержимое файла `templates/review-by-customer-second-html.html`

### 3. Настройте листинги

В Console перейдите в **Build** → **Listing types** и:
1. Выберите тип листинга **free-listing**
2. В разделе **Transaction process** выберите `assignment-flow-v3/release-1`
3. Сохраните изменения

## Особенности

### Система отзывов

- **Взаимные отзывы:** Обе стороны (Customer и Provider) могут оставить отзывы друг о друге
- **Двухэтапная публикация:** Отзывы публикуются после того, как обе стороны оставят свои оценки
- **Срок давности:** Если одна из сторон не оставит отзыв в течение 7 дней, отзывы публикуются автоматически
- **Защита от дублирования:** Каждая сторона может оставить только один отзыв

### Email уведомления

- ✉️ При создании отклика → Provider получает уведомление
- ✉️ При принятии отклика → Customer получает уведомление
- ✉️ При завершении работы → Provider получает уведомление
- ✉️ При оставлении отзыва → другая сторона получает уведомление

## Проверка

После загрузки процесса проверьте:

1. Создайте новый листинг с типом `free-listing`
2. От имени Customer оставьте отклик
3. От имени Provider примите отклик
4. От имени Provider завершите работу
5. Оставьте отзывы от обеих сторон

Все email уведомления должны отправляться автоматически.

## Поддержка

Документация Sharetribe: https://www.sharetribe.com/docs/

