// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayoutShell from './partials/ClientLayoutShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://www.esmakeupstore.com'),
  title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
  description:
    'Explore the best selection of authentic makeup products and cosmetics in Cameroon at Essentialist Makeup Store. Find foundations, lipsticks, eyeshadows, and more. Shop top makeup brands, enjoy exclusive deals, and experience free shipping & cash on delivery!',
  keywords: [
    'Cameroon makeup shop',
    'Douala makeup store',
    'setting powder Cameroon',
    'makeup kits for teens Douala',
    'NYX foundation price Cameroon',
    'matte bronzer Cameroon',
    'liquid lipstick Douala',
    'waterproof mascara Cameroon',
    'blush for melanin skin',
    'face makeup Cameroon',
    'eye makeup Douala',
    'lip makeup Cameroon',
    'makeup brushes Douala',
    'beauty blender Cameroon',
    'primer for oily skin Cameroon',
    'bridal makeup Cameroon',
    'cash on delivery makeup Cameroon',
    'affordable makeup Bonamoussadi',
    'highlighter for dark skin Cameroon',
    'makeup removers Douala',
    'skincare Cameroon',
    'beauty supply Douala',
    'authentic cosmetics Cameroon',
    'trending makeup Cameroon',
    'professional makeup Douala',
    'makeup sale Cameroon',
    'exclusive makeup deals Douala',
    'Essentialist Makeup Store',
  ],
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
  },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Essentialist Makeup Store', // Maintains brand visibility as the SERP site name.
    url: 'https://www.esmakeupstore.com/',
    title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
    description:
      'Explore authentic makeup and cosmetics in Cameroon. Shop foundations, lipsticks, eyeshadows, and more with free shipping & cash on delivery.',
    images: [
      {
        url: 'https://www.esmakeupstore.com/assets/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Essentialist Makeup Store Product Preview',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
    description:
      'Explore authentic makeup and cosmetics in Cameroon. Shop foundations, lipsticks, eyeshadows, and more with free shipping & cash on delivery.',
    images: ['https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'],
    creator: '@essentialistmakeupstore',
  },
  icons: {
    icon: [{ url: '/icon.avif', type: 'image/avif' }],
    apple: [{ url: '/icon.avif' }],
  },
  other: {
    'msvalidate.01': '1D7D3FCABB171743A8EB32440530AC76',
    'al:android:package': 'com.fsn.esmakeupstore',
    'al:android:app_name': 'Essentialist Makeup Store: Makeup Shopping App',
    'al:ios:app_name': 'Essentialist Makeup Store — Makeup Shopping',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ClientLayoutShell>{children}</ClientLayoutShell>
      </body>
    </html>
  )
}