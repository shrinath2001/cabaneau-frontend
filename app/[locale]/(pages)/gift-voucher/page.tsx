import type { Metadata } from 'next';
import { getTranslations } from '@/app/lib/translations';
import { getHomepageCabins } from '@/app/lib/homepageCabins';
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

/** Left-column text of the page (H2 + paragraph blocks), managed in the CMS under Pages > Gift Voucher. */
async function getGiftVoucherContent(locale: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  const apiBaseUrl = process.env.API_BASE_URL || 'http://localhost:3000/api/v1';

  try {
    const res = await fetch(`${apiBaseUrl}/pages/slug/gift-voucher`, {
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey || '', 'Accept-Language': locale },
      next: { revalidate: 300 },
    });
    if (!res.ok) return '';
    const page = await res.json();
    return typeof page.content === 'string' ? page.content : '';
  } catch (error) {
    console.error('Error fetching gift voucher page content:', error);
    return '';
  }
}

export default async function GiftVoucherPage({ params }: { params: Promise<PageParams> }) {
  const { locale } = await params;
  const [content, cabins] = await Promise.all([getGiftVoucherContent(locale), getHomepageCabins(locale)]);
  return <GiftVoucherPageClient content={content} cabins={cabins} />;
}
