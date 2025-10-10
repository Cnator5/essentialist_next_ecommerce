// // src/app/brands/page.jsx
// // Server Component (SSR) Product List page with dynamic SEO via generateMetadata

// import Link from 'next/link'
// import { valideURLConvert } from '../../utils/valideURLConvert'
// import BrandSearch from '../../components/BrandSearch'

// const SITE_URL = 'https://www.esmakeupstore.com/brands'
// const SITE_NAME = 'Essentialist Makeup Store'
// const OG_IMAGE = 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

// // Static product data (can be moved to a DB/API later)
// const makeupProducts = [
//   { product: 'Total control drop', genre: 'foundation', brand: 'NYX', bulk: 9000, sell: 13000 },
//   { product: 'Dou chromatic', genre: 'lip gloss', brand: 'NYX', bulk: 4000, sell: 6000 },
//   { product: 'Worth the hype', genre: 'Mascara', brand: 'NYX', bulk: 4000, sell: 6000 },
//   { product: 'LA girl', genre: 'Lip/eye liner pencil 3 in 1', brand: 'LA girl', bulk: 5000, sell: 6500 },
//   { product: 'Stay matte but not flat', genre: 'Powder foundation', brand: 'NYX', bulk: 10000, sell: 13000 },
//   { product: 'Stay matte but not flat', genre: 'Liquid Foundation', brand: 'NYX', bulk: 12000, sell: 14000 },
//   { product: 'NYX eye brow cake powder', genre: 'Eye brow cake powder', brand: 'NYX', bulk: 3000, sell: 4500 },
//   { product: 'NYX Mineral stick foundation', genre: 'Stick foundation', brand: 'NYX', bulk: 7000, sell: 10000 },
//   { product: 'NYX illuminator', genre: 'Matte bronzer', brand: 'NYX', bulk: 7000, sell: 9000 },
//   { product: 'Away we glow', genre: 'liquid highlighter', brand: 'NYX', bulk: 4000, sell: 6000 },
//   { product: 'NYX Glitter goals', genre: 'liquid eyes hadow', brand: 'NYX', bulk: 3000, sell: 5000 },
//   { product: 'NYX dark circle concealer', genre: 'Dark circle concealer', brand: 'NYX', bulk: 5000, sell: 7000 },
//   { product: 'Abit jelly gel', genre: 'illuminator', brand: 'NYX', bulk: 5000, sell: 7000 },
//   { product: 'NYX Bright light', genre: 'High definition Blush', brand: 'NYX', bulk: 6000, sell: 8500 },
//   { product: 'NYX baked blush', genre: 'baked blush', brand: 'NYX', bulk: 5000, sell: 7500 },
//   { product: 'sweet cheeks', genre: 'blush', brand: 'NYX', bulk: 5000, sell: 7500 },
//   { product: 'slip tease', genre: 'lip lacquer', brand: 'NYX', bulk: 4500, sell: 6500 },
//   { product: 'NYX Matte lipstick', genre: 'matte lip sticks', brand: 'NYX', bulk: 4000, sell: 5500 },
//   { product: 'Filler instincts', genre: 'Lip color', brand: 'NYX', bulk: 4000, sell: 5500 },
//   { product: 'HD Studio photogenic', genre: 'foundation', brand: 'NYX', bulk: 9000, sell: 13000 },
//   { product: 'Smookey Fume', genre: 'Eye shadow palette', brand: 'NYX', bulk: 4500, sell: 6500 },
//   { product: 'Total control PRO', genre: 'foundation', brand: 'NYX', bulk: 10000, sell: 12500 },
//   { product: 'Tango with', genre: 'Bronzing powder', brand: 'NYX', bulk: 5000, sell: 7000 },
//   { product: 'Ultimate Edit', genre: 'Eye shadow pallette', brand: 'NYX', bulk: 6000, sell: 8500 },
//   { product: 'Trio love in Rio', genre: 'Eye shadow', brand: 'NYX', bulk: 5000, sell: 7000 },
//   { product: 'NYX Pro lip cream', genre: 'Lip cream pallette', brand: 'NYX', bulk: 5000, sell: 6500 },
//   { product: 'NYX Lip sticks', genre: 'Mat n butter lipsticks', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'NYX Lingerie', genre: 'lip stick', brand: 'NYX', bulk: 4000, sell: 5000 },
//   { product: 'NYX eye brow powder pencil', genre: 'eye brow powder pencil', brand: 'NYX', bulk: 2500, sell: 3500 },
//   { product: 'Control freak', genre: 'eye brow gel 3 IN 1', brand: 'NYX', bulk: 4000, sell: 5000 },
//   { product: 'NYX auto eye brow pencil', genre: 'Eye pencils with brush', brand: 'NYX', bulk: 2500, sell: 3500 },
//   { product: 'NYX above and beyond concealer', genre: 'Concealer', brand: 'NYX', bulk: 4000, sell: 6000 },
//   { product: 'NYX', genre: 'pigments', brand: 'NYX', bulk: 3000, sell: 3500 },
//   { product: 'Cosmic metals', genre: 'Lip cream', brand: 'NYX', bulk: 2500, sell: 3500 },
//   { product: 'Lingerie Push up', genre: 'Long lasting lipstick', brand: 'NYX', bulk: 4000, sell: 4500 },
//   { product: 'Powder Puff Lippie', genre: 'powder lip cream', brand: 'NYX', bulk: 4000, sell: 4500 },
//   { product: 'Born to glow large', genre: 'Naturally Radiant foundation', brand: 'NYX', bulk: 8000, sell: 11000 },
//   { product: 'Born to glow small', genre: 'Radiant concealer', brand: 'NYX', bulk: 4500, sell: 6000 },
//   { product: 'Mineral matte', genre: 'Finishing powder', brand: 'NYX', bulk: 8000, sell: 10000 },
//   { product: "Can not stop,will not stop", genre: 'Setting powder', brand: 'NYX', bulk: 8000, sell: 11000 },
//   { product: 'HD Studio photogenic', genre: 'Finishing powder', brand: 'NYX', bulk: 8000, sell: 11000 },
//   { product: 'Filler instincts', genre: 'lip gloss', brand: 'NYX', bulk: 2500, sell: 3500 },
//   { product: 'Studio touch photo loving', genre: 'Primer', brand: 'NYX', bulk: 6500, sell: 7500 },
//   { product: 'Glitter goals', genre: 'Cream glitter pallette', brand: 'NYX', bulk: 6000, sell: 7500 },
//   { product: 'Ultimate multi finish', genre: 'Shadow pallette', brand: 'NYX', bulk: 7000, sell: 10000 },
//   { product: "Tripple shadow for sexy babe's eyes only", genre: 'Eye shadow palette', brand: 'NYX', bulk: 5000, sell: 6500 },
//   { product: 'NYX Whipped', genre: 'lip n cheek cream', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'Keeping it tight', genre: 'Eye liner pencil', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'Dip,shape,go', genre: 'brow pomade', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'NYX 3 in 1', genre: 'Brow pencils', brand: 'NYX', bulk: 4000, sell: 6500 },
//   { product: 'Supper Skinny', genre: 'Eye markers', brand: 'NYX', bulk: 4000, sell: 4500 },
//   { product: 'NYX Wonder stick', genre: 'Highligh and contour stick', brand: 'NYX', bulk: 4000, sell: 5000 },
//   { product: 'Lip of the day', genre: 'Liquid lip liner', brand: 'NYX', bulk: 3000, sell: 4000 },
//   { product: 'line and load 2 in 1 lippie', genre: 'Lip liner n cream', brand: 'NYX', bulk: 3500, sell: 4000 },
//   { product: 'Hydratouch', genre: 'oil primer', brand: 'NYX', bulk: 6500, sell: 8000 },
//   { product: 'Bare with me', genre: 'Radiant perfecting primer', brand: 'NYX', bulk: 7000, sell: 8500 },
//   { product: 'Bare with me', genre: 'jelly primer', brand: 'NYX', bulk: 7000, sell: 8500 },
//   { product: 'Bare with me', genre: 'Tinted skin veil tube', brand: 'NYX', bulk: 6000, sell: 7500 },
//   { product: 'Bare with me', genre: 'Brow setter', brand: 'NYX', bulk: 4000, sell: 5000 },
//   { product: 'Liquid suede', genre: 'lip cream', brand: 'NYX', bulk: 2500, sell: 3000 },
//   { product: 'BB beauty', genre: 'Balm/Primer', brand: 'NYX', bulk: 5000, sell: 6500 },
//   { product: 'Can not stop,wont stop', genre: 'Full coverage foundation', brand: 'NYX', bulk: 10000, sell: 13000 },
//   { product: 'NYX super fat', genre: 'eye marker', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'NYX Liquid lipstick', genre: 'liquid lipstick', brand: 'NYX', bulk: 3500, sell: 4500 },
//   { product: 'POWER GRIP PRIMER', genre: 'PRIMER', brand: 'ELF', qty: 5, bulk: 10000, sell: 12000 },
//   { product: 'SETTING MIST', genre: 'SETTING SPRAY', brand: 'ELF', qty: 3, bulk: 10000, sell: 13000 },
//   { product: 'ALWAYS ON', genre: 'FOUNDATION', brand: 'SMASHBOX', qty: 4, bulk: 33000, sell: 35500 },
//   { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'SMASHBOX', qty: 6, bulk: 23000, sell: 25500 },
//   { product: 'WATER PROOF', genre: 'MASCARA', brand: 'SMASHBOX', qty: 4, bulk: 18000, sell: 19000 },
//   { product: 'SUPER FAN', genre: 'MASCARA', brand: 'SMASHBOX', qty: 2, bulk: 18000, sell: 19000 },
//   { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'BOBBI BROWN', qty: 8, bulk: 22000, sell: 23000 },
//   { product: 'FOUNDATION', genre: 'FOUNDATION', brand: 'BOBBI BROWN', qty: 10, bulk: 40000, sell: 38000 },
//   { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'TOO FACED', qty: 8, bulk: 28000, sell: 29500 },
//   { product: 'LONGWEAR', genre: 'FOUNDATION', brand: 'TOO FACED', qty: 18, bulk: 35000, sell: 39000 },
//   { product: 'DOUBLE WEAR', genre: 'FOUNDATION', brand: 'ESTEE LAUDER', qty: 6, bulk: 40000, sell: 41000 },
//   { product: 'DOUBLE WEAR POWDER', genre: 'POWDER', brand: 'ESTEE LAUDER', qty: 8, bulk: 33000, sell: 35000 },
//   { product: 'DOUBLE WEAR CONCEALER', genre: 'CONCEALER', brand: 'ESTEE LAUDER', qty: 7, bulk: 28000, sell: 29500 },
//   { product: 'LONGWEAR LIPSTICKS', genre: 'LIPSTICKS', brand: 'ESTEE LAUDER', qty: 5, bulk: 23000, sell: 24000 },
//   { product: 'EYE CONCENTRATE', genre: 'EYE SERUM', brand: 'ESTEE LAUDER', qty: 1, bulk: 55000, sell: 56000 },
//   { product: 'FACE&NECK CREAM', genre: 'CREAM', brand: 'ESTEE LAUDER', qty: 1, bulk: 100000, sell: 102000 },
//   { product: 'FOUNDATION', genre: 'FOUNDATION', brand: 'MAC', qty: 12, bulk: 26000, sell: 28000 },
//   { product: 'POWDER TO FOUNDATION', genre: 'POWDER', brand: 'MAC', qty: 6, bulk: 24000, sell: 27000 },
//   { product: 'EYE HYDRO FILLER', genre: 'EYE SERUM', brand: 'CLINIC', qty: 1, bulk: 31000, sell: 33000 },
//   { product: 'WRINKLE CORRECTING CREAM', genre: 'EYE CREAM', brand: 'CLINIC', qty: 1, bulk: 40000, sell: 41000 },
//   { product: 'UNTIL DAWN SPRAY', genre: 'SETTING SPRAY', brand: 'ONE SIZE', qty: 3, bulk: 25000, sell: 27000 },
//   { product: 'SETTING POWDER', genre: 'SETTING POWDER', brand: 'ONE SIZE', qty: 3, bulk: 27000, sell: 30000 },
//   { product: 'BLUSHED ROUGE', genre: 'BLUSH', brand: 'JUVIA', qty: 1, bulk: 15000, sell: 17000 },
//   { product: 'THE WARRIOR', genre: 'EYE SHADOW PALETTE', brand: 'JUVIA', qty: 1, bulk: 15000, sell: 18000 },
//   { product: 'THE ROYALTY', genre: 'LOOSE HIGHLIGHTER', brand: 'JUVIA', qty: 2, bulk: 11000, sell: 13000 },
// ]

// // API config (SSR fetch -- no Redux, no client hooks)
// const baseURL = process.env.NEXT_PUBLIC_API_URL
// const SummaryApi = {
//   getCategory: { url: '/api/category/get', method: 'get' },
//   getSubCategory: { url: '/api/subcategory/get', method: 'post' },
// }

// async function getCategories() {
//   if (!baseURL) return []
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
//       method: SummaryApi.getCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       next: { revalidate: 300 },
//     })
//     if (!res.ok) throw new Error('Failed categories')
//     const data = await res.json()
//     return Array.isArray(data) ? data : data?.data || []
//   } catch {
//     return []
//   }
// }

// async function getSubCategories() {
//   if (!baseURL) return []
//   try {
//     const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
//       method: SummaryApi.getSubCategory.method.toUpperCase(),
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({}),
//       next: { revalidate: 300 },
//     })
//     if (!res.ok) throw new Error('Failed subcategories')
//     const data = await res.json()
//     return Array.isArray(data) ? data : data?.data || []
//   } catch {
//     return []
//   }
// }

// // Helper function to create brand slug
// function createBrandSlug(brand) {
//   return brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
// }

// // Helpers
// function FCFA(amount) {
//   if (typeof amount !== 'number' || Number.isNaN(amount)) return '-'
//   return `${amount.toLocaleString()} FCFA`
// }

// function getSubCatInfoByName(allSubCategory, genreName) {
//   return Array.isArray(allSubCategory)
//     ? allSubCategory.find(
//         (sub) =>
//           sub?.name?.trim()?.toLowerCase() === genreName?.trim()?.toLowerCase()
//       )
//     : undefined
// }

// function getMainAndSubCat(allCategory, allSubCategory, genreName) {
//   const subCat = getSubCatInfoByName(allSubCategory, genreName)
//   if (!subCat || !Array.isArray(subCat.category) || !subCat.category.length) return null
//   const mainCat = Array.isArray(allCategory)
//     ? allCategory.find((cat) => cat?._id === subCat.category[0]?._id)
//     : undefined
//   if (!mainCat) return null
//   return { mainCat, subCat }
// }

// function buildSubCatUrl(mainCat, subCat) {
//   return `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(subCat.name)}-${subCat._id}`
// }

// // Brand Summary Component
// function BrandSummary() {
//   const allBrands = Array.from(new Set(makeupProducts.map(p => p.brand))).sort()
  
//   return (
//     <div className="mb-8 bg-white rounded-lg shadow-md p-6">
//       <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Shop by Individual Brand</h2>
//       <p className="text-center text-gray-600 mb-6">Click on any brand to see their complete product catalog with prices</p>
      
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {allBrands.map((brand) => {
//           const productCount = makeupProducts.filter(p => p.brand === brand).length
//           const brandSlug = createBrandSlug(brand)
//           const avgPrice = Math.round(
//             makeupProducts
//               .filter(p => p.brand === brand)
//               .reduce((sum, p) => sum + (p.sell || p.price || 0), 0) / productCount
//           )
          
//           return (
//             <Link
//               key={brand}
//               href={`/brands/${brandSlug}`}
//               className="group p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 hover:border-pink-400 transition-all hover:shadow-md transform hover:scale-105"
//             >
//               <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors text-center">
//                 {brand}
//               </h3>
//               <div className="text-xs text-gray-600 mt-2 text-center">
//                 <p>{productCount} products</p>
//                 <p className="font-semibold text-pink-600">Avg: {FCFA(avgPrice)}</p>
//               </div>
//             </Link>
//           )
//         })}
//       </div>
      
//       <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
//         <h3 className="font-semibold text-gray-800 mb-2">Quick Brand Facts:</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
//           <div>
//             <span className="font-medium text-pink-600">{allBrands.length}</span> Total Brands
//           </div>
//           <div>
//             <span className="font-medium text-pink-600">{makeupProducts.length}</span> Total Products
//           </div>
//           <div>
//             <span className="font-medium text-pink-600">100%</span> Authentic Products
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Dynamic SEO
// export async function generateMetadata() {
//   const categories = await getCategories()

//   const allProductNames = makeupProducts.map((p) => p.product).join(', ')
//   const allBrands = Array.from(new Set(makeupProducts.map((p) => p.brand))).join(', ')
//   const allGenres = Array.from(new Set(makeupProducts.map((p) => p.genre))).join(', ')

//   const topCats = Array.isArray(categories)
//     ? categories.slice(0, 5).map((c) => c?.name).filter(Boolean).join(', ')
//     : ''

//   const dynTitle =
//     `Shop Top Makeup Brands Online: NYX, Juvia Place, One/Size, Bobbi Brown, Smashbox, e.l.f., Estée Lauder, MAC, Clinique, LA Girl Deals`

//   const dynDesc = `Discover authentic makeup in Cameroon. Brands: ${allBrands}. Categories: ${allGenres}. Browse individual brand pages for detailed pricing. Best FCFA prices, fast delivery in Douala & nationwide.`

//   return {
//     metadataBase: new URL('https://www.esmakeupstore.com'),
//     title: dynTitle,
//     description: dynDesc,
//     keywords: [
//       'makeup brands',
//       'Cameroon makeup',
//       'Douala makeup store',
//       'NYX Cameroon',
//       'LA Girl makeup',
//       'authentic makeup Cameroon',
//       'foundation price list',
//       'lipstick price',
//       'powder price',
//       'cosmetics Cameroon',
//       'brand comparison',
//       'makeup price list',
//       ...allBrands.split(', ').slice(0, 20),
//       ...allGenres.split(', ').slice(0, 20),
//     ],
//     robots: { index: true, follow: true },
//     alternates: { canonical: SITE_URL },
//     openGraph: {
//       type: 'website',
//       siteName: SITE_NAME,
//       url: SITE_URL,
//       title: dynTitle,
//       description: dynDesc,
//       images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Makeup brands in Cameroon -- price list' }],
//       locale: 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title: dynTitle,
//       description: dynDesc,
//       images: [OG_IMAGE],
//     },
//     icons: {
//       icon: [{ url: '/icon.avif', type: 'image/avif' }],
//       apple: [{ url: '/icon.avif' }],
//     },
//     themeColor: '#faf6f3',
//   }
// }

// // Schema.org JSON-LD (SSR)
// function StructuredData({ allCategory, allSubCategory }) {
//   const structuredProducts = makeupProducts.slice(0, 20).map((item) => {
//     const price = item.sell ?? item.price ?? '-'
//     return {
//       '@context': 'https://schema.org',
//       '@type': 'Product',
//       name: item.product,
//       brand: { '@type': 'Brand', name: item.brand },
//       category: item.genre,
//       offers: {
//         '@type': 'Offer',
//         priceCurrency: 'XAF',
//         price: typeof price === 'number' ? String(price) : undefined,
//         availability: 'https://schema.org/InStock',
//       },
//     }
//   })

//   const itemList = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: 'Makeup Brand Price List',
//     itemListElement: structuredProducts.map((prod, i) => ({
//       '@type': 'ListItem',
//       position: i + 1,
//       item: prod,
//     })),
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
//       'https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg',
//     ],
//     address: {
//       '@type': 'PostalAddress',
//       streetAddress: 'Douala',
//       addressLocality: 'Douala',
//       addressCountry: 'CM',
//     },
//     contactPoint: {
//       '@type': 'ContactPoint',
//       telephone: '+237655225569',
//       contactType: 'customer support',
//       areaServed: 'CM',
//     },
//     sameAs: [
//       'https://www.facebook.com/esmakeupstore',
//       'https://www.instagram.com/esmakeupstore',
//     ],
//   }

//   const ld = [storeJsonLd, itemList]

//   return (
//     <>
//       {ld.map((obj, i) => (
//         <script
//           key={i}
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
//         />
//       ))}
//     </>
//   )
// }

// // Page (SSR)
// export default async function BrandPage() {
//   const [allCategory, allSubCategory] = await Promise.all([getCategories(), getSubCategories()])

//   const allBrands = Array.from(new Set(makeupProducts.map((p) => p.brand))).join(', ')
//   const allGenres = Array.from(new Set(makeupProducts.map((p) => p.genre))).join(', ')

//   return (
//     <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//       <StructuredData allCategory={allCategory} allSubCategory={allSubCategory} />

//       {/* Brand Search Component */}
//       <div className="mb-8">
//         <BrandSearch />
//       </div>

//       {/* Brand Summary Component - NEW */}
//       <BrandSummary />

//       {/* Complete Product Table */}
//       <section aria-labelledby="product-table-heading" className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white">
//         <h2 id="product-table-heading" className="text-xl font-bold text-pink-600 p-4 border-b border-pink-200">
//           Complete Product Price List - All Brands
//         </h2>
//         <table className="min-w-full text-sm md:text-base">
//           <thead>
//             <tr className="bg-pink-100 text-black">
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Product</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Subcategory</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Brand</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Bulk Price (FCFA)</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Selling Price (FCFA)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {makeupProducts.map((item, idx) => {
//               const found = getMainAndSubCat(allCategory, allSubCategory, item.genre)
//               const isLink = !!found
//               const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
//               const brandSlug = createBrandSlug(item.brand)
              
//               return (
//                 <tr key={`${item.product}-${idx}`} className={rowClass}>
//                   <td className="py-2 px-2 md:px-4 font-semibold text-gray-900">{item.product}</td>
//                   <td className="py-2 px-2 md:px-4">
//                     {isLink ? (
//                       <Link
//                         href={buildSubCatUrl(found.mainCat, found.subCat)}
//                         className="underline text-blue-700 hover:text-pink-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
//                         aria-label={`Browse ${item.genre} in ${found.mainCat?.name}`}
//                       >
//                         {item.genre}
//                       </Link>
//                     ) : (
//                       <span className="text-gray-500">{item.genre}</span>
//                     )}
//                   </td>
//                   <td className="py-2 px-2 md:px-4">
//                     <Link
//                       href={`/brands/${brandSlug}`}
//                       className="text-gray-900 hover:text-pink-600 font-medium transition-colors underline"
//                       aria-label={`View all ${item.brand} products`}
//                     >
//                       {item.brand}
//                     </Link>
//                   </td>
//                   <td className="py-2 px-2 md:px-4 text-right font-bold text-green-600">{FCFA(item.bulk)}</td>
//                   <td className="py-2 px-2 md:px-4 text-right font-bold text-pink-600">
//                     {FCFA(item.sell ?? item.price)}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </section>

//        <section className="text-center mb-8 ">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
//           ESSENTIALIST MAKEUP STORE
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-700 font-semibold">
//           Build & Brand -- Makeup Brands Price List
//         </p>
//         <p className="text-pink-600 font-bold mt-2">
//           Discover authentic brands at the best prices in Cameroon!
//         </p>
//         <p className="text-gray-600 mt-1">
//           Brands: {allBrands}. Categories: {allGenres}.
//         </p>
//       </section>

//       <section className="mt-12 md:mt-16 bg-pink-100 rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto text-center">
//         <h2 className="text-2xl font-bold text-pink-600 mb-2">
//           Contact Us -- Buy Top Makeup Brands in Cameroon
//         </h2>
//         <p className="text-gray-700 mb-4">
//           For orders, enquiries, or partnership with authentic brands (NYX, LA Girl, JUVIA, ONE SIZE, BOBBI BROWN,
//           SMASHBOX, ELF, ESTEE LAUDER, MAC, CLINIC, and more), reach out to {SITE_NAME}. We supply genuine products
//           at the best FCFA prices in Douala and nationwide.
//         </p>
//         <div className="flex flex-col items-center gap-2">
//           <a
//             href="tel:+237655225569"
//             className="font-bold text-pink-600 hover:text-pink-500 underline"
//             title="Call Essentialist Makeup Store"
//           >
//             Call/WhatsApp: +237 655 22 55 69
//           </a>
//           <a
//             href="mailto:info@esmakeupstore.com"
//             className="font-bold text-pink-600 hover:text-pink-500 underline"
//             title="Email Essentialist Makeup Store"
//           >
//             Email: info@esmakeupstore.com
//           </a>
//         </div>
//         <p className="mt-4 text-gray-600 text-sm">
//           Visit us in Douala or shop online for the widest range of makeup and beauty products. Fast delivery, secure
//           payment, and expert advice on all major makeup brands!
//         </p>
//       </section>
//     </main>
//   )
// }





// src/app/brands/page.jsx
// Server Component (SSR) Product List page with dynamic SEO via generateMetadata

import Link from 'next/link'
import { valideURLConvert } from '../../utils/valideURLConvert'
import BrandSearch from '../../components/BrandSearch'

const SITE_URL = 'https://www.esmakeupstore.com/brands'
const ROOT_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'
const OG_IMAGE = 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

// Static product data (can be moved to a DB/API later)
const makeupProducts = [
  { product: 'Total control drop', genre: 'foundation', brand: 'NYX', bulk: 9000, sell: 13000 },
  { product: 'Dou chromatic', genre: 'lip gloss', brand: 'NYX', bulk: 4000, sell: 6000 },
  { product: 'Worth the hype', genre: 'Mascara', brand: 'NYX', bulk: 4000, sell: 6000 },
  { product: 'LA girl', genre: 'Lip/eye liner pencil 3 in 1', brand: 'LA girl', bulk: 5000, sell: 6500 },
  { product: 'Stay matte but not flat', genre: 'Powder foundation', brand: 'NYX', bulk: 10000, sell: 13000 },
  { product: 'Stay matte but not flat', genre: 'Liquid Foundation', brand: 'NYX', bulk: 12000, sell: 14000 },
  { product: 'NYX eye brow cake powder', genre: 'Eye brow cake powder', brand: 'NYX', bulk: 3000, sell: 4500 },
  { product: 'NYX Mineral stick foundation', genre: 'Stick foundation', brand: 'NYX', bulk: 7000, sell: 10000 },
  { product: 'NYX illuminator', genre: 'Matte bronzer', brand: 'NYX', bulk: 7000, sell: 9000 },
  { product: 'Away we glow', genre: 'liquid highlighter', brand: 'NYX', bulk: 4000, sell: 6000 },
  { product: 'NYX Glitter goals', genre: 'liquid eyes hadow', brand: 'NYX', bulk: 3000, sell: 5000 },
  { product: 'NYX dark circle concealer', genre: 'Dark circle concealer', brand: 'NYX', bulk: 5000, sell: 7000 },
  { product: 'Abit jelly gel', genre: 'illuminator', brand: 'NYX', bulk: 5000, sell: 7000 },
  { product: 'NYX Bright light', genre: 'High definition Blush', brand: 'NYX', bulk: 6000, sell: 8500 },
  { product: 'NYX baked blush', genre: 'baked blush', brand: 'NYX', bulk: 5000, sell: 7500 },
  { product: 'sweet cheeks', genre: 'blush', brand: 'NYX', bulk: 5000, sell: 7500 },
  { product: 'slip tease', genre: 'lip lacquer', brand: 'NYX', bulk: 4500, sell: 6500 },
  { product: 'NYX Matte lipstick', genre: 'matte lip sticks', brand: 'NYX', bulk: 4000, sell: 5500 },
  { product: 'Filler instincts', genre: 'Lip color', brand: 'NYX', bulk: 4000, sell: 5500 },
  { product: 'HD Studio photogenic', genre: 'foundation', brand: 'NYX', bulk: 9000, sell: 13000 },
  { product: 'Smookey Fume', genre: 'Eye shadow palette', brand: 'NYX', bulk: 4500, sell: 6500 },
  { product: 'Total control PRO', genre: 'foundation', brand: 'NYX', bulk: 10000, sell: 12500 },
  { product: 'Tango with', genre: 'Bronzing powder', brand: 'NYX', bulk: 5000, sell: 7000 },
  { product: 'Ultimate Edit', genre: 'Eye shadow pallette', brand: 'NYX', bulk: 6000, sell: 8500 },
  { product: 'Trio love in Rio', genre: 'Eye shadow', brand: 'NYX', bulk: 5000, sell: 7000 },
  { product: 'NYX Pro lip cream', genre: 'Lip cream pallette', brand: 'NYX', bulk: 5000, sell: 6500 },
  { product: 'NYX Lip sticks', genre: 'Mat n butter lipsticks', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'NYX Lingerie', genre: 'lip stick', brand: 'NYX', bulk: 4000, sell: 5000 },
  { product: 'NYX eye brow powder pencil', genre: 'eye brow powder pencil', brand: 'NYX', bulk: 2500, sell: 3500 },
  { product: 'Control freak', genre: 'eye brow gel 3 IN 1', brand: 'NYX', bulk: 4000, sell: 5000 },
  { product: 'NYX auto eye brow pencil', genre: 'Eye pencils with brush', brand: 'NYX', bulk: 2500, sell: 3500 },
  { product: 'NYX above and beyond concealer', genre: 'Concealer', brand: 'NYX', bulk: 4000, sell: 6000 },
  { product: 'NYX', genre: 'pigments', brand: 'NYX', bulk: 3000, sell: 3500 },
  { product: 'Cosmic metals', genre: 'Lip cream', brand: 'NYX', bulk: 2500, sell: 3500 },
  { product: 'Lingerie Push up', genre: 'Long lasting lipstick', brand: 'NYX', bulk: 4000, sell: 4500 },
  { product: 'Powder Puff Lippie', genre: 'powder lip cream', brand: 'NYX', bulk: 4000, sell: 4500 },
  { product: 'Born to glow large', genre: 'Naturally Radiant foundation', brand: 'NYX', bulk: 8000, sell: 11000 },
  { product: 'Born to glow small', genre: 'Radiant concealer', brand: 'NYX', bulk: 4500, sell: 6000 },
  { product: 'Mineral matte', genre: 'Finishing powder', brand: 'NYX', bulk: 8000, sell: 10000 },
  { product: "Can not stop,will not stop", genre: 'Setting powder', brand: 'NYX', bulk: 8000, sell: 11000 },
  { product: 'HD Studio photogenic', genre: 'Finishing powder', brand: 'NYX', bulk: 8000, sell: 11000 },
  { product: 'Filler instincts', genre: 'lip gloss', brand: 'NYX', bulk: 2500, sell: 3500 },
  { product: 'Studio touch photo loving', genre: 'Primer', brand: 'NYX', bulk: 6500, sell: 7500 },
  { product: 'Glitter goals', genre: 'Cream glitter pallette', brand: 'NYX', bulk: 6000, sell: 7500 },
  { product: 'Ultimate multi finish', genre: 'Shadow pallette', brand: 'NYX', bulk: 7000, sell: 10000 },
  { product: "Tripple shadow for sexy babe's eyes only", genre: 'Eye shadow palette', brand: 'NYX', bulk: 5000, sell: 6500 },
  { product: 'NYX Whipped', genre: 'lip n cheek cream', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'Keeping it tight', genre: 'Eye liner pencil', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'Dip,shape,go', genre: 'brow pomade', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'NYX 3 in 1', genre: 'Brow pencils', brand: 'NYX', bulk: 4000, sell: 6500 },
  { product: 'Supper Skinny', genre: 'Eye markers', brand: 'NYX', bulk: 4000, sell: 4500 },
  { product: 'NYX Wonder stick', genre: 'Highligh and contour stick', brand: 'NYX', bulk: 4000, sell: 5000 },
  { product: 'Lip of the day', genre: 'Liquid lip liner', brand: 'NYX', bulk: 3000, sell: 4000 },
  { product: 'line and load 2 in 1 lippie', genre: 'Lip liner n cream', brand: 'NYX', bulk: 3500, sell: 4000 },
  { product: 'Hydratouch', genre: 'oil primer', brand: 'NYX', bulk: 6500, sell: 8000 },
  { product: 'Bare with me', genre: 'Radiant perfecting primer', brand: 'NYX', bulk: 7000, sell: 8500 },
  { product: 'Bare with me', genre: 'jelly primer', brand: 'NYX', bulk: 7000, sell: 8500 },
  { product: 'Bare with me', genre: 'Tinted skin veil tube', brand: 'NYX', bulk: 6000, sell: 7500 },
  { product: 'Bare with me', genre: 'Brow setter', brand: 'NYX', bulk: 4000, sell: 5000 },
  { product: 'Liquid suede', genre: 'lip cream', brand: 'NYX', bulk: 2500, sell: 3000 },
  { product: 'BB beauty', genre: 'Balm/Primer', brand: 'NYX', bulk: 5000, sell: 6500 },
  { product: 'Can not stop,wont stop', genre: 'Full coverage foundation', brand: 'NYX', bulk: 10000, sell: 13000 },
  { product: 'NYX super fat', genre: 'eye marker', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'NYX Liquid lipstick', genre: 'liquid lipstick', brand: 'NYX', bulk: 3500, sell: 4500 },
  { product: 'POWER GRIP PRIMER', genre: 'PRIMER', brand: 'ELF', qty: 5, bulk: 10000, sell: 12000 },
  { product: 'SETTING MIST', genre: 'SETTING SPRAY', brand: 'ELF', qty: 3, bulk: 10000, sell: 13000 },
  { product: 'ALWAYS ON', genre: 'FOUNDATION', brand: 'SMASHBOX', qty: 4, bulk: 33000, sell: 35500 },
  { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'SMASHBOX', qty: 6, bulk: 23000, sell: 25500 },
  { product: 'WATER PROOF', genre: 'MASCARA', brand: 'SMASHBOX', qty: 4, bulk: 18000, sell: 19000 },
  { product: 'SUPER FAN', genre: 'MASCARA', brand: 'SMASHBOX', qty: 2, bulk: 18000, sell: 19000 },
  { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'BOBBI BROWN', qty: 8, bulk: 22000, sell: 23000 },
  { product: 'FOUNDATION', genre: 'FOUNDATION', brand: 'BOBBI BROWN', qty: 10, bulk: 40000, sell: 38000 },
  { product: 'CONCEALERS', genre: 'CONCEALEERS', brand: 'TOO FACED', qty: 8, bulk: 28000, sell: 29500 },
  { product: 'LONGWEAR', genre: 'FOUNDATION', brand: 'TOO FACED', qty: 18, bulk: 35000, sell: 39000 },
  { product: 'DOUBLE WEAR', genre: 'FOUNDATION', brand: 'ESTEE LAUDER', qty: 6, bulk: 40000, sell: 41000 },
  { product: 'DOUBLE WEAR POWDER', genre: 'POWDER', brand: 'ESTEE LAUDER', qty: 8, bulk: 33000, sell: 35000 },
  { product: 'DOUBLE WEAR CONCEALER', genre: 'CONCEALER', brand: 'ESTEE LAUDER', qty: 7, bulk: 28000, sell: 29500 },
  { product: 'LONGWEAR LIPSTICKS', genre: 'LIPSTICKS', brand: 'ESTEE LAUDER', qty: 5, bulk: 23000, sell: 24000 },
  { product: 'EYE CONCENTRATE', genre: 'EYE SERUM', brand: 'ESTEE LAUDER', qty: 1, bulk: 55000, sell: 56000 },
  { product: 'FACE&NECK CREAM', genre: 'CREAM', brand: 'ESTEE LAUDER', qty: 1, bulk: 100000, sell: 102000 },
  { product: 'FOUNDATION', genre: 'FOUNDATION', brand: 'MAC', qty: 12, bulk: 26000, sell: 28000 },
  { product: 'POWDER TO FOUNDATION', genre: 'POWDER', brand: 'MAC', qty: 6, bulk: 24000, sell: 27000 },
  { product: 'EYE HYDRO FILLER', genre: 'EYE SERUM', brand: 'CLINIC', qty: 1, bulk: 31000, sell: 33000 },
  { product: 'WRINKLE CORRECTING CREAM', genre: 'EYE CREAM', brand: 'CLINIC', qty: 1, bulk: 40000, sell: 41000 },
  { product: 'UNTIL DAWN SPRAY', genre: 'SETTING SPRAY', brand: 'ONE SIZE', qty: 3, bulk: 25000, sell: 27000 },
  { product: 'SETTING POWDER', genre: 'SETTING POWDER', brand: 'ONE SIZE', qty: 3, bulk: 27000, sell: 30000 },
  { product: 'BLUSHED ROUGE', genre: 'BLUSH', brand: 'JUVIA', qty: 1, bulk: 15000, sell: 17000 },
  { product: 'THE WARRIOR', genre: 'EYE SHADOW PALETTE', brand: 'JUVIA', qty: 1, bulk: 15000, sell: 18000 },
  { product: 'THE ROYALTY', genre: 'LOOSE HIGHLIGHTER', brand: 'JUVIA', qty: 2, bulk: 11000, sell: 13000 },
]

// API config (SSR fetch -- no Redux, no client hooks)
const baseURL = process.env.NEXT_PUBLIC_API_URL
const SummaryApi = {
  getCategory: { url: '/api/category/get', method: 'get' },
  getSubCategory: { url: '/api/subcategory/get', method: 'post' },
}

async function getCategories() {
  if (!baseURL) return []
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
      method: SummaryApi.getCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Failed categories')
    const data = await res.json()
    return Array.isArray(data) ? data : data?.data || []
  } catch {
    return []
  }
}

async function getSubCategories() {
  if (!baseURL) return []
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
      method: SummaryApi.getSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Failed subcategories')
    const data = await res.json()
    return Array.isArray(data) ? data : data?.data || []
  } catch {
    return []
  }
}

// Helper function to create brand slug
function createBrandSlug(brand) {
  return brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// Helpers
function FCFA(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '-'
  return `${amount.toLocaleString()} FCFA`
}

function getSubCatInfoByName(allSubCategory, genreName) {
  return Array.isArray(allSubCategory)
    ? allSubCategory.find(
        (sub) =>
          sub?.name?.trim()?.toLowerCase() === genreName?.trim()?.toLowerCase()
      )
    : undefined
}

function getMainAndSubCat(allCategory, allSubCategory, genreName) {
  const subCat = getSubCatInfoByName(allSubCategory, genreName)
  if (!subCat || !Array.isArray(subCat.category) || !subCat.category.length) return null
  const mainCat = Array.isArray(allCategory)
    ? allCategory.find((cat) => cat?._id === subCat.category[0]?._id)
    : undefined
  if (!mainCat) return null
  return { mainCat, subCat }
}

function buildSubCatUrl(mainCat, subCat) {
  return `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(subCat.name)}-${subCat._id}`
}

// Brand Summary Component
function BrandSummary() {
  const allBrands = Array.from(new Set(makeupProducts.map(p => p.brand))).sort()
  
  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">Shop by Individual Brand</h2>
      <p className="text-center text-gray-600 mb-6">Click on any brand to see their complete product catalog with prices</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {allBrands.map((brand) => {
          const productCount = makeupProducts.filter(p => p.brand === brand).length
          const brandSlug = createBrandSlug(brand)
          const avgPrice = Math.round(
            makeupProducts
              .filter(p => p.brand === brand)
              .reduce((sum, p) => sum + (p.sell || p.price || 0), 0) / productCount
          )
          
          return (
            <Link
              key={brand}
              href={`/brands/${brandSlug}`}
              className="group p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 hover:border-pink-400 transition-all hover:shadow-md transform hover:scale-105"
            >
              <h3 className="font-bold text-gray-900 group-hover:text-pink-600 transition-colors text-center">
                {brand}
              </h3>
              <div className="text-xs text-gray-600 mt-2 text-center">
                <p>{productCount} products</p>
                <p className="font-semibold text-pink-600">Avg: {FCFA(avgPrice)}</p>
              </div>
            </Link>
          )
        })}
      </div>
      
      <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200">
        <h3 className="font-semibold text-gray-800 mb-2">Quick Brand Facts:</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium text-pink-600">{allBrands.length}</span> Total Brands
          </div>
          <div>
            <span className="font-medium text-pink-600">{makeupProducts.length}</span> Total Products
          </div>
          <div>
            <span className="font-medium text-pink-600">100%</span> Authentic Products
          </div>
        </div>
      </div>
    </div>
  )
}

// Dynamic SEO
export async function generateMetadata() {
  const categories = await getCategories()

  const allProductNames = makeupProducts.map((p) => p.product).join(', ')
  const allBrands = Array.from(new Set(makeupProducts.map((p) => p.brand))).join(', ')
  const allGenres = Array.from(new Set(makeupProducts.map((p) => p.genre))).join(', ')

  const topCats = Array.isArray(categories)
    ? categories.slice(0, 5).map((c) => c?.name).filter(Boolean).join(', ')
    : ''

  const dynTitle =
    `Shop Top Makeup Brands Online: NYX, Juvia’s Place, ONE/SIZE, Bobbi Brown, Smashbox, e.l.f., Estée Lauder, MAC, Clinique, LA Girl Deals`

  const dynDesc = `Discover authentic makeup in Cameroon. Brands: ${allBrands}. Categories: ${allGenres}. Browse individual brand pages for detailed pricing. Best FCFA prices, fast delivery in Douala & nationwide.`

  return {
    metadataBase: new URL(ROOT_URL),
    title: dynTitle,
    description: dynDesc,
    keywords: [
      'makeup brands',
      'Cameroon makeup',
      'Douala makeup store',
      'NYX Cameroon',
      'LA Girl makeup',
      'authentic makeup Cameroon',
      'foundation price list',
      'lipstick price',
      'powder price',
      'cosmetics Cameroon',
      'brand comparison',
      'makeup price list',
      ...allBrands.split(', ').slice(0, 20),
      ...allGenres.split(', ').slice(0, 20),
    ],
    robots: { index: true, follow: true },
    alternates: { canonical: SITE_URL },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: SITE_URL,
      title: dynTitle,
      description: dynDesc,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Makeup brands in Cameroon -- price list' }],
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
  }
}

// Schema.org JSON-LD (SSR)
function StructuredData() {
  const structuredProducts = makeupProducts.slice(0, 20).map((item) => {
    const price = item.sell ?? item.price ?? '-'
    return {
      '@type': 'Product',
      name: item.product,
      brand: { '@type': 'Brand', name: item.brand },
      category: item.genre,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'XAF',
        price: typeof price === 'number' ? String(price) : undefined,
        availability: 'https://schema.org/InStock',
      },
    }
  })

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Makeup Brand Price List',
    itemListElement: structuredProducts.map((prod, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: prod,
    })),
  }

  const storeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: SITE_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
    image: [
      OG_IMAGE,
      'https://www.esmakeupstore.com/assets/NYX-PMU-Makeup-Lips-Liquid-Lipstick-LIP-LINGERIE-XXL-LXXL28-UNTAMABLE-0800897132187-OpenSwatch.webp',
      'https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Bonamoussadi, Carrefour Maçon',
      addressLocality: 'Douala',
      addressCountry: 'CM',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+237655225569',
      contactType: 'customer support',
      areaServed: 'CM',
    },
    sameAs: [
      // Facebook login gate URL provided
      'https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fesmakeupstore',
      // If you have Instagram live URL, replace below. Otherwise omit.
    ],
  }

  const ld = [storeJsonLd, itemList]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld[0]) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld[1]) }}
      />
    </>
  )
}

// Optional: IndexNow submit helper (no-op if API not configured)
async function pingIndexNow() {
  try {
    const endpoint = process.env.NEXT_PUBLIC_API_URL
    if (!endpoint) return
    await fetch(`${endpoint}/api/indexnow/submit-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: SITE_URL }),
      cache: 'no-store',
    })
  } catch {}
}

// Page (SSR)
export default async function BrandPage() {
  // Fire-and-forget ping (does nothing if API not present)
  pingIndexNow()

  const [allCategory, allSubCategory] = await Promise.all([getCategories(), getSubCategories()])

  const allBrands = Array.from(new Set(makeupProducts.map((p) => p.brand))).join(', ')
  const allGenres = Array.from(new Set(makeupProducts.map((p) => p.genre))).join(', ')

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <StructuredData />

      {/* Brand Search Component */}
      <div className="mb-8">
        <BrandSearch />
      </div>

      {/* Brand Summary Component */}
      <BrandSummary />

      {/* Complete Product Table */}
      <section aria-labelledby="product-table-heading" className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white">
        <h2 id="product-table-heading" className="text-xl font-bold text-pink-600 p-4 border-b border-pink-200">
          Complete Product Price List - All Brands
        </h2>
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-pink-100 text-black">
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Product</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Subcategory</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Brand</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Bulk Price (FCFA)</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Selling Price (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {makeupProducts.map((item, idx) => {
              const found = getMainAndSubCat(allCategory, allSubCategory, item.genre)
              const isLink = !!found
              const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
              const brandSlug = createBrandSlug(item.brand)
              
              return (
                <tr key={`${item.product}-${idx}`} className={rowClass}>
                  <td className="py-2 px-2 md:px-4 font-semibold text-gray-900">{item.product}</td>
                  <td className="py-2 px-2 md:px-4">
                    {isLink ? (
                      <Link
                        href={buildSubCatUrl(found.mainCat, found.subCat)}
                        className="underline text-blue-700 hover:text-pink-500 transition font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 rounded"
                        aria-label={`Browse ${item.genre} in ${found.mainCat?.name}`}
                      >
                        {item.genre}
                      </Link>
                    ) : (
                      <span className="text-gray-500">{item.genre}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 md:px-4">
                    <Link
                      href={`/brands/${brandSlug}`}
                      className="text-gray-900 hover:text-pink-600 font-medium transition-colors underline"
                      aria-label={`View all ${item.brand} products`}
                    >
                      {item.brand}
                    </Link>
                  </td>
                  <td className="py-2 px-2 md:px-4 text-right font-bold text-green-600">{FCFA(item.bulk)}</td>
                  <td className="py-2 px-2 md:px-4 text-right font-bold text-pink-600">
                    {FCFA(item.sell ?? item.price)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* Brand hub intro for SEO */}
      <section className="text-center mb-8 ">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
          ESSENTIALIST MAKEUP STORE
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 font-semibold">
          Build & Brand — Makeup Brands Price List
        </p>
        <p className="text-pink-600 font-bold mt-2">
          Discover authentic brands at the best prices in Cameroon!
        </p>
        <p className="text-gray-600 mt-1">
          Brands: {allBrands}. Categories: {allGenres}.
        </p>
      </section>

      {/* FAQ block with commercial long-tail targets */}
      <section className="max-w-4xl mx-auto bg-white border border-pink-200 rounded-lg shadow p-6 space-y-4">
        <h2 className="text-2xl font-bold text-pink-600">Brand FAQs</h2>
        <details className="p-3 bg-pink-50 rounded">
          <summary className="font-semibold text-gray-800">Do you deliver NYX, MAC, and Estée Lauder nationwide in Cameroon?</summary>
          <p className="text-gray-700 mt-2">Yes. We ship from Douala to cities nationwide. Delivery is fast and payment is 100% secure online.</p>
        </details>
        <details className="p-3 bg-pink-50 rounded">
          <summary className="font-semibold text-gray-800">Are the products authentic?</summary>
          <p className="text-gray-700 mt-2">All items are 100% authentic. We publish FCFA price lists for transparency and keep popular items marked In stock.</p>
        </details>
        <details className="p-3 bg-pink-50 rounded">
          <summary className="font-semibold text-gray-800">How can I find my foundation shade?</summary>
          <p className="text-gray-700 mt-2">Open any brand page and filter by category. For Estée Lauder Double Wear or MAC Studio Fix, contact support for a quick shade guide.</p>
        </details>
      </section>

      {/* Contact */}
      <section className="mt-12 md:mt-16 bg-pink-100 rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          Contact Us — Buy Top Makeup Brands in Cameroon
        </h2>
        <p className="text-gray-700 mb-4">
          For orders, enquiries, or partnership with authentic brands (NYX, LA Girl, JUVIA, ONE SIZE, BOBBI BROWN,
          SMASHBOX, ELF, ESTEE LAUDER, MAC, CLINIC, and more), reach out to {SITE_NAME}. We supply genuine products
          at the best FCFA prices in Douala and nationwide.
        </p>
        <div className="flex flex-col items-center gap-2">
          <a
            href="tel:+237655225569"
            className="font-bold text-pink-600 hover:text-pink-500 underline"
            title="Call Essentialist Makeup Store"
          >
            Call/WhatsApp: +237 655 22 55 69
          </a>
          <a
            href="mailto:info@esmakeupstore.com"
            className="font-bold text-pink-600 hover:text-pink-500 underline"
            title="Email Essentialist Makeup Store"
          >
            Email: info@esmakeupstore.com
          </a>
          <a
            href="https://www.facebook.com/login/?next=https%3A%2F%2Fwww.facebook.com%2Fesmakeupstore"
            className="text-sm text-blue-700 underline"
            title="Visit our Facebook page (login required)"
          >
            Facebook
          </a>
        </div>
        <p className="mt-4 text-gray-600 text-sm">
          Visit us in Bonamoussadi, Carrefour Maçon — Douala. Fast delivery, secure payment, and expert advice on all major makeup brands.
        </p>
      </section>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Do you deliver NYX, MAC, and Estée Lauder nationwide in Cameroon?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes. We ship from Douala to cities nationwide. Delivery is fast and payment is 100% secure online.',
                },
              },
              {
                '@type': 'Question',
                name: 'Are the products authentic?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'All items are 100% authentic. We publish FCFA price lists for transparency and keep popular items marked In stock.',
                },
              },
              {
                '@type': 'Question',
                name: 'How can I find my foundation shade?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Open any brand page and filter by category. For Estée Lauder Double Wear or MAC Studio Fix, contact support for a quick shade guide.',
                },
              },
            ],
          }),
        }}
      />
    </main>
  )
}