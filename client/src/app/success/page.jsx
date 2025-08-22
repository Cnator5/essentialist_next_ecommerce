'use client'
// app/success/page.jsx
import React, { Suspense } from 'react'
import Link from 'next/link'

// Keep the page as a Server Component,
// and only the part that reads search params as a Client Component.
export default function SuccessPage() {
  return (
    <main className="px-4 py-10">
      <Suspense fallback={<Skeleton />}>
        <SearchParamsClient />
      </Suspense>
    </main>
  )
}

function Skeleton() {
  return (
    <div className="m-2 w-full max-w-md bg-pink-200 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5 animate-pulse">
      <p className="text-pink-900 font-semibold text-lg text-center">Loading…</p>
      <div className="h-9 w-32 bg-pink-300 rounded" />
    </div>
  )
}

// This is the only Client Component that uses useSearchParams

import { useSearchParams } from 'next/navigation'

function SearchParamsClient() {
  const searchParams = useSearchParams()
  const text = searchParams.get('text') || 'Payment'

  return (
    <div className="m-2 w-full max-w-md bg-pink-400 p-4 py-5 rounded mx-auto flex flex-col justify-center items-center gap-5">
      <p className="text-green-800 font-bold text-lg text-center">
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