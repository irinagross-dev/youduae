import React from 'react';
import { useHistory } from 'react-router-dom';
import { useRouteConfiguration } from '../../../../../context/routeConfigurationContext';
import { createResourceLocatorString } from '../../../../../util/routes';
import classNames from 'classnames';
import css from './CategoryList.module.css';

const CATEGORIES = [
  { id: 'repair-construction', label: 'Ремонт и строительство' },
  { id: 'courier-services', label: 'Курьерские услуги' },
  { id: 'cleaning-home-help', label: 'Уборка и помощь в доме' },
  { id: 'cargo-transport', label: 'Грузоперевозки' },
  { id: 'appliance-installation', label: 'Установка бытовой техники' },
  { id: 'beauty-health', label: 'Красота и здоровье' },
  { id: 'photo-video-audio', label: 'Фото, видео, аудио' },
  { id: 'digital-tech-repair', label: 'Ремонт цифровой техники' },
  { id: 'legal-accounting', label: 'Юридическая и бухгалтерская помощь' },
  { id: 'tutoring-education', label: 'Репетиторы и обучение' },
  { id: 'automotive-services', label: 'Автомобильные услуги' },
];

const CategoryList = ({ isOpen, onClose }) => {
  const history = useHistory();
  const routeConfiguration = useRouteConfiguration();

  const handleCategoryClick = (categoryId) => {
    // Создаем URL для страницы создания листинга с предвыбранной категорией
    const to = createResourceLocatorString(
      'NewListingPage',
      routeConfiguration,
      {},
      { category: categoryId }
    );
    
    history.push(to);
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={css.categoryListContainer}>
      <div className={css.categoryList}>
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={css.categoryButton}
            onClick={() => handleCategoryClick(category.id)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

