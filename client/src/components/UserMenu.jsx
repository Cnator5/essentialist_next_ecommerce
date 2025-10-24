// "use client";
// import React from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import Divider from './Divider'
// import Axios from '../utils/Axios'
// import SummaryApi from '../common/SummaryApi'
// import { logout } from '../store/userSlice'
// import toast from 'react-hot-toast'
// import AxiosToastError from '../utils/AxiosToastError'
// import { HiOutlineExternalLink } from "react-icons/hi";
// import isAdmin from '../utils/isAdmin'
// import { useRouter } from 'next/navigation'
// import Link from 'next/link'

// const UserMenu = ({ close }) => {
//   const user = useSelector((state) => state.user)
//   const dispatch = useDispatch()
//   const router = useRouter()

//   const handleLogout = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.logout
//       })
//       if (response?.data?.success) {
//         if (typeof window !== 'undefined') {
//           localStorage.clear()
//         }
//         dispatch(logout())
//         toast.success(response.data.message || 'Logged out')
//         if (typeof close === 'function') close()
//         // Use Next.js App Router navigation
//         router.push('/')
//       } else {
//         toast.error(response?.data?.message || 'Logout failed')
//       }
//     } catch (error) {
//       console.error(error)
//       AxiosToastError(error)
//     }
//   }

//   const handleClose = () => {
//     if (typeof close === 'function') close()
//   }

//   const userLabel = user?.name || user?.mobile || 'Guest'
//   const isUserAdmin = isAdmin(user?.role)

//   return (
//     <div>
//       <div className='font-bold'>My Account</div>
//       <div className='text-sm flex items-center gap-2'>
//         <span className='max-w-52 text-ellipsis line-clamp-1'>
//           {userLabel} <span className='text-medium text-red-600'>{isUserAdmin ? '(Admin)' : ''}</span>
//         </span>
//         <Link onClick={handleClose} href="/dashboard/profile" className='hover:text-primary-200'>
//           <HiOutlineExternalLink size={15} />
//         </Link>
//       </div>

//       <Divider />

//       <div className='text-sm font-semibold sm:font-bold grid gap-1'>

//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard" className='px-2 hover:bg-orange-200 py-1'>
//             Dashboard Overview
//           </Link>
//         )}

//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard/category" className='px-2 hover:bg-orange-200 py-1'>
//             Category
//           </Link>
//         )}

//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard/subcategory" className='px-2 hover:bg-orange-200 py-1'>
//             Sub Category
//           </Link>
//         )}

//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard/upload-product" className='px-2 hover:bg-orange-200 py-1'>
//             Upload Product
//           </Link>
//         )}

//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard/product" className='px-2 hover:bg-orange-200 py-1'>
//             Product
//           </Link>
//         )}
//         {isUserAdmin && (
//           <Link onClick={handleClose} href="/dashboard/brands" className='px-2 hover:bg-orange-200 py-1'>
//             Brands
//           </Link>
//         )}

//         <Link onClick={handleClose} href="/dashboard/myorders" className='px-2 hover:bg-orange-200 py-1'>
//           My Orders
//         </Link>

//         <Link onClick={handleClose} href="/dashboard/address" className='px-2 hover:bg-orange-200 py-1'>
//           Save Address
//         </Link>

//         <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>
//           Log Out
//         </button>
//       </div>
//     </div>
//   )
// }

// export default UserMenu








'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { HiOutlineExternalLink } from 'react-icons/hi';

import Divider from './Divider';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import isAdmin from '../utils/isAdmin';
import { logout } from '../store/userSlice';

const UserMenu = ({ onSelect }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const isUserAdmin = isAdmin(user?.role);
  const userLabel = user?.name || user?.mobile || 'Guest';

  const closeMenu = () => {
    if (typeof onSelect === 'function') onSelect();
  };

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      });

      if (response?.data?.success) {
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }
        dispatch(logout());
        toast.success(response.data.message || 'Logged out');
        closeMenu();
        router.push('/');
      } else {
        toast.error(response?.data?.message || 'Logout failed');
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <nav className="text-sm">
      <header className="mb-3">
        <div className="font-semibold">My Account</div>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
          <span className="max-w-[12rem] truncate">
            {userLabel}{' '}
            {isUserAdmin && <span className="text-red-500 font-medium">(Admin)</span>}
          </span>
          <Link
            href="/dashboard/profile"
            onClick={closeMenu}
            className="text-primary-200 hover:text-primary-300"
            aria-label="Open profile"
          >
            <HiOutlineExternalLink size={16} />
          </Link>
        </div>
      </header>

      <Divider />

      <ul className="mt-3 grid gap-1 font-semibold">
        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Dashboard Overview
            </Link>
          </li>
        )}

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/category"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Category
            </Link>
          </li>
        )}

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/subcategory"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Sub Category
            </Link>
          </li>
        )}

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/upload-product"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Upload Product
            </Link>
          </li>
        )}

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/product"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Product
            </Link>
          </li>
        )}

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/brands"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Brands
            </Link>
          </li>
        )}

        <li>
          <Link
            href="/dashboard/myorders"
            onClick={closeMenu}
            className="block rounded px-2 py-1 hover:bg-orange-200/60"
          >
            My Orders
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/address"
            onClick={closeMenu}
            className="block rounded px-2 py-1 hover:bg-orange-200/60"
          >
            Save Address
          </Link>
        </li>

        <li>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full text-left rounded px-2 py-1 hover:bg-orange-200/60"
          >
            Log Out
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default UserMenu;