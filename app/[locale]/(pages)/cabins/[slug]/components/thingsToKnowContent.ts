// Static multilingual content for Things to Know section
// This will be replaced with CMS-driven content in a future phase

export interface TranslatedText {
  en: string;
  fr: string;
  de: string;
  nl: string;
}

export interface ThingsToKnowItem {
  icon: string;
  text?: TranslatedText;
  title?: TranslatedText;
  description?: TranslatedText;
}

export interface ThingsToKnowGroup {
  header: TranslatedText;
  items: ThingsToKnowItem[];
}

export interface ThingsToKnowSection {
  title: TranslatedText;
  intro?: TranslatedText;
  groups: ThingsToKnowGroup[];
  preview: TranslatedText[];
}

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

// House Rules Section
export const houseRulesContent: ThingsToKnowSection = {
  title: {
    en: "House rules",
    fr: "Regles de la maison",
    de: "Hausregeln",
    nl: "Huisregels"
  },
  intro: {
    en: "You'll be staying in a luxury treehouse, so please treat it with care and respect.",
    fr: "Vous sejournerez dans une cabane de luxe, veuillez la traiter avec soin et respect.",
    de: "Sie werden in einem Luxus-Baumhaus ubernachten, bitte behandeln Sie es mit Sorgfalt und Respekt.",
    nl: "U verblijft in een luxe boomhut, behandel deze alstublieft met zorg en respect."
  },
  groups: [
    {
      header: {
        en: "Checking in and out",
        fr: "Arrivee et depart",
        de: "Ein- und Auschecken",
        nl: "In- en uitchecken"
      },
      items: [
        {
          icon: "fa-clock",
          text: {
            en: "Check-in: 14:00 - 22:00",
            fr: "Arrivee: 14:00 - 22:00",
            de: "Check-in: 14:00 - 22:00",
            nl: "Inchecken: 14:00 - 22:00"
          }
        },
        {
          icon: "fa-clock",
          text: {
            en: "Checkout before 10:00",
            fr: "Depart avant 10:00",
            de: "Check-out vor 10:00",
            nl: "Uitchecken voor 10:00"
          }
        },
        {
          icon: "fa-key",
          text: {
            en: "Self check-in with lockbox",
            fr: "Arrivee autonome avec boite a cles",
            de: "Selbst-Check-in mit Schlusselbox",
            nl: "Zelf inchecken met sleutelkastje"
          }
        }
      ]
    },
    {
      header: {
        en: "During your stay",
        fr: "Pendant votre sejour",
        de: "Wahrend Ihres Aufenthalts",
        nl: "Tijdens uw verblijf"
      },
      items: [
        {
          icon: "fa-users",
          text: {
            en: "{{capacity}} guests maximum",
            fr: "{{capacity}} personnes maximum",
            de: "Maximal {{capacity}} Gaste",
            nl: "Maximaal {{capacity}} gasten"
          }
        },
        {
          icon: "fa-paw",
          text: {
            en: "Pets allowed on request",
            fr: "Animaux acceptes sur demande",
            de: "Haustiere auf Anfrage erlaubt",
            nl: "Huisdieren op aanvraag toegestaan"
          }
        },
        {
          icon: "fa-moon",
          text: {
            en: "Quiet hours: 22:00 - 08:00",
            fr: "Heures calmes: 22:00 - 08:00",
            de: "Ruhezeiten: 22:00 - 08:00",
            nl: "Stille uren: 22:00 - 08:00"
          }
        },
        {
          icon: "fa-champagne-glasses",
          text: {
            en: "No parties or events",
            fr: "Pas de fetes ni d'evenements",
            de: "Keine Partys oder Veranstaltungen",
            nl: "Geen feesten of evenementen"
          }
        },
        {
          icon: "fa-ban-smoking",
          text: {
            en: "No smoking",
            fr: "Non-fumeur",
            de: "Rauchen verboten",
            nl: "Niet roken"
          }
        }
      ]
    }
  ],
  preview: [
    {
      en: "Check-in: 14:00 - 22:00",
      fr: "Arrivee: 14:00 - 22:00",
      de: "Check-in: 14:00 - 22:00",
      nl: "Inchecken: 14:00 - 22:00"
    },
    {
      en: "Checkout before 10:00",
      fr: "Depart avant 10:00",
      de: "Check-out vor 10:00",
      nl: "Uitchecken voor 10:00"
    },
    {
      en: "{{capacity}} guests maximum",
      fr: "{{capacity}} personnes maximum",
      de: "Maximal {{capacity}} Gaste",
      nl: "Maximaal {{capacity}} gasten"
    }
  ]
};

// Safety & Property Section
export const safetyPropertyContent: ThingsToKnowSection = {
  title: {
    en: "Safety & property",
    fr: "Securite et propriete",
    de: "Sicherheit & Unterkunft",
    nl: "Veiligheid & accommodatie"
  },
  intro: {
    en: "Avoid surprises by looking over these important details about your treehouse.",
    fr: "Evitez les surprises en consultant ces informations importantes sur votre cabane.",
    de: "Vermeiden Sie Uberraschungen, indem Sie diese wichtigen Details uber Ihr Baumhaus lesen.",
    nl: "Voorkom verrassingen door deze belangrijke details over uw boomhut te bekijken."
  },
  groups: [
    {
      header: {
        en: "Safety devices",
        fr: "Dispositifs de securite",
        de: "Sicherheitseinrichtungen",
        nl: "Veiligheidsvoorzieningen"
      },
      items: [
        {
          icon: "fa-fire-extinguisher",
          title: {
            en: "Fire extinguisher available",
            fr: "Extincteur disponible",
            de: "Feuerloscher vorhanden",
            nl: "Brandblusser aanwezig"
          },
          description: {
            en: "A fire extinguisher is available in each cabin.",
            fr: "Un extincteur est disponible dans chaque cabane.",
            de: "In jeder Hutte ist ein Feuerloscher vorhanden.",
            nl: "In elke hut is een brandblusser aanwezig."
          }
        },
        {
          icon: "fa-bell",
          title: {
            en: "Smoke alarm installed",
            fr: "Detecteur de fumee installe",
            de: "Rauchmelder installiert",
            nl: "Rookmelder geinstalleerd"
          },
          description: {
            en: "Smoke detectors are installed throughout the property.",
            fr: "Des detecteurs de fumee sont installes dans toute la propriete.",
            de: "Rauchmelder sind im gesamten Gebaude installiert.",
            nl: "Rookmelders zijn in het hele pand geinstalleerd."
          }
        },
        {
          icon: "fa-kit-medical",
          title: {
            en: "First aid kit available",
            fr: "Trousse de premiers secours disponible",
            de: "Erste-Hilfe-Kasten vorhanden",
            nl: "EHBO-kit aanwezig"
          },
          description: {
            en: "A first aid kit is provided in each cabin.",
            fr: "Une trousse de premiers secours est fournie dans chaque cabane.",
            de: "In jeder Hutte ist ein Erste-Hilfe-Kasten vorhanden.",
            nl: "In elke hut is een EHBO-kit aanwezig."
          }
        }
      ]
    },
    {
      header: {
        en: "Property info",
        fr: "Informations sur la propriete",
        de: "Objektinformationen",
        nl: "Informatie over het pand"
      },
      items: [
        {
          icon: "fa-tree",
          title: {
            en: "Elevated treehouse structure",
            fr: "Structure surelevee",
            de: "Erhohte Baumhausstruktur",
            nl: "Verhoogde boomhutstructuur"
          },
          description: {
            en: "The cabins are elevated structures. Please supervise children at all times.",
            fr: "Les cabanes sont des structures surelevees. Veuillez surveiller les enfants en tout temps.",
            de: "Die Hutten sind erhohte Strukturen. Bitte beaufsichtigen Sie Kinder jederzeit.",
            nl: "De hutten zijn verhoogde structuren. Houd kinderen te allen tijde in de gaten."
          }
        },
        {
          icon: "fa-video",
          title: {
            en: "Security cameras on property",
            fr: "Cameras de securite sur la propriete",
            de: "Sicherheitskameras auf dem Gelande",
            nl: "Beveiligingscamera's op het terrein"
          },
          description: {
            en: "Exterior cameras monitor common areas for your security.",
            fr: "Des cameras exterieures surveillent les espaces communs pour votre securite.",
            de: "Aussenkameras uberwachen Gemeinschaftsbereiche fur Ihre Sicherheit.",
            nl: "Buitencamera's bewaken gemeenschappelijke ruimtes voor uw veiligheid."
          }
        }
      ]
    }
  ],
  preview: [
    {
      en: "Fire extinguisher available",
      fr: "Extincteur disponible",
      de: "Feuerloscher vorhanden",
      nl: "Brandblusser aanwezig"
    },
    {
      en: "Smoke alarm installed",
      fr: "Detecteur de fumee installe",
      de: "Rauchmelder installiert",
      nl: "Rookmelder geinstalleerd"
    },
    {
      en: "Security cameras on property",
      fr: "Cameras de securite",
      de: "Sicherheitskameras",
      nl: "Beveiligingscamera's"
    }
  ]
};

// Cancellation Policy Section
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

// Helper Functions

/**
 * Get localized text from a TranslatedText object
 */
export function getLocalizedText(obj: TranslatedText, locale: string): string {
  const validLocale = (locale as keyof TranslatedText) || 'en';
  return obj[validLocale] || obj.en;
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
 * Parse date string in various formats (YYYYMMDD or YYYY-MM-DD)
 */
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  // Handle YYYYMMDD format (e.g., "20260128")
  if (/^\d{8}$/.test(dateStr)) {
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1; // JS months are 0-indexed
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
 * Returns null if the date is invalid
 */
export function calculateCancellationDate(checkInDate: string): Date | null {
  if (!checkInDate) return null;

  const checkIn = parseDateString(checkInDate);

  if (!checkIn || isNaN(checkIn.getTime())) {
    return null;
  }

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

  // Calculate refund date (returns null if invalid)
  const refundDate = checkIn ? calculateCancellationDate(checkIn) : null;

  if (!refundDate) {
    // If no check-in date or invalid date, show generic text
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
