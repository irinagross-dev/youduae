/**
 * Hook for handling guest listing creation after authentication
 */
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { getGuestListingData, clearGuestListingData } from '../util/guestListingStorage';
import { createGuestListing } from '../util/api';

const useGuestListingCreation = (isAuthenticated) => {
  const history = useHistory();
  const location = useLocation();
  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [creationError, setCreationError] = useState(null);

  useEffect(() => {
    // Check if user just authenticated and wants to create a listing
    // Check both URL params and localStorage (in case URL params were lost during redirect)
    const searchParams = new URLSearchParams(location.search);
    const urlIntent = searchParams.get('intent');
    const localStorageIntent = typeof window !== 'undefined' 
      ? localStorage.getItem('pendingListingIntent') 
      : null;
    
    const intent = urlIntent || localStorageIntent;
    
    console.log('🔍 Checking guest listing creation:', {
      isAuthenticated,
      urlIntent,
      localStorageIntent,
      intent,
      isCreatingListing,
    });
    
    if (isAuthenticated && intent === 'createListing' && !isCreatingListing) {
      const guestData = getGuestListingData();
      
      console.log('📦 Guest data from localStorage:', guestData);
      
      if (guestData) {
        console.log('✅ User authenticated, creating listing from guest data...');
        setIsCreatingListing(true);
        
        createGuestListing(guestData)
          .then(response => {
            console.log('✅ Listing created successfully:', response);
            
            // Clear guest data and intent
            clearGuestListingData();
            if (typeof window !== 'undefined') {
              localStorage.removeItem('pendingListingIntent');
            }
            
            // Redirect to the new listing
            const listingId = response.listingId;
            const slug = guestData.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            
            console.log('🎉 Redirecting to listing:', `/l/${slug}/${listingId}`);
            history.push(`/l/${slug}/${listingId}`);
            setIsCreatingListing(false);
          })
          .catch(error => {
            console.error('❌ Failed to create listing:', error);
            console.error('Error details:', error.response || error.message);
            setCreationError(error);
            setIsCreatingListing(false);
            
            // Clear intent even on error
            if (typeof window !== 'undefined') {
              localStorage.removeItem('pendingListingIntent');
            }
            
            // Redirect to EditListingPage anyway so user can manually create
            console.log('⚠️ Redirecting to manual listing creation...');
            history.push('/l/new-draft/draft/new/details');
          });
      } else {
        console.log('⚠️ No guest data found in localStorage, clearing intent');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('pendingListingIntent');
        }
      }
    }
  }, [isAuthenticated, location.search, history, isCreatingListing]);

  return { isCreatingListing, creationError };
};

export default useGuestListingCreation;

