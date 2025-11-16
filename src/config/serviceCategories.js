/**
 * Service Categories Configuration
 * 
 * Список всех категорий услуг, которые могут предоставлять исполнители (Customer).
 * Используется в:
 * - Форме регистрации (выбор категорий и подкатегорий)
 * - Профиле исполнителя (отображение категорий)
 * - Странице списка исполнителей по категории
 * - Создании листингов (выбор категории задания)
 * 
 * ⚠️ СИНХРОНИЗИРОВАНО С SHARETRIBE CONSOLE (14 категорий, 92 подкатегории)
 */

export const SERVICE_CATEGORIES = [
  // 1. Ремонт и строительство (14 subcategories)
  {
    id: 'repairs_main',
    label: {
      ru: 'Ремонт и строительство',
      en: 'Repairs and Construction',
    },
    icon: 'drill',
    subcategories: [
      { id: 'handyman', label: { ru: 'Мастер на час', en: 'Handyman' } },
      { id: 'hvac', label: { ru: 'Чистка и ремонт кондиционера (HVAC)', en: 'HVAC Cleaning and Repair' } },
      { id: 'water_heaters', label: { ru: 'Замена водонагревателя', en: 'Water Heater Replacement' } },
      { id: 'electric_work', label: { ru: 'Электромонтажные работы', en: 'Electrical Work' } },
      { id: 'plumbing', label: { ru: 'Сантехнические работы', en: 'Plumbing' } },
      { id: 'Painting', label: { ru: 'Малярные работы', en: 'Painting' } },
      { id: 'Carpenter', label: { ru: 'Сборка и ремонт мебели', en: 'Furniture Assembly and Repair' } },
      { id: 'door_work', label: { ru: 'Регулировка дверей', en: 'Door Adjustment' } },
      { id: 'renovation', label: { ru: 'Ремонт под ключ', en: 'Turnkey Renovation' } },
      { id: 'smart_system', label: { ru: 'Настройка и установка умного дома (камеры/замки)', en: 'Smart Home Installation (Cameras/Locks)' } },
      { id: 'Restoration', label: { ru: 'Реставрационные работы (мебель/камень)', en: 'Restoration (Furniture/Stone)' } },
      { id: 'Floor_work', label: { ru: 'Работа с напольным покрытием', en: 'Flooring Work' } },
      { id: 'Tile_work', label: { ru: 'Плиточные работы', en: 'Tile Work' } },
    ],
  },

  // 2. Курьерские услуги (5 subcategories)
  {
    id: 'Delivery',
    label: {
      ru: 'Курьерские услуги',
      en: 'Courier Services',
    },
    icon: 'courier',
    subcategories: [
      { id: 'delivery_boy', label: { ru: 'Услуги курьера на легковом автомобиле', en: 'Car Courier Services' } },
      { id: 'buy_delivery', label: { ru: 'Купить и доставить', en: 'Buy and Deliver' } },
      { id: 'Fast_delivery', label: { ru: 'Срочная доставка', en: 'Express Delivery' } },
      { id: 'Day_deliveryboy', label: { ru: 'Курьер на день', en: 'Day Courier' } },
      { id: 'Post_delivery', label: { ru: 'Отправить посылку', en: 'Send Parcel' } },
    ],
  },

  // 3. Уборка и помощь в доме (7 subcategories)
  {
    id: 'Help_home',
    label: {
      ru: 'Уборка и помощь в доме',
      en: 'Cleaning and Home Help',
    },
    icon: 'housekeeper',
    subcategories: [
      { id: 'Deep_clean', label: { ru: 'Генеральная уборка', en: 'Deep Cleaning' } },
      { id: 'Cleaning', label: { ru: 'Поддерживающая уборка', en: 'Regular Cleaning' } },
      { id: 'Tailor', label: { ru: 'Помощь швеи', en: 'Tailor Services' } },
      { id: 'Ironing_clothes', label: { ru: 'Глажка белья', en: 'Ironing' } },
      { id: 'Dry_cleaning', label: { ru: 'Химчистка', en: 'Dry Cleaning' } },
      { id: 'Animal_care', label: { ru: 'Уход за животными', en: 'Pet Care' } },
      { id: 'Nannies', label: { ru: 'Няни', en: 'Nannies' } },
    ],
  },

  // 4. Грузоперевозки (2 subcategories)
  {
    id: 'Cargo_transportation',
    label: {
      ru: 'Грузоперевозки',
      en: 'Cargo Transportation',
    },
    icon: 'truck',
    subcategories: [
      { id: 'Moving', label: { ru: 'Переезд', en: 'Moving' } },
      { id: 'Garbage_removal', label: { ru: 'Вывоз мусора', en: 'Garbage Removal' } },
    ],
  },

  // 5. Установка бытовой техники (8 subcategories)
  {
    id: 'Installation_mashines',
    label: {
      ru: 'Установка бытовой техники',
      en: 'Appliance Installation',
    },
    icon: 'kitchen',
    subcategories: [
      { id: 'Refrigerators', label: { ru: 'Холодильники и морозильники', en: 'Refrigerators and Freezers' } },
      { id: 'Dishwashers', label: { ru: 'Посудомоечные машины', en: 'Dishwashers' } },
      { id: 'Electric_stoves', label: { ru: 'Электрические плиты', en: 'Electric Stoves' } },
      { id: 'Ovens', label: { ru: 'Духовые шкафы', en: 'Ovens' } },
      { id: 'Microwaves', label: { ru: 'Микроволновки', en: 'Microwaves' } },
      { id: 'Washing_mashine', label: { ru: 'Стиральные и сушильные машинки', en: 'Washing and Drying Machines' } },
      { id: 'kitchen_appliances', label: { ru: 'Мелкая кухонная техника', en: 'Small Kitchen Appliances' } },
      { id: 'Climate_control', label: { ru: 'Климатическая техника', en: 'Climate Control Equipment' } },
    ],
  },

  // 6. Красота и здоровье (11 subcategories)
  {
    id: 'Beauty_health',
    label: {
      ru: 'Красота и здоровье',
      en: 'Beauty and Health',
    },
    icon: 'scissors',
    subcategories: [
      { id: 'Nail_service', label: { ru: 'Ногтевой сервис', en: 'Nail Service' } },
      { id: 'Eyebrows_eyelashes', label: { ru: 'Брови и ресницы', en: 'Eyebrows and Eyelashes' } },
      { id: 'Cosmetologist', label: { ru: 'Услуги косметолога', en: 'Cosmetology Services' } },
      { id: 'Hairdressing', label: { ru: 'Парикмахерские услуги', en: 'Hairdressing Services' } },
      { id: 'Epilation', label: { ru: 'Эпиляция', en: 'Epilation' } },
      { id: 'Makeup', label: { ru: 'Услуги визажиста', en: 'Makeup Services' } },
      { id: 'Personal_trainer', label: { ru: 'Персональный тренер', en: 'Personal Trainer' } },
      { id: 'Nursing_services', label: { ru: 'Услуги медсестры', en: 'Nursing Services' } },
      { id: 'psychologist', label: { ru: 'Услуги психолога / психотерапевта', en: 'Psychologist / Psychotherapist' } },
      { id: 'Stylists', label: { ru: 'Стилисты и имиджмейкер', en: 'Stylists and Image Consultant' } },
      { id: 'Massage', label: { ru: 'Массаж', en: 'Massage' } },
    ],
  },

  // 7. Фото, видео, аудио (4 subcategories)
  {
    id: 'Photo',
    label: {
      ru: 'Фото, видео, аудио',
      en: 'Photo, Video, Audio',
    },
    icon: 'camera',
    subcategories: [
      { id: 'Photography', label: { ru: 'Фотосъемка', en: 'Photography' } },
      { id: 'videographer', label: { ru: 'Видеосъемка', en: 'Videography' } },
      { id: 'Audio_recording', label: { ru: 'Запись аудио', en: 'Audio Recording' } },
      { id: 'Models_photo', label: { ru: 'Модели для съемок', en: 'Photo Models' } },
    ],
  },

  // 8. Ремонт цифровой техники (3 subcategories)
  {
    id: 'Repair_digital',
    label: {
      ru: 'Ремонт цифровой техники',
      en: 'Digital Tech Repair',
    },
    icon: 'search',
    subcategories: [
      { id: 'Tablets_phones', label: { ru: 'Планшеты и телефоны', en: 'Tablets and Phones' } },
      { id: 'Printers', label: { ru: 'Принтеры', en: 'Printers' } },
      { id: 'Video_photo', label: { ru: 'Видео / фототехника', en: 'Video / Photo Equipment' } },
    ],
  },

  // 9. Юридическая и бухгалтерская помощь (9 subcategories)
  {
    id: 'Legal_assistance',
    label: {
      ru: 'Юридическая и бухгалтерская помощь',
      en: 'Legal and Accounting Assistance',
    },
    icon: 'weight',
    subcategories: [
      { id: 'EID_visa', label: { ru: 'Оформление Emirates ID / Visa', en: 'Emirates ID / Visa Processing' } },
      { id: 'Accounting_services', label: { ru: 'Бухгалтерские услуги', en: 'Accounting Services' } },
      { id: 'Tax_consultation', label: { ru: 'Консультация по налогам', en: 'Tax Consultation' } },
      { id: 'Legal_advice', label: { ru: 'Юридическая консультация', en: 'Legal Consultation' } },
      { id: 'Company_registration', label: { ru: 'Регистрация компаний', en: 'Company Registration' } },
      { id: 'Liquidation_companies', label: { ru: 'Ликвидация компаний', en: 'Company Liquidation' } },
      { id: 'Insurance_services', label: { ru: 'Страховые услуги', en: 'Insurance Services' } },
      { id: 'Real_Estate', label: { ru: 'Брокерские услуги (Real Estate)', en: 'Brokerage Services (Real Estate)' } },
      { id: 'lawyer', label: { ru: 'Консультация адвоката', en: 'Lawyer Consultation' } },
    ],
  },

  // 10. Репетиторы и обучение (11 subcategories)
  {
    id: 'training',
    label: {
      ru: 'Репетиторы и обучение',
      en: 'Tutoring and Education',
    },
    icon: 'school',
    subcategories: [
      { id: 'English_language', label: { ru: 'Английский язык', en: 'English Language' } },
      { id: 'Russian_language', label: { ru: 'Русский язык и литература', en: 'Russian Language and Literature' } },
      { id: 'Spanish_language', label: { ru: 'Испанский язык', en: 'Spanish Language' } },
      { id: 'French_language', label: { ru: 'Французский язык', en: 'French Language' } },
      { id: 'Arabic_language', label: { ru: 'Арабский язык', en: 'Arabic Language' } },
      { id: 'Chinese_language', label: { ru: 'Китайский язык', en: 'Chinese Language' } },
      { id: 'Other_languages', label: { ru: 'Другие иностранные языки', en: 'Other Foreign Languages' } },
      { id: 'Tennis_Padel', label: { ru: 'Спорт (Теннис / Падел)', en: 'Sports (Tennis / Padel)' } },
      { id: 'Speech_therapists', label: { ru: 'Логопеды', en: 'Speech Therapists' } },
      { id: 'Driving_instructors', label: { ru: 'Автоинструкторы', en: 'Driving Instructors' } },
      { id: 'Help_students', label: { ru: 'Помощь студентам и школьникам', en: 'Help for Students and Schoolchildren' } },
    ],
  },

  // 11. Автомобильные услуги (4 subcategories)
  {
    id: 'Automotive_services',
    label: {
      ru: 'Автомобильные услуги',
      en: 'Automotive Services',
    },
    icon: 'car',
    subcategories: [
      { id: 'Roadside_assistance', label: { ru: 'Помощь на дороге', en: 'Roadside Assistance' } },
      { id: 'Detailing', label: { ru: 'Детейлинг', en: 'Detailing' } },
      { id: 'Maintenance_car', label: { ru: 'Техническое обслуживание', en: 'Car Maintenance' } },
      { id: 'Search_car', label: { ru: 'Помощь в подборе автомобиля', en: 'Car Selection Assistance' } },
    ],
  },

  // 12. Дизайн интерьеров (0 subcategories)
  {
    id: 'Interior_designer',
    label: {
      ru: 'Дизайн интерьеров',
      en: 'Interior Design',
    },
    icon: 'interior',
    subcategories: [],
  },

  // 13. Туристические услуги (1 subcategory)
  {
    id: 'Tourist_services',
    label: {
      ru: 'Туристические услуги',
      en: 'Tourist Services',
    },
    icon: 'tourist',
    subcategories: [
      { id: 'Excursions', label: { ru: 'Экскурсии', en: 'Excursions' } },
    ],
  },

  // 14. Веб Дизайн/SEO (0 subcategories)
  {
    id: 'Web_design',
    label: {
      ru: 'Веб Дизайн/SEO',
      en: 'Web Design/SEO',
    },
    icon: 'web',
    subcategories: [],
  },
];

/**
 * Получить label категории на нужном языке
 * @param {string} categoryId - ID категории
 * @param {string} locale - Язык ('ru' или 'en')
 * @returns {string} - Название категории
 */
export const getCategoryLabel = (categoryId, locale = 'ru') => {
  const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId);
  return category?.label?.[locale] || categoryId;
};

/**
 * Получить label подкатегории
 * @param {string} categoryId - ID основной категории
 * @param {string} subcategoryId - ID подкатегории
 * @param {string} locale - Язык ('ru' или 'en')
 * @returns {string} - Название подкатегории
 */
export const getSubcategoryLabel = (categoryId, subcategoryId, locale = 'ru') => {
  const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId);
  const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);
  return subcategory?.label?.[locale] || subcategoryId;
};

/**
 * Получить все категории в формате для enum options
 * @param {string} locale - Язык ('ru' или 'en')
 * @returns {Array} - Массив {option, label}
 */
export const getCategoryEnumOptions = (locale = 'ru') => {
  return SERVICE_CATEGORIES.map(cat => ({
    option: cat.id,
    label: cat.label[locale],
  }));
};

/**
 * Получить подкатегории для конкретной категории
 * @param {string} categoryId - ID категории
 * @param {string} locale - Язык ('ru' или 'en')
 * @returns {Array} - Массив подкатегорий {option, label}
 */
export const getSubcategoryEnumOptions = (categoryId, locale = 'ru') => {
  const category = SERVICE_CATEGORIES.find(cat => cat.id === categoryId);
  if (!category?.subcategories) return [];
  
  return category.subcategories.map(sub => ({
    option: sub.id,
    label: sub.label[locale],
  }));
};

/**
 * Получить все subcategories для всех категорий (flat list)
 * @param {string} locale - Язык ('ru' или 'en')
 * @returns {Array} - Массив всех подкатегорий {option, label, categoryId}
 */
export const getAllSubcategoriesFlat = (locale = 'ru') => {
  const allSubs = [];
  SERVICE_CATEGORIES.forEach(cat => {
    if (cat.subcategories) {
      cat.subcategories.forEach(sub => {
        allSubs.push({
          option: sub.id,
          label: sub.label[locale],
          categoryId: cat.id,
        });
      });
    }
  });
  return allSubs;
};
