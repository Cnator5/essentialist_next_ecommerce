import { createSlice } from "@reduxjs/toolkit";

const GUEST_CART_KEY = "guest_cart";

// Helper to get cart from localStorage for guests
const getGuestCart = () => {
    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    } catch (e) {
        return [];
    }
};

// Optionally, detect if logged in (customize for your app)
const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("user"));
        return user && user._id;
    }
    return false; // Default return for SSR
};

// Initialize cart from guest cart if not logged in, else empty or populated elsewhere
const initialState = {
    cart: isLoggedIn() ? [] : getGuestCart()
};

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload];
        },
    }
});

export const { handleAddItemCart } = cartSlice.actions;

export default cartSlice.reducer;