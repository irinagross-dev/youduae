# 🔐 Скрипты для просмотра документов верификации

## Быстрый старт

### macOS/Linux:
```bash
./scripts/view-verification-image.sh IMAGE_ID
```

### Windows:
```powershell
.\scripts\view-verification-image.ps1 IMAGE_ID
```

---

## Где взять IMAGE_ID?

1. Откройте **[Sharetribe Console](https://console.sharetribe.com)**
2. **Users** → найдите пользователя → **Edit user**
3. Найдите `protectedData.verificationDocuments`
4. Скопируйте значение поля `id`

**Пример JSON:**
```json
{
  "verificationDocuments": [
    {
      "id": "68f1f533-06f1-4a6f-a1a7-84440f8e3ebf",  ← ЭТОТ ID
      "type": "passport",
      "status": "pending"
    }
  ]
}
```

---

## Требования

### ✅ Credentials в .env файле

Скрипты автоматически читают credentials из `.env`:

```env
REACT_APP_SHARETRIBE_SDK_CLIENT_ID=8cf2100a-1f17-4996-ab44-7a4268e65ed2
SHARETRIBE_SDK_CLIENT_SECRET=b158485c0ebffcab995304096cea1549fa84560c
```

Если этих переменных нет, скрипт выдаст ошибку.

### ✅ Зависимости

**macOS/Linux:**
- `curl` (обычно уже установлен)
- `grep` (обычно уже установлен)
- `jq` (опционально, для красивого вывода JSON)

**Windows:**
- PowerShell 5.1+ (встроен в Windows 10+)

---

## Примеры использования

### Пример 1: Простой запуск (macOS)
```bash
./scripts/view-verification-image.sh 68f1f533-06f1-4a6f-a1a7-84440f8e3ebf
```

**Вывод:**
```
🔐 Sharetribe Verification Image Viewer

📡 Получение токена доступа...
✅ Токен получен

🖼️  Получение изображения: 68f1f533-06f1-4a6f-a1a7-84440f8e3ebf
✅ URL изображения получен

🌐 Открываю в браузере...

URL: https://sharetribe.imgix.net/...

✅ Готово!
```

Изображение откроется в вашем браузере по умолчанию.

---

### Пример 2: Простой запуск (Windows)
```powershell
.\scripts\view-verification-image.ps1 68f1f533-06f1-4a6f-a1a7-84440f8e3ebf
```

---

### Пример 3: Получить только URL (без открытия браузера)

**macOS/Linux:**
```bash
# Модифицируйте скрипт или используйте curl напрямую
export CLIENT_ID="your-id"
export CLIENT_SECRET="your-secret"
export IMAGE_ID="68f1f533-06f1-4a6f-a1a7-84440f8e3ebf"

TOKEN=$(curl -s -X POST "https://flex-api.sharetribe.com/v1/auth/token" \
  -d "grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}" \
  | jq -r '.access_token')

curl "https://flex-api.sharetribe.com/v1/api/images/${IMAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq -r '.data.attributes.variants."scaled-large".url'
```

---

## Устранение неполадок

### ❌ Ошибка: "CLIENT_ID или CLIENT_SECRET не найдены"

**Решение:** Проверьте файл `.env` - он должен содержать:
```env
REACT_APP_SHARETRIBE_SDK_CLIENT_ID=...
SHARETRIBE_SDK_CLIENT_SECRET=...
```

---

### ❌ Ошибка: "Permission denied"

**Решение (macOS/Linux):**
```bash
chmod +x scripts/view-verification-image.sh
```

---

### ❌ Ошибка: "Не удалось получить токен"

**Возможные причины:**
1. Неправильные credentials в `.env`
2. Нет доступа к интернету
3. Проблемы с Sharetribe API

**Проверка credentials:**
1. **Sharetribe Console** → **Build** → **Applications**
2. Убедитесь, что Client ID и Secret совпадают с `.env`

---

### ❌ Ошибка: "Не удалось получить URL изображения"

**Возможные причины:**
1. Неверный IMAGE_ID
2. Изображение удалено
3. Нет доступа к изображению

**Проверка IMAGE_ID:**
1. Проверьте, что ID скопирован полностью
2. ID должен быть в формате UUID: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

---

## Дополнительная информация

Подробное руководство см. в **[VERIFICATION_GUIDE.md](../VERIFICATION_GUIDE.md)**

