import React from 'react';
import { useSelector } from 'react-redux';
import { NamedRedirect } from '../../components';
import GuestListingWizard from '../GuestListingWizard/GuestListingWizard';

/**
 * Router component that decides which listing creation flow to show:
 * - Для неавторизованных: GuestListingWizard (умный UI с 5 шагами)
 * - Для авторизованных: Redirect на EditListingPage (стандартный Sharetribe UI)
 */
const NewListingPageRouter = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const isAuthenticated = !!currentUser?.id;

  console.log('🔀 NewListingPageRouter - Routing decision:', {
    isAuthenticated,
    userId: currentUser?.id?.uuid,
  });

  // Авторизованные пользователи → стандартный EditListingPage
  if (isAuthenticated) {
    console.log('✅ Authenticated user - redirecting to standard EditListingPage');
    // Используем уникальный временный ID для создания нового драфта
    const tempId = `new-${Date.now()}`;
    return <NamedRedirect name="EditListingPage" params={{ slug: 'new-draft', id: tempId, type: 'new', tab: 'details' }} />;
  }

  // Неавторизованные пользователи → GuestListingWizard
  console.log('✅ Unauthenticated user - showing GuestListingWizard');
  return <GuestListingWizard />;
};

export default NewListingPageRouter;

