"use client";
import React, {use, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Video from 'twilio-video';
import Nav from "@/components/ui/Nav";

export default function Page({ params }) {
    const router = useRouter()
    const { code } = use(params);
    const [room, setRoom] = useState(null);
    const [token, setToken] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteParticipants, setRemoteParticipants] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [shareLink, setLink] = useState('')

    const user = useSelector((state) => state.user.userinfo);
    const load = useSelector((state) => state.user.load)
    console.log("user", user);
    console.log("load ",load);

    useEffect(() => {
        if (typeof window !== 'undefined') {
          setLink(`${window.location.origin}/room/${code}`);
        }
      }, [code]);

    useEffect(() => {
        if (!load && !user) {
          router.push("/");
        }
    },[load, user, router])

    useEffect(()=>{
        console.log("roomcode ",code)
        setRoom(code)
    },[code])

    const identity = user ? user.username: "user";
    console.log("user ", identity)
    const baseUrl = "https://chat-ah4i.onrender.com";   
    
    const joinRoom = async() =>{
        try{
            const localVideoTrack = await Video.createLocalVideoTrack();
            const localAudioTrack = await Video.createLocalAudioTrack();
            setLocalTracks([localVideoTrack, localAudioTrack]);

            const connectedRoom = await Video.connect(token, {
                name: room,
                tracks: [localVideoTrack, localAudioTrack],
            });
            setRoom(connectedRoom);
            setIsConnected(true);

            // Handle remote participants
            connectedRoom.participants.forEach(handleParticipantConnected);
            connectedRoom.on('participantConnected', handleParticipantConnected);
            connectedRoom.on('participantDisconnected', handleParticipantDisconnected);

            // Cleanup on disconnect
            connectedRoom.once('disconnected', (room) => {
                room.localParticipant.tracks.forEach((publication) => {
                    publication.track.stop();
                });
                setRoom(null);
                setLocalTracks([]);
                setRemoteParticipants([]);
                setIsConnected(false);
            });
        }
        catch(error){
            console.error('Error connecting to room:', error);
        }
    }

    const fetchToken = async () => {
        console.log("Fetching token......")
        try {
            if (token) {
                console.log("prev token ",token)
                joinRoom();
            }
            else{
                const response = await fetch(`${baseUrl}/api/v1/room?identity=${identity}&room=${room}`);
                const data = await response.json();
                console.log("new token ",data)
                setToken(data.token);
            }
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    useEffect(() => {
        if (token && !isConnected) {
            joinRoom();
        }
    }, [token]);

    const handleParticipantConnected = (participant) => {
        console.log(`Participant connected: ${participant.identity}`);
        participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
                handleTrackSubscribed(publication.track, participant.identity);
            }
        });
        participant.on('trackSubscribed', (track) => handleTrackSubscribed(track, participant.identity));
        participant.on('trackUnsubscribed', handleTrackUnsubscribed);
    };

    const handleParticipantDisconnected = (participant) => {
        console.log(`Participant disconnected: ${participant.identity}`);
        setRemoteParticipants((prevParticipants) =>
            prevParticipants.filter((p) => p.participant !== participant)
        );
    };

    const handleTrackSubscribed = (track, identity) => {
        setRemoteParticipants((prevParticipants) => [
            ...prevParticipants,
            { track, identity },
        ]);
    };

    const handleTrackUnsubscribed = (track) => {
        setRemoteParticipants((prevParticipants) =>
            prevParticipants.filter((p) => p.track !== track)
        );
    };

    const handleLeaveRoom = () => {
        if (room) {
            room.disconnect();
        }
    };

    const handleCopy = () => {
        console.log("shareLink ", shareLink)
        navigator.clipboard.writeText(shareLink);
        alert('Link copied to clipboard!');
    };

    if(load) return <div className="min-h-screen flex justify-center items-center">Loading......</div>
    if(!user)return <div className="min-h-screen flex justify-center items-center">Redirecting......</div>
    
    return (
        <div>
        <div><Nav/></div>
        <div className='bg-black min-h-[calc(100vh-80px)] w-screen p-2'>
            <div className="flex justify-center"><button className="bg-white p-2 rounded-xl cursor-pointer" onClick={handleCopy}>Copy room link</button></div>
            <div>

                {/* ***** remote participant ***** */}
                <div id="remote-video-container" className='border m-1'>
                    {remoteParticipants.map(({ track, identity, }, index) =>
                        track.kind === 'video' ? (
                        <div key={index} className="w-[330px] border rounded-xl p-1 bg-white">
                        <p>{identity}</p>
                        <video key={index}
                            ref={(video) => {
                                if(video){
                                    const stream = new MediaStream([track.mediaStreamTrack]);
                                    video.srcObject = stream;
                                    video.onloadedmetadata = () => {
                                      video.play().catch((e) => {
                                        console.warn("Auto-play was prevented:", e);
                                      });
                                    };
                                }
                            }}
                            width="320"
                            height="240"
                        />
                        </div>
                        ) : 
                        track.kind === 'audio' ? (
                        <audio key={index}
                            ref={(audio) => {
                                if (audio) {
                                    audio.srcObject = new MediaStream([track.mediaStreamTrack]);
                                    audio.play();
                                }
                            }}
                        />
                        ) : null
                    )}
                </div>

                {/* ***** local participant ***** */}
                <div className='w-[330px] border rounded-xl p-1 bg-white'>
                    <div id="local-video-container" className='mb-1 rounded-xl'>
                        {localTracks.map((track, index) =>
                        track.kind === 'video' ? (
                        <video key={index}
                            ref={(video) => {
                                if(video){
                                    const stream = new MediaStream([track.mediaStreamTrack]);
                                    video.srcObject = stream;
                                    video.onloadedmetadata = () => {
                                      video.play().catch((e) => {
                                        console.warn("Auto-play was prevented:", e);
                                      });
                                    };
                                }
                            }}
                            width="320"
                            height="240"
                            muted
                        />
                        ) : null
                        )}
                    </div>
                    <div>
                        {isConnected ? 
                        (<div className="flex items-center justify-between">
                            <p className="text-black">{identity?identity:null}</p>
                            <button onClick={handleLeaveRoom}
                             className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer">
                            Leave Room</button>
                        </div>):
                        (<button onClick={fetchToken} disabled={isConnected}
                        className='px-6 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'>
                        Start Video Call
                        </button>)
                        }
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};