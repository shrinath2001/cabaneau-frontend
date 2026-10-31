This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Lodgify checkout: square corners

The booking checkout (`checkout.lodgify.com/{lang}/cabaneau/...`) is hosted by
Lodgify, so the site's CSS does not reach it. Lodgify only accepts JavaScript
there, under **Lodgify > Settings > Code injection > Custom Javascript**. The
snippet below goes in that field so the checkout's corners are square like the
rest of the site (T08, client feedback 20 Oct 2026). If the field does not
accept plain JavaScript, wrap it in `<script>...</script>`.

It does not rely on Lodgify's class names, which can change without notice:
every corner is made square, then only radio buttons and loading spinners are
made round again, because those are not recognisable when square. If Lodgify
adds another element that must stay round, add its selector to the second
rule.

To try a change before saving it in Lodgify: open the checkout in a desktop
browser, paste the snippet into the browser console, and step through dates,
extras, contact and payment.

```js
/* Cabaneau - square corners on the Lodgify checkout, to match the website. */
(function () {
  var STYLE_ID = 'cabaneau-square-corners';

  var css = [
    '*, *::before, *::after { border-radius: 0 !important; }',
    'input[type="radio"], [role="radio"],',
    '[class*="radio" i]::before, [class*="radio" i]::after,',
    '[class*="spinner" i], [class*="spinner" i] *,',
    '[class*="loader" i], [class*="loader" i] *,',
    '[role="progressbar"], [role="progressbar"] * { border-radius: 50% !important; }'
  ].join('\n');

  function addStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  addStyle();

  // The checkout is a single-page app; if it ever rebuilds <head> between
  // steps, put the style back.
  new MutationObserver(addStyle).observe(document.head, { childList: true });
})();
```
