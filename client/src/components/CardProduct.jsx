// // components/CardProduct.jsx - Updated with preloading
// 'use client'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
// import { valideURLConvert } from '../utils/valideURLConvert'
// import { pricewithDiscount } from '../utils/PriceWithDiscount'
// import AddToCartButton from './AddToCartButton'

// export default function CardProduct({ data }) {
//   const router = useRouter()
//   const url = `/product/${valideURLConvert(data.name)}-${data._id}`
//   const [isHovered, setIsHovered] = useState(false)
//   const [isNavigating, setIsNavigating] = useState(false)

//   const handleProductClick = async (e) => {
//     // Prevent navigation if clicking on add to cart button
//     if (e.target.closest('[data-add-to-cart]')) {
//       return
//     }
    
//     setIsNavigating(true)
    
//     // Check if already cached
//     const cachedData = sessionStorage.getItem(`product_${data._id}`)
//     if (cachedData) {
//       router.push(url)
//       return
//     }
    
//     // Preload the product data
//     try {
//       const response = await fetch('/api/product/get-product-details', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ productId: data._id })
//       })
      
//       const productData = await response.json()
      
//       // Store in sessionStorage for immediate access
//       if (productData.success) {
//         sessionStorage.setItem(`product_${data._id}`, JSON.stringify(productData.data))
//       }
      
//     } catch (error) {
//       console.error('Preload failed:', error)
//     } finally {
//       router.push(url)
//       setIsNavigating(false)
//     }
//   }

//   return (
//     <div
//       onClick={handleProductClick}
//       className={`relative flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out py-3 lg:p-4 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md ${
//         isNavigating ? 'opacity-75' : ''
//       }`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         transform: isHovered && !isNavigating ? 'translateY(-5px)' : 'translateY(0)',
//         minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? '5rem' : '18rem',
//         maxWidth: '22rem'
//       }}
//     >
//       {isNavigating && (
//         <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//         </div>
//       )}
      
//       <div className='relative overflow-hidden rounded-lg aspect-square mb-3'>
//         <img
//           src={data.image[0]}
//           className='w-full h-full object-contain transition-transform duration-500 ease-in-out'
//           style={{
//             transform: isHovered && !isNavigating ? 'scale(1.05)' : 'scale(1)'
//           }}
//           alt={data.name}
//           loading="lazy"
//         />
//         {Boolean(data.discount) && (
//           <div className='absolute top-2 right-2 bg-green-600 text-white font-medium rounded-full px-2 py-1 text-xs'>
//             {data.discount}% OFF
//           </div>
//         )}
//       </div>
//       <div className='flex-grow flex flex-col px-2'>
//         <div className='flex items-center gap-2 mb-2'>
//           <div className='rounded-full text-xs w-fit px-2 py-0.5 text-green-600 bg-green-50 flex items-center'>
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//             10 min
//           </div>
//         </div>
//         <h3
//           className='font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 mb-1 transition-colors duration-300'
//           style={{ color: isHovered ? '#4b5563' : '#1f2937' }}
//         >
//           {data.name}
//         </h3>
//         <div className='text-gray-500 text-sm mb-3'>
//           {data.unit}
//         </div>
//         <div className='flex items-center justify-between mt-auto'>
//           <div className='flex flex-col'>
//             <div className='font-bold text-gray-900'>
//               {DisplayPriceInRupees(pricewithDiscount(data.bulkPrice, data.discount))}
//             </div>
//             {Boolean(data.discount) && (
//               <div className='text-xs text-gray-500 line-through'>
//                 {DisplayPriceInRupees(data.price)}
//               </div>
//             )}
//           </div>
//           <div className='transition-transform duration-300' style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
//             {data.stock === 0 ? (
//               <p className='text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full'>Out of stock</p>
//             ) : (
//               <div data-add-to-cart>
//                 <AddToCartButton data={data} />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }






'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from './AddToCartButton'
import Image from "next/image"

export default function CardProduct({ data }) {
  const router = useRouter()
  const url = `/product/${valideURLConvert(data.name)}-${data._id}`
  const [isHovered, setIsHovered] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  const handleProductClick = async (e) => {
    if (e.target.closest('[data-add-to-cart]')) return

    setIsNavigating(true)

    // Use session cache for fast navigation if possible
    const cachedData = sessionStorage.getItem(`product_${data._id}`)
    if (cachedData) {
      router.push(url)
      setIsNavigating(false)
      return
    }

    try {
      const response = await fetch('/api/product/get-product-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: data._id })
      })

      const productData = await response.json()

      if (productData.success) {
        sessionStorage.setItem(`product_${data._id}`, JSON.stringify(productData.data))
      }
    } catch (error) {
      // Fail silently for user experience
    } finally {
      router.push(url)
      setIsNavigating(false)
    }
  }

  return (
    <div
      onClick={handleProductClick}
      className={`relative flex flex-col border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out py-3 lg:p-4 rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md ${isNavigating ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered && !isNavigating ? 'translateY(-5px)' : 'translateY(0)',
        minWidth: typeof window !== 'undefined' && window.innerWidth < 768 ? '5rem' : '18rem',
        maxWidth: '22rem'
      }}
    >
      {isNavigating && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      <div className='relative overflow-hidden rounded-lg aspect-square mb-3'>
        <Image
          src={data.image[0]}
          className='w-full h-full object-contain transition-transform duration-500 ease-in-out'
          style={{
            transform: isHovered && !isNavigating ? 'scale(1.05)' : 'scale(1)'
          }}
          alt={data.name}
          loading="lazy"
          width="400"
          height="400"
          decoding="async"
        />
        {Boolean(data.discount) && (
          <div className='absolute top-2 right-2 bg-green-600 text-white font-medium rounded-full px-2 py-1 text-xs'>
            {data.discount}% OFF
          </div>
        )}
      </div>
      <div className='flex-grow flex flex-col px-2'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='rounded-full text-xs w-fit px-2 py-0.5 text-green-600 bg-green-50 flex items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            10 min
          </div>
        </div>
        <h3
          className='font-semibold text-gray-800 text-sm lg:text-base line-clamp-2 mb-1 transition-colors duration-300'
          style={{ color: isHovered ? '#4b5563' : '#1f2937' }}
        >
          {data.name}
        </h3>
        <div className='text-gray-500 text-sm mb-3'>
          {data.unit}
        </div>
        <div className='flex items-center justify-between mt-auto'>
          <div className='flex flex-col'>
            <div className='font-bold text-gray-900'>
              {DisplayPriceInRupees(pricewithDiscount(data.bulkPrice, data.discount))}
            </div>
            {Boolean(data.discount) && (
              <div className='text-xs text-gray-500 line-through'>
                {DisplayPriceInRupees(data.price)}
              </div>
            )}
          </div>
          <div className='transition-transform duration-300' style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}>
            {data.stock === 0 ? (
              <p className='text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full'>Out of stock</p>
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