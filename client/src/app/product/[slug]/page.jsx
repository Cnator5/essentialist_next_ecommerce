// //src/app/product/[slug]/page.jsx
// import Image from "next/image";
// import { notFound } from "next/navigation";
// import Divider from "../../../components/Divider";
// import AddToCartButton from "../../../components/AddToCartButton";
// import ProductRecommendations from "../../../components/ProductRecommendations";
// import { DisplayPriceInRupees } from "../../../utils/DisplayPriceInRupees";
// import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
// import RatingBlock from "./RatingBlock.client";
// import ProductGallery from "./ProductGallery.client";
// import SummaryApi, { apiFetch } from "../../../common/SummaryApi";

// function extractProductId(slug) {
//   if (!slug) return null;
//   const parts = slug.split("-");
//   return parts[parts.length - 1];
// }

// function stripHtml(html) {
//   if (!html) return "";
//   return html.replace(/<[^>]*>?/gm, "").trim();
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
//   .tabular-content::-moz-selection { background-color: #bfdbfe; }
//   .product-description-content { line-height: 1.6; }
//   .product-description-content p { margin-bottom: 0.5rem; }
//   .product-description-content ul, .product-description-content ol {
//     margin-left: 1.5rem; margin-bottom: 0.5rem;
//   }
//   .product-description-content h1, .product-description-content h2,
//   .product-description-content h3, .product-description-content h4,
//   .product-description-content h5, .product-description-content h6 {
//     font-weight: 600; margin-bottom: 0.5rem; margin-top: 1rem;
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
//   return <div className="aspect-square rounded-lg bg-slate-200"></div>;
// }
// function TextSkeleton({ width = "100%", height = "h-4" }) {
//   return <div className={`bg-slate-200 rounded ${height}`} style={{ width }} />;
// }
// function ProductSkeleton() {
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="space-y-4">
//           <ImageSkeleton />
//           <div className="flex space-x-2">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="w-20 h-20 bg-slate-200 rounded-lg"></div>
//             ))}
//           </div>
//         </div>
//         <div className="space-y-6">
//           <div>
//             <TextSkeleton height="h-8" width="80%" />
//             <div className="mt-2 space-y-2">
//               <TextSkeleton height="h-4" width="60%" />
//               <TextSkeleton height="h-4" width="40%" />
//             </div>
//           </div>
//           <div className="border-b pb-6 space-y-3">
//             <TextSkeleton height="h-8" width="30%" />
//             <TextSkeleton height="h-4" width="50%" />
//           </div>
//           <div className="border-b pb-6">
//             <TextSkeleton height="h-6" width="25%" />
//           </div>
//           <div className="border-b pb-6">
//             <div className="w-full h-12 bg-slate-200 rounded-lg"></div>
//           </div>
//           <div className="space-y-3">
//             <TextSkeleton height="h-6" width="30%" />
//             {[...Array(3)].map((_, i) => (
//               <TextSkeleton key={i} height="h-4" />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// async function getProduct(productId) {
//   try {
//     const response = await apiFetch(SummaryApi.getProductDetails.url, {
//       method: SummaryApi.getProductDetails.method.toUpperCase(),
//       body: { productId },
//       cache: "no-store",
//     });
//     return response?.data ?? null;
//   } catch (error) {
//     console.error("getProduct error:", error);
//     return null;
//   }
// }

// async function getRatingsSSR(productId) {
//   try {
//     const response = await apiFetch(SummaryApi.ratingsGet.url(productId), {
//       method: SummaryApi.ratingsGet.method.toUpperCase(),
//       cache: "no-store",
//     });
//     return response?.data || { average: 0, count: 0, myRating: null };
//   } catch (error) {
//     console.error("getRatingsSSR error:", error);
//     return { average: 0, count: 0, myRating: null };
//   }
// }

// export async function generateMetadata(props) {
//   const params = await props.params;
//   const slug = params?.slug;
//   const productId = extractProductId(slug);

//   if (!productId) {
//     return {
//       title: "Product not found",
//       description: "Invalid product URL",
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

//   const name = product?.name || "Product";
//   const descRaw =
//     product?.description ||
//     `Buy ${name} at the best price from EssentialistMakeupStore.`;
//   const description = stripHtml(descRaw).slice(0, 300);
//   const img = Array.isArray(product?.image) ? product.image[0] : product?.image;
//   const url = `https://www.esmakeupstore.com/product/${slug}`;

//   return {
//     metadataBase: new URL("https://www.esmakeupstore.com"),
//     title: name,
//     description,
//     keywords: `[
//       name,
//       'makeup',
//       'beauty',
//       'cosmetics',
//       'Essentialist Makeup Store',
//       'Cameroon makeup',
//       'Douala beauty',
//       ${name}
//     ]`,
//     alternates: { canonical: url },
//     openGraph: {
//       type: "website",
//       siteName: "Essentialist MakeupStore",
//       url,
//       title: name,
//       description,
//       images: img ? [{ url: img, width: 1200, height: 630, alt: name }] : [],
//       locale: "en_US",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: name,
//       description,
//       images: img ? [img] : [],
//     },
//     robots: { index: true, follow: true },
//   };
// }

// function StructuredData({ product, slug, rating }) {
//   const url = `https://www.esmakeupstore.com/product/${slug}`;
//   const imgList = Array.isArray(product?.image)
//     ? product.image
//     : [product?.image].filter(Boolean);
//   const offers = {
//     "@type": "Offer",
//     priceCurrency: "XAF",
//     price: String(
//       pricewithDiscount(product?.price || 0, product?.discount || 0)
//     ),
//     availability:
//       product?.stock && product.stock > 0
//         ? "https://schema.org/InStock"
//         : "https://schema.org/OutOfStock",
//     url,
//   };

//   const productJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: product?.name,
//     description: stripHtml(product?.description),
//     image: imgList,
//     sku: product?._id || product?.sku,
//     brand: product?.brand
//       ? { "@type": "Brand", name: product.brand }
//       : undefined,
//     offers,
//     ...(rating && rating.count > 0
//       ? {
//           aggregateRating: {
//             "@type": "AggregateRating",
//             ratingValue: String(rating.average),
//             reviewCount: String(rating.count),
//           },
//         }
//       : {}),
//   };

//   const breadcrumbJsonLd = {
//     "@context": "https://schema.org",
//     "@type": "BreadcrumbList",
//     itemListElement: [
//       { "@type": "ListItem", position: 1, name: "Home", item: "https://www.esmakeupstore.com/" },
//       { "@type": "ListItem", position: 2, name: "Products", item: "https://www.esmakeupstore.com/product" },
//       { "@type": "ListItem", position: 3, name: product?.name, item: url },
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

//   const arr = [productJsonLd, breadcrumbJsonLd, websiteJsonLd, organizationJsonLd];

//   return (
//     <>
//       {arr.map((obj, i) => (
//         <script
//           key={i}
//           type="application/ld+json"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
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

//   const [productData, ratingSSR] = await Promise.all([
//     getProduct(productId),
//     getRatingsSSR(productId),
//   ]);

//   if (!productData) return notFound();

//   const images = Array.isArray(productData.image)
//     ? productData.image
//     : [productData.image].filter(Boolean);

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: tabularStyles }} />
//       <StructuredData product={productData} slug={slug} rating={ratingSSR} />

//       <section className="container mx-auto p-4 grid lg:grid-cols-2 text-slate-900 font-bold md:font-normal gap-6">
//         <div>
//           <ProductGallery images={images} productName={productData.name} />

//           <div className="my-4 hidden lg:grid gap-3 p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
//             <div>
//               <p className="font-semibold">Description</p>
//               <div
//                 className="text-base text-justify text-slate-900 product-description-content"
//                 dangerouslySetInnerHTML={{ __html: productData.description || "" }}
//               />
//             </div>
//             {productData.specifications && (
//               <div>
//                 <p className="font-semibold">Product Specifications</p>
//                 <div className="tabular-content">{productData.specifications}</div>
//               </div>
//             )}
//             <div>
//               <p className="font-semibold">Unit</p>
//               <p className="text-base">{productData.unit}</p>
//             </div>
//             {productData?.more_details &&
//               typeof productData.more_details === "object" &&
//               Object.keys(productData.more_details).map((element, idx) => (
//                 <div key={`detail-${idx}`}>
//                   <p className="font-semibold">{element}</p>
//                   <p className="text-base">{productData.more_details[element]}</p>
//                 </div>
//               ))}
//           </div>
//         </div>

//         <div className="p-4 lg:pl-7 text-base lg:text-lg">
//           <p className="bg-emerald-200 w-fit px-2 rounded-full">10 Minutes</p>
//           <h1 className="text-lg font-semibold lg:text-lg">{productData.name}</h1>
//           <p>{productData.unit}</p>

//           <div className="mt-2">
//             <div className="flex items-center gap-2 text-sm text-slate-800">
//               <span className="font-semibold">
//                 {Number(ratingSSR?.average || 0).toFixed(2)}
//               </span>
//               <span>/ 5</span>
//               <span className="text-slate-700">
//                 ({ratingSSR?.count || 0}{" "}
//                 {Number(ratingSSR?.count) === 1 ? "rating" : "ratings"})
//               </span>
//             </div>
//             <RatingBlock productId={productId} />
//           </div>

//           <Divider />

//           <div>
//             <p>Bulk Price</p>
//             <div className="flex items-center gap-2 lg:gap-4">
//               <div className="border border-emerald-600 px-4 py-2 rounded bg-emerald-50 w-fit">
//                 <p className="font-semibold text-lg lg:text-xl">
//                   {DisplayPriceInRupees(
//                     pricewithDiscount(
//                       productData.bulkPrice || productData.price,
//                       productData.discount || 0
//                     )
//                   )}
//                 </p>
//               </div>
//               {productData.discount > 0 && (
//                 <p className="line-through">
//                   {DisplayPriceInRupees(productData.price)}
//                 </p>
//               )}
//               {productData.discount > 0 && (
//                 <p className="font-bold text-emerald-600 lg:text-2xl">
//                   {productData.discount}%{" "}
//                   <span className="text-base text-slate-900">Discount</span>
//                 </p>
//               )}
//             </div>
//           </div>

//           <div>
//             <p>Price</p>
//             <div className="flex items-center gap-2 lg:gap-4">
//               <div className="border border-emerald-600 px-4 py-2 rounded bg-emerald-50 w-fit">
//                 <p className="font-semibold text-lg lg:text-xl">
//                   {DisplayPriceInRupees(
//                     pricewithDiscount(
//                       productData.price,
//                       productData.discount || 0
//                     )
//                   )}
//                 </p>
//               </div>
//               {productData.discount > 0 && (
//                 <p className="line-through">
//                   {DisplayPriceInRupees(productData.price)}
//                 </p>
//               )}
//               {productData.discount > 0 && (
//                 <p className="font-bold text-emerald-600 lg:text-2xl">
//                   {productData.discount}%{" "}
//                   <span className="text-base text-slate-900">Discount</span>
//                 </p>
//               )}
//             </div>
//           </div>

//           {productData.stock === 0 ? (
//             <p className="text-lg text-rose-600 my-2">Out of Stock</p>
//           ) : (
//             <div className="my-4">
//               <AddToCartButton data={productData} />
//             </div>
//           )}

//           <h2 className="font-semibold mt-8">
//             Why shop from Essentialist Makeup Store?
//           </h2>
//           <div>
//             <div className="flex items-center gap-4 my-4">
//               <Image
//                 src="/assets/minute_delivery.jpeg"
//                 alt="Super-fast delivery"
//                 width={80}
//                 height={80}
//                 className="w-20 h-20"
//               />
//               <div className="text-sm">
//                 <div className="font-semibold">Super-fast Delivery</div>
//                 <p>
//                   Get your order delivered to your doorstep at the earliest from
//                   dark stores near you.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 my-4">
//               <Image
//                 src="/assets/Best_Prices_Offers.png"
//                 alt="Best prices and offers"
//                 width={80}
//                 height={80}
//                 className="w-20 h-20"
//               />
//               <div className="text-sm">
//                 <div className="font-semibold">Best Prices and Offers</div>
//                 <p>
//                   Best price destination with offers directly from the manufacturers.
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-4 my-4">
//               <Image
//                 src="/assets/Wide_Assortment.avif"
//                 alt="Wide assortment"
//                 width={80}
//                 height={80}
//                 className="w-20 h-20"
//               />
//               <div className="text-sm">
//                 <div className="font-semibold">Wide Assortment</div>
//                 <p>
//                   Choose from over five thousand makeup products including
//                   foundations, lipsticks, eyeshadows, and more.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="my-4 grid gap-3 lg:hidden">
//             <div>
//               <p className="font-semibold">Description</p>
//               <div
//                 className="text-base text-justify text-slate-900 product-description-content"
//                 dangerouslySetInnerHTML={{ __html: productData.description || "" }}
//               />
//             </div>
//             {productData.specifications && (
//               <div>
//                 <p className="font-semibold">Product Specifications</p>
//                 <div className="tabular-content">{productData.specifications}</div>
//               </div>
//             )}
//             <div>
//               <p className="font-semibold">Unit</p>
//               <p className="text-base">{productData.unit}</p>
//             </div>
//             {productData?.more_details &&
//               typeof productData.more_details === "object" &&
//               Object.keys(productData.more_details).map((element, idx) => (
//                 <div key={`mobile-detail-${idx}`}>
//                   <p className="font-semibold">{element}</p>
//                   <p className="text-base">{productData.more_details[element]}</p>
//                 </div>
//               ))}
//           </div>
//         </div>
//       </section>

//       <ProductRecommendations
//         currentProductId={productId}
//         currentProductData={productData}
//       />
//     </>
//   );
// }







import { Suspense } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import Divider from "../../../components/Divider";
import AddToCartButton from "../../../components/AddToCartButton";
import ProductRecommendations from "../../../components/ProductRecommendations";
import { DisplayPriceInRupees } from "../../../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
import SummaryApi, { apiFetch } from "../../../common/SummaryApi";

const ProductGallery = dynamic(() => import("./ProductGallery.client"), {
  loading: () => <ImageSkeleton />,
});

const RatingBlock = dynamic(() => import("./RatingBlock.client"), {
  loading: () => <RatingSkeleton />,
});

function extractProductId(slug) {
  if (!slug) return null;
  const parts = slug.split("-");
  return parts.at(-1);
}

function stripHtml(html) {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, "").trim();
}

async function getProduct(productId) {
  "use cache";
  cacheTag(`product:${productId}`);
  cacheLife("hours");

  const response = await apiFetch(SummaryApi.getProductDetails.url, {
    method: SummaryApi.getProductDetails.method.toUpperCase(),
    body: { productId },
  });

  return response?.data ?? null;
}

async function getRatingsSnapshot(productId) {
  "use cache";
  cacheTag(`product:ratings:${productId}`);
  cacheLife("minutes");

  const response = await apiFetch(SummaryApi.ratingsGet.url(productId), {
    method: SummaryApi.ratingsGet.method.toUpperCase(),
  });

  return (
    response?.data ?? {
      average: 0,
      count: 0,
      myRating: null,
    }
  );
}

export async function generateMetadata(props) {
  const params = await props.params;
  const productId = extractProductId(params?.slug);

  if (!productId) {
    return {
      title: "Product not found",
      description: "Invalid product URL.",
      robots: { index: false, follow: false },
    };
  }

  const product = await getProduct(productId);
  if (!product) {
    return {
      title: "Product not found",
      description: "Product could not be found.",
      robots: { index: false, follow: true },
    };
  }

  const rating = await getRatingsSnapshot(productId);
  const name = product.name ?? "Product";
  const description =
    stripHtml(product.description) ||
    `Buy ${name} at Essentialist Makeup Store.`;
  const heroImage = Array.isArray(product.image)
    ? product.image[0]
    : product.image;
  const slug = params.slug;
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
      "x-aggregate-rating": rating?.average ?? 0,
      "x-rating-count": rating?.count ?? 0,
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

export default async function ProductDisplayPage(props) {
  const params = await props.params;
  const slug = params?.slug;
  const productId = extractProductId(slug);

  if (!productId) return notFound();

  const productData = await getProduct(productId);
  if (!productData) return notFound();

  const ratingSnapshot = await getRatingsSnapshot(productId);
  const images = Array.isArray(productData.image)
    ? productData.image.filter(Boolean)
    : [productData.image].filter(Boolean);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tabularStyles }} />
      <StructuredData
        product={productData}
        slug={slug}
        rating={ratingSnapshot}
      />

      <section className="container mx-auto grid gap-6 p-4 text-slate-900 font-medium lg:grid-cols-[minmax(0,1fr),minmax(0,1fr)] lg:gap-10">
        <div>
          <ProductGallery images={images} productName={productData.name} />

          <article className="my-4 hidden gap-3 rounded-lg border border-slate-200 p-4 shadow-sm transition-shadow hover:shadow-md lg:grid">
            <DescriptionBlock product={productData} />
          </article>
        </div>

        <aside className="space-y-6 rounded-lg bg-white p-4 shadow-sm lg:pl-7">
          <Badge />
          <header>
            <h1 className="text-xl font-semibold lg:text-2xl">
              {productData.name}
            </h1>
            <p className="text-sm text-slate-600">{productData.unit}</p>
          </header>

          <RatingSummary
            ratingSnapshot={ratingSnapshot}
            productId={productId}
          />

          <Divider />

          <PriceBlock
            label="Bulk Price"
            amount={pricewithDiscount(
              productData.bulkPrice ?? productData.price,
              productData.discount ?? 0
            )}
            baseAmount={productData.price}
            discount={productData.discount}
          />

          <PriceBlock
            label="Price"
            amount={pricewithDiscount(
              productData.price,
              productData.discount ?? 0
            )}
            baseAmount={productData.price}
            discount={productData.discount}
          />

          {productData.stock === 0 ? (
            <p className="text-lg font-semibold text-rose-600">Out of stock</p>
          ) : (
            <div className="pt-2">
              <AddToCartButton data={productData} />
            </div>
          )}

          <WhyShopWithUs />

          <article className="grid gap-3 lg:hidden">
            <DescriptionBlock product={productData} />
          </article>
        </aside>
      </section>

      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations
          currentProductId={productId}
          currentProductData={productData}
        />
      </Suspense>
    </>
  );
}

function Badge() {
  return (
    <span className="inline-flex rounded-full bg-emerald-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
      10 Minutes
    </span>
  );
}

function RatingSummary({ ratingSnapshot, productId }) {
  const average = Number(ratingSnapshot?.average ?? 0).toFixed(2);
  const count = ratingSnapshot?.count ?? 0;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-slate-700">
        <span className="text-lg font-semibold text-slate-900">{average}</span>
        <span>/ 5</span>
        <span className="text-slate-500">
          ({count} {count === 1 ? "rating" : "ratings"})
        </span>
      </div>
      <RatingBlock productId={productId} />
    </div>
  );
}

function PriceBlock({ label, amount, baseAmount, discount }) {
  const formattedAmount = DisplayPriceInRupees(amount);
  const formattedBase = DisplayPriceInRupees(baseAmount);

  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded border border-emerald-600 bg-emerald-50 px-4 py-2 text-lg font-semibold text-emerald-900 lg:text-xl">
          {formattedAmount}
        </span>
        {discount > 0 && (
          <>
            <span className="text-base text-slate-500 line-through">
              {formattedBase}
            </span>
            <span className="text-lg font-bold text-emerald-600 lg:text-2xl">
              {discount}%{" "}
              <span className="text-base font-medium text-slate-900">
                Discount
              </span>
            </span>
          </>
        )}
      </div>
    </section>
  );
}

function DescriptionBlock({ product }) {
  return (
    <>
      <section>
        <h3 className="font-semibold">Description</h3>
        <div
          className="product-description-content text-justify text-base text-slate-900"
          dangerouslySetInnerHTML={{
            __html: product.description ?? "",
          }}
        />
      </section>

      {product.specifications && (
        <section>
          <h3 className="font-semibold">Product Specifications</h3>
          <div className="tabular-content">{product.specifications}</div>
        </section>
      )}

      {product.unit && (
        <section>
          <h3 className="font-semibold">Unit</h3>
          <p className="text-base text-slate-800">{product.unit}</p>
        </section>
      )}

      {product?.more_details &&
        typeof product.more_details === "object" &&
        Object.entries(product.more_details).map(([key, value]) => (
          <section key={key}>
            <h3 className="font-semibold">{key}</h3>
            <p className="text-base text-slate-800">{value}</p>
          </section>
        ))}
    </>
  );
}

function WhyShopWithUs() {
  const perks = [
    {
      title: "Super-fast Delivery",
      description:
        "Get your order delivered from dark stores near you in record time.",
      icon: "/assets/minute_delivery.jpeg",
    },
    {
      title: "Best Prices and Offers",
      description:
        "Enjoy manufacturer-direct savings across thousands of beauty essentials.",
      icon: "/assets/Best_Prices_Offers.png",
    },
    {
      title: "Wide Assortment",
      description:
        "Browse over five thousand products spanning foundation, lipstick, eyes, and more.",
      icon: "/assets/Wide_Assortment.avif",
    },
  ];

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold">
        Why shop from Essentialist Makeup Store?
      </h2>
      {perks.map((perk) => (
        <div key={perk.title} className="flex items-center gap-4">
          <Image
            src={perk.icon}
            alt={perk.title}
            width={80}
            height={80}
            loading="lazy"
            decoding="async"
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="text-sm text-slate-700">
            <h3 className="font-semibold text-slate-900">{perk.title}</h3>
            <p>{perk.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}