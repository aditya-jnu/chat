"use client";
import React, {use, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Video from 'twilio-video';
import Nav from "@/components/ui/Nav";
import { FaRegUser } from "react-icons/fa";

export default function Page({ params }) {
    const router = useRouter()
    const { code } = use(params);
    const [room, setRoom] = useState(null);
    const [token, setToken] = useState(null);
    const [localTracks, setLocalTracks] = useState([]);
    const [remoteParticipants, setRemoteParticipants] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [shareLink, setLink] = useState('')
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    const user = useSelector((state) => state.user.userinfo);
    const load = useSelector((state) => state.user.load)

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
        setRoom(code)
    },[code])

    const identity = user ? user.username: "user";
    const baseUrl = "https://chat-ah4i.onrender.com";   
    
    const joinRoom = async() =>{
        try{
            const localVideoTrack = await Video.createLocalVideoTrack();
            const localAudioTrack = await Video.createLocalAudioTrack();
            const actualTracks = Array.from(connectedRoom.localParticipant.tracks.values()).map(p => p.track);
            setLocalTracks(actualTracks);

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
        try {
            if (token) joinRoom();
            else{
                const response = await fetch(`${baseUrl}/api/v1/room?identity=${identity}&room=${room}`);
                const data = await response.json();
                setToken(data.token);
            }
        } catch (error) {
            console.error('Error fetching token:', error);
        }
    };

    useEffect(() => {
        if (token && !isConnected) joinRoom();
    }, [token]);

    const handleParticipantConnected = (participant) => {
        participant.tracks.forEach((publication) => {
            if (publication.isSubscribed) {
                handleTrackSubscribed(publication.track, participant.identity);
            }
        });
        participant.on('trackSubscribed', (track) => handleTrackSubscribed(track, participant.identity));
        participant.on('trackUnsubscribed', handleTrackUnsubscribed);
    };

    const handleParticipantDisconnected = (participant) => {
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
        if(room) room.disconnect();
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        alert('Link copied to clipboard!');
    };

    const toggleMute = () => {
        const audioTrack = localTracks.find(track => track.kind === 'audio');
        console.log(audioTrack)
        if (!audioTrack) {
            console.warn("No audio track found");
            return;
        }
        const newEnabledState = !audioTrack.enabled;
        audioTrack.enabled = newEnabledState;
        setIsAudioMuted(!newEnabledState);
        console.log("Toggled mute. Track enabled:", newEnabledState);
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
                        <p className="text-black flex items-center gap-1"><span><FaRegUser/></span><span>{identity}</span></p>
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
                <div className='w-[330px] border rounded-xl  bg-white'>
                    <div id="local-video-container" className='rounded-xl'>
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
                            height="240"
                            muted
                        />
                        ) : null
                        )}
                    </div>
                    <div>
                        {isConnected ? 
                        (<div className="flex items-center justify-between m-1">
                            <p className="text-black flex items-center gap-1"><span><FaRegUser/></span><span>{identity?identity:null}</span></p>
                            <div className="flex gap-1">
                            <button onClick={toggleMute}
                             className="p-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            >
                            {isAudioMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button onClick={handleLeaveRoom}
                             className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer">
                            Leave Room</button>
                            </div>
                        </div>):
                        (<button onClick={fetchToken} disabled={isConnected}
                        className='w-full p-2 rounded-md bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer'>
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