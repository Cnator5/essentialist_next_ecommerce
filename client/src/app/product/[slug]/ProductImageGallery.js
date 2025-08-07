'use client';

import React, { useState, useRef } from 'react';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const ProductImageGallery = ({ images, productName }) => {
  const [activeImage, setActiveImage] = useState(0);
  const scrollContainerRef = useRef(null);

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  if (!images || images.length === 0) {
    return <div className='bg-gray-200 lg:min-h-[65vh] rounded flex items-center justify-center'>No Image Available</div>;
  }

  return (
    <div className='flex flex-col'>
      {/* Main Image Display */}
      <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full flex items-center justify-center p-4 border rounded-lg shadow-sm'>
        <img
          src={images[activeImage]}
          className='w-full h-full object-scale-down transition-opacity duration-300'
          alt={`${productName} - Image ${activeImage + 1}`}
        />
      </div>

      {/* Thumbnail Scroller */}
      <div className='relative mt-4'>
        <div ref={scrollContainerRef} className='flex gap-4 w-full overflow-x-auto scrollbar-none p-2'>
          {images.map((img, index) => (
            <div
              key={index}
              className={`w-20 h-20 min-w-20 cursor-pointer shadow-md rounded-md border-2 transition-all ${activeImage === index ? 'border-green-500 scale-105' : 'border-transparent'}`}
              onClick={() => setActiveImage(index)}
            >
              <img
                src={img}
                alt={`Product thumbnail ${index + 1}`}
                className='w-full h-full object-scale-down rounded'
              />
            </div>
          ))}
        </div>
        
        {/* Scroll Buttons for Desktop */}
        <div className='w-full h-full hidden lg:flex justify-between absolute items-center top-0 pointer-events-none'>
          <button onClick={handleScrollLeft} className='z-10 bg-white p-2 rounded-full shadow-lg pointer-events-auto -ml-4'>
            <FaAngleLeft />
          </button>
          <button onClick={handleScrollRight} className='z-10 bg-white p-2 rounded-full shadow-lg pointer-events-auto -mr-4'>
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductImageGallery;