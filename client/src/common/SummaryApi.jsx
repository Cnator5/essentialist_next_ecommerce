export const baseURL = process.env.NEXT_PUBLIC_API_URL;


const SummaryApi = {
    register : {
        url : '/api/user/register',
        method : 'post'
    },
    login : {
        url : '/api/user/login',
        method : 'post'
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : 'put'
    },
    forgot_password_otp_verification : {
        url : 'api/user/verify-forgot-password-otp',
        method : 'put'
    },
    resetPassword : {
        url : "/api/user/reset-password",
        method : 'put'
    },
    refreshToken : {
        url : 'api/user/refresh-token',
        method : 'post'
    },
    userDetails : {
        url : '/api/user/user-details',
        method : "get"
    },
    logout : {
        url : "/api/user/logout",
        method : 'get'
    },
    uploadAvatar : {
        url : "/api/user/upload-avatar",
        method : 'put'
    },
    updateUserDetails : {
        url : '/api/user/update-user',
        method : 'put'
    },
    addCategory : {
        url : '/api/category/add-category',
        method : 'post'
    },
    uploadImage : {
        url : '/api/file/upload',
        method : 'post'
    },
    getCategory : {
        url : '/api/category/get',
        method : 'get'
    },
    updateCategory : {
        url : '/api/category/update',
        method : 'put'
    },
    deleteCategory : {
        url : '/api/category/delete',
        method : 'delete'
    },
    createSubCategory : {
        url : '/api/subcategory/create',
        method : 'post'
    },
    getSubCategory : {
        url : '/api/subcategory/get',
        method : 'post'
    },
    updateSubCategory : {
        url : '/api/subcategory/update',
        method : 'put'
    },
    deleteSubCategory : {
        url : '/api/subcategory/delete',
        method : 'delete'
    },
    createProduct : {
        url : '/api/product/create',
        method : 'post'
    },
    getProduct : {
        url : '/api/product/get',
        method : 'post'
    },
    getProductByCategory : {
        url : '/api/product/get-product-by-category',
        method : 'post'
    },
    getProductByCategoryAndSubCategory : {
        url : '/api/product/get-pruduct-by-category-and-subcategory',
        method : 'post'
    },
    getProductDetails : {
        url : '/api/product/get-product-details',
        method : 'post'
    },
    updateProductDetails : {
        url : "/api/product/update-product-details",
        method : 'put'
    },
    deleteProduct : {
        url : "/api/product/delete-product",
        method : 'delete'
    },
    searchProduct : {
        url : '/api/product/search-product',
        method : 'post'
    },
    addTocart : {
        url : "/api/cart/create",
        method : 'post'
    },
    getCartItem : {
        url : '/api/cart/get',
        method : 'get'
    },
    updateCartItemQty : {
        url : '/api/cart/update-qty',
        method : 'put'
    },
    deleteCartItem : {
        url : '/api/cart/delete-cart-item',
        method : 'delete'
    },
    createAddress : {
        url : '/api/address/create',
        method : 'post'
    },
    getAddress : {
        url : '/api/address/get',
        method : 'get'
    },
    updateAddress : {
        url : '/api/address/update',
        method : 'put'
    },
    disableAddress : {
        url : '/api/address/disable',
        method : 'delete'
    },
    CashOnDeliveryOrder : {
        url : "/api/order/cash-on-delivery",
        method : 'post'
    },
    GuestCashOnDeliveryOrder : {
        url : "/api/order/guest-cod",
        method : 'post'
    },
    payment_url : {
        url : "/api/order/checkout",
        method : 'post'
    },
    getOrderItems : {
        url : '/api/order/order-list',
        method : 'get'
    },
    getProductsByIds: {
        url: '/api/product/get-by-ids',
        method: 'post'
    },
    // ratings
    ratingsGet: {
        // GET /api/ratings/:productId
        url: (productId) => `/api/ratings/${productId}`,
        method: 'get'
    },
    ratingsUpsert: {
        // POST /api/ratings { productId, value }
        url: '/api/ratings',
        method: 'post'
    },
    ratingsDelete: {
        // DELETE /api/ratings/:productId
        url: (productId) => `/api/ratings/${productId}`,
        method: 'delete'
    },

    //reviews apis
    reviewsList: {
  // GET /api/reviews/:productId?limit=&page=
  url: (productId, q='') => `/api/reviews/${productId}${q}`,
  method: 'get'
},
reviewsUpsert: {
  // POST /api/reviews { productId, rating, title?, comment? }
  url: '/api/reviews',
  method: 'post'
},
reviewsDelete: {
  // DELETE /api/reviews/:productId
  url: (productId) => `/api/reviews/${productId}`,
  method: 'delete'
},
 // Add IndexNow API endpoints
    indexNowSubmitUrl: {
        url: '/api/indexnow/submit-url',
        method: 'post'
    },
    indexNowSubmitUrls: {
        url: '/api/indexnow/submit-urls',
        method: 'post'
    },
    indexNowNotifyContentChange: {
        url: '/api/indexnow/notify-content-change',
        method: 'post'
    },
    indexNowGetKey: {
        url: '/api/indexnow/key',
        method: 'get'
    },
    indexNowRegenerateKey: {
        url: '/api/indexnow/regenerate-key',
        method: 'post'
    },
}

export default SummaryApi;

