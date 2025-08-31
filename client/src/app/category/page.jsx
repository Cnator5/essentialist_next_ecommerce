import Link from 'next/link'
import BackgroundPaths from '../../components/BackgroundPaths'

const SITE_URL = 'https://www.esmakeupstore.com'
const SITE_NAME = 'Essentialist Makeup Store'

const categoryMapping = {
  foundation: { name: 'Foundation', description: 'Perfect your base with our range of foundations', icon: '🏗️' },
  lipstick: { name: 'Lipsticks & Lip Products', description: 'Beautiful lip colors and treatments', icon: '💋' },
  mascara: { name: 'Mascara', description: 'Define and enhance your lashes', icon: '👁️' },
  powder: { name: 'Powder Products', description: 'Set your makeup with our powder collection', icon: '✨' },
  concealer: { name: 'Concealers', description: 'Cover imperfections perfectly', icon: '🎭' },
  blush: { name: 'Blush', description: 'Add natural color to your cheeks', icon: '🌸' },
  eyeshadow: { name: 'Eye Shadow', description: 'Create stunning eye looks', icon: '🎨' },
  primer: { name: 'Primers', description: 'Prep your skin for flawless makeup', icon: '🧴' },
  'setting-spray': { name: 'Setting Sprays', description: 'Lock in your look all day', icon: '💨' },
}

export const metadata = {
  title: `Shop by Category - ${SITE_NAME}`,
  description:
    'Browse all makeup categories including foundation, lipstick, mascara, powder, concealer, blush, eyeshadow, primer, and setting sprays. Best prices in Cameroon.',
  keywords: ['makeup categories', 'cosmetics Cameroon', 'beauty products Douala', 'makeup store'],
  openGraph: {
    title: `Shop by Category - ${SITE_NAME}`,
    description: 'Browse all makeup categories. Best prices in Cameroon.',
    url: `${SITE_URL}/category`,
  },
}

export default function CategoryPage() {
  const categories = Object.entries(categoryMapping)
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 pointer-events-none">
        <BackgroundPaths title="" />
      </div>

      <main className="relative z-10 py-10 px-2 md:px-10">
        <header className="text-center mb-8 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-md">
          <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">Shop by Category</h1>
          <p className="text-lg md:text-2xl text-gray-700 font-semibold mb-4">Discover our complete range of makeup products</p>
          <p className="text-gray-600">Browse through {categories.length} different makeup categories</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map(([slug, info]) => (
            <Link
              key={slug}
              href={`/${slug}`}
              className="group bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-pink-200 hover:border-pink-300"
            >
              <div className="p-6 text-center">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{info.icon}</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">{info.name}</h2>
                <p className="text-gray-600 text-sm mb-4">{info.description}</p>
                <div className="inline-flex items-center text-pink-500 font-semibold group-hover:text-pink-600">
                  Shop Now <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="mt-12 bg-pink-100/90 backdrop-blur-sm rounded-lg shadow-lg p-6 md:p-10 max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-2xl font-bold text-pink-600 mb-2">Need Help Finding Products?</h2>
          <p className="text-gray-700 mb-4">Contact us for personalized makeup recommendations and product availability.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+237655225569" className="w-full sm:w-auto bg-pink-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-pink-700 transition-colors">
              📞 Call: +237 655 22 55 69
            </a>
            <a href="mailto:esssmakeup@gmail.com" className="w-full sm:w-auto bg-white text-pink-600 px-6 py-3 rounded-lg font-bold border-2 border-pink-600 hover:bg-pink-50 transition-colors">
              📧 Send Email
            </a>
          </div>
        </section>
      </main>
    </div>
  )
}