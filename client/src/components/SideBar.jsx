// components/SideBar.jsx
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { valideURLConvert } from '../utils/valideURLConvert'

/**
 * Fix: Hydration mismatch from server rendering "No categories found"
 * while client rendered the loading skeleton.
 *
 * Strategy (per Next.js docs on hydration errors):
 * - Render a stable placeholder on the server AND on the first client render.
 * - After hydration (useEffect), switch to the real UI using Redux state.
 * This guarantees the initial client render matches the server HTML.
 */

const SideBar = ({ isMobile = false, onNavigate = () => {} }) => {
  const router = useRouter()

  // Global state
  const loadingCategory = useSelector((state) => state.product.loadingCategory)
  const categoryData = useSelector((state) => state.product.allCategory) || []
  const subCategoryData = useSelector((state) => state.product.allSubCategory) || []

  // Hydration guard: first render == server HTML
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    setHydrated(true)
  }, [])

  const getSubcategoriesForCategory = (categoryId) =>
    subCategoryData.filter((sub) =>
      Array.isArray(sub.category)
        ? sub.category.some((cat) => cat?._id === categoryId)
        : false
    )

  // Classes
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

  // Stable skeleton chunks to ensure deterministic HTML
  const stableSkeletonItems = useMemo(() => Array.from({ length: 8 }), [])

  const SkeletonBlock = ({ index }) => (
    <div key={`loading-${index}`} className="p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-1/2 ml-3 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3 ml-3" />
    </div>
  )

  // 1) Pre-hydration placeholder (same on server and initial client render)
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

  // 2) After hydration: real UI
  const showSkeleton = loadingCategory
  const showEmpty = !loadingCategory && categoryData.length === 0

  return (
    <aside className={baseClasses}>
      <div className={headerClasses}>
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
          categoryData.map((category) => {
            const subcategories = getSubcategoriesForCategory(category._id)
            return (
              <div key={category._id} className="overflow-hidden">
                <div className={categoryItemClasses}>
                  <span className="font-bold text-black">{category.name}</span>
                </div>
                <div className={subcategoryContainerClasses}>
                  {subcategories.length > 0 ? (
                    <ul className={`space-y-1 py-2 ${isMobile ? 'pl-4' : ''}`}>
                      {subcategories.map((subCat) => (
                        <li
                          key={subCat._id}
                          onClick={() => {
                            const url = `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(
                              subCat.name
                            )}-${subCat._id}`
                            router.push(url)
                            onNavigate()
                          }}
                          className={subcategoryItemClasses}
                        >
                          {subCat.name}
                        </li>
                      ))}
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