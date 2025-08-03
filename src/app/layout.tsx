import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://babyhub.vercel.app'),
  title: 'BabyHub - Best Baby Products and Deals',
  description: 'Find the best baby products at great prices. From diapers to strollers, we have everything you need for your little one.',
  keywords: 'baby products, diapers, strollers, toys, baby care, baby safety',
  openGraph: {
    title: 'BabyHub - Best Baby Products and Deals',
    description: 'Find the best baby products at great prices. From diapers to strollers, we have everything you need for your little one.',
    url: 'https://babyhub.vercel.app',
    siteName: 'BabyHub',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BabyHub - Best Baby Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BabyHub - Best Baby Products and Deals',
    description: 'Find the best baby products at great prices. From diapers to strollers, we have everything you need for your little one.',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
