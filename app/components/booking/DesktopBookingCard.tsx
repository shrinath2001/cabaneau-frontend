'use client';

import { QuoteResponse, formatCurrency } from './hooks/useQuote';

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
  children: number;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
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
  children,
  quote,
  loading,
  error,
}: DesktopBookingCardProps) {
  // Format dates for display
  const formatDateForDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handle change dates - clear URL params
  const handleChangeDates = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete('arrival');
    url.searchParams.delete('departure');
    url.searchParams.delete('adults');
    url.searchParams.delete('children');
    url.searchParams.delete('infants');
    url.searchParams.delete('pets');
    window.location.href = url.toString();
  };

  // Handle booking - redirect to checkout
  const handleBooking = () => {
    if (quote?.checkoutUrl) {
      window.location.href = quote.checkoutUrl;
    }
  };

  const totalGuests = adults + children;

  return (
    <div
      className="bg-white border-2 border-gray-300 w-full md:w-[464px] md:sticky md:top-24"
      style={{ maxHeight: 'calc(100vh - 100px)' }}
    >
      {/* Cabin Name Header */}
      <div className="px-6 py-4 border-b border-gray-300">
        <h2 className="font-jost font-medium text-[18px] md:text-[20px] uppercase text-gray-800">
          {cabin.name}
        </h2>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        {/* Date Inputs - Read Only with Change Link */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">
              Arrival
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 text-sm bg-gray-50 flex items-center justify-between">
              <span>{formatDateForDisplay(checkIn)}</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1 uppercase">
              Departure
            </label>
            <div className="w-full px-3 py-2 border border-gray-300 text-sm bg-gray-50 flex items-center justify-between">
              <span>{formatDateForDisplay(checkOut)}</span>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Change Dates Link */}
        <div className="text-right">
          <button
            onClick={handleChangeDates}
            className="text-sm text-[#495D4D] hover:text-[#3d5a3d] underline font-medium"
          >
            Change dates
          </button>
        </div>

        {/* Guest Display */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm font-medium text-gray-700 uppercase">
            Guests
          </span>
          <span className="font-medium text-gray-800">
            {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
            {children > 0 && (
              <span className="text-gray-500 text-sm ml-1">
                ({adults} adult{adults !== 1 ? 's' : ''}, {children} child
                {children !== 1 ? 'ren' : ''})
              </span>
            )}
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="border-t border-gray-300 pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
              <div className="h-4 w-12 bg-gray-200 animate-pulse rounded" />
            </div>
            <div className="h-12 bg-gray-200 animate-pulse rounded mt-4" />
          </div>
        )}

        {/* Error State */}
        {!loading && (error || (quote && !quote.available)) && (
          <div className="border-t border-gray-300 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 font-medium text-sm">
                {quote?.unavailableReason || error || 'Selected dates are not available'}
              </p>
            </div>
            <button
              onClick={handleChangeDates}
              className="w-full bg-gray-400 text-white py-4 px-6 text-base font-bold tracking-wide uppercase font-jost"
            >
              SELECT DIFFERENT DATES
            </button>
          </div>
        )}

        {/* Success State with Pricing */}
        {!loading && !error && quote?.available && quote.pricing && (
          <div className="border-t border-gray-300 pt-4">
            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {formatCurrency(quote.pricing.nightlyRate, quote.pricing.currency)} ×{' '}
                  {quote.pricing.nights} night{quote.pricing.nights !== 1 ? 's' : ''}
                </span>
                <span className="text-sm text-gray-800">
                  {formatCurrency(quote.pricing.subtotal, quote.pricing.currency)}
                </span>
              </div>

              {/* Fees */}
              {quote.pricing.fees.map((fee, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{fee.name}</span>
                  <span className="text-sm text-gray-800">
                    {formatCurrency(fee.amount, quote.pricing!.currency)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center py-3 border-t border-gray-200">
              <span className="font-jost font-semibold text-base text-gray-800">
                Total
              </span>
              <span className="font-jost font-bold text-lg text-gray-800">
                {formatCurrency(quote.pricing.total, quote.pricing.currency)}
              </span>
            </div>

            {/* Book Button */}
            <button
              onClick={handleBooking}
              className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost mt-4"
            >
              BOOK YOUR STAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
