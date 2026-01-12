'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiFetch } from '@/app/lib/api';

// Simple cache to deduplicate requests across component instances
const quoteCache = new Map<string, { data: QuoteResponse | null; timestamp: number; promise?: Promise<QuoteResponse> }>();
const CACHE_TTL = 30000; // 30 seconds

export interface QuoteFee {
  type: string;
  name: string;
  amount: number;
  isTax?: boolean;
}

export interface QuoteDiscount {
  name: string;
  amount: number;
  percentage?: number | null;
}

export interface QuotePricing {
  currency: string;
  nightlyRate: number;
  nights: number;
  subtotal: number;
  fees: QuoteFee[];
  total: number;
  discount?: QuoteDiscount;
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
  // Check cache for initial state (inline to avoid hooks ordering issues)
  const cacheKey = `${slug}:${checkIn}:${checkOut}:${adults}:${children}:${infants}:${pets}`;
  const cachedInitial = quoteCache.get(cacheKey);
  const hasRequiredParams = !!(slug && checkIn && checkOut);
  const hasCachedData = cachedInitial?.data && (Date.now() - cachedInitial.timestamp) < CACHE_TTL;

  const [quote, setQuote] = useState<QuoteResponse | null>(() =>
    hasCachedData ? cachedInitial!.data : null
  );
  const [loading, setLoading] = useState(() =>
    hasRequiredParams && !hasCachedData
  );
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Generate cache key from params
  const getCacheKey = useCallback(() => {
    return `${slug}:${checkIn}:${checkOut}:${adults}:${children}:${infants}:${pets}`;
  }, [slug, checkIn, checkOut, adults, children, infants, pets]);

  const fetchQuote = useCallback(async (forceRefresh = false) => {
    // Don't fetch if we don't have required params
    if (!slug || !checkIn || !checkOut) {
      setQuote(null);
      setError(null);
      return;
    }

    const cacheKey = getCacheKey();
    const cached = quoteCache.get(cacheKey);
    const now = Date.now();

    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && cached && cached.data && (now - cached.timestamp) < CACHE_TTL) {
      setQuote(cached.data);
      setLoading(false);
      return;
    }

    // If there's an in-flight request, wait for it
    if (cached?.promise) {
      setLoading(true);
      try {
        const data = await cached.promise;
        if (mountedRef.current) {
          setQuote(data);
          setLoading(false);
        }
      } catch (err) {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : 'Failed to fetch quote';
          setError(message);
          setQuote(null);
          setLoading(false);
        }
      }
      return;
    }

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      checkIn,
      checkOut,
      adults: adults.toString(),
      children: children.toString(),
      infants: infants.toString(),
      pets: pets.toString(),
    });

    // Create the fetch promise and store it in cache
    const fetchPromise = apiFetch(`/api/cabins/slug/${slug}/quote?${params.toString()}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch quote: ${response.status}`);
        }
        return response.json();
      });

    // Store promise in cache to deduplicate concurrent requests
    quoteCache.set(cacheKey, { data: null, timestamp: now, promise: fetchPromise });

    try {
      const data: QuoteResponse = await fetchPromise;
      // Update cache with result
      quoteCache.set(cacheKey, { data, timestamp: Date.now() });
      if (mountedRef.current) {
        setQuote(data);
      }
    } catch (err) {
      // Clear failed request from cache
      quoteCache.delete(cacheKey);
      if (mountedRef.current) {
        const message = err instanceof Error ? err.message : 'Failed to fetch quote';
        setError(message);
        setQuote(null);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [slug, checkIn, checkOut, adults, children, infants, pets, getCacheKey]);

  // Fetch quote when params change
  useEffect(() => {
    mountedRef.current = true;
    fetchQuote();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchQuote]);

  return {
    quote,
    loading,
    error,
    refetch: () => fetchQuote(true), // Force refresh when manually called
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
