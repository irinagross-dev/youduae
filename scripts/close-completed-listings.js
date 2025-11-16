#!/usr/bin/env node

/**
 * Скрипт для закрытия листингов, связанных с завершёнными транзакциями
 * 
 * Использование:
 * node scripts/close-completed-listings.js
 */

const sharetribeSdk = require('sharetribe-flex-sdk');
require('dotenv').config();

const CLIENT_ID = process.env.SHARETRIBE_INTEGRATION_API_CLIENT_ID;
const CLIENT_SECRET = process.env.SHARETRIBE_INTEGRATION_API_CLIENT_SECRET;
const MARKETPLACE_ID = 'youdoae-dev';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Error: Missing Integration API credentials!');
  console.error('Please set the following environment variables:');
  console.error('- SHARETRIBE_INTEGRATION_API_CLIENT_ID');
  console.error('- SHARETRIBE_INTEGRATION_API_CLIENT_SECRET');
  process.exit(1);
}

const integrationSdk = sharetribeSdk.createInstance({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  baseUrl: 'https://flex-api.sharetribe.com'
});

async function closeCompletedListings() {
  try {
    console.log('🔍 Searching for completed transactions...\n');

    // Ищем завершённые транзакции
    const completedTransitions = [
      'transition/complete',
      'transition/review-1-by-provider',
      'transition/review-2-by-provider',
      'transition/review-1-by-customer',
      'transition/review-2-by-customer',
      'transition/reviewed'
    ];

    let allListingsToClose = new Set();
    
    for (const transition of completedTransitions) {
      const response = await integrationSdk.transactions.query({
        lastTransition: transition,
        include: ['listing'],
        perPage: 100
      });

      const transactions = response.data.data;
      console.log(`Found ${transactions.length} transactions with lastTransition: ${transition}`);

      transactions.forEach(tx => {
        const listing = tx.relationships?.listing?.data;
        if (listing) {
          allListingsToClose.add(listing.id.uuid);
        }
      });
    }

    console.log(`\n📋 Total unique listings to check: ${allListingsToClose.size}\n`);

    if (allListingsToClose.size === 0) {
      console.log('✅ No listings to close.');
      return;
    }

    // Проверяем и закрываем листинги
    let closed = 0;
    let alreadyClosed = 0;
    let errors = 0;

    for (const listingUuid of allListingsToClose) {
      try {
        // Получаем актуальный статус листинга
        const listingResponse = await integrationSdk.listings.show({
          id: listingUuid
        });

        const listing = listingResponse.data.data;
        const currentState = listing.attributes.state;

        console.log(`Listing ${listingUuid.slice(0, 8)}... - Current state: ${currentState}`);

        if (currentState === 'closed') {
          console.log('  ✓ Already closed\n');
          alreadyClosed++;
          continue;
        }

        if (currentState === 'published') {
          // Закрываем листинг
          await integrationSdk.listings.close({
            id: listingUuid
          });
          console.log('  ✅ CLOSED!\n');
          closed++;
        } else {
          console.log(`  ⚠️  State is '${currentState}', skipping\n`);
        }

      } catch (error) {
        console.error(`  ❌ Error closing listing ${listingUuid}:`, error.message, '\n');
        errors++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`  ✅ Closed: ${closed}`);
    console.log(`  ✓ Already closed: ${alreadyClosed}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log('='.repeat(50) + '\n');

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Запускаем скрипт
closeCompletedListings()
  .then(() => {
    console.log('✅ Script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

