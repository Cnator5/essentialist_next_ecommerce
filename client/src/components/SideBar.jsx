// // components/SideBar.jsx
// 'use client'

// import React, { useEffect, useMemo, useState } from 'react'
// import { useSelector } from 'react-redux'
// import { useRouter } from 'next/navigation'
// import { valideURLConvert } from '../utils/valideURLConvert'

// /**
//  * Fix: Hydration mismatch from server rendering "No categories found"
//  * while client rendered the loading skeleton.
//  *
//  * Strategy (per Next.js docs on hydration errors):
//  * - Render a stable placeholder on the server AND on the first client render.
//  * - After hydration (useEffect), switch to the real UI using Redux state.
//  * This guarantees the initial client render matches the server HTML.
//  */

// const SideBar = ({ isMobile = false, onNavigate = () => {} }) => {
//   const router = useRouter()

//   // Global state
//   const loadingCategory = useSelector((state) => state.product.loadingCategory)
//   const categoryData = useSelector((state) => state.product.allCategory) || []
//   const subCategoryData = useSelector((state) => state.product.allSubCategory) || []

//   // Hydration guard: first render == server HTML
//   const [hydrated, setHydrated] = useState(false)
//   useEffect(() => {
//     setHydrated(true)
//   }, [])

//   const getSubcategoriesForCategory = (categoryId) =>
//     subCategoryData.filter((sub) =>
//       Array.isArray(sub.category)
//         ? sub.category.some((cat) => cat?._id === categoryId)
//         : false
//     )

//   // Classes
//   const baseClasses = isMobile
//     ? 'bg-white text-black w-full'
//     : 'bg-white shadow-lg rounded-lg w-full h-auto flex flex-col hidden md:block'

//   const headerClasses = isMobile
//     ? 'bg-pink-400 p-3 border-b border-purple-800'
//     : 'bg-gradient-to-r from-pink-300 to-pink-400 p-2'

//   const categoryItemClasses = isMobile
//     ? 'w-full px-4 py-3 flex items-center hover:bg-purple-50 transition-colors border-b border-gray-100'
//     : 'w-full px-6 py-3 flex items-center hover:bg-pink-50 transition-colors'

//   const subcategoryContainerClasses = isMobile
//     ? 'bg-white px-4 py-2'
//     : 'bg-gray-50 px-6 py-2'

//   const subcategoryItemClasses = isMobile
//     ? 'text-sm text-black py-2 px-3 font-bold rounded hover:bg-pink-600 hover:text-white cursor-pointer transition-colors block'
//     : 'text-sm text-black py-1 px-2 rounded hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-colors'

//   // Stable skeleton chunks to ensure deterministic HTML
//   const stableSkeletonItems = useMemo(() => Array.from({ length: 8 }), [])

//   const SkeletonBlock = ({ index }) => (
//     <div key={`loading-${index}`} className="p-4">
//       <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
//       <div className="h-4 bg-gray-200 rounded w-1/2 ml-3 mb-2" />
//       <div className="h-4 bg-gray-200 rounded w-2/3 ml-3" />
//     </div>
//   )

//   // 1) Pre-hydration placeholder (same on server and initial client render)
//   if (!hydrated) {
//     return (
//       <aside className={baseClasses}>
//         <div className={headerClasses}>
//           <h2 className="text-white font-bold text-lg uppercase tracking-wide">
//             Shop By Category
//           </h2>
//         </div>
//         <div className={isMobile ? '' : 'divide-y divide-gray-100'}>
//           <div className="p-4 text-sm text-gray-500" aria-hidden="true">
//             Loading...
//           </div>
//         </div>
//       </aside>
//     )
//   }

//   // 2) After hydration: real UI
//   const showSkeleton = loadingCategory
//   const showEmpty = !loadingCategory && categoryData.length === 0

//   return (
//     <aside className={baseClasses}>
//       <div className={headerClasses}>
//         <h2 className="text-white font-bold text-lg uppercase tracking-wide">
//           Shop By Category
//         </h2>
//       </div>

//       <div className={isMobile ? '' : 'divide-y divide-gray-100'}>
//         {showSkeleton ? (
//           stableSkeletonItems.map((_, index) => <SkeletonBlock key={index} index={index} />)
//         ) : showEmpty ? (
//           <div className="p-4 text-sm text-gray-500">No categories found</div>
//         ) : (
//           categoryData.map((category) => {
//             const subcategories = getSubcategoriesForCategory(category._id)
//             return (
//               <div key={category._id} className="overflow-hidden">
//                 <div className={categoryItemClasses}>
//                   <span className="font-bold text-black">{category.name}</span>
//                 </div>
//                 <div className={subcategoryContainerClasses}>
//                   {subcategories.length > 0 ? (
//                     <ul className={`space-y-1 py-2 ${isMobile ? 'pl-4' : ''}`}>
//                       {subcategories.map((subCat) => (
//                         <li
//                           key={subCat._id}
//                           onClick={() => {
//                             const url = `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(
//                               subCat.name
//                             )}-${subCat._id}`
//                             router.push(url)
//                             onNavigate()
//                           }}
//                           className={subcategoryItemClasses}
//                         >
//                           {subCat.name}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p
//                       className={`text-sm py-2 ${
//                         isMobile ? 'text-gray-400 pl-4' : 'text-gray-500'
//                       }`}
//                     >
//                       No subcategories available
//                     </p>
//                   )}
//                 </div>
//               </div>
//             )
//           })
//         )}
//       </div>
//     </aside>
//   )
// }

// export default SideBar






'use client' // At the top!

import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux' // Only for fallback
import Link from 'next/link'
import { valideURLConvert } from '../utils/valideURLConvert'

const makeupBrands = [
  'NYX',
  'LA girl', 
  'ELF',
  'SMASHBOX',
  'BOBBI BROWN',
  'TOO FACED',
  'ESTEE LAUDER',
  'MAC',
  'CLINIC',
  'ONE SIZE',
  'JUVIA'
]

const createBrandSlug = (brand) => {
  return brand.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

const SideBar = ({ 
  isMobile = false, 
  onNavigate = () => {}, 
  categoryData = [], 
  subCategoryData = [], 
  loadingCategory = false 
}) => {
  // Fallback to Redux only if props are empty (legacy/edge cases)
  const reduxCategoryData = useSelector((state) => state.product.allCategory) || []
  const reduxSubCategoryData = useSelector((state) => state.product.allSubCategory) || []
  const reduxLoadingCategory = useSelector((state) => state.product.loadingCategory)

  const finalCategoryData = categoryData.length > 0 ? categoryData : reduxCategoryData
  const finalSubCategoryData = subCategoryData.length > 0 ? subCategoryData : reduxSubCategoryData
  const finalLoadingCategory = typeof loadingCategory === 'boolean' ? loadingCategory : reduxLoadingCategory

  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  const getSubcategoriesForCategory = useMemo(() => {
    const subcatsByCat = {}
    finalSubCategoryData.forEach((sub) => {
      const catId = Array.isArray(sub.category) ? sub.category[0]?._id : sub.category?._id
      if (catId) {
        if (!subcatsByCat[catId]) subcatsByCat[catId] = []
        subcatsByCat[catId].push(sub)
      }
    })
    return (categoryId) => subcatsByCat[categoryId] || []
  }, [finalSubCategoryData])

  const baseClasses = isMobile
    ? 'bg-white text-black w-full'
    : 'bg-white shadow-lg rounded-lg w-full h-auto flex flex-col hidden md:block'

  const headerClasses = isMobile
    ? 'bg-pink-400 p-3 border-b border-purple-800'
    : 'bg-gradient-to-r from-pink-300 to-pink-400 p-2'

  const categoryItemClasses = isMobile
    ? 'w-full px-4 py-3 flex items-center hover:bg-purple-50 transition-colors border-b border-gray-100'
    : 'w-full px-6 py-3 flex items-center hover:bg-pink-50 transition-colors'

  const subcategoryContainerClasses = isMobile
    ? 'bg-white px-4 py-2'
    : 'bg-gray-50 px-6 py-2'

  const subcategoryItemClasses = isMobile
    ? 'text-sm text-black py-2 px-3 font-bold rounded hover:bg-pink-600 hover:text-white cursor-pointer transition-colors block'
    : 'text-sm text-black py-1 px-2 rounded hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-colors'

  const brandItemClasses = isMobile
    ? 'text-sm text-black py-2 px-3 font-bold rounded hover:bg-pink-600 hover:text-white cursor-pointer transition-colors block'
    : 'text-sm text-black py-1 px-2 rounded hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-colors'

  const stableSkeletonItems = useMemo(() => Array.from({ length: 8 }), [])

  const SkeletonBlock = ({ index }) => (
    <div key={`loading-${index}`} className="p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2 ml-3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 ml-3" />
    </div>
  )

  if (!hydrated) {
    return (
      <aside className={baseClasses}>
        <div className={headerClasses}>
          <h2 className="text-white font-bold text-lg uppercase tracking-wide">
            Shop By Category
          </h2>
        </div>
        <div className={isMobile ? '' : 'divide-y divide-gray-100'}>
          <div className="p-4 text-sm text-gray-500" aria-hidden="true">
            Loading...
          </div>
        </div>
      </aside>
    )
  }

  const showSkeleton = finalLoadingCategory
  const showEmpty = !finalLoadingCategory && finalCategoryData.length === 0

  return (
    <aside className={baseClasses}>
      <div className={headerClasses}>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">
          Shop By Brands
        </h2>
      </div>
      
      <div className="overflow-hidden">
        <div className={categoryItemClasses}>
          <span className="font-bold text-black">All Brands</span>
        </div>
        <div className={subcategoryContainerClasses}>
          <ul className={`space-y-1 py-2 ${isMobile ? 'pl-4' : ''}`}>
            {makeupBrands.map((brand) => {
              const brandSlug = createBrandSlug(brand)
              return (
                <li key={brand}>
                  <Link
                    href={`/brands/${brandSlug}`}
                    prefetch={true} // Fast navigation: preloads on hover/viewport
                    onClick={onNavigate}
                    className={brandItemClasses}
                  >
                    {brand}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className={`${headerClasses} ${isMobile ? 'border-t border-purple-800' : 'border-t border-pink-300'}`}>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">
          Shop By Category
        </h2>
      </div>

      <div className={isMobile ? '' : 'divide-y divide-gray-100'}>
        {showSkeleton ? (
          stableSkeletonItems.map((_, index) => <SkeletonBlock key={index} index={index} />)
        ) : showEmpty ? (
          <div className="p-4 text-sm text-gray-500">No categories found</div>
        ) : (
          finalCategoryData.map((category) => {
            const subcategories = getSubcategoriesForCategory(category._id)
            return (
              <div key={category._id} className="overflow-hidden">
                <div className={categoryItemClasses}>
                  <span className="font-bold text-black">{category.name}</span>
                </div>
                <div className={subcategoryContainerClasses}>
                  {subcategories.length > 0 ? (
                    <ul className={`space-y-1 py-2 ${isMobile ? 'pl-4' : ''}`}>
                      {subcategories.map((subCat) => {
                        const url = `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(
                          subCat.name
                        )}-${subCat._id}`
                        return (
                          <li key={subCat._id}>
                            <Link
                              href={url}
                              prefetch={true} // Fast navigation
                              onClick={onNavigate}
                              className={subcategoryItemClasses}
                            >
                              {subCat.name}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm py-2 ${
                        isMobile ? 'text-gray-400 pl-4' : 'text-gray-500'
                      }`}
                    >
                      No subcategories available
                    </p>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </aside>
  )
}

export default SideBar