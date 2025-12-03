import SummaryApi, { apiFetch } from "../../../common/SummaryApi";

export const productQueryKey = (productId) => ["product-details", productId];
export const ratingQueryKey = (productId) => ["product-ratings", productId];

export async function fetchProduct(productId) {
  if (!productId) {
    const error = new Error("Missing productId");
    error.status = 400;
    throw error;
  }

  const response = await apiFetch(SummaryApi.getProductDetails.url, {
    method: SummaryApi.getProductDetails.method.toUpperCase(),
    body: { productId },
  });

  if (!response?.data) {
    const error = new Error("Product not found");
    error.status = 404;
    throw error;
  }

  return response.data;
}

export async function fetchRatings(productId) {
  if (!productId) {
    return {
      average: 0,
      count: 0,
      myRating: null,
    };
  }

  const response = await apiFetch(SummaryApi.ratingsGet.url(productId), {
    method: SummaryApi.ratingsGet.method.toUpperCase(),
  });

  return (
    response?.data ?? {
      average: 0,
      count: 0,
      myRating: null,
    }
  );
}

export function productQueryOptions(productId) {
  return {
    queryKey: productQueryKey(productId),
    queryFn: () => fetchProduct(productId),
    staleTime: 60_000,
    retry: 1,
  };
}

export function ratingQueryOptions(productId) {
  return {
    queryKey: ratingQueryKey(productId),
    queryFn: () => fetchRatings(productId),
    staleTime: 30_000,
    retry: 1,
  };
}