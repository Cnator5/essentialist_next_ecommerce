'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import Image from 'next/image'
import CardProductRating from './CardProductRating.client'

export default function CardProduct({ data }) {
  const router = useRouter()
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [isHovered, setIsHovered] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleProductClick = async (e) => {
    if (e.target.closest('[data-add-to-cart]')) return
    setIsNavigating(true)

    const cachedData = typeof window !== 'undefined' && sessionStorage.getItem(`product_${data._id}`)
    if (cachedData) {
      router.push(url)
      setIsNavigating(false)
      return
    }

    try {
      const response = await fetch('/api/product/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: data._id }),
      })
      const productData = await response.json()
      if (productData?.success && typeof window !== 'undefined') {
        sessionStorage.setItem(`product_${data._id}`, JSON.stringify(productData.data))
      }
    } catch {
      // silent
    } finally {
      router.push(url)
      setIsNavigating(false)
    }
  }

  return (
    <div
      onClick={handleProductClick}
      className={`relative flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out py-1 lg:p-2 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md ${isNavigating ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered && !isNavigating ? 'translateY(-5px)' : 'translateY(0)',
        minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? '2rem' : '15rem',
        maxWidth: '20rem',
      }}
    >
      {isNavigating && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className="relative overflow-hidden rounded-lg aspect-square mb-3">
        <Image
          src={Array.isArray(data.image) ? (data.image[0] || '/default-image.jpg') : (data.image || '/default-image.jpg')}
          className="w-full h-full object-contain transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered && !isNavigating ? 'scale(1.05)' : 'scale(1)' }}
          alt={data.name}
          loading="lazy"
          width={400}
          height={400}
          decoding="async"
        />
        {Boolean(data.discount) && (
          <div className="absolute top-2 right-2 bg-green-600 text-white font-medium rounded-full px-2 py-1 text-xs">
            {data.discount}% OFF
          </div>
        )}
      </div>

      <div className="flex-grow flex flex-col px-2">
        <div className="flex items-center justify-between mb-1">
          <div className="rounded-full text-xs w-fit px-2 py-0.5 text-green-600 bg-green-50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            10 min
          </div>

          {/* Always-visible yellow stars with average + count */}
          <CardProductRating productId={data._id} initial={data.rating} />
        </div>

        <h3
          className="font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 mb-1 transition-colors duration-300"
          style={{ color: isHovered ? '#4b5563' : '#1f2937' }}
        >
          {data.name}
        </h3>

        {/* <div className="text-gray-500 text-sm mb-3">{data.unit}</div> */}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="font-bold text-gray-900">
              {DisplayPriceInRupees(
                pricewithDiscount(
                  typeof data.bulkPrice === 'number' && data.bulkPrice > 0 ? data.bulkPrice : data.price,
                  data.discount || 0
                )
              )}
            </div>
            {Boolean(data.discount) && (
              <div className="text-xs text-gray-500 line-through">
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
          <div className="transition-transform duration-300" style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
            {data.stock === 0 ? (
              <p className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full">Out of stock</p>
            ) : (
              <div data-add-to-cart>
                <AddToCartButton data={data} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
