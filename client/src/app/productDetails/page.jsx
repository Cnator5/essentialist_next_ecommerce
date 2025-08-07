import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SummaryApi from '../common/SummaryApi';
import Axios from '../utils/Axios';
import AxiosToastError from '../utils/AxiosToastError';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees';
import Divider from '../components/Divider';
import image1 from '../assets/minute_delivery.jpeg';
import image2 from '../assets/Best_Prices_Offers.png';
import image3 from '../assets/Wide_Assortment.avif';
import { pricewithDiscount } from '../utils/PriceWithDiscount';
import AddToCartButton from '../components/AddToCartButton';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Helmet } from "react-helmet-async";
import ProductRecommendations from '../components/ProductRecommendations';

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

const ProductDisplayPage = () => {
  const params = useParams();
  const productId = params?.product?.split("-")?.slice(-1)[0];
  
  const [data, setData] = useState(null);
  const [image, setImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const imageContainer = useRef();

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: { productId }
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
    fetchProductDetails();
    // eslint-disable-next-line
  }, [productId]);

  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100;
  };

  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100;
  };

  if (loading || !data) {
    return (
      <div className='container mx-auto flex justify-center items-center h-screen'>
        <p>Loading product...</p>
      </div>
    );
  }

  return (
    <>
      {/* Add the custom styles */}
      <style>{tabularStyles}</style>
      
      <Helmet>
        <title>{`${data.name}`}</title>
        <meta name="description" content={data.description} />
      </Helmet>

      <section className='container mx-auto p-4 grid lg:grid-cols-2 text-black font-bold md:font-normal'>
        {/* LEFT: Images & Description */}
        <div>
          <div className='bg-white lg:min-h-[65vh] lg:max-h-[65vh] rounded min-h-56 max-h-56 h-full w-full'>
            <img
              src={data.image[image]}
              className='w-full h-full object-scale-down scale-100'
              alt={data.name}
            />
          </div>
          <div className='flex items-center justify-center gap-3 my-2'>
            {data.image.map((img, index) => (
              <div
                key={img + index + "point"}
                className={`bg-slate-200 w-3 h-3 lg:w-5 lg:h-5 rounded-full ${index === image ? "bg-slate-300" : ""}`}
              ></div>
            ))}
          </div>
          <div className='grid relative'>
            <div ref={imageContainer} className='flex gap-4 z-10 relative w-full overflow-x-auto scrollbar-none'>
              {data.image.map((img, index) => (
                <div className='w-20 h-20 min-h-20 min-w-20 cursor-pointer shadow-md' key={img + index}>
                  <img
                    src={img}
                    alt={`Product image ${index + 1} of ${data.name}`}
                    onClick={() => setImage(index)}
                    className='w-full h-full object-scale-down'
                  />
                </div>
              ))}
            </div>
            <div className='w-full -ml-3 h-full hidden lg:flex justify-between absolute items-center'>
              <button onClick={handleScrollLeft} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
                <FaAngleLeft />
              </button>
              <button onClick={handleScrollRight} className='z-10 bg-white relative p-1 rounded-full shadow-lg'>
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
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
            
            {/* Display Plain Text Details in Tabular Format */}
            {data.plainTextDetails && (
              <div>
                <p className='font-semibold'>Product Specifications</p>
                <div className='tabular-content'>
                  {data.plainTextDetails}
                </div>
              </div>
            )}
            
            <div>
              <p className='font-semibold'>Unit</p>
              <p className='text-base'>{data.unit}</p>
            </div>
            {data?.more_details && Object.keys(data?.more_details).map((element, idx) => (
              <div key={element + idx}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Price, Add to Cart, Why Shop, etc */}
        <div className='p-4 lg:pl-7 text-base lg:text-lg'>
          <p className='bg-green-300 w-fit px-2 rounded-full'>10 Minutes</p>
          <h2 className='text-lg font-semibold lg:text-3xl'>{data.name}</h2>
          <p className=''>{data.unit}</p>
          <Divider />
          <div>
            <p className=''>Bulk Price</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data.bulkPrice, data.discount))}</p>
              </div>
              {data.discount > 0 && (
                <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
              )}
              {data.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-black'>Discount</span></p>
              )}
            </div>
          </div>
          <div>
            <p className=''>Price</p>
            <div className='flex items-center gap-2 lg:gap-4'>
              <div className='border border-green-600 px-4 py-2 rounded bg-green-50 w-fit'>
                <p className='font-semibold text-lg lg:text-xl'>{DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}</p>
              </div>
              {data.discount > 0 && (
                <p className='line-through'>{DisplayPriceInRupees(data.price)}</p>
              )}
              {data.discount > 0 && (
                <p className="font-bold text-green-600 lg:text-2xl">{data.discount}% <span className='text-base text-black'>Discount</span></p>
              )}
            </div>
          </div>
          {data.stock === 0 ? (
            <p className='text-lg text-red-500 my-2'>Out of Stock</p>
          ) : (
            <div className='my-4'>
              <AddToCartButton data={data} />
            </div>
          )}

          <h2 className='font-semibold'>Why shop from Essentialist Makeup Store?</h2>
          <div>
            <div className='flex items-center gap-4 my-4'>
              <img
                src={image1}
                alt='Superfast delivery'
                className='w-20 h-20'
              />
              <div className='text-sm'>
                <div className='font-semibold'>Superfast Delivery</div>
                <p>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4'>
              <img
                src={image2}
                alt='Best prices and offers'
                className='w-20 h-20'
              />
              <div className='text-sm'>
                <div className='font-semibold'>Best Prices and Offers</div>
                <p>Best price destination with offers directly from the manufacturers.</p>
              </div>
            </div>
            <div className='flex items-center gap-4 my-4'>
              <img
                src={image3}
                alt='Wide assortment'
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
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
            
            {/* Display Plain Text Details in Tabular Format */}
            {data.plainTextDetails && (
              <div>
                <p className='font-semibold'>Product Specifications</p>
                <div className='tabular-content'>
                  {data.specifications || data.plainTextDetails}
                  {data.plainTextDetails}
                </div>
              </div>
            )}
            
            <div>
              <p className='font-semibold'>Unit</p>
              <p className='text-base'>{data.unit}</p>
            </div>
            {data?.more_details && Object.keys(data?.more_details).map((element, idx) => (
              <div key={element + idx}>
                <p className='font-semibold'>{element}</p>
                <p className='text-base'>{data?.more_details[element]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProductRecommendations currentProductId={productId} currentProductData={data} />
    </>
  );
};

export default ProductDisplayPage;