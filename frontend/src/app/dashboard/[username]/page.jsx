"use client";
import React from "react";
import { use } from "react";
import { useSelector } from "react-redux";

export default function Page({ params }) {
  const { username } = use(params);
  const user = useSelector((state) => state.user.userinfo);
  console.log("user", user);

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome {user.fullname} with username as {username}!</h1>
    </div>
  );
}
