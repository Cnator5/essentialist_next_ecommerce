// src/app/[category]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CardProduct from '../../components/CardProduct';
import { valideURLConvert } from '../../utils/valideURLConvert';
import SummaryApi, { baseURL } from '../../common/SummaryApi';

const PAGE_SIZE = 12;

/* ----------------------- Helpers ----------------------- */
function parseIdFromSlug(slug) {
  if (!slug) return null;
  const parts = String(slug).split('-');
  return parts[parts.length - 1];
}
function parseNameFromSlug(slug) {
  if (!slug) return '';
  const parts = String(slug).split('-');
  return parts.slice(0, parts.length - 1).join(' ');
}
function safeArray(v) {
  return Array.isArray(v) ? v : [];
}
function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').trim();
}

/* ----------------------- Data Fetch ----------------------- */
async function fetchCategories() {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getCategory.url}`, {
      method: SummaryApi.getCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.warn(`getCategory failed with status ${res.status}:`, res.statusText);
      return [];
    }
    const j = await res.json();
    return safeArray(j?.data || j);
  } catch (e) {
    console.error('fetchCategories', e);
    return [];
  }
}

// Strictly fetch subcategories of a given categoryId.
async function fetchSubCategoriesOfCategory(categoryId) {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getSubCategory.url}`, {
      method: SummaryApi.getSubCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId }),
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.warn(`getSubCategory failed with status ${res.status}:`, res.statusText);
      return [];
    }
    const j = await res.json();
    // Safety filter even if backend already filtered
    return safeArray(j?.data || j).filter((s) =>
      safeArray(s?.category).some((c) => String(c?._id) === String(categoryId))
    );
  } catch (e) {
    console.error('fetchSubCategoriesOfCategory', e);
    return [];
  }
}

async function fetchProductsByCategory({ categoryId, page }) {
  try {
    const res = await fetch(`${baseURL}${SummaryApi.getProductByCategory.url}`, {
      method: SummaryApi.getProductByCategory.method.toUpperCase(),
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, page, limit: PAGE_SIZE }),
      next: { revalidate: 120 },
    });
    
    // Better error handling - don't throw, just return empty result
    if (!res.ok) {
      console.warn(`getProductByCategory failed with status ${res.status}:`, res.statusText);
      return { products: [], totalCount: 0 };
    }
    
    const j = await res.json();
    if (!j?.success) return { products: [], totalCount: 0 };
    return { products: safeArray(j.data), totalCount: Number(j.totalCount || 0) };
  } catch (e) {
    console.error('fetchProductsByCategory', e);
    return { products: [], totalCount: 0 };
  }
}

// Fallback: aggregate products across all subcategories of this category
async function fetchProductsAcrossSubcategories({ categoryId, subcats, page }) {
  const per = PAGE_SIZE;
  const start = (page - 1) * per;
  const acc = [];
  let totalCount = 0;

  for (const s of subcats) {
    try {
      const res = await fetch(`${baseURL}${SummaryApi.getProductByCategoryAndSubCategory.url}`, {
        method: SummaryApi.getProductByCategoryAndSubCategory.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId,
          subCategoryId: s?._id,
          page: 1,
          limit: 100,
        }),
        next: { revalidate: 120 },
      });
      if (!res.ok) continue;
      const j = await res.json();
      const list = safeArray(j?.data);
      acc.push(...list);
      totalCount += Number(j?.totalCount || list.length || 0);
    } catch (e) {
      console.error('fetchProductsAcrossSubcategories (one subcat)', e);
    }
  }

  // Sort newest first if timestamps exist
  acc.sort((a, b) => new Date(b?.updatedAt || b?.createdAt || 0) - new Date(a?.updatedAt || a?.createdAt || 0));
  const products = acc.slice(start, start + per);
  if (!totalCount) totalCount = acc.length;

  return { products, totalCount };
}

/* ----------------------- Metadata ----------------------- */
export async function generateMetadata({ params, searchParams }) {
  const categorySlug = params?.category;
  const page = Number(searchParams?.page || 1);
  const name = parseNameFromSlug(categorySlug) || 'Category';

  const title = `Shop ${name} | EssentialistMakeupStore${page > 1 ? ` | Page ${page}` : ''}`;
  const description = `Explore ${name} at EssentialistMakeupStore. Nationwide shipping in Cameroon, secure online payment, great prices, and courteous support.`;
  const canonical = `https://www.esmakeupstore.com/${categorySlug}${page > 1 ? `?page=${page}` : ''}`;

  return {
    metadataBase: new URL('https://www.esmakeupstore.com'),
    title,
    description: stripHtml(description).slice(0, 300),
    alternates: { canonical },
    robots: { index: true, follow: true },
    openGraph: {
      type: 'website',
      siteName: 'EssentialistMakeupStore',
      url: canonical,
      title,
      description,
      images: [
        {
          url: 'https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg'],
    },
    keywords: [name, 'makeup', 'beauty', 'Cameroon', 'Douala', 'EssentialistMakeupStore'],
  };
}

/* ----------------------- JSON-LD ----------------------- */
function StructuredData({ categorySlug, categoryName }) {
  const url = `https://www.esmakeupstore.com/${categorySlug}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.esmakeupstore.com/' },
      { '@type': 'ListItem', position: 2, name: categoryName || 'Category', item: url },
    ],
  };

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName || 'Category'} - EssentialistMakeupStore`,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: 'EssentialistMakeupStore',
      url: 'https://www.esmakeupstore.com/',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
    </>
  );
}

/* ----------------------- Page ----------------------- */
export default async function CategoryPage({ params, searchParams }) {
  const categorySlug = params?.category;
  const page = Number(searchParams?.page || 1);
  const categoryId = parseIdFromSlug(categorySlug);
  const categoryName = parseNameFromSlug(categorySlug);

  if (!categoryId) return notFound();

  const [categories, subcats] = await Promise.all([
    fetchCategories(),
    fetchSubCategoriesOfCategory(categoryId),
  ]);

  const category = categories.find((c) => String(c?._id) === String(categoryId));
  if (!category) return notFound();

  // Try direct category listing
  let { products, totalCount } = await fetchProductsByCategory({ categoryId, page });

  // Fallback: aggregate across subcategories if nothing returns
  if (products.length === 0 && subcats.length > 0) {
    const agg = await fetchProductsAcrossSubcategories({ categoryId, subcats, page });
    products = agg.products;
    totalCount = agg.totalCount;
  }

  const totalPages = Math.max(1, Math.ceil((Number(totalCount) || 0) / PAGE_SIZE));
  const hasMore = page < totalPages;
  const nextHref = hasMore ? `/${categorySlug}?page=${page + 1}` : null;

  return (
    <>
      <StructuredData categorySlug={categorySlug} categoryName={categoryName} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .e-hero {
            background: linear-gradient(135deg, #fff 0%, #f8fafc 40%, #f1f5f9 100%);
            border: 1px solid #e2e8f0;
          }
          .e-card {
            transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          .e-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(2, 6, 23, 0.12);
          }
          .e-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, rgba(93, 92, 222, 0.05), rgba(236, 254, 255, 0.1));
            opacity: 0;
            transition: opacity .3s ease;
          }
          .e-card:hover::before {
            opacity: 1;
          }
          .e-subcat-card {
            transition: all .3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          }
          .e-subcat-card:hover {
            transform: translateY(-6px) scale(1.02);
            box-shadow: 0 25px 50px rgba(93, 92, 222, 0.15);
          }
          .e-subcat-card::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, rgba(93, 92, 222, 0.08), rgba(14, 116, 144, 0.05));
            opacity: 0;
            transition: opacity .3s ease;
          }
          .e-subcat-card:hover::after {
            opacity: 1;
          }
          .e-subcat-image {
            transition: transform .3s ease;
          }
          .e-subcat-card:hover .e-subcat-image {
            transform: scale(1.05);
          }
          .e-chip {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background:#ecfeff;
            color:#0e7490;
            border:1px solid #a5f3fc;
            padding: 4px 10px;
            border-radius: 999px;
            font-size: 12px;
            font-weight: 600;
          }
          .e-gradient-text {
            background: linear-gradient(135deg, #5d5cde 0%, #0e7490 100%);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        `,
        }}
      />

      <main className="container mx-auto px-4 pb-10">
        {/* Hero */}
        <section className="e-hero rounded-2xl mt-6 p-6 md:p-8 bg-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {category?.name || categoryName || 'Category'}
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Shop premium makeup at great prices. Nationwide shipping in Cameroon. One hundred percent secure online payment and friendly support.
              </p>
            </div>
            <div className="e-chip">
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 12a9 9 0 1118 0A9 9 0 013 12zm9-7a7 7 0 100 14A7 7 0 0012 5zm1 3v4l3 2-.8 1.2L11 13V8h2z"/></svg>
              Fast & Reliable Shipping
            </div>
          </div>
        </section>

        {/* Subcategories - Now Big and Beautiful */}
        <section aria-label="Subcategories" className="mt-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold e-gradient-text">Browse Subcategories</h2>
              <p className="text-slate-600 mt-1">Discover our curated collections</p>
            </div>
            {subcats.length > 0 && (
              <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                {subcats.length} collections
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcats.length === 0 ? (
              <div className="col-span-full border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-slate-400" aria-hidden="true">
                    <path fill="currentColor" d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm2 0v11h14V7h-2.586l-2-2H9.586l-2 2H5z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-700 mb-2">No subcategories found</h3>
                <p className="text-slate-500">We're working on adding more collections for this category.</p>
              </div>
            ) : (
              subcats.map((s) => {
                const href = `/${valideURLConvert(category.name)}-${category._id}/${valideURLConvert(s.name)}-${s._id}`;
                return (
                  <Link
                    key={s._id}
                    href={href}
                    className="e-subcat-card block bg-white border-2 border-slate-100 rounded-2xl overflow-hidden group"
                  >
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s?.image || '/placeholder.png'}
                        alt={s?.name || 'Subcategory'}
                        className="e-subcat-image w-full h-48 object-cover bg-gradient-to-br from-slate-50 to-slate-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <svg width="16" height="16" viewBox="0 0 24 24" className="text-slate-600" aria-hidden="true">
                          <path fill="currentColor" d="M7 7h10v2l4-3-4-3v2H5v6h2V7zm10 10H7v-2l-4 3 4 3v-2h12v-6h-2v4z"/>
                        </svg>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {s?.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500 font-medium">Explore Collection</span>
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                          <svg width="12" height="12" viewBox="0 0 24 24" className="text-white" aria-hidden="true">
                            <path fill="currentColor" d="M7 7h10v2l4-3-4-3v2H5v6h2V7zm10 10H7v-2l-4 3 4 3v-2h12v-6h-2v4z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Products */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold e-gradient-text">Featured Products</h2>
              <p className="text-slate-600 mt-1">Premium quality makeup essentials</p>
            </div>
            {products.length > 0 && (
              <span className="text-sm text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                {Math.min(products.length, PAGE_SIZE)} of {totalCount} products
              </span>
            )}
          </div>

          {products.length === 0 ? (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" className="text-slate-400" aria-hidden="true">
                  <path fill="currentColor" d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm2 0v11h14V7h-2.586l-2-2H9.586l-2 2H5z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-slate-700 mb-2">No products found</h3>
              <p className="text-slate-500 mb-4">We're working on adding more products to this category.</p>
              {subcats.length > 0 && (
                <p className="text-sm text-indigo-600">Try browsing our subcategories above for more options.</p>
              )}
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" role="list">
                {products.map((p, i) => (
                  <li key={`${p?._id}-cat-${i}`}>
                    <CardProduct data={p} />
                  </li>
                ))}
              </ul>

              {hasMore && (
                <div className="text-center mt-10">
                  <Link
                    href={nextHref}
                    className="inline-flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Load More Products
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="currentColor" d="M7 10l5 5 5-5z"/>
                    </svg>
                  </Link>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}