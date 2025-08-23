"use client";
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Divider from './Divider'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { logout } from '../store/userSlice'
import toast from 'react-hot-toast'
import AxiosToastError from '../utils/AxiosToastError'
import { HiOutlineExternalLink } from "react-icons/hi";
import isAdmin from '../utils/isAdmin'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const UserMenu = ({ close }) => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.logout
      })
      if (response?.data?.success) {
        if (typeof window !== 'undefined') {
          localStorage.clear()
        }
        dispatch(logout())
        toast.success(response.data.message || 'Logged out')
        if (typeof close === 'function') close()
        // Use Next.js App Router navigation
        router.push('/')
      } else {
        toast.error(response?.data?.message || 'Logout failed')
      }
    } catch (error) {
      console.error(error)
      AxiosToastError(error)
    }
  }

  const handleClose = () => {
    if (typeof close === 'function') close()
  }

  const userLabel = user?.name || user?.mobile || 'Guest'
  const isUserAdmin = isAdmin(user?.role)

  return (
    <div>
      <div className='font-bold'>My Account</div>
      <div className='text-sm flex items-center gap-2'>
        <span className='max-w-52 text-ellipsis line-clamp-1'>
          {userLabel} <span className='text-medium text-red-600'>{isUserAdmin ? '(Admin)' : ''}</span>
        </span>
        <Link onClick={handleClose} href="/dashboard/profile" className='hover:text-primary-200'>
          <HiOutlineExternalLink size={15} />
        </Link>
      </div>

      <Divider />

      <div className='text-sm font-semibold sm:font-bold grid gap-1'>

        {isUserAdmin && (
          <Link onClick={handleClose} href="/dashboard" className='px-2 hover:bg-orange-200 py-1'>
            Dashboard Overview
          </Link>
        )}

        {isUserAdmin && (
          <Link onClick={handleClose} href="/dashboard/category" className='px-2 hover:bg-orange-200 py-1'>
            Category
          </Link>
        )}

        {isUserAdmin && (
          <Link onClick={handleClose} href="/dashboard/subcategory" className='px-2 hover:bg-orange-200 py-1'>
            Sub Category
          </Link>
        )}

        {isUserAdmin && (
          <Link onClick={handleClose} href="/dashboard/upload-product" className='px-2 hover:bg-orange-200 py-1'>
            Upload Product
          </Link>
        )}

        {isUserAdmin && (
          <Link onClick={handleClose} href="/dashboard/product" className='px-2 hover:bg-orange-200 py-1'>
            Product
          </Link>
        )}

        <Link onClick={handleClose} href="/dashboard/myorders" className='px-2 hover:bg-orange-200 py-1'>
          My Orders
        </Link>

        <Link onClick={handleClose} href="/dashboard/address" className='px-2 hover:bg-orange-200 py-1'>
          Save Address
        </Link>

        <button onClick={handleLogout} className='text-left px-2 hover:bg-orange-200 py-1'>
          Log Out
        </button>
      </div>
    </div>
  )
}

export default UserMenu