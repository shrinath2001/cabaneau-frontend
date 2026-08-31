import type { Metadata } from 'next';
import { getTranslations } from '@/app/lib/translations';
import GiftVoucherPageClient from './GiftVoucherPageClient';

interface PageParams {
  locale: string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { locale } = await params;
  const translations = await getTranslations(locale);
  const title = translations['gift_voucher.page_title'] || 'Gift Voucher';

  return {
    title: `${title} - Cabaneau`,
  };
}

export default function GiftVoucherPage() {
  return <GiftVoucherPageClient />;
}
