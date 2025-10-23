# Скрипт для просмотра изображений верификации (Windows)
# Использование: .\scripts\view-verification-image.ps1 IMAGE_ID

param(
    [Parameter(Mandatory=$true)]
    [string]$ImageId
)

Write-Host "🔐 Sharetribe Verification Image Viewer" -ForegroundColor Green
Write-Host ""

# Чтение credentials из .env файла
$envFile = ".env"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)\s*=\s*(.+)\s*$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Variable -Name $name -Value $value -Scope Script
        }
    }
}

$CLIENT_ID = $REACT_APP_SHARETRIBE_SDK_CLIENT_ID
$CLIENT_SECRET = $SHARETRIBE_SDK_CLIENT_SECRET

if (-not $CLIENT_ID -or -not $CLIENT_SECRET) {
    Write-Host "❌ Ошибка: CLIENT_ID или CLIENT_SECRET не найдены в .env" -ForegroundColor Red
    Write-Host ""
    Write-Host "Убедитесь, что в .env файле есть:"
    Write-Host "  REACT_APP_SHARETRIBE_SDK_CLIENT_ID=..."
    Write-Host "  SHARETRIBE_SDK_CLIENT_SECRET=..."
    exit 1
}

Write-Host "📡 Получение токена доступа..." -ForegroundColor Yellow

# Получить токен
$Body = @{
    grant_type = "client_credentials"
    client_id = $CLIENT_ID
    client_secret = $CLIENT_SECRET
}

try {
    $TokenResponse = Invoke-RestMethod -Uri "https://flex-api.sharetribe.com/v1/auth/token" `
        -Method Post -Body $Body -ContentType "application/x-www-form-urlencoded"
    
    $TOKEN = $TokenResponse.access_token
    
    Write-Host "✅ Токен получен" -ForegroundColor Green
    Write-Host ""
    Write-Host "🖼️  Получение изображения: $ImageId" -ForegroundColor Yellow
    
    # Получить URL изображения
    $ImageResponse = Invoke-RestMethod -Uri "https://flex-api.sharetribe.com/v1/api/images/$ImageId" `
        -Headers @{"Authorization"="Bearer $TOKEN"}
    
    $variants = $ImageResponse.data.attributes.variants
    
    # Попробовать получить лучший вариант
    $ImageURL = $null
    if ($variants.'scaled-xlarge'.url) {
        $ImageURL = $variants.'scaled-xlarge'.url
    } elseif ($variants.'scaled-large'.url) {
        $ImageURL = $variants.'scaled-large'.url
    } elseif ($variants.'scaled-medium'.url) {
        $ImageURL = $variants.'scaled-medium'.url
    } elseif ($variants.'default'.url) {
        $ImageURL = $variants.'default'.url
    }
    
    if (-not $ImageURL) {
        Write-Host "❌ Не удалось получить URL изображения" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ URL изображения получен" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Открываю в браузере..." -ForegroundColor Green
    Write-Host ""
    Write-Host "URL: $ImageURL"
    
    # Открыть в браузере
    Start-Process $ImageURL
    
    Write-Host ""
    Write-Host "✅ Готово!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Ошибка: $_" -ForegroundColor Red
    exit 1
}

