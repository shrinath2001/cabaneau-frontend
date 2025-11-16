export interface Amenities {
  wifi?: boolean;
  bedroom?: boolean;
  washer?: boolean;
  privateSauna?: boolean;
}

export interface Cabin {
  id: number;
  images: string[];
  title: string;
  rating: number;
  area: string;
  capacity: string;
  availability: string;
  price: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  amenities: Amenities;
  description: string;
  offers: string[];
}

export const cabins: Cabin[] = [
  {
    id: 1,
    images: [
      '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
      '/assets/breakfast.jpg',
      '/assets/hiking.png',
    ],
    title: 'TUBE',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Jacuzzi', 'Sauna'],
    amenities: {
      wifi: true,
      bedroom: true,
      washer: true,
      privateSauna: true,
    },
    description: 'Lorem Ipsum is Simply Dummy Text Of The Printing And Typesetting Industry. Lorem Ipsum Has Been The Industry\'s Standard Dummy Text Ever Since The 1500s, When An Unknown Printer Took. A Galley Of Type And Scrambled It To Make A Type Specimen Book. It Has Survived Not Only Five Centuries, But Also The Leap Into Electronic Typesetting, Remaining Essentially Unchanged. It Was Popularised In The 1960s With The Release Of Letraset Sheets Containing Lorem Ipsum Passages, And....',
    offers: [
      'Kitchen', 'Wifi', 'Free parking on premises', 'Private Sauna', 'TV', 'Washer', 'Dryer', 'Air conditioning', 'Private poatio or balcony', 'Backyard'
    ]
  },
  {
    id: 2,
    images: [
      '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
      '/assets/breakfast.jpg',
      '/assets/hiking.png',
    ],
    title: 'WIWAXY',
    rating: 4,
    area: '40m2',
    capacity: '2-6 Persons',
    availability: '28/12',
    price: '$350.00',
    guests: 6,
    bedrooms: 2,
    bathrooms: 2,
    features: ['Jacuzzi', 'Sauna', 'Hot Tub'],
    amenities: {
      wifi: true,
      bedroom: true,
      washer: true,
      privateSauna: true,
    },
    description: 'Spacious luxury cabin perfect for families or groups. Features stunning views and premium amenities including a private sauna and jacuzzi. Enjoy the perfect blend of comfort and nature with modern facilities and rustic charm.',
    offers: [
      'Kitchen', 'Wifi', 'Free parking on premises', 'Private Sauna', 'TV', 'Washer', 'Dryer', 'Air conditioning', 'Private patio or balcony', 'Backyard', 'Hot Tub', 'BBQ Grill'
    ]
  },
  {
    id: 3,
    images: [
      '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
      '/assets/breakfast.jpg',
      '/assets/hiking.png',
    ],
    title: 'GARDNER',
    rating: 5,
    area: '30m2',
    capacity: '2-3 Persons',
    availability: '25/12',
    price: '$280.00',
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Sauna', 'Garden View'],
    amenities: {
      wifi: true,
      bedroom: true,
      washer: true,
      privateSauna: true,
    },
    description: 'Cozy cabin with breathtaking garden views. Ideal for couples or small families seeking a peaceful retreat. Features include a private sauna and all the comforts of home in a serene natural setting.',
    offers: [
      'Kitchen', 'Wifi', 'Free parking on premises', 'Private Sauna', 'TV', 'Washer', 'Air conditioning', 'Private patio or balcony', 'Garden Access'
    ]
  },
  {
    id: 4,
    images: [
      '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
      '/assets/breakfast.jpg',
      '/assets/hiking.png',
    ],
    title: 'ALPENGLOW',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Jacuzzi', 'Sauna', 'Mountain View'],
    amenities: {
      wifi: true,
      bedroom: true,
      washer: true,
      privateSauna: true,
    },
    description: 'Modern cabin with spectacular mountain views. Perfect for romantic getaways or small family vacations. Equipped with a jacuzzi and private sauna to help you unwind after a day of outdoor adventures.',
    offers: [
      'Kitchen', 'Wifi', 'Free parking on premises', 'Private Sauna', 'TV', 'Washer', 'Dryer', 'Air conditioning', 'Private patio or balcony', 'Backyard', 'Mountain View'
    ]
  },
  {
    id: 5,
    images: [
      '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
      '/assets/breakfast.jpg',
      '/assets/hiking.png',
    ],
    title: 'SUMMIT',
    rating: 5,
    area: '35m2',
    capacity: '2-4 Persons',
    availability: '30/12',
    price: '$300.00',
    guests: 4,
    bedrooms: 1,
    bathrooms: 1,
    features: ['Jacuzzi', 'Sauna', 'Forest View'],
    amenities: {
      wifi: true,
      bedroom: true,
      washer: true,
      privateSauna: true,
    },
    description: 'Elegant cabin nestled in the forest canopy. Offers complete privacy and tranquility with modern amenities including a private sauna and jacuzzi. Experience luxury living surrounded by nature.',
    offers: [
      'Kitchen', 'Wifi', 'Free parking on premises', 'Private Sauna', 'TV', 'Washer', 'Dryer', 'Air conditioning', 'Private patio or balcony', 'Backyard', 'Forest View'
    ]
  },
];
