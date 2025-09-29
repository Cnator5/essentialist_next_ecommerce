// "use client";
// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { valideURLConvert } from '../utils/valideURLConvert';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// const Dropdown = () => {
//     const [isHovered, setIsHovered] = useState(false);
//     const loadingCategory = useSelector(state => state.product.loadingCategory);
//     const categoryData = useSelector(state => state.product.allCategory);
//     const subCategoryData = useSelector(state => state.product.allSubCategory);
//     const router = useRouter(); // Changed from useNavigate

//     const handleRedirectProductListpage = (id, cat, subCat) => {
//         const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subCat.name)}-${subCat._id}`;
//         router.push(url);
//         setIsHovered(false);
//     };
    

//     const getSubcategoriesForCategory = (categoryId) => {
//         return subCategoryData.filter(sub =>
//             sub.category.some(cat => cat._id === categoryId)
//         );
//     };

//     return (
//         <div className="relative group">
//             {/* Makeup Button - Border Removed */}
//             <button
//                 className="p-2 text-white font-medium rounded-lg hover:text-pink-400 transition-all duration-300 focus:outline-none"
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//                 onFocus={() => setIsHovered(true)}
//                 onBlur={() => setIsHovered(false)}
//                 aria-haspopup="true"
//                 aria-expanded={isHovered}
//             >
//                 <span className="flex items-center text-semibold text-lg">
//                     Shop All Makeup
//                     <svg className="w-auto h-4 ml-1.5 transition-transform duration-300 transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                     </svg>
//                 </span>
//             </button>

//             {/* Dropdown Panel */}
//             {isHovered && (
//                 <div
//                     className="
//                         absolute left-0 top-full mt-1
//                         w-full max-w-full
//                         md:w-[1250px] md:max-w-[1250px]
//                         md:translate-x-[-57.5%]
//                         bg-white rounded-xl shadow-xl z-50 overflow-hidden
//                         transform origin-top scale-y-100 transition-all duration-200
//                     "
//                     onMouseEnter={() => setIsHovered(true)}
//                     onMouseLeave={() => setIsHovered(false)}
//                 >
//                     <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 h-1.5"></div>
//                     <div className="p-4 md:p-8">
//                         {loadingCategory ? (
//                             <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
//                                 {[...Array(12)].map((_, index) => (
//                                     <div key={index} className="animate-pulse font-bold">
//                                         <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
//                                         {[...Array(4)].map((_, i) => (
//                                             <div key={i} className="h-3 bg-gray-100 rounded w-1/2 mb-2 ml-2" />
//                                         ))}
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
//                                 {categoryData.map((category) => (
//                                     <div key={category._id} className="break-inside-avoid">
//                                         <div className="font-bold text-black pb-2 mb-3 text-base tracking-wide border-b border-pink-100 uppercase">
//                                             {category.name}
//                                         </div>
//                                         <div className="space-y-0.5">
//                                             {getSubcategoriesForCategory(category._id).map((subCat) => (
//                                                 <div
//                                                     key={subCat._id}
//                                                     className="text-sm text-black font-semibold md:font-normal rounded-md hover:bg-pink-50 hover:text-pink-400 cursor-pointer"
//                                                     onClick={() => handleRedirectProductListpage(category._id, category.name, subCat)}
//                                                 >
//                                                     {subCat.name}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Dropdown;





"use client";

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import Link from 'next/link';

const Dropdown = () => {
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);
    
    const loadingCategory = useSelector(state => state.product.loadingCategory);
    const categoryData = useSelector(state => state.product.allCategory);
    const subCategoryData = useSelector(state => state.product.allSubCategory);

    // Memoized subcategory filter function for performance
    const getSubcategoriesForCategory = useCallback((categoryId) => {
        return subCategoryData.filter(sub =>
            sub.category.some(cat => cat._id === categoryId)
        );
    }, [subCategoryData]);

    // Handle mouse events with debounce for better performance
    const handleMouseEnter = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsHovered(false);
        }, 150); // Small delay to prevent flickering
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsHovered(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Generate URL for navigation
    const generateProductUrl = useCallback((categoryId, categoryName, subCategory) => {
        return `/${valideURLConvert(categoryName)}-${categoryId}/${valideURLConvert(subCategory.name)}-${subCategory._id}`;
    }, []);

    return (
        <div 
            className="relative group" 
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Shop All Makeup Button */}
            <button
                className="p-2 text-white font-medium rounded-lg hover:text-pink-400 transition-all duration-300 focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isHovered}
            >
                <span className="flex items-center text-semibold text-lg">
                    Shop All Makeup
                    <svg 
                        className={`w-auto h-4 ml-1.5 transition-transform duration-300 transform ${isHovered ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </span>
            </button>

            {/* Dropdown Panel with Transition */}
            <div
                className={`
                    absolute left-0 top-full mt-1
                    w-full max-w-full
                    md:w-[1250px] md:max-w-[1250px]
                    md:translate-x-[-57.5%]
                    bg-white rounded-xl shadow-xl z-50 overflow-hidden
                    transform origin-top transition-all duration-200 ease-in-out
                    ${isHovered ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}
                `}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
            >
                <div className="bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 h-1.5"></div>
                <div className="p-4 md:p-8">
                    {loadingCategory ? (
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
                            {[...Array(12)].map((_, index) => (
                                <div key={index} className="animate-pulse font-bold">
                                    <div className="h-6 w-2/3 bg-gray-200 rounded mb-3" />
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-3 bg-gray-100 rounded w-1/2 mb-2 ml-2" />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-7 gap-6">
                            {categoryData.map((category) => {
                                const subcategories = getSubcategoriesForCategory(category._id);
                                return (
                                    <div key={category._id} className="break-inside-avoid">
                                        <div className="font-bold text-black pb-2 mb-3 text-base tracking-wide border-b border-pink-100 uppercase">
                                            {category.name}
                                        </div>
                                        <div className="space-y-0.5">
                                            {subcategories.map((subCat) => {
                                                const url = generateProductUrl(category._id, category.name, subCat);
                                                return (
                                                    <Link 
                                                        href={url} 
                                                        key={subCat._id}
                                                        prefetch={true}
                                                        className="block text-sm text-black font-semibold md:font-normal rounded-md hover:bg-pink-50 hover:text-pink-400 cursor-pointer p-1.5"
                                                        onClick={() => setIsHovered(false)}
                                                    >
                                                        {subCat.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dropdown;