"use client"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userinfo: null,
}

const userslice = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUserinfo: (state, action) => {
            state.userinfo = action.payload;
        },
        clearUserinfo: (state) => {
            state.userinfo = null;
            localStorage.removeItem('token');
        }
    }

})

export const { setUserinfo, clearUserinfo } = userslice.actions;
export const userReducer = userslice.reducer