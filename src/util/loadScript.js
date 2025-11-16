/**
 * Utility to lazily load external scripts
 * Only loads scripts when they are actually needed
 */

const loadedScripts = new Set();
const loadingScripts = new Map();

/**
 * Dynamically load a script
 * @param {string} src - Script URL
 * @param {string} id - Unique script ID
 * @param {object} options - Additional script attributes
 * @returns {Promise} - Resolves when script is loaded
 */
export const loadScript = (src, id, options = {}) => {
  // If already loaded, return immediately
  if (loadedScripts.has(id)) {
    return Promise.resolve();
  }

  // If currently loading, return existing promise
  if (loadingScripts.has(id)) {
    return loadingScripts.get(id);
  }

  // Check if script already exists in DOM
  const existingScript = document.getElementById(id);
  if (existingScript) {
    loadedScripts.add(id);
    return Promise.resolve();
  }

  // Create new script element
  const loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    
    // Apply additional options
    Object.keys(options).forEach(key => {
      script[key] = options[key];
    });

    script.onload = () => {
      loadedScripts.add(id);
      loadingScripts.delete(id);
      resolve();
    };

    script.onerror = () => {
      loadingScripts.delete(id);
      reject(new Error(`Failed to load script: ${src}`));
    };

    document.head.appendChild(script);
  });

  loadingScripts.set(id, loadPromise);
  return loadPromise;
};

/**
 * Load Stripe.js
 * @returns {Promise} - Resolves when Stripe is loaded
 */
export const loadStripe = () => {
  return loadScript('https://js.stripe.com/v3/', 'stripe-js', {
    crossOrigin: 'anonymous',
  });
};

/**
 * Load Google Maps
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise} - Resolves when Google Maps is loaded
 */
export const loadGoogleMaps = (apiKey) => {
  const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  return loadScript(src, 'google-maps-js', {
    crossOrigin: 'anonymous',
  });
};

/**
 * Check if Stripe is loaded
 * @returns {boolean}
 */
export const isStripeLoaded = () => {
  return typeof window !== 'undefined' && window.Stripe && loadedScripts.has('stripe-js');
};

/**
 * Check if Google Maps is loaded
 * @returns {boolean}
 */
export const isGoogleMapsLoaded = () => {
  return typeof window !== 'undefined' && window.google && window.google.maps && loadedScripts.has('google-maps-js');
};

