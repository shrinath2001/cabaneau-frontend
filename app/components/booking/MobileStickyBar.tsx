'use client';

import { QuoteResponse, formatCurrency, formatDateRange } from './hooks/useQuote';
import { useTranslations } from '@/app/providers/TranslationsProvider';

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
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white text-base font-jost font-bold tracking-wide uppercase py-4 px-6 transition"
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
            className="bg-gray-400 text-white text-base font-jost font-bold tracking-wide uppercase py-4 px-6"
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
            <div className="flex items-center gap-2">
              <span className="text-lg font-jost font-bold text-gray-900">
                {formatCurrency(pricing.total, pricing.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 font-jost font-medium">
                  -{pricing.discount!.percentage || Math.round((pricing.discount!.amount / pricing.subtotal) * 100)}%
                </span>
              )}
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
            className="bg-[#495D4D] hover:bg-[#3d5a3d] text-white text-base font-jost font-bold tracking-wide uppercase py-4 px-6 transition"
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
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white text-base font-jost font-bold tracking-wide uppercase py-4 px-6 transition"
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
