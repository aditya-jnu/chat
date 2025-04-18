"use client";
import React, {use, useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import { clearUserinfo } from "@/components/redux/slices/userslice";
import InputBox from "@/components/twiliio-ui/Inputbox";

export default function Page({ params }) {
  const router = useRouter()
  const { username } = use(params);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userinfo);
  const [isLoading, setIsLoading] = useState(true);
  console.log("user", user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  },[isLoading, user])

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Redirecting...</div>;
  }

  function handleLogout(){
    console.log(clearUserinfo())
    dispatch(clearUserinfo())
  }

  return (
    <div>
      {/* ***** navbar ***** */}
      <nav className="bg-[#3d5769] text-white p-4 flex justify-between items-center shadow-md h-[80px]">
        <div className="flex items-center gap-2 text-lg font-medium">
            {/* <User className="w-5 h-5" /> */}
            <span>Hello {user?.fullname || "User"}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <FaRegUser/>
            <p>{user.username}</p>
          </div>
          <button onClick={handleLogout}
           className="p-1 rounded-lg text-white hover:bg-[#2e4451] flex justify-center items-center cursor-pointer"
          >Logout
          </button>
        </div>
        
      </nav>
      {/* ****room-code enter */}
      <InputBox/>
    </div>
  );
}
