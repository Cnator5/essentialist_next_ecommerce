"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import Divider from "../../../components/Divider";
import AddToCartButton from "../../../components/AddToCartButton";
import { DisplayPriceInRupees } from "../../../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../../../utils/PriceWithDiscount";
import {
  productQueryOptions,
  ratingQueryOptions,
} from "./queries";

const ProductGallery = dynamic(() => import("./ProductGallery.client"), {
  loading: () => <ImageSkeleton />,
});

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

  const {
    data: ratingSnapshot,
    isLoading: isRatingLoading,
  } = useQuery({
    ...ratingQueryOptions(productId),
  });

  if (isProductLoading) {
    return <PageSkeleton />;
  }

  if (isProductError || !productData) {
    return (
      <section className="container mx-auto p-6 text-center">
        <p className="text-lg font-semibold text-rose-600">
          Unable to load this product. Please refresh the page.
        </p>
      </section>
    );
  }

  const images = useMemo(() => {
    if (Array.isArray(productData.image)) {
      return productData.image.filter(Boolean);
    }
    return [productData.image].filter(Boolean);
  }, [productData.image]);

  return (
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
          <h1 className="">
            {productData.name}
          </h1>
          <p className="text-sm text-slate-600">{productData.unit}</p>
        </header>

        <RatingSummary
          ratingSnapshot={
            isRatingLoading
              ? { average: 0, count: 0 }
              : ratingSnapshot ?? { average: 0, count: 0 }
          }
          productId={productId}
        />

        <Divider />

        {/* <PriceBlock
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
        )} */}

        <div className="flex flex-wrap justify-between items-end gap-4 w-full">
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
    <p className="text-lg font-semibold text-rose-600">
      Out of stock
    </p>
  ) : (
    <div className="pb-2">
      <AddToCartButton data={productData} />
    </div>
  )}
</div>


        <WhyShopWithUs />

        <article className="grid gap-3 lg:hidden">
          <DescriptionBlock product={productData} />
        </article>
      </aside>
    </section>
  );
}

function Badge() {
  return (
    <span className="inline-flex rounded-full bg-emerald-200 px-3 py-1 text-xs
      font-semibold uppercase tracking-wide text-emerald-800">
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

function PageSkeleton() {
  return (
    <section className="container mx-auto grid gap-6 p-4 lg:grid-cols-2">
      <div className="space-y-4">
        <ImageSkeleton />
        <div className="hidden rounded-lg border border-slate-200 p-4 lg:block">
          <TextSkeleton width="50%" />
          <TextSkeleton width="80%" />
          <TextSkeleton width="90%" />
        </div>
      </div>
      <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <TextSkeleton width="40%" height="h-5" />
        <TextSkeleton width="70%" />
        <TextSkeleton width="60%" />
        <TextSkeleton width="50%" />
        <TextSkeleton width="100%" height="h-12" />
      </div>
    </section>
  );
}

function ImageSkeleton() {
  return (
    <div className="aspect-square w-full rounded-lg bg-slate-200 animate-pulse" />
  );
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