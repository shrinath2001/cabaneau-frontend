'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { formatCurrency } from '@/app/components/booking/hooks/useQuote';
import { stripPastedFormatting } from '@/app/lib/richText';
import CabinsSection from '@/app/components/CabinsSection';

const OCCASIONS = ['Birthday', 'Anniversary', 'Just because', 'Other'] as const;
const OCCASION_LABEL_KEY: Record<(typeof OCCASIONS)[number], string> = {
  Birthday: 'occasion_birthday',
  Anniversary: 'occasion_anniversary',
  'Just because': 'occasion_just_because',
  Other: 'occasion_other',
};

// Tomorrow, as a yyyy-mm-dd string for the date input's min attribute.
function tomorrowIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

// One heading style for every H2 on this page (subtitle, CMS text, form
// heading) - the same as the section headings on the cabin page.
const H2_CLASS = 'font-logga font-semibold text-[18px] md:text-[20px] uppercase tracking-wide text-gray-800';

interface GiftVoucherPageClientProps {
  /** Left-column rich text (H2 + paragraphs) from the CMS page "gift-voucher". */
  content: string;
  /** Cabins for the carousel under the form, same data as the home page. */
  cabins: Parameters<typeof CabinsSection>[0]['cabins'];
}

export default function GiftVoucherPageClient({ content, cabins }: GiftVoucherPageClientProps) {
  const { t } = useTranslations('gift_voucher');

  const [amounts, setAmounts] = useState<number[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

  const [purchaserName, setPurchaserName] = useState('');
  const [purchaserEmail, setPurchaserEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [occasion, setOccasion] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/gift-cards/amounts')
      .then((res) => res.json())
      .then((data: number[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setAmounts(data);
          setSelectedAmount(data[0]);
        }
      })
      .catch(() => {
        // Leave amounts empty - the picker just won't render, and the
        // submit button stays disabled without a selected amount.
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAmount) return;

    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          // Always a gift: the "for myself" option was removed (client
          // feedback 2 Nov 2026), the voucher goes to the recipient.
          isGift: true,
          purchaserName,
          purchaserEmail,
          recipientName,
          recipientEmail,
          personalMessage: personalMessage || undefined,
          occasion: occasion || undefined,
          scheduledSendAt:
            scheduleEnabled && scheduledDate
              ? `${scheduledDate}T09:00:00.000Z`
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(data.message || t('error_generic'));
        setSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError(t('error_generic'));
      setSubmitting(false);
    }
  };

  // Same field look as the booking card: small uppercase labels, light text.
  const inputClass =
    'w-full px-3 py-2.5 border border-gray-400 bg-white focus:border-[#495D4D] focus:outline-none font-jost font-light text-sm text-gray-900';
  const labelClass = 'block text-[10px] font-jost font-medium text-gray-700 uppercase tracking-wide mb-1';
  const subtitle = t('subtitle');

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - title, subtitle and the CMS text */}
            <div>
              <h1
                className="font-logga text-[28px] md:text-[42px] font-semibold mb-4 md:mb-5"
                style={{ color: '#212121' }}
              >
                {t('page_title').toUpperCase()}
              </h1>
              {/* A paragraph, not a heading: styled like the H2s on purpose */}
              {subtitle && <p className={`${H2_CLASS} mb-6 md:mb-8`}>{subtitle}</p>}
              {content ? (
                <div
                  className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed text-gray-700 [&_p]:mb-4 [&_p:last-child]:mb-0 [&_h2]:[font-family:var(--font-logga)] [&_h2]:font-semibold [&_h2]:text-[18px] md:[&_h2]:text-[20px] [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-gray-800 [&_h2]:leading-snug [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_h3]:font-jost [&_h3]:font-medium [&_h3]:text-gray-800 [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_a]:underline [&_strong]:font-medium [&_b]:font-medium"
                  dangerouslySetInnerHTML={{ __html: stripPastedFormatting(content) }}
                />
              ) : (
                // CMS page missing or unreachable: the texts the page had before
                <div className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed text-gray-700 space-y-4">
                  <p>{t('intro_p1')}</p>
                  <p>{t('intro_p2')}</p>
                </div>
              )}
            </div>

            {/* Right Column - Purchase form, no frame around it */}
            <div>
              <div>
                <Image
                  src="/assets/gift-card.png"
                  alt={t('page_title')}
                  width={576}
                  height={384}
                  className="w-full h-auto"
                  priority
                />
                <form onSubmit={handleSubmit} className="pt-6 md:pt-8 space-y-5">
                  {/* Amount - the form's heading */}
                  <div>
                    <h2 id="gift-amount-heading" className={`${H2_CLASS} mb-4`}>
                      {t('amount_label')}
                    </h2>
                    <select
                      aria-labelledby="gift-amount-heading"
                      required
                      value={selectedAmount ?? ''}
                      onChange={(e) => setSelectedAmount(Number(e.target.value))}
                      className={inputClass}
                    >
                      {amounts.length === 0 && <option value="" />}
                      {amounts.map((amount) => (
                        <option key={amount} value={amount}>
                          {formatCurrency(amount)}
                        </option>
                      ))}
                    </select>
                  </div>
  
                  {/* Purchaser */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>{t('your_name')}</label>
                      <input
                        type="text"
                        required
                        value={purchaserName}
                        onChange={(e) => setPurchaserName(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>{t('your_email')}</label>
                      <input
                        type="email"
                        required
                        value={purchaserEmail}
                        onChange={(e) => setPurchaserEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>
  
                  {/* Recipient + occasion + message + schedule */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          {t('recipient_name')}
                        </label>
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          {t('recipient_email')}
                        </label>
                        <input
                          type="email"
                          required
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
  
                    <div>
                      <label className={labelClass}>{t('occasion_label')}</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className={inputClass}
                      >
                        <option value="" />
                        {OCCASIONS.map((o) => (
                          <option key={o} value={o}>
                            {t(OCCASION_LABEL_KEY[o])}
                          </option>
                        ))}
                      </select>
                    </div>
  
                    <div>
                      <label className={labelClass}>
                        {t('message_label')}
                      </label>
                      <textarea
                        rows={3}
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        placeholder={t('message_placeholder')}
                        className={inputClass}
                      />
                    </div>
  
                    <div>
                      <label className="flex items-center gap-2 font-jost font-light text-sm text-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleEnabled}
                          onChange={(e) => setScheduleEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        {t('schedule_toggle')}
                      </label>
                      {scheduleEnabled && (
                        <input
                          type="date"
                          required={scheduleEnabled}
                          min={tomorrowIso()}
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className={`${inputClass} mt-3`}
                          aria-label={t('schedule_date_label')}
                        />
                      )}
                    </div>
  
                  <div className="font-jost font-light text-sm text-gray-600 space-y-1">
                    <p>{t('validity_note')}</p>
                    <p>{t('deductible_note')}</p>
                  </div>
  
                  {error && (
                    <div className="bg-red-50 border border-red-200 p-3">
                      <p className="text-red-600 font-jost text-sm">{error}</p>
                    </div>
                  )}
  
                  <button
                    type="submit"
                    disabled={!selectedAmount || submitting}
                    className="w-full bg-[#495D4D] hover:bg-[#3d4d3f] text-white py-3 px-6 text-base font-bold tracking-wide transition uppercase font-jost disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? t('submit_button_loading')
                      : t('submit_button')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "Our cabins" title + the 6 cabins, the same carousel as on the home page */}
      <CabinsSection cabins={cabins} />
    </div>
  );
}
