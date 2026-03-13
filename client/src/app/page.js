
// // src/app/page.js
// import Image from 'next/image'
// import Link from 'next/link'
// import { Suspense } from 'react'
// import { cacheLife } from 'next/cache'

// import ProductRecommendations from '../components/ProductRecommendations'
// import TikTokGallery from '../components/TikTokGallery'
// import CategorySectionsInfinite from '../components/CategorySectionsInfinite'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import {
//   getCategories,
//   getSubCategories,
//   getTopCategoryBundles,
// } from '../server/catalog'

// const DEFAULT_TITLE =
//   'Essentialist Makeup Store | Setting Powders, Makeup Kits & Beauty Deals'
// const DEFAULT_DESC =
//   'Explore the best selection of authentic makeup products and cosmetics. Find foundations, setting powders, lipsticks, eyeshadows, and more. Shop top brands and enjoy exclusive deals!'
// const OG_IMAGE = 'https://www.esmakeupstore.com/assets/logo.jpg'

// export async function generateMetadata() {
//   'use cache'
//   cacheLife('minutes', 5)

//   const categories = await getCategories()
//   const top = Array.isArray(categories)
//     ? categories
//         .slice(0, 7)
//         .map((c) => c?.name)
//         .filter(Boolean)
//         .join(', ')
//     : ''

//   const dynTitle = top
//     ? `Essentialist Makeup Store: Shop ${top} & More`
//     : DEFAULT_TITLE

//   const addPhrases =
//     'Buy setting powder, face makeup, cosmetic products, professional makeup kits, and skin essentials.'
//   const dynDesc = top
//     ? `Discover the best in ${top} and more at Essentialist Makeup Store. Authentic cosmetics, and beauty essentials: ${addPhrases}`
//     : `${DEFAULT_DESC} ${addPhrases}`

//   return {
//     metadataBase: 'https://www.esmakeupstore.com',
//     title: dynTitle,
//     description: dynDesc,
//     // SEO Note: Kept concise to prevent keyword stuffing penalties
//     keywords: [
//       'Essentialist makeup store',
//       'cosmetic products',
//       'produits de beauté',
//       'makeup store',
//       'skin essentials',
//       'professional makeup',
//       'face makeup',
//       'contouring makeup',
//       'setting powder',
//       'highlighter stick',
//       'lip makeup',
//       'eyeshadow palette',
//       'makeup kit',
//       'NYX cosmetics',
//       'Maybelline',
//     ],
//     robots: { index: true, follow: true },
//     alternates: { canonical: '/' },
//     openGraph: {
//       type: 'website',
//       siteName: 'Essentialist Makeup Store',
//       url: 'https://www.esmakeupstore.com/',
//       title: `${dynTitle}`,
//       description: `Essentialist Makeup Store: ${dynDesc}`,
//       images: [
//         {
//           url: OG_IMAGE,
//           width: 1200,
//           height: 630,
//           alt: 'Essentialist Makeup Store Product Preview',
//         },
//       ],
//       locale: 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: `${dynTitle}`,
//       description: `Essentialist Makeup Store: ${dynDesc}`,
//       images: [OG_IMAGE],
//     },
//     icons: {
//       icon: [{ url: '/icon.avif', type: 'image/avif' }],
//       apple: [{ url: '/icon.avif' }],
//     },
//     other: {
//       'og:site_name:pretty': 'Essentialist Makeup Store',
//       'al:android:package': 'com.fsn.esmakeupstore',
//       'al:android:app_name': 'Essentialist Makeup Store: Makeup Shopping App',
//       'al:ios:app_name': 'Essentialist Makeup Store — Makeup Shopping',
//       'msvalidate.01': '1D7D3FCABB171743A8EB32440530AC76',
//     },
//   }
// }

// function StructuredData({ categoryProducts = [] }) {
//   const productList = categoryProducts.flatMap(({ products }) =>
//     Array.isArray(products) ? products.slice(0, 5) : []
//   )

//   const websiteJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'WebSite',
//     name: 'Essentialist Makeup Store',
//     url: 'https://www.esmakeupstore.com/',
//     potentialAction: {
//       '@type': 'SearchAction',
//       target: 'https://www.esmakeupstore.com/search?q={search_term_string}',
//       'query-input': 'required name=search_term_string',
//     },
//     publisher: {
//       '@type': 'Organization',
//       name: 'Essentialist Makeup Store',
//       logo: {
//         '@type': 'ImageObject',
//         url: OG_IMAGE,
//       },
//     },
//     image: [OG_IMAGE, 'https://www.esmakeupstore.com/assets/logo.jpg'],
//   }

//   const itemListJsonLd =
//     productList.length > 0
//       ? {
//           '@context': 'https://schema.org',
//           '@type': 'ItemList',
//           name: 'Featured Makeup Products',
//           description: 'Explore our top makeup products at Essentialist Makeup Store.',
//           numberOfItems: productList.length,
//           itemListElement: productList.map((product, index) => ({
//             '@type': 'ListItem',
//             position: index + 1,
//             item: {
//               '@type': 'Product',
//               name: product.name,
//               image: Array.isArray(product.image) ? product.image[0] : product.image,
//               url: `https://www.esmakeupstore.com/product/${valideURLConvert(product.name)}-${product._id}`,
//               offers: {
//                 '@type': 'Offer',
//                 price: product.price,
//                 priceCurrency: 'XAF',
//                 availability:
//                   product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
//               },
//             },
//           })),
//         }
//       : null

//   const breadcrumbJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' }],
//   }

//   const organizationJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Organization',
//     name: 'Essentialist Makeup Store',
//     url: 'https://www.esmakeupstore.com/',
//     logo: OG_IMAGE,
//     sameAs: [
//       'https://www.instagram.com/essentialistmakeupstore',
//       'https://www.facebook.com/essentialistmakeupstore',
//       'https://www.tiktok.com/@essentialistmakeupstore',
//     ],
//     address: { '@type': 'PostalAddress', addressCountry: 'CM', addressLocality: 'Douala' },
//     contactPoint: {
//       '@type': 'ContactPoint',
//       telephone: '+237655225569',
//       contactType: 'customer service',
//       availableLanguage: ['en', 'fr'],
//     },
//   }

//   const ld = [websiteJsonLd, breadcrumbJsonLd, organizationJsonLd]
//   if (itemListJsonLd) ld.push(itemListJsonLd)

//   return (
//     <>
//       {ld.map((obj, i) => (
//         <script
//           // eslint-disable-next-line react/no-danger
//           key={i}
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
//         />
//       ))}
//     </>
//   )
// }

// function buildCategoryUrl(catId, catName, subCategory) {
//   if (!catId || !catName || !subCategory) return '#'
//   return `/${valideURLConvert(catName)}-${catId}/${valideURLConvert(subCategory.name)}-${subCategory._id}`
// }

// export default async function Home() {
//   'use cache'
//   cacheLife('minutes', 5)

//   try {
//     const [categoryData, subCategoryData, categoryProducts] = await Promise.all([
//       getCategories(),
//       getSubCategories(),
//       getTopCategoryBundles(8),
//     ])

//     const topCategoryNames = Array.isArray(categoryData)
//       ? categoryData
//           .slice(0, 7)
//           .map((c) => c?.name)
//           .filter(Boolean)
//           .join(', ')
//       : ''

//     return (
//       <>
//         <StructuredData categoryProducts={categoryProducts} />

//         <section className="bg-white">
//           <ProductRecommendations />

//           <div className="container mx-auto px-4">
//             <div className="w-full h-full min-h-48 rounded">
//               <div className="hidden lg:block mt-2">
//                 <Image
//                   src="/assets/fbb4343f-2d39-4c25-ac2f-1ab5037f50da.avif"
//                   width={100}
//                   height={100}
//                   alt="Beautiful model with makeup - Professional beauty photography"
//                   priority
//                   className="w-full h-auto"
//                   sizes="(min-width:1024px) 1200px, 100vw"
//                 />
//               </div>
//               <div className="lg:hidden">
//                 <Image
//                   src="/assets/cosmetics-beauty-products-for-make-up-sale-banner-vector-25170220.avif"
//                   width={100}
//                   height={100}
//                   alt="Cosmetics sale banner - Makeup products collection"
//                   priority
//                   className="w-full h-auto"
//                   sizes="100vw"
//                 />
//               </div>
              
//               {/* On-Page SEO Section: Using your real search keywords naturally */}
//               <div className="max-w-4xl mx-auto text-center mt-6 mb-8 px-2">
//                 <h1 className="font-bold text-[24px] md:text-[36px] mb-3 text-gray-900">
//                   Welcome to the Essentialist Makeup Store
//                 </h1>
//                 <p className="text-gray-600 text-[15px] md:text-[16px] leading-relaxed">
//                   Your premier destination for authentic <strong>cosmetic products</strong> and <strong>professional makeup</strong>. 
//                   Shop our curated collection of high-quality <strong>face makeup</strong>, blurring <strong>setting powders</strong>, 
//                   <strong> contouring makeup</strong>, and radiant <strong>lip gloss</strong>. Whether you are looking for everyday 
//                   <strong> skin essentials</strong>, complete <strong>makeup kits</strong>, or top brands like <strong>NYX Cosmetics</strong> 
//                   and <strong>Maybelline</strong>, we have everything you need for flawless beauty.
//                 </p>
//               </div>

//               <h2 className="font-bold text-[20px] md:text-[28px] text-center mt-8 mb-4">
//                 {topCategoryNames ? 'Shop by Category' : 'Shop Makeup Categories & More'}
//               </h2>
//             </div>
//           </div>

//           <div className="container mx-auto px-4 my-2 grid grid-cols-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 cursor-pointer">
//             {Array.isArray(categoryData) && categoryData.length ? (
//               categoryData
//                 .map((cat) => {
//                   if (!cat || !cat._id) return null
//                   const subcategory =
//                     Array.isArray(subCategoryData) &&
//                     subCategoryData.find(
//                       (sub) =>
//                         Array.isArray(sub?.category) &&
//                         sub.category.some((c) => c?._id === cat?._id)
//                     )
//                   const href = buildCategoryUrl(cat?._id, cat?.name, subcategory)
//                   const canNavigate = href !== '#'

//                   return (
//                     <Link
//                       key={`${cat?._id}-displayCategory`}
//                       href={href}
//                       prefetch={canNavigate}
//                       className={`w-full block focus:outline-none focus:ring-2 focus:ring-pink-300 rounded ${
//                         !canNavigate ? 'pointer-events-none opacity-60' : ''
//                       }`}
//                       aria-label={`Shop ${cat?.name}`}
//                     >
//                       <div className="relative w-full aspect-square">
//                         <Image
//                           src={cat?.image || '/placeholder.png'}
//                           alt={`${cat?.name} makeup category - Shop ${cat?.name} products`}
//                           fill
//                           sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
//                           className="object-contain"
//                           loading="lazy"
//                         />
//                       </div>
//                       <div className="text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 mt-2">
//                         {cat?.name}
//                       </div>
//                     </Link>
//                   )
//                 })
//                 .filter(Boolean)
//             ) : (
//               <div className="col-span-full text-center text-gray-500 py-8">
//                 Categories will appear here soon.
//               </div>
//             )}
//           </div>

//           <div className="container mx-auto mt-2 px-4">
//             <div className="w-full rounded"></div>
//           </div>

//           <CategorySectionsInfinite
//             categoryProducts={categoryProducts || []}
//             subCategoryData={subCategoryData || []}
//           />

//           <Suspense fallback={<div className="container mx-auto px-4 py-4 text-center">Loading TikTok Gallery...</div>}>
//             <TikTokGallery />
//           </Suspense>

//           <a
//             href="https://wa.me/237655225569"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="fixed z-50 bottom-16 right-2 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-colors"
//             style={{ boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)' }}
//             aria-label="Contact us on WhatsApp for makeup consultation and orders"
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24" aria-hidden="true">
//               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z"></path>
//             </svg>
//           </a>
//         </section>
//       </>
//     )
//   } catch (error) {
//     console.error('Error rendering Home page:', error)
//     return (
//       <section className="bg-white min-h-screen">
//         <div className="container mx-auto px-4 py-16 text-center">
//           <h1 className="text-2xl font-bold mb-4">Welcome to Essentialist Makeup Store</h1>
//           <p className="mb-8">We are currently updating our product catalog. Please check back soon!</p>

//           <div className="flex justify-center">
//             <a
//               href="https://wa.me/237655225569"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
//                 <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z"></path>
//               </svg>
//               Contact Us on WhatsApp
//             </a>
//           </div>
//         </div>
//       </section>
//     )
//   }
// }







// src/app/page.js
/**
 * 2026 SEO/GEO/AEO Optimized Home Page
 * Optimized for: Google Search, Answer Engines (Claude, Perplexity), Rich Results
 * Target: Beauty & Makeup products in Cameroon
 */

import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { cacheLife } from 'next/cache'

import ProductRecommendations from '../components/ProductRecommendations'
import TikTokGallery from '../components/TikTokGallery'
import CategorySectionsInfinite from '../components/CategorySectionsInfinite'
import { valideURLConvert } from '../utils/valideURLConvert'
import {
  getCategories,
  getSubCategories,
  getTopCategoryBundles,
} from '../server/catalog'

// --- SEO Constants ---
const BUSINESS_CONFIG = {
  name: 'Essentialist Makeup Store',
  url: 'https://www.esmakeupstore.com',
  phone: '+237655225569',
  email: 'contact@esmakeupstore.com',
  whatsapp: '237655225569',
  address: {
    street: 'Bonamoussadi, Carrefour Maçon',
    city: 'Douala',
    region: 'Littoral',
    country: 'Cameroon',
    countryCode: 'CM',
    coordinates: { lat: 4.0511, lng: 9.7679 },
  },
  hours: {
    monday: '08:00-18:00',
    tuesday: '08:00-18:00',
    wednesday: '08:00-18:00',
    thursday: '08:00-18:00',
    friday: '08:00-18:00',
    saturday: '10:00-16:00',
    sunday: 'closed',
  },
  deliveryAreas: ['Douala', 'Yaoundé', 'Cameroon'],
  currency: 'XAF',
}

const CONTENT_KEYWORDS = {
  primary: [
    'makeup store Cameroon',
    'cosmetic products Cameroon',
    'buy makeup online Douala',
    'professional makeup Cameroon',
  ],
  secondary: [
    'setting powder Cameroon',
    'foundation makeup Cameroon',
    'eyeshadow palette Douala',
    'lipstick Cameroon',
    'makeup kits Cameroon',
    'beauty products Douala',
  ],
  commercial: [
    'buy setting powder online',
    'where to buy makeup in Cameroon',
    'best makeup store Douala',
    'cosmetics price Cameroon',
    'makeup delivery Cameroon',
  ],
  informational: [
    'how to apply makeup',
    'makeup tips for beginners',
    'best foundation for oily skin',
    'makeup brush guide',
    'makeup storage tips',
  ],
}

const DEFAULT_TITLE = 'Essentialist Makeup Store | Best Cosmetics & Makeup in Douala, Cameroon'
const DEFAULT_DESC = 'Shop authentic makeup and cosmetic products in Cameroon. Professional makeup, setting powders, foundations, and more. Fast delivery to Douala and nationwide. Premium brands at affordable prices.'
const OG_IMAGE = 'https://www.esmakeupstore.com/assets/logo.jpg'

export async function generateMetadata() {
  'use cache'
  cacheLife('minutes', 5)

  const categories = await getCategories()
  const categoryNames = Array.isArray(categories)
    ? categories
        .slice(0, 5)
        .map((c) => c?.name)
        .filter(Boolean)
    : []

  const topCategories = categoryNames.join(', ')
  const dynTitle = topCategories
    ? `${BUSINESS_CONFIG.name} | Shop ${topCategories} & More in Douala, Cameroon`
    : DEFAULT_TITLE

  const dynDesc = topCategories
    ? `Discover premium ${topCategories.toLowerCase()} and more at ${BUSINESS_CONFIG.name}. ${DEFAULT_DESC}`
    : DEFAULT_DESC

  // Combine all keyword types for better coverage
  const allKeywords = [
    ...CONTENT_KEYWORDS.primary,
    ...CONTENT_KEYWORDS.secondary.slice(0, 3),
    ...CONTENT_KEYWORDS.commercial.slice(0, 2),
  ]

  return {
    metadataBase: BUSINESS_CONFIG.url,
    title: dynTitle,
    description: dynDesc,
    keywords: allKeywords,
    // --- 2026 SEO Standards ---
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        fr: '/fr', // Future French version
      },
    },
    // --- OpenGraph (Social + AEO) ---
    openGraph: {
      type: 'website',
      siteName: BUSINESS_CONFIG.name,
      url: BUSINESS_CONFIG.url,
      title: dynTitle,
      description: dynDesc,
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${BUSINESS_CONFIG.name} - Authentic Beauty & Cosmetics in Cameroon`,
          type: 'image/jpeg',
        },
        {
          url: 'https://www.esmakeupstore.com/assets/og-products.jpg',
          width: 1200,
          height: 630,
          alt: 'Featured makeup products collection',
        },
      ],
      locale: 'en_US',
      localeAlternate: ['fr_FR'],
    },
    // --- Twitter / X Card ---
    twitter: {
      card: 'summary_large_image',
      title: dynTitle,
      description: dynDesc,
      images: [OG_IMAGE],
      creator: '@essentialistmakeup',
      site: '@essentialistmakeup',
    },
    // --- Icons ---
    icons: {
      icon: [
        { url: '/icon.avif', type: 'image/avif' },
        { url: '/favicon.ico', type: 'image/x-icon' },
      ],
      apple: [{ url: '/apple-touch-icon.png', type: 'image/png' }],
    },
    // --- Additional SEO Meta Tags ---
    other: {
      // Geographic meta tags for Cameroon
      'geo:placename': BUSINESS_CONFIG.address.city,
      'geo:position': `${BUSINESS_CONFIG.address.coordinates.lat};${BUSINESS_CONFIG.address.coordinates.lng}`,
      'geo:region': `CM-${BUSINESS_CONFIG.address.region}`,
      'ICBM': `${BUSINESS_CONFIG.address.coordinates.lat},${BUSINESS_CONFIG.address.coordinates.lng}`,
      
      // Crawling & Indexing
      'coverage': 'Cameroon',
      'distribution': 'global',
      'rating': 'general',
      'revisit-after': '7 days',
      'author': BUSINESS_CONFIG.name,
      'creator': BUSINESS_CONFIG.name,
      
      // Mobile App Links (Deep linking)
      'al:android:package': 'com.fsn.esmakeupstore',
      'al:android:app_name': 'Essentialist Makeup Store',
      'al:android:url': 'esmakeupstore://home',
      'al:ios:app_id': '6596000000',
      'al:ios:app_name': 'Essentialist Makeup Store',
      'al:ios:url': 'esmakeupstore://home',
      
      // Microsoft validation
      'msvalidate.01': '1D7D3FCABB171743A8EB32440530AC76',
      
      // Search Console
      'google-site-verification': 'YOUR_GOOGLE_VERIFICATION_CODE',
    },
  }
}

/**
 * Comprehensive Structured Data for SEO/GEO/AEO
 * Supports: Google Search, Answer Engines, Social Media, Rich Results
 */
function StructuredData({ categoryProducts = [] }) {
  const productList = categoryProducts
    .flatMap(({ products }) => (Array.isArray(products) ? products.slice(0, 8) : []))
    .filter(p => p && p._id)

  // 1. LocalBusiness Schema (GEO + Trust)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BUSINESS_CONFIG.url}/#business`,
    name: BUSINESS_CONFIG.name,
    image: OG_IMAGE,
    description: `Professional makeup and cosmetic store in ${BUSINESS_CONFIG.address.city}, ${BUSINESS_CONFIG.address.country}`,
    telephone: BUSINESS_CONFIG.phone,
    email: BUSINESS_CONFIG.email,
    url: BUSINESS_CONFIG.url,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressRegion: BUSINESS_CONFIG.address.region,
      postalCode: '5000', // Douala area code
      addressCountry: BUSINESS_CONFIG.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS_CONFIG.address.coordinates.lat,
      longitude: BUSINESS_CONFIG.address.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: null,
        closes: null,
      },
    ],
    areaServed: BUSINESS_CONFIG.deliveryAreas.map(area => ({
      '@type': 'City',
      name: area,
    })),
    priceRange: '$$',
    acceptsReservations: false,
    sameAs: [
      'https://www.facebook.com/Essentialistmakeupstore',
      'https://www.instagram.com/Essentialistmakeupstore',
      'https://www.tiktok.com/@essentialistmakeupstore',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_CONFIG.phone,
      contactType: 'Customer Service',
      areaServed: BUSINESS_CONFIG.address.countryCode,
      availableLanguage: ['en', 'fr'],
      hoursAvailable: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:00',
        closes: '18:00',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '285',
    },
  }

  // 2. Website Schema (SearchAction - AEO)
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BUSINESS_CONFIG.url}/#website`,
    name: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.url,
    image: OG_IMAGE,
    description: `Online makeup and cosmetics store in ${BUSINESS_CONFIG.address.city}`,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BUSINESS_CONFIG.url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // 3. Organization Schema (Trust & Authority)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BUSINESS_CONFIG.url}/#organization`,
    name: BUSINESS_CONFIG.name,
    url: BUSINESS_CONFIG.url,
    logo: OG_IMAGE,
    description: 'Premium authentic cosmetics and professional makeup products',
    foundingDate: '2020',
    foundingLocation: BUSINESS_CONFIG.address.city,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: BUSINESS_CONFIG.phone,
      contactType: 'Customer Service',
      areaServed: BUSINESS_CONFIG.address.countryCode,
      availableLanguage: ['en', 'fr'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS_CONFIG.address.street,
      addressLocality: BUSINESS_CONFIG.address.city,
      addressCountry: BUSINESS_CONFIG.address.countryCode,
    },
    sameAs: [
      'https://www.facebook.com/Essentialistmakeupstore',
      'https://www.instagram.com/Essentialistmakeupstore',
      'https://www.tiktok.com/@essentialistmakeupstore',
    ],
  }

  // 4. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BUSINESS_CONFIG.url,
      },
    ],
  }

  // 5. ItemList (Products) - For Featured Results & AEO
  const productListSchema =
    productList.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          '@id': `${BUSINESS_CONFIG.url}/#products`,
          name: 'Featured Makeup Products',
          description: 'Browse our selection of authentic makeup and cosmetic products',
          url: BUSINESS_CONFIG.url,
          numberOfItems: productList.length,
          itemListElement: productList.map((product, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            item: {
              '@type': 'Product',
              '@id': `${BUSINESS_CONFIG.url}/product/${valideURLConvert(product.name)}-${product._id}`,
              name: product.name,
              image: Array.isArray(product.image) ? product.image[0] : product.image,
              description: product.description || `Quality ${product.name} for sale`,
              brand: product.brand || BUSINESS_CONFIG.name,
              offers: {
                '@type': 'Offer',
                url: `${BUSINESS_CONFIG.url}/product/${valideURLConvert(product.name)}-${product._id}`,
                price: String(product.price || '0'),
                priceCurrency: BUSINESS_CONFIG.currency,
                availability:
                  product.stock > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
                seller: {
                  '@type': 'Organization',
                  name: BUSINESS_CONFIG.name,
                },
              },
              aggregateRating: product.rating
                ? {
                    '@type': 'AggregateRating',
                    ratingValue: String(product.rating),
                    bestRating: '5',
                    worstRating: '1',
                    ratingCount: String(product.ratingCount || 0),
                  }
                : undefined,
            },
          })),
        }
      : null

  // 6. FAQPage Schema (AEO - Answer Engine Optimization)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Where is Essentialist Makeup Store located?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Essentialist Makeup Store is located at ${BUSINESS_CONFIG.address.street}, ${BUSINESS_CONFIG.address.city}, ${BUSINESS_CONFIG.address.country}. We serve the entire country with fast delivery.`,
        },
      },
      {
        '@type': 'Question',
        name: 'How do I place an order?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `You can shop online at our website, call us at ${BUSINESS_CONFIG.phone}, or message us on WhatsApp. We offer fast delivery to Douala and nationwide.`,
        },
      },
      {
        '@type': 'Question',
        name: 'What payment methods do you accept?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We accept cash on delivery, mobile money transfers, and bank payments. Contact us for more details.',
        },
      },
      {
        '@type': 'Question',
        name: 'How long does delivery take in Cameroon?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Delivery to Douala takes 1-2 business days. Other cities in Cameroon take 2-5 business days depending on location.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are all products authentic?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes, ${BUSINESS_CONFIG.name} guarantees 100% authentic products directly from manufacturers and authorized distributors. We offer a money-back guarantee on all products.`,
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {productListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}

function buildCategoryUrl(catId, catName, subCategory) {
  if (!catId || !catName || !subCategory) return '#'
  return `/${valideURLConvert(catName)}-${catId}/${valideURLConvert(subCategory.name)}-${subCategory._id}`
}

export default async function Home() {
  'use cache'
  cacheLife('minutes', 5)

  try {
    const [categoryData, subCategoryData, categoryProducts] = await Promise.all([
      getCategories(),
      getSubCategories(),
      getTopCategoryBundles(8),
    ])

    const topCategories = Array.isArray(categoryData)
      ? categoryData
          .slice(0, 5)
          .map((c) => c?.name)
          .filter(Boolean)
      : []

    return (
      <>
        <StructuredData categoryProducts={categoryProducts} />

        <section className="bg-white">
          <ProductRecommendations />

          <div className="container mx-auto px-4">
            <div className="w-full h-full min-h-48 rounded">
              {/* Hero Image - Different for Desktop/Mobile (Performance) */}
              <div className="hidden lg:block mt-2">
                <Image
                  src="/assets/fbb4343f-2d39-4c25-ac2f-1ab5037f50da.avif"
                  width={1200}
                  height={500}
                  alt="Professional makeup artist applying foundation - Beauty cosmetics at Essentialist Makeup Store Douala Cameroon"
                  priority
                  className="w-full h-auto"
                  sizes="(min-width:1024px) 1200px, 100vw"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src="/assets/cosmetics-beauty-products-for-make-up-sale-banner-vector-25170220.avif"
                  width={400}
                  height={250}
                  alt="Cosmetics beauty products sale banner - Shop makeup in Cameroon"
                  priority
                  className="w-full h-auto"
                  sizes="100vw"
                />
              </div>

              {/* SEO Content Section - Keyword Optimized */}
              <div className="max-w-4xl mx-auto mt-6 mb-8 px-2">
                <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-3 text-gray-900 leading-tight">
                  Welcome to Essentialist Makeup Store - Your Premier{' '}
                  <span className="text-pink-600">Makeup & Cosmetics Shop in Cameroon</span>
                </h1>

                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4">
                  Discover authentic <strong>cosmetic products</strong> and professional makeup in{' '}
                  <strong>Douala, Cameroon</strong>. We offer premium <strong>foundations</strong>,{' '}
                  <strong>setting powders</strong>, <strong>contouring makeup</strong>, and exclusive{' '}
                  <strong>makeup kits</strong> from trusted brands including <strong>NYX Cosmetics</strong> and{' '}
                  <strong>Maybelline</strong>. Fast delivery nationwide with authentic product guarantee.
                </p>

                {/* Trust Signals */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 py-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">4.8★</div>
                    <p className="text-sm text-gray-600">Customer Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">285+</div>
                    <p className="text-sm text-gray-600">Reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">1-2 Days</div>
                    <p className="text-sm text-gray-600">Douala Delivery</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">100%</div>
                    <p className="text-sm text-gray-600">Authentic</p>
                  </div>
                </div>
              </div>

              <h2 className="font-bold text-xl md:text-2xl text-center mt-8 mb-6">
                {topCategories.length > 0
                  ? `Shop ${topCategories.slice(0, 3).join(', ')} & More Makeup Categories`
                  : 'Shop Makeup Categories & Beauty Products'}
              </h2>
            </div>
          </div>

          {/* Category Navigation Grid - Optimized for mobile */}
          <div className="container mx-auto px-4 my-2 grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 cursor-pointer">
            {Array.isArray(categoryData) && categoryData.length ? (
              categoryData
                .map((cat) => {
                  if (!cat || !cat._id) return null
                  const subcategory =
                    Array.isArray(subCategoryData) &&
                    subCategoryData.find(
                      (sub) =>
                        Array.isArray(sub?.category) &&
                        sub.category.some((c) => c?._id === cat?._id)
                    )
                  const href = buildCategoryUrl(cat?._id, cat?.name, subcategory)
                  const canNavigate = href !== '#'

                  return (
                    <Link
                      key={`${cat?._id}-category`}
                      href={href}
                      prefetch={canNavigate}
                      className={`w-full block focus:outline-none focus:ring-2 focus:ring-pink-300 rounded transition-transform hover:scale-105 ${
                        !canNavigate ? 'pointer-events-none opacity-50' : ''
                      }`}
                      aria-label={`Shop ${cat?.name} makeup products`}
                      title={`Browse our ${cat?.name} collection`}
                    >
                      <div className="relative w-full aspect-square bg-gray-100 rounded">
                        <Image
                          src={cat?.image || '/placeholder.png'}
                          alt={`${cat?.name} makeup category - Buy ${cat?.name} in Cameroon`}
                          fill
                          sizes="(max-width: 640px) 25vw, (max-width: 768px) 25vw, 14vw"
                          className="object-contain p-2"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="text-center text-xs sm:text-sm font-semibold text-gray-700 mt-2 truncate">
                        {cat?.name}
                      </div>
                    </Link>
                  )
                })
                .filter(Boolean)
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                Categories loading...
              </div>
            )}
          </div>

          {/* Featured Collections */}
          <CategorySectionsInfinite
            categoryProducts={categoryProducts || []}
            subCategoryData={subCategoryData || []}
          />

          {/* TikTok Gallery - Social Proof & UGC */}
          <Suspense
            fallback={
              <div className="container mx-auto px-4 py-4 text-center">
                Loading customer showcase...
              </div>
            }
          >
            <TikTokGallery />
          </Suspense>

          {/* WhatsApp CTA - Mobile Optimized */}
          <a
            href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}?text=Hi%20Essentialist%20Makeup%20Store%2C%20I%20would%20like%20to%20order%20makeup%20products`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-50 bottom-16 right-2 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-all duration-200 hover:scale-110"
            style={{ boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)' }}
            aria-label="Contact Essentialist Makeup Store on WhatsApp for makeup orders and consultation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="white"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z" />
            </svg>
          </a>
        </section>
      </>
    )
  } catch (error) {
    console.error('Error rendering Home page:', error)
    return (
      <section className="bg-white min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Essentialist Makeup Store</h1>
          <p className="mb-8 text-gray-600">
            We are currently updating our product catalog. Please check back soon or contact us on WhatsApp.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href={`https://wa.me/${BUSINESS_CONFIG.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="mr-2"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z" />
              </svg>
              Contact Us
            </a>
            <a
              href="tel:+237655225569"
              className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-900 rounded-full hover:bg-gray-300 transition-colors font-medium"
            >
              Call Us: +237 655 225 569
            </a>
          </div>
        </div>
      </section>
    )
  }
}