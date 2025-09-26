const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://www.esmakeupstore.com';

function valideURLConvert(str) {
  return (str || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

async function fetchJSON(path) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Failed to fetch: ${path}`);
  return res.json();
}

export default async function sitemap() {
  const items = [
    {
      url: 'https://www.esmakeupstore.com/',
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1,
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
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.esmakeupstore.com/brands',
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let categories = [];
  let subcategories = [];
  let products = [];

  const fallbackCategories = [
    { _id: '1', name: 'SETTING POWDER', updatedAt: new Date().toISOString() },
    { _id: '2', name: 'Makeup Sets', updatedAt: new Date().toISOString() },
    { _id: '3', name: 'Foundation Makeup', updatedAt: new Date().toISOString() },
    { _id: '4', name: 'Blush Makeup', updatedAt: new Date().toISOString() },
    { _id: '5', name: 'Lip Makeup', updatedAt: new Date().toISOString() },
    { _id: '6', name: 'Eye Makeup', updatedAt: new Date().toISOString() },
    { _id: '7', name: 'Face Makeup', updatedAt: new Date().toISOString() },
  ];

  const fallbackProducts = [
    { _id: 'nyx-1', name: 'Total control drop foundation', updatedAt: new Date().toISOString(), subCategory: '3' },
    { _id: 'nyx-2', name: 'Dou chromatic lip gloss', updatedAt: new Date().toISOString(), subCategory: '5' },
    { _id: 'la-girl-1', name: 'Lip/eye liner pencil 3 in 1', updatedAt: new Date().toISOString(), subCategory: '6' },
  ];

  try {
    const [catRes, subRes, prodRes] = await Promise.all([
      fetchJSON('/api/category'),
      fetchJSON('/api/subcategory'),
      fetchJSON('/api/product?publish=true'),
    ]);
    categories = (catRes?.data || catRes || fallbackCategories);
    subcategories = (subRes?.data || subRes || []);
    products = (prodRes?.data || prodRes || fallbackProducts).filter(p => p.publish);
  } catch (err) {
    console.error('Failed to fetch sitemap data:', err);
    categories = fallbackCategories;
    products = fallbackProducts;
  }

  for (const cat of categories) {
    const catUrl = `https://www.esmakeupstore.com/${valideURLConvert(cat.name)}-${cat._id}`;
    items.push({
      url: catUrl,
      lastModified: cat.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  for (const sub of subcategories) {
    const parentCat = categories.find(
      c => String(c._id) === String(Array.isArray(sub.category) ? sub.category[0] : sub.category)
    );
    if (!parentCat) continue;
    const subUrl = `https://www.esmakeupstore.com/${valideURLConvert(parentCat.name)}-${parentCat._id}/${valideURLConvert(sub.name)}-${sub._id}`;
    items.push({
      url: subUrl,
      lastModified: sub.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.6,
    });
  }

  for (const prod of products) {
    const prodUrl = `https://www.esmakeupstore.com/product/${valideURLConvert(prod.name)}-${prod._id}`;
    items.push({
      url: prodUrl,
      lastModified: prod.updatedAt || new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.5,
    });
  }

  return items;
}