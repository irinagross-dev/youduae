// src/containers/FooterContainer/FooterContainer.js
import React from 'react';
import FooterCustom from '../FooterCustom/FooterCustom';

/**
 * Глобальный контейнер футера.
 * Всегда отображает кастомный FooterCustom на всех страницах.
 */
const FooterContainer = () => {
  return <FooterCustom />;
};

export default FooterContainer;