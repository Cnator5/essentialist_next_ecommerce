"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { useRouter } from 'next/navigation';



const SideBar = ({ isMobile = false, onNavigate = () => {} }) => {
  const loadingCategory = useSelector(state => state.product.loadingCategory);
  const categoryData = useSelector(state => state.product.allCategory) || [];
  const subCategoryData = useSelector(state => state.product.allSubCategory) || [];
    const router = useRouter(); // Changed from useNavigate

  const handleRedirectProductListpage = (id, cat, subCat) => {
    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subCat.name)}-${subCat._id}`;
    router.push(url);
    onNavigate(); // Close mobile menu if on mobile
  };

  const getSubcategoriesForCategory = (categoryId) => {
    return subCategoryData.filter(sub =>
      sub.category.some(cat => cat._id === categoryId)
    );
  };

  const baseClasses = isMobile 
    ? "bg-white text-black w-full" 
    : "bg-white shadow-lg rounded-lg w-full h-auto flex flex-col hidden md:block";

  const headerClasses = isMobile
    ? "bg-pink-400 p-3 border-b border-purple-800"
    : "bg-gradient-to-r from-pink-300 to-pink-400 p-2";

  const categoryItemClasses = isMobile
    ? "w-full px-4 py-3 flex items-center hover:bg-purple-900 transition-colors border-b border-gray-700"
    : "w-full px-6 py-3 flex items-center hover:bg-pink-50 transition-colors";

  const subcategoryContainerClasses = isMobile
    ? "bg-white px-4 py-2"
    : "bg-gray-50 px-6 py-2";

  const subcategoryItemClasses = isMobile
    ? "text-sm text-black py-2 px-3 font-bold rounded hover:bg-pink-600 hover:text-white cursor-pointer transition-colors block"
    : "text-sm text-black py-1 px-2 rounded hover:bg-pink-100 hover:text-pink-600 cursor-pointer transition-colors";

  return (
    <aside className={baseClasses}>
      <div className={headerClasses}>
        <h2 className="text-white font-bold text-lg uppercase tracking-wide">Shop By Category</h2>
      </div>
      <div className={isMobile ? "" : "divide-y divide-gray-100"}>
        {loadingCategory ? (
          Array(8).fill().map((_, index) => (
            <div key={`loading-${index}`} className="animate-pulse p-4">
              <div className={`h-5 ${isMobile ? 'bg-gray-700' : 'bg-gray-200'} rounded w-3/4 mb-3`}></div>
              <div className={`h-4 ${isMobile ? 'bg-gray-800' : 'bg-gray-100'} rounded w-1/2 ml-3 mb-2`}></div>
              <div className={`h-4 ${isMobile ? 'bg-gray-800' : 'bg-gray-100'} rounded w-2/3 ml-3`}></div>
            </div>
          ))
        ) : (
          categoryData.map(category => {
            const subcategories = getSubcategoriesForCategory(category._id);
            return (
              <div key={category._id} className="overflow-hidden">
                <div className={categoryItemClasses}>
                  <span className={`font-bold ${isMobile ? 'text-black' : 'text-black'}`}>
                    {category.name}
                  </span>
                </div>
                <div className={subcategoryContainerClasses}>
                  {subcategories.length > 0 ? (
                    <ul className={`space-y-1 py-2 ${isMobile ? 'pl-4' : ''}`}>
                      {subcategories.map(subCat => (
                        <li
                          key={subCat._id}
                          onClick={() => handleRedirectProductListpage(category._id, category.name, subCat)}
                          className={subcategoryItemClasses}
                        >
                          {subCat.name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={`text-sm py-2 ${isMobile ? 'text-gray-400 pl-4' : 'text-gray-500'}`}>
                      No subcategories available
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};

export default SideBar;