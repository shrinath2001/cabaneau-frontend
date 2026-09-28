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
    .replace(/\sstyle\s*=\s*"[^"]*"/gi, '')
    .replace(/\sstyle\s*=\s*'[^']*'/gi, '')
    .replace(/<\/?font[^>]*>/gi, '')
    .replace(/\sclass\s*=\s*"[^"]*"/gi, '')
    .replace(/\sclass\s*=\s*'[^']*'/gi, '')
    .replace(/\sid\s*=\s*"docs-internal-guid-[^"]*"/gi, '');
}
