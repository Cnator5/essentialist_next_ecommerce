// app/product/[product]/page.js
'use client';

import ProductDisplayPage from '../../../productDisplayPage/page';

export default function Page({ params }) {
  return <ProductDisplayPage params={params} />;
}