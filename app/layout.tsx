import type { Metadata } from 'next';
import "./globals.css";
import ConditionalHeader from './components/ConditionalHeader';
import { jost, raleway, logga } from './fonts';

export const metadata: Metadata = {
  title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
  description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings. Perfect for romantic getaways and peaceful retreats.',
  keywords: ['cabin rental', 'luxury cabins', 'private sauna', 'wellness retreat', 'romantic getaway', 'nature retreat'],
  authors: [{ name: 'Cabaneau' }],
  openGraph: {
    title: 'Cabaneau - Luxury Cabin Rentals with Private Wellness',
    description: 'Experience luxury cabins with private wellness facilities, saunas, and stunning natural surroundings.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Cabaneau',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cabaneau - Luxury Cabin Rentals',
    description: 'Experience luxury cabins with private wellness facilities.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jost.variable} ${raleway.variable} ${logga.variable}`}>
      <body className="font-raleway antialiased">
        <ConditionalHeader />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
