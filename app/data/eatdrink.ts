export interface EatDrinkItem {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  image: string;
  detailImage?: string;
}

export const dining: EatDrinkItem[] = [
  {
    id: 1,
    title: 'DINNER',
    subtitle: 'Satisfy your evening cravings',
    price: '45€/PERSON',
    description: 'Relax with a cozy dinner featuring regional specialties and international dishes. Our menu offers both vegetarian and non-vegetarian options, crafted by experienced chefs.',
    image: '/assets/dinner.png',
  },
  {
    id: 2,
    title: 'BBQ SET',
    subtitle: 'Satisfy your evening cravings',
    price: '17€/PERSON',
    description: 'Relax with a cozy dinner featuring regional specialties and international dishes. Our menu offers both vegetarian and non-vegetarian options, crafted by experienced chefs.',
    image: '/assets/dinner.png',
  },
  {
    id: 3,
    title: 'RACLETTE PACKAGE',
    subtitle: 'Satisfy your evening cravings',
    price: '45€/PERSON',
    description: 'Relax with a cozy dinner featuring regional specialties and international dishes. Our menu offers both vegetarian and non-vegetarian options, crafted by experienced chefs.',
    image: '/assets/dinner.png',
  },
];

export const breakfast: EatDrinkItem[] = [
  {
    id: 101,
    title: 'CONTINENTAL BREAKFAST',
    subtitle: 'Start your day right',
    price: '15€/PERSON',
    description: 'Fresh pastries, artisan breads, seasonal fruits, yogurt, and premium coffee. A perfect way to begin your morning with a selection of healthy and delicious options.',
    image: '/assets/breakfast.jpg',
  },
  {
    id: 102,
    title: 'FULL BREAKFAST',
    subtitle: 'Hearty morning feast',
    price: '25€/PERSON',
    description: 'Complete breakfast experience with eggs, bacon, sausages, fresh vegetables, pastries, fruits, juices, and coffee. Everything you need for an energetic start.',
    image: '/assets/breakfast.jpg',
  },
];

export const drinks: EatDrinkItem[] = [
  {
    id: 201,
    title: 'PREMIUM WINE SELECTION',
    subtitle: 'Curated local and international wines',
    price: '8€/GLASS',
    description: 'Discover our carefully selected wine collection featuring the finest regional vintages and international favorites. Perfect pairing for any meal or occasion.',
    image: '/assets/dinner.png',
  },
  {
    id: 202,
    title: 'CRAFT COCKTAILS',
    subtitle: 'Handcrafted signature drinks',
    price: '12€/DRINK',
    description: 'Our mixologists create unique cocktails using premium spirits, fresh ingredients, and creative flair. From classics to house specialties.',
    image: '/assets/dinner.png',
  },
];
