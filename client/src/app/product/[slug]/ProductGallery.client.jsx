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

//   useEffect(() => {
//     if (typeof window === 'undefined') return
//     if (safeImages.length <= 1) return

//     const preloadSources = [
//       safeImages[current + 1],
//       safeImages[current - 1],
//     ].filter(Boolean)

//     preloadSources.forEach((src) => {
//       const img = new window.Image()
//       img.src = src
//       img.decoding = 'async'
//     })
//   }, [current, safeImages])

//   const scrollByAmount = useCallback((dir) => {
//     const el = listRef.current
//     if (!el) return
//     const delta = dir === 'left' ? -240 : 240
//     el.scrollBy({ left: delta, behavior: 'smooth' })
//   }, [])

//   const currentSrc = safeImages[current] || '/default-image.jpg'
//   const isHero = current === 0

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
//           priority={isHero}
//           fetchPriority={isHero ? 'high' : 'auto'}
//           loading={isHero ? 'eager' : 'lazy'}
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
//           quality={85}
//         />
//       </div>

//       <div className="flex items-center justify-center gap-2 sm:gap-3 my-2">
//         {safeImages.map((_, index) => (
//           <div
//             key={`point-${index}`}
//             className={`w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-5 lg:h-5 rounded-full border border-slate-300 ${
//               current === index ? 'bg-emerald-400' : 'bg-slate-200'
//             }`}
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
//                 loading="lazy"
//                 sizes="64px"
//                 quality={70}
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
//                   loading="lazy"
//                   sizes="80px"
//                   quality={70}
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







//Path: client/src/app/product/%5Bslug%5D/ProductGallery.client.jsx
"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import ImageZoomWrapper from "./ImageZoomWrapper.client";

export default function ProductGallery({ images = [], productName = "" }) {
  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []).map(String),
    [images]
  );

  const [current, setCurrent] = useState(0);
  const listRef = useRef(null);

  useEffect(() => {
    if (current >= safeImages.length) setCurrent(0);
  }, [safeImages.length, current]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (safeImages.length <= 1) return;

    const preloadSources = [
      safeImages[current + 1],
      safeImages[current - 1],
    ].filter(Boolean);

    preloadSources.forEach((src) => {
      const img = new window.Image();
      img.src = src;
      img.decoding = "async";
    });
  }, [current, safeImages]);

  const scrollByAmount = useCallback((direction) => {
    const el = listRef.current;
    if (!el) return;

    const delta = direction === "left" ? -240 : 240;
    el.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  const handleSelect = useCallback((index) => {
    setCurrent(index);
  }, []);

  const currentSrc = safeImages[current] ?? "/default-image.jpg";
  const prioritize = current === 0;

  return (
    <div className="w-full">
      <div className="zoomable relative overflow-hidden rounded-lg bg-white shadow-sm">
        <ImageZoomWrapper
          src={currentSrc}
          alt={productName || `Product image ${current + 1}`}
          width={1000}
          height={1000}
          zoom={2.8}
          hoverScale={1.09}
          className="h-full w-full object-contain"
          priority={prioritize}
          fetchPriority={prioritize ? "high" : "auto"}
          loading={prioritize ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 720px"
          quality={85}
        />
      </div>

      <div className="my-3 flex items-center justify-center gap-2 sm:gap-3">
        {safeImages.map((_, index) => (
          <span
            key={`point-${index}`}
            className={`h-2.5 w-2.5 rounded-full border border-slate-300 transition ${
              current === index ? "bg-emerald-400" : "bg-slate-200"
            } sm:h-3 sm:w-3 lg:h-4 lg:w-4`}
            aria-hidden
          />
        ))}
      </div>

      <div className="relative">
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 md:hidden">
          {safeImages.map((img, index) => (
            <ThumbButton
              key={`thumb-mobile-${index}`}
              img={img}
              index={index}
              productName={productName}
              isActive={current === index}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="relative hidden md:block">
          <div
            ref={listRef}
            className="scrollbar-none relative z-10 flex gap-3 overflow-x-auto py-1"
            role="listbox"
            aria-label="Product gallery thumbnails"
          >
            {safeImages.map((img, index) => (
              <ThumbButton
                key={`thumb-${index}`}
                img={img}
                index={index}
                productName={productName}
                isActive={current === index}
                onSelect={handleSelect}
                size={80}
              />
            ))}
          </div>

          {safeImages.length > 4 && (
            <div className="pointer-events-none absolute inset-y-0 flex w-full items-center justify-between">
              <ControlButton
                direction="left"
                onClick={() => scrollByAmount("left")}
              />
              <ControlButton
                direction="right"
                onClick={() => scrollByAmount("right")}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThumbButton({
  img,
  index,
  productName,
  isActive,
  onSelect,
  size = 96,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(index)}
      className={`thumb-item h-16 w-16 overflow-hidden rounded border bg-white shadow transition hover:border-emerald-400 focus:outline-none focus-visible:border-emerald-500 xs:h-20 xs:w-20 sm:h-20 sm:w-20 lg:h-22 lg:w-22 ${
        isActive ? "border-emerald-500" : "border-slate-200"
      }`}
      title={`Product image ${index + 1}`}
      aria-label={`Show image ${index + 1}`}
      aria-selected={isActive}
      role="option"
    >
      <Image
        src={img}
        alt={`Product image ${index + 1} of ${productName}`}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
        sizes="96px"
        quality={70}
      />
    </button>
  );
}

function ControlButton({ direction, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-lg transition hover:bg-emerald-100"
      aria-label={`Scroll ${direction}`}
    >
      {direction === "left" ? <FaAngleLeft /> : <FaAngleRight />}
    </button>
  );
}