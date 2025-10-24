"use client";
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Head from "next/head";

// ====== CONFIG ======
// Toggle category blocks if you still want “New” and “New & Hot” sections.
const USE_CATEGORY_BLOCKS = true;
const NEW_CATEGORY_ID = "68055442764e6d332bd162c8";
const NEW_HOT_CATEGORY_ID = "6806b355bca41016c4406edb";

// Page constants / copy (from your site content)
const STORE_NAME = "Essentialist Makeup Store";
const PAGE_PATH = "https://www.esmakeupstore.com/new-arrival";
const HERO_TITLE = "New Makeup Arrivals & Hot Brands in Cameroon";
const HERO_SUB = "Discover the Latest Makeup Brands and Beauty Trends in Cameroon";
const HERO_DESC =
  "Shop the newest arrivals and hottest makeup brands in Cameroon at Essentialist Makeup Store. From NYX and LA Girl to international bestsellers, find trending foundations, lipsticks, palettes, and more -- all at unbeatable FCFA prices!";
const CONTACT_COPY =
  "Have questions about our new arrivals or trending makeup brands? Want to order the hottest beauty products in Cameroon? Connect with our expert team for authentic NYX, LA Girl, and top global brands at the best prices in FCFA.";

// ====== API UTIL ======
export const baseURL = process.env.NEXT_PUBLIC_API_URL;

const SummaryApi = {
  getProduct: { url: "/api/product/get", method: "post" },
  getProductByCategory: { url: "/api/product/get-product-by-category", method: "post" },
  searchProduct: { url: "/api/product/search-product", method: "post" },
};

// Simple fetch wrapper
async function apiFetch(path, method = "GET", body) {
  const res = await fetch(`${baseURL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${method} ${path} failed: ${res.status} ${text}`);
  }
  return res.json();
}

// ====== HELPERS ======
// Shapes we expect from your product objects (adjust field names if needed):
// {
//   _id, name, image: [url], price, discount, bulkPrice, unit, brand?, createdAt, category[], subCategory[]
// }
function formatPriceXAF(value) {
  if (value == null || isNaN(value)) return "";
  try {
    return new Intl.NumberFormat("fr-CM", {
      style: "currency",
      currency: "XAF",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${Number(value).toLocaleString()} FCFA`;
  }
}

function getDiscountedPrice(price, discount) {
  if (!price) return null;
  if (!discount || Number(discount) <= 0) return Number(price);
  const p = Number(price);
  const d = Math.min(100, Math.max(0, Number(discount)));
  return Math.round(p - (p * d) / 100);
}

function uniqueBrands(products) {
  const set = new Set();
  products.forEach((p) => {
    if (p?.brand) set.add(p.brand);
  });
  return Array.from(set);
}

// ====== SKELETON ======
function ProductCardSkeleton() {
  return (
    <div className="border rounded-lg p-3 animate-pulse bg-white">
      <div className="w-full h-48 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
      <div className="flex items-center gap-2">
        <div className="h-6 w-24 bg-gray-200 rounded" />
        <div className="h-6 w-16 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ====== PRODUCT CARD ======
function ProductCard({ product }) {
  const mainImg = Array.isArray(product?.image) ? product.image[0] : product?.image;
  const discounted = getDiscountedPrice(product?.price, product?.discount);
  const hasDiscount = discounted && Number(discounted) !== Number(product?.price);

  return (
    <a
      href={`/product/${product?._id}`}
      className="group border rounded-lg p-3 bg-white hover:shadow-md transition"
      title={product?.name}
    >
      <div className="w-full aspect-[4/5] bg-white rounded overflow-hidden flex items-center justify-center">
        {mainImg ? (
          <img
            src={mainImg}
            alt={product?.name || "Product"}
            loading="lazy"
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full bg-gray-100" />
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-sm font-semibold line-clamp-2">{product?.name}</h3>
        {product?.brand && (
          <p className="text-xs text-gray-500 mt-1 uppercase">{product.brand}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {hasDiscount ? (
            <>
              <span className="text-pink-700 font-bold">
                {formatPriceXAF(discounted)}
              </span>
              <span className="text-gray-400 line-through text-sm">
                {formatPriceXAF(product?.price)}
              </span>
              {product?.discount ? (
                <span className="text-xs text-white bg-pink-600 px-2 py-0.5 rounded">
                  -{Number(product.discount)}%
                </span>
              ) : null}
            </>
          ) : (
            <span className="text-neutral-900 font-bold">{formatPriceXAF(product?.price)}</span>
          )}
        </div>
      </div>
    </a>
  );
}

// ====== FILTER BAR ======
function FiltersBar({ allProducts, onApply }) {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState("");
  const [minP, setMinP] = useState("");
  const [maxP, setMaxP] = useState("");
  const [sort, setSort] = useState("newest"); // newest | priceLow | priceHigh | discount

  const brands = useMemo(() => uniqueBrands(allProducts), [allProducts]);

  const apply = () => {
    onApply({ q, brand, min: minP, max: maxP, sort });
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Enter") apply();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [q, brand, minP, maxP, sort]);

  return (
    <div className="bg-white border rounded-lg p-3 md:p-4 flex flex-col md:flex-row gap-3 md:items-end">
      <div className="flex-1">
        <label className="text-sm font-medium">Search</label>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search new arrivals (e.g., NYX, foundation)"
          className="w-full mt-1 bg-pink-50 p-2 rounded border outline-none focus:border-pink-300"
        />
      </div>
      <div className="min-w-[160px]">
        <label className="text-sm font-medium">Brand</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full mt-1 bg-pink-50 p-2 rounded border"
        >
          <option value="">All</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <div>
          <label className="text-sm font-medium">Min Price</label>
          <input
            type="number"
            value={minP}
            onChange={(e) => setMinP(e.target.value)}
            className="w-full mt-1 bg-pink-50 p-2 rounded border"
            placeholder="0"
            min="0"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Max Price</label>
          <input
            type="number"
            value={maxP}
            onChange={(e) => setMaxP(e.target.value)}
            className="w-full mt-1 bg-pink-50 p-2 rounded border"
            placeholder="100000"
            min="0"
          />
        </div>
      </div>
      <div className="min-w-[180px]">
        <label className="text-sm font-medium">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full mt-1 bg-pink-50 p-2 rounded border"
        >
          <option value="newest">Newest</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="discount">Best Deals</option>
        </select>
      </div>
      <button
        onClick={apply}
        className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 py-2 rounded"
      >
        Apply
      </button>
    </div>
  );
}

// ====== MAIN PAGE ======
export default function NewArrivalPage() {
  const [initialProducts, setInitialProducts] = useState([]);
  const [newCatProducts, setNewCatProducts] = useState([]);
  const [hotCatProducts, setHotCatProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Infinite scroll state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feed, setFeed] = useState([]);
  const [fetchingMore, setFetchingMore] = useState(false);

  // Active filters
  const [activeFilters, setActiveFilters] = useState({
    q: "",
    brand: "",
    min: "",
    max: "",
    sort: "newest",
  });

  const observerRef = useRef(null);

  // Build payloads according to your API contracts. If your get endpoint is different, tweak here.
  const fetchPage = useCallback(
    async (pageNo, filters) => {
      const payload = {
        // Assume your backend allows pagination and sorting by createdAt.
        limit: 24,
        page: pageNo,
        sortBy: filters?.sort === "newest" ? "createdAt" : undefined,
        sortOrder:
          filters?.sort === "newest"
            ? "desc"
            : filters?.sort === "priceLow"
            ? "asc:price"
            : filters?.sort === "priceHigh"
            ? "desc:price"
            : filters?.sort === "discount"
            ? "desc:discount"
            : "desc",
        q: filters?.q || undefined,
        brand: filters?.brand || undefined,
        minPrice: filters?.min ? Number(filters.min) : undefined,
        maxPrice: filters?.max ? Number(filters.max) : undefined,
        // Optional: filter only products created recently (e.g., last 45 days)
        // recentDays: 45,
      };

      // If you have a dedicated endpoint for "recent", swap to it. Otherwise use get + sort.
      const res = await apiFetch(SummaryApi.getProduct.url, "POST", payload);
      // Expected shape: { success, data: { products: [], hasMore } } or similar.
      // Adjust mapping if your API returns differently.
      const products = res?.data?.products || res?.data || [];
      const more =
        typeof res?.data?.hasMore !== "undefined"
          ? Boolean(res?.data?.hasMore)
          : products.length >= 24;
      return { products, hasMore: more };
    },
    []
  );

  // Initial load: recent feed + optional category blocks
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        setLoading(true);
        const [{ products, hasMore }] = await Promise.all([fetchPage(1, activeFilters)]);
        if (cancelled) return;

        setInitialProducts(products);
        setFeed(products);
        setHasMore(hasMore);
        setPage(1);

        if (USE_CATEGORY_BLOCKS) {
          // Fetch “New” category
          apiFetch(SummaryApi.getProductByCategory.url, "POST", {
            categoryId: NEW_CATEGORY_ID,
            limit: 16,
            page: 1,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
            .then((r) => {
              const p = r?.data?.products || r?.data || [];
              if (!cancelled) setNewCatProducts(p);
            })
            .catch(() => {});

          // Fetch “New & Hot” category
          apiFetch(SummaryApi.getProductByCategory.url, "POST", {
            categoryId: NEW_HOT_CATEGORY_ID,
            limit: 16,
            page: 1,
            sortBy: "createdAt",
            sortOrder: "desc",
          })
            .then((r) => {
              const p = r?.data?.products || r?.data || [];
              if (!cancelled) setHotCatProducts(p);
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters
  const onApplyFilters = async (filters) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      const { products, hasMore } = await fetchPage(1, filters);
      setFeed(products);
      setHasMore(hasMore);
      setPage(1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = observerRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !fetchingMore) {
          try {
            setFetchingMore(true);
            const next = page + 1;
            const { products: nextProducts, hasMore: more } = await fetchPage(next, activeFilters);
            setFeed((prev) => [...prev, ...nextProducts]);
            setHasMore(more);
            setPage(next);
          } catch (e) {
            console.error(e);
          } finally {
            setFetchingMore(false);
          }
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [observerRef, hasMore, page, fetchingMore, loading, activeFilters, fetchPage]);

  // SEO JSON-LD (Schema.org)
  // Using WebPage + CollectionPage + OfferCatalog
  const year = new Date().getFullYear();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["WebPage", "CollectionPage"],
    name: "New & Hot Makeup Brands in Cameroon",
    url: PAGE_PATH,
    description:
      "Explore the latest and hottest makeup brands and beauty products in Cameroon. Shop trending NYX, LA Girl and more at Essentialist Makeup Store.",
    publisher: {
      "@type": "Organization",
      name: STORE_NAME,
    },
    mainEntity: {
      "@type": "OfferCatalog",
      name: "New Arrivals",
      itemListElement: (feed || []).slice(0, 20).map((p, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Product",
          name: p?.name,
          image: Array.isArray(p?.image) ? p.image : p?.image ? [p.image] : [],
          brand: p?.brand
            ? { "@type": "Brand", name: p.brand }
            : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "XAF",
            price: String(getDiscountedPrice(p?.price, p?.discount) ?? p?.price ?? ""),
            url: `${process?.env?.NEXT_PUBLIC_SITE_URL || "https://www.esmakeupstore.com"}/product/${p?._id}`,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white pb-16">
      <Head>
        <title>{`NYX & L.A. Girl: Best New Makeup of ${year} | Trending Beauty Essentials`}</title>
        <meta
          name="description"
          content="Explore the latest and hottest makeup brands and beauty products in Cameroon. Shop trending foundations, lipsticks, eyeshadows, and more from NYX, LA Girl, and top brands at Essentialist Makeup Store. New arrivals and must-have cosmetics with fast delivery in FCFA."
        />
        <meta
          name="keywords"
          content="new makeup Cameroon, trending makeup brands, hot makeup Cameroon, beauty trends, NYX new arrivals, LA Girl new products, best makeup brands Cameroon, Essentialist Makeup Store, Douala makeup shop, FCFA makeup, new beauty Cameroon, hottest makeup deals, buy cosmetics Cameroon, trending foundation Douala, latest lipsticks Cameroon, hot beauty brands Africa"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={PAGE_PATH} />
        <meta property="og:title" content={`New & Hot Makeup Brands in Cameroon | Trending Beauty Products ${year}`} />
        <meta
          property="og:description"
          content="Discover the latest makeup and hottest beauty brands in Cameroon. Shop new arrivals from NYX, LA Girl, and global brands at Essentialist Makeup Store."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={STORE_NAME} />
        <meta property="og:url" content={PAGE_PATH} />
        <meta
          property="og:image"
          content="https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg"
        />
        <meta property="og:image:alt" content="New & Hot Makeup Cameroon" />
        <meta name="twitter:title" content={`New & Hot Makeup Brands in Cameroon | Trending Beauty Products ${year}`} />
        <meta
          name="twitter:description"
          content="Shop the latest and hottest makeup brands in Cameroon. Explore trending products from NYX, LA Girl & more at Essentialist Makeup Store."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content="https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      {/* Hero */}
      {/* <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-700 tracking-tight mb-4">
          {HERO_TITLE}
        </h1>
        <h2 className="text-lg md:text-2xl text-gray-700 font-bold mb-3">{HERO_SUB}</h2>
        <p className="text-pink-600 max-w-2xl mx-auto font-medium leading-relaxed">{HERO_DESC}</p>
      </div> */}

      {/* Filters */}
      <div className="container mx-auto px-4">
        <FiltersBar allProducts={initialProducts} onApply={onApplyFilters} />
      </div>

      {/* Main Feed */}
      <section className="container mx-auto px-4 mt-6">
        <h3 className="text-xl font-bold text-neutral-800 mb-3">All New Arrivals</h3>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={`s-${i}`} />
            ))}
          </div>
        ) : feed.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="font-semibold text-neutral-700">No products in this category yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {feed.map((p) => (
                <ProductCard key={p?._id} product={p} />
              ))}
            </div>
            <div ref={observerRef} className="h-12 flex items-center justify-center mt-6">
              {fetchingMore ? <span className="text-sm text-neutral-600">Loading more…</span> : !hasMore ? <span className="text-sm text-neutral-500">End of results</span> : null}
            </div>
          </>
        )}
      </section>

      {/* Optional Category Sections */}
      {USE_CATEGORY_BLOCKS && (
        <>
          <section className="container mx-auto px-4 mt-12">
            <h3 className="text-xl font-bold text-neutral-800 mb-3">New Makeup Arrivals in Cameroon</h3>
            {newCatProducts.length === 0 ? (
              <div className="bg-white border rounded-lg p-6 text-center">
                <p className="text-neutral-700 font-medium">No products in this category yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {newCatProducts.map((p) => (
                  <ProductCard key={p?._id} product={p} />
                ))}
              </div>
            )}
          </section>

          <section className="container mx-auto px-4 mt-10">
            <h3 className="text-xl font-bold text-neutral-800 mb-3">
              New Makeup Arrivals & Hot Brands in Cameroon
            </h3>
            {hotCatProducts.length === 0 ? (
              <div className="bg-white border rounded-lg p-6 text-center">
                <p className="text-neutral-700 font-medium">No products in this category yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {hotCatProducts.map((p) => (
                  <ProductCard key={p?._id} product={p} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}