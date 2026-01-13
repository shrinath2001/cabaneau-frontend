import type { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
  description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings. Perfect for romantic getaways and peaceful retreats.',
  keywords: ['cabin rental', 'luxury cabins', 'private sauna', 'wellness retreat', 'romantic getaway', 'nature retreat'],
  authors: [{ name: 'Cabaneau' }],
  openGraph: {
    title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
    description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings.',
    type: 'website',
    siteName: 'Cabaneau',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabaneau - Luxury Cabin Rentals',
    description: 'Experience luxury cabins with private wellness facilities.',
  },
};

/**
 * Root layout - minimal wrapper
 * The html/body tags and TranslationsProvider are in [locale]/layout.tsx
 * to support dynamic lang attribute for SEO
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
