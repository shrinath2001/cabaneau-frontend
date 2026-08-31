'use client';

import { QuoteResponse, formatCurrency, localeToIntl, translateLineItem } from './hooks/useQuote';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { isSunday } from './calendarUtils';

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
}

interface DesktopBookingCardProps {
  cabin: CabinInfo;
  checkIn: string;
  checkOut: string;
  adults: number;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  onChangeDates: () => void;
  minStayWarning?: string;
}

/**
 * DesktopBookingCard - Custom booking card for desktop when dates are selected
 *
 * Displays:
 * - Cabin name header
 * - Arrival/Departure dates
 * - Guest count
 * - Price breakdown from Quote API
 * - "Book Your Stay" button → Lodgify checkout
 */
export default function DesktopBookingCard({
  cabin,
  checkIn,
  checkOut,
  adults,
  quote,
  loading,
  error,
  onChangeDates,
  minStayWarning,
}: DesktopBookingCardProps) {
  const { t, locale } = useTranslations('booking');

  // Only surfaced while the stay is still fully refundable - a partial-refund
  // notice reads as a warning and puts people off. The window comes from the
  // backend policy, so changing the rule there changes this with no code edit.
  const freeCancellationDate =
    quote?.cancellation?.isFreeNow && quote.cancellation.freeUntil
      ? new Date(`${quote.cancellation.freeUntil}T00:00:00`).toLocaleDateString(
          localeToIntl[locale] || 'en-GB',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      : null;

  // Format dates for display
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handle booking - redirect to checkout
  const handleBooking = () => {
    if (quote?.checkoutUrl) {
      window.location.href = quote.checkoutUrl;
    }
  };

  const totalGuests = adults;

  const isSundayCheckout = !!checkOut && isSunday(checkOut);

  return (
    <div
      className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_-6px_rgba(0,0,0,0.14)] w-full md:w-[464px] md:sticky md:top-24"
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Cabin Name Header */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="font-logga font-semibold text-[18px] md:text-[20px] uppercase text-gray-800">
          {cabin.name}
        </h2>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Date + guests box - one bordered block with square edges (Airbnb style) */}
        <div className="border border-gray-400">
          <div className="grid grid-cols-2">
            <div
              onClick={onChangeDates}
              className="px-3 py-2.5 border-r border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                {t('arrival', 'Arrival')}
              </div>
              <div className="text-sm font-jost font-light text-gray-900">
                {formatDateForDisplay(checkIn)}
              </div>
            </div>
            <div
              onClick={onChangeDates}
              className="px-3 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                {t('departure', 'Departure')}
              </div>
              <div className="text-sm font-jost font-light text-gray-900">
                {formatDateForDisplay(checkOut)}
              </div>
            </div>
          </div>
          <div
            onClick={onChangeDates}
            className="px-3 py-2.5 border-t border-gray-400 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div>
              <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                {t('guests_label', 'Guests')}
              </div>
              <div className="text-sm font-jost font-light text-gray-900">
                {totalGuests}{' '}
                {totalGuests === 1 ? t('guest_singular', 'guest') : t('guest_plural', 'guests')}
              </div>
            </div>
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Min Stay Warning */}
        {minStayWarning && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-jost text-xs text-amber-700">{minStayWarning}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="border-t border-gray-300 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 animate-pulse" />
              <div className="h-4 w-16 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-gray-200 animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-12 bg-gray-200 animate-pulse mt-4" />
          </div>
        )}

        {/* Error State */}
        {!loading && (error || (quote && !quote.available)) && (
          <div className="border-t border-gray-300 pt-4">
            <div className="bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-red-600 font-jost font-medium text-sm">
                {quote?.unavailableReason || error || t('dates_not_available', 'Selected dates are not available')}
              </p>
            </div>
            <button
              onClick={onChangeDates}
              className="w-full bg-gray-400 text-white py-4 px-6 text-base font-bold tracking-wide uppercase font-jost"
            >
              {t('select_different_dates', 'SELECT DIFFERENT DATES')}
            </button>
          </div>
        )}

        {/* Success State with Full Pricing */}
        {!loading && !error && quote?.available && quote.pricingAvailable && quote.pricing && (
          <div className="border-t border-gray-300 pt-4">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-jost font-light text-gray-600">
                  {formatCurrency(quote.pricing.nightlyRate, quote.pricing.currency)} ×{' '}
                  {quote.pricing.nights} {quote.pricing.nights !== 1 ? t('nights_plural', 'nights') : t('night_singular', 'night')}
                </span>
                <span className="text-sm font-jost font-light text-gray-800">
                  {formatCurrency(quote.pricing.subtotal, quote.pricing.currency)}
                </span>
              </div>

              {/* Fees (excluding discounts) */}
              {quote.pricing.fees
                .filter((fee) => fee.amount >= 0)
                .map((fee, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm font-jost font-light text-gray-600">
                      {translateLineItem(fee.name, t)}
                    </span>
                    <span className="text-sm font-jost font-light text-gray-800">
                      {formatCurrency(fee.amount, quote.pricing!.currency)}
                    </span>
                  </div>
                ))}

              {/* Sunday check-out perk - not a Lodgify fee, so it's not part
                  of pricing.fees; shown right after the fees list (City Tax
                  etc.) whenever the stay happens to check out on a Sunday. */}
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

              {/* Discount (special styling) */}
              {quote.pricing.discount && (
                <div className="flex justify-between items-center bg-green-50 -mx-4 px-4 py-2">
                  <span className="text-sm font-jost text-green-700 font-medium">
                    {translateLineItem(quote.pricing.discount.name, t)}
                    {quote.pricing.discount.percentage && (
                      <span className="text-green-600 ml-1">
                        (-{quote.pricing.discount.percentage}%)
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-jost text-green-700 font-medium">
                    -{formatCurrency(quote.pricing.discount.amount, quote.pricing.currency)}
                  </span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="font-jost font-semibold text-base text-gray-800">
                {t('total', 'Total')}
              </span>
              <span className="font-jost font-bold text-lg text-gray-800">
                {formatCurrency(quote.pricing.total, quote.pricing.currency)}
              </span>
            </div>

            {/* Free-cancellation notice, only while that window is open */}
            {freeCancellationDate && (
              <div className="bg-green-50 px-3 py-2 mt-3">
                <p className="font-jost text-xs text-green-800 text-center">
                  {t('cancel_free_before', 'Cancel for free before {{date}}').replace(
                    '{{date}}',
                    freeCancellationDate
                  )}
                </p>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost mt-3"
            >
              {t('book_your_stay', 'BOOK YOUR STAY')}
            </button>
          </div>
        )}

        {/* Available but Pricing Not Available - Show minPrice fallback */}
        {!loading && !error && quote?.available && !quote.pricingAvailable && (
          <div className="border-t border-gray-300 pt-4">
            {/* Minimum Price Info */}
            <div className="space-y-2 mb-4">
              {quote.minPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-jost font-light text-gray-600">{t('starting_from', 'Starting from')}</span>
                  <span className="text-sm font-jost text-gray-800 font-medium">
                    {formatCurrency(quote.minPrice, quote.currency || 'EUR')}/{t('night_singular', 'night')}
                  </span>
                </div>
              )}
              <p className="text-xs font-jost font-light text-gray-500">
                {t('final_price_on_booking', 'Final price will be shown on the booking page')}
              </p>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost mt-4"
            >
              {t('view_pricing_book', 'VIEW PRICING & BOOK')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
