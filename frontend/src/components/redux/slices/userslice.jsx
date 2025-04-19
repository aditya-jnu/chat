"use client"
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userinfo: null,
    load: true
}

const userslice = createSlice({
    name:'user',
    initialState,
    reducers: {
        setUserinfo: (state, action) => {
            state.userinfo = action.payload;
            state.load = false;
        },
        clearUserinfo: (state) => {
            state.userinfo = null;
            state.load = false;
            localStorage.removeItem('token');
        },
        setLoad: (state, action) => {
            state.load = action.payload;
        },
    }

})

export const { setUserinfo, clearUserinfo, setLoad } = userslice.actions;
export const userReducer = userslice.reducer