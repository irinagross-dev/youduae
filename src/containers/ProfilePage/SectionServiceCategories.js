import React from 'react';
import { Heading } from '../../components';
import { useIntl } from '../../util/reactIntl';
import { getCategoryLabel, getSubcategoryLabel } from '../../config/serviceCategories';

import css from './ProfilePage.module.css';

/**
 * Отображает категории услуг с подкатегориями в публичном профиле Customer
 */
const SectionServiceCategories = props => {
  const { publicData } = props;
  const intl = useIntl();
  const locale = intl.locale === 'ru' ? 'ru' : 'en';

  if (!publicData) {
    return null;
  }

  const serviceCategories = publicData.serviceCategories || [];
  let subcategories = publicData.subcategories;

  // Десериализуем subcategories, если это строка
  if (typeof subcategories === 'string') {
    try {
      subcategories = JSON.parse(subcategories);
    } catch (e) {
      console.warn('Failed to parse subcategories in profile:', e);
      subcategories = {};
    }
  }

  if (!Array.isArray(serviceCategories) || serviceCategories.length === 0) {
    return null;
  }

  return (
    <div className={css.sectionServiceCategories}>
      <Heading as="h2" rootClassName={css.sectionHeading}>
        {intl.formatMessage({ id: 'ProfilePage.serviceCategoriesTitle' })}
      </Heading>
      <div className={css.categoriesList}>
        {serviceCategories.map(categoryId => {
          const categoryLabel = getCategoryLabel(categoryId, locale);
          const categorySubcategories = subcategories?.[categoryId] || [];

          return (
            <div key={categoryId} className={css.categoryBlock}>
              <div className={css.categoryName}>✓ {categoryLabel}</div>
              {categorySubcategories.length > 0 && (
                <div className={css.subcategoriesList}>
                  {categorySubcategories.map(subId => (
                    <span key={subId} className={css.subcategoryPill}>
                      {getSubcategoryLabel(categoryId, subId, locale)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionServiceCategories;

