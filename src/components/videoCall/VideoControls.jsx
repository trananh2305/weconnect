import { useVideoCallContext } from "@context/VideoCallProvider";
import { Mic, MicOff, PhoneDisabled, Videocam, VideocamOff } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { set } from "lodash";
import { useState } from "react";

const VideoControls = () => {
  const { endCurrentCall, localStream } = useVideoCallContext();

  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);

  const toggleAudio = () => {
    if (!localStream) return;

    const audioTrack = localStream.getAudioTracks();

    audioTrack.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = () => {
    if (!localStream) return;

    const videoTracks = localStream.getVideoTracks();

    videoTracks.forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsVideoEnabled(!isVideoEnabled);
  };

  return (
    <div className="flex justify-center gap-3">
      <IconButton onClick={toggleAudio}>
        {isAudioEnabled ? (
          <MicOff className="text-gray-300" />
        ) : (
          <Mic className="text-gray-300" />
        )}
      </IconButton>
      <IconButton onClick={endCurrentCall}>
        <PhoneDisabled className="text-red-500" />
      </IconButton>
      <IconButton onClick={toggleVideo}>
      {
        isVideoEnabled ? (
          <VideocamOff className="text-gray-300" />
        ) : (
          <Videocam className="text-gray-300 line-through" />
        )
      }
        
      </IconButton>
    </div>
  );
};

export default VideoControls;
