#!/bin/bash

# Скрипт для просмотра изображений верификации
# Использование: ./scripts/view-verification-image.sh IMAGE_ID

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔐 Sharetribe Verification Image Viewer${NC}"
echo ""

# Проверка аргументов
if [ -z "$1" ]; then
    echo -e "${RED}❌ Ошибка: не указан ID изображения${NC}"
    echo ""
    echo "Использование:"
    echo "  ./scripts/view-verification-image.sh IMAGE_ID"
    echo ""
    echo "Пример:"
    echo "  ./scripts/view-verification-image.sh 68f1f533-06f1-4a6f-a1a7-84440f8e3ebf"
    exit 1
fi

IMAGE_ID=$1

# Чтение credentials из .env файла
if [ -f ".env" ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

CLIENT_ID=$REACT_APP_SHARETRIBE_SDK_CLIENT_ID
CLIENT_SECRET=$SHARETRIBE_SDK_CLIENT_SECRET

if [ -z "$CLIENT_ID" ] || [ -z "$CLIENT_SECRET" ]; then
    echo -e "${RED}❌ Ошибка: CLIENT_ID или CLIENT_SECRET не найдены в .env${NC}"
    echo ""
    echo "Убедитесь, что в .env файле есть:"
    echo "  REACT_APP_SHARETRIBE_SDK_CLIENT_ID=..."
    echo "  SHARETRIBE_SDK_CLIENT_SECRET=..."
    exit 1
fi

echo -e "${YELLOW}📡 Получение токена доступа...${NC}"

# Получить токен
TOKEN_RESPONSE=$(curl -s -X POST "https://flex-api.sharetribe.com/v1/auth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}")

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"access_token":"[^"]*' | sed 's/"access_token":"//')

if [ -z "$TOKEN" ]; then
    echo -e "${RED}❌ Ошибка получения токена${NC}"
    echo "Ответ API: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Токен получен${NC}"
echo ""
echo -e "${YELLOW}🖼️  Получение изображения: ${IMAGE_ID}${NC}"

# Получить URL изображения
IMAGE_RESPONSE=$(curl -s "https://flex-api.sharetribe.com/v1/api/images/${IMAGE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

# Попробовать извлечь разные варианты изображения
IMAGE_URL=$(echo $IMAGE_RESPONSE | grep -o '"scaled-xlarge":{"url":"[^"]*' | sed 's/"scaled-xlarge":{"url":"//' | head -1)

if [ -z "$IMAGE_URL" ]; then
    IMAGE_URL=$(echo $IMAGE_RESPONSE | grep -o '"scaled-large":{"url":"[^"]*' | sed 's/"scaled-large":{"url":"//' | head -1)
fi

if [ -z "$IMAGE_URL" ]; then
    IMAGE_URL=$(echo $IMAGE_RESPONSE | grep -o '"scaled-medium":{"url":"[^"]*' | sed 's/"scaled-medium":{"url":"//' | head -1)
fi

if [ -z "$IMAGE_URL" ]; then
    echo -e "${RED}❌ Не удалось получить URL изображения${NC}"
    echo "Ответ API: $IMAGE_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ URL изображения получен${NC}"
echo ""
echo -e "${GREEN}🌐 Открываю в браузере...${NC}"
echo ""
echo "URL: ${IMAGE_URL}"

# Открыть в браузере (работает на macOS)
if command -v open &> /dev/null; then
    open "${IMAGE_URL}"
elif command -v xdg-open &> /dev/null; then
    xdg-open "${IMAGE_URL}"
else
    echo ""
    echo -e "${YELLOW}Скопируйте URL выше и откройте в браузере вручную${NC}"
fi

echo ""
echo -e "${GREEN}✅ Готово!${NC}"

