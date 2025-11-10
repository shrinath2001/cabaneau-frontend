"use client"
import "./globals.css";
import Header from './components/Header';
import Header2 from './components/Header2';
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {isHomePage ? (
          <Header />
        ) : (
          <Header2 />
        )}
        <main className="pt-20"> {/* Added Tailwind padding-top to account for fixed header */}
          {children}
        </main>
      </body>
    </html>
  );
  }
