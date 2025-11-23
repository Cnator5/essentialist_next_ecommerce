import Link from 'next/link'
import { notFound } from 'next/navigation'
import CardProduct from '../../../components/CardProduct'
import { valideURLConvert } from '../../../utils/valideURLConvert'
import Image from 'next/image'

const baseURL = process.env.NEXT_PUBLIC_API_URL
const PAGE_SIZE = 8

const SummaryApi = {
  getSubCategory: { url: '/api/subcategory/get', method: 'post' },
  getProductByCategoryAndSubCategory: {
    url: '/api/product/get-product-by-category-and-subcategory',
    method: 'post',
  },
  getCategory: { url: '/api/category/get', method: 'get' },
}

const OBJECT_ID_REGEX = /^[0-9a-f]{24}$/i

function parseIdFromSlug(slug) {
  if (!slug) return null
  const parts = String(slug).split('-')
  const candidate = parts[parts.length - 1]
  return OBJECT_ID_REGEX.test(candidate) ? candidate : null
}

function parseNameFromSlug(slug) {
  if (!slug) return ''
  const parts = String(slug).split('-')
  return parts.slice(0, parts.length - 1).join(' ')
}

function safeArray(v) {
  return Array.isArray(v) ? v : []
}

function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

const subCategoryBestTitles = {
  Foundation: 'Transfer Proof Foundation For Masks',
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
  Concealer: 'Full Coverage Concealer For Dark Circles',
  'Concealers & Neutralizers': 'Peach Color Corrector For Dark Circles',
  'Dark circle concealer': 'Orange Concealer For Dark Circles',
  'Blush Makeup': 'Cream Blush For Mature Skin That Doesn’t Settle',
  'All Blush': 'Best Affordable Blush For Fair Skin',
  'High Definition Blush': 'HD Cream Blush For Camera Ready Look',
  'Highlighters & Luminizers': 'Subtle Highlighter For Mature Skin',
  Illuminator: 'Liquid Illuminator Under Foundation',
  'Liquid highlighter': 'Dewy Liquid Highlighter For Natural Glow',
  Bronzy: 'Subtle Bronzy Makeup Look Products',
  'Bronzy Powder': 'Warm Bronzer Powder For Olive Skin',
  'Matte bronzer': 'Matte Bronzer For Fair Cool Undertone',
  'Eye Makeup': 'Everyday Eye Makeup Kit For Beginners',
  'Eye Shadow': 'Neutral Eyeshadow For Blue Eyes',
  'Eye Shadow Palette': 'Mini Eyeshadow Palette For Travel',
  Eyeliner: 'Smudge Proof Eyeliner For Oily Lids',
  Kajal: 'Long Lasting Kajal For Watery Eyes',
  Mascara: 'Tubing Mascara For Short Lashes',
  'Eye Cream & Treatment': 'Eye Cream For Dark Circles And Puffiness Under $30',
  'EYE CREAM': 'Fragrance Free Eye Cream For Sensitive Skin',
  'Eye Serum': 'Retinol Eye Serum For Fine Lines',
  'Eye brow cake powder': 'Eyebrow Cake Powder For Sparse Brows',
  'Eye Brow Enhancers': 'Tinted Brow Gel For Thin Eyebrows',
  'Lip Makeup': 'Lip Makeup Set Gift For Her',
  Lipstick: 'Transfer Proof Lipstick For Weddings',
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
  'Makeup Palettes': 'All In One Makeup Palette With Mirror',
  'Makeup Sets': 'Beginner Makeup Set With Bag',
  'Makeup Kits': 'Travel Makeup Kit Essentials',
  'Face Makeup': 'Beginner Face Makeup Kit With Brushes',
  Compact: 'Compact Powder For Oily Skin Long Lasting',
  'Loose Powder': 'Talc Free Loose Setting Powder',
}

function bestSeoTitleForSubcategory(subCategoryName = '') {
  if (subCategoryBestTitles[subCategoryName]) return subCategoryBestTitles[subCategoryName]
  const key = Object.keys(subCategoryBestTitles).find(
    (k) => k.toLowerCase() === String(subCategoryName).toLowerCase(),
  )
  if (key) return subCategoryBestTitles[key]
  return `${subCategoryName} buy online in Cameroon`
}

async function fetchSubCategories() {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
      method: SummaryApi.getSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      cache: 'no-store',
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
  if (!OBJECT_ID_REGEX.test(categoryId) || !OBJECT_ID_REGEX.test(subCategoryId)) {
    console.warn('Skipping product fetch due to invalid IDs', {
      categoryId,
      subCategoryId,
    })
    return { products: [], totalCount: 0 }
  }

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
      cache: 'no-store',
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

export async function generateMetadata({ params, searchParams }) {
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

  const [{ products, totalCount }] = await Promise.all([
    fetchProductsByCatSub({ categoryId, subCategoryId, page }),
  ])

  const commercialTitle = bestSeoTitleForSubcategory(subCategoryName)
  const title = `${commercialTitle} | ${subCategoryName}`

  const desc = products?.length
    ? `Shop ${subCategoryName} in ${categoryName} at EssentialistMakeupStore. Discover ${products.length} of ${totalCount} products available with nationwide shipping, secure online payment, and great prices.`
    : `Browse ${subCategoryName} in ${categoryName} at EssentialistMakeupStore. Fast Cameroon-wide delivery and secure checkout.`

  const canonical = `https://www.esmakeupstore.com/${categorySlug}/${subCategorySlug}${
    page > 1 ? `?page=${page}` : ''
  }`

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

export default async function ProductListPage({ params, searchParams }) {
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

  const [allSubCategories, { products, totalCount }] = await Promise.all([
    fetchSubCategories(),
    fetchProductsByCatSub({ categoryId, subCategoryId, page }),
  ])

  const displaySubCategory = safeArray(
    allSubCategories.filter((s) => safeArray(s?.category).some((c) => c?._id === categoryId)),
  )

  const totalPages = Math.max(1, Math.ceil((Number(totalCount) || 0) / PAGE_SIZE))
  const hasMore = page < totalPages

  const basePath = `/${categorySlug}/${subCategorySlug}`
  const nextHref = hasMore ? `${basePath}?page=${page + 1}` : null

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
          <aside
            className="min-h-[88vh] max-h-[88vh] overflow-y-scroll grid gap-1 shadow-md scrollbarCustom bg-white py-2"
            aria-label="Subcategories"
          >
            {displaySubCategory.length > 0 ? (
              displaySubCategory.map((s, index) => {
                const categoryNameForSlug =
                  typeof s?.category?.[0] === 'string'
                    ? s?.category?.[0]
                    : s?.category?.[0]?.name || ''
                const categoryIdForSlug =
                  typeof s?.category?.[0] === 'string'
                    ? s?.category?.[0]
                    : s?.category?.[0]?._id

                const link = `/${valideURLConvert(categoryNameForSlug)}-${categoryIdForSlug}/${valideURLConvert(
                  s?.name,
                )}-${s?._id}`
                const isActive = String(subCategoryId) === String(s?._id)
                const subBest = bestSeoTitleForSubcategory(s?.name)
                return (
                  <Link
                    key={`${s?._id}-${index}`}
                    href={link}
                    title={subBest}
                    scroll
                    className={`group relative w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-100 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                      isActive
                        ? 'bg-secondary-200/10 text-secondary-100 border-secondary-200'
                        : 'hover:bg-secondary-200/5'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                    prefetch={false}
                  >
                    <Image
                      src={s?.image}
                      alt={s?.name}
                      className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                      loading="lazy"
                      width={56}
                      height={56}
                    />
                    <p
                      className={`-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base sm:text-sm font-semibold py-6 lg:py-0 transition-colors duration-200 ${
                        isActive ? 'text-secondary-100' : 'text-primary'
                      }`}
                    >
                      {s?.name}
                    </p>
                    {!isActive && (
                      <span className="pointer-events-none absolute inset-y-2 left-0 w-1 rounded-full bg-transparent group-focus-visible:bg-secondary-100 group-hover:bg-secondary-100/40 transition-colors" />
                    )}
                    {isActive && (
                      <span className="pointer-events-none absolute inset-y-2 left-0 w-1 rounded-full bg-secondary-100" />
                    )}
                  </Link>
                )
              })
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">No subcategories found</div>
            )}
          </aside>

          <section className="sticky top-20">
            <header className="bg-white shadow-md p-4 z-10">
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

            <section
              key={`${subCategoryId}-${page}`}
              className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative"
            >
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9M16 13v2a2 2 0 01-2 2h-2m0 0H9m3 0v-2M9 13h2"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">No products found</h2>
                  <p className="text-gray-500">There are no products in this category yet.</p>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4 gap-4" role="list">
                    {products.map((p, index) => (
                      <li key={`${p?._id}-productSubCategory-${index}`}>
                        <CardProduct data={p} />
                      </li>
                    ))}
                  </ul>

                  {hasMore && (
                    <nav className="p-4 text-center" aria-label="Pagination">
                      <Link
                        href={nextHref}
                        className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
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