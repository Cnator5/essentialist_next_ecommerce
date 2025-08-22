// app/layout.tsx or app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayoutShell from './partials/ClientLayoutShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL('https://www.esmakeupstore.com'),
  title: {
    default: 'Best Makeup: Beauty & Personal Care',
    template: '%s | EssentialisMakeupStore',
  },
  description:
    'Explore the best selection of authentic makeup products and cosmetics in Cameroon at Essentialist Makeup Store. Find foundations, lipsticks, eyeshadows, and more. Shop top brands, enjoy exclusive deals, and experience free shipping & cash on delivery!',
  keywords: [
    'makeup', 'makeup Cameroon', 'makeup Douala', 'African makeup', 'Cameroon beauty', 'Douala beauty',
    'buy makeup Cameroon', 'makeup brands Cameroon', 'makeup store Douala', 'cosmetics Cameroon',
    'EssentialisMakeupStore', 'makeup artist Douala', 'beauty shop Douala', 'foundation', 'concealer',
    'contour', 'bronzer', 'blush', 'highlighter', 'pressed powder', 'setting spray', 'primer', 'eyeshadow',
    'eyeshadow palette', 'eyeliner', 'mascara', 'eyebrow pencil', 'lipsticks', 'lip gloss', 'lip liner',
    'makeup brushes', 'beauty blender', 'makeup remover', 'skincare', 'moisturizer', 'face mask',
    'African makeup trends', 'Cameroonian beauty', 'best makeup products Douala', 'affordable makeup Cameroon',
    'professional makeup Douala', 'bridal makeup Cameroon', 'makeup for dark skin', 'melanin makeup',
    'makeup tutorials Cameroon', 'beauty influencers Cameroon', 'beauty supply Douala', 'face makeup Cameroon',
    'eye makeup Cameroon', 'lip makeup Cameroon', 'makeup tools Cameroon', 'Douala cosmetics', 'Cameroon makeup shop',
    'best beauty brands Douala', 'Essentialis makeup', 'trending makeup Cameroon', 'makeup sale Cameroon',
    'Douala beauty trends', 'Cameroon makeup artists', 'best beauty shop Douala', 'buy cosmetics Douala',
    'authentic makeup Cameroon', 'popular makeup brands Cameroon', 'best eye shadow Cameroon', 'beauty care Cameroon',
    'top makeup Cameroon', 'trending cosmetics Douala',
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
    siteName: 'EssentialisMakeupStore',
    url: 'https://www.esmakeupstore.com/',
    title: 'Makeup: Beauty & Personal Care - EssentialisMakeupStore',
    description:
      'Explore authentic makeup and cosmetics in Cameroon. Shop foundations, lipsticks, eyeshadows, and more with free shipping & cash on delivery.',
    images: [
      {
        url: 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg',
        width: 1200,
        height: 630,
        alt: 'EssentialisMakeupStore Product Preview',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Makeup: Beauty & Personal Care - EssentialisMakeupStore',
    description:
      'Explore authentic makeup and cosmetics in Cameroon. Shop foundations, lipsticks, eyeshadows, and more with free shipping & cash on delivery.',
    images: ['https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'],
    creator: '@essentialistmakeupstore',
  },
  icons: {
    icon: [{ url: '/icon.avif', type: 'image/avif' }],
    apple: [{ url: '/icon.avif' }],
  },
  themeColor: '#faf6f3',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    viewportFit: 'cover',
  },
  other: {
    'msvalidate.01': '1D7D3FCABB171743A8EB32440530AC76',
    'al:android:package': 'com.fsn.esmakeupstore',
    'al:android:app_name': 'EssentialisMakeupStore: Makeup Shopping App',
    'al:ios:app_name': 'EssentialisMakeupStore -- Makeup Shopping',
  },
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