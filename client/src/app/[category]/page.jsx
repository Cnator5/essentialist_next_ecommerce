import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

// Components
import BackgroundPaths from '../../components/BackgroundPaths'
import CategoryClientBlock from './shared/CategoryClientBlock'

// Utils
import { valideURLConvert } from '../../utils/valideURLConvert'

const SITE_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'

// Fallback data for static generation
const fallbackCategories = [
  { name: 'Foundation', slug: 'foundation' },
  { name: 'Lipstick', slug: 'lipstick' },
  { name: 'Mascara', slug: 'mascara' },
  { name: 'Powder', slug: 'powder' },
  { name: 'Concealer', slug: 'concealer' },
  { name: 'Blush', slug: 'blush' },
  { name: 'Eyeshadow', slug: 'eyeshadow' },
  { name: 'Primer', slug: 'primer' },
  { name: 'Setting Spray', slug: 'setting-spray' },
]

// Generate static params
export async function generateStaticParams() {
  // Use fallback categories for static generation
  return fallbackCategories.map((category) => ({
    category: category.slug
  }))
}

// Generate metadata
export async function generateMetadata({ params }) {
  const categorySlug = params?.category || ''
  
  const fallbackCategory = fallbackCategories.find(cat => 
    cat.slug === categorySlug
  )

  if (!fallbackCategory) {
    return {
      title: 'Category not found',
      description: 'This category is not available in our store.',
      robots: { index: false, follow: false },
    }
  }

  const title = `${fallbackCategory.name} Makeup Products | ${SITE_NAME}`
  const description = `Shop premium ${fallbackCategory.name.toLowerCase()} makeup products in Cameroon. Best quality cosmetics with fast delivery in Douala & nationwide. Essentialist Makeup Store.`

  return {
    title,
    description,
    keywords: [
      fallbackCategory.name,
      `${fallbackCategory.name} Cameroon`,
      `${fallbackCategory.name} makeup`,
      'cosmetics Cameroon',
      'Douala makeup store',
      'beauty products'
    ],
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      url: `${SITE_URL}/${categorySlug}`,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

// Loading component
function CategoryLoading() {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundPaths title="" />
      </div>

      <main className="relative z-10 py-10 px-2 md:px-10">
        {/* Header Skeleton */}
        <header className="text-center mb-8 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-pink-200">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-pink-100 animate-pulse"></div>
          <div className="h-12 bg-pink-100 animate-pulse rounded-lg mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-pink-100 animate-pulse rounded-lg mb-6 max-w-lg mx-auto"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-pink-200">
                <div className="h-8 bg-pink-100 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-pink-100 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </header>

        {/* Products Grid Skeleton */}
        <section className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-pink-200 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6">
            <div className="h-6 bg-pink-400 animate-pulse rounded mb-2 max-w-xs"></div>
            <div className="h-4 bg-pink-400 animate-pulse rounded max-w-md"></div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-pink-100">
                  <div className="aspect-square bg-pink-50 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-pink-100 animate-pulse rounded mb-2"></div>
                    <div className="h-3 bg-pink-100 animate-pulse rounded mb-3 w-2/3"></div>
                    <div className="flex items-center justify-between">
                      <div className="h-5 bg-pink-100 animate-pulse rounded w-1/3"></div>
                      <div className="h-8 bg-pink-100 animate-pulse rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// Error component
function CategoryError({ categorySlug }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundPaths title="" />
      </div>
      
      <main className="relative z-10 py-10 px-2 md:px-10 flex items-center justify-center">
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-pink-200 max-w-md">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-6">
            The category "{categorySlug}" doesn't exist or is not available at the moment.
          </p>
          <div className="space-y-3">
            <Link 
              href="/category" 
              className="block w-full bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors"
            >
              Browse All Categories
            </Link>
            <Link 
              href="/" 
              className="block w-full bg-white text-pink-600 px-6 py-3 rounded-lg font-bold border-2 border-pink-600 hover:bg-pink-50 transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

// Main Server Component
export default async function CategoryPage({ params }) {
  const categorySlug = params?.category || ''
  
  // Check if category exists in our fallback list
  const fallbackCategory = fallbackCategories.find(cat => 
    cat.slug === categorySlug
  )

  if (!fallbackCategory) {
    return <CategoryError categorySlug={categorySlug} />
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundPaths title="" />
      </div>

      <main className="relative z-10 py-10 px-2 md:px-10">
        <Suspense fallback={<CategoryLoading />}>
          <CategoryClientBlock 
            categorySlug={categorySlug}
            fallbackTitle={fallbackCategory.name}
            fallbackDesc={`Discover premium ${fallbackCategory.name.toLowerCase()} products`}
          />
        </Suspense>

        {/* Contact Section */}
        <section className="mt-12 bg-gradient-to-r from-pink-100/90 to-purple-100/90 backdrop-blur-sm rounded-xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto text-center border border-pink-200">
          <h2 className="text-3xl font-bold text-pink-600 mb-4">Need Help Finding Products?</h2>
          <p className="text-gray-700 mb-6 text-lg">
            Contact us for personalized makeup recommendations and product availability.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="tel:+237655225569" 
              className="w-full sm:w-auto bg-pink-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-pink-700 transition-colors shadow-lg hover:shadow-xl"
            >
              📞 Call: +237 655 22 55 69
            </a>
            <a 
              href="mailto:esssmakeup@gmail.com" 
              className="w-full sm:w-auto bg-white text-pink-600 px-8 py-4 rounded-lg font-bold border-2 border-pink-600 hover:bg-pink-50 transition-colors shadow-lg hover:shadow-xl"
            >
              📧 Send Email
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}