// 'use client'

// import { Suspense, useEffect, useState, lazy, memo, useMemo } from 'react'
// import { Toaster } from 'react-hot-toast'
// import GlobalProvider from '../../providers/GlobalProvider'
// import Header from '../../components/Header'
// import Footer from '../../components/Footer'
// import { usePathname } from 'next/navigation'
// import useMobile from '../../hooks/useMobile'
// import { useDispatch } from 'react-redux'
// import { setUserDetails } from '../../store/userSlice'
// import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../../store/productSlice'
// import Axios from '../../utils/Axios'
// import SummaryApi from '../../common/SummaryApi'

// // Lazy loaded components
// const SideBar = lazy(() => import('../../components/SideBar'))
// const CartMobileLink = lazy(() => import('../../components/CartMobile'))
// const Modal = lazy(() => import('../../components/Modal'))
// const Login = lazy(() => import('../(auth)/login/page'))
// const SparklesCore = lazy(() => import('../../components/ui/sparkles').then(mod => ({ default: mod.SparklesCore })))

// // Memoized background component to prevent unnecessary re-renders
// const BackgroundEffect = memo(function BackgroundEffect() {
//   return (
//     <div
//       aria-hidden="true"
//       className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
//     >
//       <div className="absolute inset-0 w-full h-full">
//         <Suspense fallback={null}>
//           <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
//         </Suspense>
//       </div>
//       <div
//         className="
//           absolute inset-0
//           bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70
//           dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70
//           pointer-events-none
//           z-10
//         "
//         style={{
//           mixBlendMode: 'soft-light',
//           opacity: 0.85,
//         }}
//       />
//       <div
//         className="
//           absolute inset-0
//           pointer-events-none
//           z-20
//         "
//         style={{
//           background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
//           opacity: 0.5,
//         }}
//       />
//     </div>
//   )
// })

// // Memoized PathAwareShell to prevent unnecessary re-renders
// const PathAwareShell = memo(function PathAwareShell({ children }) {
//   const pathname = usePathname()
//   const [isMobile] = useMobile()
//   const showSidebar = !pathname?.includes('/dashboard') && !isMobile
//   const isCheckout = pathname === '/checkout'

//   return (
//     <>
//       <main className="min-h-[78vh] bg-[#faf6f3] relative">
//         <div className="container mx-auto py-1">
//           <div className="flex flex-col md:flex-row gap-4">
//             {showSidebar && !isCheckout && (
//               <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
//                 <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
//                   <SideBar />
//                 </Suspense>
//               </div>
//             )}
//             <div className={`w-full ${showSidebar && !isCheckout ? 'md:w-3/4 lg:w-4/5' : 'w-full'} bg-white/80 rounded-xl shadow p-3`}>
//               {children}
//             </div>
//           </div>
//         </div>
//       </main>
//       {pathname !== '/checkout' && (
//         <Suspense fallback={null}>
//           <CartMobileLink />
//         </Suspense>
//       )}
//     </>
//   )
// })

// function ShellWithRedux({ children }) {
//   const dispatch = useDispatch()
//   const [showLoginModal, setShowLoginModal] = useState(false)
//   const pathname = usePathname()
//   const isCheckout = pathname === '/checkout'

//   // Fetch user data immediately, but defer category data loading
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await import('../../utils/fetchUserDetails').then(mod => mod.default())
//         if (userData && userData.data) {
//           dispatch(setUserDetails(userData.data))
//         } else {
//           dispatch(setUserDetails(null))
//         }
//       } catch {
//         dispatch(setUserDetails(null))
//       }
//     }
    
//     fetchUser()
    
//     // Setup login modal event listener
//     const handler = () => setShowLoginModal(true)
//     window.addEventListener('show-login', handler)
//     return () => window.removeEventListener('show-login', handler)
//   }, [])

//   // Load category data with a slight delay to prioritize UI rendering
//   useEffect(() => {
//     if (isCheckout) return; // Skip category loading on checkout page
    
//     const timer = setTimeout(() => {
//       const fetchCategoryData = async () => {
//         try {
//           dispatch(setLoadingCategory(true))
          
//           // Fetch categories and subcategories in parallel
//           const [categoryResponse, subCategoryResponse] = await Promise.all([
//             Axios({ ...SummaryApi.getCategory }),
//             Axios({ ...SummaryApi.getSubCategory })
//           ]);
          
//           if (categoryResponse.data.success) {
//             dispatch(
//               setAllCategory(
//                 categoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
//               )
//             )
//           }
          
//           if (subCategoryResponse.data.success) {
//             dispatch(
//               setAllSubCategory(
//                 subCategoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
//               )
//             )
//           }
//         } catch (error) {
//           console.error('Category data fetch failed:', error)
//         } finally {
//           dispatch(setLoadingCategory(false))
//         }
//       }
      
//       fetchCategoryData()
//     }, 200); // Small delay to prioritize UI rendering
    
//     return () => clearTimeout(timer);
//   }, [isCheckout]);

//   // Skip rendering background effects on checkout page
//   const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout]);

//   return (
//     <GlobalProvider>
//       {shouldRenderBackground && <BackgroundEffect />}
      
//       <Header />
//       <Suspense fallback={<div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
//         <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
//       </div>}>
//         <PathAwareShell>{children}</PathAwareShell>
//       </Suspense>
      
//       {showLoginModal && (
//         <Suspense fallback={null}>
//           <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//             <Login onSuccess={() => setShowLoginModal(false)} />
//           </Modal>
//         </Suspense>
//       )}
      
//       <Footer />
//       <Toaster />
//     </GlobalProvider>
//   )
// }

// export default ShellWithRedux



// // src/app/partials/ShellWithRedux.js
// 'use client'

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   lazy,
//   memo,
// } from 'react'
// import { Toaster } from 'react-hot-toast'
// import GlobalProvider from '../../providers/GlobalProvider'
// import Header from '../../components/Header'
// import Footer from '../../components/Footer'
// import { usePathname } from 'next/navigation'
// import useMobile from '../../hooks/useMobile'
// import { useDispatch } from 'react-redux'
// import { setUserDetails } from '../../store/userSlice'
// import {
//   setAllCategory,
//   setAllSubCategory,
//   setLoadingCategory,
// } from '../../store/productSlice'
// import Axios from '../../utils/Axios'
// import SummaryApi from '../../common/SummaryApi'

// const SideBar = lazy(() => import('../../components/SideBar'))
// const CartMobileLink = lazy(() => import('../../components/CartMobile'))
// const Modal = lazy(() => import('../../components/Modal'))
// const Login = lazy(() =>
//   import('../(auth)/login/page').then((mod) => ({ default: mod.default || mod }))
// )
// const SparklesCore = lazy(() =>
//   import('../../components/ui/sparkles').then((mod) => ({ default: mod.SparklesCore }))
// )

// const sortAlphabetically = (list = []) =>
//   [...list].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))

// const extractPayloadArray = (response) => {
//   if (!response) return []
//   const { data } = response
//   if (Array.isArray(data)) return data
//   if (Array.isArray(data?.data)) return data.data
//   if (Array.isArray(data?.docs)) return data.docs
//   if (Array.isArray(data?.rows)) return data.rows
//   if (Array.isArray(data?.result)) return data.result
//   return []
// }

// const BackgroundEffect = memo(function BackgroundEffect() {
//   return (
//     <div
//       aria-hidden="true"
//       className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
//     >
//       <div className="absolute inset-0 w-full h-full">
//         <Suspense fallback={null}>
//           <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
//         </Suspense>
//       </div>
//       <div
//         className="
//           absolute inset-0
//           bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70
//           dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70
//           pointer-events-none
//           z-10
//         "
//         style={{
//           mixBlendMode: 'soft-light',
//           opacity: 0.85,
//         }}
//       />
//       <div
//         className="
//           absolute inset-0
//           pointer-events-none
//           z-20
//         "
//         style={{
//           background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
//           opacity: 0.5,
//         }}
//       />
//     </div>
//   )
// })

// const PathAwareShell = memo(function PathAwareShell({ children, initialNavData }) {
//   const pathname = usePathname()
//   const [isMobile] = useMobile()
//   const showSidebar = !pathname?.includes('/dashboard') && !isMobile
//   const isCheckout = pathname === '/checkout'

//   const initialCategories = useMemo(
//     () => (Array.isArray(initialNavData?.categories) ? initialNavData.categories : []),
//     [initialNavData]
//   )
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories) ? initialNavData.subCategories : [],
//     [initialNavData]
//   )
//   const loadingOverride = initialCategories.length ? false : undefined

//   return (
//     <>
//       <main className="min-h-[78vh] bg-[#faf6f3] relative">
//         <div className="container mx-auto py-1">
//           <div className="flex flex-col md:flex-row gap-4">
//             {showSidebar && !isCheckout && (
//               <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
//                 <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
//                   <SideBar
//                     categoryData={initialCategories}
//                     subCategoryData={initialSubCategories}
//                     loadingCategory={loadingOverride}
//                   />
//                 </Suspense>
//               </div>
//             )}
//             <div
//               className={`w-full ${
//                 showSidebar && !isCheckout ? 'md:w-3/4 lg:w-4/5' : 'w-full'
//               } bg-white/80 rounded-xl shadow p-3`}
//             >
//               {children}
//             </div>
//           </div>
//         </div>
//       </main>
//       {pathname !== '/checkout' && (
//         <Suspense fallback={null}>
//           <CartMobileLink />
//         </Suspense>
//       )}
//     </>
//   )
// })

// function ShellWithRedux({ children, initialNavData }) {
//   const dispatch = useDispatch()
//   const [showLoginModal, setShowLoginModal] = useState(false)
//   const pathname = usePathname()
//   const isCheckout = pathname === '/checkout'
//   const navHydratedRef = useRef(false)
//   const navFetchAbortRef = useRef(null)

//   const initialCategories = useMemo(
//     () => (Array.isArray(initialNavData?.categories) ? initialNavData.categories : []),
//     [initialNavData]
//   )
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories) ? initialNavData.subCategories : [],
//     [initialNavData]
//   )
//   const initialGeneratedAt = useMemo(() => {
//     if (!initialNavData?.generatedAt) return 0
//     const ts = new Date(initialNavData.generatedAt).getTime()
//     return Number.isFinite(ts) ? ts : 0
//   }, [initialNavData])

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await import('../../utils/fetchUserDetails').then((mod) =>
//           mod.default()
//         )
//         if (userData && userData.data) {
//           dispatch(setUserDetails(userData.data))
//         } else {
//           dispatch(setUserDetails(null))
//         }
//       } catch {
//         dispatch(setUserDetails(null))
//       }
//     }

//     fetchUser()

//     const handler = () => setShowLoginModal(true)
//     window.addEventListener('show-login', handler)
//     return () => window.removeEventListener('show-login', handler)
//   }, [dispatch])

//   useEffect(() => {
//     if (navHydratedRef.current) return
//     if (!initialCategories.length && !initialSubCategories.length) return

//     dispatch(setAllCategory(sortAlphabetically(initialCategories)))
//     dispatch(setAllSubCategory(sortAlphabetically(initialSubCategories)))
//     dispatch(setLoadingCategory(false))
//     navHydratedRef.current = true
//   }, [dispatch, initialCategories, initialSubCategories])

//   const fetchCategoryData = useCallback(
//     async ({ background = false } = {}) => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort()
//       }

//       const controller = new AbortController()
//       navFetchAbortRef.current = controller

//       try {
//         if (!background) {
//           dispatch(setLoadingCategory(true))
//         }

//         const [categoryResponse, subCategoryResponse] = await Promise.all([
//           Axios({ ...SummaryApi.getCategory, signal: controller.signal }),
//           Axios({ ...SummaryApi.getSubCategory, signal: controller.signal }),
//         ])

//         const categories = extractPayloadArray(categoryResponse)
//         const subCategories = extractPayloadArray(subCategoryResponse)

//         if (categories.length) {
//           dispatch(setAllCategory(sortAlphabetically(categories)))
//         }

//         if (subCategories.length) {
//           dispatch(setAllSubCategory(sortAlphabetically(subCategories)))
//         }

//         if (categories.length || subCategories.length) {
//           navHydratedRef.current = true
//         }
//       } catch (error) {
//         if (error?.name !== 'AbortError') {
//           console.error('Category data fetch failed:', error)
//         }
//       } finally {
//         if (!background) {
//           dispatch(setLoadingCategory(false))
//         }
//       }
//     },
//     [dispatch]
//   )

//   useEffect(() => {
//     if (isCheckout) return undefined

//     const now = Date.now()
//     const hasFreshSnapshot =
//       initialGeneratedAt && now - initialGeneratedAt < 4 * 60 * 1000

//     if (hasFreshSnapshot) {
//       const refreshIn = Math.max(60_000, 4 * 60 * 1000 - (now - initialGeneratedAt))
//       const refreshTimer = window.setTimeout(() => {
//         fetchCategoryData({ background: true })
//       }, refreshIn)

//       return () => window.clearTimeout(refreshTimer)
//     }

//     const delay = navHydratedRef.current ? 800 : 200
//     const timer = window.setTimeout(() => {
//       fetchCategoryData({ background: navHydratedRef.current })
//     }, delay)

//     return () => window.clearTimeout(timer)
//   }, [fetchCategoryData, initialGeneratedAt, isCheckout])

//   useEffect(() => {
//     return () => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort()
//       }
//     }
//   }, [])

//   const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout])

//   return (
//     <GlobalProvider>
//       {shouldRenderBackground && <BackgroundEffect />}

//       <Header />

//       <Suspense
//         fallback={
//           <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
//             <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
//           </div>
//         }
//       >
//         <PathAwareShell initialNavData={initialNavData}>{children}</PathAwareShell>
//       </Suspense>

//       {showLoginModal && (
//         <Suspense fallback={null}>
//           <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//             <Login onSuccess={() => setShowLoginModal(false)} />
//           </Modal>
//         </Suspense>
//       )}

//       <Footer />
//       <Toaster />
//     </GlobalProvider>
//   )
// }

// export default ShellWithRedux





// src/app/partials/ShellWithRedux.jsx
// 'use client'

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   lazy,
//   memo,
// } from 'react'
// import { Toaster } from 'react-hot-toast'
// import GlobalProvider from '../../providers/GlobalProvider'
// import Header from '../../components/Header'
// import Footer from '../../components/Footer'
// import { usePathname } from 'next/navigation'
// import useMobile from '../../hooks/useMobile'
// import { useDispatch } from 'react-redux'
// import { setUserDetails } from '../../store/userSlice'
// import {
//   setAllBrands,
//   setAllCategory,
//   setAllSubCategory,
//   setLoadingBrands,
//   setLoadingCategory,
// } from '../../store/productSlice'
// import Axios from '../../utils/Axios'
// import SummaryApi from '../../common/SummaryApi'

// const SideBar = lazy(() => import('../../components/SideBar'))
// const CartMobileLink = lazy(() => import('../../components/CartMobile'))
// const Modal = lazy(() => import('../../components/Modal'))
// const Login = lazy(() =>
//   import('../(auth)/login/page').then((mod) => ({ default: mod.default || mod }))
// )
// const SparklesCore = lazy(() =>
//   import('../../components/ui/sparkles').then((mod) => ({ default: mod.SparklesCore }))
// )

// const NAV_REFRESH_INTERVAL = 4 * 60 * 1000 // 4 minutes

// const sortAlphabetically = (list = []) =>
//   [...list].sort((a, b) => (a?.name || '').localeCompare(b?.name || ''))

// const extractPayloadArray = (response) => {
//   if (!response) return []
//   const { data } = response
//   if (Array.isArray(data)) return data
//   if (Array.isArray(data?.data)) return data.data
//   if (Array.isArray(data?.docs)) return data.docs
//   if (Array.isArray(data?.rows)) return data.rows
//   if (Array.isArray(data?.result)) return data.result
//   if (Array.isArray(response?.items)) return response.items
//   return []
// }

// const BackgroundEffect = memo(function BackgroundEffect() {
//   return (
//     <div
//       aria-hidden="true"
//       className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
//     >
//       <div className="absolute inset-0 w-full h-full">
//         <Suspense fallback={null}>
//           <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
//         </Suspense>
//       </div>
//       <div
//         className="
//           absolute inset-0
//           bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70
//           dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70
//           pointer-events-none
//           z-10
//         "
//         style={{
//           mixBlendMode: 'soft-light',
//           opacity: 0.85,
//         }}
//       />
//       <div
//         className="
//           absolute inset-0
//           pointer-events-none
//           z-20
//         "
//         style={{
//           background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
//           opacity: 0.5,
//         }}
//       />
//     </div>
//   )
// })

// const PathAwareShell = memo(function PathAwareShell({ children, initialNavData }) {
//   const pathname = usePathname()
//   const [isMobile] = useMobile()
//   const showSidebar = !pathname?.includes('/dashboard') && !isMobile
//   const isCheckout = pathname === '/checkout'

//   const initialCategories = useMemo(
//     () => (Array.isArray(initialNavData?.categories) ? initialNavData.categories : []),
//     [initialNavData]
//   )
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories) ? initialNavData.subCategories : [],
//     [initialNavData]
//   )
//   const initialBrands = useMemo(
//     () => (Array.isArray(initialNavData?.brands) ? initialNavData.brands : []),
//     [initialNavData]
//   )

//   const loadingCategoryOverride = initialCategories.length ? false : undefined
//   const loadingBrandOverride = initialBrands.length ? false : undefined

//   return (
//     <>
//       <main className="min-h-[78vh] bg-[#faf6f3] relative">
//         <div className="container mx-auto py-1">
//           <div className="flex flex-col md:flex-row gap-4">
//             {showSidebar && !isCheckout && (
//               <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
//                 <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
//                   <SideBar
//                     categoryData={initialCategories}
//                     subCategoryData={initialSubCategories}
//                     brandData={initialBrands}
//                     loadingCategory={loadingCategoryOverride}
//                     loadingBrand={loadingBrandOverride}
//                   />
//                 </Suspense>
//               </div>
//             )}
//             <div
//               className={`w-full ${
//                 showSidebar && !isCheckout ? 'md:w-3/4 lg:w-4/5' : 'w-full'
//               } bg-white/80 rounded-xl shadow p-3`}
//             >
//               {children}
//             </div>
//           </div>
//         </div>
//       </main>
//       {pathname !== '/checkout' && (
//         <Suspense fallback={null}>
//           <CartMobileLink />
//         </Suspense>
//       )}
//     </>
//   )
// })

// function ShellWithRedux({ children, initialNavData }) {
//   const dispatch = useDispatch()
//   const [showLoginModal, setShowLoginModal] = useState(false)
//   const pathname = usePathname()
//   const isCheckout = pathname === '/checkout'
//   const navHydratedRef = useRef(false)
//   const brandHydratedRef = useRef(false)
//   const navFetchAbortRef = useRef(null)
//   const refreshTimeoutIdRef = useRef(null)
//   const backgroundRefreshDoneRef = useRef(false)

//   const initialCategories = useMemo(
//     () => (Array.isArray(initialNavData?.categories) ? initialNavData.categories : []),
//     [initialNavData]
//   )
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories) ? initialNavData.subCategories : [],
//     [initialNavData]
//   )
//   const initialBrands = useMemo(
//     () => (Array.isArray(initialNavData?.brands) ? initialNavData.brands : []),
//     [initialNavData]
//   )
//   const initialGeneratedAt = useMemo(() => {
//     if (!initialNavData?.generatedAt) return 0
//     const ts = new Date(initialNavData.generatedAt).getTime()
//     return Number.isFinite(ts) ? ts : 0
//   }, [initialNavData])

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await import('../../utils/fetchUserDetails').then((mod) =>
//           mod.default()
//         )
//         if (userData && userData.data) {
//           dispatch(setUserDetails(userData.data))
//         } else {
//           dispatch(setUserDetails(null))
//         }
//       } catch {
//         dispatch(setUserDetails(null))
//       }
//     }

//     fetchUser()

//     const handler = () => setShowLoginModal(true)
//     window.addEventListener('show-login', handler)
//     return () => window.removeEventListener('show-login', handler)
//   }, [dispatch])

//   useEffect(() => {
//     if (navHydratedRef.current) return
//     if (!initialCategories.length && !initialSubCategories.length) return

//     dispatch(setAllCategory(sortAlphabetically(initialCategories)))
//     dispatch(setAllSubCategory(sortAlphabetically(initialSubCategories)))
//     dispatch(setLoadingCategory(false))
//     navHydratedRef.current = true
//   }, [dispatch, initialCategories, initialSubCategories])

//   useEffect(() => {
//     if (brandHydratedRef.current) return
//     if (!initialBrands.length) return

//     dispatch(setAllBrands(sortAlphabetically(initialBrands)))
//     dispatch(setLoadingBrands(false))
//     brandHydratedRef.current = true
//   }, [dispatch, initialBrands])

//   const fetchNavData = useCallback(
//     async ({ background = false } = {}) => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort()
//       }

//       const controller = new AbortController()
//       navFetchAbortRef.current = controller

//       try {
//         if (!background) {
//           dispatch(setLoadingCategory(true))
//           dispatch(setLoadingBrands(true))
//         }

//         const [categoryResponse, subCategoryResponse, brandResponse] = await Promise.all([
//           Axios({ ...SummaryApi.getCategory, signal: controller.signal }),
//           Axios({ ...SummaryApi.getSubCategory, signal: controller.signal }),
//           Axios({ ...SummaryApi.getBrands, signal: controller.signal }),
//         ])

//         const categories = extractPayloadArray(categoryResponse)
//         const subCategories = extractPayloadArray(subCategoryResponse)
//         const brands = extractPayloadArray(brandResponse)

//         if (categories.length) {
//           dispatch(setAllCategory(sortAlphabetically(categories)))
//           navHydratedRef.current = true
//         }

//         if (subCategories.length) {
//           dispatch(setAllSubCategory(sortAlphabetically(subCategories)))
//           navHydratedRef.current = true
//         }

//         if (brands.length) {
//           dispatch(setAllBrands(sortAlphabetically(brands)))
//           brandHydratedRef.current = true
//         }
//       } catch (error) {
//         if (error?.name !== 'AbortError') {
//           console.error('Navigation data fetch failed:', error)
//         }
//       } finally {
//         if (!background) {
//           dispatch(setLoadingCategory(false))
//           dispatch(setLoadingBrands(false))
//         }
//         navFetchAbortRef.current = null
//       }
//     },
//     [dispatch]
//   )

//   useEffect(() => {
//     if (isCheckout) return undefined

//     const now = Date.now()
//     const snapshotAge = initialGeneratedAt ? now - initialGeneratedAt : Number.POSITIVE_INFINITY
//     const isSnapshotFresh = snapshotAge < NAV_REFRESH_INTERVAL

//     if (!navHydratedRef.current || !brandHydratedRef.current || !isSnapshotFresh) {
//       fetchNavData({ background: navHydratedRef.current && brandHydratedRef.current })
//     }

//     if (backgroundRefreshDoneRef.current || refreshTimeoutIdRef.current) {
//       return undefined
//     }

//     const refreshDelay = isSnapshotFresh
//       ? Math.max(60_000, NAV_REFRESH_INTERVAL - snapshotAge)
//       : 60_000

//     const timeoutId = window.setTimeout(() => {
//       refreshTimeoutIdRef.current = null
//       backgroundRefreshDoneRef.current = true
//       fetchNavData({ background: true })
//     }, refreshDelay)

//     refreshTimeoutIdRef.current = timeoutId

//     return () => {
//       if (refreshTimeoutIdRef.current === timeoutId) {
//         window.clearTimeout(timeoutId)
//         refreshTimeoutIdRef.current = null
//       }
//     }
//   }, [fetchNavData, initialGeneratedAt, isCheckout])

//   useEffect(() => {
//     return () => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort()
//       }
//       if (refreshTimeoutIdRef.current) {
//         window.clearTimeout(refreshTimeoutIdRef.current)
//         refreshTimeoutIdRef.current = null
//       }
//     }
//   }, [])

//   const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout])

//   return (
//     <GlobalProvider>
//       {shouldRenderBackground && <BackgroundEffect />}

//       <Header />

//       <Suspense
//         fallback={
//           <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
//             <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
//           </div>
//         }
//       >
//         <PathAwareShell initialNavData={initialNavData}>{children}</PathAwareShell>
//       </Suspense>

//       {showLoginModal && (
//         <Suspense fallback={null}>
//           <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//             <Login onSuccess={() => setShowLoginModal(false)} />
//           </Modal>
//         </Suspense>
//       )}

//       <Footer />
//       <Toaster />
//     </GlobalProvider>
//   )
// }

// export default ShellWithRedux






// src/app/partials/ShellWithRedux.jsx
// "use client";

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   lazy,
//   memo,
// } from "react";
// import { Toaster } from "react-hot-toast";
// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import { usePathname } from "next/navigation";
// import useMobile from "../../hooks/useMobile";
// import { useDispatch } from "react-redux";
// import { setUserDetails } from "../../store/userSlice";
// import {
//   setAllBrands,
//   setAllCategory,
//   setAllSubCategory,
//   setLoadingBrands,
//   setLoadingCategory,
// } from "../../store/productSlice";
// import Axios from "../../utils/Axios";
// import SummaryApi from "../../common/SummaryApi";

// const SideBar = lazy(() => import("../../components/SideBar"));
// const CartMobileLink = lazy(() => import("../../components/CartMobile"));
// const Modal = lazy(() => import("../../components/Modal"));
// const Login = lazy(() =>
//   import("../(auth)/login/page").then((mod) => ({ default: mod.default || mod }))
// );
// const SparklesCore = lazy(() =>
//   import("../../components/ui/sparkles").then((mod) => ({
//     default: mod.SparklesCore,
//   }))
// );

// const NAV_REFRESH_INTERVAL = 4 * 60 * 1000;

// const sortAlphabetically = (list = []) =>
//   [...list].sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));

// const extractPayloadArray = (response) => {
//   if (!response) return [];
//   const { data } = response;
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.docs)) return data.docs;
//   if (Array.isArray(data?.rows)) return data.rows;
//   if (Array.isArray(data?.result)) return data.result;
//   if (Array.isArray(response?.items)) return response.items;
//   return [];
// };

// const BackgroundEffect = memo(function BackgroundEffect() {
//   return (
//     <div
//       aria-hidden="true"
//       className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
//     >
//       <div className="absolute inset-0 w-full h-full">
//         <Suspense fallback={null}>
//           <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
//         </Suspense>
//       </div>
//       <div
//         className="absolute inset-0 bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70 dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70 pointer-events-none z-10"
//         style={{ mixBlendMode: "soft-light", opacity: 0.85 }}
//       />
//       <div
//         className="absolute inset-0 pointer-events-none z-20"
//         style={{
//           background:
//             "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)",
//           opacity: 0.5,
//         }}
//       />
//     </div>
//   );
// });

// const PathAwareShell = memo(function PathAwareShell({
//   children,
//   initialNavData,
// }) {
//   const pathname = usePathname();
//   const [isMobile] = useMobile();
//   const showSidebar = !pathname?.includes("/dashboard") && !isMobile;
//   const isCheckout = pathname === "/checkout";

//   const initialCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.categories) ? initialNavData.categories : [],
//     [initialNavData]
//   );
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories)
//         ? initialNavData.subCategories
//         : [],
//     [initialNavData]
//   );
//   const initialBrands = useMemo(
//     () =>
//       Array.isArray(initialNavData?.brands) ? initialNavData.brands : [],
//     [initialNavData]
//   );

//   const loadingCategoryOverride = initialCategories.length ? false : undefined;
//   const loadingBrandOverride = initialBrands.length ? false : undefined;

//   return (
//     <>
//       <main className="min-h-[78vh] bg-[#faf6f3] relative">
//         <div className="container mx-auto py-1">
//           <div className="flex flex-col md:flex-row gap-4">
//             {showSidebar && !isCheckout && (
//               <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
//                 <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
//                   <SideBar
//                     categoryData={initialCategories}
//                     subCategoryData={initialSubCategories}
//                     brandData={initialBrands}
//                     loadingCategory={loadingCategoryOverride}
//                     loadingBrand={loadingBrandOverride}
//                   />
//                 </Suspense>
//               </div>
//             )}
//             <div
//               className={`w-full ${
//                 showSidebar && !isCheckout ? "md:w-3/4 lg:w-4/5" : "w-full"
//               } bg-white/80 rounded-xl shadow p-3`}
//             >
//               {children}
//             </div>
//           </div>
//         </div>
//       </main>
//       {pathname !== "/checkout" && (
//         <Suspense fallback={null}>
//           <CartMobileLink />
//         </Suspense>
//       )}
//     </>
//   );
// });

// function ShellWithRedux({ children, initialNavData }) {
//   const dispatch = useDispatch();
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const pathname = usePathname();
//   const isCheckout = pathname === "/checkout";
//   const navHydratedRef = useRef(false);
//   const brandHydratedRef = useRef(false);
//   const navFetchAbortRef = useRef(null);
//   const refreshTimeoutIdRef = useRef(null);
//   const backgroundRefreshDoneRef = useRef(false);

//   const initialCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.categories) ? initialNavData.categories : [],
//     [initialNavData]
//   );
//   const initialSubCategories = useMemo(
//     () =>
//       Array.isArray(initialNavData?.subCategories)
//         ? initialNavData.subCategories
//         : [],
//     [initialNavData]
//   );
//   const initialBrands = useMemo(
//     () =>
//       Array.isArray(initialNavData?.brands) ? initialNavData.brands : [],
//     [initialNavData]
//   );
//   const initialGeneratedAt = useMemo(() => {
//     if (!initialNavData?.generatedAt) return 0;
//     const ts = new Date(initialNavData.generatedAt).getTime();
//     return Number.isFinite(ts) ? ts : 0;
//   }, [initialNavData]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userData = await import("../../utils/fetchUserDetails").then(
//           (mod) => mod.default()
//         );
//         if (userData && userData.data) {
//           dispatch(setUserDetails(userData.data));
//         } else {
//           dispatch(setUserDetails(null));
//         }
//       } catch {
//         dispatch(setUserDetails(null));
//       }
//     };

//     fetchUser();

//     const handler = () => setShowLoginModal(true);
//     window.addEventListener("show-login", handler);
//     return () => window.removeEventListener("show-login", handler);
//   }, [dispatch]);

//   useEffect(() => {
//     if (navHydratedRef.current) return;
//     if (!initialCategories.length && !initialSubCategories.length) return;

//     dispatch(setAllCategory(sortAlphabetically(initialCategories)));
//     dispatch(setAllSubCategory(sortAlphabetically(initialSubCategories)));
//     dispatch(setLoadingCategory(false));
//     navHydratedRef.current = true;
//   }, [dispatch, initialCategories, initialSubCategories]);

//   useEffect(() => {
//     if (brandHydratedRef.current) return;
//     if (!initialBrands.length) return;

//     dispatch(setAllBrands(sortAlphabetically(initialBrands)));
//     dispatch(setLoadingBrands(false));
//     brandHydratedRef.current = true;
//   }, [dispatch, initialBrands]);

//   const fetchNavData = useCallback(
//     async ({ background = false } = {}) => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort();
//       }

//       const controller = new AbortController();
//       navFetchAbortRef.current = controller;

//       try {
//         if (!background) {
//           dispatch(setLoadingCategory(true));
//           dispatch(setLoadingBrands(true));
//         }

//         const [categoryResponse, subCategoryResponse, brandResponse] =
//           await Promise.all([
//             Axios({ ...SummaryApi.getCategory, signal: controller.signal }),
//             Axios({ ...SummaryApi.getSubCategory, signal: controller.signal }),
//             Axios({ ...SummaryApi.getBrands, signal: controller.signal }),
//           ]);

//         const categories = extractPayloadArray(categoryResponse);
//         const subCategories = extractPayloadArray(subCategoryResponse);
//         const brands = extractPayloadArray(brandResponse);

//         if (categories.length) {
//           dispatch(setAllCategory(sortAlphabetically(categories)));
//           navHydratedRef.current = true;
//         }

//         if (subCategories.length) {
//           dispatch(setAllSubCategory(sortAlphabetically(subCategories)));
//           navHydratedRef.current = true;
//         }

//         if (brands.length) {
//           dispatch(setAllBrands(sortAlphabetically(brands)));
//           brandHydratedRef.current = true;
//         }
//       } catch (error) {
//         if (error?.name !== "AbortError") {
//           console.error("Navigation data fetch failed:", error);
//         }
//       } finally {
//         if (!background) {
//           dispatch(setLoadingCategory(false));
//           dispatch(setLoadingBrands(false));
//         }
//         navFetchAbortRef.current = null;
//       }
//     },
//     [dispatch]
//   );

//   useEffect(() => {
//     if (isCheckout) return undefined;

//     const now = Date.now();
//     const snapshotAge = initialGeneratedAt
//       ? now - initialGeneratedAt
//       : Number.POSITIVE_INFINITY;
//     const isSnapshotFresh = snapshotAge < NAV_REFRESH_INTERVAL;

//     if (
//       !navHydratedRef.current ||
//       !brandHydratedRef.current ||
//       !isSnapshotFresh
//     ) {
//       fetchNavData({ background: navHydratedRef.current && brandHydratedRef.current });
//     }

//     if (backgroundRefreshDoneRef.current || refreshTimeoutIdRef.current) {
//       return undefined;
//     }

//     const refreshDelay = isSnapshotFresh
//       ? Math.max(60_000, NAV_REFRESH_INTERVAL - snapshotAge)
//       : 60_000;

//     const timeoutId = window.setTimeout(() => {
//       refreshTimeoutIdRef.current = null;
//       backgroundRefreshDoneRef.current = true;
//       fetchNavData({ background: true });
//     }, refreshDelay);

//     refreshTimeoutIdRef.current = timeoutId;

//     return () => {
//       if (refreshTimeoutIdRef.current === timeoutId) {
//         window.clearTimeout(timeoutId);
//         refreshTimeoutIdRef.current = null;
//       }
//     };
//   }, [fetchNavData, initialGeneratedAt, isCheckout]);

//   useEffect(() => {
//     return () => {
//       if (navFetchAbortRef.current) {
//         navFetchAbortRef.current.abort();
//       }
//       if (refreshTimeoutIdRef.current) {
//         window.clearTimeout(refreshTimeoutIdRef.current);
//         refreshTimeoutIdRef.current = null;
//       }
//     };
//   }, []);

//   const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout]);

//   return (
//     <>
//       {shouldRenderBackground && <BackgroundEffect />}

//       <Header />

//       <Suspense
//         fallback={
//           <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
//             <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
//           </div>
//         }
//       >
//         <PathAwareShell initialNavData={initialNavData}>{children}</PathAwareShell>
//       </Suspense>

//       {showLoginModal && (
//         <Suspense fallback={null}>
//           <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//             <Login onSuccess={() => setShowLoginModal(false)} />
//           </Modal>
//         </Suspense>
//       )}

//       <Footer />
//       <Toaster />
//     </>
//   );
// }

// export default ShellWithRedux;




// // client/src/app/partials/ShellWithRedux.jsx
// "use client";

// import {
//   Suspense,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
//   lazy,
//   memo,
// } from "react";
// import { Toaster } from "react-hot-toast";
// import { usePathname } from "next/navigation";

// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
// import useMobile from "../../hooks/useMobile";
// import {
//   useBrandsQuery,
//   useCategoriesQuery,
//   useSubCategoriesQuery,
// } from "@/hooks/queries/useCatalogQueries";
// import { useUserProfileQuery } from "@/hooks/queries/useUserProfileQuery";

// const SideBar = lazy(() => import("../../components/SideBar"));
// const CartMobileLink = lazy(() => import("../../components/CartMobile"));
// const Modal = lazy(() => import("../../components/Modal"));
// const Login = lazy(() =>
//   import("../(auth)/login/page").then((mod) => ({ default: mod.default || mod }))
// );
// const SparklesCore = lazy(() =>
//   import("../../components/ui/sparkles").then((mod) => ({
//     default: mod.SparklesCore,
//   }))
// );

// const BackgroundEffect = memo(function BackgroundEffect() {
//   return (
//     <div
//       aria-hidden="true"
//       className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
//     >
//       <div className="absolute inset-0 w-full h-full">
//         <Suspense fallback={null}>
//           <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
//         </Suspense>
//       </div>
//       <div
//         className="absolute inset-0 bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70 dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70 pointer-events-none z-10"
//         style={{ mixBlendMode: "soft-light", opacity: 0.85 }}
//       />
//       <div
//         className="absolute inset-0 pointer-events-none z-20"
//         style={{
//           background:
//             "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)",
//           opacity: 0.5,
//         }}
//       />
//     </div>
//   );
// });

// const PathAwareShell = memo(function PathAwareShell({
//   children,
//   navData,
//   loadingStates,
// }) {
//   const pathname = usePathname();
//   const [isMobile] = useMobile();
//   const showSidebar = !pathname?.includes("/dashboard") && !isMobile;
//   const isCheckout = pathname === "/checkout";

//   const categories = navData?.categories ?? [];
//   const subCategories = navData?.subCategories ?? [];
//   const brands = navData?.brands ?? [];

//   const loadingCategoryOverride = loadingStates?.categories ?? false;
//   const loadingBrandOverride = loadingStates?.brands ?? false;

//   return (
//     <>
//       <main className="min-h-[78vh] bg-[#faf6f3] relative">
//         <div className="container mx-auto py-1">
//           <div className="flex flex-col md:flex-row gap-4">
//             {showSidebar && !isCheckout && (
//               <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm">
//                 <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
//                   <SideBar
//                     categoryData={categories}
//                     subCategoryData={subCategories}
//                     brandData={brands}
//                     loadingCategory={loadingCategoryOverride}
//                     loadingBrand={loadingBrandOverride}
//                   />
//                 </Suspense>
//               </div>
//             )}
//             <div
//               className={`w-full ${
//                 showSidebar && !isCheckout ? "md:w-3/4 lg:w-4/5" : "w-full"
//               } bg-white/80 rounded-xl shadow p-3`}
//             >
//               {children}
//             </div>
//           </div>
//         </div>
//       </main>
//       {pathname !== "/checkout" && (
//         <Suspense fallback={null}>
//           <CartMobileLink />
//         </Suspense>
//       )}
//     </>
//   );
// });

// function ShellWithRedux({ children, initialNavData }) {
//   const pathname = usePathname();
//   const isCheckout = pathname === "/checkout";
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const categoriesQuery = useCategoriesQuery({
//     enabled: typeof window !== "undefined",
//     initialData: initialNavData?.categories ?? [],
//   });

//   const subCategoriesQuery = useSubCategoriesQuery({
//     enabled: typeof window !== "undefined",
//     initialData: initialNavData?.subCategories ?? [],
//   });

//   const brandsQuery = useBrandsQuery({
//     enabled: typeof window !== "undefined",
//   });

//   useUserProfileQuery({
//     enabled: typeof window !== "undefined",
//   });

//   useEffect(() => {
//     const handler = () => setShowLoginModal(true);
//     window.addEventListener("show-login", handler);
//     return () => window.removeEventListener("show-login", handler);
//   }, []);

//   const navData = useMemo(
//     () => ({
//       categories: categoriesQuery.data ?? initialNavData?.categories ?? [],
//       subCategories:
//         subCategoriesQuery.data ?? initialNavData?.subCategories ?? [],
//       brands: brandsQuery.data ?? [],
//     }),
//     [
//       brandsQuery.data,
//       categoriesQuery.data,
//       initialNavData?.categories,
//       initialNavData?.subCategories,
//       subCategoriesQuery.data,
//     ]
//   );

//   const loadingStates = useMemo(
//     () => ({
//       categories: categoriesQuery.isFetching || subCategoriesQuery.isFetching,
//       brands: brandsQuery.isFetching,
//     }),
//     [brandsQuery.isFetching, categoriesQuery.isFetching, subCategoriesQuery.isFetching]
//   );

//   const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout]);

//   return (
//     <>
//       {shouldRenderBackground && <BackgroundEffect />}

//       <Header />

//       <Suspense
//         fallback={
//           <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
//             <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
//           </div>
//         }
//       >
//         <PathAwareShell navData={navData} loadingStates={loadingStates}>
//           {children}
//         </PathAwareShell>
//       </Suspense>

//       {showLoginModal && (
//         <Suspense fallback={null}>
//           <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//             <Login onSuccess={() => setShowLoginModal(false)} />
//           </Modal>
//         </Suspense>
//       )}

//       <Footer />
//       <Toaster />
//     </>
//   );
// }

// export default ShellWithRedux;


// client/src/app/partials/ShellWithRedux.jsx
"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  lazy,
  memo,
} from "react";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import useMobile from "../../hooks/useMobile";
import {
  useBrandsQuery,
  useCategoriesQuery,
  useSubCategoriesQuery,
} from "@/hooks/queries/useCatalogQueries";
import { useUserProfileQuery } from "@/hooks/queries/useUserProfileQuery";

const SideBar = lazy(() => import("../../components/SideBar"));
const CartMobileLink = lazy(() => import("../../components/CartMobile"));
const Modal = lazy(() => import("../../components/Modal"));
const Login = lazy(() =>
  import("../(auth)/login/page").then((mod) => ({ default: mod.default || mod }))
);
const SparklesCore = lazy(() =>
  import("../../components/ui/sparkles").then((mod) => ({
    default: mod.SparklesCore,
  }))
);

const BackgroundEffect = memo(function BackgroundEffect() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
    >
      <div className="absolute inset-0 w-full h-full">
        <Suspense fallback={null}>
          <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
        </Suspense>
      </div>
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70 dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70 pointer-events-none z-10"
        style={{ mixBlendMode: "soft-light", opacity: 0.85 }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)",
          opacity: 0.5,
        }}
      />
    </div>
  );
});

const PathAwareShell = memo(function PathAwareShell({
  children,
  navData,
  loadingStates,
}) {
  const pathname = usePathname();
  const [isMobile] = useMobile();
  const isHome = pathname === "/";
  const showSidebar = isHome && !isMobile;
  const isCheckout = pathname === "/checkout";

  const categories = navData?.categories ?? [];
  const subCategories = navData?.subCategories ?? [];
  const brands = navData?.brands ?? [];

  const loadingCategoryOverride = loadingStates?.categories ?? false;
  const loadingBrandOverride = loadingStates?.brands ?? false;

  return (
    <>
      <main className="min-h-[78vh] bg-[#faf6f3] relative">
        <div className="container mx-auto py-1">
          <div className="flex flex-col md:flex-row gap-4">
            {showSidebar && !isCheckout && (
              <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm">
                <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
                  <SideBar
                    categoryData={categories}
                    subCategoryData={subCategories}
                    brandData={brands}
                    loadingCategory={loadingCategoryOverride}
                    loadingBrand={loadingBrandOverride}
                  />
                </Suspense>
              </div>
            )}
            <div
              className={`w-full ${
                showSidebar && !isCheckout ? "md:w-3/4 lg:w-4/5" : "w-full"
              } bg-white/80 rounded-xl shadow p-3`}
            >
              {children}
            </div>
          </div>
        </div>
      </main>
      {pathname !== "/checkout" && (
        <Suspense fallback={null}>
          <CartMobileLink />
        </Suspense>
      )}
    </>
  );
});

function ShellWithRedux({ children, initialNavData }) {
  const pathname = usePathname();
  const isCheckout = pathname === "/checkout";
  const [showLoginModal, setShowLoginModal] = useState(false);

  const categoriesQuery = useCategoriesQuery({
    enabled: typeof window !== "undefined",
    initialData: initialNavData?.categories ?? [],
  });

  const subCategoriesQuery = useSubCategoriesQuery({
    enabled: typeof window !== "undefined",
    initialData: initialNavData?.subCategories ?? [],
  });

  const brandsQuery = useBrandsQuery({
    enabled: typeof window !== "undefined",
  });

  useUserProfileQuery({
    enabled: typeof window !== "undefined",
  });

  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener("show-login", handler);
    return () => window.removeEventListener("show-login", handler);
  }, []);

  const navData = useMemo(
    () => ({
      categories: categoriesQuery.data ?? initialNavData?.categories ?? [],
      subCategories:
        subCategoriesQuery.data ?? initialNavData?.subCategories ?? [],
      brands: brandsQuery.data ?? [],
    }),
    [
      brandsQuery.data,
      categoriesQuery.data,
      initialNavData?.categories,
      initialNavData?.subCategories,
      subCategoriesQuery.data,
    ]
  );

  const loadingStates = useMemo(
    () => ({
      categories: categoriesQuery.isFetching || subCategoriesQuery.isFetching,
      brands: brandsQuery.isFetching,
    }),
    [brandsQuery.isFetching, categoriesQuery.isFetching, subCategoriesQuery.isFetching]
  );

  const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout]);

  return (
    <>
      {shouldRenderBackground && <BackgroundEffect />}

      <Header />

      <Suspense
        fallback={
          <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
            <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
          </div>
        }
      >
        <PathAwareShell navData={navData} loadingStates={loadingStates}>
          {children}
        </PathAwareShell>
      </Suspense>

      {showLoginModal && (
        <Suspense fallback={null}>
          <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
            <Login onSuccess={() => setShowLoginModal(false)} />
          </Modal>
        </Suspense>
      )}

      <Footer />
      <Toaster />
    </>
  );
}

export default ShellWithRedux;