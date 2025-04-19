"use client"
import { useState } from 'react';
import axios from 'axios'
import Link from 'next/link';

export default function Page() {
  const baseUrl = "https://chat-ah4i.onrender.com";
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(false);
  const [loading, setLoading] = useState(false)

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true)
    try{
        const response = await axios.post(`${baseUrl}/api/v1/signup`,{
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
        setLoading(false);
        setMsg(true);
    }catch(err){
      setLoading(false);
      console.log("Error in signup ",err)
    }
  }
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#3d5769]">
        {loading ? <div className='text-white font-bold text-xl'>Loading.....</div>:
        (<form onSubmit={handleSignup} className="space-y-4 p-8 rounded-xl bg-white w-80">
          {msg ? <div className='p-3 text-sm text-green-500 bg-green-50 rounded-md text-center'>Account created successfully!</div>:
          (<div className='space-y-4'>
            <h2 className="text-2xl font-bold text-center">Create your account</h2>
            <input type="fullname" placeholder="enter your full name" required
            className="border rounded-lg p-2 w-full" value={fullname} onChange={e => setFullname(e.target.value)}/>
            <input type="username" placeholder="create a unique user name" required
            className="border rounded-lg p-2 w-full" value={username} onChange={e => setUsername(e.target.value)}/>
            <input type="password" placeholder="create a password" required
            className="border rounded-lg p-2 w-full" value={password} onChange={e => setPassword(e.target.value)}/>
            <button className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Signup</button>
          </div>)
          }
          <p className="text-sm text-center">
            Already have an account? <Link href="/" className="text-blue-600">Login</Link>
          </p>
        </form>)
        }
        
      </div>
    );
}
