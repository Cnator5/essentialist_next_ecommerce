import Image from 'next/image'
import { notFound } from 'next/navigation'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
import Divider from '../../../components/Divider'
import AddToCartButton from '../../../components/AddToCartButton'
import ProductRecommendations from '../../../components/ProductRecommendations'
import { DisplayPriceInRupees } from '../../../utils/DisplayPriceInRupees'
import { pricewithDiscount } from '../../../utils/PriceWithDiscount'

import image1 from '/public/assets/minute_delivery.jpeg'
import image2 from '/public/assets/Best_Prices_Offers.png'
import image3 from '/public/assets/Wide_Assortment.avif'

// -------- API config ----------
const baseURL = process.env.NEXT_PUBLIC_API_URL
const SummaryApi = {
  getProductDetails: { url: '/api/product/get-product-details', method: 'post' },
}

// -------- Helpers ----------
function extractProductId(slug) {
  if (!slug) return null
  const parts = slug.split('-')
  return parts[parts.length - 1]
}

// Basic HTML-safe fallback
function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

const tabularStyles = `
  .tabular-content {
    white-space: pre-wrap;
    font-family: 'Courier New', monospace;
    line-height: 1.8;
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    tab-size: 4;
    overflow-x: auto;
    margin: 8px 0;
  }
  .tabular-content::selection { background-color: #bfdbfe; }
  .tabular-content::-moz-selection { background-color: #bfdbfe; }
  .product-description-content { line-height: 1.6; }
  .product-description-content p { margin-bottom: 0.5rem; }
  .product-description-content ul, .product-description-content ol {
    margin-left: 1.5rem; margin-bottom: 0.5rem;
  }
  .product-description-content h1, .product-description-content h2,
  .product-description-content h3, .product-description-content h4,
  .product-description-content h5, .product-description-content h6 {
    font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;
  }
`

// Skeletons (kept minimal; SSR won't show loading states, but fine for suspense/streaming)
function ImageSkeleton() {
  return <div className="aspect-square rounded-lg bg-gray-200"></div>
}
function TextSkeleton({ width = '100%', height = 'h-4' }) {
  return <div className={`bg-gray-200 rounded ${height}`} style={{ width }} />
}
function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <ImageSkeleton />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <TextSkeleton height="h-8" width="80%" />
            <div className="mt-2 space-y-2">
              <TextSkeleton height="h-4" width="60%" />
              <TextSkeleton height="h-4" width="40%" />
            </div>
          </div>
          <div className="border-b pb-6 space-y-3">
            <TextSkeleton height="h-8" width="30%" />
            <TextSkeleton height="h-4" width="50%" />
          </div>
          <div className="border-b pb-6">
            <TextSkeleton height="h-6" width="25%" />
          </div>
          <div className="border-b pb-6">
            <div className="w-full h-12 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="space-y-3">
            <TextSkeleton height="h-6" width="30%" />
            {[...Array(3)].map((_, i) => (
              <TextSkeleton key={i} height="h-4" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ------------------------
// Server data fetcher (SSR)
// ------------------------
async function getProduct(productId) {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getProductDetails.url}`, {
      method: SummaryApi.getProductDetails.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
      // Revalidate periodically; adjust as needed
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error('Failed to fetch product details')
    const data = await res.json()
    const product = data?.data || (data?.success && data?.data) || null
    return product
  } catch (e) {
    console.error('getProduct error:', e)
    return null
  }
}

// ------------------------
// Dynamic SEO (SSR)
// ------------------------
export async function generateMetadata({ params }) {
  const slug = params?.slug
  const productId = extractProductId(slug)
  if (!productId) {
    return {
      title: 'Product not found - EssentialisMakeupStore',
      description: 'Invalid product URL',
      robots: { index: false, follow: false },
    }
  }

  const product = await getProduct(productId)
  if (!product) {
    return {
      title: 'Product not found - EssentialisMakeupStore',
      description: 'Product could not be found.',
      robots: { index: false, follow: true },
    }
  }

  const name = product?.name || 'Product'
  const descRaw =
    product?.description ||
    `Buy ${name} at the best price from EssentialisMakeupStore.`
  const description = stripHtml(descRaw).slice(0, 300)
  const img = Array.isArray(product?.image) ? product.image[0] : product?.image
  const url = `https://www.esmakeupstore.com/product/${slug}`

  return {
    metadataBase: new URL('https://www.esmakeupstore.com'),
    title: name,
    description,
    keywords: [
      name,
      'makeup',
      'beauty',
      'cosmetics',
      'EssentialisMakeupStore',
      'Cameroon makeup',
      'Douala beauty',
    ],
    alternates: { canonical: url },
    openGraph: {
      // Fix: use a valid Open Graph type per Next.js metadata API
      type: 'website',
      siteName: 'EssentialisMakeupStore',
      url,
      title: name,
      description,
      images: img ? [{ url: img, width: 1200, height: 630, alt: name }] : [],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: name,
      description,
      images: img ? [img] : [],
    },
    robots: { index: true, follow: true },
  }
}

// ------------------------
// Schema.org JSON-LD (SSR)
// ------------------------
function StructuredData({ product, slug }) {
  const url = `https://www.esmakeupstore.com/product/${slug}`
  const imgList = Array.isArray(product?.image) ? product.image : [product?.image].filter(Boolean)
  const offers = {
    '@type': 'Offer',
    priceCurrency: 'XAF',
    price: String(
      pricewithDiscount(product?.price || 0, product?.discount || 0)
    ),
    availability:
      product?.stock && product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    url,
  }

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name,
    description: stripHtml(product?.description),
    image: imgList,
    sku: product?._id || product?.sku,
    brand: product?.brand
      ? { '@type': 'Brand', name: product.brand }
      : undefined,
    offers,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.esmakeupstore.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://www.esmakeupstore.com/product',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product?.name,
        item: url,
      },
    ],
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EssentialisMakeupStore',
    url: 'https://www.esmakeupstore.com/',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.esmakeupstore.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'EssentialisMakeupStore',
    url: 'https://www.esmakeupstore.com/',
    sameAs: [
      'https://www.facebook.com/Essentialistmakeupstore',
      'https://www.tiktok.com/@essentialistmakeupstore',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'CM',
      addressLocality: 'Douala',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+237655225569',
      contactType: 'customer service',
      availableLanguage: ['en', 'fr'],
    },
  }

  const arr = [productJsonLd, breadcrumbJsonLd, websiteJsonLd, organizationJsonLd]

  return (
    <>
      {arr.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  )
}

// ------------------------
// Page (SSR)
// ------------------------
export default async function ProductDisplayPage({ params }) {
  const slug = params?.slug
  const productId = extractProductId(slug)
  if (!productId) return notFound()

  const productData = await getProduct(productId)
  if (!productData) return notFound()

  // SSR default image (no client state here)
  const currentImageIndex = 0
  const images = Array.isArray(productData.image) ? productData.image : [productData.image].filter(Boolean)
  const currentImage = images[currentImageIndex] || '/default-image.jpg'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tabularStyles }} />
      <StructuredData product={productData} slug={slug} />

      <section className="container mx-auto p-4 grid lg:grid-cols-2 text-black font-bold md:font-normal">
        <div>
          <div className="bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full">
            <Image
              src={currentImage}
              alt={productData.name}
              width={600}
              height={600}
              className="w-full h-full object-scale-down scale-100"
              priority
            />
          </div>

          <div className="flex items-center justify-center gap-3 my-2">
            {images.map((img, index) => (
              <div
                key={`point-${index}`}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${currentImageIndex === index ? 'bg-slate-300' : ''}`}
                title={`Image ${index + 1}`}
              />
            ))}
          </div>

          <div className="grid relative">
            <div className="flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none">
              {images.map((img, index) => (
                <div className="w-20 h-20 min-h-20 min-w-20 shadow-md" key={`thumb-${index}`}>
                  <Image
                    src={img}
                    alt={`Product image ${index + 1} of ${productData.name}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-scale-down"
                  />
                </div>
              ))}
            </div>
            <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center">
              <button className="z-10 bg-white relative p-1 rounded-full shadow-lg" aria-label="Scroll left">
                <FaAngleLeft />
              </button>
              <button className="z-10 bg-white relative p-1 rounded-full shadow-lg" aria-label="Scroll right">
                <FaAngleRight />
              </button>
            </div>
          </div>

          <div className="my-4 hidden lg:grid gap-3 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div>
              <p className="font-semibold">Description</p>
              <div
                className="text-base text-justify text-black product-description-content"
                dangerouslySetInnerHTML={{ __html: productData.description || '' }}
              />
            </div>
            {productData.specifications && (
              <div>
                <p className="font-semibold">Product Specifications</p>
                <div className="tabular-content">{productData.specifications}</div>
              </div>
            )}
            <div>
              <p className="font-semibold">Unit</p>
              <p className="text-base">{productData.unit}</p>
            </div>
            {productData?.more_details &&
              typeof productData.more_details === 'object' &&
              Object.keys(productData.more_details).map((element, idx) => (
                <div key={`detail-${idx}`}>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{productData.more_details[element]}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 lg:pl-7 text-base lg:text-lg">
          <p className="bg-green-300 w-fit px-2 rounded-full">10 Minutes</p>
          <h1 className="text-lg font-semibold lg:text-3xl">{productData.name}</h1>
          <p>{productData.unit}</p>
          <Divider />

          <div>
            <p>Bulk Price</p>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold text-lg lg:text-xl">
                  {DisplayPriceInRupees(
                    pricewithDiscount(
                      productData.bulkPrice || productData.price,
                      productData.discount || 0
                    )
                  )}
                </p>
              </div>
              {productData.discount > 0 && (
                <p className="line-through">{DisplayPriceInRupees(productData.price)}</p>
              )}
              {productData.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {productData.discount}% <span className="text-base text-black">Discount</span>
                </p>
              )}
            </div>
          </div>

          <div>
            <p>Price</p>
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="border border-green-600 px-4 py-2 rounded bg-green-50 w-fit">
                <p className="font-semibold text-lg lg:text-xl">
                  {DisplayPriceInRupees(
                    pricewithDiscount(productData.price, productData.discount || 0)
                  )}
                </p>
              </div>
              {productData.discount > 0 && (
                <p className="line-through">{DisplayPriceInRupees(productData.price)}</p>
              )}
              {productData.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {productData.discount}% <span className="text-base text-black">Discount</span>
                </p>
              )}
            </div>
          </div>

          {productData.stock === 0 ? (
            <p className="text-lg text-red-500 my-2">Out of Stock</p>
          ) : (
            <div className="my-4">
              <AddToCartButton data={productData} />
            </div>
          )}

          <h2 className="font-semibold">Why shop from Essentialist Makeup Store?</h2>
          <div>
            <div className="flex items-center gap-4 my-4">
              <Image src={image1} alt="Superfast delivery" width={80} height={80} className="w-20 h-20" />
              <div className="text-sm">
                <div className="font-semibold">Superfast Delivery</div>
                <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 my-4">
              <Image src={image2} alt="Best prices and offers" width={80} height={80} className="w-20 h-20" />
              <div className="text-sm">
                <div className="font-semibold">Best Prices and Offers</div>
                <p>Best price destination with offers directly from the manufacturers.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 my-4">
              <Image src={image3} alt="Wide assortment" width={80} height={80} className="w-20 h-20" />
              <div className="text-sm">
                <div className="font-semibold">Wide Assortment</div>
                <p>
                  Choose from over five thousand makeup products including foundations, lipsticks, eyeshadows, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="my-4 grid gap-3 lg:hidden">
            <div>
              <p className="font-semibold">Description</p>
              <div
                className="text-base text-justify text-black product-description-content"
                dangerouslySetInnerHTML={{ __html: productData.description || '' }}
              />
            </div>
            {productData.specifications && (
              <div>
                <p className="font-semibold">Product Specifications</p>
                <div className="tabular-content">{productData.specifications}</div>
              </div>
            )}
            <div>
              <p className="font-semibold">Unit</p>
              <p className="text-base">{productData.unit}</p>
            </div>
            {productData?.more_details &&
              typeof productData.more_details === 'object' &&
              Object.keys(productData.more_details).map((element, idx) => (
                <div key={`mobile-detail-${idx}`}>
                  <p className="font-semibold">{element}</p>
                  <p className="text-base">{productData.more_details[element]}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <ProductRecommendations currentProductId={productId} currentProductData={productData} />
    </>
  )
}