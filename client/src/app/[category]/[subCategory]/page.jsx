// src/app/[category]/[subCategory]/page.jsx
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import CardProduct from '@/components/CardProduct'
import Loading from '@/components/Loading' // kept referenced in case you wrap with Suspense
import { valideURLConvert } from '@/utils/valideURLConvert'

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

// Server fetchers (SSR)
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

async function fetchCategories() {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
      method: SummaryApi.getCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Failed to fetch categories')
    const data = await res.json()
    return safeArray(data?.data || data)
  } catch (e) {
    console.error('fetchCategories error:', e)
    return []
  }
}

// ---------- Dynamic SEO ----------
export async function generateMetadata({ params, searchParams }) {
  const categorySlug = params?.category
  const subCategorySlug = params?.subCategory
  const page = Number(searchParams?.page || 1)

  const categoryId = parseIdFromSlug(categorySlug)
  const subCategoryId = parseIdFromSlug(subCategorySlug)
  const categoryName = parseNameFromSlug(categorySlug)
  const subCategoryName = parseNameFromSlug(subCategorySlug)

  if (!categoryId || !subCategoryId) {
    return {
      title: 'Products - EssentialisMakeupStore',
      description: 'Explore our curated selection of makeup and beauty products.',
      robots: { index: false, follow: true },
    }
  }

  // Fetch some data for better SEO text
  const [{ products, totalCount }] = await Promise.all([
    fetchProductsByCatSub({ categoryId, subCategoryId, page }),
  ])

  const titleBase = subCategoryName || 'Products'
  const paginationSuffix = page > 1 ? ` | Page ${page}` : ''
  // const title = `${titleBase} - ${categoryName} | EssentialisMakeupStore${paginationSuffix}`
  const title = `Best ${titleBase} Makeup ${paginationSuffix}`

  const desc =
    products?.length
      ? `Shop ${subCategoryName} in ${categoryName}. Discover ${products.length} of ${totalCount} products available.`
      : `Browse ${subCategoryName} in ${categoryName} at EssentialisMakeupStore.`

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
      subCategoryName,
      categoryName,
      'makeup',
      'cosmetics',
      'beauty',
      'Cameroon makeup',
      'Douala beauty',
      'EssentialisMakeupStore',
    ],
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'EssentialisMakeupStore',
      url: canonical,
      title,
      description: stripHtml(desc).slice(0, 300),
      images: [{ url: ogImage, width: 1200, height: 630, alt: titleBase }],
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
function StructuredData({ categorySlug, subCategorySlug, subCategoryName }) {
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
    name: `${subCategoryName} - EssentialisMakeupStore`,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'EssentialisMakeupStore',
      url: 'https://www.esmakeupstore.com/',
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
    </>
  )
}

// ---------- Page (SSR) ----------
export default async function ProductListPage({ params, searchParams }) {
  const categorySlug = params?.category
  const subCategorySlug = params?.subCategory
  const page = Number(searchParams?.page || 1)

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

  return (
    <>
      <StructuredData
        categorySlug={categorySlug}
        subCategorySlug={subCategorySlug}
        subCategoryName={subCategoryName}
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
                return (
                  <Link
                    key={s?._id + '-' + index}
                    href={link}
                    className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b hover:bg-green-100 transition-colors duration-200 ${isActive ? 'bg-green-100' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s?.image}
                      alt={s?.name}
                      className="w-14 lg:h-14 lg:w-12 h-full object-scale-down"
                      loading="lazy"
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
              <h1 className="font-semibold">{subCategoryName || 'Products'}</h1>
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