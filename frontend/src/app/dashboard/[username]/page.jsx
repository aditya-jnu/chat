"use client";
import React, {use, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import InputBox from "@/components/twiliio-ui/Inputbox";
import Nav from "@/components/ui/Nav";

export default function Page({ params }) {
  const router = useRouter()
  const { username } = use(params);
  const user = useSelector((state) => state.user.userinfo);
  const load = useSelector((state) => state.user.load)
  console.log("user", user);
  console.log("load ",load);

  useEffect(() => {
    if (!load && !user) {
      router.push("/");
    }
  },[load, user, router])

  if(load)return <div className="min-h-screen flex justify-center items-center">Loading......</div>
  if(!user)return <div className="min-h-screen flex justify-center items-center">Redirecting......</div>
  
  return (
    <div>
      <Nav/>
      <InputBox/>
    </div>
  );
}
