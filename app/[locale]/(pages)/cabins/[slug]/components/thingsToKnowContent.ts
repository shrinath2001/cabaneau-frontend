// Things to Know content
// Cancellation policy is hardcoded with dynamic dates
// All other sections (House Rules, Safety, etc.) are CMS-driven

export interface TranslatedText {
  en: string;
  fr: string;
  de: string;
  nl: string;
}

// CMS-driven section interface (localized by API)
export interface CMSThingsToKnowSection {
  icon: string;
  title: string; // Already localized by API
  intro?: string;
  previewItems?: Array<{ text: string }>;
  groups?: Array<{
    header: string;
    items: Array<{
      icon: string;
      text?: string;
      description?: string;
    }>;
  }>;
  footer?: string;
  // Old format backward compat
  content?: string;
}

// Cancellation policy interfaces
export interface CancellationTier {
  label: TranslatedText;
  dateOffset: number; // Days before check-in (negative number)
  refundType: TranslatedText;
  description: TranslatedText;
}

export interface CancellationSection {
  title: TranslatedText;
  tiers: CancellationTier[];
  footer: {
    timeNote: TranslatedText;
  };
  previewTemplate: {
    line1: TranslatedText;
    line2: TranslatedText;
  };
}

// Cancellation Policy - hardcoded with dynamic dates
export const cancellationPolicyContent: CancellationSection = {
  title: {
    en: "Cancellation policy",
    fr: "Conditions d'annulation",
    de: "Stornierungsbedingungen",
    nl: "Annuleringsbeleid"
  },
  tiers: [
    {
      label: {
        en: "Before",
        fr: "Avant le",
        de: "Vor dem",
        nl: "Voor"
      },
      dateOffset: -14, // 14 days before check-in
      refundType: {
        en: "Partial refund",
        fr: "Remboursement partiel",
        de: "Teilweise Erstattung",
        nl: "Gedeeltelijke terugbetaling"
      },
      description: {
        en: "Get back 50% of what you paid.",
        fr: "Recuperez 50% de ce que vous avez paye.",
        de: "Erhalten Sie 50% Ihrer Zahlung zuruck.",
        nl: "Krijg 50% van uw betaling terug."
      }
    },
    {
      label: {
        en: "After",
        fr: "Apres le",
        de: "Nach dem",
        nl: "Na"
      },
      dateOffset: -14, // Same date (after this = no refund)
      refundType: {
        en: "No refund",
        fr: "Aucun remboursement",
        de: "Keine Erstattung",
        nl: "Geen terugbetaling"
      },
      description: {
        en: "This reservation is non-refundable.",
        fr: "Cette reservation n'est pas remboursable.",
        de: "Diese Reservierung ist nicht erstattungsfahig.",
        nl: "Deze reservering is niet restitueerbaar."
      }
    }
  ],
  footer: {
    timeNote: {
      en: "Time shown is based on the property's local time (CET).",
      fr: "L'heure indiquee est basee sur l'heure locale de la propriete (CET).",
      de: "Die angezeigte Zeit basiert auf der Ortszeit der Unterkunft (MEZ).",
      nl: "De weergegeven tijd is gebaseerd op de lokale tijd van het pand (CET)."
    }
  },
  previewTemplate: {
    line1: {
      en: "50% refund if canceled before {{refundDate}}.",
      fr: "50% de remboursement si annule avant le {{refundDate}}.",
      de: "50% Erstattung bei Stornierung vor dem {{refundDate}}.",
      nl: "50% terugbetaling bij annulering voor {{refundDate}}."
    },
    line2: {
      en: "No refund after this date.",
      fr: "Aucun remboursement apres cette date.",
      de: "Keine Erstattung nach diesem Datum.",
      nl: "Geen terugbetaling na deze datum."
    }
  }
};

/**
 * Detect old format thingsToKnow entries (have 'content' but no 'groups')
 */
export function isOldFormat(section: CMSThingsToKnowSection): boolean {
  return !!(section.content && !section.groups);
}

/**
 * Replace template placeholders in text
 * e.g., "{{capacity}} guests" with capacity=6 becomes "6 guests"
 */
export function replaceTemplatePlaceholders(
  text: string,
  replacements: Record<string, string | number>
): string {
  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value));
  }
  return result;
}

/**
 * Get localized text from a TranslatedText object
 */
export function getLocalizedText(obj: TranslatedText, locale: string): string {
  const validLocale = (locale as keyof TranslatedText) || 'en';
  return obj[validLocale] || obj.en;
}

/**
 * Parse date string in various formats (YYYYMMDD or YYYY-MM-DD)
 */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle YYYYMMDD format (e.g., "20260128")
  if (/^\d{8}$/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    return new Date(year, month, day);
  }

  // Handle YYYY-MM-DD format (e.g., "2026-01-28")
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Try standard Date parsing as fallback
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Calculate the cancellation refund deadline date
 * Based on 14 days before check-in at 14:00 (check-in time)
 */
export function calculateCancellationDate(checkInDate: string): Date | null {
  if (!checkInDate) return null;

  const checkIn = parseDateString(checkInDate);
  if (!checkIn || isNaN(checkIn.getTime())) return null;

  const refundDeadline = new Date(checkIn);
  refundDeadline.setDate(refundDeadline.getDate() - 14);
  refundDeadline.setHours(14, 0, 0, 0); // 14:00 local time (check-in time)
  return refundDeadline;
}

/**
 * Format a date for display in the specified locale
 * Returns format like "15 Feb, 14:00"
 */
export function formatDateForLocale(date: Date, locale: string): string {
  const localeMap: Record<string, string> = {
    en: 'en-GB',
    fr: 'fr-FR',
    de: 'de-DE',
    nl: 'nl-NL'
  };

  const dateFormatter = new Intl.DateTimeFormat(localeMap[locale] || 'en-GB', {
    day: 'numeric',
    month: 'short'
  });

  const timeFormatter = new Intl.DateTimeFormat(localeMap[locale] || 'en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const dateStr = dateFormatter.format(date);
  const timeStr = timeFormatter.format(date);

  return `${dateStr}, ${timeStr}`;
}

// Fallback text when no check-in date is selected
const noDateFallback: TranslatedText = {
  en: "14 days before check-in",
  fr: "14 jours avant l'arrivee",
  de: "14 Tage vor dem Check-in",
  nl: "14 dagen voor inchecken"
};

/**
 * Get cancellation preview text with dynamic dates
 */
export function getCancellationPreviewText(
  checkIn: string | undefined,
  locale: string
): { line1: string; line2: string } {
  const template = cancellationPolicyContent.previewTemplate;

  const refundDate = checkIn ? calculateCancellationDate(checkIn) : null;

  if (!refundDate) {
    const fallbackText = getLocalizedText(noDateFallback, locale);
    return {
      line1: getLocalizedText(template.line1, locale).replace('{{refundDate}}', fallbackText),
      line2: getLocalizedText(template.line2, locale)
    };
  }

  const formattedDate = formatDateForLocale(refundDate, locale);

  return {
    line1: getLocalizedText(template.line1, locale).replace('{{refundDate}}', formattedDate),
    line2: getLocalizedText(template.line2, locale)
  };
}
