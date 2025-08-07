'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import SummaryApi from '../../../common/SummaryApi'
import Axios from '../../../utils/Axios'
import AxiosToastError from '../../../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6"
import { DisplayPriceInRupees } from '../../../utils/DisplayPriceInRupees'
import Divider from '../../../components/Divider'
import image1 from '/public/assets/minute_delivery.jpeg'
import image2 from '/public/assets/Best_Prices_Offers.png'
import image3 from '/public/assets/Wide_Assortment.avif'
import { pricewithDiscount } from '../../../utils/PriceWithDiscount'
import AddToCartButton from '../../../components/AddToCartButton'
import ProductRecommendations from '../../../components/ProductRecommendations'
import Head from 'next/head';
import Image from 'next/image'

// CSS for tabular formatting that preserves copy-paste functionality
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

  .tabular-content::selection {
    background-color: #bfdbfe;
  }

  .tabular-content::-moz-selection {
    background-color: #bfdbfe;
  }

  .product-description-content {
    line-height: 1.6;
  }

  .product-description-content p {
    margin-bottom: 0.5rem;
  }

  .product-description-content ul, .product-description-content ol {
    margin-left: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .product-description-content h1, .product-description-content h2, 
  .product-description-content h3, .product-description-content h4, 
  .product-description-content h5, .product-description-content h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }
`;

// Skeleton Components
const ImageSkeleton = () => (
  <div className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
)

const TextSkeleton = ({ width = "100%", height = "h-4" }) => (
  <div className={`bg-gray-200 rounded ${height} animate-pulse`} style={{ width }}></div>
)

const ProductSkeleton = () => (
  <div className="container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <ImageSkeleton />
        <div className="flex space-x-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
      
      {/* Details Skeleton */}
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
          <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
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

export default function ProductDisplayPage() {
  const params = useParams()
  const router = useRouter()
  const [productData, setProductData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const imageContainer = useRef()

  // Extract product ID from slug
  const extractProductId = (slug) => {
    if (!slug) return null
    const parts = slug.split('-')
    return parts[parts.length - 1]
  }

  const fetchProductDetails = async () => {
    try {
      const productId = extractProductId(params.slug)
      
      if (!productId) {
        setError('Invalid product URL')
        setLoading(false)
        return
      }

      // Check if data is already cached
      const cachedData = sessionStorage.getItem(`product_${productId}`)
      if (cachedData) {
        setProductData(JSON.parse(cachedData))
        setLoading(false)
        return
      }

      // Fetch from API if not cached
      const response = await fetch('/api/product/get-product-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (data.success) {
        setProductData(data.data)
        // Cache the data
        sessionStorage.setItem(`product_${productId}`, JSON.stringify(data.data))
      } else {
        setError(data.message || 'Failed to fetch product details')
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      setError('Failed to load product details')
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (params.slug) {
      fetchProductDetails()
    }
  }, [params.slug])

  const handleImageChange = (index) => {
    setCurrentImageIndex(index)
  }

  const handleBackToProducts = () => {
    router.push('/product')
  }

  const handleScrollRight = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft += 100
    }
  }

  const handleScrollLeft = () => {
    if (imageContainer.current) {
      imageContainer.current.scrollLeft -= 100
    }
  }

  if (loading) {
    return <ProductSkeleton />
  }

  if (error || !productData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error || 'Product not found'}
          </h1>
          <button 
            onClick={handleBackToProducts}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const pageTitle = `${productData.name}`
  const pageDescription = productData.description || `Buy ${productData.name} at the best price`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={`${productData.name}, makeup, beauty, cosmetics`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={productData.image?.[0]} />
      </Head>

      {/* Add the custom styles */}
      <style jsx global>{tabularStyles}</style>

      <section className='container mx-auto p-4 grid lg:grid-cols-2 text-black font-bold md:font-normal'>
        {/* LEFT: Images & Description */}
        <div>
          <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
            <Image
              src={productData.image?.[currentImageIndex] || '/default-image.jpg'}
              alt={productData.name}
              width={600}
              height={600}
              className='w-full h-full object-scale-down scale-100'
              priority={true}
              unoptimized={true}
            />
          </div>
          
          {/* Image dots navigation */}
          <div className='flex items-center justify-center gap-3 my-2'>
            {productData.image && productData.image.map((img, index) => (
              <div
                key={`point-${index}`}
                onClick={() => handleImageChange(index)}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full cursor-pointer ${
                  currentImageIndex === index ? "bg-slate-300" : ""
                }`}
              ></div>
            ))}
          </div>
          
          {/* Image thumbnails with scroll */}
          <div className='grid relative'>
            <div 
              ref={imageContainer} 
              className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'
            >
              {productData.image && productData.image.map((img, index) => (
                <div 
                  className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md' 
                  key={`thumb-${index}`}
                >
                  <Image
                    src={img}
                    alt={`Product image ${index + 1} of ${productData.name}`}
                    width={80}
                    height={80}
                    onClick={() => handleImageChange(index)}
                    className='w-full h-full object-scale-down'
                    loading="lazy"
                    unoptimized={true}
                  />
                </div>
              ))}
            </div>
            
            {/* Scroll arrows */}
            <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
              <button 
                onClick={handleScrollLeft} 
                className='z-10 bg-white relative p-1 rounded-full shadow-lg'
              >
                <FaAngleLeft />
              </button>
              <button 
                onClick={handleScrollRight} 
                className='z-10 bg-white relative p-1 rounded-full shadow-lg'
              >
                <FaAngleRight />
              </button>
            </div>
          </div>

          {/* Description and Extra Details for Large Screens */}
          <div className='my-4 hidden lg:grid gap-3 p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow'>
            <div>
              <p className='font-semibold'>Description</p>
              <div 
                className='text-base text-justify text-black product-description-content'
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
            
            {/* Display Plain Text Details in Tabular Format */}
            {productData.specifications && (
              <div>
                <p className='font-semibold'>Product Specifications</p>
                <div className='tabular-content'>
                  {productData.specifications}
                </div>
              </div>
            )}
            
            <div>
              <p className='font-semibold'>Unit</p>
              <p className='text-base'>{productData.unit}</p>
            </div>
            
            {productData?.more_details && typeof productData.more_details === 'object' && 
              Object.keys(productData.more_details).map((element, idx) => (
                <div key={`detail-${idx}`}>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{productData.more_details[element]}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* RIGHT: Price, Add to Cart, Why Shop, etc */}
        <div className='p-4 lg:pl-7 text-base lg:text-lg'>
          <p className='bg-green-300 w-fit px-2 rounded-full'>10 Minutes</p>
          <h2 className='text-lg font-semibold lg:text-3xl'>{productData.name}</h2>
          <p>{productData.unit}</p>
          <Divider />
          
          <div>
            <p>Bulk Price</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                <p className='font-semibold text-lg lg:text-xl'>
                  {DisplayPriceInRupees(pricewithDiscount(productData.bulkPrice || productData.price, productData.discount))}
                </p>
              </div>
              {productData.discount > 0 && (
                <p className='line-through'>{DisplayPriceInRupees(productData.price)}</p>
              )}
              {productData.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {productData.discount}% <span className='text-base text-black'>Discount</span>
                </p>
              )}
            </div>
          </div>
          
          <div>
            <p>Price</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                <p className='font-semibold text-lg lg:text-xl'>
                  {DisplayPriceInRupees(pricewithDiscount(productData.price, productData.discount))}
                </p>
              </div>
              {productData.discount > 0 && (
                <p className='line-through'>{DisplayPriceInRupees(productData.price)}</p>
              )}
              {productData.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">
                  {productData.discount}% <span className='text-base text-black'>Discount</span>
                </p>
              )}
            </div>
          </div>
          
          {productData.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ) : (
            <div className='my-4'>
              <AddToCartButton data={productData} />
            </div>
          )}

          <h2 className='font-semibold'>Why shop from Essentialist Makeup Store?</h2>
          <div>
            <div className='flex items-center gap-4 my-4'>
              <Image
                src={image1}
                alt='Superfast delivery'
                width={80}
                height={80}
                className='w-20 h-20'
              />
              <div className='text-sm'>
                <div className='font-semibold'>Superfast Delivery</div>
                <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4'>
              <Image
                src={image2}
                alt='Best prices and offers'
                width={80}
                height={80}
                className='w-20 h-20'
              />
              <div className='text-sm'>
                <div className='font-semibold'>Best Prices and Offers</div>
                <p>Best price destination with offers directly from the manufacturers.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4'>
              <Image
                src={image3}
                alt='Wide assortment'
                width={80}
                height={80}
                className='w-20 h-20'
              />
              <div className='text-sm'>
                <div className='font-semibold'>Wide Assortment</div>
                <p>Choose from over five thousand makeup products including foundations, lipsticks, eyeshadows, and more.</p>
              </div>
            </div>
          </div>

          {/* Description and Extra Details for Small Screens */}
          <div className='my-4 grid gap-3 lg:hidden'>
            <div>
              <p className='font-semibold'>Description</p>
              <div 
                className='text-base text-justify text-black product-description-content'
                dangerouslySetInnerHTML={{ __html: productData.description }}
              />
            </div>
            
            {/* Display Plain Text Details in Tabular Format */}
            {productData.specifications && (
              <div>
                <p className='font-semibold'>Product Specifications</p>
                <div className='tabular-content'>
                  {productData.specifications}
                </div>
              </div>
            )}
            
            <div>
              <p className='font-semibold'>Unit</p>
              <p className='text-base'>{productData.unit}</p>
            </div>
            
            {productData?.more_details && typeof productData.more_details === 'object' && 
              Object.keys(productData.more_details).map((element, idx) => (
                <div key={`mobile-detail-${idx}`}>
                  <p className='font-semibold'>{element}</p>
                  <p className='text-base'>{productData.more_details[element]}</p>
                </div>
              ))
            }
          </div>
        </div>
      </section>

      <ProductRecommendations currentProductId={extractProductId(params.slug)} currentProductData={productData} />
    </>
  )
}