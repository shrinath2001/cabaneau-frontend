// Types for UI components (transformed from API responses)

export interface Activity {
  id: number;
  /** Slug of the activity category this belongs to (drives the page tabs). */
  categorySlug?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  detailImage?: string;
  icons: string[];
  phone: string;
  email: string;
  website: string;
  // Optional extended properties for detail modal
  duration?: string;
  startLocation?: string;
  tags?: string[];
  scheduleAvailability?: string;
}

export interface EatDrinkItem {
  id: number | string;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  image: string;
  detailImage?: string;
}
