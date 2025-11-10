import React from 'react';
import { Heading, IconSocialMediaInstagram } from '../../components';
import { richText } from '../../util/richText';
import { useIntl } from '../../util/reactIntl';

import css from './ProfilePage.module.css';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionTextMaybe = props => {
  const intl = useIntl();
  const { text, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;
  const content = richText(text, {
    linkify: true,
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
    breakChars: '/',
  });

  const rawHeading = heading;
  const translatedHeading =
    heading && typeof heading === 'string' && heading.includes('.')
      ? intl.formatMessage({ id: heading, defaultMessage: heading })
      : heading;

  const isInstagram = rawHeading === 'ProfileSettingsForm.socialInstagram';
  const isWebsite = rawHeading === 'ProfileSettingsForm.socialWebsite';

  if ((isInstagram || isWebsite) && text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }

    const ensureProtocol = value => (/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const normalizedUrl = ensureProtocol(trimmed);
    const displayValue = trimmed.replace(/^https?:\/\//i, '');

    const icon = isInstagram ? (
      <IconSocialMediaInstagram className={css.socialIcon} />
    ) : (
      <span className={css.socialWebsiteIcon} aria-hidden="true">
        🌐
      </span>
    );

    return (
      <div className={css.sectionText}>
        {translatedHeading ? (
          <Heading as="h2" rootClassName={css.sectionHeading}>
            {translatedHeading}
          </Heading>
        ) : null}
        <a
          className={css.socialBadge}
          href={normalizedUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {icon}
          <span className={css.socialText}>{displayValue}</span>
        </a>
      </div>
    );
  }

  return text ? (
    <div className={css.sectionText}>
      {translatedHeading ? (
        <Heading as="h2" rootClassName={css.sectionHeading}>
          {translatedHeading}
        </Heading>
      ) : null}
      <p className={textClass}>{content}</p>
    </div>
  ) : null;
};

export default SectionTextMaybe;
