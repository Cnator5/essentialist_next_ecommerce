// src/app/page.js
'use client'

import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { valideURLConvert } from '@/utils/valideURLConvert'
import CategoryWiseProductDisplay from '@/components/CategoryWiseProductDisplay'
import ProductRecommendations from '@/components/ProductRecommendations'
import TikTokGallery from '@/components/TikTokGallery'
import Image from 'next/image'
import bannern from '/public/assets/fbb4343f-2d39-4c25-ac2f-1ab5037f50da.avif'
import bannerm from '/public/assets/56e20d4e-2643-4edb-b3fd-7762b81a7658.avif'
import bannerp from '/public/assets/lipstick-cosmetics-makeup-beauty-product-ad-banner_33099-1533.jpg'
import bannerMobile from '/public/assets/cosmetics-beauty-products-for-make-up-sale-banner-vector-25170220.avif'

export default function Home() {
  const loadingCategory = useSelector(state => state.product.loadingCategory)
  const categoryData = useSelector(state => state.product.allCategory)
  const subCategoryData = useSelector(state => state.product.allSubCategory)
  const router = useRouter()

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find(sub =>
      sub.category.some(c => c._id === id)
    )
    if (!subcategory) return
    
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`
    router.push(url)
  }
  

  // Schema.org injection (for SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "EssentialisMakeupStore",
    "url": "https://www.esmakeupstore.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.esmakeupstore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "EssentialisMakeupStore",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg"
      }
    },
    "image": [
      "https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg",
      "https://www.esmakeupstore.com/assets/NYX-PMU-Makeup-Lips-Liquid-Lipstick-LIP-LINGERIE-XXL-LXXL28-UNTAMABLE-0800897132187-OpenSwatch.webp",
      "https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg"
    ]
  }

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className='bg-white'>
        <ProductRecommendations />
        <div className='container mx-auto px-4'>
          <div className={`w-full h-full min-h-48 bg-blue-10 rounded ${!bannern && "animate-pulse my-2"}`}>
            <div className="hidden lg:block mt-2 w-full h-full">
              <Image src={bannern} className='w-full h-full' alt='Beautiful model with makeup' priority />
            </div>
            <div className="lg:hidden w-full h-full">
              <Image src={bannerMobile} className='w-full h-full' alt='Cosmetics sale banner' priority />
            </div>
            <div className="font-bold text-[40px] md:text-[60px] text-center">
              <h1>Shop by Category</h1>
            </div>
          </div>
        </div>
        <div className='container mx-auto px-4 my-2 grid grid-cols-7 sm:grid-cols-7 md:grid-cols-7 lg:grid-cols-7 gap-2 cursor-pointer justify-center items-center'>
          {
            loadingCategory ? (
              new Array(12).fill(null).map((_, index) => (
                <div key={index + "loadingcategory"} className='bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse'>
                  <div className='bg-blue-100 min-h-24 rounded'></div>
                  <div className='bg-blue-100 h-8 rounded'></div>
                </div>
              ))
            ) : (
              categoryData.map((cat) => (
                <div
                  key={cat._id + "displayCategory"}
                  className="w-full h-full"
                  onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                >
                  <div>
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-scale-down" />
                  </div>
                  <div className="text-center text-xs sm:text-sm md:text-base font-semibold text-gray-700 mt-2">
                    {cat.name}
                  </div>
                </div>
              ))
            )
          }
        </div>
        <div className='container mx-auto mt-2 px-4'>
          <div className={`w-full h-full min-h-48 bg-blue-10 rounded ${!bannerm && "animate-pulse my-2"}`}>
            <div className="hidden lg:block w-full h-80">
              <Image src={bannerm} className='w-full h-80' alt='Eyeshadow palette banner' priority />
            </div>
            <div className="lg:hidden w-full h-full">
              <Image src={bannerp} className='w-full h-full' alt='Lipstick collection banner' priority />
            </div>
          </div>
        </div>
        <div className='lg:block'>
          {
            categoryData?.map((c) => (
              <CategoryWiseProductDisplay
                key={c?._id + "CategorywiseProduct"}
                id={c?._id}
                name={c?.name}
              />
            ))
          }
        </div>
        <TikTokGallery />
         {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/237655225569"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 bottom-16 right-2 md:bottom-6 md:right-6 flex items-center justify-center w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg transition-colors"
          style={{ boxShadow: '0 4px 16px rgba(37, 211, 102, 0.3)' }}
          aria-label="Contact us on WhatsApp"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="white"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.031-.967-.273-.099-.47-.148-.669.15-.198.297-.767.966-.941 1.164-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.61-.916-2.206-.242-.58-.487-.5-.669-.51-.173-.006-.372-.007-.571-.007s-.521.075-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.214 3.074.149.198 2.1 3.205 5.077 4.372.71.306 1.263.489 1.695.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.123-.272-.198-.57-.347zm-5.421 7.617c-1.191 0-2.381-.195-3.509-.577l-3.909 1.024 1.04-3.814c-.673-1.045-1.205-2.181-1.498-3.377C1.212 14.271 0 12.211 0 9.999 0 4.477 5.373 0 12 0c3.185 0 6.187 1.24 8.438 3.488C22.687 5.737 24 8.741 24 12c0 6.627-5.373 12-12 12zm0-22C6.486 2 2 6.486 2 12c0 2.083 1.04 4.166 2.888 5.833l-.96 3.521 3.624-.948C9.834 21.001 10.912 21.2 12 21.2c5.514 0 10-4.486 10-10S17.514 2 12 2z"/>
          </svg>
        </a>
      </section>
    </>
  )
}