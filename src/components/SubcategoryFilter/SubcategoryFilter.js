import React from 'react';
import classNames from 'classnames';
import { useIntl } from '../../util/reactIntl';
import { getSubcategoryEnumOptions } from '../../config/serviceCategories';

import css from './SubcategoryFilter.module.css';

/**
 * SubcategoryFilter - фильтр для выбора подкатегории
 * Используется на странице категории (/category/:categoryId)
 */
const SubcategoryFilter = props => {
  const { categoryId, selectedSubcategory, onSubcategoryChange } = props;
  const intl = useIntl();
  const locale = intl.locale === 'ru' ? 'ru' : 'en';

  const subcategories = getSubcategoryEnumOptions(categoryId, locale);

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  return (
    <div className={css.root}>
      <div className={css.filterLabel}>
        {intl.formatMessage({ id: 'CategoryExecutorsPage.filterBySpecialization' })}:
      </div>
      
      <div className={css.filterButtons}>
        {/* Кнопка "Все" */}
        <button
          type="button"
          className={classNames(css.filterButton, {
            [css.active]: !selectedSubcategory,
          })}
          onClick={() => onSubcategoryChange(null)}
        >
          {intl.formatMessage({ id: 'CategoryExecutorsPage.all' })}
        </button>

        {/* Кнопки для каждой подкатегории */}
        {subcategories.map(sub => (
          <button
            key={sub.option}
            type="button"
            className={classNames(css.filterButton, {
              [css.active]: selectedSubcategory === sub.option,
            })}
            onClick={() => onSubcategoryChange(sub.option)}
          >
            {sub.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryFilter;

