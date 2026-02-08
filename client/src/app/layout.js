// app/layout.js
import { Inter } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'

import ClientLayoutShell from './partials/ClientLayoutShell'
import { callSummaryApi } from '../common/SummaryApi'
import SummaryApi from '../common/SummaryApi'

const inter = Inter({ subsets: ['latin'] })

// --- Metadata Configuration ---
export const metadata = {
  metadataBase: new URL('https://www.esmakeupstore.com'),
  title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
  description:
    'Explore the best selection of authentic makeup products and cosmetics in Cameroon at Essentialist Makeup Store. Find foundations, lipsticks, eyeshadows, and more.',
  keywords: [
    'Cameroon makeup shop', 'Douala makeup store', 'setting powder Cameroon',
    'makeup kits for teens Douala', 'NYX foundation price Cameroon',
    'matte bronzer Cameroon', 'liquid lipstick Douala',
    'waterproof mascara Cameroon', 'blush for melanin skin',
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
    siteName: 'Essentialist Makeup Store',
    url: 'https://www.esmakeupstore.com/',
    title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
    description: 'Explore authentic makeup and cosmetics in Cameroon.',
    images: [{ url: 'https://www.esmakeupstore.com/assets/logo.jpg', width: 1200, height: 630, alt: 'Essentialist Makeup Store Product Preview' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cameroon Makeup Shop | Setting Powders, Makeup Kits & Beauty Deals',
    description: 'Explore authentic makeup and cosmetics in Cameroon.',
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

// --- 1. Create a "Wrapper" Component for Data Fetching ---
// This component performs the async fetch. Because it is nested inside Suspense 
// in the RootLayout, the build worker can "skip" it for static pages like 404.
async function LayoutContent({ children }) {
  let categories = []
  let subCategories = []
  
  try {
    // Attempt to fetch data
    const [catRes, subCatRes] = await Promise.all([
      callSummaryApi(SummaryApi.getCategory, { cache: 'force-cache' }),
      callSummaryApi(SummaryApi.getSubCategory, { cache: 'force-cache' })
    ])
    
    // Safety check: Ensure data structure is valid
    categories = Array.isArray(catRes?.data) 
      ? catRes.data 
      : (Array.isArray(catRes?.data?.data) ? catRes.data.data : [])
      
    subCategories = Array.isArray(subCatRes?.data) 
      ? subCatRes.data 
      : (Array.isArray(subCatRes?.data?.data) ? subCatRes.data.data : [])
      
  } catch (e) {
    console.error("Layout data fetch failed:", e)
    // If fetch fails (e.g. during build), default to empty to prevent crash
    categories = []
    subCategories = []
  }

  const initialNavData = {
    categories: Array.isArray(categories) ? categories : [],
    subCategories: Array.isArray(subCategories) ? subCategories : []
  }

  return (
    <ClientLayoutShell initialNavData={initialNavData}>
      {children}
    </ClientLayoutShell>
  )
}

// --- 2. The Main Root Layout (Synchronous) ---
// Notice this function is NOT async. This satisfies the build worker.
export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {/* The Suspense boundary isolates the async fetching below */}
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
          <LayoutContent>
            {children}
          </LayoutContent>
        </Suspense>
      </body>
    </html>
  )
}