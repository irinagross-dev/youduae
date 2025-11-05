import React from 'react';
import { Heading, PropertyGroup } from '../../components';
import { useIntl } from '../../util/reactIntl';

import css from './ProfilePage.module.css';

const SectionMultiEnumMaybe = props => {
  const { heading, options, selectedOptions, showUnselectedOptions = true } = props;
  const intl = useIntl();
  
  const hasContent = showUnselectedOptions || selectedOptions?.length > 0;
  if (!heading || !options || !hasContent) {
    return null;
  }

  // Переводим heading если это translation key
  const translatedHeading = heading && typeof heading === 'string' && heading.includes('.')
    ? intl.formatMessage({ id: heading, defaultMessage: heading })
    : heading;

  // Переводим labels в options если они translation keys
  const translatedOptions = options?.map(opt => ({
    ...opt,
    label: opt.label && typeof opt.label === 'string' && opt.label.includes('.')
      ? intl.formatMessage({ id: opt.label, defaultMessage: opt.label })
      : opt.label,
  }));

  return (
    <div className={css.sectionMultiEnum}>
      <Heading as="h2" rootClassName={css.sectionHeading}>
        {translatedHeading}
      </Heading>
      <PropertyGroup
        id="ListingPage.amenities"
        options={translatedOptions}
        selectedOptions={selectedOptions}
        twoColumns={options.length > 5}
        showUnselectedOptions={showUnselectedOptions}
      />
    </div>
  );
};

export default SectionMultiEnumMaybe;
