"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useRouter } from "next/navigation";

/**
 * Why these changes:
 * - Hydration error likely stemmed from rendering different markup/classes
 *   between server and client when loadingCategory is true (e.g. animate-pulse,
 *   different bg colors based on isMobile).
 * - We ensure the initial server and client render match by:
 *   1) Using a stableLoadingSkeleton flag: server renders a minimal, non-animated skeleton.
 *   2) After mount (useEffect), we enable the animated/mobile-aware skeleton.
 * - No random/Date.now, no window checks in render path.
 */

const SideBar = ({ isMobile = false, onNavigate = () => {} }) => {
  const router = useRouter();

  // Global state
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory) || [];
  const subCategoryData =
    useSelector((state) => state.product.allSubCategory) || [];

  // Client-only flag to toggle enhanced skeleton after hydration
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRedirectProductListpage = (id, cat, subCat) => {
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subCat.name
    )}-${subCat._id}`;
    router.push(url);
    onNavigate();
  };

  const getSubcategoriesForCategory = (categoryId) =>
    subCategoryData.filter((sub) =>
      Array.isArray(sub.category)
        ? sub.category.some((cat) => cat?._id === categoryId)
        : false
    );

  // Classes
  const baseClasses = isMobile
    ? "bg-white text-black w-full"
    : "bg-white shadow-lg rounded-lg w-full h-auto flex flex-col hidden md:block";

  const headerClasses = isMobile
    ? "bg-pink-400 p-3 border-b border-purple-800"
    : "bg-gradient-to-r from-pink-300 to-pink-400 p-2";

  const categoryItemClasses = isMobile
    ? "w-full px-4 py-3 flex items-center hover:bg-purple-900 transition-colors border-b border-gray-100"
    : "w-full px-6 py-3 flex items-center hover:bg-pink-50 transition-colors";

  const subcategoryContainerClasses = isMobile
    ? "bg-white px-4 py-2"
    : "bg-gray-50 px-6 py-2";

  const subcategoryItemClasses = isMobile
    ? "text-sm text-black py-2 px-3 font-bold rounded hover:bg-pink-600 hover:text-white cursor-pointer transition-colors block"
    : "text-sm text-black py-1 px-2 rounded hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-colors";

  // Stable skeleton chunks to ensure deterministic server/client HTML
  const stableSkeletonItems = useMemo(() => Array.from({ length: 8 }), []);

  const SkeletonBlock = ({ index }) => {
    // Only enable animation and mobile-different bg shades on the client
    const animatedClass = isClient ? "animate-pulse" : "";
    const barBase = isMobile
      ? isClient
        ? // after hydration, keep your original mobile shades
          ["bg-gray-700", "bg-gray-800", "bg-gray-800"]
        : // during SSR/first paint, keep neutral shades to avoid mismatch
          ["bg-gray-200", "bg-gray-200", "bg-gray-200"]
      : isClient
      ? ["bg-gray-200", "bg-gray-100", "bg-gray-100"]
      : ["bg-gray-200", "bg-gray-200", "bg-gray-200"];

    return (
      <div key={`loading-${index}`} className={`${animatedClass} p-4`}>
        <div className={`h-5 ${barBase[0]} rounded w-3/4 mb-3`} />
        <div className={`h-4 ${barBase[1]} rounded w-1/2 ml-3 mb-2`} />
        <div className={`h-4 ${barBase[2]} rounded w-2/3 ml-3`} />
      </div>
    );
  };

  return (
    <aside className={baseClasses}>
      <div className={headerClasses}>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">
          Shop By Category
        </h2>
      </div>

      <div className={isMobile ? "" : "divide-y divide-gray-100"}>
        {loadingCategory ? (
          // Render a deterministic number of skeleton items with stable structure
          stableSkeletonItems.map((_, index) => <SkeletonBlock key={index} index={index} />)
        ) : categoryData.length > 0 ? (
          categoryData.map((category) => {
            const subcategories = getSubcategoriesForCategory(category._id);
            return (
              <div key={category._id} className="overflow-hidden">
                <div className={categoryItemClasses}>
                  <span className="font-bold text-black">{category.name}</span>
                </div>
                <div className={subcategoryContainerClasses}>
                  {subcategories.length > 0 ? (
                    <ul className={`space-y-1 py-2 ${isMobile ? "pl-4" : ""}`}>
                      {subcategories.map((subCat) => (
                        <li
                          key={subCat._id}
                          onClick={() =>
                            handleRedirectProductListpage(
                              category._id,
                              category.name,
                              subCat
                            )
                          }
                          className={subcategoryItemClasses}
                        >
                          {subCat.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className={`text-sm py-2 ${
                        isMobile ? "text-gray-400 pl-4" : "text-gray-500"
                      }`}
                    >
                      No subcategories available
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          // Empty state (deterministic)
          <div className="p-4 text-sm text-gray-500">No categories found</div>
        )}
      </div>
    </aside>
  );
};

export default SideBar;