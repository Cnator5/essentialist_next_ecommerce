import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import bannern from '/public/assets/fbb4343f-2d39-4c25-ac2f-1ab5037f50da.avif'
import bannern2 from '/public/assets/56e20d4e-2643-4edb-b3fd-7762b81a7658.avif'
import bannerp from '/public/assets/lipstick-cosmetics-makeup-beauty-product-ad-banner_33099-1533.jpg'
import bannerMobile from '/public/assets/cosmetics-beauty-products-for-make-up-sale-banner-vector-25170220.avif'

import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay'
import ProductRecommendations from '../components/ProductRecommendations'
import TikTokGallery from '../components/TikTokGallery'
import { valideURLConvert } from '../utils/valideURLConvert'
import { unstable_cache } from 'next/cache'

export const dynamic = 'force-static' // Prefer static generation; hydrate client where needed.
export const revalidate = 300 // Fallback ISR; API calls also specify revalidate.

// Define base URL with fallback for development
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const SummaryApi = {
  getCategory: { url: '/api/category/get', method: 'GET' },
  getSubCategory: { url: '/api/subcategory/get', method: 'POST' },
  getProductByCategory: { url: '/api/product/get-product-by-category', method: 'POST' }, // From your SummaryApi
}

const DEFAULT_TITLE = 'Makeup: Best Online Makeup Store in Douala, Cameroon | Beauty & Personal Care'

const DEFAULT_DESC =
  'Explore the best selection of authentic makeup products and cosmetics in Cameroon at Essentialist Makeup Store. Find foundations, lipsticks, eyeshadows, and more. Shop top brands, enjoy exclusive deals, and experience free shipping & cash on delivery!'

const OG_IMAGE = 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

// Cached fetch functions for server-side data fetching (categories/subcategories only)
const getCategories = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
        method: SummaryApi.getCategory.method,
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 300, tags: ['categories'] },
        cache: 'force-cache',
      })
      
      if (!res.ok) {
        console.error('Failed to fetch categories:', res.status, res.statusText)
        throw new Error('Failed to fetch categories')
      }
      
      const data = await res.json()
      return Array.isArray(data) ? data : data?.data || []
    } catch (e) {
      console.error('getCategories error:', e)
      return []
    }
  },
  ['categories'],
  { revalidate: 300 }
)

const getSubCategories = unstable_cache(
  async () => {
    try {
      const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
        method: SummaryApi.getSubCategory.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        next: { revalidate: 300, tags: ['subcategories'] },
        cache: 'force-cache',
      })
      
      if (!res.ok) {
        console.error('Failed to fetch subcategories:', res.status, res.statusText)
        throw new Error('Failed to fetch subcategories')
      }
      
      const data = await res.json()
      return Array.isArray(data) ? data : data?.data || []
    } catch (e) {
      console.error('getSubCategories error:', e)
      return []
    }
  },
  ['subcategories'],
  { revalidate: 300 }
)

// Cached fetch for products by category ID (uses unstable_cache for Data Cache + tags for revalidation)
const getProductsByCategoryId = unstable_cache(
  async (categoryId) => {
    try {
      if (!categoryId) {
        console.warn('getProductsByCategoryId called with invalid categoryId')
        return []
      }
      
      const res = await fetch(`${baseURL}${SummaryApi.getProductByCategory.url}`, {
        method: SummaryApi.getProductByCategory.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId }),
        next: { 
          revalidate: 300, // Time-based revalidation every 5 min
          tags: [`products-${categoryId}`] // Tag for on-demand revalidation
        },
        cache: 'force-cache', // Enable Data Cache
      })
      
      if (!res.ok) {
        console.warn(`Failed to fetch products for category ${categoryId}: ${res.status}`)
        return []
      }
      
      const data = await res.json()
      
      // Debug log to check the structure of the response
      console.log(`Products for category ${categoryId}:`, 
        data?.success ? `Success: ${data?.data?.length || 0} products` : 'Failed',
        data?.error || ''
      )
      
      return data?.success ? (data?.data || []) : []
    } catch (e) {
      console.error(`getProductsByCategoryId error for ${categoryId}:`, e)
      return [] // Graceful fallback
    }
  },
  ['products'], // Cache key prefix
  { revalidate: 300 }
)

// Parallel fetch all top category products (limited to 6-8 for perf; uses Data Cache via unstable_cache)
async function getAllTopCategoryProducts(categories) {
  if (!Array.isArray(categories) || categories.length === 0) {
    console.warn('getAllTopCategoryProducts: No categories available')
    return []
  }

  const topCategories = categories.slice(0, 8) // Limit to 8 categories (adjust based on your data)
  
  try {
    const productsPromises = topCategories.map(async (cat) => {
      if (!cat || !cat._id) {
        console.warn('Invalid category in getAllTopCategoryProducts:', cat)
        return { category: cat || {}, products: [] }
      }
      
      const products = await getProductsByCategoryId(cat._id)
      return { category: cat, products }
    })
    
    return Promise.all(productsPromises) // Parallel execution
  } catch (error) {
    console.error('Error in getAllTopCategoryProducts:', error)
    return topCategories.map(cat => ({ category: cat, products: [] }))
  }
}

// ---- Dynamic SEO (fixed logic) ----
export async function generateMetadata() {
  const categories = await getCategories()
  const top = Array.isArray(categories)
    ? categories.slice(0, 7).map((c) => c?.name).filter(Boolean).join(', ')
    : ''

  const dynTitle = top
    ? `Shop ${top} & More - Best Makeup Store in Cameroon`
    : DEFAULT_TITLE

  const dynDesc = top
    ? `Discover the best in ${top} and more. Authentic makeup, cosmetics, and beauty essentials in Cameroon at EssentialistMakeupStore.`
    : DEFAULT_DESC

  return {
    metadataBase: new URL('https://www.esmakeupstore.com'),
    title: dynTitle,
    description: dynDesc,
    keywords: [
      'makeup', 'Best makeup store in Cameroon', 'best makeup essentials', 'makeup essentials', 'makeup in Douala', 'African makeup', 'Cameroon beauty', 'Douala beauty',
      'buy makeup Cameroon', 'makeup brands Cameroon', 'makeup store Douala', 'cosmetics Cameroon',
      'EssentialistMakeupStore', 'makeup artist Douala', 'beauty shop Douala', 'foundation', 'concealer',
      'contour', 'bronzer', 'blush', 'highlighter', 'pressed powder', 'setting spray', 'primer', 'eyeshadow',
      'eyeshadow palette', 'eyeliner', 'mascara', 'eyebrow pencil', 'lipsticks', 'lip gloss', 'lip liner',
      'makeup brushes', 'beauty blender', 'makeup remover', 'skincare', 'moisturizer', 'face mask',
      'African makeup trends', 'Cameroonian beauty', 'best makeup products Douala', 'affordable makeup Cameroon',
      'professional makeup Douala', 'bridal makeup Cameroon', 'makeup for dark skin', 'melanin makeup',
      'makeup tutorials Cameroon', 'beauty influencers Cameroon', 'beauty supply Douala', 'face makeup Cameroon',
      'eye makeup Cameroon', 'lip makeup Cameroon', 'makeup tools Cameroon', 'Douala cosmetics', 'Cameroon makeup shop',
      'best beauty brands Douala', 'trending makeup Cameroon', 'makeup sale Cameroon',
      'Douala beauty trends', 'Cameroon makeup artists', 'best beauty shop Douala', 'buy cosmetics Douala',
      'authentic makeup Cameroon', 'popular makeup brands Cameroon', 'best eye shadow Cameroon', 'beauty care Cameroon',
      'top makeup Cameroon', 'trending cosmetics Douala',
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: '/' },
    openGraph: {
      type: 'website',
      siteName: 'EssentialistMakeupStore',
      url: 'https://www.esmakeupstore.com/',
      title: dynTitle,
      description: dynDesc,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'EssentialistMakeupStore Product Preview' }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: dynTitle,
      description: dynDesc,
      images: [OG_IMAGE],
    },
    icons: {
      icon: [{ url: '/icon.avif', type: 'image/avif' }],
      apple: [{ url: '/icon.avif' }],
    },
    themeColor: '#faf6f3',
    other: {
      'msvalidate.01': '1D7D3FCABB171743A8EB32440530AC76',
      'al:android:package': 'com.fsn.esmakeupstore',
      'al:android:app_name': 'EssentialistMakeupStore: Makeup Shopping App',
      'al:ios:app_name': 'EssentialistMakeupStore -- Makeup Shopping',
    },
  }
}

// ---- Schema.org JSON-LD ----
function StructuredData({ categoryProducts = [] }) {
  // Enhanced with dynamic product data for better SEO (limit to top products)
  const productList = categoryProducts.flatMap(({ products }) => 
    Array.isArray(products) ? products.slice(0, 5) : [] // Top 5 per category
  )

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EssentialistMakeupStore',
    url: 'https://www.esmakeupstore.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.esmakeupstore.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'EssentialistMakeupStore',
      logo: {
        '@type': 'ImageObject',
        url: OG_IMAGE,
      },
    },
    image: [
      OG_IMAGE,
      'https://www.esmakeupstore.com/assets/NYX-PMU-Makeup-Lips-Liquid-Lipstick-LIP-LINGERIE-XXL-LXXL28-UNTAMABLE-0800897132187-OpenSwatch.webp',
      'https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg',
    ],
  }

  const itemListJsonLd = productList.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Featured Makeup Products',
    description: 'Explore our top makeup products at Essentialist Makeup Store.',
    numberOfItems: productList.length,
    itemListElement: productList.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        image: Array.isArray(product.image) ? product.image[0] : product.image,
        url: `https://www.esmakeupstore.com/product/${valideURLConvert(product.name)}-${product._id}`,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'XAF',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        },
      },
    })),
  } : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' }],
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EssentialistMakeupStore',
    url: 'https://www.esmakeupstore.com/',
    logo: OG_IMAGE,
    sameAs: [
      'https://www.instagram.com/essentialistmakeupstore',
      'https://www.facebook.com/essentialistmakeupstore',
      'https://www.tiktok.com/@essentialistmakeupstore',
    ],
    address: { '@type': 'PostalAddress', addressCountry: 'CM', addressLocality: 'Douala' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+237655225569',
      contactType: 'customer service',
      availableLanguage: ['en', 'fr'],
    },
  }

  const ld = [websiteJsonLd, breadcrumbJsonLd, organizationJsonLd]
  if (itemListJsonLd) ld.push(itemListJsonLd)

  return (
    <>
      {ld.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  )
}

function buildCategoryUrl(catId, catName, subCategory) {
  if (!catId || !catName || !subCategory) return '#'
  return `/${valideURLConvert(catName)}-${catId}/${valideURLConvert(subCategory.name)}-${subCategory._id}`
}

// Suspense fallback for category product displays (inline skeleton for instant load)
function CategoryFallback({ name }) {
  return (
    <div className="mb-12">
      <div className="container mx-auto px-2 flex items-center justify-between p-2">
        <h2 className="font-bold text-[20px] md:text-[40px] animate-pulse bg-gray-200 h-8 w-48 rounded"></h2>
        <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
      </div>
      <div className="relative flex items-center">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:flex gap-1 md:gap-1 lg:gap-1 container mx-auto overflow-x-auto scrollbar-none scroll-smooth touch-pan-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-1">
              <div className="relative flex flex-col border border-gray-200 overflow-hidden py-1 lg:p-2 rounded-lg bg-white shadow-sm animate-pulse">
                <div className="relative overflow-hidden rounded-lg aspect-square mb-3 bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
                </div>
                <div className="flex-grow flex flex-col px-2 space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="h-5 bg-gray-200 rounded w-16" />
                      <div className="h-4 bg-gray-200 rounded w-12" />
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default async function Home() {
  console.log('Rendering Home page...')
  
  try {
    // Fetch categories and subcategories in parallel
    const [categoryData, subCategoryData] = await Promise.all([
      getCategories(), 
      getSubCategories()
    ])
    
    console.log(`Fetched ${categoryData?.length || 0} categories and ${subCategoryData?.length || 0} subcategories`)
    
    // Pre-fetch products in parallel with Data Cache
    const categoryProducts = await getAllTopCategoryProducts(categoryData)
    console.log(`Fetched products for ${categoryProducts?.length || 0} categories`)
    
    // Debug - log first category's products
    if (categoryProducts?.length > 0) {
      const firstCategory = categoryProducts[0]
      console.log(`First category "${firstCategory?.category?.name}" has ${firstCategory?.products?.length || 0} products`)
    }

    const topCategoryNames = Array.isArray(categoryData)
      ? categoryData.slice(0, 7).map((c) => c?.name).filter(Boolean).join(', ')
      : ''

    // Render category displays with pre-fetched products (no client fetch needed)
    const topCategoryDisplays = categoryProducts.map(({ category, products }) => {
      if (!category || !category._id) {
        console.warn('Invalid category in topCategoryDisplays')
        return null
      }
      
      return (
        <Suspense key={`${category._id}-products`} fallback={<CategoryFallback name={category?.name || 'Category'} />}>
          <CategoryWiseProductDisplay 
            id={category._id} 
            name={category.name} 
            products={products || []} // Pass cached products with fallback
            subCategories={subCategoryData || []} // For URL building
          />
        </Suspense>
      )
    }).filter(Boolean) // Remove null entries

    return (
      <>
        <StructuredData categoryProducts={categoryProducts} />

        <section className="bg-white">
          <ProductRecommendations />

          <div className="container mx-auto px-4">
            <div className="w-full h-full min-h-48 rounded">
              <div className="hidden lg:block mt-2">
                <Image
                  src={bannern}
                  alt="Beautiful model with makeup - Professional beauty photography"
                  priority
                  placeholder="blur"
                  className="w-full h-auto"
                  sizes="(min-width:1024px) 1200px, 100vw"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={bannerMobile}
                  alt="Cosmetics sale banner - Makeup products collection"
                  priority
                  placeholder="blur"
                  className="w-full h-auto"
                  sizes="100vw"
                />
              </div>
              <h1 className="font-bold text-[20px] md:text-[40px] text-center">
                {topCategoryNames ? 'Shop by Category' : 'Shop Makeup Categories & More'}
              </h1>
            </div>
          </div>

          {/* Categories Grid: fast, predictable, prefetch on hover/viewport */}
          <div className="container mx-auto px-4 my-2 grid grid-cols-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 cursor-pointer">
            {Array.isArray(categoryData) && categoryData.length ? (
              categoryData.map((cat) => {
                if (!cat || !cat._id) return null
                
                const subcategory =
                  Array.isArray(subCategoryData) &&
                  subCategoryData.find((sub) => 
                    Array.isArray(sub?.category) && 
                    sub.category.some((c) => c?._id === cat?._id)
                  )

                const href = buildCategoryUrl(cat?._id, cat?.name, subcategory)
                const canNavigate = href !== '#'

                return (
                  <Link
                    key={`${cat?._id}-displayCategory`}
                    href={href}
                    prefetch={canNavigate}
                    className={`w-full block focus:outline-none focus:ring-2 focus:ring-pink-300 rounded ${!canNavigate ? 'pointer-events-none opacity-60' : ''}`}
                    aria-label={`Shop ${cat?.name}`}
                  >
                    <div className="relative w-full aspect-square">
                      <Image
                        src={cat?.image || '/placeholder.png'}
                        alt={`${cat?.name} makeup category - Shop ${cat?.name} products`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 14vw"
                        className="object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 mt-2">
                      {cat?.name}
                    </div>
                  </Link>
                )
              }).filter(Boolean) // Remove null entries
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">Categories will appear here soon.</div>
            )}
          </div>

          <div className="container mx-auto mt-2 px-4">
            <div className="w-full rounded">
              <div className="hidden lg:block">
                <Image
                  src={bannern2}
                  alt="Eyeshadow palette banner - Professional eye makeup collection"
                  priority={false}
                  placeholder="blur"
                  className="w-full h-auto"
                  sizes="(min-width:1024px) 1200px, 100vw"
                />
              </div>
              <div className="lg:hidden">
                <Image
                  src={bannerp}
                  alt="Lipstick collection banner - Premium lip makeup products"
                  priority={false}
                  className="w-full h-auto"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>

          {/* Render top category displays with Suspense for parallel streaming + Data Cache */}
          <div className="lg:block">
            {topCategoryDisplays.length > 0 ? (
              topCategoryDisplays
            ) : (
              <div className="container mx-auto px-4 py-8 text-center text-gray-500">
                <p>Products will appear here soon. Please check back later.</p>
              </div>
            )}
          </div>

          <Suspense fallback={<div className="container mx-auto px-4 py-4 text-center">Loading TikTok Gallery...</div>}>
            <TikTokGallery />
          </Suspense>

          {/* WhatsApp Floating Button */}
          <a
            href="https://wa.me/237655225569"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed z-50 bottom-16 right-2 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-colors"
            style={{ boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)' }}
            aria-label="Contact us on WhatsApp for makeup consultation and orders"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z"></path>
            </svg>
          </a>
        </section>
      </>
    )
  } catch (error) {
    console.error('Error rendering Home page:', error)
    
    // Fallback UI in case of error
    return (
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to Essentialist Makeup Store</h1>
          <p className="mb-8">We are currently updating our product catalog. Please check back soon!</p>
          
          <div className="flex justify-center">
            <a 
              href="https://wa.me/237655225569"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" className="mr-2">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z"></path>
              </svg>
              Contact Us on WhatsApp
            </a>
          </div>
        </div>
      </section>
    )
  }
}