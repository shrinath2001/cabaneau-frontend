'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import Header2 from './Header2';

export default function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return isHomePage ? <Header /> : <Header2 />;
}
