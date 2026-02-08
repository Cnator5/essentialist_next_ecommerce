
import Link from 'next/link'

export default function NotFound() {
  const SITE_NAME = 'Essentialist Makeup Store'
  const CONTACT_EMAIL = 'info@esmakeupstore.com'

  const links = [
    { href: '/', label: 'Home' },
    { href: '/brands', label: 'Brands' },
    { href: '/collections/new-in', label: 'New Arrivals' },
    { href: '/collections/bestsellers', label: 'Bestsellers' },
    { href: '/collections/face', label: 'Face Makeup' },
    { href: '/collections/eyes', label: 'Eye Makeup' }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-white py-16 px-4 text-gray-800">
      <section className="mx-auto flex max-w-3xl flex-col items-center rounded-3xl bg-white/90 p-10 shadow-2xl backdrop-blur">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.35em] text-pink-400">Error 404</p>
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-pink-600 sm:text-5xl">Page Not Found</h1>
        
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="transition-transform group-hover:translate-x-1">
                  <path d="M7 17 17 7" /><path d="m8 7 9 0 0 9" />
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-12 rounded-2xl bg-pink-50 px-6 py-4 text-center text-sm text-pink-700">
          Need help finding a product? Email us at {CONTACT_EMAIL} and our team will assist you.
        </p>

        <Link href="/" className="mt-8 inline-flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-pink-600">
          Return to Home
        </Link>
      </section>
    </main>
  )
}