// import { createSlice } from "@reduxjs/toolkit";

// const GUEST_CART_KEY = "guest_cart";

// // Helper to get cart from localStorage for guests
// const getGuestCart = () => {
//     try {
//         return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
//     } catch (e) {
//         return [];
//     }
// };

// // Optionally, detect if logged in (customize for your app)
// const isLoggedIn = () => {
//     if (typeof window !== 'undefined') {
//         const user = JSON.parse(localStorage.getItem("user"));
//         return user && user._id;
//     }
//     return false; // Default return for SSR
// };

// // Initialize cart from guest cart if not logged in, else empty or populated elsewhere
// const initialState = {
//     cart: isLoggedIn() ? [] : getGuestCart()
// };

// const cartSlice = createSlice({
//     name: "cartItem",
//     initialState: initialState,
//     reducers: {
//         handleAddItemCart: (state, action) => {
//             state.cart = [...action.payload];
//         },
//     }
// });

// export const { handleAddItemCart } = cartSlice.actions;

// export default cartSlice.reducer;






// // store\cartProduct.js
// import { createSlice } from "@reduxjs/toolkit";

// const GUEST_CART_KEY = "guest_cart";

// // Helper to get cart from localStorage for guests
// const getGuestCart = () => {
//     try {
//         return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
//     } catch (e) {
//         return [];
//     }
// };

// // Optionally, detect if logged in (customize for your app)
// const isLoggedIn = () => {
//     if (typeof window !== 'undefined') {
//         const user = JSON.parse(localStorage.getItem("user"));
//         return user && user._id;
//     }
//     return false; // Default return for SSR
// };

// // Initialize cart from guest cart if not logged in, else empty or populated elsewhere
// const initialState = {
//     cart: isLoggedIn() ? [] : getGuestCart()
// };

// const cartSlice = createSlice({
//     name: "cartItem",
//     initialState: initialState,
//     reducers: {
//         handleAddItemCart: (state, action) => {
//             state.cart = [...action.payload];
//         },
//         handleClearCart: (state) => {
//             state.cart = [];
//             if (typeof window !== 'undefined') {
//                 try {
//                     localStorage.removeItem(GUEST_CART_KEY);
//                     localStorage.removeItem('guestCart');
//                 } catch (error) {
//                     console.warn("cartSlice: unable to clear guest cart storage", error);
//                 }
//             }
//         },
//     }
// });

// export const { handleAddItemCart, handleClearCart } = cartSlice.actions;

// export default cartSlice.reducer;


// store/cartProduct.js
import { createSlice } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "guest_cart";

const safeParse = (val, fallback) => {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
};

const getGuestCart = () => {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(GUEST_CART_KEY), []) || [];
};

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  const user = safeParse(localStorage.getItem("user"), null);
  return Boolean(user && user._id);
};

const initialState = {
  cart: isLoggedIn() ? [] : getGuestCart(),
};

const slice = createSlice({
  name: "cartItem",
  initialState,
  reducers: {
    handleAddItemCart: (state, action) => {
      state.cart = Array.isArray(action.payload) ? [...action.payload] : [];
      try {
        if (!isLoggedIn()) {
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(state.cart));
        }
      } catch {}
    },
    // call this ONLY after confirmed successful payment
    handleClearCart: (state) => {
      state.cart = [];
      try {
        if (!isLoggedIn()) {
          localStorage.removeItem(GUEST_CART_KEY);
        }
      } catch {}
    },
  },
});

export const { handleAddItemCart, handleClearCart } = slice.actions;
export default slice.reducer;