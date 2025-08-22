// app/success/page.jsx
import React, { Suspense } from 'react'
import Link from 'next/link'

// Server Component page that renders a Client Component inside Suspense
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

function SearchParamsClientInner() {
  const { useSearchParams } = require('next/navigation')
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

// Make the component that uses hooks a Client Component.
function SearchParamsClient() {
  'use client'
  return <SearchParamsClientInner />
}