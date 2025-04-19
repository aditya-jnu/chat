"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setUserinfo, setLoad } from "../redux/slices/userslice";

export default function AppInit() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userinfo);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("token ",token)
    if (!token || user){
      dispatch(setLoad(false));
      return;
    }

    axios.get(`${baseUrl}/api/v1/me`, {
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
        dispatch(setLoad(false));
      });
  }, [dispatch, user]);

  return null;
}
