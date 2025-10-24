const rawEnvBaseUrl = process.env.NEXT_PUBLIC_API_URL?.trim() ?? "";
export const baseURL = rawEnvBaseUrl.replace(/\/$/, "");

const missingEnvMessage =
  "SummaryApi: NEXT_PUBLIC_API_URL is not defined. Falling back to relative URLs — make sure this is set in your deployment environment.";

if (!baseURL) {
  if (typeof window === "undefined") {
    console.warn(missingEnvMessage);
  } else {
    console.error(missingEnvMessage);
  }
}

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "post",
  },
  login: {
    url: "/api/user/login",
    method: "post",
  },
  forgot_password: {
    url: "/api/user/forgot-password",
    method: "put",
  },
  forgot_password_otp_verification: {
    url: "api/user/verify-forgot-password-otp",
    method: "put",
  },
  resetPassword: {
    url: "/api/user/reset-password",
    method: "put",
  },
  refreshToken: {
    url: "api/user/refresh-token",
    method: "post",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "get",
  },
  logout: {
    url: "/api/user/logout",
    method: "get",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "put",
  },
  updateUserDetails: {
    url: "/api/user/update-user",
    method: "put",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "post",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "post",
  },
  getCategory: {
    url: "/api/category/get",
    method: "get",
  },
  updateCategory: {
    url: "/api/category/update",
    method: "put",
  },
  deleteCategory: {
    url: "/api/category/delete",
    method: "delete",
  },
  createSubCategory: {
    url: "/api/subcategory/create",
    method: "post",
  },
  getSubCategory: {
    url: "/api/subcategory/get",
    method: "post",
  },
  updateSubCategory: {
    url: "/api/subcategory/update",
    method: "put",
  },
  deleteSubCategory: {
    url: "/api/subcategory/delete",
    method: "delete",
  },
  createProduct: {
    url: "/api/product/create",
    method: "post",
  },
  getProduct: {
    url: "/api/product/get",
    method: "post",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "post",
  },
  getProductByCategoryAndSubCategory: {
    url: "/api/product/get-pruduct-by-category-and-subcategory",
    method: "post",
  },
  getProductDetails: {
    url: "/api/product/get-product-details",
    method: "post",
  },
  updateProductDetails: {
    url: "/api/product/update-product-details",
    method: "put",
  },
  deleteProduct: {
    url: "/api/product/delete-product",
    method: "delete",
  },
  searchProduct: {
    url: "/api/product/search-product",
    method: "post",
  },
  addTocart: {
    url: "/api/cart/create",
    method: "post",
  },
  getCartItem: {
    url: "/api/cart/get",
    method: "get",
  },
  updateCartItemQty: {
    url: "/api/cart/update-qty",
    method: "put",
  },
  deleteCartItem: {
    url: "/api/cart/delete-cart-item",
    method: "delete",
  },
  createAddress: {
    url: "/api/address/create",
    method: "post",
  },
  getAddress: {
    url: "/api/address/get",
    method: "get",
  },
  updateAddress: {
    url: "/api/address/update",
    method: "put",
  },
  disableAddress: {
    url: "/api/address/disable",
    method: "delete",
  },
  CashOnDeliveryOrder: {
    url: "/api/order/cash-on-delivery",
    method: "post",
  },
  GuestCashOnDeliveryOrder: {
    url: "/api/order/guest-cod",
    method: "post",
  },
  payment_url: {
    url: "/api/order/checkout",
    method: "post",
  },
  getOrderItems: {
    url: "/api/order/order-list",
    method: "get",
  },
  getProductsByIds: {
    url: "/api/product/get-by-ids",
    method: "post",
  },
  ratingsGet: {
    url: (productId) => `/api/ratings/${productId}`,
    method: "get",
  },
  ratingsUpsert: {
    url: "/api/ratings",
    method: "post",
  },
  ratingsDelete: {
    url: (productId) => `/api/ratings/${productId}`,
    method: "delete",
  },
  reviewsList: {
    url: (productId, q = "") => `/api/reviews/${productId}${q}`,
    method: "get",
  },
  reviewsUpsert: {
    url: "/api/reviews",
    method: "post",
  },
  reviewsDelete: {
    url: (productId) => `/api/reviews/${productId}`,
    method: "delete",
  },
  indexNowSubmitUrl: {
    url: "/api/indexnow/submit-url",
    method: "post",
  },
  indexNowSubmitUrls: {
    url: "/api/indexnow/submit-urls",
    method: "post",
  },
  indexNowNotifyContentChange: {
    url: "/api/indexnow/notify-content-change",
    method: "post",
  },
  indexNowGetKey: {
    url: "/api/indexnow/key",
    method: "get",
  },
  indexNowRegenerateKey: {
    url: "/api/indexnow/regenerate-key",
    method: "post",
  },
  createBrand: {
    url: "/api/brand/create",
    method: "post",
  },
  getBrands: {
    url: "/api/brand/list",
    method: "get",
  },
  getBrandDetails: (identifier) => ({
    url: `/api/brand/${identifier}`,
    method: "get",
  }),
  updateBrand: (id) => ({
    url: `/api/brand/update/${id}`,
    method: "put",
  }),
  deleteBrand: (id) => ({
    url: `/api/brand/delete/${id}`,
    method: "delete",
  }),
  productFilterMeta: {
    url: "/api/product/filter-meta",
    method: "post",
  },
};

function normalizePath(path = "") {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function buildUrl(path, params) {
  let url = baseURL ? `${baseURL}${normalizePath(path)}` : normalizePath(path);
  if (params && Object.keys(params).length) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => search.append(key, item));
      } else {
        search.append(key, value);
      }
    });
    const queryString = search.toString();
    if (queryString) {
      url += url.includes("?") ? `&${queryString}` : `?${queryString}`;
    }
  }
  return url;
}

export async function apiFetch(
  path,
  {
    method = "GET",
    body,
    headers = {},
    params,
    cache = "no-store",
    next,
    credentials = "include",
    signal,
    timeout = 15000,
  } = {}
) {
  const controller = signal ? null : new AbortController();
  const requestSignal = signal ?? controller.signal;

  const init = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache,
    credentials,
    signal: requestSignal,
  };

  if (next) {
    init.next = next;
  }

  const upperMethod = method.toUpperCase();
  if (body !== undefined && !["GET", "HEAD"].includes(upperMethod)) {
    init.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  const requestUrl = buildUrl(path, params);
  let timeoutId;
  if (!signal && timeout > 0) {
    timeoutId = setTimeout(() => {
      controller?.abort(new Error(`Request to ${requestUrl} timed out after ${timeout} ms`));
    }, timeout);
  }

  try {
    const response = await fetch(requestUrl, init);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API ${upperMethod} ${requestUrl} failed: ${response.status} ${response.statusText} — ${errorText}`
      );
    }

    if (response.status === 204) return null;

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export async function callSummaryApi(
  endpoint,
  { payload, params, headers, cache = "no-store", credentials = "include", signal, timeout } = {}
) {
  if (!endpoint?.url) {
    throw new Error("callSummaryApi: endpoint definition must include a url.");
  }

  const method = endpoint.method?.toUpperCase?.() ?? "GET";
  const isBodyMethod = !["GET", "DELETE", "HEAD"].includes(method);
  const body = isBodyMethod ? payload : undefined;
  const finalParams =
    !isBodyMethod && payload && typeof payload === "object"
      ? { ...(params || {}), ...payload }
      : params;

  return apiFetch(endpoint.url, {
    method,
    body,
    params: finalParams,
    headers,
    cache,
    credentials,
    signal,
    timeout,
  });
}

export { SummaryApi };
export default SummaryApi;