// // client/src/app/brands/page.jsx
// import Link from 'next/link'
// import { valideURLConvert } from '../../utils/valideURLConvert'
// import BrandSearch from '../../components/BrandSearch'

// const SITE_URL = 'https://www.esmakeupstore.com/brands'
// const ROOT_URL = 'https://www.esmakeupstore.com'
// const SITE_NAME = 'Essentialist Makeup Store'
// const OG_IMAGE =
//   'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'
// const DEFAULT_TITLE =
//   'Shop Top Makeup Brands Online in Cameroon'
// const DEFAULT_BRANDS =
//   'NYX, Juvias Place, ONE/SIZE, Bobbi Brown, Smashbox, e.l.f., Estée Lauder, MAC, Clinique, LA Girl'
// const DEFAULT_DESC =
//   'Discover authentic makeup in Cameroon. Browse brand-specific price lists, compare FCFA pricing, and order with fast nationwide delivery from Douala.'
// const MAX_PRODUCTS_FOR_STRUCTURED_DATA = 20

// const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').trim()
// const API_BASE = RAW_API_BASE.replace(/\/$/, '')
// const IS_EXPORT_MODE = process.env.NEXT_EXPORT === 'true'
// const IS_LOCALHOST_API = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(API_BASE)
// const CAN_USE_REMOTE_API = Boolean(API_BASE) && !(IS_EXPORT_MODE && IS_LOCALHOST_API)

// // ---------- Fetch helpers ----------

// async function fetchJson(url, init = {}) {
//   if (!CAN_USE_REMOTE_API) return null

//   try {
//     const res = await fetch(url, init)
//     if (res.status === 404) return null
//     if (!res.ok) {
//       const text = await res
//         .text()
//         .catch(() => res.statusText || 'Unable to read response body')
//       throw new Error(`Request failed ${res.status}: ${text}`)
//     }
//     return res.json()
//   } catch (error) {
//     console.warn('[brands directory] fetchJson failed', { url, error })
//     return null
//   }
// }

// async function fetchBrandCollection() {
//   if (!CAN_USE_REMOTE_API) return { items: [], meta: {} }

//   const payload = await fetchJson(
//     `${API_BASE}/api/brand/list?limit=200&sort=nameAsc&onlyActive=true&includeMetrics=true`,
//     { cache: 'no-store' }
//   )

//   const items =
//     payload?.data?.items ||
//     payload?.data ||
//     payload?.brands ||
//     payload?.items ||
//     []

//   const meta = payload?.meta || {
//     total: Array.isArray(items) ? items.length : 0
//   }

//   return { items: Array.isArray(items) ? items : [], meta }
// }

// async function fetchProductCatalog() {
//   if (!CAN_USE_REMOTE_API) return { items: [], meta: {} }

//   const payload = await fetchJson(`${API_BASE}/api/product/get`, {
//     cache: 'no-store',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       page: 1,
//       limit: 500,
//       onlyActive: true,
//       include: ['brand', 'category', 'subCategory']
//     })
//   })

//   const items =
//     payload?.data?.items ||
//     payload?.data?.products ||
//     payload?.data ||
//     payload?.items ||
//     []

//   const meta = payload?.meta || {
//     total: Array.isArray(items) ? items.length : 0
//   }

//   return { items: Array.isArray(items) ? items : [], meta }
// }

// const SummaryApi = {
//   getCategory: { url: '/api/category/get', method: 'get' },
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' }
// }

// async function getCategories() {
//   if (!CAN_USE_REMOTE_API) return []
//   try {
//     const res = await fetch(`${API_BASE}${SummaryApi.getCategory.url}`, {
//       method: SummaryApi.getCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 300 }
//     })
//     if (!res.ok) throw new Error('Failed categories')
//     const data = await res.json()
//     return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
//   } catch (error) {
//     console.warn('[brands directory] getCategories failed', error)
//     return []
//   }
// }

// async function getSubCategories() {
//   if (!CAN_USE_REMOTE_API) return []
//   try {
//     const res = await fetch(`${API_BASE}${SummaryApi.getSubCategory.url}`, {
//       method: SummaryApi.getSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({}),
//       next: { revalidate: 300 }
//     })
//     if (!res.ok) throw new Error('Failed subcategories')
//     const data = await res.json()
//     return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
//   } catch (error) {
//     console.warn('[brands directory] getSubCategories failed', error)
//     return []
//   }
// }

// // ---------- Normalisation helpers ----------

// function createBrandSlug(name = '') {
//   return name
//     .normalize('NFD')
//     .replace(/[\u0300-\u036f]/g, '')
//     .toLowerCase()
//     .trim()
//     .replace(/&/g, 'and')
//     .replace(/\s+/g, '-')
//     .replace(/[^a-z0-9-]/g, '')
//     .replace(/-+/g, '-')
//     .replace(/^-|-$/g, '')
// }

// function createProductSlug(product = {}) {
//   const fallbackName =
//     typeof product?.name === 'string' ? product.name.trim() : ''
//   const raw =
//     typeof product?.slug === 'string' && product.slug.trim()
//       ? product.slug.trim()
//       : typeof product?.handle === 'string' && product.handle.trim()
//         ? product.handle.trim()
//         : typeof product?.seoSlug === 'string' && product.seoSlug.trim()
//           ? product.seoSlug.trim()
//           : fallbackName
//             ? valideURLConvert(fallbackName)
//             : ''

//   if (!raw) return ''
//   if (product?._id && !raw.includes(product._id)) {
//     return `${raw}-${product._id}`
//   }
//   return raw
// }

// function FCFA(amount) {
//   if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'
//   return `${amount.toLocaleString('en-US')} FCFA`
// }

// function extractSubCategory(product) {
//   const candidate =
//     product?.subCategory ??
//     product?.subCategories ??
//     product?.subcategory ??
//     product?.sub_category ??
//     null

//   if (Array.isArray(candidate)) return candidate[0]
//   if (candidate) return candidate

//   if (product?.subCategoryId || product?.subcategoryId) {
//     return {
//       _id: product.subCategoryId || product.subcategoryId,
//       name:
//         product?.subCategoryName ||
//         product?.subcategoryName ||
//         product?.subcategory ||
//         ''
//     }
//   }

//   if (
//     product?.subCategoryName ||
//     product?.subcategoryName ||
//     product?.subcategory
//   ) {
//     return {
//       _id: null,
//       name:
//         product?.subCategoryName ||
//         product?.subcategoryName ||
//         product?.subcategory ||
//         ''
//     }
//   }

//   return null
// }

// function extractPrice(product, role) {
//   const sources =
//     role === 'bulk'
//       ? [
//           product?.pricing?.wholesale,
//           product?.pricing?.bulk,
//           product?.price?.wholesale,
//           product?.price?.bulk,
//           product?.bulkPrice,
//           product?.wholesalePrice,
//           product?.purchasePrice,
//           product?.costPrice,
//           product?.bulk,
//           product?.wholesale
//         ]
//       : [
//           product?.pricing?.retail,
//           product?.pricing?.selling,
//           product?.price?.retail,
//           product?.price?.selling,
//           product?.salePrice,
//           product?.sellingPrice,
//           product?.retailPrice,
//           product?.price?.current,
//           product?.price,
//           product?.mrp,
//           product?.sell
//         ]

//   return sources.find(
//     (value) => typeof value === 'number' && Number.isFinite(value)
//   )
// }

// function normalizeProductRow(product) {
//   const brandEntity = product?.brand || product?.brandId || product?.brandInfo
//   const brandName =
//     typeof brandEntity === 'string'
//       ? brandEntity
//       : brandEntity?.name ||
//         product?.brandName ||
//         product?.brand_title ||
//         ''
//   const brandSlug =
//     typeof brandEntity === 'object' && brandEntity?.slug
//       ? brandEntity.slug
//       : createBrandSlug(brandName)

//   const subCategory = extractSubCategory(product)
//   const subCategoryId =
//     typeof subCategory === 'object' ? subCategory?._id : subCategory
//   const subCategoryName =
//     typeof subCategory === 'object'
//       ? subCategory?.name
//       : product?.subCategoryName ||
//         product?.subcategoryName ||
//         product?.subcategory ||
//         ''

//   const categoryEntity =
//     product?.category ||
//     product?.categories?.[0] ||
//     (typeof subCategory === 'object' ? subCategory?.category?.[0] : null)
//   const categoryId =
//     typeof categoryEntity === 'object'
//       ? categoryEntity?._id
//       : product?.categoryId || categoryEntity
//   const categoryName =
//     typeof categoryEntity === 'object'
//       ? categoryEntity?.name
//       : product?.categoryName || ''

//   const productSlug = createProductSlug(product)

//   return {
//     id: product?._id || product?.id || `${brandSlug}-${product?.name || 'item'}`,
//     name: product?.name || product?.title || 'Unnamed product',
//     brandName,
//     brandSlug,
//     productSlug,
//     bulkPrice: extractPrice(product, 'bulk'),
//     sellingPrice: extractPrice(product, 'sell'),
//     subCategoryId,
//     subCategoryName,
//     categoryId,
//     categoryName
//   }
// }

// function createEmptyStats() {
//   return {
//     totalProducts: 0,
//     sellSum: 0,
//     sellCount: 0,
//     bulkSum: 0,
//     bulkCount: 0,
//     categories: new Set(),
//     subCategories: new Set()
//   }
// }

// function aggregateBrandStats(brands = [], productRows = []) {
//   const statsMap = new Map()

//   productRows.forEach((row) => {
//     if (!row.brandSlug) return
//     if (!statsMap.has(row.brandSlug)) statsMap.set(row.brandSlug, createEmptyStats())
//     const stats = statsMap.get(row.brandSlug)

//     stats.totalProducts += 1

//     if (typeof row.sellingPrice === 'number') {
//       stats.sellSum += row.sellingPrice
//       stats.sellCount += 1
//     }

//     if (typeof row.bulkPrice === 'number') {
//       stats.bulkSum += row.bulkPrice
//       stats.bulkCount += 1
//     }

//     if (row.categoryName) stats.categories.add(row.categoryName)
//     if (row.subCategoryName) stats.subCategories.add(row.subCategoryName)
//   })

//   return (Array.isArray(brands) ? brands : []).map((brand) => {
//     const slug = brand.slug || createBrandSlug(brand.name || brand.title || brand._id || '')
//     const apiMetrics = brand.metrics || {}
//     const aggregated = statsMap.get(slug) || createEmptyStats()

//     const totalProducts =
//       aggregated.totalProducts || apiMetrics.totalProducts || 0

//     const avgSellingPrice =
//       aggregated.sellCount > 0
//         ? Math.round(aggregated.sellSum / aggregated.sellCount)
//         : apiMetrics.avgSellingPrice

//     const avgBulkPrice =
//       aggregated.bulkCount > 0
//         ? Math.round(aggregated.bulkSum / aggregated.bulkCount)
//         : apiMetrics.avgBulkPrice

//     const categories =
//       aggregated.categories.size > 0
//         ? Array.from(aggregated.categories).sort()
//         : apiMetrics.categories || []

//     const subCategories =
//       aggregated.subCategories.size > 0
//         ? Array.from(aggregated.subCategories).sort()
//         : apiMetrics.subCategories || []

//     return {
//       ...brand,
//       slug,
//       metrics: {
//         totalProducts,
//         avgSellingPrice,
//         avgBulkPrice,
//         categories,
//         subCategories
//       }
//     }
//   })
// }

// function getSubCatInfo(allSubCategory, row) {
//   if (!Array.isArray(allSubCategory)) return null

//   if (row.subCategoryId) {
//     const foundById = allSubCategory.find((sub) => {
//       const subId = typeof sub?._id === 'string' ? sub._id : ''
//       return subId === row.subCategoryId
//     })
//     if (foundById) return foundById
//   }

//   if (row.subCategoryName) {
//     const foundByName = allSubCategory.find(
//       (sub) =>
//         sub?.name?.trim()?.toLowerCase() === row.subCategoryName.trim().toLowerCase()
//     )
//     if (foundByName) return foundByName
//   }

//   return null
// }

// function getCategoryLinkMeta(allCategory, allSubCategory, row) {
//   const subCat = getSubCatInfo(allSubCategory, row)
//   if (!subCat) return null

//   let mainCat = null

//   if (Array.isArray(subCat.category) && subCat.category.length) {
//     mainCat = Array.isArray(allCategory)
//       ? allCategory.find(
//           (cat) =>
//             cat?._id === subCat.category[0]?._id || cat?._id === subCat.category[0]
//         )
//       : null
//   }

//   if (!mainCat && row.categoryId) {
//     mainCat = Array.isArray(allCategory)
//       ? allCategory.find((cat) => cat?._id === row.categoryId)
//       : null
//   }

//   if (!mainCat && row.categoryName) {
//     mainCat = Array.isArray(allCategory)
//       ? allCategory.find(
//           (cat) =>
//             cat?.name?.trim()?.toLowerCase() === row.categoryName.trim().toLowerCase()
//         )
//       : null
//   }

//   if (!mainCat) return null
//   return { mainCat, subCat }
// }

// function buildSubCatUrl(mainCat, subCat) {
//   if (!mainCat?._id || !subCat?._id) return '#'
//   return `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(
//     subCat.name
//   )}-${subCat._id}`
// }

// // ---------- UI fragments ----------

// function BrandDirectoryGrid({ brandStats = [] }) {
//   if (!Array.isArray(brandStats) || !brandStats.length) return null

//   return (
//     <section className="container mx-auto px-4 py-5">
//       <header className="mb-8 text-center">
//         <h1 className="text-3xl font-bold">Shop by brand</h1>
//         <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
//           Explore curated makeup collections from our active brand partners. Click any
//           brand to view their products.
//         </p>
//       </header>

//       <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {brandStats.map((brand) => (
//           <Link
//             key={brand._id || brand.slug}
//             href={`/brands/${brand.slug}`}
//             className="group border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="p-6 flex flex-col items-center gap-4">
//               <div className="h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border">
//                 {brand.logo ? (
//                   // eslint-disable-next-line @next/next/no-img-element
//                   <img
//                     src={brand.logo}
//                     alt={brand.name}
//                     className="object-contain h-full w-full"
//                   />
//                 ) : (
//                   <span className="text-xs text-gray-400 text-center px-2">
//                     Logo coming soon
//                   </span>
//                 )}
//               </div>
//               <h2 className="text-lg font-semibold text-center">{brand.name}</h2>
//               {brand.isFeatured && (
//                 <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 border border-yellow-200 px-3 py-1 rounded-full">
//                   Featured
//                 </span>
//               )}
//               <p className="text-sm text-gray-500 line-clamp-3 text-center">
//                 {brand.description
//                   ? brand.description
//                       .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
//                       .slice(0, 140)
//                       .concat('…')
//                   : 'Discover signature products from this brand.'}
//               </p>
//               <div className="text-xs text-gray-500">
//                 {brand.metrics?.totalProducts || 0} products •{' '}
//                 {brand.metrics?.avgSellingPrice
//                   ? FCFA(brand.metrics.avgSellingPrice)
//                   : '—'}{' '}
//                 avg
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </section>
//   )
// }

// function StructuredData({ products = [], brandStats = [] }) {
//   if (!Array.isArray(products) || products.length === 0) return null

//   const structuredProducts = products.slice(0, MAX_PRODUCTS_FOR_STRUCTURED_DATA).map(
//     (item) => ({
//       '@type': 'Product',
//       name: item.name,
//       brand: { '@type': 'Brand', name: item.brandName },
//       category: item.subCategoryName || item.categoryName,
//       offers: {
//         '@type': 'Offer',
//         priceCurrency: 'XAF',
//         price:
//           typeof item.sellingPrice === 'number'
//             ? String(item.sellingPrice)
//             : undefined,
//         availability: 'https://schema.org/InStock'
//       }
//     })
//   )

//   const itemList = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: 'Makeup Brand Price List',
//     itemListElement: structuredProducts.map((prod, index) => ({
//       '@type': 'ListItem',
//       position: index + 1,
//       item: prod
//     }))
//   }

//   const storeJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Store',
//     name: SITE_NAME,
//     url: SITE_URL,
//     logo: OG_IMAGE,
//     image: [
//       OG_IMAGE,
//       'https://www.esmakeupstore.com/assets/NYX-PMU-Makeup-Lips-Liquid-Lipstick-LIP-LINGERIE-XXL-LXXL28-UNTAMABLE-0800897132187-OpenSwatch.webp',
//       'https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg'
//     ],
//     address: {
//       '@type': 'PostalAddress',
//       streetAddress: 'Bonamoussadi, Carrefour Maçon',
//       addressLocality: 'Douala',
//       addressCountry: 'CM'
//     },
//     contactPoint: {
//       '@type': 'ContactPoint',
//       telephone: '+237655225569',
//       contactType: 'customer support',
//       areaServed: 'CM'
//     },
//     sameAs: [
//       'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fesmakeupstore'
//     ],
//     makesOffer: structuredProducts
//   }

//   const brandCollection = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: 'Available Makeup Brands',
//     itemListElement: (Array.isArray(brandStats) ? brandStats : []).map(
//       (brand, index) => ({
//         '@type': 'ListItem',
//         position: index + 1,
//         item: {
//           '@type': 'Brand',
//           name: brand.name,
//           url: `${ROOT_URL}/brands/${brand.slug}`
//         }
//       })
//     )
//   }

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(storeJsonLd)
//         }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(itemList)
//         }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(brandCollection)
//         }}
//       />
//     </>
//   )
// }

// async function pingIndexNow() {
//   if (!CAN_USE_REMOTE_API || process.env.NODE_ENV !== 'production') return
//   try {
//     await fetch(`${API_BASE}/api/indexnow/submit-url`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ url: SITE_URL }),
//       cache: 'no-store'
//     })
//   } catch (error) {
//     console.warn('[brands directory] pingIndexNow failed', error)
//   }
// }

// // ---------- Metadata ----------

// export async function generateMetadata() {
//   if (!CAN_USE_REMOTE_API) {
//     return {
//       metadataBase: new URL(ROOT_URL),
//       title: DEFAULT_TITLE,
//       description:
//         'Brand directory content is unavailable during static export when NEXT_PUBLIC_API_URL points to localhost.',
//       robots: { index: false, follow: false },
//       alternates: { canonical: SITE_URL },
//       openGraph: {
//         type: 'website',
//         siteName: SITE_NAME,
//         url: SITE_URL,
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         images: [
//           {
//             url: OG_IMAGE,
//             width: 1200,
//             height: 630,
//             alt: 'Makeup brands in Cameroon -- price list'
//           }
//         ],
//         locale: 'en_US'
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         images: [OG_IMAGE]
//       }
//     }
//   }

//   try {
//     const [{ items: brandItems }, { items: productItems }] = await Promise.all([
//       fetchBrandCollection(),
//       fetchProductCatalog()
//     ])

//     const productRows = (Array.isArray(productItems) ? productItems : []).map(
//       normalizeProductRow
//     )
//     const brandStats = aggregateBrandStats(brandItems, productRows)

//     const brandNames = brandStats.map((brand) => brand.name).filter(Boolean)
//     const subCategoryNames = Array.from(
//       new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
//     )

//     const dynTitle = brandNames.length
//       ? `Shop Top Makeup Brands Online: ${brandNames.slice(0, 11).join(', ')}`
//       : DEFAULT_TITLE

//     const dynDesc = `Discover authentic makeup in Cameroon. Brands: ${
//       brandNames.length ? brandNames.join(', ') : DEFAULT_BRANDS
//     }. Categories: ${
//       subCategoryNames.length
//         ? subCategoryNames.join(', ')
//         : 'foundations, lip makeup, eye makeup, face makeup'
//     }. Browse individual brand pages for detailed pricing. Best FCFA prices, fast delivery in Douala & nationwide.`

//     return {
//       metadataBase: new URL(ROOT_URL),
//       title: dynTitle,
//       description: dynDesc,
//       keywords: [
//         'makeup brands',
//         'Cameroon makeup',
//         'Douala makeup store',
//         'authentic makeup Cameroon',
//         'foundation price list',
//         'lipstick price',
//         'powder price',
//         'cosmetics Cameroon',
//         'brand comparison',
//         'makeup price list',
//         ...brandNames.slice(0, 20).map((name) => `${name} Cameroon`),
//         ...subCategoryNames.slice(0, 20).map((cat) => `${cat} price`)
//       ],
//       robots: { index: true, follow: true },
//       alternates: { canonical: SITE_URL },
//       openGraph: {
//         type: 'website',
//         siteName: SITE_NAME,
//         url: SITE_URL,
//         title: dynTitle,
//         description: dynDesc,
//         images: [
//           {
//             url: OG_IMAGE,
//             width: 1200,
//             height: 630,
//             alt: 'Makeup brands in Cameroon -- price list'
//           }
//         ],
//         locale: 'en_US'
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: dynTitle,
//         description: dynDesc,
//         images: [OG_IMAGE]
//       }
//     }
//   } catch (error) {
//     console.error('Metadata generation (brands page) failed:', error)
//     return {
//       metadataBase: new URL(ROOT_URL),
//       title: DEFAULT_TITLE,
//       description: DEFAULT_DESC,
//       alternates: { canonical: SITE_URL },
//       robots: { index: true, follow: true },
//       openGraph: {
//         type: 'website',
//         siteName: SITE_NAME,
//         url: SITE_URL,
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         images: [
//           {
//             url: OG_IMAGE,
//             width: 1200,
//             height: 630,
//             alt: 'Makeup brands in Cameroon -- price list'
//           }
//         ],
//         locale: 'en_US'
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title: DEFAULT_TITLE,
//         description: DEFAULT_DESC,
//         images: [OG_IMAGE]
//       }
//     }
//   }
// }

// export function generateViewport() {
//   return {
//     themeColor: '#faf6f3'
//   }
// }

// // ---------- Page ----------

// export default async function BrandPage() {
//   if (process.env.NODE_ENV === 'production' && CAN_USE_REMOTE_API) {
//     await pingIndexNow()
//   }

//   if (!CAN_USE_REMOTE_API) {
//     return <ApiUnavailableNotice />
//   }

//   let brandItems = []
//   let productItems = []
//   let allCategory = []
//   let allSubCategory = []

//   try {
//     const res = await Promise.all([
//       fetchBrandCollection(),
//       fetchProductCatalog(),
//       getCategories(),
//       getSubCategories()
//     ])

//     brandItems = res[0]?.items || []
//     productItems = res[1]?.items || []
//     allCategory = res[2] || []
//     allSubCategory = res[3] || []
//   } catch (error) {
//     console.warn('[brands directory] data fetch failed during build', error)
//     return (
//       <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//         <div className="container mx-auto p-8 text-center">
//           <h1 className="text-2xl font-bold">Brands temporarily unavailable</h1>
//           <p className="mt-2 text-gray-600">
//             We couldn’t fetch brand data at build time. The site will attempt to load dynamic content at runtime.
//           </p>
//         </div>
//       </main>
//     )
//   }

//   const productRows = (Array.isArray(productItems) ? productItems : []).map(
//     normalizeProductRow
//   )
//   const brandStats = aggregateBrandStats(brandItems, productRows)

//   const brandNames = brandStats.map((brand) => brand.name).filter(Boolean)
//   const subCategoryNames = Array.from(
//     new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
//   )
//   const categoryNames = Array.from(
//     new Set(productRows.map((row) => row.categoryName).filter(Boolean))
//   )

//   const totalProducts = productRows.length

//   return (
//     <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//       <StructuredData products={productRows} brandStats={brandStats} />

//       <div className="mb-2">
//         <BrandSearch />
//       </div>

//       <BrandDirectoryGrid brandStats={brandStats} />

//       <section
//         aria-labelledby="product-table-heading"
//         className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white"
//       >
//         <h2
//           id="product-table-heading"
//           className="text-xl font-bold text-pink-600 p-4 border-b border-pink-200"
//         >
//           Complete Product Price List - All Brands
//         </h2>
//         <table className="min-w-full text-sm md:text-base">
//           <thead>
//             <tr className="bg-pink-100 text-black">
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Product
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Subcategory
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Brand
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Bulk Price (FCFA)
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Selling Price (FCFA)
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {productRows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="py-6 px-4 text-center text-gray-500 italic bg-white"
//                 >
//                   No products available yet. Please check back soon.
//                 </td>
//               </tr>
//             ) : (
//               productRows.map((row, index) => {
//                 const linkMeta = getCategoryLinkMeta(
//                   allCategory,
//                   allSubCategory,
//                   row
//                 )
//                 const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-pink-50'

//                 return (
//                   <tr key={row.id || `${row.name}-${index}`} className={rowClass}>
//                     <td className="py-2 px-2 md:px-4 font-semibold text-gray-900">
//                       {row.productSlug ? (
//                         <Link
//                           href={`/product/${row.productSlug}`}
//                           className="text-gray-900 hover:text-pink-600 underline decoration-pink-300 decoration-2 underline-offset-2 transition-colors font-medium"
//                           aria-label={`View ${row.name}`}
//                         >
//                           {row.name}
//                         </Link>
//                       ) : (
//                         <span>{row.name}</span>
//                       )}
//                     </td>
//                     <td className="py-2 px-2 md:px-4">
//                       {linkMeta ? (
//                         <Link
//                           href={buildSubCatUrl(linkMeta.mainCat, linkMeta.subCat)}
//                           className="underline text-blue-700 hover:text-pink-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
//                           aria-label={`Browse ${row.subCategoryName} in ${linkMeta.mainCat?.name}`}
//                         >
//                           {row.subCategoryName || row.categoryName || 'View'}
//                         </Link>
//                       ) : (
//                         <span className="text-gray-500">
//                           {row.subCategoryName || row.categoryName || '—'}
//                         </span>
//                       )}
//                     </td>
//                     <td className="py-2 px-2 md:px-4">
//                       <Link
//                         href={`/brands/${row.brandSlug}`}
//                         className="text-gray-900 hover:text-pink-600 font-medium transition-colors underline"
//                         aria-label={`View all ${row.brandName} products`}
//                       >
//                         {row.brandName}
//                       </Link>
//                     </td>
//                     <td className="py-2 px-2 md:px-4 text-right font-bold text-green-600">
//                       {FCFA(row.bulkPrice)}
//                     </td>
//                     <td className="py-2 px-2 md:px-4 text-right font-bold text-pink-600">
//                       {FCFA(row.sellingPrice)}
//                     </td>
//                   </tr>
//                 )
//               })
//             )}
//           </tbody>
//         </table>
//       </section>

//       <section className="text-center mb-8 mt-10">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
//           ESSENTIALIST MAKEUP STORE
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-700 font-semibold">
//           Build &amp; Brand — Makeup Brands Price List
//         </p>
//         <p className="text-pink-600 font-bold mt-2">
//           Discover authentic brands at the best prices in Cameroon!
//         </p>
//         <p className="text-gray-600 mt-1">
//           Brands: {brandNames.length ? brandNames.join(', ') : DEFAULT_BRANDS}.
//         </p>
//         <p className="text-gray-600">
//           Categories:{' '}
//           {subCategoryNames.length
//             ? subCategoryNames.join(', ')
//             : categoryNames.join(', ') || 'Foundations, Lip Makeup, Eye Makeup'}
//           .
//         </p>
//         <p className="text-gray-500 text-sm mt-2">
//           Total products tracked: {totalProducts.toLocaleString()}
//         </p>
//       </section>

//       <section className="max-w-4xl mx-auto bg-white border border-pink-200 rounded-lg shadow p-6 space-y-4">
//         <h2 className="text-2xl font-bold text-pink-600">Brand FAQs</h2>
//         <details className="p-3 bg-pink-50 rounded">
//           <summary className="font-semibold text-gray-800">
//             Do you deliver NYX, MAC, and Estée Lauder nationwide in Cameroon?
//           </summary>
//           <p className="text-gray-700 mt-2">
//             Yes. We ship from Douala to cities nationwide. Delivery is fast and payment is
//             100% secure online.
//           </p>
//         </details>
//         <details className="p-3 bg-pink-50 rounded">
//           <summary className="font-semibold text-gray-800">
//             Are the products authentic?
//           </summary>
//           <p className="text-gray-700 mt-2">
//             All items are 100% authentic. We publish FCFA price lists for transparency and
//             keep popular items marked In stock.
//           </p>
//         </details>
//         <details className="p-3 bg-pink-50 rounded">
//           <summary className="font-semibold text-gray-800">
//             How can I find my foundation shade?
//           </summary>
//           <p className="text-gray-700 mt-2">
//             Open any brand page and filter by category. For Estée Lauder Double Wear or MAC
//             Studio Fix, contact support for a quick shade guide.
//           </p>
//         </details>
//       </section>

//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify({
//             '@context': 'https://schema.org',
//             '@type': 'FAQPage',
//             mainEntity: [
//               {
//                 '@type': 'Question',
//                 name: 'Do you deliver NYX, MAC, and Estée Lauder nationwide in Cameroon?',
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: 'Yes. We ship from Douala to cities nationwide. Delivery is fast and payment is 100% secure online.'
//                 }
//               },
//               {
//                 '@type': 'Question',
//                 name: 'Are the products authentic?',
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: 'All items are 100% authentic. We publish FCFA price lists for transparency and keep popular items marked In stock.'
//                 }
//               },
//               {
//                 '@type': 'Question',
//                 name: 'How can I find my foundation shade?',
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: 'Open any brand page and filter by category. For Estée Lauder Double Wear or MAC Studio Fix, contact support for a quick shade guide.'
//                 }
//               }
//             ]
//           })
//         }}
//       />
//     </main>
//   )
// }

// function ApiUnavailableNotice() {
//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-16">
//       <section className="max-w-3xl w-full bg-white border border-pink-200 rounded-2xl shadow-lg p-8 space-y-4 text-center">
//         <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
//           Brand directory skipped during static export
//         </h1>
//         <p className="text-gray-700">
//           Remote API calls are disabled because <code className="px-2 py-1 bg-gray-100 rounded">next export</code>{' '}
//           detected <code>NEXT_PUBLIC_API_URL</code> pointing to <code>localhost</code>. This prevents the build from crashing but leaves this page without live data.
//         </p>
//         <ol className="text-left text-gray-700 list-decimal list-inside space-y-2">
//           <li>Expose your API on a reachable host (staging/prod or tunnel) and update <code>NEXT_PUBLIC_API_URL</code>.</li>
//           <li>Or run the project with <code>next build && next start</code> instead of <code>next export</code> so data loads at runtime.</li>
//           <li>Or accept that the exported HTML will show this message until client-side hydration fetches data.</li>
//         </ol>
//       </section>
//     </main>
//   )
// }




import BrandsDirectoryClient from './BrandsDirectoryClient'
import { valideURLConvert } from '../../utils/valideURLConvert'

const SITE_URL = 'https://www.esmakeupstore.com/brands'
const ROOT_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'
const OG_IMAGE =
  'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'
const DEFAULT_TITLE = 'Shop Top Makeup Brands Online in Cameroon'
const DEFAULT_BRANDS =
  'NYX, Juvias Place, ONE/SIZE, Bobbi Brown, Smashbox, e.l.f., Estée Lauder, MAC, Clinique, LA Girl'
const DEFAULT_DESC =
  'Discover authentic makeup in Cameroon. Browse brand-specific price lists, compare FCFA pricing, and order with fast nationwide delivery from Douala.'

const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').trim()
const API_BASE = RAW_API_BASE.replace(/\/$/, '')
const IS_EXPORT_MODE = process.env.NEXT_EXPORT === 'true'
const IS_LOCALHOST_API = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(API_BASE)
const CAN_USE_REMOTE_API = Boolean(API_BASE) && !(IS_EXPORT_MODE && IS_LOCALHOST_API)

// ---------- Fetch helpers (server-side for metadata) ----------

async function fetchJson(url, init = {}) {
  if (!CAN_USE_REMOTE_API) return null

  try {
    const res = await fetch(url, init)
    if (res.status === 404) return null
    if (!res.ok) {
      const text = await res
        .text()
        .catch(() => res.statusText || 'Unable to read response body')
      throw new Error(`Request failed ${res.status}: ${text}`)
    }
    return res.json()
  } catch (error) {
    console.warn('[brands directory] fetchJson failed', { url, error })
    return null
  }
}

async function fetchBrandCollection() {
  if (!CAN_USE_REMOTE_API) return { items: [], meta: {} }

  const payload = await fetchJson(
    `${API_BASE}/api/brand/list?limit=200&sort=nameAsc&onlyActive=true&includeMetrics=true`,
    { cache: 'no-store' }
  )

  const items =
    payload?.data?.items ||
    payload?.data ||
    payload?.brands ||
    payload?.items ||
    []

  const meta = payload?.meta || {
    total: Array.isArray(items) ? items.length : 0
  }

  return { items: Array.isArray(items) ? items : [], meta }
}

async function fetchProductCatalog() {
  if (!CAN_USE_REMOTE_API) return { items: [], meta: {} }

  const payload = await fetchJson(`${API_BASE}/api/product/get`, {
    cache: 'no-store',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page: 1,
      limit: 500,
      onlyActive: true,
      include: ['brand', 'category', 'subCategory']
    })
  })

  const items =
    payload?.data?.items ||
    payload?.data?.products ||
    payload?.data ||
    payload?.items ||
    []

  const meta = payload?.meta || {
    total: Array.isArray(items) ? items.length : 0
  }

  return { items: Array.isArray(items) ? items : [], meta }
}

// ---------- Normalisation helpers (used in metadata) ----------

function createBrandSlug(name = '') {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function createProductSlug(product = {}) {
  const fallbackName =
    typeof product?.name === 'string' ? product.name.trim() : ''
  const raw =
    typeof product?.slug === 'string' && product.slug.trim()
      ? product.slug.trim()
      : typeof product?.handle === 'string' && product.handle.trim()
        ? product.handle.trim()
        : typeof product?.seoSlug === 'string' && product.seoSlug.trim()
          ? product.seoSlug.trim()
          : fallbackName
            ? valideURLConvert(fallbackName)
            : ''

  if (!raw) return ''
  if (product?._id && !raw.includes(product._id)) {
    return `${raw}-${product._id}`
  }
  return raw
}

function extractSubCategory(product) {
  const candidate =
    product?.subCategory ??
    product?.subCategories ??
    product?.subcategory ??
    product?.sub_category ??
    null

  if (Array.isArray(candidate)) return candidate[0]
  if (candidate) return candidate

  if (product?.subCategoryId || product?.subcategoryId) {
    return {
      _id: product.subCategoryId || product.subcategoryId,
      name:
        product?.subCategoryName ||
        product?.subcategoryName ||
        product?.subcategory ||
        ''
    }
  }

  if (
    product?.subCategoryName ||
    product?.subcategoryName ||
    product?.subcategory
  ) {
    return {
      _id: null,
      name:
        product?.subCategoryName ||
        product?.subcategoryName ||
        product?.subcategory ||
        ''
    }
  }

  return null
}

function extractPrice(product, role) {
  const sources =
    role === 'bulk'
      ? [
          product?.pricing?.wholesale,
          product?.pricing?.bulk,
          product?.price?.wholesale,
          product?.price?.bulk,
          product?.bulkPrice,
          product?.wholesalePrice,
          product?.purchasePrice,
          product?.costPrice,
          product?.bulk,
          product?.wholesale
        ]
      : [
          product?.pricing?.retail,
          product?.pricing?.selling,
          product?.price?.retail,
          product?.price?.selling,
          product?.salePrice,
          product?.sellingPrice,
          product?.retailPrice,
          product?.price?.current,
          product?.price,
          product?.mrp,
          product?.sell
        ]

  return sources.find(
    (value) => typeof value === 'number' && Number.isFinite(value)
  )
}

function normalizeProductRow(product) {
  const brandEntity = product?.brand || product?.brandId || product?.brandInfo
  const brandName =
    typeof brandEntity === 'string'
      ? brandEntity
      : brandEntity?.name ||
        product?.brandName ||
        product?.brand_title ||
        ''
  const brandSlug =
    typeof brandEntity === 'object' && brandEntity?.slug
      ? brandEntity.slug
      : createBrandSlug(brandName)

  const subCategory = extractSubCategory(product)
  const subCategoryId =
    typeof subCategory === 'object' ? subCategory?._id : subCategory
  const subCategoryName =
    typeof subCategory === 'object'
      ? subCategory?.name
      : product?.subCategoryName ||
        product?.subcategoryName ||
        product?.subcategory ||
        ''

  const categoryEntity =
    product?.category ||
    product?.categories?.[0] ||
    (typeof subCategory === 'object' ? subCategory?.category?.[0] : null)
  const categoryId =
    typeof categoryEntity === 'object'
      ? categoryEntity?._id
      : product?.categoryId || categoryEntity
  const categoryName =
    typeof categoryEntity === 'object'
      ? categoryEntity?.name
      : product?.categoryName || ''

  const productSlug = createProductSlug(product)

  return {
    id: product?._id || product?.id || `${brandSlug}-${product?.name || 'item'}`,
    name: product?.name || product?.title || 'Unnamed product',
    brandName,
    brandSlug,
    productSlug,
    bulkPrice: extractPrice(product, 'bulk'),
    sellingPrice: extractPrice(product, 'sell'),
    subCategoryId,
    subCategoryName,
    categoryId,
    categoryName
  }
}

function createEmptyStats() {
  return {
    totalProducts: 0,
    sellSum: 0,
    sellCount: 0,
    bulkSum: 0,
    bulkCount: 0,
    categories: new Set(),
    subCategories: new Set()
  }
}

function aggregateBrandStats(brands = [], productRows = []) {
  const statsMap = new Map()

  productRows.forEach((row) => {
    if (!row.brandSlug) return
    if (!statsMap.has(row.brandSlug)) statsMap.set(row.brandSlug, createEmptyStats())
    const stats = statsMap.get(row.brandSlug)

    stats.totalProducts += 1

    if (typeof row.sellingPrice === 'number') {
      stats.sellSum += row.sellingPrice
      stats.sellCount += 1
    }

    if (typeof row.bulkPrice === 'number') {
      stats.bulkSum += row.bulkPrice
      stats.bulkCount += 1
    }

    if (row.categoryName) stats.categories.add(row.categoryName)
    if (row.subCategoryName) stats.subCategories.add(row.subCategoryName)
  })

  return (Array.isArray(brands) ? brands : []).map((brand) => {
    const slug = brand.slug || createBrandSlug(brand.name || brand.title || brand._id || '')
    const apiMetrics = brand.metrics || {}
    const aggregated = statsMap.get(slug) || createEmptyStats()

    const totalProducts =
      aggregated.totalProducts || apiMetrics.totalProducts || 0

    const avgSellingPrice =
      aggregated.sellCount > 0
        ? Math.round(aggregated.sellSum / aggregated.sellCount)
        : apiMetrics.avgSellingPrice

    const avgBulkPrice =
      aggregated.bulkCount > 0
        ? Math.round(aggregated.bulkSum / aggregated.bulkCount)
        : apiMetrics.avgBulkPrice

    const categories =
      aggregated.categories.size > 0
        ? Array.from(aggregated.categories).sort()
        : apiMetrics.categories || []

    const subCategories =
      aggregated.subCategories.size > 0
        ? Array.from(aggregated.subCategories).sort()
        : apiMetrics.subCategories || []

    return {
      ...brand,
      slug,
      metrics: {
        totalProducts,
        avgSellingPrice,
        avgBulkPrice,
        categories,
        subCategories
      }
    }
  })
}

// ---------- Metadata ----------

export async function generateMetadata() {
  if (!CAN_USE_REMOTE_API) {
    return {
      metadataBase: new URL(ROOT_URL),
      title: DEFAULT_TITLE,
      description:
        'Brand directory content is unavailable during static export when NEXT_PUBLIC_API_URL points to localhost.',
      robots: { index: false, follow: false },
      alternates: { canonical: SITE_URL },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: SITE_URL,
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [
          {
            url: OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Makeup brands in Cameroon -- price list'
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [OG_IMAGE]
      }
    }
  }

  try {
    const [{ items: brandItems }, { items: productItems }] = await Promise.all([
      fetchBrandCollection(),
      fetchProductCatalog()
    ])

    const productRows = (Array.isArray(productItems) ? productItems : []).map(
      normalizeProductRow
    )
    const brandStats = aggregateBrandStats(brandItems, productRows)

    const brandNames = brandStats.map((brand) => brand.name).filter(Boolean)
    const subCategoryNames = Array.from(
      new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
    )

    const dynTitle = brandNames.length
      ? `Shop Top Makeup Brands Online: ${brandNames.slice(0, 11).join(', ')}`
      : DEFAULT_TITLE

    const dynDesc = `Discover authentic makeup in Cameroon. Brands: ${
      brandNames.length ? brandNames.join(', ') : DEFAULT_BRANDS
    }. Categories: ${
      subCategoryNames.length
        ? subCategoryNames.join(', ')
        : 'foundations, lip makeup, eye makeup, face makeup'
    }. Browse individual brand pages for detailed pricing. Best FCFA prices, fast delivery in Douala & nationwide.`

    return {
      metadataBase: new URL(ROOT_URL),
      title: dynTitle,
      description: dynDesc,
      keywords: [
        'makeup brands',
        'Cameroon makeup',
        'Douala makeup store',
        'authentic makeup Cameroon',
        'foundation price list',
        'lipstick price',
        'powder price',
        'cosmetics Cameroon',
        'brand comparison',
        'makeup price list',
        ...brandNames.slice(0, 20).map((name) => `${name} Cameroon`),
        ...subCategoryNames.slice(0, 20).map((cat) => `${cat} price`)
      ],
      robots: { index: true, follow: true },
      alternates: { canonical: SITE_URL },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: SITE_URL,
        title: dynTitle,
        description: dynDesc,
        images: [
          {
            url: OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Makeup brands in Cameroon -- price list'
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: dynTitle,
        description: dynDesc,
        images: [OG_IMAGE]
      }
    }
  } catch (error) {
    console.error('Metadata generation (brands page) failed:', error)
    return {
      metadataBase: new URL(ROOT_URL),
      title: DEFAULT_TITLE,
      description: DEFAULT_DESC,
      alternates: { canonical: SITE_URL },
      robots: { index: true, follow: true },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: SITE_URL,
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [
          {
            url: OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Makeup brands in Cameroon -- price list'
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title: DEFAULT_TITLE,
        description: DEFAULT_DESC,
        images: [OG_IMAGE]
      }
    }
  }
}

export function generateViewport() {
  return {
    themeColor: '#faf6f3'
  }
}

// ---------- Page ----------

export default function BrandPage() {
  if (!CAN_USE_REMOTE_API) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-16">
        <section className="max-w-3xl w-full bg-white border border-pink-200 rounded-2xl shadow-lg p-8 space-y-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
            Brand directory skipped during static export
          </h1>
          <p className="text-gray-700">
            Remote API calls are disabled because <code className="px-2 py-1 bg-gray-100 rounded">NEXT_PUBLIC_API_URL</code> points to a localhost host while <code>next export</code> is running. Client-side hydration cannot recover data in this mode.
          </p>
          <ol className="text-left text-gray-700 list-decimal list-inside space-y-2">
            <li>Expose your API on a reachable host (staging/prod or tunnel) and update <code>NEXT_PUBLIC_API_URL</code>.</li>
            <li>Or run with <code>next build && next start</code> to fetch data at runtime.</li>
            <li>Or accept this static message for exported HTML pages.</li>
          </ol>
        </section>
      </main>
    )
  }

  return <BrandsDirectoryClient canUseRemoteApi={CAN_USE_REMOTE_API} />
}