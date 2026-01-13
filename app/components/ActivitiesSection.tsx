'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ActivityCard from './ActivityCard';
import { apiFetch } from '@/app/lib/api';
import { useTranslations } from '@/app/providers/TranslationsProvider';

interface ActivityData {
  imageSrc: string;
  activityName: string;
}

const ActivitiesSection = () => {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslations('homepage');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await apiFetch('/api/activities');
        const result = await response.json();
        const data = result?.data ?? result ?? [];

        if (Array.isArray(data)) {
          // Filter out DINING category and take first 3
          const nonDiningActivities = data
            .filter((a: any) => a.category !== 'DINING')
            .slice(0, 3);

          setActivities(nonDiningActivities.map((a: any) => ({
            imageSrc: a.featuredImage || '/assets/d206536ef067f64b29cad184324fe360bb763e30.jpg',
            activityName: a.name?.toUpperCase() || '',
          })));
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <section className="py-6 md:py-5 px-4 md:px-20 bg-white md:mt-12">
      <div className="container mx-auto">
        <div className="max-w-[1390px] mx-auto">
          <h2 className="font-logga text-[28px] md:text-[42px] font-semibold text-center mb-8 md:mb-16">{t('activities_section.title', 'ACTIVITIES IN THE REGION')}</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">{t('activities_section.loading', 'Loading activities...')}</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('activities_section.not_found', 'Activities not found')}</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-[18px] md:gap-3 justify-between">
              {activities.map((activity, index) => (
                <ActivityCard key={index} {...activity} />
              ))}
            </div>
          )}
          <div className="text-center mt-6 md:mt-10 mb-6 md:mb-8">
            <Link href="/activities">
              <button className="py-3 px-6 bg-[#495D4D] text-white text-base md:text-lg font-heading font-medium tracking-widest hover:bg-[#2d4a2d] transition-colors">
                {t('activities_section.button', 'DISCOVER ALL ACTIVITIES')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;
