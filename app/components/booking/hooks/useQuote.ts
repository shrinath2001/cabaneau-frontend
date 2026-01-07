'use client';

import { useState, useEffect, useCallback } from 'react';

export interface QuoteFee {
  type: string;
  name: string;
  amount: number;
  isTax?: boolean;
}

export interface QuotePricing {
  currency: string;
  nightlyRate: number;
  nights: number;
  subtotal: number;
  fees: QuoteFee[];
  total: number;
}

export interface QuoteGuests {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface QuoteResponse {
  available: boolean;
  pricingAvailable: boolean;
  pricing?: QuotePricing;
  minPrice?: number;
  currency?: string;
  checkoutUrl: string;
  unavailableReason?: string;
  checkIn: string;
  checkOut: string;
  guests: QuoteGuests;
}

interface UseQuoteParams {
  slug: string;
  checkIn?: string;
  checkOut?: string;
  adults?: number;
  children?: number;
  infants?: number;
  pets?: number;
}

interface UseQuoteResult {
  quote: QuoteResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage booking quote data
 */
export function useQuote({
  slug,
  checkIn,
  checkOut,
  adults = 1,
  children = 0,
  infants = 0,
  pets = 0,
}: UseQuoteParams): UseQuoteResult {
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    // Don't fetch if we don't have required params
    if (!slug || !checkIn || !checkOut) {
      setQuote(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        checkIn,
        checkOut,
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString(),
        pets: pets.toString(),
      });

      const response = await fetch(`/api/cabins/slug/${slug}/quote?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch quote: ${response.status}`);
      }

      const data: QuoteResponse = await response.json();
      setQuote(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch quote';
      setError(message);
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [slug, checkIn, checkOut, adults, children, infants, pets]);

  // Fetch quote when params change
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return {
    quote,
    loading,
    error,
    refetch: fetchQuote,
  };
}

/**
 * Format currency amount for display
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-EU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date range for display (e.g., "7-9 Jan")
 */
export function formatDateRange(checkIn: string, checkOut: string): string {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const month = startDate.toLocaleDateString('en-US', { month: 'short' });

  // If same month
  if (startDate.getMonth() === endDate.getMonth()) {
    return `${startDay}-${endDay} ${month}`;
  }

  // Different months
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  return `${startDay} ${month} - ${endDay} ${endMonth}`;
}
