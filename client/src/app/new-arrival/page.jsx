"use client";
import Head from "next/head";
import { useEffect } from "react";
import CategoryWiseProductDisplay from "./../../components/CategoryWiseProductDisplay";
import bannerOGB from "/public/assets/OG-Shades-Desktop.webp";

const NEW_HOT_CATEGORY_ID = "6806b355bca41016c4406edb";
const NEW_CATEGORY_ID = "68055442764e6d332bd162c8";
const NEW_HOT_CATEGORY_NAME = "New Makeup Arrivals & Hot Brands in Cameroon";
const NEW_CATEGORY_NAME = "New Makeup Arrivals in Cameroon";

export default function NewAndHotPage() {
  useEffect(() => {
    const year = new Date().getFullYear();
    document.title = `NYX & L.A. Girl: Best New Makeup of ${year} | Trending Beauty Essentials`;
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-pink-50 to-white pb-16">
      <Head>
        <title>
          {`NYX & L.A. Girl: Best New Makeup of ${new Date().getFullYear()} | Trending Beauty Essentials`}
        </title>
        <meta
          name="description"
          content="Explore the latest and hottest makeup brands and beauty products in Cameroon. Shop trending foundations, lipsticks, eyeshadows, and more from NYX, LA Girl, and top brands at Essentialist Makeup Store. New arrivals and must-have cosmetics with fast delivery in FCFA."
        />
        <meta
          name="keywords"
          content="new makeup Cameroon, trending makeup brands, hot makeup Cameroon, beauty trends 2024, NYX new arrivals, LA Girl new products, best makeup brands Cameroon, Essentialist Makeup Store, Douala makeup shop, FCFA makeup, new beauty Cameroon, hottest makeup deals, buy cosmetics Cameroon, trending foundation Douala, latest lipsticks Cameroon, hot beauty brands Africa"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://www.esmakeupstore.com/new-arrival" />
        <meta property="og:title" content="New & Hot Makeup Brands in Cameroon | Trending Beauty Products 2024" />
        <meta property="og:description" content="Discover the latest makeup and hottest beauty brands in Cameroon. Shop new arrivals from NYX, LA Girl, and global brands at Essentialist Makeup Store." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Essentialist Makeup Store" />
        <meta property="og:url" content="https://www.esmakeupstore.com/new-arrival" />
        <meta property="og:image" content="https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg" />
        <meta property="og:image:alt" content="New & Hot Makeup Cameroon" />
        <meta name="twitter:title" content="New & Hot Makeup Brands in Cameroon | Trending Beauty Products 2024" />
        <meta name="twitter:description" content="Shop the latest and hottest makeup brands in Cameroon. Explore trending products from NYX, LA Girl & more at Essentialist Makeup Store." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "New & Hot Makeup Brands in Cameroon",
            "url": "https://www.esmakeupstore.com/new-arrival",
            "description": "Explore the latest and hottest makeup brands and beauty products in Cameroon. Shop trending NYX, LA Girl and more at Essentialist Makeup Store.",
            "publisher": {
              "@type": "Organization",
              "name": "Essentialist Makeup Store"
            }
          })}
        </script>
      </Head>
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-pink-700 tracking-tight mb-4 animate-fade-in">
          {NEW_HOT_CATEGORY_NAME}
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-700 font-bold mb-4">
          Discover the Latest Makeup Brands and Beauty Trends in Cameroon
        </h2>
        <p className="text-pink-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Shop the newest arrivals and hottest makeup brands in Cameroon at Essentialist Makeup Store. From NYX and LA Girl to international bestsellers, find trending foundations, lipsticks, palettes, and more -- all at unbeatable FCFA prices!
        </p>
      </div>
      <div className="mx-auto max-w-7xl px-4">
        <CategoryWiseProductDisplay
          id={NEW_CATEGORY_ID}
          name={NEW_CATEGORY_NAME}
        />
      </div>
      <img src={bannerOGB} className="w-full flex justify-centeritems-center h-full lg:block mt-4" alt="banner" />
      <div className="mx-auto max-w-7xl px-4">
        <CategoryWiseProductDisplay
          id={NEW_HOT_CATEGORY_ID}
          name={NEW_HOT_CATEGORY_NAME}
        />
      </div>
      <section className="max-w-2xl mx-auto bg-gradient-to-br from-pink-100 via-pink-50 to-pink-100 shadow-xl rounded-lg p-6 md:p-10 text-center mt-16 border border-pink-200">
        <h3 className="text-2xl font-bold text-pink-700 mb-4">
          Contact Us — Get the Newest Makeup Brands in Cameroon
        </h3>
        <p className="text-black mb-6 leading-relaxed">
          Have questions about our new arrivals or trending makeup brands? Want to order the hottest beauty products in Cameroon? <br />
          Connect with our expert team for authentic NYX, LA Girl, and top global brands at the best prices in FCFA.
        </p>
        <div className="flex flex-col items-center gap-3 mb-6">
          <a
            href="tel:+237 655 22 55 69"
            className="font-bold text-pink-800 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
            title="Call Essentialist Makeup Store"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call/WhatsApp: +237 655 22 55 69
          </a>
          <a
            href="mailto:esssmakeup@gmail.com"
            className="font-bold text-pink-800 hover:text-pink-500 transition-colors duration-300 flex items-center gap-2"
            title="Email Essentialist Makeup Store"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Email: esssmakeup@gmail.com
          </a>
        </div>
        <p className="mt-4 text-black text-sm border-t border-pink-200 pt-4">
          Shop online or visit us in Douala for the latest makeup trends, new beauty launches, and exclusive deals on the most popular brands in Cameroon.
        </p>
      </section>
    </div>
  );
}