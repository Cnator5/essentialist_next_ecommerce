// components/CategoryWiseProductDisplay.js (Reverted to client-side fetch with in-memory + localStorage cache for speed)
'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi' // Ensure this is imported correctly
import CardLoading from './CardLoading' // Or use CardProduct with isLoading=true if not available
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight, FaArrowRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import Link from 'next/link'
import AxiosToastError from '../utils/AxiosToastError'

// Simple in-memory cache (global, persists across components on same page)
const productCache = new Map() // key: categoryId, value: { data, timestamp }
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper to get/set cache (with localStorage fallback for persistence across sessions)
const getCachedData = (categoryId) => {
  const cached = productCache.get(categoryId)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  // Fallback to localStorage
  try {
    const lsData = localStorage.getItem(`products-${categoryId}`)
    if (lsData) {
      const { data, timestamp } = JSON.parse(lsData)
      if (Date.now() - timestamp < CACHE_DURATION) {
        productCache.set(categoryId, { data, timestamp })
        return data
      }
    }
  } catch (e) {
    console.warn('localStorage cache read error:', e)
  }
  return null
}

const setCachedData = (categoryId, data) => {
  const cacheEntry = { data, timestamp: Date.now() }
  productCache.set(categoryId, cacheEntry)
  // Persist to localStorage
  try {
    localStorage.setItem(`products-${categoryId}`, JSON.stringify(cacheEntry))
  } catch (e) {
    console.warn('localStorage cache write error:', e)
  }
}

const CategoryWiseProductDisplay = ({ id, name, subCategories = [] }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [redirectURL, setRedirectURL] = useState(`/${valideURLConvert(name)}-${id}`)
  const containerRef = useRef()
  const subCategoryData = useSelector((state) => state.product.allSubCategory || subCategories) // Use prop or Redux
  const loadingCardNumber = new Array(6).fill(null)

  // Build redirect URL (memoized)
  const computedRedirectURL = useMemo(() => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category?.some((c) => c._id === id)
      return filterData
    })
    return subcategory 
      ? `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
      : `/${valideURLConvert(name)}-${id}`
  }, [subCategoryData, name, id])

  useEffect(() => {
    setRedirectURL(computedRedirectURL)
  }, [computedRedirectURL])

  // Optimized fetch with cache
  const fetchCategoryWiseProduct = async () => {
    // Check cache first (super fast: 0ms)
    const cachedData = getCachedData(id)
    if (cachedData) {
      setData(cachedData)
      setLoading(false)
      return // Skip network call
    }

    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory, // Use original API config
        data: { id },
      })

      const { data: responseData } = response

      if (responseData.success) {
        const products = responseData.data || []
        setData(products)
        setCachedData(id, products) // Cache for future loads
      } else {
        setData([])
      }
    } catch (error) {
      console.error(`Fetch error for category ${id}:`, error)
      AxiosToastError(error)
      setData([]) // Fallback to empty
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]) // Only refetch if category ID changes

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200
    }
  }

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200
    }
  }

  // Generate structured data (memoized, inject client-side)
  const structuredData = useMemo(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${name} Makeup Products Collection`,
    'description': `Explore our selection of high-quality ${name} makeup products at Essentialist Makeup Store.`,
    'numberOfItems': data.length,
    'itemListElement': data.slice(0, 6).map((product, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Product',
        'name': product.name,
        'image': Array.isArray(product.image) ? product.image[0] : product.image,
        'url': `/product/${valideURLConvert(product.name)}-${product._id}`,
        'offers': {
          '@type': 'Offer',
          'price': product.price,
          'priceCurrency': 'XAF',
          'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    }))
  }), [name, data])

  // Inject structured data
  useEffect(() => {
    if (data.length > 0) {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.text = JSON.stringify(structuredData)
      document.head.appendChild(script)
      return () => document.head.removeChild(script)
    }
  }, [structuredData])

  return (
    <div className="mb-12">
      <div className="container mx-auto px-2 flex items-center justify-between p-2">
        <h2 className="font-bold text-[20px] md:text-[40px]">
          {name}
        </h2>
        <Link
          href={redirectURL}
          className="text-pink-400 hover:text-green-400 font-bold md:text-[20px] text-[16px] transition-colors duration-300 p-4 flex items-center gap-2 hover:gap-3"
          aria-label={`View all ${name} products`}
        >
          See All
          <FaArrowRight className="transition-all duration-300" />
        </Link>
      </div>
      <div className="relative flex items-center cursor-pointer">
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:flex
                    gap-1 md:gap-1 lg:gap-1
                    container mx-auto 
                    overflow-x-auto scrollbar-none scroll-smooth
                    touch-pan-y"
          ref={containerRef}
          style={{ touchAction: 'pan-y' }}
        >
          {loading ? (
            // Show skeletons while loading (fast perceived load)
            loadingCardNumber.map((_, index) => (
              <div key={`loading-${id}-${index}`} className="px-1">
                <CardLoading /> {/* Or <CardProduct isLoading={true} /> */}
              </div>
            ))
          ) : data.length > 0 ? (
            // Render products from cache/fetch
            data.map((p, index) => (
              <div key={`${p._id}-${id}-${index}`} className="px-1">
                <CardProduct data={p} />
              </div>
            ))
          ) : (
            // No products message (only after fetch completes)
            <div className="col-span-full text-center text-gray-500 py-8 w-full px-1">
              No products in this category yet. Check back soon!
            </div>
          )}
        </div>
        <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Scroll left"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300"
            aria-label="Scroll right"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoryWiseProductDisplay