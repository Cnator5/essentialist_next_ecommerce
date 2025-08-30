'use client'

import React, { useEffect, useRef, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight, FaArrowRight } from 'react-icons/fa6'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import Link from 'next/link'
import Head from 'next/head'
import AxiosToastError from '../utils/AxiosToastError'

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [redirectURL, setRedirectURL] = useState(`/${valideURLConvert(name)}-${id}`)
  const containerRef = useRef()
  const subCategoryData = useSelector((state) => state.product.allSubCategory)
  const loadingCardNumber = new Array(6).fill(null)

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      })

      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategoryWiseProduct()
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id === id
      })
      return filterData ? true : null
    })
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subcategory?.name
    )}-${subcategory?._id}`
    setRedirectURL(url)
  }, [subCategoryData, name, id])

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

  // Generate structured data for this category
  const generateStructuredData = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': `${name} Makeup Products Collection`,
      'description': `Explore our selection of high-quality ${name} makeup products at Essentialist Makeup Store.`,
      'numberOfItems': data.length,
      'itemListElement': data.map((product, index) => ({
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
    }
  }

  return (
    <>
      <Head>
        <title>{`${name}`}</title>
        <meta name="description" content={`Browse our selection of high-quality ${name} makeup products. Find the perfect ${name.toLowerCase()} for your beauty routine.`} />
        <meta name="keywords" content={`${name}, makeup, cosmetics, beauty products, Cameroon, Douala, Essentialist Makeup Store`} />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateStructuredData()) }}
        />
      </Head>
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
            {loading &&
              loadingCardNumber.map((_, index) => (
                <div 
                  key={`CategorywiseProductDisplay123${index}`}
                  className="px-1"
                >
                  <CardLoading />
                </div>
              ))}
            {data.map((p, index) => (
              <div 
                key={`${p._id}CategorywiseProductDisplay${index}`}
                className="px-1"
              >
                <CardProduct data={p} />
              </div>
            ))}
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
    </>
  )
}

export default CategoryWiseProductDisplay