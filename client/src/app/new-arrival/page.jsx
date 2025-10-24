import SummaryApi, { apiFetch } from "../../common/SummaryApi";
import NewArrivalContent from "../../components/NewArrivalContent";
// import { apiFetch, SummaryApi } from "../common/SummaryApi";

const STORE_NAME = "Essentialist Makeup Store";
const PAGE_PATH = "https://www.esmakeupstore.com/new-arrival";
const HERO_TITLE = "New Makeup Arrivals & Hot Brands in Cameroon";
const HERO_SUBTITLE = "Discover the Latest Makeup Brands and Beauty Trends in Cameroon";
const HERO_DESCRIPTION =
  "Shop the newest arrivals and hottest makeup brands in Cameroon at Essentialist Makeup Store. From NYX and LA Girl to international bestsellers, find trending foundations, lipsticks, palettes, and more — all at unbeatable FCFA prices!";

const USE_CATEGORY_BLOCKS = true;
const NEW_CATEGORY_ID = "68055442764e6d332bd162c8";
const NEW_HOT_CATEGORY_ID = "6806b355bca41016c4406edb";

export const metadata = {
  title: "NYX & L.A. Girl: Best New Makeup 2025 | Essentialist Makeup Store",
  description:
    "Explore the latest makeup launches in Cameroon. Essentialist Makeup Store brings you NYX, LA Girl, and top global beauty brands at the best FCFA prices.",
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    title: "New & Hot Makeup Brands in Cameroon | Essentialist Makeup Store",
    description:
      "Discover trending beauty products in Cameroon. Shop new arrivals from NYX, LA Girl, and more at Essentialist Makeup Store, Douala.",
    url: PAGE_PATH,
    siteName: STORE_NAME,
    type: "website",
    images: [
      {
        url: "https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg",
        alt: "New & Hot Makeup Cameroon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "New & Hot Makeup Brands in Cameroon | Essentialist Makeup Store",
    description:
      "Shop the latest makeup and hottest beauty trends in Cameroon. NYX, LA Girl, and more available now at Essentialist Makeup Store.",
    images: ["https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

async function loadProducts() {
  const basePayload = {
    limit: 24,
    page: 1,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const [allRes, newRes, hotRes] = await Promise.allSettled([
    apiFetch(SummaryApi.getProduct.url, { method: "POST", body: basePayload }),
    USE_CATEGORY_BLOCKS
      ? apiFetch(SummaryApi.getProductByCategory.url, {
          method: "POST",
          body: { ...basePayload, categoryId: NEW_CATEGORY_ID, limit: 16 },
        })
      : Promise.resolve({ value: [] }),
    USE_CATEGORY_BLOCKS
      ? apiFetch(SummaryApi.getProductByCategory.url, {
          method: "POST",
          body: { ...basePayload, categoryId: NEW_HOT_CATEGORY_ID, limit: 16 },
        })
      : Promise.resolve({ value: [] }),
  ]);

  const extractProducts = (result) => {
    if (result.status !== "fulfilled") return [];
    const payload = result.value;
    if (!payload) return [];
    if (Array.isArray(payload.data?.products)) return payload.data.products;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  };

  return {
    feedProducts: extractProducts(allRes),
    newCategoryProducts: extractProducts(newRes),
    hotCategoryProducts: extractProducts(hotRes),
  };
}

export default async function NewArrivalPage() {
  const { feedProducts, newCategoryProducts, hotCategoryProducts } = await loadProducts();

  const structuredData = {
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
      itemListElement: feedProducts.slice(0, 20).map((product, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Product",
          name: product?.name ?? "",
          image: Array.isArray(product?.image)
            ? product.image
            : product?.image
            ? [product.image]
            : [],
          brand: product?.brand
            ? {
                "@type": "Brand",
                name: product.brand,
              }
            : undefined,
          offers: {
            "@type": "Offer",
            priceCurrency: "XAF",
            price: product?.discount
              ? String(
                  Math.round(
                    Number(product.price || 0) -
                      (Number(product.price || 0) * Number(product.discount || 0)) / 100,
                  ),
                )
              : String(product?.price ?? ""),
            availability: "https://schema.org/InStock",
            url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.esmakeupstore.com"}/product/${
              product?._id || ""
            }`,
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <NewArrivalContent
        hero={{
          title: HERO_TITLE,
          subtitle: HERO_SUBTITLE,
          description: HERO_DESCRIPTION,
        }}
        feedProducts={feedProducts}
        newCategoryProducts={USE_CATEGORY_BLOCKS ? newCategoryProducts : []}
        hotCategoryProducts={USE_CATEGORY_BLOCKS ? hotCategoryProducts : []}
      />
    </>
  );
}