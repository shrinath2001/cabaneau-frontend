'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface ReviewData {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  content: string;
  rating: number;
  channel: 'AIRBNB' | 'BOOKING_COM' | 'CASAPILOT' | 'WEBSITE';
  reviewDate?: string;
  cabin?: { name: string; slug: string };
}

interface ChannelStat {
  channel: string;
  averageRating: number;
  count: number;
}

interface StatsData {
  channels: ChannelStat[];
  overall: { averageRating: number; count: number };
}

interface ReviewsSectionProps {
  title?: string;
  backgroundColor?: string;
}

const CHANNEL_CONFIG: Record<string, { label: string; color: string }> = {
  AIRBNB: { label: 'Airbnb', color: '#FF5A5F' },
  BOOKING_COM: { label: 'Booking.com', color: '#003580' },
  CASAPILOT: { label: 'CasaPilot', color: '#2c3e50' },
  WEBSITE: { label: 'Cabaneau', color: '#495D4D' },
};

function ChannelLogo({ channel, size = 32 }: { channel: string; size?: number }) {
  switch (channel) {
    case 'AIRBNB':
      return (
        <img
          src="/assets/airbnb-symbol.svg"
          alt="Airbnb"
          width={size}
          height={size}
          className="object-contain rounded"
        />
      );
    case 'BOOKING_COM':
      return (
        <img
          src="/assets/booking-symbol.svg"
          alt="Booking.com"
          width={size}
          height={size}
          className="object-contain rounded"
        />
      );
    case 'CASAPILOT':
      return (
        <div
          className="flex items-center justify-center rounded-full bg-[#2c3e50] text-white font-bold text-[14px]"
          style={{ width: size, height: size }}
        >
          C
        </div>
      );
    case 'WEBSITE':
    default:
      return (
        <div
          className="flex items-center justify-center rounded-full bg-[#495D4D] text-white font-bold text-[14px]"
          style={{ width: size, height: size }}
        >
          C
        </div>
      );
  }
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' }) {
  const stars = [];
  const sizeClass = size === 'md' ? 'text-[18px]' : 'text-[14px]';

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <svg key={i} className={`inline-block ${sizeClass} text-[#F49A4A]`} fill="currentColor" viewBox="0 0 20 20" width={size === 'md' ? 18 : 14} height={size === 'md' ? 18 : 14}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else if (i - 0.5 <= rating) {
      stars.push(
        <svg key={i} className={`inline-block ${sizeClass} text-[#F49A4A]`} fill="currentColor" viewBox="0 0 20 20" width={size === 'md' ? 18 : 14} height={size === 'md' ? 18 : 14}>
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E5E7EB" />
            </linearGradient>
          </defs>
          <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    } else {
      stars.push(
        <svg key={i} className={`inline-block ${sizeClass} text-gray-300`} fill="currentColor" viewBox="0 0 20 20" width={size === 'md' ? 18 : 14} height={size === 'md' ? 18 : 14}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
  }

  return <span className="inline-flex items-center gap-0.5">{stars}</span>;
}

function ChannelBadge({ channel }: { channel: string }) {
  const config = CHANNEL_CONFIG[channel] || CHANNEL_CONFIG.WEBSITE;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[12px] font-jost font-medium"
      style={{ backgroundColor: config.color }}
    >
      {config.label}
    </span>
  );
}

const ReviewsSection = ({ title, backgroundColor }: ReviewsSectionProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations('homepage');

  const displayTitle = title || t('reviews_section.title', 'GUEST REVIEWS');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, statsRes] = await Promise.all([
          apiFetch('/api/reviews?limit=50'),
          apiFetch('/api/reviews/stats'),
        ]);

        const reviewsData = await reviewsRes.json();
        const statsData = await statsRes.json();

        setReviews(reviewsData?.data || []);

        // Normalize Booking.com ratings from /10 to /5 scale for overall calculation
        if (statsData?.channels) {
          const normalizedChannels = statsData.channels.map((ch: ChannelStat) =>
            ch.channel === 'BOOKING_COM'
              ? { ...ch, averageRating: ch.averageRating / 2 }
              : ch
          );
          const totalCount = normalizedChannels.reduce((sum: number, ch: ChannelStat) => sum + ch.count, 0);
          const weightedSum = normalizedChannels.reduce((sum: number, ch: ChannelStat) => sum + ch.averageRating * ch.count, 0);
          const overallAvg = totalCount > 0 ? weightedSum / totalCount : 0;

          setStats({
            channels: normalizedChannels,
            overall: { averageRating: overallAvg, count: totalCount },
          });
        } else {
          setStats(statsData);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <section className="py-6 md:py-5 px-4 md:px-20" style={backgroundColor ? { backgroundColor } : {}}>
        <div className="max-w-[1390px] mx-auto text-center py-12">
          <p className="text-gray-400 font-jost font-light">{t('reviews_section.loading', 'Loading reviews...')}</p>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <>
      <style jsx>{`
        .reviews-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .reviews-no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <section className="py-6 md:py-5 px-4 md:px-20 md:mt-12" style={bgStyle}>
        <div className="max-w-[1390px] mx-auto">
          {/* Section Title */}
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center pt-6 md:pt-10 mb-8 md:mb-12">
            {displayTitle}
          </h2>

          {/* Channel Stats Bar */}
          {stats && stats.channels.length > 0 && (
            <div className="mb-8 md:mb-12">
              {/* Mobile: Compact overall + 2x2 grid for channels */}
              <div className="md:hidden">
                {/* Overall rating - compact horizontal */}
                {stats.overall.count > 0 && (
                  <div className="flex items-center justify-center gap-3 mb-3 px-4 py-2 bg-[#495D4D] text-white mx-auto max-w-[320px]">
                    <div className="font-logga text-[28px] font-semibold text-[#F49A4A]">
                      {stats.overall.averageRating.toFixed(1)}
                    </div>
                    <div className="text-left">
                      <div className="font-jost text-[13px] font-medium">{t('reviews_section.overall', 'Overall')}</div>
                      <div className="flex items-center gap-1">
                        <StarRating rating={stats.overall.averageRating} size="sm" />
                        <span className="font-jost text-[11px] opacity-70">({stats.overall.count})</span>
                      </div>
                    </div>
                  </div>
                )}
                {/* 2x2 grid of channels */}
                <div className="grid grid-cols-2 gap-2 max-w-[320px] mx-auto">
                  {stats.channels.map((ch) => {
                    const config = CHANNEL_CONFIG[ch.channel] || CHANNEL_CONFIG.WEBSITE;
                    return (
                      <div
                        key={ch.channel}
                        className="flex items-center gap-2 px-3 py-2 bg-white shadow-sm border border-gray-100"
                      >
                        <ChannelLogo channel={ch.channel} size={24} />
                        <div className="min-w-0">
                          <div className="font-jost font-medium text-[12px] text-gray-800 truncate">{config.label}</div>
                          <div className="font-jost text-[11px] text-gray-600 flex items-center gap-1">
                            <svg className="w-3 h-3 text-[#F49A4A]" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {ch.averageRating.toFixed(1)} <span className="text-gray-400">({ch.count})</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Desktop: horizontal row */}
              <div className="hidden md:flex flex-wrap justify-center gap-8">
                {stats.channels.map((ch) => {
                  const config = CHANNEL_CONFIG[ch.channel] || CHANNEL_CONFIG.WEBSITE;
                  return (
                    <div
                      key={ch.channel}
                      className="flex items-center gap-3 px-4 py-3 bg-white shadow-sm border border-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <ChannelLogo channel={ch.channel} size={32} />
                      </div>
                      <div>
                        <div className="font-jost font-medium text-[14px] text-gray-800">{config.label}</div>
                        <div className="flex items-center gap-1.5">
                          <StarRating rating={ch.averageRating} size="sm" />
                          <span className="font-jost text-[13px] text-gray-600">
                            {ch.averageRating.toFixed(1)} ({ch.count})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Overall - desktop */}
                {stats.overall.count > 0 && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#495D4D] text-white">
                    <div className="w-8 h-8 rounded-full bg-[#F49A4A] flex items-center justify-center text-white text-[12px] font-bold flex-shrink-0">
                      {stats.overall.averageRating.toFixed(1)}
                    </div>
                    <div>
                      <div className="font-jost font-medium text-[14px]">{t('reviews_section.overall', 'Overall')}</div>
                      <div className="flex items-center gap-1.5">
                        <StarRating rating={stats.overall.averageRating} size="sm" />
                        <span className="font-jost text-[13px] opacity-80">
                          ({stats.overall.count} {t('reviews_section.reviews', 'reviews')})
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reviews Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            {reviews.length > 3 && (
              <button
                onClick={scrollLeft}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Scroll left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className="flex gap-4 md:gap-5 overflow-x-auto reviews-no-scrollbar py-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-[calc(100vw-32px)] md:w-[360px] bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {/* Header: Avatar + Name + Channel */}
                  <div className="flex items-start gap-3 mb-4">
                    {review.reviewerAvatar ? (
                      <Image
                        src={review.reviewerAvatar}
                        alt={review.reviewerName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover flex-shrink-0"
                        style={{ width: 48, height: 48 }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-[#495D4D] flex items-center justify-center text-white font-jost font-medium text-[18px] flex-shrink-0">
                        {review.reviewerName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-jost font-medium text-[16px] text-gray-900 truncate">
                        {review.reviewerName}
                      </div>
                      <div className="mt-1">
                        <ChannelBadge channel={review.channel} />
                      </div>
                    </div>
                  </div>

                  {/* Stars - normalize Booking.com from /10 to /5 */}
                  <div className="mb-3">
                    <StarRating rating={review.channel === 'BOOKING_COM' ? Number(review.rating) / 2 : Number(review.rating)} size="md" />
                  </div>

                  {/* Review Text */}
                  <p className="font-jost font-light text-[15px] leading-relaxed text-gray-700 line-clamp-5 mb-3">
                    &ldquo;{review.content}&rdquo;
                  </p>

                  {/* Date */}
                  {review.reviewDate && (
                    <p className="font-jost text-[13px] text-gray-400">
                      {new Date(review.reviewDate).toLocaleDateString('en-GB', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            {reviews.length > 3 && (
              <button
                onClick={scrollRight}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white shadow-md rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Scroll right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#495D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ReviewsSection;
