import type { Metadata, Viewport } from 'next';
import { Atkinson_Hyperlegible, Bree_Serif } from 'next/font/google';

import './globals.css';

const breeSerif = Bree_Serif({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: '400',
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'ZooCompass',
  description:
    'Browse AZA-accredited zoos and aquariums, compare membership reciprocity tiers, filter by location, and estimate distance from your ZIP code.',
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#ff0077',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${breeSerif.variable} ${atkinsonHyperlegible.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
