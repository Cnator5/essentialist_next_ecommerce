// // src/app/brands/[brand]/page.jsx
// import Link from 'next/link'
// import { notFound } from 'next/navigation'
// import { valideURLConvert } from '../../../utils/valideURLConvert'
// // 
// const SITE_URL = 'https://www.esmakeupstore.com'
// const SITE_NAME = 'Essentialist Makeup Store'
// const OG_IMAGE = 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

// // Your existing product data (same as in brands/page.jsx)
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

// // Get unique brands
// const getAllBrands = () => {
//   return Array.from(new Set(makeupProducts.map(p => p.brand))).sort()
// }

// // Get products by brand
// const getProductsByBrand = (brandName) => {
//   return makeupProducts.filter(p => 
//     p.brand.toLowerCase() === brandName.toLowerCase()
//   )
// }

// // Brand name formatting
// const formatBrandName = (brand) => {
//   const brandMap = {
//     'nyx': 'NYX',
//     'la-girl': 'LA girl',
//     'elf': 'ELF',
//     'smashbox': 'SMASHBOX',
//     'bobbi-brown': 'BOBBI BROWN',
//     'too-faced': 'TOO FACED',
//     'estee-lauder': 'ESTEE LAUDER',
//     'mac': 'MAC',
//     'clinic': 'CLINIC',
//     'one-size': 'ONE SIZE',
//     'juvia': 'JUVIA'
//   }
//   return brandMap[brand.toLowerCase()] || brand.toUpperCase()
// }

// const createBrandSlug = (brand) => {
//   return brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
// }

// // API functions (same as your existing ones)
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

// // Helper functions
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

// // Generate static params for all brands
// export async function generateStaticParams() {
//   const brands = getAllBrands()
//   return brands.map((brand) => ({
//     brand: createBrandSlug(brand)
//   }))
// }

// // Dynamic metadata
// export async function generateMetadata({ params }) {
//   const brandSlug = params?.brand
//   const brandName = formatBrandName(brandSlug)
//   const products = getProductsByBrand(brandName)
  
//   if (products.length === 0) {
//     return {
//       title: 'Brand not found',
//       description: 'This brand is not available in our store.',
//       robots: { index: false, follow: false },
//     }
//   }

//   const productCount = products.length
//   const genres = Array.from(new Set(products.map(p => p.genre))).slice(0, 5).join(', ')
  
//   const title = `${brandName} Makeup Products - ${productCount} Items`
//   const description = `Shop authentic ${brandName} makeup in Cameroon. ${productCount} products available including ${genres}. Best prices, fast delivery in Douala & nationwide.`
  
//   const canonical = `${SITE_URL}/brands/${brandSlug}`

//   return {
//     metadataBase: new URL(SITE_URL),
//     title,
//     description,
//     keywords: [
//       `${brandName} makeup`,
//       `${brandName} Cameroon`,
//       `${brandName} price list`,
//       'authentic makeup',
//       'Douala makeup store',
//       ...genres.split(', ').map(g => `${brandName} ${g}`),
//     ],
//     robots: { index: true, follow: true },
//     alternates: { canonical },
//     openGraph: {
//       type: 'website',
//       siteName: SITE_NAME,
//       url: canonical,
//       title,
//       description,
//       images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${brandName} makeup products` }],
//       locale: 'en_US',
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: [OG_IMAGE],
//     },
//   }
// }

// // Structured data for brand page
// function BrandStructuredData({ brandName, products }) {
//   const brandJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'Brand',
//     name: brandName,
//     url: `${SITE_URL}/brands/${createBrandSlug(brandName)}`,
//   }

//   const productListJsonLd = {
//     '@context': 'https://schema.org',
//     '@type': 'ItemList',
//     name: `${brandName} Makeup Products`,
//     numberOfItems: products.length,
//     itemListElement: products.slice(0, 20).map((product, index) => ({
//       '@type': 'ListItem',
//       position: index + 1,
//       item: {
//         '@type': 'Product',
//         name: product.product,
//         brand: { '@type': 'Brand', name: product.brand },
//         category: product.genre,
//         offers: {
//           '@type': 'Offer',
//           priceCurrency: 'XAF',
//           price: String(product.sell || product.price || 0),
//           availability: 'https://schema.org/InStock',
//         },
//       },
//     })),
//   }

//   return (
//     <>
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }} />
//       <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }} />
//     </>
//   )
// }

// // Brand navigation component
// function BrandNavigation({ currentBrand }) {
//   const allBrands = getAllBrands()
  
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
//         {allBrands.map((brand) => (
//           <Link
//             key={brand}
//             href={`/brands/${createBrandSlug(brand)}`}
//             className={`px-4 py-2 rounded-full border transition-colors ${
//               currentBrand === brand 
//                 ? 'bg-pink-500 text-white border-pink-500' 
//                 : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
//             }`}
//           >
//             {brand}
//           </Link>
//         ))}
//       </div>
//     </div>
//   )
// }

// // Main brand page component
// export default async function BrandPage({ params }) {
//   const brandSlug = params?.brand
//   const brandName = formatBrandName(brandSlug)
//   const products = getProductsByBrand(brandName)
  
//   if (products.length === 0) {
//     return notFound()
//   }

//   const [allCategory, allSubCategory] = await Promise.all([getCategories(), getSubCategories()])
  
//   const genres = Array.from(new Set(products.map(p => p.genre)))
//   const totalProducts = products.length
//   const avgPrice = Math.round(products.reduce((sum, p) => sum + (p.sell || p.price || 0), 0) / products.length)
//   const totalValue = products.reduce((sum, p) => sum + (p.sell || p.price || 0), 0)

//   return (
//     <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
//       <BrandStructuredData brandName={brandName} products={products} />
      
//       <header className="text-center mb-8">
//         <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
//           {brandName} MAKEUP
//         </h1>
//         <p className="text-lg md:text-2xl text-gray-700 font-semibold">
//           Authentic {brandName} Products in Cameroon
//         </p>
//         <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-pink-600">{totalProducts}</p>
//             <p className="text-sm text-gray-600">Products Available</p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-green-600">{FCFA(avgPrice)}</p>
//             <p className="text-sm text-gray-600">Average Price</p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
//             <p className="text-2xl font-bold text-blue-600">{genres.length}</p>
//             <p className="text-sm text-gray-600">Categories</p>
//           </div>
//         </div>
//         <p className="text-gray-600 mt-4">
//           Categories: {genres.slice(0, 8).join(', ')}{genres.length > 8 ? '...' : ''}
//         </p>
//       </header>

//       <BrandNavigation currentBrand={brandName} />

//       <section aria-labelledby="brand-products" className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white">
//         <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
//           <h2 id="brand-products" className="text-xl font-bold">
//             Complete {brandName} Product Catalog
//           </h2>
//           <p className="text-pink-100 text-sm mt-1">
//             All {totalProducts} authentic {brandName} products with current pricing
//           </p>
//         </div>
        
//         <table className="min-w-full text-sm md:text-base">
//           <thead>
//             <tr className="bg-pink-100 text-black">
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Product</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Category</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Bulk Price</th>
//               <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Selling Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((item, idx) => {
//               const found = getMainAndSubCat(allCategory, allSubCategory, item.genre)
//               const isLink = !!found
//               const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
//               return (
//                 <tr key={`${item.product}-${idx}`} className={rowClass}>
//                   <td className="py-3 px-2 md:px-4 font-semibold text-gray-900">{item.product}</td>
//                   <td className="py-3 px-2 md:px-4">
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
//                   <td className="py-3 px-2 md:px-4 text-right font-bold text-green-600">{FCFA(item.bulk)}</td>
//                   <td className="py-3 px-2 md:px-4 text-right font-bold text-pink-600">
//                     {FCFA(item.sell ?? item.price)}
//                   </td>
//                 </tr>
//               )
//             })}
//           </tbody>
//         </table>
//       </section>

//       <section className="mt-12 bg-pink-100 rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto text-center">
//         <h2 className="text-2xl font-bold text-pink-600 mb-2">
//           Order {brandName} Products Now
//         </h2>
//         <p className="text-gray-700 mb-4">
//           Get authentic {brandName} makeup delivered to your doorstep in Cameroon. 
//           All products are genuine with best prices guaranteed. Fast delivery nationwide.
//         </p>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//           <div className="bg-white rounded-lg p-4 border border-pink-200">
//             <h3 className="font-semibold text-gray-800 mb-2">Why Choose Us?</h3>
//             <ul className="text-sm text-gray-600 space-y-1">
//               <li>✓ 100% Authentic {brandName} products</li>
//               <li>✓ Best prices in Cameroon</li>
//               <li>✓ Fast delivery in Douala</li>
//               <li>✓ Secure payment options</li>
//             </ul>
//           </div>
//           <div className="bg-white rounded-lg p-4 border border-pink-200">
//             <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
//             <div className="text-sm text-gray-600 space-y-1">
//               <p>📞 +237 655 22 55 69</p>
//               <p>📧 info@esmakeupstore.com</p>
//               <p>📍 Douala, Cameroon</p>
//               <p>🕐 Mon-Fri: 9am-5:30pm</p>
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
//           <a
//             href="tel:+237655225569"
//             className="w-full sm:w-auto bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors"
//             title={`Call to order ${brandName} products`}
//           >
//             📞 Call Now: +237 655 22 55 69
//           </a>
//           <a
//             href="mailto:info@esmakeupstore.com"
//             className="w-full sm:w-auto bg-white text-pink-600 px-6 py-3 rounded-lg font-bold border-2 border-pink-600 hover:bg-pink-50 transition-colors"
//             title={`Email about ${brandName} products`}
//           >
//             📧 Send Email
//           </a>
//         </div>
//       </section>
//     </main>
//   )
// }







// src/app/brands/[brand]/page.jsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { valideURLConvert } from '../../../utils/valideURLConvert'

const SITE_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'
const OG_IMAGE = 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

// Product data (same list as hub)
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

// Get unique brands
const getAllBrands = () => {
  return Array.from(new Set(makeupProducts.map(p => p.brand))).sort()
}

// Get products by brand
const getProductsByBrand = (brandName) => {
  return makeupProducts.filter(p => 
    p.brand.toLowerCase() === brandName.toLowerCase()
  )
}

// Brand name formatting
const formatBrandName = (brand) => {
  const brandMap = {
    'nyx': 'NYX',
    'la-girl': 'LA girl',
    'elf': 'ELF',
    'smashbox': 'SMASHBOX',
    'bobbi-brown': 'BOBBI BROWN',
    'too-faced': 'TOO FACED',
    'estee-lauder': 'ESTEE LAUDER',
    'mac': 'MAC',
    'clinic': 'CLINIC',
    'one-size': 'ONE SIZE',
    'juvia': 'JUVIA'
  }
  return brandMap[brand.toLowerCase()] || brand.toUpperCase()
}

const createBrandSlug = (brand) => {
  return brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// API functions (same as hub)
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

// Helper functions
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

// Generate static params for all brands
export async function generateStaticParams() {
  const brands = getAllBrands()
  return brands.map((brand) => ({
    brand: createBrandSlug(brand)
  }))
}

// Dynamic metadata
export async function generateMetadata({ params }) {
  const brandSlug = params?.brand
  const brandName = formatBrandName(brandSlug)
  const products = getProductsByBrand(brandName)
  
  if (products.length === 0) {
    return {
      title: 'Brand not found',
      description: 'This brand is not available in our store.',
      robots: { index: false, follow: false },
    }
  }

  const productCount = products.length
  const genres = Array.from(new Set(products.map(p => p.genre))).slice(0, 5).join(', ')
  
  const title = `${brandName} Makeup Products in Cameroon`
  const description = `Shop authentic ${brandName} makeup with FCFA prices. ${productCount} products available including ${genres}. Fast delivery in Douala & nationwide.`

  const canonical = `${SITE_URL}/brands/${brandSlug}`

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      `${brandName} makeup`,
      `${brandName} Cameroon`,
      `${brandName} price list`,
      'authentic makeup',
      'Douala makeup store',
      ...genres.split(', ').map(g => `${brandName} ${g}`),
    ],
    robots: { index: true, follow: true },
    alternates: { canonical },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: canonical,
      title,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${brandName} makeup products` }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [OG_IMAGE],
    },
  }
}

// Structured data for brand page
function BrandStructuredData({ brandName, products }) {
  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brandName,
    url: `${SITE_URL}/brands/${createBrandSlug(brandName)}`,
  }

  const productListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brandName} Makeup Products`,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 20).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.product,
        brand: { '@type': 'Brand', name: product.brand },
        category: product.genre,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'XAF',
          price: String(product.sell || product.price || 0),
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }} />
    </>
  )
}

// Brand navigation component
function BrandNavigation({ currentBrand }) {
  const allBrands = getAllBrands()
  
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
        {allBrands.map((brand) => (
          <Link
            key={brand}
            href={`/brands/${createBrandSlug(brand)}`}
            className={`px-4 py-2 rounded-full border transition-colors ${
              currentBrand === brand 
                ? 'bg-pink-500 text-white border-pink-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300'
            }`}
          >
            {brand}
          </Link>
        ))}
      </div>
    </div>
  )
}

// Main brand page component
export default async function BrandPage({ params }) {
  const brandSlug = params?.brand
  const brandName = formatBrandName(brandSlug)
  const products = getProductsByBrand(brandName)
  
  if (products.length === 0) {
    return notFound()
  }

  const [allCategory, allSubCategory] = await Promise.all([getCategories(), getSubCategories()])
  
  const genres = Array.from(new Set(products.map(p => p.genre)))
  const totalProducts = products.length
  const avgPrice = Math.round(products.reduce((sum, p) => sum + (p.sell || p.price || 0), 0) / products.length)
  const totalValue = products.reduce((sum, p) => sum + (p.sell || p.price || 0), 0)

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <BrandStructuredData brandName={brandName} products={products} />
      
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
          {brandName} MAKEUP
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 font-semibold">
          Authentic {brandName} Products in Cameroon
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
            <p className="text-2xl font-bold text-pink-600">{totalProducts}</p>
            <p className="text-sm text-gray-600">Products Available</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
            <p className="text-2xl font-bold text-green-600">{FCFA(avgPrice)}</p>
            <p className="text-sm text-gray-600">Average Price</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-pink-200">
            <p className="text-2xl font-bold text-blue-600">{genres.length}</p>
            <p className="text-sm text-gray-600">Categories</p>
          </div>
        </div>
        <p className="text-gray-600 mt-4">
          Categories: {genres.slice(0, 8).join(', ')}{genres.length > 8 ? '...' : ''}
        </p>
      </header>

      <BrandNavigation currentBrand={brandName} />

      <section aria-labelledby="brand-products" className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white">
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4">
          <h2 id="brand-products" className="text-xl font-bold">
            Complete {brandName} Product Catalog
          </h2>
          <p className="text-pink-100 text-sm mt-1">
            All {totalProducts} authentic {brandName} products with current pricing
          </p>
        </div>
        
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-pink-100 text-black">
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Product</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-left">Category</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Bulk Price</th>
              <th scope="col" className="py-3 px-2 md:px-4 font-bold text-right">Selling Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, idx) => {
              const found = getMainAndSubCat(allCategory, allSubCategory, item.genre)
              const isLink = !!found
              const rowClass = idx % 2 === 0 ? 'bg-white' : 'bg-pink-50'
              return (
                <tr key={`${item.product}-${idx}`} className={rowClass}>
                  <td className="py-3 px-2 md:px-4 font-semibold text-gray-900">{item.product}</td>
                  <td className="py-3 px-2 md:px-4">
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
                  <td className="py-3 px-2 md:px-4 text-right font-bold text-green-600">{FCFA(item.bulk)}</td>
                  <td className="py-3 px-2 md:px-4 text-right font-bold text-pink-600">
                    {FCFA(item.sell ?? item.price)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>

      {/* SEO copy and internal links */}
      <section className="mt-8 max-w-3xl mx-auto text-center text-gray-700">
        <p>
          Looking for {brandName} in Douala? Compare FCFA prices and shop online with nationwide delivery.
          Popular picks include primers, foundations, and setting powders. Need help choosing a shade?
          <a href="mailto:info@esmakeupstore.com" className="underline text-pink-600"> Email our team</a>.
        </p>
      </section>

      {/* Contact & trust */}
      <section className="mt-12 bg-pink-100 rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-pink-600 mb-2">
          Order {brandName} Products Now
        </h2>
        <p className="text-gray-700 mb-4">
          Get authentic {brandName} makeup delivered to your doorstep in Cameroon. 
          All products are genuine with best prices guaranteed. Fast delivery nationwide.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-pink-200">
            <h3 className="font-semibold text-gray-800 mb-2">Why Choose Us?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ 100% Authentic {brandName} products</li>
              <li>✓ Best prices in Cameroon</li>
              <li>✓ Fast delivery in Douala</li>
              <li>✓ Secure payment options</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 border border-pink-200">
            <h3 className="font-semibold text-gray-800 mb-2">Contact Info</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📞 +237 655 22 55 69</p>
              <p>📧 info@esmakeupstore.com</p>
              <p>📍 Bonamoussadi, Carrefour Maçon — Douala</p>
              <p>🕐 Mon–Fri: 9am–5:30pm</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:+237655225569"
            className="w-full sm:w-auto bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors"
            title={`Call to order ${brandName} products`}
          >
            📞 Call Now: +237 655 22 55 69
          </a>
          <a
            href="mailto:info@esmakeupstore.com"
            className="w-full sm:w-auto bg-white text-pink-600 px-6 py-3 rounded-lg font-bold border-2 border-pink-600 hover:bg-pink-50 transition-colors"
            title={`Email about ${brandName} products`}
          >
            📧 Send Email
          </a>
        </div>
      </section>

      {/* FAQPage for brand */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: `Is ${brandName} available in stock?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Yes, most ${brandName} items listed here are marked In stock and ship nationwide in Cameroon.`,
                },
              },
              {
                '@type': 'Question',
                name: `How much is ${brandName} foundation in FCFA?`,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: `Prices vary by shade and line. See the table for live FCFA pricing, or contact us for assistance.`,
                },
              },
            ],
          }),
        }}
      />
    </main>
  )
}