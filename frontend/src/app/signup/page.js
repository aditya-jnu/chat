"use client"
import { useState } from 'react';
import axios from 'axios'

export default function page() {
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  async function handleSignup(e) {
    e.preventDefault();
    try{
        const response = await axios.post("http://localhost:4000/api/v1/signup",{
          fullname:fullname,
          username:username, 
          password:password
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log("info ",response.data)
    }catch(err){
      console.log("Error in signup ",err)
    }
  }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3d5769]">
        <form onSubmit={handleSignup} className="space-y-4 p-8 rounded-xl bg-white w-1/3">
          <h2 className="text-2xl font-bold text-center">Create your account</h2>
          <input type="fullname" placeholder="enter your full name" required
          className="border rounded-lg p-2 w-full" value={fullname} onChange={e => setFullname(e.target.value)} />
          <input type="username" placeholder="create a unique user name" required
          className="border rounded-lg p-2 w-full" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="create a password" required
          className="border rounded-lg p-2 w-full" value={password} onChange={e => setPassword(e.target.value)} />
          {msg && <p className="text-red-500">{msg}</p>}
          <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Signup</button>
          <p className="text-sm">
            Already have an account? <a href="/" className="text-blue-600">Login</a>
          </p>
        </form>
      </div>
    );
}
