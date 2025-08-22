'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function NotFoundInner() {
  const searchParams = useSearchParams()
  const from = searchParams?.get('from') || null

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="mb-6">Sorry, the page you are looking for does not exist.</p>

      {from && (
        <p className="text-sm text-gray-600">
          You were redirected from: <code>{from}</code>
        </p>
      )}

      <Link
        href="/"
        className="inline-block mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go home
      </Link>
    </div>
  )
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <NotFoundInner />
    </Suspense>
  )
}