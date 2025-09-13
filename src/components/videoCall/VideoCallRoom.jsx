import { useVideoCallContext } from "@context/VideoCallProvider";
import VideoControls from "./VideoControls";
import { useRef } from "react";
import { useEffect } from "react";

const VideoCallRoom = () => {
  const { isInCall, remoteStream, localStream } = useVideoCallContext();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    if (remoteVideoRef.current && localStream)
      remoteVideoRef.current.srcObject = remoteStream;
  }, [remoteStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream)
      localVideoRef.current.srcObject = localStream;
  }, [localStream]);



  if (!isInCall) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      <div className="relative flex-1">
        <div className="absolute inset-0 ">
          <video ref={remoteVideoRef} autoPlay playsInline  className="size-full"/>
        </div>
        <div className="absolute bottom-4 right-4 w-56 h-40 border rounded overflow-hidden">
          <video ref={localVideoRef} autoPlay playsInline className="size-full"/>
        </div>
      </div>

      <VideoControls />
    </div>
  );
};

export default VideoCallRoom;
