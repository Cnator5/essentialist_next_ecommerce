// 'use client'

// import { Suspense } from 'react'
// import Link from 'next/link'
// import { useSearchParams } from 'next/navigation'

// function NotFoundInner() {
//   const searchParams = useSearchParams()
//   const from = searchParams?.get('from') || null

//   return (
//     <div className="container mx-auto px-4 py-10">
//       <h1 className="text-3xl font-bold mb-4">Page not found</h1>
//       <p className="mb-6">Sorry, the page you are looking for does not exist.</p>

//       {from && (
//         <p className="text-sm text-gray-600">
//           You were redirected from: <code>{from}</code>
//         </p>
//       )}

//       <Link
//         href="/"
//         className="inline-block mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
//       >
//         Go home
//       </Link>
//     </div>
//   )
// }

// export default function NotFoundPage() {
//   return (
//     <Suspense fallback={<div className="p-6">Loading…</div>}>
//       <NotFoundInner />
//     </Suspense>
//   )
// }



import Link from 'next/link'
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

const SITE_NAME = 'Essentialist Makeup Store'
const CONTACT_EMAIL = 'info@esmakeupstore.com'

const FALLBACK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/brands', label: 'Brands' },
  { href: '/collections/new-in', label: 'New Arrivals' },
  { href: '/collections/bestsellers', label: 'Bestsellers' },
  { href: '/collections/face', label: 'Face Makeup' },
  { href: '/collections/eyes', label: 'Eye Makeup' }
]

async function loadHelpfulLinks() {
  'use cache'
  cacheTag('not-found-links')
  cacheLife('hours')
  return FALLBACK_LINKS
}

async function loadSupportMessage() {
  'use cache'
  cacheTag('not-found-support')
  cacheLife('hours')
  return `Need help finding a product? Email us at ${CONTACT_EMAIL} and our team will assist you.`
}

export default function NotFoundPage() {
  return (
    <Suspense fallback={<NotFoundSkeleton />}>
      <NotFoundContent />
    </Suspense>
  )
}

async function NotFoundContent() {
  const [links, supportMessage] = await Promise.all([
    loadHelpfulLinks(),
    loadSupportMessage()
  ])

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-4 text-gray-800">
      <section className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-pink-400">
          Error 404
        </p>
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-pink-600 sm:text-5xl">
          Page Not Found
        </h1>
        <p className="mt-6 max-w-2xl text-center text-base text-gray-600 sm:text-lg">
          We couldn’t find the page you were looking for. Explore our curated selections
          or head back to the homepage to continue shopping at {SITE_NAME}.
        </p>

        <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-xl border border-pink-200 bg-white px-6 py-4 text-center text-sm font-semibold text-pink-600 shadow-sm transition hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-50 hover:text-pink-700"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {link.label}
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  className="transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="m8 7 9 0 0 9" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 rounded-2xl bg-pink-50 px-6 py-4 text-center text-sm text-pink-700">
          {supportMessage}
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
        >
          Return to Home
        </Link>
      </section>
    </main>
  )
}

function NotFoundSkeleton() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-4">
      <section className="mx-auto max-w-3xl animate-pulse rounded-3xl bg-white/80 p-10 shadow-2xl">
        <div className="mx-auto h-4 w-24 rounded-full bg-pink-200" />
        <div className="mt-4 h-10 w-3/4 rounded-full bg-pink-300" />
        <div className="mt-6 h-16 w-full rounded-xl bg-pink-100" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-12 rounded-xl bg-pink-100" />
          ))}
        </div>
        <div className="mt-12 h-12 rounded-2xl bg-pink-100" />
        <div className="mt-8 h-10 w-40 rounded-full bg-pink-200" />
      </section>
    </main>
  )
}