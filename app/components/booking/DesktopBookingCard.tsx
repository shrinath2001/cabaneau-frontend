'use client';

import { useState } from 'react';
import { QuoteResponse, formatCurrency, localeToIntl, translateLineItem } from './hooks/useQuote';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { isSunday } from './calendarUtils';
import DesktopDatesPopover from './DesktopDatesPopover';
import DesktopGuestsPopover from './DesktopGuestsPopover';
import type { GuestCounts } from '../search/GuestSteppers';

type GuestField = keyof GuestCounts;

interface CabinInfo {
  slug: string;
  name: string;
  lodgifyId: string;
  capacity?: number;
  allowDogs?: boolean;
}

interface DesktopBookingCardProps {
  cabin: CabinInfo;
  checkIn?: string;
  checkOut?: string;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  locale: string;
  onDatesChange: (checkIn: string, checkOut: string) => void;
  onGuestsChange: (field: GuestField, next: number) => void;
  onClearDates: () => void;
  minStayWarning?: string;
}

/**
 * DesktopBookingCard - compact booking card for desktop.
 *
 * A date/guest field that opens two independent popovers (calendar-only,
 * guests-only - matching Airbnb's split rather than one combined modal),
 * the price breakdown from the Quote API, and a "Reserve" button ->
 * Lodgify checkout. Square corners and no separate price headline, by
 * design - kept narrower than Airbnb's own widget to leave more room for
 * the cabin's own content column.
 */
export default function DesktopBookingCard({
  cabin,
  checkIn,
  checkOut,
  adults,
  children,
  infants,
  pets,
  quote,
  loading,
  error,
  locale,
  onDatesChange,
  onGuestsChange,
  onClearDates,
  minStayWarning,
}: DesktopBookingCardProps) {
  const { t } = useTranslations('booking');
  const [openPopover, setOpenPopover] = useState<'dates' | 'guests' | null>(null);

  const freeCancellationDate =
    quote?.cancellation?.isFreeNow && quote.cancellation.freeUntil
      ? new Date(`${quote.cancellation.freeUntil}T00:00:00`).toLocaleDateString(
          localeToIntl[locale] || 'en-GB',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      : null;

  const formatDateForDisplay = (dateStr?: string): string => {
    if (!dateStr) return t('add_date');
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleBooking = () => {
    if (quote?.checkoutUrl) {
      window.location.href = quote.checkoutUrl;
    }
  };

  const hasDates = !!checkIn && !!checkOut;
  const totalGuests = adults + children;
  const isSundayCheckout = !!checkOut && isSunday(checkOut);
  const hasPricing = hasDates && !loading && !error && quote?.available && quote.pricingAvailable && quote.pricing;

  return (
    <div
      className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_-6px_rgba(0,0,0,0.14)] w-full md:w-[380px] md:sticky md:top-24"
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Cabin Name Header */}
      <div className="px-5 py-3 border-b border-gray-300">
        <h2 className="font-logga font-semibold text-[18px] md:text-[20px] uppercase text-gray-800">
          {cabin.name}
        </h2>
      </div>

      <div className="p-4 md:p-5 space-y-3">
        {/* Date + guests box */}
        <div className="border border-gray-400 overflow-visible">
          <div className="relative">
            <div className="grid grid-cols-2">
              <div
                onClick={() => setOpenPopover(openPopover === 'dates' ? null : 'dates')}
                className="px-3 py-2 border-r border-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                  {t('arrival')}
                </div>
                <div className={`text-sm font-jost font-light ${checkIn ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formatDateForDisplay(checkIn)}
                </div>
              </div>
              <div
                onClick={() => setOpenPopover(openPopover === 'dates' ? null : 'dates')}
                className="px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                  {t('departure')}
                </div>
                <div className={`text-sm font-jost font-light ${checkOut ? 'text-gray-900' : 'text-gray-400'}`}>
                  {formatDateForDisplay(checkOut)}
                </div>
              </div>
            </div>

            <DesktopDatesPopover
              slug={cabin.slug}
              locale={locale}
              isOpen={openPopover === 'dates'}
              onClose={() => setOpenPopover(null)}
              initialCheckIn={checkIn}
              initialCheckOut={checkOut}
              onDatesChange={onDatesChange}
              onClear={onClearDates}
            />
          </div>

          <div className="relative">
            <div
              onClick={() => setOpenPopover(openPopover === 'guests' ? null : 'guests')}
              className="px-3 py-2 border-t border-gray-400 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div>
                <div className="text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide">
                  {t('guests_label')}
                </div>
                <div className="text-sm font-jost font-light text-gray-900">
                  {totalGuests} {totalGuests === 1 ? t('guest_singular') : t('guest_plural')}
                </div>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${openPopover === 'guests' ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            <DesktopGuestsPopover
              isOpen={openPopover === 'guests'}
              onClose={() => setOpenPopover(null)}
              value={{ adults, children, infants, pets }}
              onChange={onGuestsChange}
              locale={locale}
              peopleCap={Math.max(1, cabin.capacity || 1)}
              allowDogs={cabin.allowDogs}
            />
          </div>
        </div>

        {/* Free-cancellation notice - right under the box, ahead of the
            price breakdown, matching where it reads best. */}
        {hasPricing && freeCancellationDate && (
          <div className="bg-gray-100 px-4 py-2">
            <p className="font-jost text-xs text-gray-700 text-center">
              {t('cancel_free_before').replace('{{date}}', freeCancellationDate)}
            </p>
          </div>
        )}

        {/* Min Stay Warning */}
        {minStayWarning && (
          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="font-jost text-xs text-amber-700">{minStayWarning}</span>
          </div>
        )}

        {/* No dates selected yet - fields above are empty ("Add date"),
            guests still work independently of dates. */}
        {!hasDates && (
          <div className="border-t border-gray-300 pt-4">
            <p className="text-sm font-jost font-light text-gray-600 mb-4">
              {t('select_dates_message')}
            </p>
            <button
              onClick={() => setOpenPopover('dates')}
              className="w-full bg-[#495D4D] hover:bg-[#3d4d3f] text-white py-3 px-6 text-base font-bold tracking-wide transition uppercase font-jost"
            >
              {t('check_availability')}
            </button>
          </div>
        )}

        {/* Loading State */}
        {hasDates && loading && (
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
        {hasDates && !loading && (error || (quote && !quote.available)) && (
          <div className="border-t border-gray-300 pt-4">
            <div className="bg-red-50 border border-red-200 p-4 mb-4">
              <p className="text-red-600 font-jost font-medium text-sm">
                {quote?.unavailableReason || error || t('dates_not_available')}
              </p>
            </div>
            <button
              onClick={() => setOpenPopover('dates')}
              className="w-full bg-gray-400 text-white py-3 px-6 text-base font-bold tracking-wide uppercase font-jost"
            >
              {t('select_different_dates')}
            </button>
          </div>
        )}

        {/* Success State with Full Pricing */}
        {hasPricing && quote.pricing && (
          <div className="border-t border-gray-300 pt-4">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-jost font-light text-gray-600">
                  {formatCurrency(quote.pricing.nightlyRate, quote.pricing.currency)} ×{' '}
                  {quote.pricing.nights} {quote.pricing.nights !== 1 ? t('nights_plural') : t('night_singular')}
                </span>
                <span className="text-sm font-jost font-light text-gray-800">
                  {formatCurrency(quote.pricing.subtotal, quote.pricing.currency)}
                </span>
              </div>

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

              {isSundayCheckout && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-jost font-light text-gray-600">
                    {t('line_item.lazy_sunday_checkout')}
                  </span>
                  <span className="text-sm font-jost font-light text-gray-800">
                    {t('line_item.free')}
                  </span>
                </div>
              )}

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
              <span className="font-jost font-semibold text-base text-gray-800">{t('total')}</span>
              <span className="font-jost font-bold text-lg text-gray-800">
                {formatCurrency(quote.pricing.total, quote.pricing.currency)}
              </span>
            </div>

            {/* Reserve Button - brand green, consistent with the calendar */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#495D4D] hover:bg-[#3d4d3f] text-white py-3 px-6 text-base font-bold tracking-wide transition uppercase font-jost mt-3"
            >
              {t('book_your_stay')}
            </button>
            <p className="text-center text-xs font-jost font-light text-gray-500 mt-2">
              {t('not_charged_yet')}
            </p>
          </div>
        )}

        {/* Available but Pricing Not Available - Show minPrice fallback */}
        {hasDates && !loading && !error && quote?.available && !quote.pricingAvailable && (
          <div className="border-t border-gray-300 pt-4">
            <div className="space-y-2 mb-4">
              {quote.minPrice && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-jost font-light text-gray-600">{t('starting_from')}</span>
                  <span className="text-sm font-jost text-gray-800 font-medium">
                    {formatCurrency(quote.minPrice, quote.currency || 'EUR')}/{t('night_singular')}
                  </span>
                </div>
              )}
              <p className="text-xs font-jost font-light text-gray-500">{t('final_price_on_booking')}</p>
            </div>

            <button
              onClick={handleBooking}
              className="w-full bg-[#495D4D] hover:bg-[#3d4d3f] text-white py-3 px-6 text-base font-bold tracking-wide transition uppercase font-jost mt-4"
            >
              {t('view_pricing_book')}
            </button>
            <p className="text-center text-xs font-jost font-light text-gray-500 mt-2">
              {t('not_charged_yet')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
