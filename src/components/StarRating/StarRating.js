import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconReviewStar } from '../../components';

import css from './StarRating.module.css';

/**
 * StarRating component that supports half stars
 * @param {number} rating - Rating value (e.g., 3.5)
 * @param {string} className - Optional CSS class
 */
const StarRating = ({ rating, className }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const totalStars = 5;

  // Полные звезды
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <span key={`star-${i}`} className={css.starWrapper}>
        <IconReviewStar className={css.starFilled} isFilled={true} />
      </span>
    );
  }

  // Половинчатая звезда
  if (hasHalfStar && fullStars < totalStars) {
    stars.push(
      <span key={`star-half`} className={css.starWrapper}>
        <span className={css.halfStarContainer}>
          <IconReviewStar className={css.starEmpty} isFilled={false} />
          <span className={css.halfStarOverlay}>
            <IconReviewStar className={css.starFilled} isFilled={true} />
          </span>
        </span>
      </span>
    );
  }

  // Пустые звезды
  const emptyStarsCount = totalStars - fullStars - (hasHalfStar ? 1 : 0);
  for (let i = 0; i < emptyStarsCount; i++) {
    stars.push(
      <span key={`star-empty-${i}`} className={css.starWrapper}>
        <IconReviewStar className={css.starEmpty} isFilled={false} />
      </span>
    );
  }

  return (
    <span className={classNames(css.root, className)} title={`${rating}/5`}>
      {stars}
    </span>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  className: PropTypes.string,
};

export default StarRating;

