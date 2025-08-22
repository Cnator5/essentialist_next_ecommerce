"use client"
import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const Success = () => {
  const searchParams = useSearchParams()
  const text = searchParams.get('text') || 'Payment'

  return (
    <div className='m-2 w-full max-w-md bg-pink-400 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5'>
      <p className='text-green-800 font-bold text-lg text-center'>
        {text} Successfully
      </p>
      <Link
        href="/"
        className="border border-green-900 text-green-900 hover:bg-yellow-400 hover:text-white transition-all px-4 py-1"
      >
        Go To Home
      </Link>
    </div>
  )
}

export default Success