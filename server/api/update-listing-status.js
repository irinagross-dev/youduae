const { getSdk, handleError, serialize } = require('../api-util/sdk');

/**
 * Обновляет publicData листинга (например, status и assignedTo).
 * Используется после accept-offer чтобы пометить листинг как "в работе".
 */
module.exports = (req, res) => {
  const { listingId, assignedTo, status } = req.body;
  const sdk = getSdk(req, res);

  if (!listingId) {
    return res.status(400).json({ error: 'listingId is required' }).end();
  }

  console.log('🔄 update-listing-status:', { listingId, assignedTo, status });

  // Обновляем publicData листинга
  const updateParams = {
    id: listingId,
    publicData: {}
  };

  if (assignedTo) {
    updateParams.publicData.assignedTo = assignedTo;
  }
  if (status) {
    updateParams.publicData.status = status;
    // Если статус "in-progress", устанавливаем hired=true
    if (status === 'in-progress') {
      updateParams.publicData.hired = true;
      console.log('  → Setting hired=true for in-progress status');
    }
  }

  // Сначала обновляем publicData
  sdk.ownListings
    .update(updateParams)
    .then(apiResponse => {
      console.log('✅ update-listing-status: publicData updated');
      
      // Если нужно закрыть листинг (при in-progress), делаем отдельный вызов
      if (status === 'in-progress') {
        console.log('  → Closing listing to hide from search...');
        return sdk.ownListings.close({ id: listingId });
      }
      
      return apiResponse;
    })
    .then(apiResponse => {
      const { status: httpStatus, statusText, data } = apiResponse;
      console.log('✅ update-listing-status: complete (listing closed if needed)');

      res
        .status(httpStatus)
        .set('Content-Type', 'application/transit+json')
        .send(
          serialize({
            status: httpStatus,
            statusText,
            data,
          })
        )
        .end();
    })
    .catch(e => {
      console.error('❌ update-listing-status error:', e?.status, e?.statusText, e?.data);
      handleError(res, e);
    });
};

