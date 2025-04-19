import React from 'react';
import { FaRegUser } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { clearUserinfo } from '../redux/slices/userslice';

export default function Nav() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userinfo);
    const load = useSelector((state) => state.user.load)
    console.log("user", user);
    console.log("load ",load);

    function handleLogout(){
        console.log(clearUserinfo())
        dispatch(clearUserinfo())
    }

    if(load) return <div className="min-h-screen flex justify-center items-center">Loading......</div>

    return (
        <nav className="bg-[#3d5769] text-white p-4 flex justify-between items-center shadow-md h-[80px]">
            <div className="flex items-center gap-2 text-lg font-medium">
                <span>Hello {user?.fullname || "User"}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                    <FaRegUser/>
                    <p>{user ? user.username:null}</p>
                </div>
                <button onClick={handleLogout}
                 className="p-1 rounded-lg text-white hover:bg-[#2e4451] flex justify-center items-center cursor-pointer"
                >Logout
                </button>
            </div>
      </nav>
    )
}
