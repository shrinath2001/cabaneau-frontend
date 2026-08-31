'use client';

import { useState } from 'react';
import { QuoteResponse, formatCurrency, formatDateRange, translateLineItem } from './hooks/useQuote';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { isSunday } from './calendarUtils';

interface MobileStickyBarProps {
  hasDateParams: boolean;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  onCheckAvailability: () => void;
  onChangeDates?: () => void;
  minStayWarning?: string;
}

/**
 * MobileStickyBar - Sticky bottom bar for mobile booking flow
 *
 * Two modes:
 * 1. No dates: "Add dates for prices" + "Check Availability" button
 * 2. Has dates: Price display + "Reserve" button
 */
export default function MobileStickyBar({
  hasDateParams,
  quote,
  loading,
  error,
  onCheckAvailability,
  onChangeDates,
  minStayWarning,
}: MobileStickyBarProps) {
  const { t } = useTranslations('booking');
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  // Mode 1: No dates selected - show "Check Availability"
  if (!hasDateParams) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <span className="text-sm font-jost font-light text-gray-600">
              {t('add_dates_for_prices', 'Add dates for prices')}
            </span>
          </div>
          <button
            onClick={onCheckAvailability}
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white text-sm font-jost font-bold tracking-wide uppercase py-3 px-5 transition"
          >
            {t('check_availability', 'Check Availability')}
          </button>
        </div>
      </div>
    );
  }

  // Mode 2: Has dates - show price and Reserve button
  const handleReserve = () => {
    if (quote?.checkoutUrl) {
      window.location.href = quote.checkoutUrl;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-20 bg-gray-200 animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 animate-pulse" />
          </div>
          <div className="h-14 w-28 bg-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  // Error or unavailable state
  if (error || (quote && !quote.available)) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <span className="text-base font-jost font-medium text-red-600">
              {t('not_available', 'Not Available')}
            </span>
            <span className="text-sm font-jost font-light text-gray-500">
              {quote?.unavailableReason || error || t('dates_not_available', 'Selected dates are not available')}
            </span>
          </div>
          <button
            onClick={onCheckAvailability}
            className="bg-gray-400 text-white text-sm font-jost font-bold tracking-wide uppercase py-3 px-5"
          >
            {t('change_dates', 'Change Dates')}
          </button>
        </div>
      </div>
    );
  }

  // Success state with full pricing
  if (quote?.available && quote.pricingAvailable && quote.pricing) {
    const { pricing, checkIn, checkOut } = quote;
    const hasDiscount = !!pricing.discount;
    const isSundayCheckout = !!checkOut && isSunday(checkOut);

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        {/* Price details popup - anchored above the bar via bottom-full, so
            it opens upward regardless of how little space is below it. */}
        {showPriceDetails && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowPriceDetails(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-label={t('price_details', 'Price details')}
              className="absolute bottom-full left-4 right-4 mb-2 z-20 bg-white border border-gray-300 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] max-h-[60vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <span className="text-sm font-jost font-semibold text-gray-800">
                  {t('price_details', 'Price details')}
                </span>
                <button
                  onClick={() => setShowPriceDetails(false)}
                  aria-label={t('close', 'Close')}
                  className="text-gray-400 hover:text-gray-700 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-jost font-light text-gray-600">
                    {formatCurrency(pricing.nightlyRate, pricing.currency)} ×{' '}
                    {pricing.nights} {pricing.nights !== 1 ? t('nights_plural', 'nights') : t('night_singular', 'night')}
                  </span>
                  <span className="text-sm font-jost font-light text-gray-800">
                    {formatCurrency(pricing.subtotal, pricing.currency)}
                  </span>
                </div>

                {pricing.fees
                  .filter((fee) => fee.amount >= 0)
                  .map((fee, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm font-jost font-light text-gray-600">
                        {translateLineItem(fee.name, t)}
                      </span>
                      <span className="text-sm font-jost font-light text-gray-800">
                        {formatCurrency(fee.amount, pricing.currency)}
                      </span>
                    </div>
                  ))}

                {isSundayCheckout && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-jost font-light text-gray-600">
                      {t('line_item.lazy_sunday_checkout', 'Lazy Sunday check-out (16:00)')}
                    </span>
                    <span className="text-sm font-jost font-light text-gray-800">
                      {t('line_item.free', 'Free')}
                    </span>
                  </div>
                )}

                {hasDiscount && (
                  <div className="flex justify-between items-center bg-green-50 -mx-4 px-4 py-2">
                    <span className="text-sm font-jost text-green-700 font-medium">
                      {translateLineItem(pricing.discount!.name, t)}
                      {pricing.discount!.percentage && (
                        <span className="text-green-600 ml-1">(-{pricing.discount!.percentage}%)</span>
                      )}
                    </span>
                    <span className="text-sm font-jost text-green-700 font-medium">
                      -{formatCurrency(pricing.discount!.amount, pricing.currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 mt-1 border-t border-gray-200">
                  <span className="font-jost font-semibold text-sm text-gray-800">
                    {t('total', 'Total')}
                  </span>
                  <span className="font-jost font-bold text-base text-gray-800">
                    {formatCurrency(pricing.total, pricing.currency)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {minStayWarning && (
          <div className="flex items-center gap-1.5 px-5 py-1.5 bg-amber-50 border-b border-amber-200">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-jost text-[11px] text-amber-700">{minStayWarning}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-jost font-bold text-gray-900">
                {formatCurrency(pricing.total, pricing.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 font-jost font-medium">
                  -{pricing.discount!.percentage || Math.round((pricing.discount!.amount / pricing.subtotal) * 100)}%
                </span>
              )}
              <button
                onClick={() => setShowPriceDetails(true)}
                aria-label={t('price_details', 'Price details')}
                className="text-gray-400 hover:text-gray-600 -m-1 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <span className="text-sm font-jost font-light text-gray-500">
              {t('for', 'For')} {pricing.nights} {pricing.nights !== 1 ? t('nights_plural', 'nights') : t('night_singular', 'night')} · {formatDateRange(checkIn, checkOut)}
            </span>
            {onChangeDates && (
              <button
                onClick={onChangeDates}
                className="text-xs font-jost text-[#495D4D] hover:text-[#3d5a3d] underline text-left mt-1"
              >
                {t('change_dates', 'Change dates')}
              </button>
            )}
          </div>
          <button
            onClick={handleReserve}
            className="bg-[#495D4D] hover:bg-[#3d5a3d] text-white text-sm font-jost font-bold tracking-wide uppercase py-3 px-5 transition"
          >
            {t('reserve', 'Reserve')}
          </button>
        </div>
      </div>
    );
  }

  // Available but pricing not available - show minPrice fallback
  if (quote?.available && !quote.pricingAvailable) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-40 lg:hidden">
        {minStayWarning && (
          <div className="flex items-center gap-1.5 px-5 py-1.5 bg-amber-50 border-b border-amber-200">
            <svg className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-jost text-[11px] text-amber-700">{minStayWarning}</span>
          </div>
        )}
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            {quote.minPrice ? (
              <>
                <span className="text-lg font-jost font-bold text-gray-900">
                  {t('from', 'From')} {formatCurrency(quote.minPrice, quote.currency || 'EUR')}/{t('night_singular', 'night')}
                </span>
                <span className="text-sm font-jost font-light text-gray-500">
                  {t('final_price_on_booking', 'Final price on booking page')}
                </span>
              </>
            ) : (
              <span className="text-sm font-jost font-light text-gray-600">
                {t('view_pricing', 'View pricing')}
              </span>
            )}
            {onChangeDates && (
              <button
                onClick={onChangeDates}
                className="text-xs font-jost text-[#495D4D] hover:text-[#3d5a3d] underline text-left mt-1"
              >
                {t('change_dates', 'Change dates')}
              </button>
            )}
          </div>
          <button
            onClick={handleReserve}
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white text-sm font-jost font-bold tracking-wide uppercase py-3 px-5 transition"
          >
            {t('book_now', 'Book Now')}
          </button>
        </div>
      </div>
    );
  }

  // Fallback - shouldn't normally reach here
  return null;
}
