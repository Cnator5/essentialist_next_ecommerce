// app/sitemap.js

/**
 * Generates the sitemap for your Next.js e-commerce makeup website.
 * This implementation fetches categories, subcategories, and products from your backend API,
 * generating SEO-friendly URLs for each.
 *
 * Ensure NEXT_PUBLIC_API_URL is set in your .env file, e.g.
 * NEXT_PUBLIC_API_URL="http://localhost:1010"
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.esmakeupstore.com';

function slugify(str) {
  return (str || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '') // Remove accents
    .replace(/[^a-zA-Z0-9]+/g, '-')  // Replace non-alphanumerics with hyphens
    .replace(/^-+|-+$/g, '')         // Trim hyphens
    .toLowerCase();
}

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${path}`);
  return res.json();
}

export default async function sitemap() {
  // 1. Static pages
  const items = [
    {
      url: 'https://www.esmakeupstore.com/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.esmakeupstore.com/about',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.esmakeupstore.com/contact',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.esmakeupstore.com/new-arrival',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://www.esmakeupstore.com/brands',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  // 2. Fetch categories, subcategories, and products
  let categories = [];
  let subcategories = [];
  let products = [];
  try {
    [categories, subcategories, products] = await Promise.all([
      fetchJSON('/api/category'),
      fetchJSON('/api/subcategory'),
      fetchJSON('/api/product?publish=true'),
    ]);
  } catch (err) {
    // If your API returns { success: true, data: [...] }
    // you may need to adjust this depending on your backend response format
    categories = categories.data || [];
    subcategories = subcategories.data || [];
    products = products.data || [];
  }

  // 3. Add categories
  for (const cat of categories) {
    const catUrl = `https://www.esmakeupstore.com/${slugify(cat.name)}-${cat._id}`;
    items.push({
      url: catUrl,
      lastModified: cat.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // 4. Add subcategories
  for (const sub of subcategories) {
    // Assuming sub.category is an array of category IDs
    const parentCat = categories.find(
      c => String(c._id) === String(Array.isArray(sub.category) ? sub.category[0] : sub.category)
    );
    if (!parentCat) continue;
    const subUrl = `https://www.esmakeupstore.com/${slugify(parentCat.name)}-${parentCat._id}/${slugify(sub.name)}-${sub._id}`;
    items.push({
      url: subUrl,
      lastModified: sub.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  // 5. Add products
  for (const prod of products) {
    // Assuming prod.subCategory is an array of subcategory IDs
    const sub = subcategories.find(
      s => String(s._id) === String(Array.isArray(prod.subCategory) ? prod.subCategory[0] : prod.subCategory)
    );
    const cat = sub
      ? categories.find(
          c => String(c._id) === String(Array.isArray(sub.category) ? sub.category[0] : sub.category)
        )
      : null;

    let prodUrl;
    if (cat && sub) {
      prodUrl = `https://www.esmakeupstore.com/${slugify(cat.name)}-${cat._id}/${slugify(sub.name)}-${sub._id}/${slugify(prod.name)}-${prod._id}`;
    } else {
      prodUrl = `https://www.esmakeupstore.com/product/${prod._id}`;
    }

    items.push({
      url: prodUrl,
      lastModified: prod.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  return items;
}