import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import css from './VerificationBadge.module.css';

const VerificationBadge = props => {
  const { isVerified, className, rootClassName } = props;

  if (!isVerified) {
    return null;
  }

  const classes = classNames(rootClassName || css.root, className);

  return (
    <span className={classes} title="Модерация платформы YouDu.ae проверила и верифицировала документы пользователя (Emirates ID)">
      <svg className={css.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="currentColor" />
        <path
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
          fill="white"
        />
      </svg>
      <span className={css.text}>Verified</span>
    </span>
  );
};

VerificationBadge.defaultProps = {
  isVerified: false,
  className: null,
  rootClassName: null,
};

VerificationBadge.propTypes = {
  isVerified: PropTypes.bool,
  className: PropTypes.string,
  rootClassName: PropTypes.string,
};

export default VerificationBadge;

