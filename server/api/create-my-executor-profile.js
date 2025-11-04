/**
 * API endpoint для автоматического создания профильных листингов для Customer
 * 
 * POST /api/create-my-executor-profile
 * 
 * Требует авторизации Customer.
 * Автоматически создаёт "профильный листинг" для каждой категории услуг,
 * указанной в publicData.serviceCategories пользователя.
 */

const { getSdk, handleError } = require('../api-util/sdk');

module.exports = async (req, res) => {
  try {
    // Get SDK instance with current user's auth
    const sdk = getSdk(req, res);
    
    console.log('🔨 Creating executor profile for current user...');

    // Получаем данные текущего пользователя
    const currentUserResponse = await sdk.currentUser.show({
      include: ['profileImage'],
    });

    const currentUser = currentUserResponse.data.data;
    const publicData = currentUser.attributes.profile.publicData || {};
    const serviceCategories = publicData.serviceCategories;

    console.log('👤 User:', currentUser.attributes.profile.displayName);
    console.log('📋 Service Categories:', serviceCategories);

    if (!serviceCategories || !Array.isArray(serviceCategories) || serviceCategories.length === 0) {
      return res.status(400).json({
        error: 'No service categories found',
        message: 'Please add service categories to your profile first',
      });
    }

    // Создаём листинг-профиль для каждой категории
    const createdListings = [];

    for (const category of serviceCategories) {
      console.log(`\n📝 Creating profile listing for category: ${category}`);

      const listingData = {
        title: `${currentUser.attributes.profile.displayName} - Услуги в категории ${category}`,
        description: `Профиль исполнителя ${currentUser.attributes.profile.displayName}. Предоставляю услуги в категории: ${category}.`,
        publicData: {
          category: category, // Категория услуг
          listingType: 'executor-profile', // Специальный тип - профиль исполнителя
          transactionProcessAlias: 'assignment-flow-v3/release-1',
          unitType: 'item',
        },
        availabilityPlan: {
          type: 'availability-plan/time',
          entries: [
            {
              dayOfWeek: 'mon',
              startTime: '00:00',
              endTime: '00:00',
              seats: 1,
            },
          ],
        },
      };

      try {
        const createResponse = await sdk.ownListings.create(listingData, {
          expand: true,
        });

        const listingId = createResponse.data.data.id.uuid;
        console.log(`✅ Created listing: ${listingId}`);

        // Публикуем листинг
        await sdk.ownListings.publish({ id: listingId }, { expand: true });
        console.log(`✅ Published listing: ${listingId}`);

        createdListings.push({
          category,
          listingId,
          status: 'created',
        });
      } catch (err) {
        console.error(`❌ Error creating listing for category ${category}:`, err.message);
        createdListings.push({
          category,
          error: err.message,
          status: 'failed',
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Created ${createdListings.filter(l => l.status === 'created').length} profile listings`,
      listings: createdListings,
      user: {
        id: currentUser.id.uuid,
        displayName: currentUser.attributes.profile.displayName,
      },
    });
  } catch (error) {
    console.error('❌ Error creating executor profile:', error);
    handleError(res, error);
  }
};


