/**
 * Renders a JSON-LD structured-data block. Server component only (no 'use
 * client') so the <script> tag is present in the server-rendered HTML - it
 * must show up in view-source/curl output, not just the post-hydration DOM.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
