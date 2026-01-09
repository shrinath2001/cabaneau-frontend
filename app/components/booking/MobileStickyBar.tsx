'use client';

import { QuoteResponse, formatCurrency, formatDateRange } from './hooks/useQuote';

interface MobileStickyBarProps {
  hasDateParams: boolean;
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  onCheckAvailability: () => void;
  onChangeDates?: () => void;
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
}: MobileStickyBarProps) {
  // Mode 1: No dates selected - show "Check Availability"
  if (!hasDateParams) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <span className="text-base font-medium text-gray-900">
              Add dates for prices
            </span>
          </div>
          <button
            onClick={onCheckAvailability}
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white font-semibold py-3 px-6 transition-colors"
          >
            Check Availability
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col gap-1">
            <div className="h-5 w-20 bg-gray-200 animate-pulse rounded" />
            <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="h-12 w-28 bg-gray-200 animate-pulse rounded-lg" />
        </div>
      </div>
    );
  }

  // Error or unavailable state
  if (error || (quote && !quote.available)) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <span className="text-base font-medium text-red-600">
              Not Available
            </span>
            <span className="text-sm text-gray-500">
              {quote?.unavailableReason || error || 'Selected dates are not available'}
            </span>
          </div>
          <button
            onClick={onCheckAvailability}
            className="bg-gray-400 text-white font-semibold py-3 px-6"
          >
            Change Dates
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(pricing.total, pricing.currency)}
              </span>
              {hasDiscount && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                  -{pricing.discount!.percentage || Math.round((pricing.discount!.amount / pricing.subtotal) * 100)}%
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              For {pricing.nights} night{pricing.nights !== 1 ? 's' : ''} · {formatDateRange(checkIn, checkOut)}
            </span>
            {onChangeDates && (
              <button
                onClick={onChangeDates}
                className="text-xs text-[#495D4D] hover:text-[#3d5a3d] underline text-left mt-1"
              >
                Change dates
              </button>
            )}
          </div>
          <button
            onClick={handleReserve}
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white font-semibold py-3 px-6 transition-colors"
          >
            Reserve
          </button>
        </div>
      </div>
    );
  }

  // Available but pricing not available - show minPrice fallback
  if (quote?.available && !quote.pricingAvailable) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50 lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex flex-col">
            {quote.minPrice ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  From {formatCurrency(quote.minPrice, quote.currency || 'EUR')}/night
                </span>
                <span className="text-sm text-gray-500">
                  Final price on booking page
                </span>
              </>
            ) : (
              <span className="text-base font-medium text-gray-900">
                View pricing
              </span>
            )}
            {onChangeDates && (
              <button
                onClick={onChangeDates}
                className="text-xs text-[#495D4D] hover:text-[#3d5a3d] underline text-left mt-1"
              >
                Change dates
              </button>
            )}
          </div>
          <button
            onClick={handleReserve}
            className="bg-[#F49A4A] hover:bg-[#e08a3a] text-white font-semibold py-3 px-6 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    );
  }

  // Fallback - shouldn't normally reach here
  return null;
}
