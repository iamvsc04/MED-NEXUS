import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);

  // Extract Room ID and Role from URL
  const params = new URLSearchParams(window.location.search);
  const roomId = window.location.pathname.split('/').pop();
  const role = params.get('role');

  if (!roomId || !role) {
    console.error("Room ID or role is missing.");
    alert("Invalid video call link. Please check your link or try again.");
    return null;
  }

  useEffect(() => {
    // Connect to socket
    socket.current = io("http://localhost:3000");

    // Join the room with the correct role
    socket.current.emit("join-room", roomId, role);
    console.log(`Joined as ${role} in room: ${roomId}`);

    socket.current.on("user-connected", async (userId) => {
      console.log("User connected:", userId);
      if (role === "doctor") {
        await createOffer();
      }
    });

    socket.current.on("offer", async (offer) => {
      if (role === "patient") {
        await createAnswer(offer);
      }
    });

    socket.current.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.current.on("ice-candidate", (candidate) => {
      if (candidate) {
        peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    startVideo();

    return () => {
      socket.current.disconnect();
    };
  }, [roomId, role]);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localVideoRef.current.srcObject = stream;
      createPeerConnection(stream);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Please allow camera and microphone access.");
    }
  };

  const createPeerConnection = (stream) => {
    peerConnection.current = new RTCPeerConnection();

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", event.candidate, roomId);
      }
    };
  };

  const createOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.current.emit("offer", offer, roomId);
  };

  const createAnswer = async (offer) => {
    await peerConnection.current.setRemoteDescription(offer);
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);
    socket.current.emit("answer", answer, roomId);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Video Call - {role}</h1>
      <div className="flex space-x-8">
        <div>
          <h2>Your Video</h2>
          <video ref={localVideoRef} autoPlay playsInline className="w-96 border border-gray-400" />
        </div>
        <div>
          <h2>Remote Video</h2>
          <video ref={remoteVideoRef} autoPlay playsInline className="w-96 border border-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
