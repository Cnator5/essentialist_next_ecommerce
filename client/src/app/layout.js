// 'use client'

// import { Inter } from 'next/font/google'
// import { Provider } from 'react-redux'
// import { Toaster } from 'react-hot-toast'
// import { store } from '../store/store'
// import GlobalProvider from '../providers/GlobalProvider'
// import Header from '../components/Header'
// import Footer from '../components/Footer'
// import SideBar from '../components/SideBar'
// import CartMobileLink from '../components/CartMobile'
// import Modal from '../components/Modal'
// import Login from './(auth)/login/page'
// import './globals.css'
// import { usePathname } from 'next/navigation'
// import useMobile from '../hooks/useMobile'
// import { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux'
// import fetchUserDetails from '../utils/fetchUserDetails'
// import { setUserDetails } from '../store/userSlice'
// import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../store/productSlice'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'

// const inter = Inter({ subsets: ['latin'] })

// function RootLayoutContent({ children }) {
//   const dispatch = useDispatch()
//   const pathname = usePathname()
//   const [isMobile] = useMobile()
//   const [showLoginModal, setShowLoginModal] = useState(false)

//   const fetchUser = async () => {
//     const userData = await fetchUserDetails()
//     dispatch(setUserDetails(userData.data))
//   }

//   const fetchCategory = async () => {
//     try {
//       dispatch(setLoadingCategory(true))
//       const response = await Axios({
//         ...SummaryApi.getCategory
//       })
//       const { data: responseData } = response
//       if (responseData.success) {
//         dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
//       }
//     } catch (error) {
//       console.error("Category fetch failed:", error)
//     } finally {
//       dispatch(setLoadingCategory(false))
//     }
//   }

//   const fetchSubCategory = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.getSubCategory
//       })
//       const { data: responseData } = response
//       if (responseData.success) {
//         dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
//       }
//     } catch (error) {
//       console.error("SubCategory fetch failed:", error)
//     } finally {
//       dispatch(setLoadingCategory(false))
//     }
//   }

//   useEffect(() => {
//     fetchUser()
//     fetchCategory()
//     fetchSubCategory()
//   }, [])

//   useEffect(() => {
//     const handler = () => setShowLoginModal(true)
//     window.addEventListener("show-login", handler)
//     return () => window.removeEventListener("show-login", handler)
//   }, [])

//   const showSidebar = !pathname?.includes('/dashboard') && !isMobile

//   return (
//     <>
//       <GlobalProvider>
//         <Header />
//         <main className='min-h-[78vh]'>
//           <div className="container mx-auto py-1">
//             <div className="flex flex-col md:flex-row gap-4">
//               {showSidebar && (
//                 <div className="w-full md:w-1/4 lg:w-1/5">
//                   <SideBar />
//                 </div>
//               )}
//               <div className={`w-full ${showSidebar ? 'md:w-3/4 lg:w-4/5' : 'w-full'}`}>
//                 {children}
//               </div>
//             </div>
//           </div>
//         </main>
//         <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
//           <Login
//             onSuccess={() => setShowLoginModal(false)}
//           />
//         </Modal>
//         <Footer />
//         <Toaster />
//         {
//           pathname !== '/checkout' && (
//             <CartMobileLink />
//           )
//         }
//       </GlobalProvider>
//     </>
//   )
// }

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <Provider store={store}>
//           <RootLayoutContent>
//             {children}
//           </RootLayoutContent>
//         </Provider>
//       </body>
//     </html>
//   )
// }



'use client'

import { Inter } from 'next/font/google'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from '../store/store'
import GlobalProvider from '../providers/GlobalProvider'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SideBar from '../components/SideBar'
import CartMobileLink from '../components/CartMobile'
import Modal from '../components/Modal'
import Login from './(auth)/login/page'
import './globals.css'
import { usePathname } from 'next/navigation'
import useMobile from '../hooks/useMobile'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import fetchUserDetails from '../utils/fetchUserDetails'
import { setUserDetails } from '../store/userSlice'
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../store/productSlice'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const inter = Inter({ subsets: ['latin'] })

function RootLayoutContent({ children }) {
  const dispatch = useDispatch()
  const pathname = usePathname()
  const [isMobile] = useMobile()
  const [showLoginModal, setShowLoginModal] = useState(false)

 /*  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  } */

  const fetchUser = async () => {
  try {
    const userData = await fetchUserDetails()
    if (userData && userData.data) {
      dispatch(setUserDetails(userData.data))
    } else {
      dispatch(setUserDetails(null))
    }
  } catch (err) {
    dispatch(setUserDetails(null))
  }
}

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true))
      const response = await Axios({
        ...SummaryApi.getCategory
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.error("Category fetch failed:", error)
    } finally {
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.getSubCategory
      })
      const { data: responseData } = response
      if (responseData.success) {
        dispatch(setAllSubCategory(responseData.data.sort((a, b) => a.name.localeCompare(b.name))))
      }
    } catch (error) {
      console.error("SubCategory fetch failed:", error)
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
    window.addEventListener("show-login", handler)
    return () => window.removeEventListener("show-login", handler)
  }, [])

  const showSidebar = !pathname?.includes('/dashboard') && !isMobile

  return (
    <>
      <GlobalProvider>
        <Header />
        <main className='min-h-[78vh]'>
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
        <Modal open={showLoginModal} onClose={() => setShowLoginModal(false)}>
          <Login onSuccess={() => setShowLoginModal(false)} />
        </Modal>
        <Footer />
        <Toaster />
        {pathname !== '/checkout' && <CartMobileLink />}
      </GlobalProvider>
    </>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <Provider store={store}>
          <RootLayoutContent>
            {children}
          </RootLayoutContent>
        </Provider>
      </body>
    </html>
  )
}