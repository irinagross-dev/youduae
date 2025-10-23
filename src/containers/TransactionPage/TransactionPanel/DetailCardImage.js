import React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from '../../../util/reactIntl';

import { AvatarMedium, AspectRatioWrapper, ResponsiveImage, NamedLink } from '../../../components';
import { createSlug } from '../../../util/urlHelpers';

import css from './TransactionPanel.module.css';

const DetailCardImage = props => {
  const {
    className,
    rootClassName,
    avatarWrapperClassName,
    listingTitle,
    image,
    provider,
    isCustomer,
    listingImageConfig,
    showListingImage,
    listingId,
    listingDeleted,
    showDetailsButton = false, // Новый prop для контроля показа кнопки
  } = props;
  const classes = classNames(rootClassName || css.detailCardImageWrapper, className);
  const { aspectWidth = 1, aspectHeight = 1, variantPrefix = 'listing-card' } = listingImageConfig;
  const variants = image
    ? Object.keys(image?.attributes?.variants).filter(k => k.startsWith(variantPrefix))
    : [];

  // Создаем slug из названия листинга для URL
  const listingSlug = listingTitle ? createSlug(listingTitle) : 'listing';

  return (
    <React.Fragment>
      {showListingImage && (
        <div style={{ position: 'relative' }}>
          <AspectRatioWrapper width={aspectWidth} height={aspectHeight} className={classes}>
            <ResponsiveImage
              rootClassName={css.rootForImage}
              alt={listingTitle}
              image={image}
              variants={variants}
            />
          </AspectRatioWrapper>
          {/* Кнопка "Подробности" под изображением - только для десктопной версии */}
          {showDetailsButton && listingId && !listingDeleted && (
            <NamedLink
              name="ListingPage"
              params={{ id: listingId, slug: listingSlug }}
              className={css.viewListingDetailsButton}
              onClick={(e) => {
                // Останавливаем всплытие события, чтобы родительские обработчики не блокировали навигацию
                e.stopPropagation();
                console.log('🔵 Кнопка "Подробности" нажата, переход на листинг:', listingId);
              }}
            >
              <FormattedMessage id="TransactionPanel.viewListingDetails" />
            </NamedLink>
          )}
        </div>
      )}
      {isCustomer ? (
        <div
          className={classNames(css.avatarWrapper, avatarWrapperClassName, {
            [css.noListingImage]: !showListingImage,
          })}
        >
          <div className={css.providerSection}>
            <AvatarMedium user={provider} />
            {provider?.id?.uuid && (
              <NamedLink
                name="ProfilePage"
                params={{ id: provider.id.uuid }}
                className={css.viewProfileButton}
              >
                <FormattedMessage id="TransactionPanel.viewProviderProfile" />
              </NamedLink>
            )}
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default DetailCardImage;
