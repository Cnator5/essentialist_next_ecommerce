'use client'

import { Suspense, useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import GlobalProvider from '../../providers/GlobalProvider'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SideBar from '../../components/SideBar'
import CartMobileLink from '../../components/CartMobile'
import Modal from '../../components/Modal'
import Login from '../(auth)/login/page'
import { usePathname } from 'next/navigation'
import useMobile from '../../hooks/useMobile'
import { useDispatch } from 'react-redux'
import fetchUserDetails from '../../utils/fetchUserDetails'
import { setUserDetails } from '../../store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../../store/productSlice'
import Axios from '../../utils/Axios'
import SummaryApi from '../../common/SummaryApi'
import { SparklesCore } from '../../components/ui/sparkles'

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

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails()
      if (userData && userData.data) {
        dispatch(setUserDetails(userData.data))
      } else {
        dispatch(setUserDetails(null))
      }
    } catch {
      dispatch(setUserDetails(null))
    }
  }

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({ ...SummaryApi.getCategory })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(
          setAllCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
      }
    } catch (error) {
      console.error('Category fetch failed:', error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(
          setAllSubCategory(
            responseData.data.sort((a, b) => a.name.localeCompare(b.name))
          )
        )
      }
    } catch (error) {
      console.error('SubCategory fetch failed:', error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  }, [])

  useEffect(() => {
    const handler = () => setShowLoginModal(true)
    window.addEventListener('show-login', handler)
    return () => window.removeEventListener('show-login', handler)
  }, [])

  return (
    <GlobalProvider>
      {/* Sparkles effect as elegant background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none w-full h-full overflow-hidden sparkle-bg"
      >
        {/* Sparkles Layer */}
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

      <Header />
      <Suspense fallback={null}>
        <PathAwareShell>{children}</PathAwareShell>
      </Suspense>
      <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <Login onSuccess={() => setShowLoginModal(false)} />
      </Modal>
      <Footer />
      <Toaster />
    </GlobalProvider>
  )
}