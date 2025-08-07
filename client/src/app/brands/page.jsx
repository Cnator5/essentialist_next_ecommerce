"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { valideURLConvert } from "./../../utils/valideURLConvert";
import Head from "next/head";

const makeupProducts = [
  { product: "Total control drop", genre: "foundation", brand: "NYX", bulk: 9000, sell: 13000 },
  { product: "Dou chromatic", genre: "lip gloss", brand: "NYX", bulk: 4000, sell: 6000 },
  { product: "Worth the hype", genre: "Mascara", brand: "NYX", bulk: 4000, sell: 6000 },
  { product: "LA girl", genre: "Lip/eye liner pencil 3 in 1", brand: "LA girl", bulk: 5000, sell: 6500 },
  { product: "Stay matte but not flat", genre: "Powder foundation", brand: "NYX", bulk: 10000, sell: 13000 },
  { product: "Stay matte but not flat", genre: "Liquid Foundation", brand: "NYX", bulk: 12000, sell: 14000 },
  { product: "NYX eye brow cake powder", genre: "Eye brow cake powder", brand: "NYX", bulk: 3000, sell: 4500 },
  { product: "NYX Mineral stick foundation", genre: "Stick foundation", brand: "NYX", bulk: 7000, sell: 10000 },
  { product: "NYX illuminator", genre: "Matte bronzer", brand: "NYX", bulk: 7000, sell: 9000 },
  { product: "Away we glow", genre: "liquid highlighter", brand: "NYX", bulk: 4000, sell: 6000 },
  { product: "NYX Glitter goals", genre: "liquid eyes hadow", brand: "NYX", bulk: 3000, sell: 5000 },
  { product: "NYX dark circle concealer", genre: "Dark circle concealer", brand: "NYX", bulk: 5000, sell: 7000 },
  { product: "Abit jelly gel", genre: "illuminator", brand: "NYX", bulk: 5000, sell: 7000 },
  { product: "NYX Bright light", genre: "High definition Blush", brand: "NYX", bulk: 6000, sell: 8500 },
  { product: "NYX baked blush", genre: "baked blush", brand: "NYX", bulk: 5000, sell: 7500 },
  { product: "sweet cheeks", genre: "blush", brand: "NYX", bulk: 5000, sell: 7500 },
  { product: "slip tease", genre: "lip lacquer", brand: "NYX", bulk: 4500, sell: 6500 },
  { product: "NYX Matte lipstick", genre: "matte lip sticks", brand: "NYX", bulk: 4000, sell: 5500 },
  { product: "Filler instincts", genre: "Lip color", brand: "NYX", bulk: 4000, sell: 5500 },
  { product: "HD Studio photogenic", genre: "foundation", brand: "NYX", bulk: 9000, sell: 13000 },
  { product: "Smookey Fume", genre: "Eye shadow palette", brand: "NYX", bulk: 4500, sell: 6500 },
  { product: "Total control PRO", genre: "foundation", brand: "NYX", bulk: 10000, sell: 12500 },
  { product: "Tango with", genre: "Bronzing powder", brand: "NYX", bulk: 5000, sell: 7000 },
  { product: "Ultimate Edit", genre: "Eye shadow pallette", brand: "NYX", bulk: 6000, sell: 8500 },
  { product: "Trio love in Rio", genre: "Eye shadow", brand: "NYX", bulk: 5000, sell: 7000 },
  { product: "NYX Pro lip cream", genre: "Lip cream pallette", brand: "NYX", bulk: 5000, sell: 6500 },
  { product: "NYX Lip sticks", genre: "Mat n butter lipsticks", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "NYX Lingerie", genre: "lip stick", brand: "NYX", bulk: 4000, sell: 5000 },
  { product: "NYX eye brow powder pencil", genre: "eye brow powder pencil", brand: "NYX", bulk: 2500, sell: 3500 },
  { product: "Control freak", genre: "eye brow gel 3 IN 1", brand: "NYX", bulk: 4000, sell: 5000 },
  { product: "NYX auto eye brow pencil", genre: "Eye pencils with brush", brand: "NYX", bulk: 2500, sell: 3500 },
  { product: "NYX above and beyond concealer", genre: "Concealer", brand: "NYX", bulk: 4000, sell: 6000 },
  { product: "NYX", genre: "pigments", brand: "NYX", bulk: 3000, sell: 3500 },
  { product: "Cosmic metals", genre: "Lip cream", brand: "NYX", bulk: 2500, sell: 3500 },
  { product: "Lingerie Push up", genre: "Long lasting lipstick", brand: "NYX", bulk: 4000, sell: 4500 },
  { product: "Powder Puff Lippie", genre: "powder lip cream", brand: "NYX", bulk: 4000, sell: 4500 },
  { product: "Born to glow large", genre: "Naturally Radiant foundation", brand: "NYX", bulk: 8000, sell: 11000 },
  { product: "Born to glow small", genre: "Radiant concealer", brand: "NYX", bulk: 4500, sell: 6000 },
  { product: "Mineral matte", genre: "Finishing powder", brand: "NYX", bulk: 8000, sell: 10000 },
  { product: "Can't stop,won't stop", genre: "Setting powder", brand: "NYX", bulk: 8000, sell: 11000 },
  { product: "HD Studio photogenic", genre: "Finishing powder", brand: "NYX", bulk: 8000, sell: 11000 },
  { product: "Filler instincts", genre: "lip gloss", brand: "NYX", bulk: 2500, sell: 3500 },
  { product: "Studio touch photo loving", genre: "Primer", brand: "NYX", bulk: 6500, sell: 7500 },
  { product: "Glitter goals", genre: "Cream glitter pallette", brand: "NYX", bulk: 6000, sell: 7500 },
  { product: "Ultimate multi finish", genre: "Shadow pallette", brand: "NYX", bulk: 7000, sell: 10000 },
  { product: "Tripple shadow for sexy babe's eyes only", genre: "Eye shadow palette", brand: "NYX", bulk: 5000, sell: 6500 },
  { product: "NYX Whipped", genre: "lip n cheek cream", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "Keeping it tight", genre: "Eye liner pencil", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "Dip,shape,go", genre: "brow pomade", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "NYX 3 in 1", genre: "Brow pencils", brand: "NYX", bulk: 4000, sell: 6500 },
  { product: "Supper Skinny", genre: "Eye markers", brand: "NYX", bulk: 4000, sell: 4500 },
  { product: "NYX Wonder stick", genre: "Highligh and contour stick", brand: "NYX", bulk: 4000, sell: 5000 },
  { product: "Lip of the day", genre: "Liquid lip liner", brand: "NYX", bulk: 3000, sell: 4000 },
  { product: "line and load 2 in 1 lippie", genre: "Lip liner n cream", brand: "NYX", bulk: 3500, sell: 4000 },
  { product: "Hydratouch", genre: "oil primer", brand: "NYX", bulk: 6500, sell: 8000 },
  { product: "Bare with me", genre: "Radiant perfecting primer", brand: "NYX", bulk: 7000, sell: 8500 },
  { product: "Bare with me", genre: "jelly primer", brand: "NYX", bulk: 7000, sell: 8500 },
  { product: "Bare with me", genre: "Tinted skin veil tube", brand: "NYX", bulk: 6000, sell: 7500 },
  { product: "Bare with me", genre: "Brow setter", brand: "NYX", bulk: 4000, sell: 5000 },
  { product: "Liquid suede", genre: "lip cream", brand: "NYX", bulk: 2500, sell: 3000 },
  { product: "BB beauty", genre: "Balm/Primer", brand: "NYX", bulk: 5000, sell: 6500 },
  { product: "Cant stop,wont stop", genre: "Full coverage foundation", brand: "NYX", bulk: 10000, sell: 13000 },
  { product: "NYX super fat", genre: "eye marker", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "NYX Liquid lipstick", genre: "liquid lipstick", brand: "NYX", bulk: 3500, sell: 4500 },
  { product: "POWER GRIP PRIMER", genre: "PRIMER", brand: "ELF", qty: 5, bulk: 10000, price: 12000 },
  { product: "SETTING MIST", genre: "SETTING SPRAY", brand: "ELF", qty: 3, bulk: 10000, price: 13000 },
  { product: "ALWAYS ON", genre: "FOUNDATION", brand: "SMASHBOX", qty: 4, bulk: 33000, price: 35500 },
  { product: "CONCEALERS", genre: "CONCEALEERS", brand: "SMASHBOX", qty: 6, bulk: 23000, price: 25500 },
  { product: "WATER PROOF", genre: "MASCARA", brand: "SMASHBOX", qty: 4, bulk: 18000, price: 19000 },
  { product: "SUPER FAN", genre: "MASCARA", brand: "SMASHBOX", qty: 2, bulk: 18000, price: 19000 },
  { product: "CONCEALERS", genre: "CONCEALEERS", brand: "BOBBI BROWN", qty: 8, bulk: 22000, price: 23000 },
  { product: "FOUNDATION", genre: "FOUNDATION", brand: "BOBBI BROWN", qty: 10, bulk: 40000, price: 38000 },
  { product: "CONCEALERS", genre: "CONCEALEERS", brand: "TOO FACED", qty: 8, bulk: 28000, price: 29500 },
  { product: "LONGWEAR", genre: "FOUNDATION", brand: "TOO FACED", qty: 18, bulk: 35000, price: 39000 },
  { product: "DOUBLE WEAR", genre: "FOUNDATION", brand: "ESTEE LAUDER", qty: 6, bulk: 40000, price: 41000 },
  { product: "DOUBLE WEAR POWDER", genre: "POWDER", brand: "ESTEE LAUDER", qty: 8, bulk: 33000, price: 35000 },
  { product: "DOUBLE WEAR CONCEALER", genre: "CONCEALER", brand: "ESTEE LAUDER", qty: 7, bulk: 28000, price: 29500 },
  { product: "LONGWEAR LIPSTICKS", genre: "LIPSTICKS", brand: "ESTEE LAUDER", qty: 5, bulk: 23000, price: 24000 },
  { product: "EYE CONCENTRATE", genre: "EYE SERUM", brand: "ESTEE LAUDER", qty: 1, bulk: 55000, price: 56000 },
  { product: "FACE&NECK CREAM", genre: "CREAM", brand: "ESTEE LAUDER", qty: 1, bulk: 100000, price: 102000 },
  { product: "FOUNDATION", genre: "FOUNDATION", brand: "MAC", qty: 12, bulk: 26000, price: 28000 },
  { product: "POWDER TO FOUNDATION", genre: "POWDER", brand: "MAC", qty: 6, bulk: 24000, price: 27000 },
  { product: "EYE HYDRO FILLER", genre: "EYE SERUM", brand: "CLINIC", qty: 1, bulk: 31000, price: 33000 },
  { product: "WRINKLE CORRECTING CREAM", genre: "EYE CREAM", brand: "CLINIC", qty: 1, bulk: 40000, price: 41000 },
  { product: "UNTIL DAWN SPRAY", genre: "SETTING SPRAY", brand: "ONE SIZE", qty: 3, bulk: 25000, price: 27000 },
  { product: "SETTING POWDER", genre: "SETTING POWDER", brand: "ONE SIZE", qty: 3, bulk: 27000, price: 30000 },
  { product: "BLUSHED ROUGE", genre: "BLUSH", brand: "JUVIA", qty: 1, bulk: 15000, price: 17000 },
  { product: "THE WARRIOR", genre: "EYE SHADOW PALETTE", brand: "JUVIA", qty: 1, bulk: 15000, price: 18000 },
  { product: "THE ROYALTY", genre: "LOOSE HIGHLIGHTER", brand: "JUVIA", qty: 2, bulk: 11000, price: 13000 }
];

const FCFA = (amount) => {
  if (typeof amount !== "number" || isNaN(amount)) return "-";
  return `${amount.toLocaleString()} FCFA`;
};

function getSubCatInfoByName(allSubCategory, genreName) {
  return allSubCategory.find(sub =>
    sub.name.trim().toLowerCase() === genreName.trim().toLowerCase()
  );
}

function getMainAndSubCat(allCategory, allSubCategory, genreName) {
  const subCat = getSubCatInfoByName(allSubCategory, genreName);
  if (!subCat || !subCat.category?.length) return null;
  const mainCat = allCategory.find(cat => cat._id === subCat.category[0]._id);
  if (!mainCat) return null;
  return { mainCat, subCat };
}

export default function BrandPage() {
  const allCategory = useSelector(state => state.product.allCategory);
  const allSubCategory = useSelector(state => state.product.allSubCategory);
  const router = useRouter();

  const handleGoToSubCat = (genreName) => {
    const found = getMainAndSubCat(allCategory, allSubCategory, genreName);
    if (!found) return;
    const { mainCat, subCat } = found;
    const url = `/${valideURLConvert(mainCat.name)}-${mainCat._id}/${valideURLConvert(subCat.name)}-${subCat._id}`;
    router.push(url);
  };

  const allProductNames = makeupProducts.map(p => p.product).join(", ");
  const allBrands = Array.from(new Set(makeupProducts.map(p => p.brand))).join(", ");
  const allGenres = Array.from(new Set(makeupProducts.map(p => p.genre))).join(", ");
  const siteUrl = "https://www.esmakeupstore.com/brands";
  const siteName = "Essentialist Makeup Store";
  const ogImage = "https://www.esmakeupstore.com/assets/staymattebutnotflatpowderfoundationmain.jpg";
  const structuredProducts = makeupProducts.slice(0, 20).map(item => ({
    "@type": "Product",
    "name": item.product,
    "brand": { "@type": "Brand", "name": item.brand },
    "category": item.genre,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "XAF",
      "price": item.sell ?? item.price ?? "-",
      "availability": "https://schema.org/InStock"
    }
  }));

  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen py-10 px-2 md:px-10">
      <Head>
        <title>Makeup Brands: NYX, JUVIA, ONE SIZE, BOBBI BROWN, SMASHBOX, ELF, ESTEE LAUDER, MAC, CLINIC, LA Girl Price List | {siteName}</title>
        <meta name="description" content={`Discover the best makeup brands in Cameroon: NYX, LA Girl, JUVIA, ONE SIZE, BOBBI BROWN, SMASHBOX, ELF, ESTEE LAUDER, MAC, CLINIC, and more. Explore our price list and shop foundations, lipsticks, powders, and authentic beauty products. Fast delivery, best FCFA prices in Douala and nationwide.`} />
        <meta name="keywords" content={`makeup brands, Cameroon makeup, NYX Cameroon, LA Girl makeup, authentic brands, Douala makeup store, ${allBrands}, ${allGenres}, ${allProductNames}, Essentialist Makeup Store`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content={`Authentic Makeup Brands Cameroon | Price List | ${siteName}`} />
        <meta property="og:description" content="Shop NYX, LA Girl & more at Essentialist Makeup Store Cameroon. See prices for foundation, lipstick, powder. Fast delivery, best prices!" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:alt" content="NYX and LA Girl Makeup Cameroon" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:title" content={`Makeup Brands Cameroon | NYX, LA Girl | ${siteName}`} />
        <meta name="twitter:description" content="Discover and shop NYX, LA Girl, and more makeup brands in Cameroon. Authentic products, best FCFA prices at Essentialist Makeup Store." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="Best Makeup Brands Cameroon" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            "name": siteName,
            "url": siteUrl,
            "logo": ogImage,
            "image": [
              ogImage,
              "https://www.esmakeupstore.com/assets/NYX-PMU-Makeup-Lips-Liquid-Lipstick-LIP-LINGERIE-XXL-LXXL28-UNTAMABLE-0800897132187-OpenSwatch.webp",
              "https://www.esmakeupstore.com/assets/800897085421_duochromaticilluminatingpowder_twilighttint_alt2.jpg"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Douala",
              "addressLocality": "Douala",
              "addressCountry": "CM"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+237655225569",
              "contactType": "customer support",
              "areaServed": "CM"
            },
            "sameAs": [
              "https://www.facebook.com/esmakeupstore",
              "https://www.instagram.com/esmakeupstore"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Makeup Brand Price List",
            "itemListElement": structuredProducts.map((prod, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "item": prod
            }))
          })}
        </script>
      </Head>
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-pink-500 mb-2 tracking-tight">ESSENTIALIST MAKEUP STORE</h1>
        <h2 className="text-xl md:text-3xl text-gray-700 font-bold mb-1">Build & Brand — Makeup Brands Price List</h2>
        <p className="text-pink-500 font-bold">Discover authentic NYX and LA Girl makeup brands at the best prices in Cameroon!</p>
      </header>
      <div className="overflow-x-auto rounded-lg border border-pink-200 shadow-lg bg-white">
        <table className="min-w-full text-sm md:text-base">
          <thead>
            <tr className="bg-pink-100 text-black">
              <th className="py-3 px-2 md:px-4 font-bold text-left">Product</th>
              <th className="py-3 px-2 md:px-4 font-bold text-left">Subcategory</th>
              <th className="py-3 px-2 md:px-4 font-bold text-left">Brand</th>
              <th className="py-3 px-2 md:px-4 font-bold text-right">Bulk Price (FCFA)</th>
              <th className="py-3 px-2 md:px-4 font-bold text-right">Selling Price (FCFA)</th>
            </tr>
          </thead>
          <tbody>
            {makeupProducts.map((item, idx) => {
              const found = getMainAndSubCat(allCategory, allSubCategory, item.genre);
              const clickable = !!found;
              return (
                <tr key={item.product + idx} className={idx % 2 === 0 ? "bg-white" : "bg-pink-50"}>
                  <td className="py-2 px-2 md:px-4 font-bold md:font-normal">{item.product}</td>
                  <td className="py-2 px-2 md:px-4">
                    {clickable ? (
                      <button
                        onClick={() => handleGoToSubCat(item.genre)}
                        className="underline text-blue-700 hover:text-pink-400 transition font-medium cursor-pointer bg-transparent border-0 p-0"
                        style={{ outline: "none" }}
                        type="button"
                      >
                        {item.genre}
                      </button>
                    ) : (
                      <span className="text-gray-400">{item.genre}</span>
                    )}
                  </td>
                  <td className="py-2 px-2 md:px-4 text-black font-bold md:font-normal">{item.brand}</td>
                  <td className="py-2 px-2 md:px-4 text-right font-bold  text-green-500">{FCFA(item.bulk)}</td>
                  <td className="py-2 px-2 md:px-4 text-right font-bold text-pink-500">{FCFA(item.sell ?? item.price)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <section className="mt-12 md:mt-16 bg-pink-100 rounded-lg shadow-lg p-6 md:p-10 max-w-2xl mx-auto text-center font-bold">
        <h3 className="text-2xl font-bold text-pink-500 mb-2">Contact Us — Buy Top Makeup Brands in Cameroon</h3>
        <p className="text-gray-700 mb-4">
          For orders, business enquiries, or partnership with authentic makeup brands in Cameroon (NYX, LA Girl, JUVIA, ONE SIZE, BOBBI BROWN, SMASHBOX, ELF, ESTEE LAUDER, MAC, CLINIC, and more), reach out to Essentialist Makeup Store. We supply genuine international and Cameroonian makeup brands at the best FCFA prices in Douala and nationwide.
        </p>
        <div className="flex flex-col items-center gap-2">
          <a
            href="tel:+237655225569"
            className="font-bold text-pink-500 hover:text-pink-400 underline"
            title="Call Essentialist Makeup Store"
          >
            Call/WhatsApp: +237 655 22 55 69
          </a>
          <a
            href="mailto:info@esmakeupstore.com"
            className="font-bold text-pink-500 hover:text-pink-400 underline"
            title="Email Essentialist Makeup Store"
          >
            Email: info@esmakeupstore.com
          </a>
        </div>
        <p className="mt-4 text-gray-600 text-sm">
          Visit us in Douala or shop online for the widest range of makeup, cosmetics, and beauty brands in Cameroon. Fast delivery, secure payment, and expert advice on all major makeup brands!
        </p>
      </section>
    </div>
  );
}

