"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserinfo } from "../redux/slices/userslice";

export default function AppInit() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token ",token)
    if (!token || user) return;

    axios.get("http://localhost:4000/api/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("User got from token ",response.data.user)
        console.log("action object seding from token ",setUserinfo(response.data.user))
        dispatch(setUserinfo(response.data.user));
      })
      .catch((err) => {
        console.error("Invalid or expired token", err);
        localStorage.removeItem("token");
      });
  }, [dispatch, user]);

  return null;
}
