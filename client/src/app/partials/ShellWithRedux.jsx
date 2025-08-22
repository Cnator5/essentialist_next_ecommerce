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

function PathAwareShell({ children }) {
  const pathname = usePathname()
  const [isMobile] = useMobile()
  const showSidebar = !pathname?.includes('/dashboard') && !isMobile

  return (
    <>
      <main className="min-h-[78vh]">
        <div className="container mx-auto py-1">
          <div className="flex flex-col md:flex-row gap-4">
            {showSidebar && (
              <div className="w-full md:w-1/4 lg:w-1/5">
                <SideBar />
              </div>
            )}
            <div className={`w-full ${showSidebar ? 'md:w-3/4 lg:w-4/5' : 'w-full'}`}>
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
      <Header />
      {/* Any subtree that reads usePathname/useSearchParams must be inside Suspense */}
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