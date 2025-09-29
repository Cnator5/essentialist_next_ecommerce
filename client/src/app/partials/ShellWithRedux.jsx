'use client'

import { Suspense, useEffect, useState, lazy, memo, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import GlobalProvider from '../../providers/GlobalProvider'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { usePathname } from 'next/navigation'
import useMobile from '../../hooks/useMobile'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../../store/productSlice'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'

// Lazy loaded components
const SideBar = lazy(() => import('../../components/SideBar'))
const CartMobileLink = lazy(() => import('../../components/CartMobile'))
const Modal = lazy(() => import('../../components/Modal'))
const Login = lazy(() => import('../(auth)/login/page'))
const SparklesCore = lazy(() => import('../../components/ui/sparkles').then(mod => ({ default: mod.SparklesCore })))

// Memoized background component to prevent unnecessary re-renders
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
        className="
          absolute inset-0
          bg-gradient-to-br from-[#faf6f3]/90 via-transparent to-[#e9d7c4]/70
          dark:from-[#0f172a]/90 dark:via-transparent dark:to-[#6366f1]/70
          pointer-events-none
          z-10
        "
        style={{
          mixBlendMode: 'soft-light',
          opacity: 0.85,
        }}
      />
      <div
        className="
          absolute inset-0
          pointer-events-none
          z-20
        "
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
          opacity: 0.5,
        }}
      />
    </div>
  )
})

// Memoized PathAwareShell to prevent unnecessary re-renders
const PathAwareShell = memo(function PathAwareShell({ children }) {
  const pathname = usePathname()
  const [isMobile] = useMobile()
  const showSidebar = !pathname?.includes('/dashboard') && !isMobile
  const isCheckout = pathname === '/checkout'

  return (
    <>
      <main className="min-h-[78vh] bg-[#faf6f3] relative">
        <div className="container mx-auto py-1">
          <div className="flex flex-col md:flex-row gap-4">
            {showSidebar && !isCheckout && (
              <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
                <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-xl"></div>}>
                  <SideBar />
                </Suspense>
              </div>
            )}
            <div className={`w-full ${showSidebar && !isCheckout ? 'md:w-3/4 lg:w-4/5' : 'w-full'} bg-white/80 rounded-xl shadow p-3`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      {pathname !== '/checkout' && (
        <Suspense fallback={null}>
          <CartMobileLink />
        </Suspense>
      )}
    </>
  )
})

function ShellWithRedux({ children }) {
  const dispatch = useDispatch()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const pathname = usePathname()
  const isCheckout = pathname === '/checkout'

  // Fetch user data immediately, but defer category data loading
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await import('../../utils/fetchUserDetails').then(mod => mod.default())
        if (userData && userData.data) {
          dispatch(setUserDetails(userData.data))
        } else {
          dispatch(setUserDetails(null))
        }
      } catch {
        dispatch(setUserDetails(null))
      }
    }
    
    fetchUser()
    
    // Setup login modal event listener
    const handler = () => setShowLoginModal(true)
    window.addEventListener('show-login', handler)
    return () => window.removeEventListener('show-login', handler)
  }, [])

  // Load category data with a slight delay to prioritize UI rendering
  useEffect(() => {
    if (isCheckout) return; // Skip category loading on checkout page
    
    const timer = setTimeout(() => {
      const fetchCategoryData = async () => {
        try {
          dispatch(setLoadingCategory(true))
          
          // Fetch categories and subcategories in parallel
          const [categoryResponse, subCategoryResponse] = await Promise.all([
            Axios({ ...SummaryApi.getCategory }),
            Axios({ ...SummaryApi.getSubCategory })
          ]);
          
          if (categoryResponse.data.success) {
            dispatch(
              setAllCategory(
                categoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
              )
            )
          }
          
          if (subCategoryResponse.data.success) {
            dispatch(
              setAllSubCategory(
                subCategoryResponse.data.data.sort((a, b) => a.name.localeCompare(b.name))
              )
            )
          }
        } catch (error) {
          console.error('Category data fetch failed:', error)
        } finally {
          dispatch(setLoadingCategory(false))
        }
      }
      
      fetchCategoryData()
    }, 200); // Small delay to prioritize UI rendering
    
    return () => clearTimeout(timer);
  }, [isCheckout]);

  // Skip rendering background effects on checkout page
  const shouldRenderBackground = useMemo(() => !isCheckout, [isCheckout]);

  return (
    <GlobalProvider>
      {shouldRenderBackground && <BackgroundEffect />}
      
      <Header />
      <Suspense fallback={<div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
        <div className="animate-pulse w-20 h-20 rounded-full bg-gray-200"></div>
      </div>}>
        <PathAwareShell>{children}</PathAwareShell>
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
    </GlobalProvider>
  )
}

export default ShellWithRedux