"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserinfo } from '@/components/redux/slices/userslice';

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    try{
      const response = await axios.post("http://localhost:4000/api/v1/signin",{
        username:username, 
        password:password
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log("info after signin",response.data)
      localStorage.setItem('token', response.data.token);
      console.log("action object ",setUserinfo({fullname:response.data.user.fullname, username:response.data.user.username, _id:response.data.user._id}))
      dispatch(setUserinfo({fullname:response.data.user.fullname, username:response.data.user.username, _id:response.data.user._id}));
      router.push(`/dashboard/${username}`);
    }
    catch(err){
      console.log("Error in signin ",err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3d5769]">
      <form onSubmit={handleLogin} className="space-y-4 p-8 rounded-xl bg-white w-1/3">
        <h2 className="text-2xl font-bold">Login</h2>
        <input type="username" placeholder="enter your username" required
          className="border p-2 rounded-lg w-full" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="enter your password" required
          className="border p-2 rounded-lg w-full" value={password} onChange={e => setPassword(e.target.value)} />
        {msg && <p className="text-red-500">{msg}</p>}
        <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Login</button>
        <p className="text-sm">
          Don't have an account? <a href="/signup" className="text-blue-600">Signup</a>
        </p>
      </form>
    </div>
  );
}
