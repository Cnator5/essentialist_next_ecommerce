// "use client";

// import { useRef, useState, useEffect, useCallback } from "react";
// import Image from "next/image";

// export default function ImageZoom({
//   src,
//   alt,
//   width = 800,
//   height = 800,
//   className = "",
//   zoom = 2,
//   hoverScale = 1.04,
// }) {
//   const containerRef = useRef(null);
//   const [isActive, setIsActive] = useState(false);
//   const [bgPos, setBgPos] = useState("center");
//   const [imgNatural, setImgNatural] = useState({ w: width, h: height });

//   // Preload to get natural size (for crisp background zoom)
//   useEffect(() => {
//     const img = new window.Image();
//     img.src = src;
//     img.onload = () => {
//       setImgNatural({
//         w: img.naturalWidth || width,
//         h: img.naturalHeight || height,
//       });
//     };
//   }, [src, width, height]);

//   const handleMove = useCallback(
//     (e) => {
//       if (!containerRef.current || !isActive) return;
//       const rect = containerRef.current.getBoundingClientRect();
//       // Support touch and mouse
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;

//       const x = ((clientX - rect.left) / rect.width) * 100;
//       const y = ((clientY - rect.top) / rect.height) * 100;

//       // Clamp a bit to keep nice behavior near edges
//       const clamp = (val) => Math.max(0, Math.min(100, val));
//       setBgPos(`${clamp(x)}% ${clamp(y)}%`);
//     },
//     [isActive]
//   );

//   const onEnter = () => setIsActive(true);
//   const onLeave = () => setIsActive(false);

//   // For accessibility: toggle zoom on keyboard
//   const onKeyDown = (e) => {
//     if (e.key === "Enter" || e.key === " ") {
//       e.preventDefault();
//       setIsActive((s) => !s);
//     }
//   };

//   // Compute background size for zoom surface
//   const bgSize = `${((imgNatural.w / (width || 1)) * zoom * 100).toFixed(2)}% auto`;

//   return (
//     <div
//       ref={containerRef}
//       className={`relative group select-none overflow-hidden rounded-lg border border-gray-100 bg-white ${className}`}
//       style={{
//         transition: "transform 160ms ease",
//       }}
//       onMouseEnter={onEnter}
//       onMouseLeave={onLeave}
//       onMouseMove={handleMove}
//       onTouchStart={() => setIsActive(true)}
//       onTouchMove={handleMove}
//       onTouchEnd={() => setIsActive(false)}
//       onKeyDown={onKeyDown}
//       role="img"
//       aria-label={alt}
//       tabIndex={0}
//     >
//       {/* Base image (always visible, slightly scales on hover) */}
//       <div
//         className="w-full h-full"
//         style={{
//           transform: isActive ? `scale(${hoverScale})` : "scale(1)",
//           transition: "transform 160ms ease",
//         }}
//       >
//         <Image
//           src={src}
//           alt={alt}
//           width={width}
//           height={height}
//           className="w-full h-full object-contain"
//           priority
//         />
//       </div>

//       {/* Zoom overlay: shows magnified background of the same image */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0"
//         style={{
//           opacity: isActive ? 1 : 0,
//           transition: "opacity 120ms ease",
//           backgroundImage: `url(${src})`,
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: bgPos,
//           backgroundSize: bgSize,
//         }}
//       />

//       {/* Helper hint on desktop */}
//       <div
//         className="pointer-events-none absolute bottom-2 right-2 text-[11px] leading-4 px-2 py-1 rounded-md bg-black/55 text-white hidden md:block"
//         style={{ opacity: isActive ? 0 : 1, transition: "opacity 200ms ease" }}
//       >
//         Hover or press Enter to zoom
//       </div>
//     </div>
//   );
// }


'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function ImageZoom({
  src,
  alt,
  width = 800,
  height = 800,
  className = '',
  zoom = 2.4,
  hoverScale = 1.05,
}) {
  const containerRef = useRef(null)
  const [isActive, setIsActive] = useState(false)
  const [bgPos, setBgPos] = useState('center')
  const [imgNatural, setImgNatural] = useState({ w: width, h: height })

  // Preload for natural size
  useEffect(() => {
    const img = new window.Image()
    img.src = src
    img.onload = () => {
      setImgNatural({
        w: img.naturalWidth || width,
        h: img.naturalHeight || height,
      })
    }
  }, [src, width, height])

  const handleMove = useCallback(
    (e) => {
      if (!containerRef.current || !isActive) return
      const rect = containerRef.current.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const x = ((clientX - rect.left) / rect.width) * 100
      const y = ((clientY - rect.top) / rect.height) * 100
      const clamp = (v) => Math.max(0, Math.min(100, v))
      setBgPos(`${clamp(x)}% ${clamp(y)}%`)
    },
    [isActive]
  )

  const onEnter = () => setIsActive(true)
  const onLeave = () => setIsActive(false)

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsActive((s) => !s)
    }
  }

  const bgSize = `${((imgNatural.w / (width || 1)) * zoom * 100).toFixed(2)}% auto`

  return (
    <div
      ref={containerRef}
      className={`relative group select-none rounded-lg border border-gray-100 bg-white ${className}`}
      style={{
        transition: 'transform 160ms ease',
        // Keep layout clean when idle
        overflow: 'hidden',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseMove={handleMove}
      onTouchStart={() => setIsActive(true)}
      onTouchMove={handleMove}
      onTouchEnd={() => setIsActive(false)}
      onKeyDown={onKeyDown}
      role="img"
      aria-label={alt}
      tabIndex={0}
    >
      {/* Base image layer (never overflows) */}
      <div
        className="w-full h-full"
        style={{
          transform: isActive ? `scale(${hoverScale})` : 'scale(1)',
          transition: 'transform 160ms ease',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Zoom overlay container: can render outside visually but not affect layout */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          // Place above base image but below other page elements
          zIndex: 1,
          // We keep it clipped by default, then softly extend visual range on active
          overflow: 'visible',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            opacity: isActive ? 1 : 0,
            transition: 'opacity 140ms ease',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: bgPos,
            backgroundSize: bgSize,
            // Add a soft edge while active so it feels like it pops, but doesn’t
            // look broken near borders.
            filter: isActive ? 'drop-shadow(0 6px 16px rgba(0,0,0,0.18))' : 'none',
          }}
        />
      </div>

      {/* Helper hint on desktop */}
      <div
        className="pointer-events-none absolute bottom-2 right-2 text-[11px] leading-4 px-2 py-1 rounded-md bg-black/55 text-white hidden md:block"
        style={{ opacity: isActive ? 0 : 1, transition: 'opacity 200ms ease' }}
      >
        Hover or press Enter to zoom
      </div>
    </div>
  )
}