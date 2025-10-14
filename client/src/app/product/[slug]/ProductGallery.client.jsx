// 'use client'

// import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
// import Image from 'next/image'
// import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
// import ImageZoomWrapper from './ImageZoomWrapper.client'

// export default function ProductGallery({ images = [], productName = '' }) {
//   const safeImages = useMemo(
//     () => (Array.isArray(images) ? images.filter(Boolean) : []).map(String),
//     [images]
//   )
//   const [current, setCurrent] = useState(0)
//   const listRef = useRef(null)

//   useEffect(() => {
//     if (current >= safeImages.length) setCurrent(0)
//   }, [safeImages.length, current])

//   const scrollByAmount = useCallback((dir) => {
//     const el = listRef.current
//     if (!el) return
//     const delta = dir === 'left' ? -240 : 240
//     el.scrollBy({ left: delta, behavior: 'smooth' })
//   }, [])

//   const currentSrc = safeImages[current] || '/default-image.jpg'

//   return (
//     <div className="w-full">
//       <div className="bg-white rounded min-h-10 max-h-26 h-full w-full zoomable">
//         <ImageZoomWrapper
//           src={currentSrc}
//           alt={productName}
//           width={1000}
//           height={1000}
//           zoom={2.8}
//           hoverScale={1.09}
//           className="h-full w-full"
//         />
//       </div>

//       <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
//         {safeImages.map((_, index) => (
//           <div
//             key={`point-${index}`}
//             className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full border border-slate-300 ${current === index ? 'bg-emerald-400' : 'bg-slate-200'}`}
//             title={`Image ${index + 1}`}
//           />
//         ))}
//       </div>

//       <div className="relative">
//         <div className="flex flex-wrap gap-2.5 sm:gap-3 md:hidden justify-center">
//           {safeImages.map((img, index) => (
//             <button
//               key={`thumb-m-${index}`}
//               type="button"
//               onClick={() => setCurrent(index)}
//               className={`thumb-item w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 shadow-md bg-white border rounded overflow-hidden ${
//                 current === index ? 'border-emerald-500' : 'border-slate-200'
//               }`}
//               title={`Product image ${index + 1}`}
//               aria-label={`Show image ${index + 1}`}
//               aria-selected={current === index}
//             >
//               <Image
//                 src={img}
//                 alt={`Product image ${index + 1} of ${productName}`}
//                 width={100}
//                 height={100}
//                 className="w-full h-full object-contain"
//               />
//             </button>
//           ))}
//         </div>

//         <div className="hidden md:grid relative">
//           <div
//             ref={listRef}
//             className="flex gap-3 z-10 relative w-full overflow-x-auto scrollbar-none py-1"
//             role="listbox"
//             aria-label="Product images"
//           >
//             {safeImages.map((img, index) => (
//               <button
//                 key={`thumb-${index}`}
//                 type="button"
//                 onClick={() => setCurrent(index)}
//                 className={`thumb-item w-20 h-20 min-h-20 min-w-20 shadow-md bg-white border rounded overflow-hidden ${
//                   current === index ? 'border-emerald-500' : 'border-slate-200'
//                 }`}
//                 title={`Product image ${index + 1}`}
//                 aria-label={`Show image ${index + 1}`}
//                 aria-selected={current === index}
//               >
//                 <Image
//                   src={img}
//                   alt={`Product image ${index + 1} of ${productName}`}
//                   width={80}
//                   height={80}
//                   className="w-full h-full object-contain"
//                 />
//               </button>
//             ))}
//           </div>

//           <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center pointer-events-none">
//             <button
//               type="button"
//               onClick={() => scrollByAmount('left')}
//               className="z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto border border-slate-200"
//               aria-label="Scroll left"
//             >
//               <FaAngleLeft />
//             </button>
//             <button
//               type="button"
//               onClick={() => scrollByAmount('right')}
//               className="z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto border border-slate-200"
//               aria-label="Scroll right"
//             >
//               <FaAngleRight />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }



'use client'

import { useMemo, useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { FaAngleRight, FaAngleLeft } from 'react-icons/fa6'
import ImageZoomWrapper from './ImageZoomWrapper.client'

export default function ProductGallery({ images = [], productName = '' }) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []).map(String),
    [images]
  )
  const [current, setCurrent] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    if (current >= safeImages.length) setCurrent(0)
  }, [safeImages.length, current])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (safeImages.length <= 1) return

    const preloadSources = [
      safeImages[current + 1],
      safeImages[current - 1],
    ].filter(Boolean)

    preloadSources.forEach((src) => {
      const img = new window.Image()
      img.src = src
      img.decoding = 'async'
    })
  }, [current, safeImages])

  const scrollByAmount = useCallback((dir) => {
    const el = listRef.current
    if (!el) return
    const delta = dir === 'left' ? -240 : 240
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }, [])

  const currentSrc = safeImages[current] || '/default-image.jpg'
  const isHero = current === 0

  return (
    <div className="w-full">
      <div className="bg-white rounded min-h-10 max-h-26 h-full w-full zoomable">
        <ImageZoomWrapper
          src={currentSrc}
          alt={productName}
          width={1000}
          height={1000}
          zoom={2.8}
          hoverScale={1.09}
          className="h-full w-full"
          priority={isHero}
          fetchPriority={isHero ? 'high' : 'auto'}
          loading={isHero ? 'eager' : 'lazy'}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
          quality={85}
        />
      </div>

      <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
        {safeImages.map((_, index) => (
          <div
            key={`point-${index}`}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full border border-slate-300 ${
              current === index ? 'bg-emerald-400' : 'bg-slate-200'
            }`}
            title={`Image ${index + 1}`}
          />
        ))}
      </div>

      <div className="relative">
        <div className="flex flex-wrap gap-2.5 sm:gap-3 md:hidden justify-center">
          {safeImages.map((img, index) => (
            <button
              key={`thumb-m-${index}`}
              type="button"
              onClick={() => setCurrent(index)}
              className={`thumb-item w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 shadow-md bg-white border rounded overflow-hidden ${
                current === index ? 'border-emerald-500' : 'border-slate-200'
              }`}
              title={`Product image ${index + 1}`}
              aria-label={`Show image ${index + 1}`}
              aria-selected={current === index}
            >
              <Image
                src={img}
                alt={`Product image ${index + 1} of ${productName}`}
                width={100}
                height={100}
                className="w-full h-full object-contain"
                loading="lazy"
                sizes="64px"
                quality={70}
              />
            </button>
          ))}
        </div>

        <div className="hidden md:grid relative">
          <div
            ref={listRef}
            className="flex gap-3 z-10 relative w-full overflow-x-auto scrollbar-none py-1"
            role="listbox"
            aria-label="Product images"
          >
            {safeImages.map((img, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                onClick={() => setCurrent(index)}
                className={`thumb-item w-20 h-20 min-h-20 min-w-20 shadow-md bg-white border rounded overflow-hidden ${
                  current === index ? 'border-emerald-500' : 'border-slate-200'
                }`}
                title={`Product image ${index + 1}`}
                aria-label={`Show image ${index + 1}`}
                aria-selected={current === index}
              >
                <Image
                  src={img}
                  alt={`Product image ${index + 1} of ${productName}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                  loading="lazy"
                  sizes="80px"
                  quality={70}
                />
              </button>
            ))}
          </div>

          <div className="w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center pointer-events-none">
            <button
              type="button"
              onClick={() => scrollByAmount('left')}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto border border-slate-200"
              aria-label="Scroll left"
            >
              <FaAngleLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount('right')}
              className="z-10 bg-white relative p-1 rounded-full shadow-lg pointer-events-auto border border-slate-200"
              aria-label="Scroll right"
            >
              <FaAngleRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}