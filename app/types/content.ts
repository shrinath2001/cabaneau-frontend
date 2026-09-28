// Types for UI components (transformed from API responses)

export interface Activity {
  id: number;
  /** Slug of the activity category this belongs to (drives the page tabs). */
  categorySlug?: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  /** Photo credit shown small in the corner of the image. Hidden when unset. */
  imageCredit?: string;
  phone: string;
  email: string;
  website: string;
  // TypeORM decimal columns serialize as strings over JSON.
  price?: number | string;
  priceUnit?: string;
  /** "Read More" button URL. Button is hidden when unset. */
  readMoreUrl?: string;
  /** "Book Now" button URL. Button is hidden when unset. */
  bookNowUrl?: string;
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
