const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

module.exports = (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    res.status(400).json({ error: 'Missing userId parameter' });
    return;
  }

  const integrationClientId = process.env.INTEGRATION_API_CLIENT_ID;
  const integrationClientSecret = process.env.INTEGRATION_API_CLIENT_SECRET;

  if (!integrationClientId || !integrationClientSecret) {
    console.error('❌ Integration API credentials missing');
    res.status(500).json({ error: 'Integration API not configured' });
    return;
  }

  const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: integrationClientId,
    clientSecret: integrationClientSecret,
  });

  console.log('🔍 Fetching completed transactions for customer:', userId);

  // Query ALL transactions first to see what states exist
  integrationSdk.transactions
    .query({
      customerId: userId, // Customer in transaction = executor/specialist
      // Don't filter by states initially - get all to debug
      include: ['listing', 'customer', 'provider'],
      perPage: 100,
    })
    .then(response => {
      const transactions = response.data.data || [];
      const included = response.data.included || [];

      // Debug: log all transaction states
      console.log('🔍 All transactions for customer:', {
        userId,
        total: transactions.length,
        states: transactions.map(t => ({
          id: t.id.uuid,
          lastTransition: t.attributes.lastTransition,
          processState: t.attributes.processState,
        })),
      });

      // Filter completed/reviewed transactions by lastTransition
      // In assignment-flow-v3, transitions are: transition/complete, transition/review-1-by-customer, etc.
      const completedTransitions = [
        'transition/complete',
        'transition/review-1-by-customer',
        'transition/review-2-by-customer',
        'transition/review-1-by-provider',
        'transition/review-2-by-provider',
      ];
      
      const filteredTransactions = transactions.filter(t => {
        const lastTransition = t.attributes.lastTransition;
        return completedTransitions.includes(lastTransition);
      });

      console.log('🔍 Filtered transactions:', {
        before: transactions.length,
        after: filteredTransactions.length,
        lastTransitions: filteredTransactions.map(t => t.attributes.lastTransition),
      });

      // Map filtered transactions with listing info
      const completedWorks = filteredTransactions.map(tx => {
        const listingRef = tx.relationships?.listing?.data;
        const listing = listingRef
          ? included.find(item => item.id.uuid === listingRef.id.uuid && item.type === 'listing')
          : null;

        return {
          transactionId: tx.id.uuid,
          listingId: listing?.id?.uuid,
          listingTitle: listing?.attributes?.title || 'Unnamed task',
          category: listing?.attributes?.publicData?.category,
          completedAt: tx.attributes.lastTransitionedAt || tx.attributes.createdAt,
          state: tx.attributes.lastTransition,
        };
      });

      console.log('✅ Found completed transactions:', {
        totalTransactions: transactions.length,
        completedWorks: completedWorks.length,
        states: transactions.map(t => t.attributes.lastTransition),
        sample: completedWorks[0],
      });

      res.status(200).json({
        completedWorks,
        total: completedWorks.length,
      });
    })
    .catch(err => {
      const status = err?.status || err?.statusCode;
      const data = err?.data || err?.response?.data;
      const apiErrors = data?.errors || data;

      console.error('❌ Query error:', {
        message: err?.message,
        status,
        apiErrors,
      });

      res.status(500).json({
        error: 'Query failed',
        details: err?.message,
        status,
        apiErrors,
      });
    });
};

