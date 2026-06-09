// ============================================
// LUXUDIES - Root Layout
// ============================================

import type { Metadata, Viewport } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'LUXUDIES | Luxury Jewellery',
    template: '%s | LUXUDIES',
  },
  description:
    'Discover premium 18K gold-plated jewelry crafted with elegance. Anti-tarnish, lightweight, and gift-ready. Free shipping across Tamil Nadu.',
  keywords: [
    'luxury jewelry',
    'gold plated jewelry',
    'premium earrings',
    'necklace online',
    'gift jewelry',
    'LUXUDIES',
    'anti-tarnish jewelry',
    'Tamil Nadu jewelry',
  ],
  authors: [{ name: 'LUXUDIES' }],
  creator: 'LUXUDIES',
  publisher: 'LUXUDIES',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  icons: {
    icon: '/images/brand/logo.jpg',
    shortcut: '/images/brand/logo.jpg',
    apple: '/images/brand/logo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'LUXUDIES',
    title: 'LUXUDIES — Luxury Jewellery You Deserve',
    description:
      'Crafted to be cherished. Designed to be you. Premium 18K gold-plated jewelry with free shipping across Tamil Nadu.',
    images: [
      {
        url: '/images/brand/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'LUXUDIES Luxury Jewellery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LUXUDIES — Luxury Jewellery You Deserve',
    description:
      'Premium 18K gold-plated jewelry. Anti-tarnish, lightweight, gift-ready.',
    images: ['/images/brand/logo.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F3EE',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

import { Playfair_Display, Inter } from 'next/font/google';
import SmoothScroller from '@/components/layout/smooth-scroller';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <head>
        {/* Razorpay Script - loaded early for fast checkout */}
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="bg-pearl text-espresso font-inter antialiased">
        <SmoothScroller>
          {children}
        </SmoothScroller>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              borderRadius: '12px',
              color: '#3A2A1E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(180, 156, 110, 0.12)',
            },
            success: {
              iconTheme: {
                primary: '#D4AF37',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
