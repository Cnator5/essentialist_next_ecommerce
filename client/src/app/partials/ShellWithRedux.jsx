'use client'

import { Suspense, useEffect, useState, useCallback, useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import GlobalProvider from '../../providers/GlobalProvider'
import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import useMobile from '../../hooks/useMobile'
import { useDispatch } from 'react-redux'
import fetchUserDetails from '../../utils/fetchUserDetails'
import { setUserDetails } from '../../store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../../store/productSlice'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'

// Dynamic imports for code splitting (reduces initial bundle size)
const Header = dynamic(() => import('../../components/Header'), { 
  ssr: true,
  loading: () => <div className="h-16 bg-white/80 backdrop-blur-sm shadow-sm" /> 
})
const Footer = dynamic(() => import('../../components/Footer'), { 
  ssr: true,
  loading: () => <div className="h-20 bg-white/80 backdrop-blur-sm" /> 
})
const SideBar = dynamic(() => import('../../components/SideBar'), { 
  ssr: true,
  loading: () => <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2 animate-pulse">
    <div className="h-8 bg-gray-200 rounded mb-4" />
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded" />
      ))}
    </div>
  </div> 
})
const CartMobileLink = dynamic(() => import('../../components/CartMobile'), { 
  ssr: false,
  loading: () => null 
})
const Modal = dynamic(() => import('../../components/Modal'), { 
  ssr: true,
  loading: () => null 
})
const Login = dynamic(() => import('../(auth)/login/page'), { 
  ssr: true,
  loading: () => <div className="p-4">Loading login...</div> 
})
const SparklesCore = dynamic(() => 
  import('../../components/ui/sparkles').then((mod) => ({ 
    default: mod.SparklesCore 
  })), 
  { 
    ssr: false,
    loading: () => null // No loading for background effect
  }
)

// Memoized Axios instance with caching (in-memory cache for client-side)
const axiosCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes TTL

const cachedAxios = async (config, cacheKey) => {
  const now = Date.now()
  const cached = axiosCache.get(cacheKey)
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data
  }

  try {
    const response = await Axios(config)
    const data = response.data
    axiosCache.set(cacheKey, { data, timestamp: now })
    return data
  } catch (error) {
    // Invalidate cache on error
    axiosCache.delete(cacheKey)
    throw error
  }
}

function PathAwareShell({ children }) {
  const pathname = usePathname()
  const [isMobile] = useMobile()
  const showSidebar = !pathname?.includes('/dashboard') && !isMobile

  return (
    <>
      <main className="min-h-[78vh] bg-[#faf6f3] relative">
        <div className="container mx-auto py-1">
          <div className="flex flex-col md:flex-row gap-4">
            {showSidebar && (
              <div className="w-full md:w-1/4 lg:w-1/5 bg-white/70 rounded-xl shadow-sm p-2">
                <SideBar />
              </div>
            )}
            <div className={`w-full ${showSidebar ? 'md:w-3/4 lg:w-4/5' : 'w-full'} bg-white/80 rounded-xl shadow p-3`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      {pathname !== '/checkout' && <CartMobileLink />}
    </>
  )
}

export default function ShellWithRedux({ children }) {
  const dispatch = useDispatch()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // Memoized fetch functions with caching and error handling
  const fetchUser = useCallback(async () => {
    try {
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData?.data || null))
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('User fetch failed:', error)
      }
      dispatch(setUserDetails(null))
    }
  }, [dispatch])

  const fetchCategory = useCallback(async () => {
    try {
      dispatch(setLoadingCategory(true))
      const responseData = await cachedAxios(SummaryApi.getCategory, 'categories')
      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Category fetch failed:', error)
      }
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }, [dispatch])

  const fetchSubCategory = useCallback(async () => {
    try {
      const responseData = await cachedAxios(SummaryApi.getSubCategory, 'subcategories')
      if (responseData.success) {
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('SubCategory fetch failed:', error)
      }
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }, [dispatch])

  // Parallel fetches on mount (faster initial load)
  useEffect(() => {
    const fetchAllData = async () => {
      await Promise.allSettled([fetchUser(), fetchCategory(), fetchSubCategory()])
    }
    fetchAllData()
  }, [fetchUser, fetchCategory, fetchSubCategory])

  useEffect(() => {
    const handler = () => setShowLoginModal(true)
    window.addEventListener('show-login', handler)
    return () => window.removeEventListener('show-login', handler)
  }, [])

  // Memoized background layers (stable JSX to avoid re-renders)
  const backgroundLayers = useMemo(() => (
    <>
      {/* Sparkles Layer - Lazy-loaded and blurred for perf */}
      <div className="absolute inset-0 w-full h-full">
        <SparklesCore className="w-full h-full mix-blend-screen opacity-80 blur-[1px]" />
      </div>
      {/* Gradient Overlay Layer */}
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
      {/* Subtle Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.05) 100%)',
          opacity: 0.5,
        }}
      />
    </>
  ), []) // Empty deps: stable across renders

  return (
    <GlobalProvider>
      {/* Optimized fixed background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
      >
        {backgroundLayers}
      </div>

      <Header />
      <Suspense fallback={
        <div className="min-h-[78vh] bg-[#faf6f3] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Loading...</p>
          </div>
        </div>
      }>
        <PathAwareShell>{children}</PathAwareShell>
      </Suspense>
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login onSuccess={() => setShowLoginModal(false)} />
      </Modal>
      <Footer />
      <Toaster 
        position="top-right"
        gutter={8}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
        }}
      />
    </GlobalProvider>
  )
}