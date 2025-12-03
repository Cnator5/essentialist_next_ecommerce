// client/src/store/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    role: "",
}

const userSlice = createSlice({
    name: 'user',
    initialState: initialValue,
    reducers: {
        setUserDetails: (state, action) => {
            state._id = action.payload?._id;
            state.name = action.payload?.name;
            state.email = action.payload?.email;
            state.avatar = action.payload?.avatar;
            state.mobile = action.payload?.mobile;
            state.role = action.payload?.role;
        },
        updatedAvatar: (state, action) => {
            state.avatar = action.payload;
        },
        logout: (state, action) => {
            state._id = "";
            state.name = "";
            state.email = "";
            state.avatar = "";
            state.mobile = "";
            state.role = "";
        },
    }
})

export const { setUserDetails, logout, updatedAvatar } = userSlice.actions;
export default userSlice.reducer;