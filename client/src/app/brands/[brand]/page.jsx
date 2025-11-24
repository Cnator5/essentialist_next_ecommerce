import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { valideURLConvert } from '../../../utils/valideURLConvert'

const SITE_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'
const DEFAULT_OG_IMAGE =
  'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'

const RAW_API_BASE = (process.env.NEXT_PUBLIC_API_URL || '').trim()
const API_BASE = RAW_API_BASE.replace(/\/$/, '')
const IS_EXPORT_MODE = process.env.NEXT_EXPORT === 'true'
const IS_LOCALHOST_API = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(API_BASE)
const CAN_USE_REMOTE_API = Boolean(API_BASE) && !(IS_EXPORT_MODE && IS_LOCALHOST_API)

const DEFAULT_BRAND_DESCRIPTION =
  'Shop authentic makeup with FCFA pricing. Fast delivery in Douala & nationwide across Cameroon.'
const BUILD_VALIDATION_PLACEHOLDER = '__build-validation__'

// ---------- Fetch helpers ----------

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
  if (product?._id && typeof product._id === 'string' && !raw.includes(product._id)) {
    return `${raw}-${product._id}`
  }
  return raw
}

function FCFA(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—'
  return `${amount.toLocaleString('en-US')} FCFA`
}

function extractSubCategory(product = {}) {
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

function extractPrice(product = {}, role) {
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

function normalizeProductRow(product = {}) {
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
    id:
      product?._id ||
      product?.id ||
      `${brandSlug}-${product?.name || 'item'}`,
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

function getSubCatInfo(allSubCategory = [], row = {}) {
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
        sub?.name?.trim()?.toLowerCase() ===
        row.subCategoryName.trim().toLowerCase()
    )
    if (foundByName) return foundByName
  }

  return null
}

function getCategoryLinkMeta(allCategory = [], allSubCategory = [], row = {}) {
  const subCat = getSubCatInfo(allSubCategory, row)
  if (!subCat) return null

  let mainCat = null

  if (Array.isArray(subCat.category) && subCat.category.length) {
    mainCat = Array.isArray(allCategory)
      ? allCategory.find(
          (cat) =>
            cat?._id === subCat.category[0]?._id ||
            cat?._id === subCat.category[0]
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
            cat?.name?.trim()?.toLowerCase() ===
            row.categoryName.trim().toLowerCase()
        )
      : null
  }

  if (!mainCat) return null
  return { mainCat, subCat }
}

function buildSubCatUrl(mainCat = {}, subCat = {}) {
  if (!mainCat?._id || !subCat?._id) return '#'
  return `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(
    subCat.name
  )}-${subCat._id}`
}

function computeBrandMetrics(productRows = []) {
  const rows = Array.isArray(productRows) ? productRows : []
  const totalProducts = rows.length
  const sellPrices = rows
    .map((row) => row.sellingPrice)
    .filter((value) => typeof value === 'number')
  const bulkPrices = rows
    .map((row) => row.bulkPrice)
    .filter((value) => typeof value === 'number')

  const avgSellingPrice = sellPrices.length
    ? Math.round(
        sellPrices.reduce((sum, value) => sum + value, 0) / sellPrices.length
      )
    : undefined

  const avgBulkPrice = bulkPrices.length
    ? Math.round(
        bulkPrices.reduce((sum, value) => sum + value, 0) / bulkPrices.length
      )
    : undefined

  const totalValue = sellPrices.reduce((sum, value) => sum + value, 0)

  const categories = Array.from(
    new Set(rows.map((row) => row.categoryName).filter(Boolean))
  ).sort()

  const subCategories = Array.from(
    new Set(rows.map((row) => row.subCategoryName).filter(Boolean))
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

function BrandStructuredData({ brand = {}, products = [] }) {
  if (!brand?.name) return null

  const brandSlug = brand.slug || createBrandSlug(brand.name || '')
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
    name: `${brand.name}`,
    numberOfItems: Array.isArray(products) ? products.length : 0,
    itemListElement: (Array.isArray(products) ? products : []).slice(0, 20).map(
      (product, index) => ({
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
      })
    )
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

function BrandNavigation({ brands = [], currentSlug }) {
  if (!Array.isArray(brands) || brands.length === 0) return null

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Shop by Brand:
      </h3>
      <div className="flex flex-wrap gap-2">
        <Link
          href="/brands"
          className="px-4 py-2 rounded-full border transition-colors bg-gray-100 text-gray-700 border-gray-300 hover:bg-pink-50 hover:border-pink-300"
        >
          All Brands
        </Link>
        {brands.map((brand) => {
          const slug = brand.slug || createBrandSlug(brand.name || '')
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
  if (!CAN_USE_REMOTE_API) return []

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
  if (!CAN_USE_REMOTE_API || !slug) return null

  const directPayload = await fetchJson(
    `${API_BASE}/api/brand/${encodeURIComponent(slug)}?includeProducts=true`,
    { cache: 'no-store' }
  )

  const direct = directPayload?.data || directPayload?.brand || directPayload

  if (direct) return direct

  const brands = await fetchBrandCollection()
  const fallback = brands.find((brand) => {
    const candidateSlug =
      brand.slug || createBrandSlug(brand.name || brand.title || '')
    return candidateSlug === slug
  })

  return fallback || null
}

async function fetchProductsByBrand(brand) {
  if (!CAN_USE_REMOTE_API || !brand) return []

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
  if (!CAN_USE_REMOTE_API) return []
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
  if (!CAN_USE_REMOTE_API) return []
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
  if (!CAN_USE_REMOTE_API) {
    return [{ brand: BUILD_VALIDATION_PLACEHOLDER }]
  }

  try {
    const brands = await fetchBrandCollection()
    const params = Array.from(
      new Set(
        brands
          .map((brand) => brand.slug || createBrandSlug(brand.name || brand._id || ''))
          .filter(Boolean)
      )
    ).map((brand) => ({ brand }))

    if (params.length > 0) {
      return params
    }
  } catch (error) {
    console.warn(
      'generateStaticParams failed to resolve brand list. Falling back to placeholder.',
      error
    )
  }

  return [{ brand: BUILD_VALIDATION_PLACEHOLDER }]
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const brandSlug = resolvedParams?.brand

  if (
    !brandSlug ||
    brandSlug === BUILD_VALIDATION_PLACEHOLDER ||
    !CAN_USE_REMOTE_API
  ) {
    const fallbackSlug = brandSlug && brandSlug !== BUILD_VALIDATION_PLACEHOLDER
      ? brandSlug.replace(/-/g, ' ')
      : 'Brand not found'

    return {
      metadataBase: new URL(SITE_URL),
      title: `${fallbackSlug} | ${SITE_NAME}`,
      description:
        CAN_USE_REMOTE_API
          ? 'This brand is not available in our store.'
          : 'Brand catalog is unavailable during static export while NEXT_PUBLIC_API_URL points to localhost.',
      robots: { index: false, follow: false },
      alternates: brandSlug
        ? { canonical: `${SITE_URL}/brands/${brandSlug}` }
        : undefined
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
    const productRows = Array.isArray(productsRaw)
      ? productsRaw.map(normalizeProductRow)
      : []
    const metrics = computeBrandMetrics(productRows)

    const title = `${brand.name}`
    const plainBrandDescription = stripMarkdown(
      brand.description || brand.shortDescription || ''
    )

    const description = plainBrandDescription
      ? `${plainBrandDescription} Shop authentic ${brand.name} makeup with FCFA prices. ${metrics.totalProducts} products available including ${
          metrics.subCategories.length
            ? metrics.subCategories.slice(0, 5).join(', ')
            : 'top-rated essentials'
        }. Fast delivery in Douala & nationwide.`
      : `Shop authentic ${brand.name} makeup with FCFA prices. ${metrics.totalProducts} products available including ${
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
        `${brand.name}`,
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
            alt: `${brand.name}`
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
      title: `${brandSlug} | ${SITE_NAME}`,
      description: DEFAULT_BRAND_DESCRIPTION,
      robots: { index: false, follow: false },
      openGraph: {
        type: 'website',
        siteName: SITE_NAME,
        url: `${SITE_URL}/brands/${brandSlug}`,
        title: `${brandSlug} | ${SITE_NAME}`,
        description: DEFAULT_BRAND_DESCRIPTION,
        images: [
          {
            url: DEFAULT_OG_IMAGE,
            width: 1200,
            height: 630,
            alt: 'Essentialist Makeup Store'
          }
        ],
        locale: 'en_US'
      },
      twitter: {
        card: 'summary_large_image',
        images: [DEFAULT_OG_IMAGE]
      }
    }
  }
}

export default async function BrandPage({ params }) {
  const { brand } = await params
  if (!brand || brand === BUILD_VALIDATION_PLACEHOLDER) {
    notFound()
  }

  if (!CAN_USE_REMOTE_API) {
    return <ApiUnavailableNotice brandSlug={brand} />
  }

  return (
    <Suspense fallback={<BrandPageFallback />}>
      <BrandContent brandSlug={brand} />
    </Suspense>
  )
}

async function BrandContent({ brandSlug }) {
  if (!CAN_USE_REMOTE_API) {
    return <ApiUnavailableNotice brandSlug={brandSlug} />
  }

  const brandData = await fetchBrandBySlug(brandSlug)
  if (!brandData) {
    return (
      <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
        <section className="max-w-4xl mx-auto text-center bg-white border border-pink-200 rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold text-pink-500">Brand temporarily unavailable</h1>
          <p className="mt-4 text-gray-600">
            We couldn’t load brand details right now. Please ensure the API is reachable and try
            again.
          </p>
          <Link
            href="/brands"
            className="inline-flex mt-6 px-6 py-3 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            Back to all brands
          </Link>
        </section>
      </main>
    )
  }

  const [productsRaw, allBrands, allCategory, allSubCategory] = await Promise.all([
    fetchProductsByBrand(brandData),
    fetchBrandCollection(),
    getCategories(),
    getSubCategories()
  ])

  const productRows = Array.isArray(productsRaw)
    ? productsRaw.map(normalizeProductRow)
    : []
  const metrics = computeBrandMetrics(productRows)

  const currentSlug = brandData.slug || createBrandSlug(brandData.name || '')
  const brandForNavigation = Array.isArray(allBrands)
    ? allBrands.map((brand) => ({
        ...brand,
        slug: brand.slug || createBrandSlug(brand.name || '')
      }))
    : []

  const plainBrandDescription = stripMarkdown(
    brandData.description || brandData.shortDescription || ''
  )

  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <BrandStructuredData brand={brandData} products={productRows} />

      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">
          {String(brandData.name || '').toUpperCase()} MAKEUP
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

function ApiUnavailableNotice({ brandSlug }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-50 to-white px-4 py-16">
      <section className="max-w-3xl w-full bg-white border border-pink-200 rounded-2xl shadow-lg p-8 space-y-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
          Brand catalog skipped during static export
        </h1>
        <p className="text-gray-700">
          `next export` is running with <code className="px-2 py-1 bg-gray-100 rounded">NEXT_PUBLIC_API_URL</code>{' '}
          pointing to <code className="px-2 py-1 bg-gray-100 rounded">localhost</code>. Because that API
          isn’t reachable to the build worker, remote fetches are disabled to let the export finish.
        </p>
        {brandSlug && (
          <p className="text-sm text-gray-600">
            Requested brand slug: <code>{brandSlug}</code>
          </p>
        )}
        <ol className="text-left text-gray-700 list-decimal list-inside space-y-2">
          <li>Expose the API on a publicly reachable URL or tunnel (e.g. via ngrok) and set <code>NEXT_PUBLIC_API_URL</code> to that host before building.</li>
          <li>Or skip <code>next export</code> and deploy with <code>next build && next start</code> so the server can fetch data at runtime.</li>
          <li>Or ship the export knowing these routes will show this notice until hydrated with client-side data.</li>
        </ol>
      </section>
    </main>
  )
}

function BrandPageFallback() {
  return (
    <main className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <section className="max-w-4xl mx-auto animate-pulse">
        <div className="h-10 bg-pink-200/60 rounded w-2/3 mx-auto mb-4" />
        <div className="h-4 bg-pink-100/80 rounded w-1/2 mx-auto mb-8" />
        <div className="h-24 bg-white rounded-lg shadow-sm mb-6" />
        <div className="h-72 bg-white rounded-lg shadow-sm" />
      </section>
    </main>
  )
}