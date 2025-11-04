// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import { valideURLConvert } from '../../../utils/valideURLConvert'

// const SITE_URL = 'https://www.esmakeupstore.com'
// const SITE_NAME = 'Essentialist Makeup Store'
// const DEFAULT_OG_IMAGE =
//   'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
// const DEFAULT_BRAND_DESCRIPTION =
//   'Shop authentic makeup with FCFA pricing. Fast delivery in Douala & nationwide across Cameroon.'

// export const dynamic = 'force-dynamic'

// async function fetchJson(url, init = {}) {
//   const res = await fetch(url, init)
//   if (res.status === 404) return null
//   if (!res.ok) {
//     const text = await res.text()
//     throw new Error(`Request failed ${res.status}: ${text}`)
//   }
//   return res.json()
// }

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
//   const fallbackName = typeof product?.name === 'string' ? product.name.trim() : ''
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

// function computeBrandMetrics(productRows) {
//   const totalProducts = productRows.length
//   const sellPrices = productRows
//     .map((row) => row.sellingPrice)
//     .filter((value) => typeof value === 'number')
//   const bulkPrices = productRows
//     .map((row) => row.bulkPrice)
//     .filter((value) => typeof value === 'number')

//   const avgSellingPrice = sellPrices.length
//     ? Math.round(sellPrices.reduce((sum, value) => sum + value, 0) / sellPrices.length)
//     : undefined

//   const avgBulkPrice = bulkPrices.length
//     ? Math.round(bulkPrices.reduce((sum, value) => sum + value, 0) / bulkPrices.length)
//     : undefined

//   const totalValue = sellPrices.reduce((sum, value) => sum + value, 0)

//   const categories = Array.from(
//     new Set(productRows.map((row) => row.categoryName).filter(Boolean))
//   ).sort()

//   const subCategories = Array.from(
//     new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
//   ).sort()

//   return {
//     totalProducts,
//     avgSellingPrice,
//     avgBulkPrice,
//     totalValue,
//     categories,
//     subCategories
//   }
// }

// function stripMarkdown(text = '') {
//   return text
//     .replace(/!\[[^\]]*]\([^)]+\)/g, '')
//     .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
//     .replace(/[#>*_~`-]/g, '')
//     .replace(/\r?\n|\r/g, ' ')
//     .replace(/\s{2,}/g, ' ')
//     .trim()
// }

// function BrandStructuredData({ brand, products }) {
//   const brandSlug = brand.slug || createBrandSlug(brand.name)
//   const description =
//     stripMarkdown(brand.description || brand.shortDescription || '') ||
//     DEFAULT_BRAND_DESCRIPTION

//   const brandJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Brand',
//     name: brand.name,
//     url: `${SITE_URL}/brands/${brandSlug}`,
//     description,
//     image: brand.logo || undefined,
//     logo: brand.logo || undefined
//   }

//   const productListJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: `${brand.name} Makeup Products`,
//     numberOfItems: products.length,
//     itemListElement: products.slice(0, 20).map((product, index) => ({
//       '@type': 'ListItem',
//       position: index + 1,
//       item: {
//         '@type': 'Product',
//         name: product.name,
//         brand: { '@type': 'Brand', name: product.brandName },
//         category: product.subCategoryName || product.categoryName,
//         offers: {
//           '@type': 'Offer',
//           priceCurrency: 'XAF',
//           price:
//             typeof product.sellingPrice === 'number'
//               ? String(product.sellingPrice)
//               : undefined,
//           availability: 'https://schema.org/InStock'
//         }
//       }
//     }))
//   }

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }}
//       />
//     </>
//   )
// }

// function BrandNavigation({ brands, currentSlug }) {
//   if (!brands.length) return null

//   return (
//     <div className="mb-8 bg-white rounded-lg shadow-md p-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop by Brand:</h3>
//       <div className="flex flex-wrap gap-2">
//         <Link
//           href="/brands"
//           className="px-4 py-2 rounded-full border transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
//         >
//           All Brands
//         </Link>
//         {brands.map((brand) => {
//           const slug = brand.slug || createBrandSlug(brand.name)
//           const isActive = slug === currentSlug
//           return (
//             <Link
//               key={brand._id || slug}
//               href={`/brands/${slug}`}
//               className={`px-4 py-2 rounded-full border transition-colors ${
//                 isActive
//                   ? 'bg-pink-500 text-white border-pink-500'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
//               }`}
//             >
//               {brand.name}
//             </Link>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// async function fetchBrandCollection() {
//   if (!API_BASE) return []
//   const payload = await fetchJson(
//     `${API_BASE}/api/brand/list?limit=200&sort=nameAsc&onlyActive=true`,
//     { cache: 'no-store' }
//   )

//   const items =
//     payload?.data?.items ||
//     payload?.data ||
//     payload?.brands ||
//     payload?.items ||
//     []

//   return Array.isArray(items) ? items : []
// }

// async function fetchBrandBySlug(slug) {
//   if (!API_BASE || !slug) return null

//   const directPayload = await fetchJson(
//     `${API_BASE}/api/brand/${encodeURIComponent(slug)}?includeProducts=true`,
//     { cache: 'no-store' }
//   )

//   const direct =
//     directPayload?.data ||
//     directPayload?.brand ||
//     directPayload

//   if (direct) return direct

//   const brands = await fetchBrandCollection()
//   const fallback = brands.find((brand) => {
//     const candidateSlug = brand.slug || createBrandSlug(brand.name || brand.title || '')
//     return candidateSlug === slug
//   })

//   return fallback || null
// }

// async function fetchProductsByBrand(brand) {
//   if (!API_BASE || !brand) return []

//   if (Array.isArray(brand.products) && brand.products.length) {
//     return brand.products
//   }

//   const filterPayload = brand._id
//     ? { brandId: brand._id, page: 1, limit: 500, onlyActive: true }
//     : { brandSlug: brand.slug || createBrandSlug(brand.name), page: 1, limit: 500 }

//   const payload = await fetchJson(`${API_BASE}/api/product/get`, {
//     cache: 'no-store',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(filterPayload)
//   })

//   const items =
//     payload?.data?.items ||
//     payload?.data?.products ||
//     payload?.data ||
//     payload?.items ||
//     []

//   return Array.isArray(items) ? items : []
// }

// const SummaryApi = {
//   getCategory: { url: '/api/category/get', method: 'get' },
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' }
// }

// async function getCategories() {
//   if (!API_BASE) return []
//   try {
//     const res = await fetch(`${API_BASE}${SummaryApi.getCategory.url}`, {
//       method: SummaryApi.getCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 300 }
//     })
//     if (!res.ok) throw new Error('Failed categories')
//     const data = await res.json()
//     return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
//   } catch {
//     return []
//   }
// }

// async function getSubCategories() {
//   if (!API_BASE) return []
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
//   } catch {
//     return []
//   }
// }

// export async function generateStaticParams() {
//   try {
//     const brands = await fetchBrandCollection()
//     return brands.map((brand) => ({
//       brand: brand.slug || createBrandSlug(brand.name || brand._id || '')
//     }))
//   } catch {
//     return []
//   }
// }

// export async function generateMetadata({ params }) {
//   const brandSlug = params?.brand
//   if (!brandSlug) {
//     return {
//       metadataBase: new URL(SITE_URL),
//       title: 'Brand not found',
//       description: 'This brand is not available in our store.',
//       robots: { index: false, follow: false }
//     }
//   }

//   try {
//     const brand = await fetchBrandBySlug(brandSlug)
//     if (!brand) {
//       return {
//         metadataBase: new URL(SITE_URL),
//         title: 'Brand not found',
//         description: 'This brand is not available in our store.',
//         robots: { index: false, follow: false }
//       }
//     }

//     const productsRaw = await fetchProductsByBrand(brand)
//     const productRows = productsRaw.map(normalizeProductRow)
//     const metrics = computeBrandMetrics(productRows)

//     const title = `${brand.name}`
//     const plainBrandDescription = stripMarkdown(
//       brand.description || brand.shortDescription || ''
//     )

//     const description = plainBrandDescription
//       ? `${plainBrandDescription} Shop authentic ${brand.name} makeup with FCFA prices. ${
//           metrics.totalProducts
//         } products available including ${
//           metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 5).join(', ')
//             : 'top-rated essentials'
//         }. Fast delivery in Douala & nationwide.`
//       : `Shop authentic ${brand.name} makeup with FCFA prices. ${
//           metrics.totalProducts
//         } products available including ${
//           metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 5).join(', ')
//             : 'top-rated essentials'
//         }. Fast delivery in Douala & nationwide.`

//     const canonical = `${SITE_URL}/brands/${brandSlug}`
//     const dynamicOgImage =
//       brand.ogImage ||
//       brand.banner ||
//       brand.coverImage ||
//       `${SITE_URL}/api/og/brand?slug=${encodeURIComponent(brandSlug)}`

//     return {
//       metadataBase: new URL(SITE_URL),
//       title,
//       description,
//       keywords: [
//         `${brand.name} makeup`,
//         `${brand.name} Cameroon`,
//         `${brand.name} price list`,
//         'authentic makeup',
//         'Douala makeup store',
//         ...metrics.subCategories.slice(0, 8).map((cat) => `${brand.name} ${cat}`),
//         ...metrics.categories.slice(0, 8).map((cat) => `${brand.name} ${cat} Cameroon`)
//       ],
//       robots: { index: true, follow: true },
//       alternates: { canonical },
//       openGraph: {
//         type: 'website',
//         siteName: SITE_NAME,
//         url: canonical,
//         title,
//         description,
//         images: [
//           {
//             url: dynamicOgImage,
//             width: 1200,
//             height: 630,
//             alt: `${brand.name} makeup products`
//           }
//         ],
//         locale: 'en_US'
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title,
//         description,
//         images: [dynamicOgImage]
//       }
//     }
//   } catch (error) {
//     console.error(`Metadata generation failed for brand ${brandSlug}:`, error)
//     return {
//       metadataBase: new URL(SITE_URL),
//       title: `${brandSlug} | Essentialist Makeup Store`,
//       description: DEFAULT_BRAND_DESCRIPTION,
//       robots: { index: false, follow: false },
//       openGraph: {
//         images: [
//           {
//             url: DEFAULT_OG_IMAGE,
//             width: 1200,
//             height: 630,
//             alt: 'Essentialist Makeup Store'
//           }
//         ]
//       },
//       twitter: {
//         card: 'summary_large_image',
//         images: [DEFAULT_OG_IMAGE]
//       }
//     }
//   }
// }

// export default async function BrandPage({ params }) {
//   const brandSlug = params?.brand
//   if (!brandSlug) return notFound()

//   const brandData = await fetchBrandBySlug(brandSlug)
//   if (!brandData) return notFound()

//   const [productsRaw, allBrands, allCategory, allSubCategory] = await Promise.all([
//     fetchProductsByBrand(brandData),
//     fetchBrandCollection(),
//     getCategories(),
//     getSubCategories()
//   ])

//   const productRows = productsRaw.map(normalizeProductRow)
//   const metrics = computeBrandMetrics(productRows)

//   const currentSlug = brandData.slug || createBrandSlug(brandData.name)
//   const brandForNavigation = allBrands.map((brand) => ({
//     ...brand,
//     slug: brand.slug || createBrandSlug(brand.name)
//   }))

//   const plainBrandDescription = stripMarkdown(
//     brandData.description || brandData.shortDescription || ''
//   )

//   return (
//     <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//       <BrandStructuredData brand={brandData} products={productRows} />

//       <header className="text-center mb-8">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
//           {brandData.name?.toUpperCase()} MAKEUP
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-700 font-semibold">
//           Authentic {brandData.name} Products in Cameroon
//         </p>

//         {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-pink-600">
//               {metrics.totalProducts.toLocaleString()}
//             </p>
//             <p className="text-sm text-gray-600">Products Available</p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-green-600">
//               {FCFA(metrics.avgSellingPrice)}
//             </p>
//             <p className="text-sm text-gray-600">Average Price</p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-blue-600">
//               {metrics.subCategories.length}
//             </p>
//             <p className="text-sm text-gray-600">Subcategories</p>
//           </div>
//         </div> */}

//         <p className="text-gray-600 text-sm mt-4 ">
//           Categories:{' '}
//           {metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 8).join(', ')
//             : 'Foundation, Lip makeup, Eye makeup'}
//           {metrics.subCategories.length > 8 ? '…' : ''}
//         </p>
//         {plainBrandDescription && (
//           <p className="text-gray-600 mt-4 text-sm max-w-3xl mx-auto ">{plainBrandDescription}</p>
//         )}
//       </header>

//       <BrandNavigation brands={brandForNavigation} currentSlug={currentSlug} />

//       <section
//         aria-labelledby="brand-products"
//         className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white"
//       >
//         <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
//           <h2 id="brand-products" className="text-xl font-bold">
//             Complete {brandData.name} Product Catalog
//           </h2>
//           <p className="text-pink-100 text-sm mt-1">
//             All {metrics.totalProducts} authentic {brandData.name} products with current
//             FCFA pricing
//           </p>
//         </div>

//         <table className="min-w-full text-sm md:text-base">
//           <thead>
//             <tr className="bg-pink-100 text-black">
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Product
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Category
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Bulk Price
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Selling Price
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {productRows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="py-6 px-4 text-center text-gray-500 italic bg-white"
//                 >
//                   No products listed yet for this brand.
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
//                     <td className="py-3 px-2 md:px-4 font-semibold text-gray-900">
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
//                     <td className="py-3 px-2 md:px-4">
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
//                     <td className="py-3 px-2 md:px-4 text-right font-bold text-green-600">
//                       {FCFA(row.bulkPrice)}
//                     </td>
//                     <td className="py-3 px-2 md:px-4 text-right font-bold text-pink-600">
//                       {FCFA(row.sellingPrice)}
//                     </td>
//                   </tr>
//                 )
//               })
//             )}
//           </tbody>
//         </table>
//       </section>

//       <section className="mt-8 max-w-3xl mx-auto text-center text-gray-700">
//         <p>
//           Looking for {brandData.name} in Douala? Compare FCFA prices and shop online with
//           nationwide delivery. Popular picks include primers, foundations, and setting
//           powders. Need help choosing a shade?{' '}
//           <a href="mailto:info@esmakeupstore.com" className="underline text-pink-600">
//             Email our team
//           </a>
//           .
//         </p>
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
//                 name: `Is ${brandData.name} available in stock?`,
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: `Yes, most ${brandData.name} items listed here are marked In stock and ship nationwide in Cameroon.`
//                 }
//               },
//               {
//                 '@type': 'Question',
//                 name: `How much is ${brandData.name} foundation in FCFA?`,
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: `Prices vary by shade and line. See the table for live FCFA pricing, or contact us for assistance.`
//                 }
//               }
//             ]
//           })
//         }}
//       />
//     </main>
//   )
// }









// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import { valideURLConvert } from '../../../utils/valideURLConvert'

// const SITE_URL = 'https://www.esmakeupstore.com'
// const SITE_NAME = 'Essentialist Makeup Store'
// const DEFAULT_OG_IMAGE =
//   'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
// const DEFAULT_BRAND_DESCRIPTION =
//   'Shop authentic makeup with FCFA pricing. Fast delivery in Douala & nationwide across Cameroon.'

// // export const dynamic = 'force-dynamic'

// async function fetchJson(url, init = {}) {
//   const res = await fetch(url, init)
//   if (res.status === 404) return null
//   if (!res.ok) {
//     const text = await res.text()
//     throw new Error(`Request failed ${res.status}: ${text}`)
//   }
//   return res.json()
// }

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
//   const fallbackName = typeof product?.name === 'string' ? product.name.trim() : ''
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

// function computeBrandMetrics(productRows) {
//   const totalProducts = productRows.length
//   const sellPrices = productRows
//     .map((row) => row.sellingPrice)
//     .filter((value) => typeof value === 'number')
//   const bulkPrices = productRows
//     .map((row) => row.bulkPrice)
//     .filter((value) => typeof value === 'number')

//   const avgSellingPrice = sellPrices.length
//     ? Math.round(sellPrices.reduce((sum, value) => sum + value, 0) / sellPrices.length)
//     : undefined

//   const avgBulkPrice = bulkPrices.length
//     ? Math.round(bulkPrices.reduce((sum, value) => sum + value, 0) / bulkPrices.length)
//     : undefined

//   const totalValue = sellPrices.reduce((sum, value) => sum + value, 0)

//   const categories = Array.from(
//     new Set(productRows.map((row) => row.categoryName).filter(Boolean))
//   ).sort()

//   const subCategories = Array.from(
//     new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
//   ).sort()

//   return {
//     totalProducts,
//     avgSellingPrice,
//     avgBulkPrice,
//     totalValue,
//     categories,
//     subCategories
//   }
// }

// function stripMarkdown(text = '') {
//   return text
//     .replace(/!\[[^\]]*]\([^)]+\)/g, '')
//     .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
//     .replace(/[#>*_~`-]/g, '')
//     .replace(/\r?\n|\r/g, ' ')
//     .replace(/\s{2,}/g, ' ')
//     .trim()
// }

// function BrandStructuredData({ brand, products }) {
//   const brandSlug = brand.slug || createBrandSlug(brand.name)
//   const description =
//     stripMarkdown(brand.description || brand.shortDescription || '') ||
//     DEFAULT_BRAND_DESCRIPTION

//   const brandJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Brand',
//     name: brand.name,
//     url: `${SITE_URL}/brands/${brandSlug}`,
//     description,
//     image: brand.logo || undefined,
//     logo: brand.logo || undefined
//   }

//   const productListJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: `${brand.name} Makeup Products`,
//     numberOfItems: products.length,
//     itemListElement: products.slice(0, 20).map((product, index) => ({
//       '@type': 'ListItem',
//       position: index + 1,
//       item: {
//         '@type': 'Product',
//         name: product.name,
//         brand: { '@type': 'Brand', name: product.brandName },
//         category: product.subCategoryName || product.categoryName,
//         offers: {
//           '@type': 'Offer',
//           priceCurrency: 'XAF',
//           price:
//             typeof product.sellingPrice === 'number'
//               ? String(product.sellingPrice)
//               : undefined,
//           availability: 'https://schema.org/InStock'
//         }
//       }
//     }))
//   }

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
//       />
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }}
//       />
//     </>
//   )
// }

// function BrandNavigation({ brands, currentSlug }) {
//   if (!brands.length) return null

//   return (
//     <div className="mb-8 bg-white rounded-lg shadow-md p-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop by Brand:</h3>
//       <div className="flex flex-wrap gap-2">
//         <Link
//           href="/brands"
//           className="px-4 py-2 rounded-full border transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
//         >
//           All Brands
//         </Link>
//         {brands.map((brand) => {
//           const slug = brand.slug || createBrandSlug(brand.name)
//           const isActive = slug === currentSlug
//           return (
//             <Link
//               key={brand._id || slug}
//               href={`/brands/${slug}`}
//               className={`px-4 py-2 rounded-full border transition-colors ${
//                 isActive
//                   ? 'bg-pink-500 text-white border-pink-500'
//                   : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
//               }`}
//             >
//               {brand.name}
//             </Link>
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// async function fetchBrandCollection() {
//   if (!API_BASE) return []
//   const payload = await fetchJson(
//     `${API_BASE}/api/brand/list?limit=200&sort=nameAsc&onlyActive=true`,
//     { cache: 'no-store' }
//   )

//   const items =
//     payload?.data?.items ||
//     payload?.data ||
//     payload?.brands ||
//     payload?.items ||
//     []

//   return Array.isArray(items) ? items : []
// }

// async function fetchBrandBySlug(slug) {
//   if (!API_BASE || !slug) return null

//   const directPayload = await fetchJson(
//     `${API_BASE}/api/brand/${encodeURIComponent(slug)}?includeProducts=true`,
//     { cache: 'no-store' }
//   )

//   const direct =
//     directPayload?.data ||
//     directPayload?.brand ||
//     directPayload

//   if (direct) return direct

//   const brands = await fetchBrandCollection()
//   const fallback = brands.find((brand) => {
//     const candidateSlug = brand.slug || createBrandSlug(brand.name || brand.title || '')
//     return candidateSlug === slug
//   })

//   return fallback || null
// }

// async function fetchProductsByBrand(brand) {
//   if (!API_BASE || !brand) return []

//   if (Array.isArray(brand.products) && brand.products.length) {
//     return brand.products
//   }

//   const filterPayload = brand._id
//     ? { brandId: brand._id, page: 1, limit: 500, onlyActive: true }
//     : { brandSlug: brand.slug || createBrandSlug(brand.name), page: 1, limit: 500 }

//   const payload = await fetchJson(`${API_BASE}/api/product/get`, {
//     cache: 'no-store',
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(filterPayload)
//   })

//   const items =
//     payload?.data?.items ||
//     payload?.data?.products ||
//     payload?.data ||
//     payload?.items ||
//     []

//   return Array.isArray(items) ? items : []
// }

// const SummaryApi = {
//   getCategory: { url: '/api/category/get', method: 'get' },
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' }
// }

// async function getCategories() {
//   if (!API_BASE) return []
//   try {
//     const res = await fetch(`${API_BASE}${SummaryApi.getCategory.url}`, {
//       method: SummaryApi.getCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 300 }
//     })
//     if (!res.ok) throw new Error('Failed categories')
//     const data = await res.json()
//     return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
//   } catch {
//     return []
//   }
// }

// async function getSubCategories() {
//   if (!API_BASE) return []
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
//   } catch {
//     return []
//   }
// }

// export async function generateStaticParams() {
//   try {
//     const brands = await fetchBrandCollection()
//     return brands.map((brand) => ({
//       brand: brand.slug || createBrandSlug(brand.name || brand._id || '')
//     }))
//   } catch {
//     return []
//   }
// }

// export async function generateMetadata({ params }) {
//   const resolvedParams = await params
//   const brandSlug = resolvedParams?.brand
//   if (!brandSlug) {
//     return {
//       metadataBase: new URL(SITE_URL),
//       title: 'Brand not found',
//       description: 'This brand is not available in our store.',
//       robots: { index: false, follow: false }
//     }
//   }

//   try {
//     const brand = await fetchBrandBySlug(brandSlug)
//     if (!brand) {
//       return {
//         metadataBase: new URL(SITE_URL),
//         title: 'Brand not found',
//         description: 'This brand is not available in our store.',
//         robots: { index: false, follow: false }
//       }
//     }

//     const productsRaw = await fetchProductsByBrand(brand)
//     const productRows = productsRaw.map(normalizeProductRow)
//     const metrics = computeBrandMetrics(productRows)

//     const title = `${brand.name}`
//     const plainBrandDescription = stripMarkdown(
//       brand.description || brand.shortDescription || ''
//     )

//     const description = plainBrandDescription
//       ? `${plainBrandDescription} Shop authentic ${brand.name} makeup with FCFA prices. ${
//           metrics.totalProducts
//         } products available including ${
//           metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 5).join(', ')
//             : 'top-rated essentials'
//         }. Fast delivery in Douala & nationwide.`
//       : `Shop authentic ${brand.name} makeup with FCFA prices. ${
//           metrics.totalProducts
//         } products available including ${
//           metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 5).join(', ')
//             : 'top-rated essentials'
//         }. Fast delivery in Douala & nationwide.`

//     const canonical = `${SITE_URL}/brands/${brandSlug}`
//     const dynamicOgImage =
//       brand.ogImage ||
//       brand.banner ||
//       brand.coverImage ||
//       `${SITE_URL}/api/og/brand?slug=${encodeURIComponent(brandSlug)}`

//     return {
//       metadataBase: new URL(SITE_URL),
//       title,
//       description,
//       keywords: [
//         `${brand.name} makeup`,
//         `${brand.name} Cameroon`,
//         `${brand.name} price list`,
//         'authentic makeup',
//         'Douala makeup store',
//         ...metrics.subCategories.slice(0, 8).map((cat) => `${brand.name} ${cat}`),
//         ...metrics.categories.slice(0, 8).map((cat) => `${brand.name} ${cat} Cameroon`)
//       ],
//       robots: { index: true, follow: true },
//       alternates: { canonical },
//       openGraph: {
//         type: 'website',
//         siteName: SITE_NAME,
//         url: canonical,
//         title,
//         description,
//         images: [
//           {
//             url: dynamicOgImage,
//             width: 1200,
//             height: 630,
//             alt: `${brand.name} makeup products`
//           }
//         ],
//         locale: 'en_US'
//       },
//       twitter: {
//         card: 'summary_large_image',
//         title,
//         description,
//         images: [dynamicOgImage]
//       }
//     }
//   } catch (error) {
//     console.error(`Metadata generation failed for brand ${brandSlug}:`, error)
//     return {
//       metadataBase: new URL(SITE_URL),
//       title: `${brandSlug} | Essentialist Makeup Store`,
//       description: DEFAULT_BRAND_DESCRIPTION,
//       robots: { index: false, follow: false },
//       openGraph: {
//         images: [
//           {
//             url: DEFAULT_OG_IMAGE,
//             width: 1200,
//             height: 630,
//             alt: 'Essentialist Makeup Store'
//           }
//         ]
//       },
//       twitter: {
//         card: 'summary_large_image',
//         images: [DEFAULT_OG_IMAGE]
//       }
//     }
//   }
// }

// export default async function BrandPage({ params }) {
//   const resolvedParams = await params
//   const brandSlug = resolvedParams?.brand
//   if (!brandSlug) return notFound()

//   const brandData = await fetchBrandBySlug(brandSlug)
//   if (!brandData) return notFound()

//   const [productsRaw, allBrands, allCategory, allSubCategory] = await Promise.all([
//     fetchProductsByBrand(brandData),
//     fetchBrandCollection(),
//     getCategories(),
//     getSubCategories()
//   ])

//   const productRows = productsRaw.map(normalizeProductRow)
//   const metrics = computeBrandMetrics(productRows)

//   const currentSlug = brandData.slug || createBrandSlug(brandData.name)
//   const brandForNavigation = allBrands.map((brand) => ({
//     ...brand,
//     slug: brand.slug || createBrandSlug(brand.name)
//   }))

//   const plainBrandDescription = stripMarkdown(
//     brandData.description || brandData.shortDescription || ''
//   )

//   return (
//     <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//       <BrandStructuredData brand={brandData} products={productRows} />

//       <header className="text-center mb-8">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
//           {brandData.name?.toUpperCase()} MAKEUP
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-700 font-semibold">
//           Authentic {brandData.name} Products in Cameroon
//         </p>

//         <p className="text-gray-600 text-sm mt-4 ">
//           Categories:{' '}
//           {metrics.subCategories.length
//             ? metrics.subCategories.slice(0, 8).join(', ')
//             : 'Foundation, Lip makeup, Eye makeup'}
//           {metrics.subCategories.length > 8 ? '…' : ''}
//         </p>
//         {plainBrandDescription && (
//           <p className="text-gray-600 mt-4 text-sm max-w-3xl mx-auto ">{plainBrandDescription}</p>
//         )}
//       </header>

//       <BrandNavigation brands={brandForNavigation} currentSlug={currentSlug} />

//       <section
//         aria-labelledby="brand-products"
//         className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white"
//       >
//         <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
//           <h2 id="brand-products" className="text-xl font-bold">
//             Complete {brandData.name} Product Catalog
//           </h2>
//           <p className="text-pink-100 text-sm mt-1">
//             All {metrics.totalProducts} authentic {brandData.name} products with current
//             FCFA pricing
//           </p>
//         </div>

//         <table className="min-w-full text-sm md:text-base">
//           <thead>
//             <tr className="bg-pink-100 text-black">
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Product
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
//                 Category
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Bulk Price
//               </th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
//                 Selling Price
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {productRows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={4}
//                   className="py-6 px-4 text-center text-gray-500 italic bg-white"
//                 >
//                   No products listed yet for this brand.
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
//                     <td className="py-3 px-2 md:px-4 font-semibold text-gray-900">
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
//                     <td className="py-3 px-2 md:px-4">
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
//                     <td className="py-3 px-2 md:px-4 text-right font-bold text-green-600">
//                       {FCFA(row.bulkPrice)}
//                     </td>
//                     <td className="py-3 px-2 md:px-4 text-right font-bold text-pink-600">
//                       {FCFA(row.sellingPrice)}
//                     </td>
//                   </tr>
//                 )
//               })
//             )}
//           </tbody>
//         </table>
//       </section>

//       <section className="mt-8 max-w-3xl mx-auto text-center text-gray-700">
//         <p>
//           Looking for {brandData.name} in Douala? Compare FCFA prices and shop online with
//           nationwide delivery. Popular picks include primers, foundations, and setting
//           powders. Need help choosing a shade?{' '}
//           <a href="mailto:info@esmakeupstore.com" className="underline text-pink-600">
//             Email our team
//           </a>
//           .
//         </p>
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
//                 name: `Is ${brandData.name} available in stock?`,
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: `Yes, most ${brandData.name} items listed here are marked In stock and ship nationwide in Cameroon.`
//                 }
//               },
//               {
//                 '@type': 'Question',
//                 name: `How much is ${brandData.name} foundation in FCFA?`,
//                 acceptedAnswer: {
//                   '@type': 'Answer',
//                   text: `Prices vary by shade and line. See the table for live FCFA pricing, or contact us for assistance.`
//                 }
//               }
//             ]
//           })
//         }}
//       />
//     </main>
//   )
// }






import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { valideURLConvert } from '../../../utils/valideURLConvert'

const SITE_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'
const DEFAULT_OG_IMAGE =
  'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'
const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
const DEFAULT_BRAND_DESCRIPTION =
  'Shop authentic makeup with FCFA pricing. Fast delivery in Douala & nationwide across Cameroon.'
const FALLBACK_BRAND_SLUG = '__placeholder__'

async function fetchJson(url, init = {}) {
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
    console.warn('[brand page] fetchJson failed', { url, error })
    return null
  }
}

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
  const fallbackName = typeof product?.name === 'string' ? product.name.trim() : ''
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

function FCFA(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'
  return `${amount.toLocaleString('en-US')} FCFA`
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

function getSubCatInfo(allSubCategory, row) {
  if (!Array.isArray(allSubCategory)) return null

  if (row.subCategoryId) {
    const foundById = allSubCategory.find((sub) => {
      const subId = typeof sub?._id === 'string' ? sub._id : ''
      return subId === row.subCategoryId
    })
    if (foundById) return foundById
  }

  if (row.subCategoryName) {
    const foundByName = allSubCategory.find(
      (sub) =>
        sub?.name?.trim()?.toLowerCase() === row.subCategoryName.trim().toLowerCase()
    )
    if (foundByName) return foundByName
  }

  return null
}

function getCategoryLinkMeta(allCategory, allSubCategory, row) {
  const subCat = getSubCatInfo(allSubCategory, row)
  if (!subCat) return null

  let mainCat = null

  if (Array.isArray(subCat.category) && subCat.category.length) {
    mainCat = Array.isArray(allCategory)
      ? allCategory.find(
          (cat) =>
            cat?._id === subCat.category[0]?._id || cat?._id === subCat.category[0]
        )
      : null
  }

  if (!mainCat && row.categoryId) {
    mainCat = Array.isArray(allCategory)
      ? allCategory.find((cat) => cat?._id === row.categoryId)
      : null
  }

  if (!mainCat && row.categoryName) {
    mainCat = Array.isArray(allCategory)
      ? allCategory.find(
          (cat) =>
            cat?.name?.trim()?.toLowerCase() === row.categoryName.trim().toLowerCase()
        )
      : null
  }

  if (!mainCat) return null
  return { mainCat, subCat }
}

function buildSubCatUrl(mainCat, subCat) {
  if (!mainCat?._id || !subCat?._id) return '#'
  return `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(
    subCat.name
  )}-${subCat._id}`
}

function computeBrandMetrics(productRows) {
  const totalProducts = productRows.length
  const sellPrices = productRows
    .map((row) => row.sellingPrice)
    .filter((value) => typeof value === 'number')
  const bulkPrices = productRows
    .map((row) => row.bulkPrice)
    .filter((value) => typeof value === 'number')

  const avgSellingPrice = sellPrices.length
    ? Math.round(sellPrices.reduce((sum, value) => sum + value, 0) / sellPrices.length)
    : undefined

  const avgBulkPrice = bulkPrices.length
    ? Math.round(bulkPrices.reduce((sum, value) => sum + value, 0) / bulkPrices.length)
    : undefined

  const totalValue = sellPrices.reduce((sum, value) => sum + value, 0)

  const categories = Array.from(
    new Set(productRows.map((row) => row.categoryName).filter(Boolean))
  ).sort()

  const subCategories = Array.from(
    new Set(productRows.map((row) => row.subCategoryName).filter(Boolean))
  ).sort()

  return {
    totalProducts,
    avgSellingPrice,
    avgBulkPrice,
    totalValue,
    categories,
    subCategories
  }
}

function stripMarkdown(text = '') {
  return text
    .replace(/!\[[^\]]*]\([^)]+\)/g, '')
    .replace(/\[([^\]]+)]\([^)]+\)/g, '$1')
    .replace(/[#>*_~`-]/g, '')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

function BrandStructuredData({ brand, products }) {
  const brandSlug = brand.slug || createBrandSlug(brand.name)
  const description =
    stripMarkdown(brand.description || brand.shortDescription || '') ||
    DEFAULT_BRAND_DESCRIPTION

  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    url: `${SITE_URL}/brands/${brandSlug}`,
    description,
    image: brand.logo || undefined,
    logo: brand.logo || undefined
  }

  const productListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brand.name} Makeup Products`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        brand: { '@type': 'Brand', name: product.brandName },
        category: product.subCategoryName || product.categoryName,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'XAF',
          price:
            typeof product.sellingPrice === 'number'
              ? String(product.sellingPrice)
              : undefined,
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }}
      />
    </>
  )
}

function BrandNavigation({ brands, currentSlug }) {
  if (!brands.length) return null

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Shop by Brand:</h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/brands"
          className="px-4 py-2 rounded-full border transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
        >
          All Brands
        </Link>
        {brands.map((brand) => {
          const slug = brand.slug || createBrandSlug(brand.name)
          const isActive = slug === currentSlug
          return (
            <Link
              key={brand._id || slug}
              href={`/brands/${slug}`}
              className={`px-4 py-2 rounded-full border transition-colors ${
                isActive
                  ? 'bg-pink-500 text-white border-pink-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
              }`}
            >
              {brand.name}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

async function fetchBrandCollection() {
  if (!API_BASE) return []

  const payload = await fetchJson(
    `${API_BASE}/api/brand/list?limit=200&sort=nameAsc&onlyActive=true`,
    { cache: 'no-store' }
  )

  const items =
    payload?.data?.items ||
    payload?.data ||
    payload?.brands ||
    payload?.items ||
    []

  return Array.isArray(items) ? items : []
}

async function fetchBrandBySlug(slug) {
  if (!API_BASE || !slug || slug === FALLBACK_BRAND_SLUG) return null

  const directPayload = await fetchJson(
    `${API_BASE}/api/brand/${encodeURIComponent(slug)}?includeProducts=true`,
    { cache: 'no-store' }
  )

  const direct =
    directPayload?.data ||
    directPayload?.brand ||
    directPayload

  if (direct) return direct

  const brands = await fetchBrandCollection()
  const fallback = brands.find((brand) => {
    const candidateSlug = brand.slug || createBrandSlug(brand.name || brand.title || '')
    return candidateSlug === slug
  })

  return fallback || null
}

async function fetchProductsByBrand(brand) {
  if (!API_BASE || !brand) return []

  if (Array.isArray(brand.products) && brand.products.length) {
    return brand.products
  }

  const filterPayload = brand._id
    ? { brandId: brand._id, page: 1, limit: 500, onlyActive: true }
    : { brandSlug: brand.slug || createBrandSlug(brand.name), page: 1, limit: 500 }

  const payload = await fetchJson(`${API_BASE}/api/product/get`, {
    cache: 'no-store',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filterPayload)
  })

  const items =
    payload?.data?.items ||
    payload?.data?.products ||
    payload?.data ||
    payload?.items ||
    []

  return Array.isArray(items) ? items : []
}

const SummaryApi = {
  getCategory: { url: '/api/category/get', method: 'get' },
  getSubCategory: { url: '/api/subcategory/get', method: 'post' }
}

async function getCategories() {
  if (!API_BASE) return []
  try {
    const res = await fetch(`${API_BASE}${SummaryApi.getCategory.url}`, {
      method: SummaryApi.getCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 }
    })
    if (!res.ok) throw new Error('Failed categories')
    const data = await res.json()
    return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  } catch (error) {
    console.warn('[brand page] getCategories failed', error)
    return []
  }
}

async function getSubCategories() {
  if (!API_BASE) return []
  try {
    const res = await fetch(`${API_BASE}${SummaryApi.getSubCategory.url}`, {
      method: SummaryApi.getSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      next: { revalidate: 300 }
    })
    if (!res.ok) throw new Error('Failed subcategories')
    const data = await res.json()
    return Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []
  } catch (error) {
    console.warn('[brand page] getSubCategories failed', error)
    return []
  }
}

export async function generateStaticParams() {
  try {
    const brands = await fetchBrandCollection()
    const slugs = brands
      .map((brand) => brand.slug || createBrandSlug(brand.name || brand._id || ''))
      .filter(Boolean)

    if (slugs.length) {
      return slugs.slice(0, 50).map((slug) => ({ brand: slug }))
    }

    console.warn('generateStaticParams: no brand slugs found, returning placeholder.')
  } catch (error) {
    console.warn('generateStaticParams failed, returning placeholder.', error)
  }

  return [{ brand: FALLBACK_BRAND_SLUG }]
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const brandSlug = resolvedParams?.brand

  if (!brandSlug || brandSlug === FALLBACK_BRAND_SLUG) {
    return {
      metadataBase: new URL(SITE_URL),
      title: 'Brand not available',
      description: 'This brand is not available in our store.',
      robots: { index: false, follow: false }
    }
  }

  try {
    const brand = await fetchBrandBySlug(brandSlug)
    if (!brand) {
      return {
        metadataBase: new URL(SITE_URL),
        title: 'Brand not found',
        description: 'This brand is not available in our store.',
        robots: { index: false, follow: false }
      }
    }

    const productsRaw = await fetchProductsByBrand(brand)
    const productRows = productsRaw.map(normalizeProductRow)
    const metrics = computeBrandMetrics(productRows)

    const title = `${brand.name}`
    const plainBrandDescription = stripMarkdown(
      brand.description || brand.shortDescription || ''
    )

    const description = plainBrandDescription
      ? `${plainBrandDescription} Shop authentic ${brand.name} makeup with FCFA prices. ${
          metrics.totalProducts
        } products available including ${
          metrics.subCategories.length
            ? metrics.subCategories.slice(0, 5).join(', ')
            : 'top-rated essentials'
        }. Fast delivery in Douala & nationwide.`
      : `Shop authentic ${brand.name} makeup with FCFA prices. ${
          metrics.totalProducts
        } products available including ${
          metrics.subCategories.length
            ? metrics.subCategories.slice(0, 5).join(', ')
            : 'top-rated essentials'
        }. Fast delivery in Douala & nationwide.`

    const canonical = `${SITE_URL}/brands/${brandSlug}`
    const dynamicOgImage =
      brand.ogImage ||
      brand.banner ||
      brand.coverImage ||
      `${SITE_URL}/api/og/brand?slug=${encodeURIComponent(brandSlug)}`

    return {
      metadataBase: new URL(SITE_URL),
      title,
      description,
      keywords: [
        `${brand.name} makeup`,
        `${brand.name} Cameroon`,
        `${brand.name} price list`,
        'authentic makeup',
        'Douala makeup store',
        ...metrics.subCategories.slice(0, 8).map((cat) => `${brand.name} ${cat}`),
        ...metrics.categories.slice(0, 8).map((cat) => `${brand.name} ${cat} Cameroon`)
      ],
      robots: { index: true, follow: true },
      alternates: { canonical },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: canonical,
        title,
        description,
        images: [
          {
            url: dynamicOgImage,
            width: 1200,
            height: 630,
            alt: `${brand.name} makeup products`
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [dynamicOgImage]
      }
    }
  } catch (error) {
    console.error(`Metadata generation failed for brand ${brandSlug}:`, error)
    return {
      metadataBase: new URL(SITE_URL),
      title: `${brandSlug} | Essentialist Makeup Store`,
      description: DEFAULT_BRAND_DESCRIPTION,
      robots: { index: false, follow: false },
      openGraph: {
        images: [
          {
            url: DEFAULT_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Essentialist Makeup Store'
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        images: [DEFAULT_OG_IMAGE]
      }
    }
  }
}

export default function BrandPage({ params }) {
  const brandSlugPromise = Promise.resolve(params).then((resolved) => resolved?.brand)

  return (
    <Suspense fallback={<BrandPageSkeleton />}>
      <BrandContent brandSlugPromise={brandSlugPromise} />
    </Suspense>
  )
}

async function BrandContent({ brandSlugPromise }) {
  const brandSlug = (await brandSlugPromise) || ''

  if (!brandSlug || brandSlug === FALLBACK_BRAND_SLUG) {
    return notFound()
  }

  const brandData = await fetchBrandBySlug(brandSlug)

  if (!brandData) {
    return notFound()
  }

  const [productsRaw, allBrands, allCategory, allSubCategory] = await Promise.all([
    fetchProductsByBrand(brandData),
    fetchBrandCollection(),
    getCategories(),
    getSubCategories()
  ])

  const productRows = productsRaw.map(normalizeProductRow)
  const metrics = computeBrandMetrics(productRows)

  const currentSlug = brandData.slug || createBrandSlug(brandData.name)
  const brandForNavigation = allBrands.map((brand) => ({
    ...brand,
    slug: brand.slug || createBrandSlug(brand.name)
  }))

  const plainBrandDescription = stripMarkdown(
    brandData.description || brandData.shortDescription || ''
  )

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <BrandStructuredData brand={brandData} products={productRows} />

      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
          {brandData.name?.toUpperCase()} MAKEUP
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 font-semibold">
          Authentic {brandData.name} Products in Cameroon
        </p>

        <p className="text-gray-600 text-sm mt-4 ">
          Categories:{' '}
          {metrics.subCategories.length
            ? metrics.subCategories.slice(0, 8).join(', ')
            : 'Foundation, Lip makeup, Eye makeup'}
          {metrics.subCategories.length > 8 ? '…' : ''}
        </p>
        {plainBrandDescription && (
          <p className="text-gray-600 mt-4 text-sm max-w-3xl mx-auto ">
            {plainBrandDescription}
          </p>
        )}
      </header>

      <BrandNavigation brands={brandForNavigation} currentSlug={currentSlug} />

      <section
        aria-labelledby="brand-products"
        className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white"
      >
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
          <h2 id="brand-products" className="text-xl font-bold">
            Complete {brandData.name} Product Catalog
          </h2>
          <p className="text-pink-100 text-sm mt-1">
            All {metrics.totalProducts} authentic {brandData.name} products with current
            FCFA pricing
          </p>
        </div>

        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-pink-100 text-black">
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
                Product
              </th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">
                Category
              </th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
                Bulk Price
              </th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">
                Selling Price
              </th>
            </tr>
          </thead>
          <tbody>
            {productRows.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 px-4 text-center text-gray-500 italic bg-white"
                >
                  No products listed yet for this brand.
                </td>
              </tr>
            ) : (
              productRows.map((row, index) => {
                const linkMeta = getCategoryLinkMeta(
                  allCategory,
                  allSubCategory,
                  row
                )
                const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-pink-50'

                return (
                  <tr key={row.id || `${row.name}-${index}`} className={rowClass}>
                    <td className="py-3 px-2 md:px-4 font-semibold text-gray-900">
                      {row.productSlug ? (
                        <Link
                          href={`/product/${row.productSlug}`}
                          className="text-gray-900 hover:text-pink-600 underline decoration-pink-300 decoration-2 underline-offset-2 transition-colors font-medium"
                          aria-label={`View ${row.name}`}
                        >
                          {row.name}
                        </Link>
                      ) : (
                        <span>{row.name}</span>
                      )}
                    </td>
                    <td className="py-3 px-2 md:px-4">
                      {linkMeta ? (
                        <Link
                          href={buildSubCatUrl(linkMeta.mainCat, linkMeta.subCat)}
                          className="underline text-blue-700 hover:text-pink-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
                          aria-label={`Browse ${row.subCategoryName} in ${linkMeta.mainCat?.name}`}
                        >
                          {row.subCategoryName || row.categoryName || 'View'}
                        </Link>
                      ) : (
                        <span className="text-gray-500">
                          {row.subCategoryName || row.categoryName || '—'}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-right font-bold text-green-600">
                      {FCFA(row.bulkPrice)}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-right font-bold text-pink-600">
                      {FCFA(row.sellingPrice)}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </section>

      <section className="mt-8 max-w-3xl mx-auto text-center text-gray-700">
        <p>
          Looking for {brandData.name} in Douala? Compare FCFA prices and shop online with
          nationwide delivery. Popular picks include primers, foundations, and setting
          powders. Need help choosing a shade?{' '}
          <a href="mailto:info@esmakeupstore.com" className="underline text-pink-600">
            Email our team
          </a>
          .
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Is ${brandData.name} available in stock?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes, most ${brandData.name} items listed here are marked In stock and ship nationwide in Cameroon.`
                }
              },
              {
                '@type': 'Question',
                name: `How much is ${brandData.name} foundation in FCFA?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Prices vary by shade and line. See the table for live FCFA pricing, or contact us for assistance.`
                }
              }
            ]
          })
        }}
      />
    </main>
  )
}

function BrandPageSkeleton() {
  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10 animate-pulse">
      <header className="text-center mb-8 space-y-4">
        <div className="mx-auto h-10 w-3/4 max-w-2xl rounded-full bg-pink-200" />
        <div className="mx-auto h-6 w-1/2 max-w-xl rounded-full bg-pink-100" />
        <div className="mx-auto h-4 w-3/4 max-w-xl rounded-full bg-pink-100" />
      </header>

      <section className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="h-6 w-40 bg-pink-100 rounded mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-10 w-28 rounded-full bg-gray-100"
            />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-pink-200 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
          <div className="h-5 w-48 bg-pink-300/50 rounded mb-2" />
          <div className="h-4 w-64 bg-pink-300/40 rounded" />
        </div>

        <div className="divide-y divide-pink-100">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`grid grid-cols-4 gap-4 px-4 py-5 ${
                index % 2 === 0 ? 'bg-white' : 'bg-pink-50/60'
              }`}
            >
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}