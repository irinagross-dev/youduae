import { useState, useEffect } from 'react';
import { loadStripe, isStripeLoaded } from '../util/loadScript';

/**
 * Hook to lazily load Stripe.js
 * Only loads Stripe when the component using it mounts
 * 
 * @returns {object} - { stripe: Stripe instance, loading: boolean, error: Error }
 */
export const useStripe = () => {
  const [stripe, setStripe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If Stripe is already loaded, use it immediately
    if (typeof window !== 'undefined' && window.Stripe) {
      setStripe(window.Stripe);
      setLoading(false);
      return;
    }

    // If already checking, wait
    if (isStripeLoaded()) {
      setStripe(window.Stripe);
      setLoading(false);
      return;
    }

    // Load Stripe script
    setLoading(true);
    loadStripe()
      .then(() => {
        if (window.Stripe) {
          setStripe(window.Stripe);
        } else {
          throw new Error('Stripe failed to initialize');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Stripe:', err);
        setError(err);
        setLoading(false);
      });
  }, []);

  return { stripe, loading, error };
};

