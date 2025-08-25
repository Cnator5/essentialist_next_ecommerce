"use client"
import React, { useEffect, useRef, useState } from 'react';
import Axios from './../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import CardLoading from './CardLoading';
import CardProduct from './CardProduct';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { valideURLConvert } from './../utils/valideURLConvert';
import Link from 'next/link';
import Head from 'next/head';
import AxiosToastError from './../utils/AxiosToastError';

const CategoryWiseProductDisplay = ({ id, name }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef();
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const loadingCardNumber = new Array(6).fill(null);

  const fetchCategoryWiseProduct = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: {
          id: id,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryWiseProduct();
    // eslint-disable-next-line
  }, []);

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 200;
    }
  };

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 200;
    }
  };

  const handleRedirectProductListpage = () => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => {
        return c._id === id;
      });
      return filterData ? true : null;
    });
    const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(
      subcategory?.name
    )}-${subcategory?._id}`;
    return url;
  };

  const redirectURL = handleRedirectProductListpage();

  return (
    <>
    <Head>
     <title>{name}</title>
        <meta name="description" content={`Browse our selection of high-quality ${name} makeup products.`} />
        <meta name="keywords" content={`${name}, makeup, cosmetics, beauty, products`} />
        </Head>
    <div>
      <div className="container mx-auto px-2 flex items-center justify-between p-2">
        <div className="flex-1 flex justify-center">
          <h1 className="font-bold text-[40px] md:text-[60px] text-center">
            {name}
          </h1>
        </div>
      </div>
      <div className="flex-1 flex justify-end font-bold text-[20px] md:text-[24px]">
        <Link
          href={redirectURL}
          className="text-pink-400 hover:text-green-400 font-bold md:text-[20px] text-[16px] transition-colors duration-300 p-4"
        >
          See All
        </Link>
      </div>
      <div className="relative flex items-center cursor-pointer">
        <div
          className="grid grid-cols-2 sm:grid-cols-2 md:flex justify-items-center gap-8 md:gap-6 lg:gap-2 container mx-auto px-2 overflow-x-scroll scrollbar-none scroll-smooth"
          ref={containerRef}
        >
          {loading &&
            loadingCardNumber.map((_, index) => (
              <CardLoading key={'CategorywiseProductDisplay123' + index} />
            ))}
          {data.map((p, index) => (
            <CardProduct
              data={p}
              key={p._id + 'CategorywiseProductDisplay' + index}
            />
          ))}
        </div>
        <div className="w-full left-0 right-0 container mx-auto px-2 absolute hidden lg:flex justify-between">
          <button
            onClick={handleScrollLeft}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg text-lg p-2 rounded-full"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={handleScrollRight}
            className="z-10 relative bg-white hover:bg-gray-100 shadow-lg p-2 text-lg rounded-full"
          >
            <FaAngleRight />
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default CategoryWiseProductDisplay;