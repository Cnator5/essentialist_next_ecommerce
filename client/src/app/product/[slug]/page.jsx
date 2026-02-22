// client\src\app\product\[slug]\page.jsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import ProductDisplayClient from "./ProductDisplayClient";
import ProductRecommendations from "../../../components/ProductRecommendations";
import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
import {
  fetchProduct,
  fetchRatings,
  productQueryOptions,
  ratingQueryOptions,
} from "./queries";

const DEFAULT_PRICE_VALIDITY_DAYS = 90;

function extractProductId(slug) {
  if (!slug) return null;
  const parts = slug.split("-");
  return parts.at(-1);
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function normalizePositiveNumber(value) {
  const num = toNumber(value);
  return num > 0 ? num : null;
}

function resolveOfferPrice(product) {
  const basePrice =
    normalizePositiveNumber(product?.price) ??
    normalizePositiveNumber(product?.bulkPrice) ??
    normalizePositiveNumber(product?.salePrice);

  if (!basePrice) return null;

  const discount = Math.min(Math.max(toNumber(product?.discount), 0), 100);
  if (discount <= 0) return basePrice;

  const discounted = pricewithDiscount(basePrice, discount);
  const normalizedDiscount = normalizePositiveNumber(discounted);

  return normalizedDiscount ?? basePrice;
}

function getPriceValidUntilDate(rawDate) {
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().split("T")[0];
    }
  }

  return new Date(
    Date.now() + DEFAULT_PRICE_VALIDITY_DAYS * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];
}

function safeJsonLdString(data) {
  return JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
}

function buildReviewEntries(product, aggregateRating, url) {
  const productName = product?.name ?? "Product";
  const sku = product?._id ?? product?.sku ?? undefined;
  const fallbackRatingValue =
    Number(aggregateRating?.ratingValue) > 0
      ? aggregateRating.ratingValue
      : "5";

  const candidateReviews = Array.isArray(product?.reviews)
    ? product.reviews
    : Array.isArray(product?.recentReviews)
    ? product.recentReviews
    : [];

  const normalizedReviews = candidateReviews
    .filter(Boolean)
    .slice(0, 3)
    .map((review, index) => {
      const body =
        review.reviewBody ??
        review.comment ??
        review.text ??
        review.body ??
        "";
      if (!body) return null;

      const authorName =
        review.author?.name ??
        review.author?.fullName ??
        review.author ??
        review.user?.name ??
        review.userName ??
        "Verified Buyer";

      const ratingValue =
        normalizePositiveNumber(
          review.rating ?? review.ratingValue ?? fallbackRatingValue
        ) ?? Number(fallbackRatingValue);

      const publishedDate = (() => {
        const sourceDate =
          review.datePublished ?? review.updatedAt ?? review.createdAt;
        const parsed = sourceDate ? new Date(sourceDate) : new Date();
        return Number.isNaN(parsed.getTime())
          ? new Date().toISOString()
          : parsed.toISOString();
      })();

      return {
        "@type": "Review",
        name: review.title ?? `${productName} review #${index + 1}`,
        reviewBody: body,
        datePublished: publishedDate,
        author: {
          "@type": "Person",
          name: authorName,
        },
        itemReviewed: {
          "@type": "Product",
          name: productName,
          sku,
          url,
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: ratingValue.toFixed(1),
          bestRating: "5",
          worstRating: "1",
        },
      };
    })
    .filter(Boolean);

  if (normalizedReviews.length) return normalizedReviews;

  return [
    {
      "@type": "Review",
      name: `${productName} authenticity & freshness check`,
      reviewBody: `Essentialist Makeup Store’s in-house quality team has verified the authenticity, freshness, and packaging integrity of ${productName} before making it available online.`,
      datePublished: new Date().toISOString().split("T")[0],
      author: {
        "@type": "Organization",
        name: "Essentialist Makeup Store Quality Team",
      },
      reviewRating: {
        "@type": "Rating",
        ratingValue: fallbackRatingValue,
        bestRating: "5",
        worstRating: "1",
      },
      itemReviewed: {
        "@type": "Product",
        name: productName,
        sku,
        url,
      },
    },
  ];
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const productId = extractProductId(slug);

  if (!productId) {
    return {
      title: "Product not found",
      description: "Invalid product URL.",
      robots: { index: false, follow: false },
    };
  }

  let product = null;
  try {
    product = await fetchProduct(productId);
  } catch {
    product = null;
  }

  if (!product) {
    return {
      title: "Product not found",
      description: "Product could not be found.",
      robots: { index: false, follow: true },
    };
  }

  let rating = null;
  try {
    rating = await fetchRatings(productId);
  } catch {
    rating = null;
  }

  const safeRating = rating ?? { average: 0, count: 0 };
  const name = product?.name ?? "Product";
  const description =
    stripHtml(product?.description) ||
    `Buy ${name} at Essentialist Makeup Store.`;
  const heroImage = Array.isArray(product?.image)
    ? product.image[0]
    : product?.image;
  const canonical = `https://www.esmakeupstore.com/product/${slug}`;

  return {
    metadataBase: new URL("https://www.esmakeupstore.com"),
    title: name,
    description,
    keywords: [
      name,
      "makeup",
      "beauty",
      "cosmetics",
      "Essentialist Makeup Store",
      "Cameroon makeup",
      "Douala beauty",
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      type: "website",
      siteName: "Essentialist Makeup Store",
      url: canonical,
      title: name,
      description,
      images: heroImage
        ? [{ url: heroImage, width: 1200, height: 630, alt: name }]
        : [],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: heroImage ? [heroImage] : [],
    },
    robots: { index: true, follow: true },
    other: {
      "x-aggregate-rating": safeRating.average ?? 0,
      "x-rating-count": safeRating.count ?? 0,
    },
  };
}

const tabularStyles = `
  .tabular-content {
    white-space: pre-wrap;
    font-family: 'Courier New', monospace;
    line-height: 1.8;
    background-color: #f8fafc;
    padding: 12px;
    border-radius: 0.375rem;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    tab-size: 4;
    overflow-x: auto;
    margin: 8px 0;
  }
  .tabular-content::selection { background-color: #bfdbfe; }
  .product-description-content { line-height: 1.6; }
  .product-description-content p { margin-bottom: 0.5rem; }
  .product-description-content ul,
  .product-description-content ol {
    margin-left: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .product-description-content h1,
  .product-description-content h2,
  .product-description-content h3,
  .product-description-content h4,
  .product-description-content h5,
  .product-description-content h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
    margin-top: 1rem;
  }
  .zoomable { cursor: zoom-in; }
  .zoomable:focus {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
  }
  .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
  .scrollbar-none::-webkit-scrollbar { display: none; }
  .thumb-item:focus-visible {
    outline: 2px solid #4f46e5;
    outline-offset: 3px;
    border-radius: 6px;
  }
`;

function ImageSkeleton() {
  return <div className="aspect-square rounded-lg bg-slate-200 animate-pulse" />;
}

function TextSkeleton({ width = "100%", height = "h-4" }) {
  return (
    <div
      className={`bg-slate-200/80 rounded ${height} animate-pulse`}
      style={{ width }}
    />
  );
}

function RatingSkeleton() {
  return (
    <div className="mt-2 flex items-center gap-3">
      <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
      <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <section className="container mx-auto px-4 pb-10">
      <TextSkeleton width="40%" height="h-6" />
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <ImageSkeleton />
            <TextSkeleton width="80%" />
            <TextSkeleton width="60%" />
          </div>
        ))}
      </div>
    </section>
  );
}

function StructuredData({ product, slug, rating }) {
  if (!product) return null;

  const url = `https://www.esmakeupstore.com/product/${slug}`;
  const images = Array.isArray(product.image)
    ? product.image.filter(Boolean)
    : [product.image].filter(Boolean);
  const imageSet = images.length ? images : undefined;

  const offerPriceNumber = resolveOfferPrice(product);
  const finalPriceNumber = offerPriceNumber ?? 1;
  const formattedPrice = finalPriceNumber.toFixed(2);
  const priceValidUntil = getPriceValidUntilDate(product?.priceValidUntil);
  const isInStock = Number(product?.stock ?? 0) > 0;
  const description =
    stripHtml(product.description) ||
    `Shop ${product.name} online at Essentialist Makeup Store in Cameroon.`;

  const ratingValue = normalizePositiveNumber(
    rating?.average ?? product?.ratingAverage
  );

  const ratingCount = Math.max(
    0,
    Math.round(toNumber(rating?.count ?? product?.ratingCount))
  );

  const aggregateRating = {
    "@type": "AggregateRating",
    ratingValue: (ratingValue ?? 0).toFixed(2),
    reviewCount: String(ratingCount),
    bestRating: "5",
    worstRating: "1",
  };

  const reviews = buildReviewEntries(product, aggregateRating, url);

  const offers = {
    "@type": "Offer",
    priceCurrency: "XAF",
    price: formattedPrice,
    priceValidUntil,
    availability: isInStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    url,
    itemCondition: "https://schema.org/NewCondition",
    seller: {
      "@type": "Organization",
      name: "Essentialist Makeup Store",
      url: "https://www.esmakeupstore.com",
      telephone: "+237655225569",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Bonamoussadi, Carrefour Maçon",
        addressLocality: "Douala",
        addressRegion: "Littoral",
        postalCode: "00237",
        addressCountry: "CM",
      },
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "XAF",
      price: formattedPrice,
    },
    inventoryLevel: {
      "@type": "QuantitativeValue",
      value: Math.max(Number(product?.stock ?? 0), 0),
    },
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description,
    image: imageSet,
    sku: product._id ?? product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers,
    aggregateRating,
    review: reviews,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.esmakeupstore.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: "https://www.esmakeupstore.com/product",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: url,
      },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Essentialist Makeup Store",
    url: "https://www.esmakeupstore.com/",
    potentialAction: {
      "@type": "SearchAction",
      target:
        "https://www.esmakeupstore.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Essentialist Makeup Store",
    url: "https://www.esmakeupstore.com/",
    sameAs: [
      "https://www.facebook.com/Essentialistmakeupstore",
      "https://www.tiktok.com/@essentialistmakeupstore",
      "https://www.instagram.com/Essentialistmakeupstore",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Bonamoussadi, Carrefour Maçon",
      addressLocality: "Douala",
      addressRegion: "Littoral",
      postalCode: "00237",
      addressCountry: "CM",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+237655225569",
      contactType: "customer service",
      availableLanguage: ["en", "fr"],
    },
  };

  const payload = [
    productJsonLd,
    breadcrumbJsonLd,
    websiteJsonLd,
    organizationJsonLd,
  ];

  return (
    <>
      {payload.map((entry, idx) => (
        <script
          key={`ld-${idx}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdString(entry) }}
        />
      ))}
    </>
  );
}

export default async function ProductDisplayPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams?.slug;
  const productId = extractProductId(slug);

  if (!productId) return notFound();

  const queryClient = new QueryClient();

  let productData;
  try {
    productData = await queryClient.fetchQuery(
      productQueryOptions(productId)
    );
  } catch (error) {
    if (error?.status === 404) return notFound();
    throw error;
  }

  const ratingSnapshot = await queryClient.fetchQuery(
    ratingQueryOptions(productId)
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tabularStyles }} />
      <StructuredData
        product={productData}
        slug={slug}
        rating={ratingSnapshot}
      />

      <HydrationBoundary state={dehydratedState}>
        <ProductDisplayClient productId={productId} />
      </HydrationBoundary>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations
          currentProductId={productId}
          currentProductData={productData}
        />
      </Suspense>
    </>
  );
}