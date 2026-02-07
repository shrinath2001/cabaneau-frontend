'use client';

import Script from 'next/script';

export default function GiftVoucherPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hide GiftUp branding/logo */}
      <style jsx global>{`
        .gift-up-target [class*="powered-by"],
        .gift-up-target a[href*="giftup"],
        .gift-up-target img[src*="giftup"],
        .gift-up-target img[alt*="Gift Up"],
        .gift-up-target img[alt*="GiftUp"],
        .gift-up-target .giftup-branding,
        .gift-up-target .giftup-logo,
        .gift-up-target footer,
        .gift-up-target [class*="footer"],
        .gift-up-target [class*="brand"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }
      `}</style>
      <div className="container mx-auto px-4 md:px-8 lg:px-20 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left Column - Title and Description */}
            <div>
              <h1 className="font-logga text-[28px] md:text-[42px] font-semibold mb-6 md:mb-8" style={{ color: '#212121' }}>
                GIFT VOUCHER
              </h1>
              <div className="font-jost font-light text-[16px] md:text-[18px] leading-relaxed text-gray-700 space-y-4">
                <p>
                  Give the gift of an unforgettable experience at Cabaneau. Our luxury cabins offer the perfect escape for your loved ones to relax, unwind, and reconnect with nature.
                </p>
                <p>
                  Each gift voucher can be customized to your preferred amount and comes with a personalized message. Valid for all our premium cabin rentals and additional services.
                </p>
                <p>
                  Purchase a gift voucher today and share the magic of sleeping above the trees with private wellness facilities.
                </p>
              </div>
            </div>

            {/* Right Column - Gift Up Widget */}
            <div>
              <div
                className="gift-up-target"
                data-site-id="ae4da9a9-8ec2-4ddf-11cd-08de4c771318"
                data-platform="Other"
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gift Up Script */}
      <Script
        id="gift-up-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function (g, i, f, t, u, p, s) {
              g[u] = g[u] || function() { (g[u].q = g[u].q || []).push(arguments) };
              p = i.createElement(f);
              p.async = 1;
              p.src = t;
              s = i.getElementsByTagName(f)[0];
              s.parentNode.insertBefore(p, s);
            })(window, document, "script", "https://cdn.giftup.app/dist/gift-up.js", "giftup");
          `,
        }}
      />
    </div>
  );
}
