/**
 * Скрипт для проверки данных верификации пользователя
 * 
 * Использование:
 * 1. Установите USER_ID пользователя, которого хотите проверить
 * 2. Запустите: node check-user-verification.js
 */

const sharetribeSdk = require('sharetribe-flex-sdk');
require('dotenv').config();

const USER_ID = '68e7affc-158e-472e-a679-bba822e92eca'; // Руслан Б

const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID,
  baseUrl: process.env.REACT_APP_SHARETRIBE_SDK_BASE_URL || 'https://flex-api.sharetribe.com',
});

async function checkUserVerification() {
  try {
    console.log('🔍 Checking verification for user:', USER_ID);
    console.log('');

    const response = await sdk.users.show({
      id: USER_ID,
      include: ['profileImage'],
    });

    const user = response.data.data;
    const profile = user.attributes.profile;
    const publicData = profile.publicData || {};
    const protectedData = profile.protectedData || {};

    console.log('✅ User data loaded:');
    console.log('  Name:', profile.displayName);
    console.log('');

    console.log('📋 Public Data:');
    console.log(JSON.stringify(publicData, null, 2));
    console.log('');

    console.log('🔒 Protected Data (verification documents):');
    if (protectedData.verificationDocuments) {
      console.log(JSON.stringify(protectedData.verificationDocuments, null, 2));
    } else {
      console.log('  No verification documents found');
    }
    console.log('');

    // Проверка isVerified
    const isVerifiedValue = publicData.isVerified;
    console.log('🎯 Verification Check:');
    console.log('  isVerified value:', isVerifiedValue);
    console.log('  Type:', typeof isVerifiedValue);
    
    if (isVerifiedValue === true) {
      console.log('  ✅ CORRECT: isVerified is boolean true');
    } else if (typeof isVerifiedValue === 'object' && isVerifiedValue?.isVerified === true) {
      console.log('  ⚠️  NESTED OBJECT: isVerified = {isVerified: true}');
      console.log('  This should be fixed to: isVerified = true');
    } else if (isVerifiedValue) {
      console.log('  ❌ UNEXPECTED FORMAT:', isVerifiedValue);
    } else {
      console.log('  ❌ NOT VERIFIED: isVerified is', isVerifiedValue);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.data) {
      console.error('Error data:', error.data);
    }
  }
}

checkUserVerification();

