import { useState, useEffect } from 'react';
import { useConfiguration } from '../context/configurationContext';
import { loadGoogleMaps, isGoogleMapsLoaded } from '../util/loadScript';

/**
 * Hook to lazily load Google Maps
 * Only loads Google Maps when the component using it mounts
 * 
 * @returns {object} - { googleMaps: google.maps, loading: boolean, error: Error }
 */
export const useGoogleMaps = () => {
  const [googleMaps, setGoogleMaps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const config = useConfiguration();
  const { maps } = config || {};
  const { mapProvider, googleMapsAPIKey } = maps || {};
  const isGoogleMapsInUse = mapProvider === 'googleMaps';

  useEffect(() => {
    // Only load if Google Maps is the configured provider
    if (!isGoogleMapsInUse || !googleMapsAPIKey) {
      setLoading(false);
      return;
    }

    // If Google Maps is already loaded, use it immediately
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      setGoogleMaps(window.google.maps);
      setLoading(false);
      return;
    }

    // If already checking, wait
    if (isGoogleMapsLoaded()) {
      setGoogleMaps(window.google.maps);
      setLoading(false);
      return;
    }

    // Load Google Maps script
    setLoading(true);
    loadGoogleMaps(googleMapsAPIKey)
      .then(() => {
        if (window.google && window.google.maps) {
          setGoogleMaps(window.google.maps);
        } else {
          throw new Error('Google Maps failed to initialize');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load Google Maps:', err);
        setError(err);
        setLoading(false);
      });
  }, [isGoogleMapsInUse, googleMapsAPIKey]);

  return { googleMaps, loading, error };
};

