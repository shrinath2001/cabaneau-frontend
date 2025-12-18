export interface Activity {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  detailImage?: string;
  icons: string[];
  duration?: string;
  startLocation?: string;
  tags?: string[];
  scheduleAvailability?: string;
  phone: string;
  email: string;
  website: string;
}

export const activities: Activity[] = [
  {
    id: 1,
    title: 'SPORTS & SURFWAVE',
    subtitle: 'Thrilling water adventures for beginners and pros',
    description: 'Experience the thrill of surfing with our guided surfwave sessions. Perfect for all skill levels, enjoy epic rides and exciting lessons right near the coast.',
    image: '/assets/sports & surfwave.png',
    icons: ['🏄', '🌊', '⛱️', '🏖️'],
    duration: '2.5 HOURS',
    startLocation: 'SPORTS BASE CAMP',
    tags: ['ADVENTURE', 'SURFWAVE'],
    scheduleAvailability: 'Available daily from 9:00 AM to 6:00 PM',
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
  {
    id: 2,
    title: 'HIKING',
    subtitle: 'Explore breathtaking trails and connect with nature on foot',
    description: 'Enjoy scenic routes through forests, hills, and valleys. Whether you\'re a beginner or seasoned hiker, the region offers well-marked trails for all levels. Experience nature, wildlife and stunning views.',
    image: '/assets/hiking.png',
    icons: ['🥾', '⛰️', '🌲', '🎒'],
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
  {
    id: 3,
    title: 'CITY TRIPS',
    subtitle: 'Discover local culture, history, and vibrant city life',
    description: 'Tour guided or self-guided trips to nearby cities packed with historic landmarks, museums, shopping, and dining. Perfect for curious explorers seeking cultural immersion. Discover travelers seeking cultural pleasure.',
    image: '/assets/city trips.png',
    icons: ['🏛️', '🚶', '⛲', '🏙️'],
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
];

export const restaurants: Activity[] = [
  {
    id: 101,
    title: 'FINE DINING EXPERIENCE',
    subtitle: 'Exquisite cuisine with locally sourced ingredients',
    description: 'Indulge in a culinary journey featuring seasonal dishes prepared by our award-winning chefs. Experience farm-to-table dining with stunning views and an extensive wine collection.',
    image: '/assets/dinner.png',
    icons: ['🍽️', '🍷', '👨‍🍳', '⭐'],
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
  {
    id: 102,
    title: 'BREAKFAST & BRUNCH',
    subtitle: 'Start your day with fresh, hearty breakfast options',
    description: 'Wake up to a delightful breakfast spread featuring fresh pastries, local eggs, artisan breads, and specialty coffee. Our brunch menu offers both classic favorites and innovative dishes.',
    image: '/assets/breakfast.jpg',
    icons: ['☕', '🥐', '🍳', '🥞'],
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
  {
    id: 103,
    title: 'CASUAL BISTRO',
    subtitle: 'Relaxed atmosphere with comfort food and local flavors',
    description: 'Enjoy a casual dining experience with a menu that celebrates regional cuisine. Perfect for families and groups, offering a variety of dishes from wood-fired pizzas to fresh salads and grilled specialties.',
    image: '/assets/dinner.png',
    icons: ['🍕', '🥗', '🍔', '🍺'],
    phone: '(+1000) 999-000',
    email: 'info@cabaneau.com',
    website: 'cabaneau.com',
  },
];
