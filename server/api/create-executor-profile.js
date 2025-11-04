/**
 * API endpoint для создания профильного листинга для исполнителя (Customer)
 * 
 * POST /api/create-executor-profile
 * Body: { userId, serviceCategories: ['construction', 'beauty'] }
 * 
 * Создаёт специальный листинг типа "executor-profile" для Customer,
 * который будет отображаться на страницах категорий
 */

const sharetribeSdk = require('sharetribe-flex-sdk');

module.exports = (req, res) => {
  const { userId, serviceCategories } = req.body;

  if (!userId || !serviceCategories || !Array.isArray(serviceCategories)) {
    return res.status(400).json({ 
      error: 'userId and serviceCategories (array) are required' 
    });
  }

  console.log('🔨 Creating executor profile for user:', userId);
  console.log('📋 Categories:', serviceCategories);

  // Используем Marketplace SDK с токеном пользователя
  const sdk = sharetribeSdk.createInstance({
    clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID,
  });

  // TODO: Здесь нужен токен пользователя для создания листинга
  // Это можно сделать через Integration API или через автоматизацию

  res.status(501).json({
    message: 'This endpoint requires user authentication',
    suggestion: 'Use Integration API or create profile automatically on signup',
  });
};


