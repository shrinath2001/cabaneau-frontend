/**
 * Strips inline formatting that Summernote carries over when an admin pastes
 * content from Word/Google Docs (font-family, font-size, color, etc. via
 * `style` attributes and `<font>` tags). The CMS toolbar for these fields only
 * exposes bold/italic/underline/lists/link, so any `style`/`font`/`class`
 * present in stored HTML came from a paste, not an intentional editor action.
 */
export function stripPastedFormatting(html?: string | null): string {
  if (!html) return '';

  return html
    // Defence in depth: the CMS editor never produces these, but pasted or hand-edited HTML could
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'href="#"')
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, '')
    .replace(/\sstyle\s*=\s*'[^']*'/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/\sclass\s*=\s*"[^"]*"/gi, '')
    .replace(/\sclass\s*=\s*'[^']*'/gi, '')
    .replace(/\sid\s*=\s*"docs-internal-guid-[^"]*"/gi, '');
}


/** True when a CMS text contains HTML tags (rich text) rather than plain text. */
export function isRichText(value?: string | null): boolean {
  return !!value && /<[a-z][\s\S]*>/i.test(value);
}

/**
 * Plain text from a CMS text that may be rich text: tags removed, block ends
 * turned into spaces. Used where HTML must never appear (meta description,
 * structured data).
 */
export function htmlToText(value?: string | null): string {
  if (!value) return '';
  return value
    .replace(/<\/(p|li|h[1-6]|div)>|<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}
