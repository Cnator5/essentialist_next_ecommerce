"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";

import Divider from "../../../components/Divider";
import AddToCartButton from "../../../components/AddToCartButton";
import { DisplayPriceInRupees } from "../../../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
import { productQueryOptions, ratingQueryOptions } from "./queries";
import ProductGallery from "./ProductGallery.client";

const RatingBlock = dynamic(() => import("./RatingBlock.client"), {
  loading: () => <RatingSkeleton />,
});

export default function ProductDisplayClient({ productId }) {
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery({
    ...productQueryOptions(productId),
  });

  const { data: ratingSnapshot, isLoading: isRatingLoading } = useQuery({
    ...ratingQueryOptions(productId),
  });

  if (isProductLoading) return <PageSkeleton />;

  if (isProductError || !productData) {
    return (
      <section className="container mx-auto p-6 text-center">
        <p className="text-lg font-semibold text-rose-600">Unable to load product. Please refresh.</p>
      </section>
    );
  }

  const images = useMemo(() => {
    if (Array.isArray(productData.image)) return productData.image.filter(Boolean);
    return [productData.image].filter(Boolean);
  }, [productData.image]);

  return (
    <main className="container mx-auto p-4 text-slate-900 font-medium">
      {/* UBUY BREADCRUMBS */}
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 uppercase">
        <span className="cursor-pointer hover:text-amber-600">
          {typeof productData.brand === 'object' ? productData.brand?.name : productData.brand}
        </span>
        <span>/</span>
        <span className="cursor-pointer hover:text-amber-600">
          {typeof productData.category === 'object' ? productData.category?.name : productData.category}
        </span>
        <span>/</span>
        <span className="font-bold text-slate-900">
          {productData.name?.substring(0, 30)}...
        </span>
      </nav>

      {/* TOP SECTION: 2-Column Layout for Image and Info */}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        
        {/* LEFT: Image Gallery with Bestseller Badge */}
        <div className="relative min-w-0">
          <div className="absolute left-2 top-2 z-10">
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm uppercase">
              Bestseller
            </span>
          </div>
          <ProductGallery images={images} productName={productData.name} />
        </div>

        {/* RIGHT: Product Sidebar */}
        <aside className="space-y-6">
          <Badge />
          <header>
            <h1 className="text-xl font-bold lg:text-3xl leading-tight">{productData.name}</h1>
          </header>

          <RatingSummary
            ratingSnapshot={isRatingLoading ? { average: 0, count: 0 } : (ratingSnapshot ?? { average: 0, count: 0 })}
            productId={productId}
          />

          <Divider />

          <div className="flex flex-wrap items-end justify-between gap-y-4 gap-x-2">
            <div className="flex-1 min-w-[120px]">
              <PriceBlock
                label="Bulk Price"
                amount={pricewithDiscount(productData.bulkPrice ?? productData.price, productData.discount ?? 0)}
                baseAmount={productData.price}
                discount={productData.discount}
              />
            </div>

            <div className="flex-1 min-w-[120px]">
              <PriceBlock
                label="Price"
                amount={pricewithDiscount(productData.price, productData.discount ?? 0)}
                baseAmount={productData.price}
                discount={productData.discount}
              />
            </div>

            <div className="flex-none">
              <div className="rounded-lg shadow-[0_0_12px_rgba(236,72,153,0.3)] transform transition hover:scale-105">
                <AddToCartButton data={productData} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded text-[11px] text-slate-600">
              <img src="https://d3ulwu8fab47va.cloudfront.net/skin/frontend/default/ubuycom-v1/images/countries-flag/us-store.svg" alt="USA" className="w-4" />
              <span>Imported from USA store</span>
          </div>

          <Divider />
          <WhyShopWithUs />
        </aside>
      </div>

      {/* FULL WIDTH DESCRIPTION SECTION */}
      <div className="mt-16 w-full border-t border-slate-200 pt-12">
        <DescriptionBlock product={productData} />
      </div>
    </main>
  );
}

function Badge() {
  return (
    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
      10 Minutes Delivery
    </span>
  );
}

function RatingSummary({ ratingSnapshot, productId }) {
  const average = Number(ratingSnapshot?.average ?? 0).toFixed(1);
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-xl font-bold">{average}</span>
        <span className="text-slate-400">/ 5.0</span>
      </div>
      <RatingBlock productId={productId} />
    </div>
  );
}

function PriceBlock({ label, amount, baseAmount, discount }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest">{label}</h2>
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-900 sm:text-2xl">
          {DisplayPriceInRupees(amount)}
        </span>
        {discount > 0 && (
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-slate-400 line-through">{DisplayPriceInRupees(baseAmount)}</span>
            <span className="text-rose-500 font-bold">-{discount}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

function DescriptionBlock({ product }) {
  return (
    <div className="space-y-16">
      <section>
        <div className="mb-8 inline-block border-b-4 border-amber-500 pb-1">
          <h3 className="text-2xl font-bold">What Stands Out</h3>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {["Deep Cleansing", "Heartleaf Extract", "Korean Formula"].map((title) => (
            <div key={title} className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition">
              <h4 className="font-bold mb-2">{title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">High-quality ingredients designed to enhance skin wellness and achieve a radiant appearance.</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 inline-block border-b-4 border-amber-500 pb-1">
          <h3 className="text-2xl font-bold">Product Description</h3>
        </div>
        <div
          className="prose prose-slate max-w-none text-base leading-relaxed text-slate-700 text-justify"
          dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
        />
      </section>

      <section className="space-y-6">
        <div className="mb-4 inline-block border-b-4 border-amber-500 pb-1">
          <h3 className="text-2xl font-bold text-slate-900">Product Details</h3>
        </div>
        <div className="grid gap-4 text-sm text-slate-700">
          {[product.specifications, product.unit].filter(Boolean).map((detail, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-1 h-5 w-5 flex-shrink-0 rounded bg-amber-500 flex items-center justify-center text-white font-bold text-[10px]">U</div>
              <div>
                {/* Fallback for objects in details list */}
                {typeof detail === 'object' ? JSON.stringify(detail) : detail}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function WhyShopWithUs() {
  const perks = [
    { title: "Super-fast Delivery", description: "From dark stores near you.", icon: "/assets/minute_delivery.jpeg" },
    { title: "Best Prices", description: "Direct savings on essentials.", icon: "/assets/Best_Prices_Offers.png" },
    { 
      title: "Authentic Products", 
      description: "Guaranteed authentic products.", 
      icon: "https://d2ati23fc66y9j.cloudfront.net/ubuycom-v1/images/ubuy-seal-authentic.png.webp" 
    },
  ];

  return (
    <div className="grid gap-3">
      {perks.map((perk) => (
        <div key={perk.title} className="flex items-center gap-3 p-2 rounded-lg border border-slate-50">
          <div className="relative h-10 w-10 flex-shrink-0">
            {/* Standard <img> tag avoids hostname configuration errors */}
            <img 
              src={perk.icon} 
              alt={perk.title} 
              className="h-full w-full object-cover rounded" 
            />
          </div>
          <div className="text-[11px]">
            <h3 className="font-bold">{perk.title}</h3>
            <p className="text-slate-500">{perk.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PageSkeleton() {
  return <div className="container mx-auto p-10 animate-pulse bg-slate-50 h-screen rounded-xl" />;
}

function RatingSkeleton() {
  return <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />;
}