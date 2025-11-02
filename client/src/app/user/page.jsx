"use client";

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Divider from '../../components/Divider';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';
import { logout } from '../../store/userSlice';
import toast from 'react-hot-toast';
import AxiosToastError from '../../utils/AxiosToastError';
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../../utils/isAdmin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const UserPage = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      });
      if (response.data.success) {
        dispatch(logout());
        localStorage.clear();
        toast.success(response.data.message);
        router.push("/");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <div className='p-6 max-w-lg mx-auto'>
      <div className='font-bold mb-2'>My Account</div>
      <div className='text-sm flex items-center gap-2 mb-4'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>
          {user.name || user.mobile}
          <span className='text-medium text-red-600'>
            {user.role === "ADMIN" ? " (Admin)" : ""}
          </span>
        </span>
        <Link href="/dashboard/profile" className='hover:text-primary-200'>
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className='text-sm font-semibold sm:font-bold grid gap-1 mt-4'>
        {isAdmin(user.role) && (
          <>
            <Link href="/dashboard" className="px-2 hover:bg-orange-200 py-1">Dashboard Overview</Link>
            <Link href="/dashboard/brand" className="px-2 hover:bg-orange-200 py-1">Brand</Link>
            <Link href="/dashboard/category" className='px-2 hover:bg-orange-200 py-1'>Category</Link>
            <Link href="/dashboard/subcategory" className='px-2 hover:bg-orange-200 py-1'>Sub Category</Link>
            <Link href="/dashboard/upload-product" className='px-2 hover:bg-orange-200 py-1'>Upload Product</Link>
            <Link href="/dashboard/product" className='px-2 hover:bg-orange-200 py-1'>Product</Link>
          </>
        )}
        <Link href="/dashboard/myorders" className='px-2 hover:bg-orange-200 py-1'>My Orders</Link>
        <Link href="/dashboard/address" className='px-2 hover:bg-orange-200 py-1'>Save Address</Link>
        <button
          onClick={handleLogout}
          className='text-left px-2 hover:bg-orange-200 py-1'
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default UserPage;