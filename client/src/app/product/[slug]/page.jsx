// // client/src/app/product/[slug]/page.jsx
// import { Suspense } from "react";
// import Image from "next/image";
// import dynamic from "next/dynamic";
// import { cacheLife, cacheTag } from "next/cache";
// import { notFound } from "next/navigation";
// import Divider from "../../../components/Divider";
// import AddToCartButton from "../../../components/AddToCartButton";
// import ProductRecommendations from "../../../components/ProductRecommendations";
// import { DisplayPriceInRupees } from "../../../utils/DisplayPriceInRupees";
// import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
// import SummaryApi, { apiFetch } from "../../../common/SummaryApi";

// const ProductGallery = dynamic(() => import("./ProductGallery.client"), {
//   loading: () => <ImageSkeleton />,
// });

// const RatingBlock = dynamic(() => import("./RatingBlock.client"), {
//   loading: () => <RatingSkeleton />,
// });

// function extractProductId(slug) {
//   if (!slug) return null;
//   const parts = slug.split("-");
//   return parts.at(-1);
// }

// function stripHtml(html) {
//   if (!html) return "";
//   return html.replace(/<[^>]*>?/gm, "").trim();
// }

// async function getProduct(productId) {
//   "use cache";
//   cacheTag(`product:${productId}`);
//   cacheLife("hours");

//   const response = await apiFetch(SummaryApi.getProductDetails.url, {
//     method: SummaryApi.getProductDetails.method.toUpperCase(),
//     body: { productId },
//   });

//   return response?.data ?? null;
// }

// async function getRatingsSnapshot(productId) {
//   "use cache";
//   cacheTag(`product:ratings:${productId}`);
//   cacheLife("minutes");

//   const response = await apiFetch(SummaryApi.ratingsGet.url(productId), {
//     method: SummaryApi.ratingsGet.method.toUpperCase(),
//   });

//   return (
//     response?.data ?? {
//       average: 0,
//       count: 0,
//       myRating: null,
//     }
//   );
// }

// export async function generateMetadata(props) {
//   const params = await props.params;
//   const productId = extractProductId(params?.slug);

//   if (!productId) {
//     return {
//       title: "Product not found",
//       description: "Invalid product URL.",
//       robots: { index: false, follow: false },
//     };
//   }

//   const product = await getProduct(productId);
//   if (!product) {
//     return {
//       title: "Product not found",
//       description: "Product could not be found.",
//       robots: { index: false, follow: true },
//     };
//   }

//   const rating = await getRatingsSnapshot(productId);
//   const name = product.name ?? "Product";
//   const description =
//     stripHtml(product.description) ||
//     `Buy ${name} at Essentialist Makeup Store.`;
//   const heroImage = Array.isArray(product.image)
//     ? product.image[0]
//     : product.image;
//   const slug = params.slug;
//   const canonical = `https://www.esmakeupstore.com/product/${slug}`;

//   return {
//     metadataBase: new URL("https://www.esmakeupstore.com"),
//     title: name,
//     description,
//     keywords: [
//       name,
//       "makeup",
//       "beauty",
//       "cosmetics",
//       "Essentialist Makeup Store",
//       "Cameroon makeup",
//       "Douala beauty",
//     ].filter(Boolean),
//     alternates: { canonical },
//     openGraph: {
//       type: "website",
//       siteName: "Essentialist Makeup Store",
//       url: canonical,
//       title: name,
//       description,
//       images: heroImage
//         ? [{ url: heroImage, width: 1200, height: 630, alt: name }]
//         : [],
//       locale: "en_US",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: name,
//       description,
//       images: heroImage ? [heroImage] : [],
//     },
//     robots: { index: true, follow: true },
//     other: {
//       "x-aggregate-rating": rating?.average ?? 0,
//       "x-rating-count": rating?.count ?? 0,
//     },
//   };
// }

// const tabularStyles = `
//   .tabular-content {
//     white-space: pre-wrap;
//     font-family: 'Courier New', monospace;
//     line-height: 1.8;
//     background-color: #f8fafc;
//     padding: 12px;
//     border-radius: 0.375rem;
//     border: 1px solid #e2e8f0;
//     font-size: 14px;
//     tab-size: 4;
//     overflow-x: auto;
//     margin: 8px 0;
//   }
//   .tabular-content::selection { background-color: #bfdbfe; }
//   .product-description-content { line-height: 1.6; }
//   .product-description-content p { margin-bottom: 0.5rem; }
//   .product-description-content ul,
//   .product-description-content ol {
//     margin-left: 1.5rem;
//     margin-bottom: 0.5rem;
//   }
//   .product-description-content h1,
//   .product-description-content h2,
//   .product-description-content h3,
//   .product-description-content h4,
//   .product-description-content h5,
//   .product-description-content h6 {
//     font-weight: 600;
//     margin-bottom: 0.5rem;
//     margin-top: 1rem;
//   }
//   .zoomable { cursor: zoom-in; }
//   .zoomable:focus {
//     outline: 2px solid #38bdf8;
//     outline-offset: 2px;
//   }
//   .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
//   .scrollbar-none::-webkit-scrollbar { display: none; }
//   .thumb-item:focus-visible {
//     outline: 2px solid #4f46e5;
//     outline-offset: 3px;
//     border-radius: 6px;
//   }
// `;

// function ImageSkeleton() {
//   return <div className="aspect-square rounded-lg bg-slate-200 animate-pulse" />;
// }

// function TextSkeleton({ width = "100%", height = "h-4" }) {
//   return (
//     <div
//       className={`bg-slate-200/80 rounded ${height} animate-pulse`}
//       style={{ width }}
//     />
//   );
// }

// function RatingSkeleton() {
//   return (
//     <div className="mt-2 flex items-center gap-3">
//       <div className="h-4 w-24 rounded bg-slate-200 animate-pulse" />
//       <div className="h-3 w-16 rounded bg-slate-200 animate-pulse" />
//     </div>
//   );
// }

// function RecommendationsSkeleton() {
//   return (
//     <section className="container mx-auto px-4 pb-10">
//       <TextSkeleton width="40%" height="h-6" />
//       <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
//         {[...Array(4)].map((_, idx) => (
//           <div key={idx} className="space-y-2">
//             <ImageSkeleton />
//             <TextSkeleton width="80%" />
//             <TextSkeleton width="60%" />
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function StructuredData({ product, slug, rating }) {
//   if (!product) return null;

//   const url = `https://www.esmakeupstore.com/product/${slug}`;
//   const images = Array.isArray(product.image)
//     ? product.image.filter(Boolean)
//     : [product.image].filter(Boolean);

//   const offerPrice = pricewithDiscount(
//     product.price ?? 0,
//     product.discount ?? 0
//   );

//   const offers = {
//     "@type": "Offer",
//     priceCurrency: "XAF",
//     price: String(offerPrice),
//     availability:
//       product.stock && product.stock > 0
//         ? "https://schema.org/InStock"
//         : "https://schema.org/OutOfStock",
//     url,
//   };

//   const productJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: product.name,
//     description: stripHtml(product.description),
//     image: images,
//     sku: product._id ?? product.sku,
//     brand: product.brand
//       ? { "@type": "Brand", name: product.brand }
//       : undefined,
//     offers,
//     ...(rating?.count
//       ? {
//           aggregateRating: {
//             "@type": "AggregateRating",
//             ratingValue: String(rating.average ?? 0),
//             reviewCount: String(rating.count ?? 0),
//           },
//         }
//       : {}),
//   };

//   const breadcrumbJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: [
//       {
//         "@type": "ListItem",
//         position: 1,
//         name: "Home",
//         item: "https://www.esmakeupstore.com/",
//       },
//       {
//         "@type": "ListItem",
//         position: 2,
//         name: "Products",
//         item: "https://www.esmakeupstore.com/product",
//       },
//       {
//         "@type": "ListItem",
//         position: 3,
//         name: product.name,
//         item: url,
//       },
//     ],
//   };

//   const websiteJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "WebSite",
//     name: "Essentialist Makeup Store",
//     url: "https://www.esmakeupstore.com/",
//     potentialAction: {
//       "@type": "SearchAction",
//       target: "https://www.esmakeupstore.com/search?q={search_term_string}",
//       "query-input": "required name=search_term_string",
//     },
//   };

//   const organizationJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: "Essentialist Makeup Store",
//     url: "https://www.esmakeupstore.com/",
//     sameAs: [
//       "https://www.facebook.com/Essentialistmakeupstore",
//       "https://www.tiktok.com/@essentialistmakeupstore",
//       "https://www.instagram.com/Essentialistmakeupstore",
//     ],
//     address: {
//       "@type": "PostalAddress",
//       addressCountry: "CM",
//       addressLocality: "Douala",
//     },
//     contactPoint: {
//       "@type": "ContactPoint",
//       telephone: "+237655225569",
//       contactType: "customer service",
//       availableLanguage: ["en", "fr"],
//     },
//   };

//   const payload = [
//     productJsonLd,
//     breadcrumbJsonLd,
//     websiteJsonLd,
//     organizationJsonLd,
//   ];

//   return (
//     <>
//       {payload.map((entry, idx) => (
//         <script
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
//           key={`ld-${idx}`}
//           type="application/ld+json"
//         />
//       ))}
//     </>
//   );
// }

// export default async function ProductDisplayPage(props) {
//   const params = await props.params;
//   const slug = params?.slug;
//   const productId = extractProductId(slug);

//   if (!productId) return notFound();

//   const productData = await getProduct(productId);
//   if (!productData) return notFound();

//   const ratingSnapshot = await getRatingsSnapshot(productId);
//   const images = Array.isArray(productData.image)
//     ? productData.image.filter(Boolean)
//     : [productData.image].filter(Boolean);

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: tabularStyles }} />
//       <StructuredData
//         product={productData}
//         slug={slug}
//         rating={ratingSnapshot}
//       />

//       <section className="container mx-auto grid gap-6 p-4 text-slate-900 font-medium lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)] lg:gap-10">
//         <div>
//           <ProductGallery images={images} productName={productData.name} />

//           <article className="my-4 hidden gap-3 rounded-lg border border-slate-200 p-4 shadow-sm transition-shadow hover:shadow-md lg:grid">
//             <DescriptionBlock product={productData} />
//           </article>
//         </div>

//         <aside className="space-y-6 rounded-lg bg-white p-4 shadow-sm lg:pl-7">
//           <Badge />
//           <header>
//             <h1 className="text-xl font-semibold lg:text-2xl">
//               {productData.name}
//             </h1>
//             <p className="text-sm text-slate-600">{productData.unit}</p>
//           </header>

//           <RatingSummary
//             ratingSnapshot={ratingSnapshot}
//             productId={productId}
//           />

//           <Divider />

//           <PriceBlock
//             label="Bulk Price"
//             amount={pricewithDiscount(
//               productData.bulkPrice ?? productData.price,
//               productData.discount ?? 0
//             )}
//             baseAmount={productData.price}
//             discount={productData.discount}
//           />

//           <PriceBlock
//             label="Price"
//             amount={pricewithDiscount(
//               productData.price,
//               productData.discount ?? 0
//             )}
//             baseAmount={productData.price}
//             discount={productData.discount}
//           />

//           {productData.stock === 0 ? (
//             <p className="text-lg font-semibold text-rose-600">Out of stock</p>
//           ) : (
//             <div className="pt-2">
//               <AddToCartButton data={productData} />
//             </div>
//           )}

//           <WhyShopWithUs />

//           <article className="grid gap-3 lg:hidden">
//             <DescriptionBlock product={productData} />
//           </article>
//         </aside>
//       </section>

//       <Suspense fallback={<RecommendationsSkeleton />}>
//         <ProductRecommendations
//           currentProductId={productId}
//           currentProductData={productData}
//         />
//       </Suspense>
//     </>
//   );
// }

// function Badge() {
//   return (
//     <span className="inline-flex rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
//       10 Minutes
//     </span>
//   );
// }

// function RatingSummary({ ratingSnapshot, productId }) {
//   const average = Number(ratingSnapshot?.average ?? 0).toFixed(2);
//   const count = ratingSnapshot?.count ?? 0;

//   return (
//     <div>
//       <div className="flex items-center gap-2 text-sm text-slate-700">
//         <span className="text-lg font-semibold text-slate-900">{average}</span>
//         <span>/ 5</span>
//         <span className="text-slate-500">
//           ({count} {count === 1 ? "rating" : "ratings"})
//         </span>
//       </div>
//       <RatingBlock productId={productId} />
//     </div>
//   );
// }

// function PriceBlock({ label, amount, baseAmount, discount }) {
//   const formattedAmount = DisplayPriceInRupees(amount);
//   const formattedBase = DisplayPriceInRupees(baseAmount);

//   return (
//     <section className="space-y-2">
//       <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
//         {label}
//       </h2>
//       <div className="flex flex-wrap items-center gap-3">
//         <span className="rounded border border-emerald-600 bg-emerald-50 px-4 py-2 text-lg font-semibold text-emerald-900 lg:text-xl">
//           {formattedAmount}
//         </span>
//         {discount > 0 && (
//           <>
//             <span className="text-base text-slate-500 line-through">
//               {formattedBase}
//             </span>
//             <span className="text-lg font-bold text-emerald-600 lg:text-2xl">
//               {discount}%{" "}
//               <span className="text-base font-medium text-slate-900">
//                 Discount
//               </span>
//             </span>
//           </>
//         )}
//       </div>
//     </section>
//   );
// }

// function DescriptionBlock({ product }) {
//   return (
//     <>
//       <section>
//         <h3 className="font-semibold">Description</h3>
//         <div
//           className="product-description-content text-justify text-base text-slate-900"
//           dangerouslySetInnerHTML={{
//             __html: product.description ?? "",
//           }}
//         />
//       </section>

//       {product.specifications && (
//         <section>
//           <h3 className="font-semibold">Product Specifications</h3>
//           <div className="tabular-content">{product.specifications}</div>
//         </section>
//       )}

//       {product.unit && (
//         <section>
//           <h3 className="font-semibold">Unit</h3>
//           <p className="text-base text-slate-800">{product.unit}</p>
//         </section>
//       )}

//       {product?.more_details &&
//         typeof product.more_details === "object" &&
//         Object.entries(product.more_details).map(([key, value]) => (
//           <section key={key}>
//             <h3 className="font-semibold">{key}</h3>
//             <p className="text-base text-slate-800">{value}</p>
//           </section>
//         ))}
//     </>
//   );
// }

// function WhyShopWithUs() {
//   const perks = [
//     {
//       title: "Super-fast Delivery",
//       description:
//         "Get your order delivered from dark stores near you in record time.",
//       icon: "/assets/minute_delivery.jpeg",
//     },
//     {
//       title: "Best Prices and Offers",
//       description:
//         "Enjoy manufacturer-direct savings across thousands of beauty essentials.",
//       icon: "/assets/Best_Prices_Offers.png",
//     },
//     {
//       title: "Wide Assortment",
//       description:
//         "Browse over five thousand products spanning foundation, lipstick, eyes, and more.",
//       icon: "/assets/Wide_Assortment.avif",
//     },
//   ];

//   return (
//     <section className="space-y-5">
//       <h2 className="text-lg font-semibold">
//         Why shop from Essentialist Makeup Store?
//       </h2>
//       {perks.map((perk) => (
//         <div key={perk.title} className="flex items-center gap-4">
//           <Image
//             src={perk.icon}
//             alt={perk.title}
//             width={80}
//             height={80}
//             loading="lazy"
//             decoding="async"
//             className="h-20 w-20 rounded-lg object-cover"
//           />
//           <div className="text-sm text-slate-700">
//             <h3 className="font-semibold text-slate-900">{perk.title}</h3>
//             <p>{perk.description}</p>
//           </div>
//         </div>
//       ))}
//     </section>
//   );
// }






import { Suspense } from "react";
import { notFound } from "next/navigation";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import ProductDisplayClient from "./ProductDisplayClient";
import ProductRecommendations from "../../../components/ProductRecommendations";
import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
import {
  fetchProduct,
  fetchRatings,
  productQueryOptions,
  ratingQueryOptions,
} from "./queries";

function extractProductId(slug) {
  if (!slug) return null;
  const parts = slug.split("-");
  return parts.at(-1);
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
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

  const offerPrice = pricewithDiscount(
    product.price ?? 0,
    product.discount ?? 0
  );

  const offers = {
    "@type": "Offer",
    priceCurrency: "XAF",
    price: String(offerPrice),
    availability:
      product.stock && product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    url,
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: stripHtml(product.description),
    image: images,
    sku: product._id ?? product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : undefined,
    offers,
    ...(rating?.count
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: String(rating.average ?? 0),
            reviewCount: String(rating.count ?? 0),
          },
        }
      : {}),
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
      target: "https://www.esmakeupstore.com/search?q={search_term_string}",
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
      addressCountry: "CM",
      addressLocality: "Douala",
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
          key={`ld-${idx}`}
          type="application/ld+json"
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
    productData = await queryClient.fetchQuery(productQueryOptions(productId));
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