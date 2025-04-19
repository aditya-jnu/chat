"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

export default function InputBox() {
    const router = useRouter()
    const [roomCode, setRoomCode] = useState('');

    const handleJoinRoom = () => {
        if (roomCode.trim()) {
            console.log(`Joining room with code: ${roomCode}`);
            router.push(`/room/${roomCode}`)
        } else {
            alert('Please enter a valid room code to join.');
        }
    };

    const handleCreateRoom = () =>{
        const room = Math.floor(10000 + Math.random() * 90000).toString();
        console.log("Generated Room Code:", roomCode);
        setRoomCode(room)
        console.log(`Joining room with code: ${room}`);
        router.push(`/room/${room}`)
    }

    return (
        <div className='min-h-[calc(100vh-80px)] w-screen bg-black p-2 flex flex-col justify-center items-center gap-2'>
            <div className="flex flex-col items-center gap-5 p-8 rounded-xl bg-white w-80 text-black">
                {/* joining with a code */}
                <div className='flex flex-col gap-2 w-50'>
                    <input type="text" placeholder="Enter room code" value={roomCode} 
                        onChange={(e) => setRoomCode(e.target.value)}
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={handleJoinRoom}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >Join Room</button>
                </div>
                
                <p>or</p>

                {/* creating a room */}
                <div className='flex flex-col w-50'>
                    <button onClick={handleCreateRoom}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                    >Create Room</button>
                </div>
            </div>
            <p className='text-white font-semibold text-lg'>Create your own room or join with a room code</p>
        </div>
    );
}

