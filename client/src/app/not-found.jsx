'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function NotFoundInner() {
  const searchParams = useSearchParams()
  const from = searchParams?.get('from') || null

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="mb-6">Sorry, the page you’re looking for doesn’t exist.</p>
      {from && (
        <p className="text-sm text-gray-600">
          You were redirected from: <code>{from}</code>
        </p>
      )}
      <a
        href="/"
        className="inline-block mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Go home
      </a>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundInner />
    </Suspense>
  )
}