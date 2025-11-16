import { Jost, Raleway } from 'next/font/google';
import localFont from 'next/font/local';

// Google Fonts
export const jost = Jost({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-jost',
  display: 'swap',
});

export const raleway = Raleway({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
});

// Local Custom Font
export const logga = localFont({
  src: [
    {
      path: '../public/fonts/LoggaRegular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/LoggaRegular.woff',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-logga',
  display: 'swap',
});
