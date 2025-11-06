# 🌐 DNS НАСТРОЙКИ ДЛЯ YOUDU.AE

## ✅ Домены добавлены на Heroku

- `youdu.ae` ✅
- `www.youdu.ae` ✅

---

## 📝 **Настройка DNS у регистратора домена**

### **Шаг 1: Войдите в панель управления DNS**

Откройте панель управления вашего регистратора домена (например: GoDaddy, Namecheap, Cloudflare и т.д.)

### **Шаг 2: Добавьте DNS записи**

#### **Для основного домена `youdu.ae`:**

**Вариант A: ALIAS запись (рекомендуется, если доступно)**
```
Тип:   ALIAS или ANAME
Имя:   @ (или пусто)
Target: blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com
TTL:   3600 (или Auto)
```

**Вариант B: A запись (если ALIAS недоступен)**

Если ваш регистратор не поддерживает ALIAS/ANAME, выполните:

```bash
# Получите IP адрес для Heroku DNS target
dig blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com +short
```

Затем добавьте A запись с полученным IP.

⚠️ **Внимание:** A запись с IP может устареть, лучше использовать ALIAS если доступно.

---

#### **Для поддомена `www.youdu.ae`:**

```
Тип:   CNAME
Имя:   www
Target: slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com
TTL:   3600 (или Auto)
```

---

## 🔧 **Примеры настройки для популярных регистраторов**

### **GoDaddy:**

1. Войдите в **My Products** → **DNS**
2. Нажмите **Add** в разделе Records

**Для `youdu.ae`:**
- Type: **CNAME** (или A если CNAME для root не поддерживается)
- Host: **@**
- Points to: `blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com`
- TTL: **1 hour**

**Для `www.youdu.ae`:**
- Type: **CNAME**
- Host: **www**
- Points to: `slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com`
- TTL: **1 hour**

---

### **Namecheap:**

1. Войдите в **Domain List** → выберите домен → **Advanced DNS**
2. В разделе **Host Records** нажмите **Add New Record**

**Для `youdu.ae`:**
- Type: **ALIAS Record** (или A Record)
- Host: **@**
- Value: `blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com`
- TTL: **Automatic**

**Для `www.youdu.ae`:**
- Type: **CNAME Record**
- Host: **www**
- Value: `slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com`
- TTL: **Automatic**

---

### **Cloudflare:**

1. Войдите в **DNS** → выберите домен
2. Нажмите **Add record**

**Для `youdu.ae`:**
- Type: **CNAME**
- Name: **@**
- Target: `blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com`
- Proxy status: **DNS only** (серый облачок, НЕ оранжевый!)
- TTL: **Auto**

**Для `www.youdu.ae`:**
- Type: **CNAME**
- Name: **www**
- Target: `slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com`
- Proxy status: **DNS only** (серый облачок)
- TTL: **Auto**

⚠️ **ВАЖНО для Cloudflare:** Отключите "Proxy" (используйте серый облачок, не оранжевый), иначе SSL не будет работать корректно!

---

### **Route53 (AWS):**

1. Войдите в **Route 53** → **Hosted zones** → выберите `youdu.ae`
2. Нажмите **Create record**

**Для `youdu.ae`:**
- Record type: **ALIAS**
- Name: (пусто)
- Value: `blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com`
- Routing policy: **Simple routing**

**Для `www.youdu.ae`:**
- Record type: **CNAME**
- Name: **www**
- Value: `slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com`
- TTL: **300**

---

## ⏱️ **Время ожидания DNS propagation**

После настройки DNS:
- **Минимальное время:** 15-30 минут
- **Обычное время:** 1-2 часа
- **Максимальное время:** до 48 часов (редко)

---

## ✅ **Проверка DNS настроек**

### **Онлайн инструменты:**

1. https://www.whatsmydns.net/ - проверка по всему миру
2. https://dnschecker.org/ - детальная проверка
3. https://mxtoolbox.com/DNSLookup.aspx - расширенная диагностика

### **Через терминал:**

```bash
# Проверка основного домена
dig youdu.ae

# Проверка www поддомена
dig www.youdu.ae

# Проверка CNAME записи
dig www.youdu.ae CNAME +short
```

Должно вернуть:
```
slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com.
```

---

## 🔒 **SSL сертификат**

### **Автоматический SSL от Heroku:**

Heroku автоматически выдает **бесплатный SSL сертификат** (Let's Encrypt) для custom domains на платных планах.

**Статус SSL можно проверить:**

```bash
heroku certs:auto -a youdu
```

**Время выдачи сертификата:**
- Обычно: 15-30 минут после успешной настройки DNS
- Максимум: до 24 часов

⚠️ **Требования:**
- DNS записи должны быть корректно настроены
- DNS propagation должен завершиться
- У вас должен быть платный план Heroku (Basic, Standard или Performance)

---

## 🔧 **Troubleshooting**

### **Проблема 1: DNS не обновляется**

**Решение:**
- Проверьте правильность DNS записей
- Очистите DNS кеш: `dscacheutil -flushcache` (macOS)
- Попробуйте проверить через другую сеть или VPN
- Подождите 1-2 часа для полного распространения

### **Проблема 2: SSL не работает**

**Решение:**
- Убедитесь что DNS настроен корректно
- Подождите 30 минут - 1 час для выдачи сертификата
- Проверьте статус: `heroku certs:auto -a youdu`
- Убедитесь что у вас платный plan Heroku

### **Проблема 3: Сайт не открывается**

**Решение:**
- Проверьте DNS: `dig youdu.ae`
- Проверьте Heroku dyno: `heroku ps -a youdu`
- Проверьте логи: `heroku logs --tail -a youdu`
- Убедитесь что REACT_APP_MARKETPLACE_ROOT_URL обновлен

### **Проблема 4: Redirect loop (бесконечная переадресация)**

**Решение:**
- Убедитесь что `REACT_APP_SHARETRIBE_USING_SSL=true`
- Убедитесь что `SERVER_SHARETRIBE_TRUST_PROXY=true`
- Проверьте Heroku config: `heroku config -a youdu`

---

## 📊 **Текущие настройки Heroku**

### **Переменные окружения:**

```bash
REACT_APP_MARKETPLACE_ROOT_URL=https://youdu.ae
REACT_APP_SHARETRIBE_USING_SSL=true
SERVER_SHARETRIBE_TRUST_PROXY=true
```

### **Домены:**

- **Heroku domain:** https://youdu-dd8f887d571c.herokuapp.com
- **Custom domain (root):** https://youdu.ae
- **Custom domain (www):** https://www.youdu.ae

---

## 🔗 **Полезные команды**

### **Проверить домены:**
```bash
heroku domains -a youdu
```

### **Проверить статус SSL:**
```bash
heroku certs:auto -a youdu
```

### **Добавить новый домен:**
```bash
heroku domains:add subdomain.youdu.ae -a youdu
```

### **Удалить домен:**
```bash
heroku domains:remove www.youdu.ae -a youdu
```

### **Ожидать завершения настройки домена:**
```bash
heroku domains:wait 'www.youdu.ae' -a youdu
```

---

## 📞 **Поддержка**

- **Heroku DNS Docs:** https://devcenter.heroku.com/articles/custom-domains
- **Heroku SSL Docs:** https://devcenter.heroku.com/articles/automated-certificate-management
- **DNS Propagation Check:** https://www.whatsmydns.net/

---

## ✅ **Чеклист**

- [ ] DNS записи добавлены у регистратора
- [ ] CNAME для www.youdu.ae → `slippery-mesa-mv4ik3q08zkx82fjfa22kqc5.herokudns.com`
- [ ] ALIAS для youdu.ae → `blooming-aardwolf-mk1m98ia2ipy4u56px0s1e0z.herokudns.com`
- [ ] DNS propagation завершен (проверить через whatsmydns.net)
- [ ] REACT_APP_MARKETPLACE_ROOT_URL обновлен на https://youdu.ae
- [ ] SSL сертификат выдан (проверить через `heroku certs:auto`)
- [ ] Сайт открывается на https://youdu.ae
- [ ] Сайт открывается на https://www.youdu.ae

