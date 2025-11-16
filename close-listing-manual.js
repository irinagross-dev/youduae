// Скрипт для ручного закрытия листинга
// Используйте этот скрипт в консоли браузера на странице youdu.ae

(async function closeListingManually() {
  // ID листинга, который нужно закрыть
  const LISTING_ID = '691924cf-b7f5-4586-89f2-76c54941855f'; // Замените на ваш ID
  
  try {
    console.log('🔒 Attempting to close listing:', LISTING_ID);
    
    // Импортируем функцию из util/api
    const { closeListing } = await import('./src/util/api.js');
    
    // Создаём объект ID для SDK
    const listingId = { uuid: LISTING_ID };
    
    // Закрываем листинг
    const result = await closeListing(listingId);
    
    console.log('✅ Listing closed successfully!', result);
    console.log('🔄 Reloading page...');
    
    // Перезагружаем страницу
    setTimeout(() => window.location.reload(), 1000);
    
  } catch (error) {
    console.error('❌ Failed to close listing:', error);
    console.error('Error details:', error.message, error.stack);
  }
})();

