'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from '@/app/providers/TranslationsProvider';

function GiftVoucherSuccessContent() {
  const { t } = useTranslations('gift_voucher');
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  // Not used to fetch anything - the webhook already finished the purchase
  // server-side by the time Stripe redirects here. Kept only in case it's
  // ever useful for support ("which session had trouble").
  const searchParams = useSearchParams();
  void searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-lg text-center py-20">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#EFF2EA] flex items-center justify-center">
          <svg
            className="w-8 h-8 text-[#495D4D]"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-logga text-[28px] md:text-[36px] font-semibold mb-4" style={{ color: '#212121' }}>
          {t('success_heading', 'Thank you!')}
        </h1>
        <p className="font-jost font-light text-[16px] leading-relaxed text-gray-700 mb-8">
          {t(
            'success_body',
            'Your gift card is on its way. Check your email for the confirmation and printable voucher.'
          )}
        </p>
        <Link
          href={`/${locale}/gift-voucher`}
          className="inline-block bg-[#495D4D] text-white py-3 px-8 text-sm font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost"
        >
          {t('success_back_link', 'Back to gift vouchers')}
        </Link>
      </div>
    </div>
  );
}

export default function GiftVoucherSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <GiftVoucherSuccessContent />
    </Suspense>
  );
}
