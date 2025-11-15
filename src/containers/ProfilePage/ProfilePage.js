import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { useConfiguration } from '../../context/configurationContext';
import { FormattedMessage, useIntl } from '../../util/reactIntl';
import {
  REVIEW_TYPE_OF_PROVIDER,
  REVIEW_TYPE_OF_CUSTOMER,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_YOUTUBE,
  propTypes,
} from '../../util/types';
import {
  NO_ACCESS_PAGE_USER_PENDING_APPROVAL,
  NO_ACCESS_PAGE_VIEW_LISTINGS,
  PROFILE_PAGE_PENDING_APPROVAL_VARIANT,
} from '../../util/urlHelpers';
import {
  isErrorNoViewingPermission,
  isErrorUserPendingApproval,
  isForbiddenError,
  isNotFoundError,
} from '../../util/errors';
import { pickCustomFieldProps } from '../../util/fieldHelpers';
import {
  getCurrentUserTypeRoles,
  hasPermissionToViewData,
  isUserAuthorized,
} from '../../util/userHelpers';
import { richText } from '../../util/richText';

import { isScrollingDisabled } from '../../ducks/ui.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import {
  Heading,
  H2,
  H4,
  Page,
  AvatarLarge,
  NamedLink,
  ListingCard,
  Reviews,
  ButtonTabNavHorizontal,
  LayoutSideNavigation,
  NamedRedirect,
  VerificationBadge,
} from '../../components';

import TopbarContainer from '../../containers/TopbarContainer/TopbarContainer';
import FooterContainer from '../../containers/FooterContainer/FooterContainer';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';

import css from './ProfilePage.module.css';
import SectionDetailsMaybe from './SectionDetailsMaybe';
import SectionTextMaybe from './SectionTextMaybe';
import SectionMultiEnumMaybe from './SectionMultiEnumMaybe';
import SectionYoutubeVideoMaybe from './SectionYoutubeVideoMaybe';
import SectionPortfolio from './SectionPortfolio';

const MAX_MOBILE_SCREEN_WIDTH = 768;
const MIN_LENGTH_FOR_LONG_WORDS = 20;

const capitalizeFirstLetter = str =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : str;

const formatRegistrationDate = (dateValue, intl) => {
  if (!dateValue) {
    return null;
  }

  const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatted = intl.formatDate(date, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (intl.locale?.toLowerCase().startsWith('ru')) {
    const withoutSuffix = formatted.replace(/ г\.?$/i, '').trim();
    const parts = withoutSuffix.split(/\s+/);
    if (parts.length >= 3) {
      const [day, month, year] = parts;
      const monthCapitalized = capitalizeFirstLetter(month);
      return `${day} ${monthCapitalized} ${year} года`;
    }
  }

  return formatted;
};

export const AsideContent = props => {
  const { user, displayName, showLinkToProfileSettingsPage } = props;
  const isVerified = user?.attributes?.profile?.publicData?.isVerified;

  return (
    <div className={css.asideContent}>
      <AvatarLarge className={css.avatar} user={user} disableProfileLink />
      <H2 as="h1" className={css.mobileHeading}>
        {displayName ? (
          <>
            <FormattedMessage id="ProfilePage.mobileHeading" values={{ name: displayName }} />
            <VerificationBadge isVerified={isVerified} />
          </>
        ) : null}
      </H2>
      {showLinkToProfileSettingsPage ? (
        <>
          <NamedLink className={css.editLinkMobile} name="ProfileSettingsPage">
            <FormattedMessage id="ProfilePage.editProfileLinkMobile" />
          </NamedLink>
          <NamedLink className={css.editLinkDesktop} name="ProfileSettingsPage">
            <FormattedMessage id="ProfilePage.editProfileLinkDesktop" />
          </NamedLink>
        </>
      ) : null}
    </div>
  );
};

export const ReviewsErrorMaybe = props => {
  const { queryReviewsError } = props;
  return queryReviewsError ? (
    <p className={css.error}>
      <FormattedMessage id="ProfilePage.loadingReviewsFailed" />
    </p>
  ) : null;
};

export const MobileReviews = props => {
  const { reviews, queryReviewsError, userTypeRoles } = props;
  const reviewsOfProvider = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER);
  const reviewsOfCustomer = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_CUSTOMER);

  const showListingOwnerReviews = !!userTypeRoles?.customer;
  const showServiceProviderReviews = !!userTypeRoles?.provider;

  if (!showListingOwnerReviews && !showServiceProviderReviews) {
    return null;
  }

  return (
    <div className={css.mobileReviews}>
      {showListingOwnerReviews ? (
        <>
          <H4 as="h2" className={css.mobileReviewsTitle}>
            <FormattedMessage
              id="ProfilePage.reviewsFromMyCustomersTitle"
              values={{ count: reviewsOfProvider.length }}
            />
          </H4>
          <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />
          <Reviews reviews={reviewsOfProvider} />
        </>
      ) : null}

      {showServiceProviderReviews ? (
        <>
          <H4 as="h2" className={css.mobileReviewsTitle}>
            <FormattedMessage
              id="ProfilePage.reviewsAsACustomerTitle"
              values={{ count: reviewsOfCustomer.length }}
            />
          </H4>
          <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />
          <Reviews reviews={reviewsOfCustomer} />
        </>
      ) : null}
    </div>
  );
};

export const DesktopReviews = props => {
  const { reviews, queryReviewsError, userTypeRoles } = props;
  const { customer: canCreateListings, provider: isServiceProvider } = userTypeRoles;

  const reviewsOfProvider = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER);
  const reviewsOfCustomer = reviews.filter(r => r.attributes.type === REVIEW_TYPE_OF_CUSTOMER);

  const showListingOwnerReviews = !!canCreateListings;
  const showServiceProviderReviews = !!isServiceProvider;

  if (!showListingOwnerReviews && !showServiceProviderReviews) {
    return null;
  }

  const initialReviewState = showListingOwnerReviews
    ? REVIEW_TYPE_OF_PROVIDER
    : REVIEW_TYPE_OF_CUSTOMER;
  const [showReviewsType, setShowReviewsType] = useState(initialReviewState);

  const isReviewTypeProviderSelected = showReviewsType === REVIEW_TYPE_OF_PROVIDER;
  const isReviewTypeCustomerSelected = showReviewsType === REVIEW_TYPE_OF_CUSTOMER;

  const providerTab = showListingOwnerReviews
    ? [
        {
          text: (
            <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
              <FormattedMessage
                id="ProfilePage.reviewsFromMyCustomersTitle"
                values={{ count: reviewsOfProvider.length }}
              />
            </Heading>
          ),
          selected: isReviewTypeProviderSelected,
          onClick: () => setShowReviewsType(REVIEW_TYPE_OF_PROVIDER),
        },
      ]
    : [];

  const customerTab = showServiceProviderReviews
    ? [
        {
          text: (
            <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
              <FormattedMessage
                id="ProfilePage.reviewsAsACustomerTitle"
                values={{ count: reviewsOfCustomer.length }}
              />
            </Heading>
          ),
          selected: isReviewTypeCustomerSelected,
          onClick: () => setShowReviewsType(REVIEW_TYPE_OF_CUSTOMER),
        },
      ]
    : [];

  const desktopReviewTabs = [...providerTab, ...customerTab];

  if (desktopReviewTabs.length <= 1) {
    return (
      <div className={css.desktopReviews}>
        <div className={css.desktopReviewsWrapper}>
          {showListingOwnerReviews ? (
            <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
              <FormattedMessage
                id="ProfilePage.reviewsFromMyCustomersTitle"
                values={{ count: reviewsOfProvider.length }}
              />
            </Heading>
          ) : (
            <Heading as="h3" rootClassName={css.desktopReviewsTitle}>
              <FormattedMessage
                id="ProfilePage.reviewsAsACustomerTitle"
                values={{ count: reviewsOfCustomer.length }}
              />
            </Heading>
          )}
          <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />
          <Reviews
            reviews={showListingOwnerReviews ? reviewsOfProvider : reviewsOfCustomer}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={css.desktopReviews}>
      <div className={css.desktopReviewsWrapper}>
        <ButtonTabNavHorizontal className={css.desktopReviewsTabNav} tabs={desktopReviewTabs} />

        <ReviewsErrorMaybe queryReviewsError={queryReviewsError} />

        {isReviewTypeProviderSelected ? (
          <Reviews reviews={reviewsOfProvider} />
        ) : (
          <Reviews reviews={reviewsOfCustomer} />
        )}
      </div>
    </div>
  );
};

export const ListingOwnerStats = props => {
  const { reviews, user, userTypeRoles, completedTaskCount = 0 } = props;
  const intl = useIntl();
  
  const canCreateListings = !!userTypeRoles?.customer;
  const isPureProvider = canCreateListings && !userTypeRoles?.provider;

  const tasksLabelId = isPureProvider
    ? 'ProfilePage.proposedTasks'
    : 'ProfilePage.completedTasks';

  // Статистика только для владельцев заданий (могут создавать листинги)
  if (!canCreateListings) {
    return null;
  }

  // Отзывы о владельце задания (тип ofProvider)
  const reviewsOfListingOwner = reviews.filter(
    r => r.attributes.type === REVIEW_TYPE_OF_PROVIDER
  );
  
  // Расчёт среднего рейтинга
  const calculateAverageRating = reviews => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.attributes.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating(reviewsOfListingOwner);
  const completedTasks = Math.max(completedTaskCount, reviewsOfListingOwner.length);
  
  // Дата регистрации
  const createdAt = user?.attributes?.createdAt;
  const registrationDate = formatRegistrationDate(createdAt, intl);

  // Отображаем звезды с точным расчётом
  const renderStars = rating => {
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        // Полная золотая звезда
        stars.push(
          <span key={`star-${i}`} style={{ color: '#FFD700', fontSize: '20px' }}>
            ★
          </span>
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        // Половинная звезда (используем позиционирование)
        stars.push(
          <span 
            key={`star-${i}`} 
            style={{ 
              position: 'relative', 
              display: 'inline-block',
              fontSize: '20px',
            }}
          >
            <span style={{ color: '#E0E0E0' }}>★</span>
            <span 
              style={{ 
                position: 'absolute',
                left: 0,
                top: 0,
                width: '50%',
                overflow: 'hidden',
                color: '#FFD700',
              }}
            >
              ★
            </span>
          </span>
        );
      } else {
        // Пустая серая звезда
        stars.push(
          <span key={`star-${i}`} style={{ color: '#E0E0E0', fontSize: '20px' }}>
            ★
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className={css.customerStats}>
      <div className={css.statsGrid}>
        {/* Рейтинг */}
        <div className={css.statItem}>
          <div className={css.statLabel}>
            <FormattedMessage id="ProfilePage.rating" />
          </div>
          <div className={css.statValue}>
            <div className={css.starsContainer}>
              {renderStars(parseFloat(averageRating))}
              <span className={css.ratingNumber}>{averageRating}</span>
            </div>
          </div>
        </div>

        {/* Количество выполненных заданий */}
        <div className={css.statItem}>
          <div className={css.statLabel}>
            <FormattedMessage id={tasksLabelId} />
          </div>
          <div className={css.statValue}>
            <span className={css.taskCount}>{completedTasks}</span>
          </div>
        </div>

        {/* Дата регистрации */}
        {registrationDate && (
          <div className={css.statItem}>
            <div className={css.statLabel}>
              <FormattedMessage id="ProfilePage.memberSince" />
            </div>
            <div className={css.statValue}>
              <span className={css.dateValue}>{registrationDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const CustomUserFields = props => {
  const { publicData, metadata, userFieldConfig } = props;

  const shouldPickUserField = fieldConfig => fieldConfig?.showConfig?.displayInProfile !== false;
  const propsForCustomFields =
    pickCustomFieldProps(publicData, metadata, userFieldConfig, 'userType', shouldPickUserField) ||
    [];

  return (
    <>
      <SectionDetailsMaybe {...props} />
      {propsForCustomFields.map(customFieldProps => {
        const { schemaType, key, ...fieldProps } = customFieldProps;
        return schemaType === SCHEMA_TYPE_MULTI_ENUM ? (
          <SectionMultiEnumMaybe key={key} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_TEXT ? (
          <SectionTextMaybe key={key} {...fieldProps} />
        ) : schemaType === SCHEMA_TYPE_YOUTUBE ? (
          <SectionYoutubeVideoMaybe key={key} {...fieldProps} />
        ) : null;
      })}
    </>
  );
};

export const MainContent = props => {
  const [mounted, setMounted] = useState(false);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    user,
    userShowError,
    bio,
    displayName,
    listings,
    queryListingsError,
    reviews = [],
    queryReviewsError,
    publicData,
    metadata,
    userFieldConfig,
    intl,
    hideReviews,
    userTypeRoles,
  } = props;

  // Load completed transactions for Customer (specialists)
  useEffect(() => {
    if (user?.id?.uuid && userTypeRoles.provider) {
      // This is a Customer (specialist) - load their completed transactions
      setLoadingTransactions(true);
      console.log('🔍 Loading completed transactions for Customer:', user.id.uuid);
      import('../../util/api')
        .then(module => module.getUserCompletedTransactions(user.id.uuid))
        .then(response => {
          console.log('✅ Loaded completed transactions:', response);
          setCompletedTransactions(response.completedWorks || []);
          setLoadingTransactions(false);
        })
        .catch(error => {
          console.error('❌ Failed to load completed transactions:', error);
          setLoadingTransactions(false);
        });
    }
  }, [user?.id?.uuid, userTypeRoles.provider]);

  const openListings = listings.filter(l => l?.attributes?.state === 'published');
  const closedListings = listings.filter(l => l?.attributes?.state === 'closed');
  const hasOpenListings = openListings.length > 0;
  const hasClosedListings = closedListings.length > 0;
  const hasMatchMedia = typeof window !== 'undefined' && window?.matchMedia;
  const isMobileLayout =
    mounted && hasMatchMedia
      ? window.matchMedia(`(max-width: ${MAX_MOBILE_SCREEN_WIDTH}px)`)?.matches
      : true;

  const hasBio = !!bio;
  const bioWithLinks = richText(bio, {
    linkify: true,
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
  });

  const listingsContainerClasses = classNames(css.listingsContainer, {
    [css.withBioMissingAbove]: !hasBio,
  });

  if (userShowError || queryListingsError) {
    return (
      <p className={css.error}>
        <FormattedMessage id="ProfilePage.loadingDataFailed" />
      </p>
    );
  }
  const isVerified = user?.attributes?.profile?.publicData?.isVerified;

  return (
    <div>
      <H2 as="h1" className={css.desktopHeading}>
        <FormattedMessage id="ProfilePage.desktopHeading" values={{ name: displayName }} />
        <VerificationBadge isVerified={isVerified} />
      </H2>
      {hasBio ? <p className={css.bio}>{bioWithLinks}</p> : null}

      {/* Статистика владельца заданий */}
      <ListingOwnerStats
        reviews={reviews}
        user={user}
        userTypeRoles={userTypeRoles}
        completedTaskCount={userTypeRoles.customer ? closedListings.length : completedTransactions.length}
      />

      {displayName ? (
        <CustomUserFields
          publicData={publicData}
          metadata={metadata}
          userFieldConfig={userFieldConfig}
          intl={intl}
        />
      ) : null}

      {/* Portfolio section for Customer (specialists) only */}
      {userTypeRoles.provider && publicData.portfolioItems?.length > 0 ? (
        <SectionPortfolio
          portfolioItems={publicData.portfolioItems}
          user={user}
          intl={intl}
        />
      ) : null}

      {/* Open listings section - only for Provider (can create listings) */}
      {userTypeRoles.customer ? (
        hasOpenListings ? (
          <div className={listingsContainerClasses}>
            <H4 as="h2" className={css.listingsTitle}>
              <FormattedMessage
                id="ProfilePage.openListingsTitle"
                values={{ count: openListings.length }}
              />
            </H4>
            <ul className={css.listings}>
              {openListings.map(l => (
                <li className={css.listing} key={l.id.uuid}>
                  <ListingCard listing={l} showAuthorInfo={false} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={listingsContainerClasses}>
            <H4 as="h2" className={css.listingsTitle}>
              <FormattedMessage id="ProfilePage.openListingsTitle" values={{ count: 0 }} />
            </H4>
            <p className={css.emptyState}>
              <FormattedMessage id="ProfilePage.emptyOpenListings" />
            </p>
          </div>
        )
      ) : null}
      {/* Completed tasks section */}
      {userTypeRoles.customer ? (
        // For Provider (creates listings) - show closed listings
        hasClosedListings ? (
          <div className={classNames(css.listingsContainer, css.completedListings)}>
            <H4 as="h2" className={css.listingsTitle}>
              <FormattedMessage
                id="ProfilePage.completedListingsTitle"
                values={{ count: closedListings.length }}
              />
            </H4>
            <ul className={css.listings}>
              {closedListings.map(l => (
                <li className={css.listing} key={l.id.uuid}>
                  <ListingCard listing={l} showAuthorInfo={false} />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className={classNames(css.listingsContainer, css.completedListings)}>
            <H4 as="h2" className={css.listingsTitle}>
              <FormattedMessage id="ProfilePage.completedListingsTitle" values={{ count: 0 }} />
            </H4>
            <p className={css.emptyState}>
              <FormattedMessage id="ProfilePage.emptyCompletedListings" />
            </p>
          </div>
        )
      ) : completedTransactions.length > 0 ? (
        // For Customer (specialist) - show completed transactions
        <div className={classNames(css.listingsContainer, css.completedListings)}>
          <H4 as="h2" className={css.listingsTitle}>
            <FormattedMessage
              id="ProfilePage.completedTasksTitle"
              values={{ count: completedTransactions.length }}
            />
          </H4>
          <div className={css.completedTasksList}>
            {completedTransactions.map(work => (
              <div key={work.transactionId} className={css.completedTaskItem}>
                <div className={css.taskIcon}>✓</div>
                <div className={css.taskInfo}>
                  <h4 className={css.taskTitle}>{work.listingTitle}</h4>
                  <p className={css.taskDate}>
                    {new Date(work.completedAt).toLocaleDateString(intl.locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : !loadingTransactions && userTypeRoles.provider ? (
        <div className={classNames(css.listingsContainer, css.completedListings)}>
          <H4 as="h2" className={css.listingsTitle}>
            <FormattedMessage id="ProfilePage.completedTasksTitle" values={{ count: 0 }} />
          </H4>
          <p className={css.emptyState}>
            <FormattedMessage id="ProfilePage.emptyCompletedTasks" />
          </p>
        </div>
      ) : null}
      {hideReviews ? null : isMobileLayout ? (
        <MobileReviews
          reviews={reviews}
          queryReviewsError={queryReviewsError}
          userTypeRoles={userTypeRoles}
        />
      ) : (
        <DesktopReviews
          reviews={reviews}
          queryReviewsError={queryReviewsError}
          userTypeRoles={userTypeRoles}
        />
      )}
    </div>
  );
};

/**
 * ProfilePageComponent
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.scrollingDisabled - Whether the scrolling is disabled
 * @param {propTypes.currentUser} props.currentUser - The current user
 * @param {boolean} props.useCurrentUser - Whether to use the current user
 * @param {propTypes.user|propTypes.currentUser} props.user - The user
 * @param {propTypes.error} props.userShowError - The user show error
 * @param {propTypes.error} props.queryListingsError - The query listings error
 * @param {Array<propTypes.listing|propTypes.ownListing>} props.listings - The listings
 * @param {Array<propTypes.review>} props.reviews - The reviews
 * @param {propTypes.error} props.queryReviewsError - The query reviews error
 * @returns {JSX.Element} ProfilePageComponent
 */
export const ProfilePageComponent = props => {
  const config = useConfiguration();
  const intl = useIntl();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    scrollingDisabled,
    params: pathParams,
    currentUser,
    useCurrentUser,
    userShowError,
    user,
    ...rest
  } = props;
  const isVariant = pathParams.variant?.length > 0;
  const isPreview = isVariant && pathParams.variant === PROFILE_PAGE_PENDING_APPROVAL_VARIANT;

  // Stripe's onboarding needs a business URL for each seller, but the profile page can be
  // too empty for the provider at the time they are creating their first listing.
  // To remedy the situation, we redirect Stripe's crawler to the landing page of the marketplace.
  // TODO: When there's more content on the profile page, we should consider by-passing this redirection.
  const searchParams = rest?.location?.search;
  const isStorefront = searchParams
    ? new URLSearchParams(searchParams)?.get('mode') === 'storefront'
    : false;
  if (isStorefront) {
    return <NamedRedirect name="LandingPage" />;
  }

  const isCurrentUser = currentUser?.id && currentUser?.id?.uuid === pathParams.id;
  const profileUser = useCurrentUser ? currentUser : user;
  const { bio, displayName, publicData, metadata } = profileUser?.attributes?.profile || {};
  const { userFields } = config.user;
  const isPrivateMarketplace = config.accessControl.marketplace.private === true;
  const isUnauthorizedUser = currentUser && !isUserAuthorized(currentUser);
  const isUnauthorizedOnPrivateMarketplace = isPrivateMarketplace && isUnauthorizedUser;
  const hasUserPendingApprovalError = isErrorUserPendingApproval(userShowError);
  const hasNoViewingRightsUser = currentUser && !hasPermissionToViewData(currentUser);
  const hasNoViewingRightsOnPrivateMarketplace = isPrivateMarketplace && hasNoViewingRightsUser;

  const userTypeRoles = getCurrentUserTypeRoles(config, profileUser);

  const isDataLoaded = isPreview
    ? currentUser != null || userShowError != null
    : hasNoViewingRightsOnPrivateMarketplace
    ? currentUser != null || userShowError != null
    : user != null || userShowError != null;

  const schemaTitleVars = { name: displayName, marketplaceName: config.marketplaceName };
  const schemaTitle = intl.formatMessage({ id: 'ProfilePage.schemaTitle' }, schemaTitleVars);

  if (!isDataLoaded) {
    return null;
  } else if (!isPreview && isNotFoundError(userShowError)) {
    return <NotFoundPage staticContext={props.staticContext} />;
  } else if (!isPreview && (isUnauthorizedOnPrivateMarketplace || hasUserPendingApprovalError)) {
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_USER_PENDING_APPROVAL }}
      />
    );
  } else if (
    (!isPreview && hasNoViewingRightsOnPrivateMarketplace && !isCurrentUser) ||
    isErrorNoViewingPermission(userShowError)
  ) {
    // Someone without viewing rights on a private marketplace is trying to
    // view a profile page that is not their own – redirect to NoAccessPage
    return (
      <NamedRedirect
        name="NoAccessPage"
        params={{ missingAccessRight: NO_ACCESS_PAGE_VIEW_LISTINGS }}
      />
    );
  } else if (!isPreview && isForbiddenError(userShowError)) {
    // This can happen if private marketplace mode is active, but it's not reflected through asset yet.
    return (
      <NamedRedirect
        name="SignupPage"
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  } else if (isPreview && mounted && !isCurrentUser) {
    // Someone is manipulating the URL, redirect to current user's profile page.
    return isCurrentUser === false ? (
      <NamedRedirect name="ProfilePage" params={{ id: currentUser?.id?.uuid }} />
    ) : null;
  } else if ((isPreview || isPrivateMarketplace) && !mounted) {
    // This preview of the profile page is not rendered on server-side
    // and the first pass on client-side should render the same UI.
    return null;
  }

  // This is rendering normal profile page (not preview for pending-approval)
  return (
    <Page
      scrollingDisabled={scrollingDisabled}
      title={schemaTitle}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'ProfilePage',
        mainEntity: {
          '@type': 'Person',
          name: profileUser?.attributes?.profile?.displayName,
        },
        name: schemaTitle,
      }}
    >
      <LayoutSideNavigation
        sideNavClassName={css.aside}
        topbar={<TopbarContainer />}
        sideNav={
          <AsideContent
            user={profileUser}
            showLinkToProfileSettingsPage={mounted && isCurrentUser}
            displayName={displayName}
          />
        }
        footer={<FooterContainer />}
      >
        <MainContent
          user={profileUser}
          bio={bio}
          displayName={displayName}
          userShowError={userShowError}
          publicData={publicData}
          metadata={metadata}
          userFieldConfig={userFields}
          hideReviews={hasNoViewingRightsOnPrivateMarketplace}
          intl={intl}
          userTypeRoles={userTypeRoles}
          {...rest}
        />
      </LayoutSideNavigation>
    </Page>
  );
};

const mapStateToProps = state => {
  const { currentUser } = state.user;
  const {
    userId,
    userShowError,
    queryListingsError,
    userListingRefs,
    reviews = [],
    queryReviewsError,
  } = state.ProfilePage;
  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;

  // Show currentUser's data if it's not approved yet
  const isCurrentUser = userId?.uuid === currentUser?.id?.uuid;
  const useCurrentUser =
    isCurrentUser && !(isUserAuthorized(currentUser) && hasPermissionToViewData(currentUser));

  return {
    scrollingDisabled: isScrollingDisabled(state),
    currentUser,
    useCurrentUser,
    user,
    userShowError,
    queryListingsError,
    listings: getMarketplaceEntities(state, userListingRefs),
    reviews,
    queryReviewsError,
  };
};

const ProfilePage = compose(connect(mapStateToProps))(ProfilePageComponent);

export default ProfilePage;
