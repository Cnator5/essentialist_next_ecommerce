// src/app/layout.js
'use client';

import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from '../store/store';
import GlobalProvider from '../providers/GlobalProvider';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SideBar from '../components/SideBar';
import { usePathname } from 'next/navigation';
import useMobile from '../hooks/useMobile';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import fetchUserDetails from '../utils/fetchUserDetails';
import { setUserDetails } from '../store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from '../store/productSlice';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import Modal from '../components/Modal';
import './globals.css'; // Your global styles
import Login from './(auth)/login/page';
import CartMobileLink from './../components/CartMobile';


const inter = Inter({ subsets: ['latin'] });

// This component fetches initial data and can be used inside the main layout
function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [isMobile] = useMobile();
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchUserDetails();
      if (userData?.data) {
        dispatch(setUserDetails(userData.data));
      }
    };

    const fetchCategories = async () => {
      try {
        dispatch(setLoadingCategory(true));
        const response = await Axios(SummaryApi.getCategory);
        if (response.data.success) {
          dispatch(setAllCategory(response.data.data.sort((a, b) => a.name.localeCompare(b.name))));
        }
      } catch (error) {
        console.error("Category fetch failed:", error);
      } finally {
        dispatch(setLoadingCategory(false));
      }
    };

    const fetchSubCategories = async () => {
      try {
        const response = await Axios(SummaryApi.getSubCategory);
        if (response.data.success) {
          dispatch(setAllSubCategory(response.data.data.sort((a, b) => a.name.localeCompare(b.name))));
        }
      } catch (error) {
        console.error("SubCategory fetch failed:", error);
      }
    };
    
    fetchUser();
    fetchCategories();
    fetchSubCategories();
  }, [dispatch]);

  useEffect(() => {
    const handler = () => setShowLoginModal(true);
    window.addEventListener("show-login", handler);
    return () => window.removeEventListener("show-login", handler);
  }, []);

  const showSidebar = !pathname.startsWith('/dashboard') && !isMobile;

  return (
    <>
      <Header />
      <main className='min-h-[78vh] font-sans bg-background text-foreground'>
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
    </>
  );
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <GlobalProvider>
            <AppInitializer>{children}</AppInitializer>
          </GlobalProvider>
        </Provider>
      </body>
    </html>
  );
}