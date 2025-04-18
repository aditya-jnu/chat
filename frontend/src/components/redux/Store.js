"use client"
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slices/userslice";

export const store=configureStore({
    reducer:{
        user: userReducer
    }
    
})