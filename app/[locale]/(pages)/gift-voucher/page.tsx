'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/app/providers/TranslationsProvider';
import { formatCurrency } from '@/app/components/booking/hooks/useQuote';

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

export default function GiftVoucherPage() {
  const { t } = useTranslations('gift_voucher');

  const [amounts, setAmounts] = useState<number[]>([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isGift, setIsGift] = useState(false);

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
          isGift,
          purchaserName,
          purchaserEmail,
          recipientName: isGift ? recipientName : undefined,
          recipientEmail: isGift ? recipientEmail : undefined,
          personalMessage: isGift && personalMessage ? personalMessage : undefined,
          occasion: isGift && occasion ? occasion : undefined,
          scheduledSendAt:
            isGift && scheduleEnabled && scheduledDate
              ? `${scheduledDate}T09:00:00.000Z`
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.checkoutUrl) {
        setError(data.message || t('error_generic', 'Something went wrong. Please try again.'));
        setSubmitting(false);
        return;
      }

      window.location.href = data.checkoutUrl;
    } catch {
      setError(t('error_generic', 'Something went wrong. Please try again.'));
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 focus:border-[#495D4D] focus:outline-none font-jost font-light';
  const labelClass = 'block font-jost text-sm font-medium text-gray-800 mb-2';

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Title and Description */}
            <div>
              <h1
                className="font-logga text-[28px] md:text-[42px] font-semibold mb-6 md:mb-8"
                style={{ color: '#212121' }}
              >
                {t('page_title', 'GIFT VOUCHER').toUpperCase()}
              </h1>
              <div className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed text-gray-700 space-y-4">
                <p>{t('intro_p1')}</p>
                <p>{t('intro_p2')}</p>
              </div>
            </div>

            {/* Right Column - Purchase form */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="border border-gray-300 p-6 md:p-8 space-y-6"
              >
                {/* Amount */}
                <div>
                  <label className={labelClass}>{t('amount_label', 'Choose an amount')}</label>
                  <select
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

                {/* For myself / as a gift */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsGift(false)}
                    className={`py-3 px-4 border font-jost text-sm transition ${
                      !isGift
                        ? 'bg-[#495D4D] border-[#495D4D] text-white'
                        : 'border-gray-300 text-gray-800 hover:border-[#495D4D]'
                    }`}
                  >
                    {t('for_myself', 'For myself')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsGift(true)}
                    className={`py-3 px-4 border font-jost text-sm transition ${
                      isGift
                        ? 'bg-[#495D4D] border-[#495D4D] text-white'
                        : 'border-gray-300 text-gray-800 hover:border-[#495D4D]'
                    }`}
                  >
                    {t('as_a_gift', 'As a gift')}
                  </button>
                </div>

                {/* Purchaser */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>{t('your_name', 'Your name')}</label>
                    <input
                      type="text"
                      required
                      value={purchaserName}
                      onChange={(e) => setPurchaserName(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t('your_email', 'Your email')}</label>
                    <input
                      type="email"
                      required
                      value={purchaserEmail}
                      onChange={(e) => setPurchaserEmail(e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Recipient + occasion + message + schedule - gift only */}
                {isGift && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>
                          {t('recipient_name', "Recipient's name")}
                        </label>
                        <input
                          type="text"
                          required={isGift}
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>
                          {t('recipient_email', "Recipient's email")}
                        </label>
                        <input
                          type="email"
                          required={isGift}
                          value={recipientEmail}
                          onChange={(e) => setRecipientEmail(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>{t('occasion_label', 'Occasion (optional)')}</label>
                      <select
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className={inputClass}
                      >
                        <option value="" />
                        {OCCASIONS.map((o) => (
                          <option key={o} value={o}>
                            {t(OCCASION_LABEL_KEY[o], o)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>
                        {t('message_label', 'Personal message (optional)')}
                      </label>
                      <textarea
                        rows={3}
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        placeholder={t('message_placeholder', 'Write a short note...')}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 font-jost text-sm text-gray-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={scheduleEnabled}
                          onChange={(e) => setScheduleEnabled(e.target.checked)}
                          className="w-4 h-4"
                        />
                        {t('schedule_toggle', 'Send on a future date')}
                      </label>
                      {scheduleEnabled && (
                        <input
                          type="date"
                          required={scheduleEnabled}
                          min={tomorrowIso()}
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className={`${inputClass} mt-3`}
                          aria-label={t('schedule_date_label', 'Delivery date')}
                        />
                      )}
                    </div>
                  </>
                )}

                <p className="font-jost text-xs text-gray-500">
                  {t('validity_note', 'Valid for 1 year from the date of purchase')}
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-3">
                    <p className="text-red-600 font-jost text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!selectedAmount || submitting}
                  className="w-full bg-[#495D4D] text-white py-4 px-6 text-base font-bold tracking-wide hover:bg-[#3d5a3d] transition uppercase font-jost disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? t('submit_button_loading', 'Redirecting...')
                    : t('submit_button', 'Continue to payment')}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
