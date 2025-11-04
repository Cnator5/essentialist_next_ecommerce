// 'use client';

// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import Link from 'next/link';
// import { useRouter } from 'next/navigation';
// import toast from 'react-hot-toast';
// import { HiOutlineExternalLink } from 'react-icons/hi';

// import Divider from './Divider';
// import Axios from '../utils/Axios';
// import SummaryApi from '../common/SummaryApi';
// import AxiosToastError from '../utils/AxiosToastError';
// import isAdmin from '../utils/isAdmin';
// import { logout } from '../store/userSlice';

// const UserMenu = ({ onSelect }) => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const isUserAdmin = isAdmin(user?.role);
//   const userLabel = user?.name || user?.mobile || 'Guest';

//   const closeMenu = () => {
//     if (typeof onSelect === 'function') onSelect();
//   };

//   const handleLogout = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.logout
//       });

//       if (response?.data?.success) {
//         if (typeof window !== 'undefined') {
//           localStorage.clear();
//         }
//         dispatch(logout());
//         toast.success(response.data.message || 'Logged out');
//         closeMenu();
//         router.push('/');
//       } else {
//         toast.error(response?.data?.message || 'Logout failed');
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   return (
//     <nav className="text-sm">
//       <header className="mb-3">
//         <div className="font-semibold">My Account</div>
//         <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">
//           <span className="max-w-[12rem] truncate">
//             {userLabel}{' '}
//             {isUserAdmin && <span className="text-red-500 font-medium">(Admin)</span>}
//           </span>
//           <Link
//             href="/dashboard/profile"
//             onClick={closeMenu}
//             className="text-primary-200 hover:text-primary-300"
//             aria-label="Open profile"
//           >
//             <HiOutlineExternalLink size={16} />
//           </Link>
//         </div>
//       </header>

//       <Divider />

//       <ul className="mt-3 grid gap-1 font-semibold">
//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Dashboard Overview
//             </Link>
//           </li>
//         )}

//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard/category"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Category
//             </Link>
//           </li>
//         )}

//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard/subcategory"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Sub Category
//             </Link>
//           </li>
//         )}

//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard/upload-product"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Upload Product
//             </Link>
//           </li>
//         )}

//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard/product"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Product
//             </Link>
//           </li>
//         )}

//         {isUserAdmin && (
//           <li>
//             <Link
//               href="/dashboard/brands"
//               onClick={closeMenu}
//               className="block rounded px-2 py-1 hover:bg-orange-200/60"
//             >
//               Brands
//             </Link>
//           </li>
//         )}

//         <li>
//           <Link
//             href="/dashboard/myorders"
//             onClick={closeMenu}
//             className="block rounded px-2 py-1 hover:bg-orange-200/60"
//           >
//             My Orders
//           </Link>
//         </li>

//         <li>
//           <Link
//             href="/dashboard/address"
//             onClick={closeMenu}
//             className="block rounded px-2 py-1 hover:bg-orange-200/60"
//           >
//             Save Address
//           </Link>
//         </li>

//         <li>
//           <button
//             type="button"
//             onClick={handleLogout}
//             className="w-full text-left rounded px-2 py-1 hover:bg-orange-200/60"
//           >
//             Log Out
//           </button>
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default UserMenu;








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

        {isUserAdmin && (
          <li>
            <Link
              href="/dashboard/blog"
              onClick={closeMenu}
              className="block rounded px-2 py-1 hover:bg-orange-200/60"
            >
              Blog Manager
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