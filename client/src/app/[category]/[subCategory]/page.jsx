// // src/app/[category]/[subCategory]/page.jsx
// import Link from 'next/link'
// import Image from 'next/image'
// import { notFound } from 'next/navigation'
// import CardProduct from '../../../components/CardProduct'
// import Loading from '../../../components/Loading' // kept referenced in case you wrap with Suspense
// import { valideURLConvert } from '../../../utils/valideURLConvert'

// // ---------- API config ----------
// const baseURL = process.env.NEXT_PUBLIC_API_URL
// const PAGE_SIZE = 8

// const SummaryApi = {
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' },
//   getProductByCategoryAndSubCategory: {
//     url: '/api/product/get-pruduct-by-category-and-subcategory',
//     method: 'post',
//   },
//   getCategory: { url: '/api/category/get', method: 'get' },
// }

// // ---------- Helpers ----------
// function parseIdFromSlug(slug) {
//   if (!slug) return null
//   const parts = String(slug).split('-')
//   return parts[parts.length - 1]
// }
// function parseNameFromSlug(slug) {
//   if (!slug) return ''
//   const parts = String(slug).split('-')
//   return parts.slice(0, parts.length - 1).join(' ')
// }
// function safeArray(v) {
//   return Array.isArray(v) ? v : []
// }

// // Strip HTML for meta descriptions
// function stripHtml(html) {
//   if (!html) return ''
//   return html.replace(/<[^>]*>?/gm, '').trim()
// }

// // Server fetchers (SSR)
// async function fetchSubCategories() {
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
//       method: SummaryApi.getSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({}),
//       next: { revalidate: 300 },
//     })
//     if (!res.ok) throw new Error('Failed to fetch subcategories')
//     const data = await res.json()
//     return safeArray(data?.data || data)
//   } catch (e) {
//     console.error('fetchSubCategories error:', e)
//     return []
//   }
// }

// async function fetchProductsByCatSub({ categoryId, subCategoryId, page = 1 }) {
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getProductByCategoryAndSubCategory.url}`, {
//       method: SummaryApi.getProductByCategoryAndSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         categoryId,
//         subCategoryId,
//         page,
//         limit: PAGE_SIZE,
//       }),
//       next: { revalidate: 120 },
//     })
//     if (!res.ok) throw new Error('Failed to fetch products')
//     const json = await res.json()
//     if (!json?.success) return { products: [], totalCount: 0 }
//     return { products: safeArray(json.data), totalCount: Number(json.totalCount || 0) }
//   } catch (e) {
//     console.error('fetchProductsByCatSub error:', e)
//     return { products: [], totalCount: 0 }
//   }
// }

// async function fetchCategories() {
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
//       method: SummaryApi.getCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 300 },
//     })
//     if (!res.ok) throw new Error('Failed to fetch categories')
//     const data = await res.json()
//     return safeArray(data?.data || data)
//   } catch (e) {
//     console.error('fetchCategories error:', e)
//     return []
//   }
// }

// // ---------- Dynamic SEO ----------
// export async function generateMetadata({ params, searchParams }) {
//   const categorySlug = params?.category
//   const subCategorySlug = params?.subCategory
//   const page = Number(searchParams?.page || 1)

//   const categoryId = parseIdFromSlug(categorySlug)
//   const subCategoryId = parseIdFromSlug(subCategorySlug)
//   const categoryName = parseNameFromSlug(categorySlug)
//   const subCategoryName = parseNameFromSlug(subCategorySlug)

//   if (!categoryId || !subCategoryId) {
//     return {
//       title: 'Products',
//       description: 'Explore our curated selection of makeup and beauty products.',
//       robots: { index: false, follow: true },
//     }
//   }

//   // Fetch some data for better SEO text
//   const [{ products, totalCount }] = await Promise.all([
//     fetchProductsByCatSub({ categoryId, subCategoryId, page }),
//   ])

//   const titleBase = subCategoryName || 'Products'
//   const paginationSuffix = page > 1 ? ` | Page ${page}` : ''
//   // const title = `${titleBase} - ${categoryName} | EssentialisMakeupStore${paginationSuffix}`
//   const title = `Best ${titleBase} Makeup ${paginationSuffix}`

//   const desc =
//     products?.length
//       ? `Shop ${subCategoryName} in ${categoryName}. Discover ${products.length} of ${totalCount} products available.`
//       : `Browse ${subCategoryName} in ${categoryName} at EssentialisMakeupStore.`

//   const canonical = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}${page > 1 ? `?page=${page}` : ''}`

//   const ogImage =
//     products?.[0]?.image?.[0] ||
//     products?.[0]?.image ||
//     'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

//   return {
//     metadataBase: new URL('https://www.esmakeupstore.com'),
//     title,
//     description: stripHtml(desc).slice(0, 300),
//     alternates: { canonical },
//     keywords: [
//       subCategoryName,
//       categoryName,
//       'makeup',
//       'cosmetics',
//       'beauty',
//       'Cameroon makeup',
//       'Douala beauty',
//       'EssentialisMakeupStore',
//     ],
//     robots: { index: true, follow: true },
//     openGraph: {
//       type: 'website',
//       siteName: 'EssentialisMakeupStore',
//       url: canonical,
//       title,
//       description: stripHtml(desc).slice(0, 300),
//       images: [{ url: ogImage, width: 1200, height: 630, alt: titleBase }],
//       locale: 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description: stripHtml(desc).slice(0, 300),
//       images: [ogImage],
//     },
//   }
// }

// // ---------- Schema.org JSON-LD ----------
// function StructuredData({ categorySlug, subCategorySlug, subCategoryName }) {
//   const url = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}`

//   const breadcrumbJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' },
//       { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.esmakeupstore.com/product' },
//       { '@type': 'ListItem', position: 3, name: subCategoryName, item: url },
//     ],
//   }

//   const collectionJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: `${subCategoryName} - EssentialisMakeupStore`,
//     url,
//     isPartOf: {
//       '@type': 'WebSite',
//       name: 'EssentialisMakeupStore',
//       url: 'https://www.esmakeupstore.com/',
//     },
//   }

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
//     </>
//   )
// }

// // ---------- Page (SSR) ----------
// export default async function ProductListPage({ params, searchParams }) {
//   const categorySlug = params?.category
//   const subCategorySlug = params?.subCategory
//   const page = Number(searchParams?.page || 1)

//   const categoryId = parseIdFromSlug(categorySlug)
//   const subCategoryId = parseIdFromSlug(subCategorySlug)
//   const subCategoryName = parseNameFromSlug(subCategorySlug)
//   const categoryName = parseNameFromSlug(categorySlug)

//   if (!categoryId || !subCategoryId) return notFound()

//   // Fetch data in parallel
//   const [allSubCategories, { products, totalCount }] = await Promise.all([
//     fetchSubCategories(),
//     fetchProductsByCatSub({ categoryId, subCategoryId, page }),
//   ])

//   // Build subcategory list for this category
//   const displaySubCategory = safeArray(
//     allSubCategories.filter((s) => safeArray(s?.category).some((c) => c?._id === categoryId))
//   )

//   const totalPages = Math.max(1, Math.ceil((Number(totalCount) || 0) / PAGE_SIZE))
//   const hasMore = page < totalPages

//   // Build next page link
//   const basePath = `/${categorySlug}/${subCategorySlug}`
//   const nextHref = hasMore ? `${basePath}?page=${page + 1}` : null

//   return (
//     <>
//       <StructuredData
//         categorySlug={categorySlug}
//         subCategorySlug={subCategorySlug}
//         subCategoryName={subCategoryName}
//       />

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//           .scrollbarCustom {
//             scrollbar-width: thin;
//             scrollbar-color: #cbd5e1 transparent;
//           }
//           .scrollbarCustom::-webkit-scrollbar { height: 8px; width: 8px; }
//           .scrollbarCustom::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
//           .scrollbarCustom::-webkit-scrollbar-track { background: transparent; }
//         `,
//         }}
//       />

//       <main className="sticky top-24 lg:top-20">
//         <section className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
//           <aside className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2" aria-label="Subcategories">
//             {displaySubCategory.length > 0 ? (
//               displaySubCategory.map((s, index) => {
//                 const link = `/${valideURLConvert(s?.category?.[0]?.name)}-${s?.category?.[0]?._id}/${valideURLConvert(s?.name)}-${s?._id}`
//                 const isActive = String(subCategoryId) === String(s?._id)
//                 return (
//                   <Link
//                     key={s?._id + '-' + index}
//                     href={link}
//                     className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 transition-colors duration-200 ${isActive ? 'bg-green-100' : ''}`}
//                     aria-current={isActive ? 'page' : undefined}
//                   >
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <img
//                       src={s?.image}
//                       alt={s?.name}
//                       className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
//                       loading="lazy"
//                     />
//                     <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base sm:text-sm text-pink-400 font-semibold py-6 lg:py-0">
//                       {s?.name}
//                     </p>
//                   </Link>
//                 )
//               })
//             ) : (
//               <div className="p-4 text-center text-gray-500 text-sm">No subcategories found</div>
//             )}
//           </aside>

//           <section className="sticky top-20">
//             <header className="bg-white shadow-md p-4 z-10">
//               <h1 className="font-semibold">{subCategoryName || 'Products'}</h1>
//               {products.length > 0 && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   {Math.min(products.length, PAGE_SIZE)} of {totalCount} products
//                 </p>
//               )}
//             </header>

//             <section className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
//               {products.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full p-8 text-center">
//                   <div className="text-gray-400 mb-4">
//                     <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13v2a2 2 0 01-2 2h-2m0 0H9m3 0v-2M9 13h2" />
//                     </svg>
//                   </div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-2">No products found</h2>
//                   <p className="text-gray-500">There are no products in this category yet.</p>
//                 </div>
//               ) : (
//                 <>
//                   <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4" role="list">
//                     {products.map((p, index) => (
//                       <li key={p?._id + '-productSubCategory-' + index}>
//                         <CardProduct data={p} />
//                       </li>
//                     ))}
//                   </ul>

//                   {hasMore && (
//                     <nav className="p-4 text-center" aria-label="Pagination">
//                       <Link
//                         href={nextHref}
//                         className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
//                       >
//                         Load More Products
//                       </Link>
//                     </nav>
//                   )}
//                 </>
//               )}
//             </section>
//           </section>
//         </section>
//       </main>
//     </>
//   )
// }






// // src/app/[category]/[subCategory]/page.jsx
// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import CardProduct from '../../../components/CardProduct'
// import { valideURLConvert } from '../../../utils/valideURLConvert'
// import Image from 'next/image'

// // ---------- API config ----------
// const baseURL = process.env.NEXT_PUBLIC_API_URL
// const PAGE_SIZE = 8

// const SummaryApi = {
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' },
//   getProductByCategoryAndSubCategory: {
//     url: '/api/product/get-pruduct-by-category-and-subcategory',
//     method: 'post',
//   },
//   getCategory: { url: '/api/category/get', method: 'get' },
// }

// // ---------- Helpers ----------
// function parseIdFromSlug(slug) {
//   if (!slug) return null
//   const parts = String(slug).split('-')
//   return parts[parts.length - 1]
// }

// function parseNameFromSlug(slug) {
//   if (!slug) return ''
//   const parts = String(slug).split('-')
//   return parts.slice(0, parts.length - 1).join(' ')
// }

// function safeArray(v) {
//   return Array.isArray(v) ? v : []
// }

// // Strip HTML for meta descriptions
// function stripHtml(html) {
//   if (!html) return ''
//   return html.replace(/<[^>]*>?/gm, '').trim()
// }

// // Server fetchers (SSR)
// async function fetchSubCategories() {
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
//       method: SummaryApi.getSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({}),
//       next: { revalidate: 300 },
//     })
//     if (!res.ok) throw new Error('Failed to fetch subcategories')
//     const data = await res.json()
//     return safeArray(data?.data || data)
//   } catch (e) {
//     console.error('fetchSubCategories error:', e)
//     return []
//   }
// }

// async function fetchProductsByCatSub({ categoryId, subCategoryId, page = 1 }) {
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getProductByCategoryAndSubCategory.url}`, {
//       method: SummaryApi.getProductByCategoryAndSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         categoryId,
//         subCategoryId,
//         page,
//         limit: PAGE_SIZE,
//       }),
//       next: { revalidate: 120 },
//     })
//     if (!res.ok) throw new Error('Failed to fetch products')
//     const json = await res.json()
//     if (!json?.success) return { products: [], totalCount: 0 }
//     return { products: safeArray(json.data), totalCount: Number(json.totalCount || 0) }
//   } catch (e) {
//     console.error('fetchProductsByCatSub error:', e)
//     return { products: [], totalCount: 0 }
//   }
// }

// // ---------- Dynamic SEO ----------
// export async function generateMetadata({ params, searchParams }) {
//   // Fix: Await params before accessing properties
//   const paramsData = await params
//   const searchParamsData = await searchParams
  
//   const categorySlug = paramsData?.category
//   const subCategorySlug = paramsData?.subCategory
//   const page = Number(searchParamsData?.page || 1)

//   const categoryId = parseIdFromSlug(categorySlug)
//   const subCategoryId = parseIdFromSlug(subCategorySlug)
//   const categoryName = parseNameFromSlug(categorySlug)
//   const subCategoryName = parseNameFromSlug(subCategorySlug)

//   if (!categoryId || !subCategoryId) {
//     return {
//       title: 'Products',
//       description: 'Explore our curated selection of makeup and beauty products.',
//       robots: { index: false, follow: true },
//     }
//   }

//   // Fetch some data for better SEO text
//   const [{ products, totalCount }] = await Promise.all([
//     fetchProductsByCatSub({ categoryId, subCategoryId, page }),
//   ])

//   const titleBase = subCategoryName || 'Products'
//   const paginationSuffix = page > 1 ? ` | Page ${page}` : ''
//   const title = `${titleBase} Makeup`

//   const desc =
//     products?.length
//       ? `Shop ${subCategoryName} in ${categoryName}. Discover ${products.length} of ${totalCount} products available.`
//       : `Browse ${subCategoryName} in ${categoryName} at EssentialisMakeupStore.`

//   const canonical = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}${page > 1 ? `?page=${page}` : ''}`

//   const ogImage =
//     products?.[0]?.image?.[0] ||
//     products?.[0]?.image ||
//     'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

//   return {
//     metadataBase: new URL('https://www.esmakeupstore.com'),
//     title,
//     description: stripHtml(desc).slice(0, 300),
//     alternates: { canonical },
//     keywords: [
//       subCategoryName,
//       categoryName,
//       'makeup',
//       'cosmetics',
//       'beauty',
//       'Cameroon makeup',
//       'Douala beauty',
//       'EssentialisMakeupStore',
//     ],
//     robots: { index: true, follow: true },
//     openGraph: {
//       type: 'website',
//       siteName: 'EssentialisMakeupStore',
//       url: canonical,
//       title,
//       description: stripHtml(desc).slice(0, 300),
//       images: [{ url: ogImage, width: 1200, height: 630, alt: titleBase }],
//       locale: 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description: stripHtml(desc).slice(0, 300),
//       images: [ogImage],
//     },
//   }
// }

// // ---------- Schema.org JSON-LD ----------
// function StructuredData({ categorySlug, subCategorySlug, subCategoryName }) {
//   const url = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}`

//   const breadcrumbJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'BreadcrumbList',
//     itemListElement: [
//       { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' },
//       { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.esmakeupstore.com/product' },
//       { '@type': 'ListItem', position: 3, name: subCategoryName, item: url },
//     ],
//   }

//   const collectionJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'CollectionPage',
//     name: `${subCategoryName} - EssentialisMakeupStore`,
//     url,
//     isPartOf: {
//       '@type': 'WebSite',
//       name: 'EssentialisMakeupStore',
//       url: 'https://www.esmakeupstore.com/',
//     },
//   }

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
//     </>
//   )
// }

// // ---------- Page (SSR) ----------
// export default async function ProductListPage({ params, searchParams }) {
//   // Fix: Await params and searchParams before accessing properties
//   const paramsData = await params
//   const searchParamsData = await searchParams
  
//   const categorySlug = paramsData?.category
//   const subCategorySlug = paramsData?.subCategory
//   const page = Number(searchParamsData?.page || 1)

//   const categoryId = parseIdFromSlug(categorySlug)
//   const subCategoryId = parseIdFromSlug(subCategorySlug)
//   const subCategoryName = parseNameFromSlug(subCategorySlug)
//   const categoryName = parseNameFromSlug(categorySlug)

//   if (!categoryId || !subCategoryId) return notFound()

//   // Fetch data in parallel
//   const [allSubCategories, { products, totalCount }] = await Promise.all([
//     fetchSubCategories(),
//     fetchProductsByCatSub({ categoryId, subCategoryId, page }),
//   ])

//   // Build subcategory list for this category
//   const displaySubCategory = safeArray(
//     allSubCategories.filter((s) => safeArray(s?.category).some((c) => c?._id === categoryId))
//   )

//   const totalPages = Math.max(1, Math.ceil((Number(totalCount) || 0) / PAGE_SIZE))
//   const hasMore = page < totalPages

//   // Build next page link
//   const basePath = `/${categorySlug}/${subCategorySlug}`
//   const nextHref = hasMore ? `${basePath}?page=${page + 1}` : null

//   return (
//     <>
//       <StructuredData
//         categorySlug={categorySlug}
//         subCategorySlug={subCategorySlug}
//         subCategoryName={subCategoryName}
//       />

//       <style
//         dangerouslySetInnerHTML={{
//           __html: `
//           .scrollbarCustom {
//             scrollbar-width: thin;
//             scrollbar-color: #cbd5e1 transparent;
//           }
//           .scrollbarCustom::-webkit-scrollbar { height: 8px; width: 8px; }
//           .scrollbarCustom::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
//           .scrollbarCustom::-webkit-scrollbar-track { background: transparent; }
//         `,
//         }}
//       />

//       <main className="sticky top-24 lg:top-20">
//         <section className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
//           <aside className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2" aria-label="Subcategories">
//             {displaySubCategory.length > 0 ? (
//               displaySubCategory.map((s, index) => {
//                 const link = `/${valideURLConvert(s?.category?.[0]?.name)}-${s?.category?.[0]?._id}/${valideURLConvert(s?.name)}-${s?._id}`
//                 const isActive = String(subCategoryId) === String(s?._id)
//                 return (
//                   <Link
//                     key={s?._id + '-' + index}
//                     href={link}
//                     className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 transition-colors duration-200 ${isActive ? 'bg-green-100' : ''}`}
//                     aria-current={isActive ? 'page' : undefined}
//                     prefetch={false} // Performance optimization - only prefetch when needed
//                   >
//                     {/* eslint-disable-next-line @next/next/no-img-element */}
//                     <Image
//                       src={s?.image}
//                       alt={s?.name}
//                       className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
//                       loading="lazy"
//                       width="56"
//                       height="56"
//                     />
//                     <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base sm:text-sm text-pink-400 font-semibold py-6 lg:py-0">
//                       {s?.name}
//                     </p>
//                   </Link>
//                 )
//               })
//             ) : (
//               <div className="p-4 text-center text-gray-500 text-sm">No subcategories found</div>
//             )}
//           </aside>

//           <section className="sticky top-20">
//             <header className="bg-white shadow-md p-4 z-10">
//               <h1 className="font-semibold">{subCategoryName || 'Products'}</h1>
//               {products.length > 0 && (
//                 <p className="text-sm text-gray-600 mt-1">
//                   {Math.min(products.length, PAGE_SIZE)} of {totalCount} products
//                 </p>
//               )}
//             </header>

//             <section className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
//               {products.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full p-8 text-center">
//                   <div className="text-gray-400 mb-4">
//                     <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13v2a2 2 0 01-2 2h-2m0 0H9m3 0v-2M9 13h2" />
//                     </svg>
//                   </div>
//                   <h2 className="text-lg font-medium text-gray-900 mb-2">No products found</h2>
//                   <p className="text-gray-500">There are no products in this category yet.</p>
//                 </div>
//               ) : (
//                 <>
//                   <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4" role="list">
//                     {products.map((p, index) => (
//                       <li key={p?._id + '-productSubCategory-' + index}>
//                         <CardProduct data={p} />
//                       </li>
//                     ))}
//                   </ul>

//                   {hasMore && (
//                     <nav className="p-4 text-center" aria-label="Pagination">
//                       <Link
//                         href={nextHref}
//                         className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
//                         prefetch={false} // Performance optimization
//                       >
//                         Load More Products
//                       </Link>
//                     </nav>
//                   )}
//                 </>
//               )}
//             </section>
//           </section>
//         </section>
//       </main>
//     </>
//   )
// }




// src/app/[category]/[subCategory]/page.jsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CardProduct from '../../../components/CardProduct'
import { valideURLConvert } from '../../../utils/valideURLConvert'
import Image from 'next/image'

// ---------- API config ----------
const baseURL = process.env.NEXT_PUBLIC_API_URL
const PAGE_SIZE = 8

const SummaryApi = {
  getSubCategory: { url: '/api/subcategory/get', method: 'post' },
  getProductByCategoryAndSubCategory: {
    url: '/api/product/get-pruduct-by-category-and-subcategory',
    method: 'post',
  },
  getCategory: { url: '/api/category/get', method: 'get' },
}

// ---------- Helpers ----------
function parseIdFromSlug(slug) {
  if (!slug) return null
  const parts = String(slug).split('-')
  return parts[parts.length - 1]
}

function parseNameFromSlug(slug) {
  if (!slug) return ''
  const parts = String(slug).split('-')
  return parts.slice(0, parts.length - 1).join(' ')
}

function safeArray(v) {
  return Array.isArray(v) ? v : []
}

// Strip HTML for meta descriptions
function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

// // ---------- SEO title map (low‑competition, commercial intent) ----------
// const subCategoryBestTitles = {
//   // Face / Foundation family
//   'Foundation': 'Transfer proof foundation for masks',
//   'Foundation Makeup': 'Foundation shade finder kit',
//   'Liquid Foundation': 'Lightweight liquid foundation for acne prone skin',
//   'Powder Foundation': 'buildable powder foundation for mature skin',
//   'Stick foundation': 'stick foundation for oily skin',
//   'Total Control Drop Foundation': 'drop foundation full coverage adjustable',
//   'Foundation Primers': 'gripping primer for long wear makeup',
//   'Face Primer': 'pore blurring primer for oily skin',
//   'Tinted Moisturizer': 'tinted moisturizer with spf for oily skin',
//   'Setting Spray': 'Alcohol free setting spray for dry skin',
//   'SETTING POWDER': 'no flashback setting powder',
//   'All Setting Powder': 'translucent setting powder for oily skin',
//   // Concealers / Correctors
//   'Concealer': 'full coverage concealer for dark circles',
//   'Concealers & Neutralizers': 'peach color corrector for dark circles',
//   'Dark circle concealer': 'orange concealer for dark circles',
//   // Blush / Highlighter / Bronzer
//   'Blush Makeup': 'cream blush for mature skin that doesn’t settle',
//   'All Blush': 'best affordable blush for fair skin',
//   'High Definition Blush': 'hd cream blush for camera ready look',
//   'Highlighters & Luminizers': 'subtle highlighter for mature skin',
//   'Illuminator': 'liquid illuminator under foundation',
//   'Liquid highlighter': 'dewy liquid highlighter for natural glow',
//   'Bronzy': 'subtle bronzy makeup look products',
//   'Bronzy Powder': 'warm bronzer powder for olive skin',
//   'Matte bronzer': 'matte bronzer for fair cool undertone',
//   // Eyes
//   'Eye Makeup': 'everyday eye makeup kit for beginners',
//   'Eye Shadow': 'neutral eyeshadow for blue eyes',
//   'Eye Shadow Palette': 'mini eyeshadow palette for travel',
//   'Eyeliner': 'smudge proof eyeliner for oily lids',
//   'Kajal': 'long lasting kajal for watery eyes',
//   'Mascara': 'tubing mascara for short lashes',
//   'Eye Cream & Treatment': 'eye cream for dark circles and puffiness under $30',
//   'EYE CREAM': 'fragrance free eye cream for sensitive skin',
//   'Eye Serum': 'retinol eye serum for fine lines',
//   'Eye brow cake powder': 'eyebrow cake powder for sparse brows',
//   'Eye Brow Enhancers': 'tinted brow gel for thin eyebrows',
//   // Lips
//   'Lip Makeup': 'lip makeup set gift for her',
//   'Lipstick': 'transfer proof lipstick for weddings',
//   'Liquid Lipstick': 'comfortable liquid lipstick non drying',
//   'Matte Lip Sticks': 'matte lipstick set nude',
//   'Lip Gloss': 'non sticky lip gloss set',
//   'Lip Lacquer': 'high shine lip lacquer long wear',
//   'Lip Liner': 'waterproof lip liner nude shades',
//   'Lip Plumper': 'cinnamon lip plumper gloss',
//   'Lip Tint': 'long lasting lip tint waterproof',
//   'Lip Crayon': 'matte lip crayon non drying',
//   'Lip cream': 'long lasting lip cream matte finish',
//   'Lip Cream Pallette': 'lip cream palette professional',
//   'Lip/eye liner pencil 3 in 1': '3 in 1 lip eye liner pencil set',
//   // Palettes / Kits
//   'Makeup Palettes': 'all in one makeup palette with mirror',
//   'Makeup Sets': 'beginner makeup set with bag',
//   'Makeup Kits': 'travel makeup kit essentials',
//   // Face Makeup catch-all
//   'Face Makeup': 'beginner face makeup kit with brushes',
//   // Compacts / Powders
//   'Compact': 'compact powder for oily skin long lasting',
//   'Loose Powder': 'talc free loose setting powder',
//   // Highlighters duplicate safe default handled above
// }


// ---------- SEO title map (low‑competition, commercial intent) ----------
const subCategoryBestTitles = {
  // Face / Foundation family
  'Foundation': 'Transfer Proof Foundation For Masks',
  'Foundation Makeup': 'Foundation Shade Finder Kit',
  'Liquid Foundation': 'Lightweight Liquid Foundation For Acne Prone Skin',
  'Powder Foundation': 'Buildable Powder Foundation For Mature Skin',
  'Stick foundation': 'Stick Foundation For Oily Skin',
  'Total Control Drop Foundation': 'Drop Foundation Full Coverage Adjustable',
  'Foundation Primers': 'Gripping Primer For Long Wear Makeup',
  'Face Primer': 'Pore Blurring Primer For Oily Skin',
  'Tinted Moisturizer': 'Tinted Moisturizer With SPF For Oily Skin',
  'Setting Spray': 'Alcohol Free Setting Spray For Dry Skin',
  'SETTING POWDER': 'No Flashback Setting Powder',
  'All Setting Powder': 'Translucent Setting Powder For Oily Skin',
  // Concealers / Correctors
  'Concealer': 'Full Coverage Concealer For Dark Circles',
  'Concealers & Neutralizers': 'Peach Color Corrector For Dark Circles',
  'Dark circle concealer': 'Orange Concealer For Dark Circles',
  // Blush / Highlighter / Bronzer
  'Blush Makeup': 'Cream Blush For Mature Skin That Doesn’t Settle',
  'All Blush': 'Best Affordable Blush For Fair Skin',
  'High Definition Blush': 'HD Cream Blush For Camera Ready Look',
  'Highlighters & Luminizers': 'Subtle Highlighter For Mature Skin',
  'Illuminator': 'Liquid Illuminator Under Foundation',
  'Liquid highlighter': 'Dewy Liquid Highlighter For Natural Glow',
  'Bronzy': 'Subtle Bronzy Makeup Look Products',
  'Bronzy Powder': 'Warm Bronzer Powder For Olive Skin',
  'Matte bronzer': 'Matte Bronzer For Fair Cool Undertone',
  // Eyes
  'Eye Makeup': 'Everyday Eye Makeup Kit For Beginners',
  'Eye Shadow': 'Neutral Eyeshadow For Blue Eyes',
  'Eye Shadow Palette': 'Mini Eyeshadow Palette For Travel',
  'Eyeliner': 'Smudge Proof Eyeliner For Oily Lids',
  'Kajal': 'Long Lasting Kajal For Watery Eyes',
  'Mascara': 'Tubing Mascara For Short Lashes',
  'Eye Cream & Treatment': 'Eye Cream For Dark Circles And Puffiness Under $30',
  'EYE CREAM': 'Fragrance Free Eye Cream For Sensitive Skin',
  'Eye Serum': 'Retinol Eye Serum For Fine Lines',
  'Eye brow cake powder': 'Eyebrow Cake Powder For Sparse Brows',
  'Eye Brow Enhancers': 'Tinted Brow Gel For Thin Eyebrows',
  // Lips
  'Lip Makeup': 'Lip Makeup Set Gift For Her',
  'Lipstick': 'Transfer Proof Lipstick For Weddings',
  'Liquid Lipstick': 'Comfortable Liquid Lipstick Non Drying',
  'Matte Lip Sticks': 'Matte Lipstick Set Nude',
  'Lip Gloss': 'Non Sticky Lip Gloss Set',
  'Lip Lacquer': 'High Shine Lip Lacquer Long Wear',
  'Lip Liner': 'Waterproof Lip Liner Nude Shades',
  'Lip Plumper': 'Cinnamon Lip Plumper Gloss',
  'Lip Tint': 'Long Lasting Lip Tint Waterproof',
  'Lip Crayon': 'Matte Lip Crayon Non Drying',
  'Lip cream': 'Long Lasting Lip Cream Matte Finish',
  'Lip Cream Pallette': 'Lip Cream Palette Professional',
  'Lip/eye liner pencil 3 in 1': '3 In 1 Lip Eye Liner Pencil Set',
  // Palettes / Kits
  'Makeup Palettes': 'All In One Makeup Palette With Mirror',
  'Makeup Sets': 'Beginner Makeup Set With Bag',
  'Makeup Kits': 'Travel Makeup Kit Essentials',
  // Face Makeup catch-all
  'Face Makeup': 'Beginner Face Makeup Kit With Brushes',
  // Compacts / Powders
  'Compact': 'Compact Powder For Oily Skin Long Lasting',
  'Loose Powder': 'Talc Free Loose Setting Powder',
}

// Utility: choose best SEO title for a given subcategory name
function bestSeoTitleForSubcategory(subCategoryName = '') {
  // Exact match first
  if (subCategoryBestTitles[subCategoryName]) return subCategoryBestTitles[subCategoryName]
  // Try case-insensitive key match
  const key = Object.keys(subCategoryBestTitles).find(
    k => k.toLowerCase() === String(subCategoryName).toLowerCase()
  )
  if (key) return subCategoryBestTitles[key]
  // Fallback: append generic modifiers for commercial intent
  return `${subCategoryName} buy online in Cameroon`
}

// ---------- Server fetchers (SSR) ----------
async function fetchSubCategories() {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
      method: SummaryApi.getSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Failed to fetch subcategories')
    const data = await res.json()
    return safeArray(data?.data || data)
  } catch (e) {
    console.error('fetchSubCategories error:', e)
    return []
  }
}

async function fetchProductsByCatSub({ categoryId, subCategoryId, page = 1 }) {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getProductByCategoryAndSubCategory.url}`, {
      method: SummaryApi.getProductByCategoryAndSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId,
        subCategoryId,
        page,
        limit: PAGE_SIZE,
      }),
      next: { revalidate: 120 },
    })
    if (!res.ok) throw new Error('Failed to fetch products')
    const json = await res.json()
    if (!json?.success) return { products: [], totalCount: 0 }
    return { products: safeArray(json.data), totalCount: Number(json.totalCount || 0) }
  } catch (e) {
    console.error('fetchProductsByCatSub error:', e)
    return { products: [], totalCount: 0 }
  }
}

// ---------- Dynamic SEO ----------
export async function generateMetadata({ params, searchParams }) {
  // Fix: Await params before accessing properties
  const paramsData = await params
  const searchParamsData = await searchParams
  
  const categorySlug = paramsData?.category
  const subCategorySlug = paramsData?.subCategory
  const page = Number(searchParamsData?.page || 1)

  const categoryId = parseIdFromSlug(categorySlug)
  const subCategoryId = parseIdFromSlug(subCategorySlug)
  const categoryName = parseNameFromSlug(categorySlug)
  const subCategoryName = parseNameFromSlug(subCategorySlug)

  if (!categoryId || !subCategoryId) {
    return {
      title: 'Products',
      description: 'Explore our curated selection of makeup and beauty products.',
      robots: { index: false, follow: true },
    }
  }

  // Fetch some data for better SEO text
  const [{ products, totalCount }] = await Promise.all([
    fetchProductsByCatSub({ categoryId, subCategoryId, page }),
  ])

  // NEW: use low‑competition, commercial-intent title for each subCategory
  const commercialTitle = bestSeoTitleForSubcategory(subCategoryName)
  const paginationSuffix = page > 1 ? ` | Page ${page}` : ''
  const title = `${commercialTitle} | ${subCategoryName}`

  const desc =
    products?.length
      ? `Shop ${subCategoryName} in ${categoryName} at EssentialistMakeupStore. Discover ${products.length} of ${totalCount} products available with nationwide shipping, secure online payment, and great prices.`
      : `Browse ${subCategoryName} in ${categoryName} at EssentialistMakeupStore. Fast Cameroon-wide delivery and secure checkout.`

  const canonical = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}${page > 1 ? `?page=${page}` : ''}`

  const ogImage =
    products?.[0]?.image?.[0] ||
    products?.[0]?.image ||
    'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

  return {
    metadataBase: new URL('https://www.esmakeupstore.com'),
    title,
    description: stripHtml(desc).slice(0, 300),
    alternates: { canonical },
    keywords: [
      commercialTitle,
      subCategoryName,
      categoryName,
      'makeup',
      'cosmetics',
      'beauty',
      'Cameroon makeup',
      'Douala beauty',
      'EssentialistMakeupStore',
      'buy online',
      'best price',
      'free shipping',
    ],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'EssentialistMakeupStore',
      url: canonical,
      title,
      description: stripHtml(desc).slice(0, 300),
      images: [{ url: ogImage, width: 1200, height: 630, alt: subCategoryName }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: stripHtml(desc).slice(0, 300),
      images: [ogImage],
    },
  }
}

// ---------- Schema.org JSON-LD ----------
function StructuredData({ categorySlug, subCategorySlug, subCategoryName, products = [] }) {
  const url = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: 'https://www.esmakeupstore.com/product' },
      { '@type': 'ListItem', position: 3, name: subCategoryName, item: url },
    ],
  }

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${subCategoryName} - EssentialistMakeupStore`,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'EssentialistMakeupStore',
      url: 'https://www.esmakeupstore.com/',
    },
  }

  // Optional: expose list of products with availability (InStock / OutOfStock)
  const itemListJsonLd = products?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${subCategoryName} Products`,
        numberOfItems: products.length,
        itemListElement: products.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          item: {
            '@type': 'Product',
            name: p?.name,
            image: Array.isArray(p?.image) ? p?.image?.[0] : p?.image,
            offers: {
              '@type': 'Offer',
              price: String(p?.price || ''),
              priceCurrency: 'XAF',
              availability:
                Number(p?.stock) > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
            },
          },
        })),
      }
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      {itemListJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      )}
    </>
  )
}

// ---------- Page (SSR) ----------
export default async function ProductListPage({ params, searchParams }) {
  // Fix: Await params and searchParams before accessing properties
  const paramsData = await params
  const searchParamsData = await searchParams
  
  const categorySlug = paramsData?.category
  const subCategorySlug = paramsData?.subCategory
  const page = Number(searchParamsData?.page || 1)

  const categoryId = parseIdFromSlug(categorySlug)
  const subCategoryId = parseIdFromSlug(subCategorySlug)
  const subCategoryName = parseNameFromSlug(subCategorySlug)
  const categoryName = parseNameFromSlug(categorySlug)

  if (!categoryId || !subCategoryId) return notFound()

  // Fetch data in parallel
  const [allSubCategories, { products, totalCount }] = await Promise.all([
    fetchSubCategories(),
    fetchProductsByCatSub({ categoryId, subCategoryId, page }),
  ])

  // Build subcategory list for this category
  const displaySubCategory = safeArray(
    allSubCategories.filter((s) => safeArray(s?.category).some((c) => c?._id === categoryId))
  )

  const totalPages = Math.max(1, Math.ceil((Number(totalCount) || 0) / PAGE_SIZE))
  const hasMore = page < totalPages

  // Build next page link
  const basePath = `/${categorySlug}/${subCategorySlug}`
  const nextHref = hasMore ? `${basePath}?page=${page + 1}` : null

  // Derive best commercial title for on-page H1
  const h1Commercial = bestSeoTitleForSubcategory(subCategoryName)

  return (
    <>
      <StructuredData
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        subCategoryName={subCategoryName}
        products={products}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .scrollbarCustom {
            scrollbar-width: thin;
            scrollbar-color: #cbd5e1 transparent;
          }
          .scrollbarCustom::-webkit-scrollbar { height: 8px; width: 8px; }
          .scrollbarCustom::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
          .scrollbarCustom::-webkit-scrollbar-track { background: transparent; }
        `,
        }}
      />

      <main className="sticky top-24 lg:top-20">
        <section className="container sticky top-24 mx-auto grid grid-cols-[90px,1fr] md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]">
          <aside className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2" aria-label="Subcategories">
            {displaySubCategory.length > 0 ? (
              displaySubCategory.map((s, index) => {
                const link = `/${valideURLConvert(s?.category?.[0]?.name)}-${s?.category?.[0]?._id}/${valideURLConvert(s?.name)}-${s?._id}`
                const isActive = String(subCategoryId) === String(s?._id)
                // Add title attribute with best commercial intent title per subcategory
                const subBest = bestSeoTitleForSubcategory(s?.name)
                return (
                  <Link
                    key={s?._id + '-' + index}
                    href={link}
                    title={subBest}
                    className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 transition-colors duration-200 ${isActive ? 'bg-green-100' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    prefetch={false}
                  >
                    <Image
                      src={s?.image}
                      alt={s?.name}
                      className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                      loading="lazy"
                      width="56"
                      height="56"
                    />
                    <p className="-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base sm:text-sm text-pink-400 font-semibold py-6 lg:py-0">
                      {s?.name}
                    </p>
                  </Link>
                )
              })
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No subcategories found</div>
            )}
          </aside>

          <section className="sticky top-20">
            <header className="bg-white shadow-md p-4 z-10">
              {/* Replace H1 with best commercial intent title, and keep subcategory label below for clarity */}
              <h1 className="font-semibold">{h1Commercial}</h1>
              <p className="text-xs text-gray-500 mt-1">
                {subCategoryName} in {categoryName}
              </p>
              {products.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {Math.min(products.length, PAGE_SIZE)} of {totalCount} products
                </p>
              )}
            </header>

            <section className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13v2a2 2 0 01-2 2h-2m0 0H9m3 0v-2M9 13h2" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">No products found</h2>
                  <p className="text-gray-500">There are no products in this category yet.</p>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4" role="list">
                    {products.map((p, index) => (
                      <li key={p?._id + '-productSubCategory-' + index}>
                        <CardProduct data={p} />
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <nav className="p-4 text-center" aria-label="Pagination">
                      <Link
                        href={nextHref}
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                        prefetch={false}
                      >
                        Load More Products
                      </Link>
                    </nav>
                  )}
                </>
              )}
            </section>
          </section>
        </section>
      </main>
    </>
  )
}