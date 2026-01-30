// Things to Know - all content is CMS-driven

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
