'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ActivityCard from './ActivityCard';
import CardSlider from './CardSlider';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface SectionItem {
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

interface ActivitiesSectionProps {
  title?: string;
  subtitle?: string;
  items?: SectionItem[];
  buttonText?: string;
  buttonLink?: string;
  backgroundColor?: string;
  useCmsData?: boolean;
}

interface ActivityData {
  imageSrc: string;
  activityName: string;
  subtitle?: string;
  link?: string;
}

const ActivitiesSection = ({
  title,
  subtitle,
  items,
  buttonText,
  buttonLink,
  backgroundColor,
  useCmsData = false,
}: ActivitiesSectionProps) => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(!useCmsData);
  const { t } = useTranslations('homepage');

  useEffect(() => {
    // If CMS data is provided, don't fetch from activities API
    if (useCmsData && items && items.length > 0) {
      setLoading(false);
      return;
    }

    // Fetch from activities API if no CMS data
    const fetchActivities = async () => {
      try {
        const response = await apiFetch('/api/activities');
        const result = await response.json();
        const data = result?.data ?? result ?? [];

        if (Array.isArray(data)) {
          const nonDiningActivities = data
            .filter((a: any) => a.category !== 'dining')
            .slice(0, 3);

          setActivities(nonDiningActivities.map((a: any) => ({
            imageSrc: a.featuredImage || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
            activityName: a.name?.toUpperCase() || '',
            // Deep-link into the matching tab on the activities page.
            link: a.category ? `/activities#${a.category}` : undefined,
          })));
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [useCmsData, items]);

  // Use CMS items if provided
  const displayItems = useCmsData && items && items.length > 0
    ? items.map(item => ({ imageSrc: item.image, activityName: item.title, subtitle: item.subtitle, link: item.link }))
    : activities;

  const displayTitle = title || t('activities_section.title', 'ACTIVITIES IN THE REGION');
  const displayButtonText = buttonText || t('activities_section.button', 'DISCOVER ALL ACTIVITIES');
  const displayButtonLink = buttonLink || '/activities';

  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-white md:mt-12" style={bgStyle}>
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className={`font-logga text-[28px] md:text-[42px] font-semibold md:font-normal text-center pt-6 md:pt-10 ${subtitle ? 'mb-3 md:mb-4' : 'mb-10 md:mb-20'}`}>
            {displayTitle}
          </h2>
          {subtitle && (
            <p className="font-jost font-light text-center text-gray-600 text-base md:text-lg mb-10 md:mb-20">
              {subtitle}
            </p>
          )}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('activities_section.loading', 'Loading activities...')}</p>
            </div>
          ) : displayItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('activities_section.not_found', 'Activities not found')}</p>
            </div>
          ) : (
            <CardSlider label="activities">
              {displayItems.map((activity, index) => (
                <ActivityCard key={index} {...activity} />
              ))}
            </CardSlider>
          )}
          <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
            <Link href={displayButtonLink}>
              <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                {displayButtonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
