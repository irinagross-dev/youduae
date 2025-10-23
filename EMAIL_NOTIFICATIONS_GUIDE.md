# Email уведомления для decline-offer

## 📋 Обзор

Автоматические email уведомления отправляются исполнителям, чьи отклики были отклонены владельцем листинга.

## 🔧 Настройка в Sharetribe Console

### 1. Добавить notification в process.edn

В файле `process.edn` процесса `assignment-flow-v3` добавьте в секцию `:notifications`:

```clojure
{:name :notification/offer-declined,
 :on :transition/decline-offer,
 :to :actor.role/provider,
 :template :offer-declined}
```

**Полная секция notifications будет выглядеть так:**

```clojure
:notifications
[{:name :notification/new-offer-received,
  :on :transition/inquire,
  :to :actor.role/customer,
  :template :new-offer-received}
 
 {:name :notification/offer-accepted,
  :on :transition/accept-offer,
  :to :actor.role/provider,
  :template :offer-accepted}
 
 ;; 🆕 Новое уведомление
 {:name :notification/offer-declined,
  :on :transition/decline-offer,
  :to :actor.role/provider,
  :template :offer-declined}
 
 {:name :notification/work-completed,
  :on :transition/complete,
  :to :actor.role/customer,
  :template :work-completed}
 
 ;; ... review notifications ...
 ]
```

### 2. Создать email шаблон

1. В Sharetribe Console перейдите в **Build → Email templates**
2. Нажмите **+ Create new template**
3. Заполните поля:

#### Template ID
```
offer-declined
```

#### Subject (Russian)
```
Ваш отклик не был принят
```

#### Subject (English)
```
Your offer was not accepted
```

#### HTML Body (Russian)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #f44336;">Отклик не принят</h2>
    
    <p>Здравствуйте, {{recipient-display-name}}!</p>
    
    <p>К сожалению, владелец задания <strong>{{listing-title}}</strong> выбрал другого исполнителя.</p>
    
    <p>Не расстраивайтесь! На YouDu.ae всегда есть множество других заданий, где ваши навыки будут востребованы.</p>
    
    <div style="margin: 30px 0;">
      <a href="{{marketplace-url}}/s" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Найти другие задания
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Совет: Чтобы увеличить шансы на принятие вашего отклика, убедитесь что:
    </p>
    <ul style="color: #666; font-size: 14px;">
      <li>Ваш профиль заполнен полностью</li>
      <li>У вас есть положительные отзывы</li>
      <li>Вы предлагаете конкурентную цену</li>
      <li>Вы оставляете подробный комментарий к отклику</li>
    </ul>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px;">
      С уважением,<br>
      Команда YouDu.ae
    </p>
  </div>
</body>
</html>
```

#### HTML Body (English)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #f44336;">Offer Not Accepted</h2>
    
    <p>Hello {{recipient-display-name}}!</p>
    
    <p>Unfortunately, the task owner of <strong>{{listing-title}}</strong> has selected another provider.</p>
    
    <p>Don't worry! There are always plenty of other tasks on YouDu.ae where your skills will be in demand.</p>
    
    <div style="margin: 30px 0;">
      <a href="{{marketplace-url}}/s" 
         style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
        Find Other Tasks
      </a>
    </div>
    
    <p style="color: #666; font-size: 14px;">
      Tip: To increase your chances of getting accepted, make sure:
    </p>
    <ul style="color: #666; font-size: 14px;">
      <li>Your profile is complete</li>
      <li>You have positive reviews</li>
      <li>You offer competitive pricing</li>
      <li>You leave a detailed comment with your offer</li>
    </ul>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px;">
      Best regards,<br>
      YouDu.ae Team
    </p>
  </div>
</body>
</html>
```

#### Text Body (Russian)
```
Здравствуйте, {{recipient-display-name}}!

К сожалению, владелец задания "{{listing-title}}" выбрал другого исполнителя.

Не расстраивайтесь! На YouDu.ae всегда есть множество других заданий, где ваши навыки будут востребованы.

Найти другие задания: {{marketplace-url}}/s

Совет: Чтобы увеличить шансы на принятие вашего отклика, убедитесь что:
- Ваш профиль заполнен полностью
- У вас есть положительные отзывы
- Вы предлагаете конкурентную цену
- Вы оставляете подробный комментарий к отклику

С уважением,
Команда YouDu.ae
```

#### Text Body (English)
```
Hello {{recipient-display-name}}!

Unfortunately, the task owner of "{{listing-title}}" has selected another provider.

Don't worry! There are always plenty of other tasks on YouDu.ae where your skills will be in demand.

Find Other Tasks: {{marketplace-url}}/s

Tip: To increase your chances of getting accepted, make sure:
- Your profile is complete
- You have positive reviews
- You offer competitive pricing
- You leave a detailed comment with your offer

Best regards,
YouDu.ae Team
```

### 3. Доступные переменные для шаблона

- `{{recipient-display-name}}` - Имя получателя
- `{{listing-title}}` - Название задания
- `{{marketplace-url}}` - URL маркетплейса
- `{{transaction-url}}` - URL транзакции (для истории)

## 📊 Логика отправки уведомлений

1. **Владелец листинга нажимает "Отклонить"** на отклике исполнителя
2. Срабатывает `transition/decline-offer`
3. Sharetribe автоматически отправляет email провайдеру (исполнителю)
4. Транзакция переходит в терминальное состояние `declined`
5. Отклик больше не отображается в активном списке

## ✅ Тестирование

1. Создайте тестовое задание
2. Отправьте отклик от тестового провайдера
3. Отклоните отклик через кнопку "Отклонить"
4. Проверьте inbox провайдера - должно прийти уведомление

## 🔗 Связанные файлы

- `ASSIGNMENT_PROCESS_UPDATE_GUIDE.md` - Полная инструкция по обновлению процесса
- `src/components/OfferList.jsx` - UI для отклонения откликов
- `ext/transaction-processes/assignment-flow-v3/` - Локальная копия процесса (референс)

## 📚 Дополнительная информация

- [Sharetribe Documentation: Email Notifications](https://www.sharetribe.com/docs/references/email-templates/)
- [Sharetribe Documentation: Transaction Process Notifications](https://www.sharetribe.com/docs/references/transaction-process-format/#notifications)




