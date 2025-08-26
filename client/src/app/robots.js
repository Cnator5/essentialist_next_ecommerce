// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard'],
    },
    sitemap: 'https://www.esmakeupstore.com/sitemap.xml',
    host: 'https://www.esmakeupstore.com',
  }
}