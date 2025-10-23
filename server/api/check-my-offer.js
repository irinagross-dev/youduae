const { getSdk, handleError, serialize } = require('../api-util/sdk');

/**
 * Check if current user has already sent an offer for this listing
 * Returns { hasOffer: boolean, transactionId: string | null }
 */
module.exports = (req, res) => {
  const { listingId } = req.query;

  if (!listingId) {
    return res.status(400).json({ error: 'listingId is required' }).end();
  }

  const sdk = getSdk(req, res);

  console.log('🔍 check-my-offer: checking for listing', listingId);

  // Запрашиваем ВСЕ транзакции для этого листинга где текущий пользователь - customer
  const queryParams = {
    listingId,
    only: 'order', // текущий пользователь как customer (исполнитель)
    perPage: 100, // увеличим для надёжности
  };
  
  console.log('   Query params:', JSON.stringify(queryParams));

  sdk.transactions
    .query(queryParams)
    .then(apiResponse => {
      const { status, statusText, data } = apiResponse;
      const transactions = data.data || [];
      const hasOffer = transactions.length > 0;
      const transactionId = hasOffer ? transactions[0].id.uuid : null;
      
      // Получаем lastTransition для проверки статуса (declined, accepted, etc)
      const lastTransition = hasOffer ? transactions[0].attributes.lastTransition : null;
      
      // Определяем статус отклика
      let offerStatus = null;
      if (lastTransition === 'transition/decline-offer') {
        offerStatus = 'declined';
      } else if (lastTransition === 'transition/accept-offer') {
        offerStatus = 'accepted';
      } else if (lastTransition === 'transition/inquire') {
        offerStatus = 'pending';
      } else if (lastTransition === 'transition/complete') {
        offerStatus = 'completed';
      }

      console.log('✅ check-my-offer: found', transactions.length, 'transactions, hasOffer =', hasOffer, ', txId =', transactionId, ', offerStatus =', offerStatus);
      if (transactions.length > 0) {
        console.log('   First transaction lastTransition:', lastTransition);
      }

      res
        .status(status)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status,
            statusText,
            data: {
              hasOffer,
              transactionId,
              offerStatus,
              lastTransition,
            },
          })
        )
        .end();
    })
    .catch(e => {
      console.error('❌ check-my-offer error:', e?.status, e?.statusText);
      handleError(res, e);
    });
};

