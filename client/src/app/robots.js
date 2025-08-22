// app/robots.js
export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: 'https://www.esmakeupstore.com/sitemap.xml',
  };
}