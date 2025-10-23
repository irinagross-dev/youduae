#!/bin/bash

# Скрипт для обновления transaction process в Sharetribe через flex-cli
# Использование: ./scripts/update-process.sh

set -e  # Остановить выполнение при ошибке

echo "🚀 Обновление процесса assignment-flow-v3 в Sharetribe"
echo "=================================================="
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка наличия flex-cli
if ! command -v flex-cli &> /dev/null; then
    echo -e "${RED}❌ flex-cli не установлен!${NC}"
    echo "Установите его: npm install -g @sharetribe/flex-cli"
    exit 1
fi

echo -e "${GREEN}✓ flex-cli найден${NC}"

# Проверка файла process.edn
PROCESS_FILE="./ext/transaction-processes/assignment-flow-v3/process.edn"
if [ ! -f "$PROCESS_FILE" ]; then
    echo -e "${RED}❌ Файл $PROCESS_FILE не найден!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ process.edn найден${NC}"
echo ""

# Показать изменения
echo -e "${YELLOW}📝 Изменения в процессе:${NC}"
echo "  • Добавлен transition/decline-offer"
echo "  • Исправлены actor'ы для inquire и accept-offer"
echo "  • Добавлено action/update-listing для accept-offer"
echo "  • Добавлено состояние :state/declined"
echo "  • Добавлено email уведомление для отклонённых офферов"
echo ""

# Запрос подтверждения
read -p "Продолжить обновление процесса? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Отменено пользователем"
    exit 0
fi

echo ""
echo -e "${YELLOW}🔄 Загрузка процесса в Sharetribe...${NC}"

# Получаем marketplace ID из пользовательского ввода или используем дефолтный
MARKETPLACE_ID="${MARKETPLACE_ID:-youdoae-dev}"
echo -e "${YELLOW}Using marketplace: $MARKETPLACE_ID${NC}"
echo ""

# Push процесса (указываем директорию, а не файл!)
PROCESS_DIR="./ext/transaction-processes/assignment-flow-v3/"
if flex-cli process push --process assignment-flow-v3 --marketplace "$MARKETPLACE_ID" --path "$PROCESS_DIR"; then
    echo ""
    echo -e "${GREEN}✅ Процесс успешно обновлён!${NC}"
    echo ""
    
    # Скачать обновлённый процесс для проверки
    echo -e "${YELLOW}🔍 Проверка обновлённого процесса...${NC}"
    flex-cli process pull --process assignment-flow-v3 --marketplace "$MARKETPLACE_ID" --version 3 --path ./check-process-dir
    
    # Проверить наличие decline-offer
    if grep -q "decline-offer" ./check-process-dir/process.edn; then
        echo -e "${GREEN}✓ decline-offer найден в обновлённом процессе${NC}"
    else
        echo -e "${RED}⚠️  decline-offer не найден в процессе${NC}"
    fi
    
    # Удалить временную директорию
    rm -rf ./check-process-dir
    
    echo ""
    echo -e "${YELLOW}🔄 Обновление алиаса release-1 на версию 3...${NC}"
    
    # Обновляем алиас чтобы новые транзакции использовали версию 3
    if flex-cli process update-alias --process assignment-flow-v3 --marketplace "$MARKETPLACE_ID" --alias release-1 --version 3; then
        echo -e "${GREEN}✓ Алиас release-1 успешно обновлён на версию 3${NC}"
    else
        echo -e "${RED}⚠️  Не удалось обновить алиас (возможно он уже обновлён)${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}=================================================="
    echo "🎉 Обновление завершено!"
    echo "==================================================${NC}"
    echo ""
    echo "Следующие шаги:"
    echo "  1. Протестируйте создание отклика (inquire)"
    echo "  2. Протестируйте принятие отклика (accept-offer)"
    echo "  3. Протестируйте отклонение отклика (decline-offer) ✨"
    echo "  4. Проверьте email уведомления"
    echo ""
    echo "Для просмотра событий в реальном времени:"
    echo "  flex-cli events tail"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Ошибка при обновлении процесса${NC}"
    echo "Проверьте логи выше для получения деталей"
    exit 1
fi

