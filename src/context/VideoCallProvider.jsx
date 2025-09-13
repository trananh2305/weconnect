import { useState } from "react";
import { createContext, useContext } from "react";
import { socket } from "./SocketProvider";
import {
  useAnswerCallMutation,
  useEndCallMutation,
  useInitiateCallMutation,
  useRejectCallMutation,
} from "@services/videoCallApi";
import { useEffect } from "react";
import { useRef } from "react";
import VideoCallRoom from "@components/videoCall/VideoCallRoom";
import { useDispatch } from "react-redux";
import { closeDialog, openDialog } from "@redux/slices/dialogSlice";
import { openSnackbar } from "@redux/slices/snackbarSlice";

const VideoCallContext = createContext({});

export const useVideoCallContext = () => {
  return useContext(VideoCallContext);
};
const VideoCallProvider = ({ children }) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isComingCall, setIsComingCall] = useState(false);
  const [callId, setCallId] = useState(null);
  const [callerInfo, setCallerInfo] = useState(null);
  const [connection, setConnection] = useState(null);

  const pendingSdpOffer = useRef(null);
  const pendingICECandidates = useRef([]);
  // const peerConection = useRef(null);

  const [initiateCall] = useInitiateCallMutation();
  const [answerCall] = useAnswerCallMutation();
  const [endCall] = useEndCallMutation();
  const [rejectIncomingcall] = useRejectCallMutation();

  const dispatch = useDispatch();

  const setupPeerConnection = async ({ remoteUserId, callId }) => {
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.relay.metered.ca:80",
          },
          {
            urls: "turn:global.relay.metered.ca:80",
            username: "0ef7a64ac3dd8b57e54fb8bc",
            credential: "U4u25e8QesBPvAHE",
          },
          {
            urls: "turn:global.relay.metered.ca:80?transport=tcp",
            username: "0ef7a64ac3dd8b57e54fb8bc",
            credential: "U4u25e8QesBPvAHE",
          },
          {
            urls: "turn:global.relay.metered.ca:443",
            username: "0ef7a64ac3dd8b57e54fb8bc",
            credential: "U4u25e8QesBPvAHE",
          },
          {
            urls: "turns:global.relay.metered.ca:443?transport=tcp",
            username: "0ef7a64ac3dd8b57e54fb8bc",
            credential: "U4u25e8QesBPvAHE",
          },
        ],
      });
      // yeu cau quyen truy cap camera va mic
      let localStream;
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch (err) {
        console.error("Không thể truy cập camera/mic:", err);
        return null; // trả về null thay vì undefined
      }

      const remoteStream = new MediaStream();

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
      // then add cac track cua local stream vao peer connection
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      pc.onicecandidate = (event) => {
        console.log(event);
        if (event.candidate) {
          // gui candidate den nguoi nhan
          socket.emit("ICE_CANDIDATE", {
            targetUserId: remoteUserId,
            candidate: event.candidate,
            callId: callId,
          });
        }
      };

      // tao offer a gui cho b
      async function createOffer() {
        const offer = await pc.createOffer();
        console.log({ offerStr: JSON.stringify(offer), offer });
        await pc.setLocalDescription(offer);
        return offer;
      }

      // lang nghe su kien khi b gui cho a
      async function handleAnswer(answer) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        processQueuedICECandidates(pc);
      }

      // xu ly ben b
      async function handleOffer(offer) {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        processQueuedICECandidates(pc);

        return answer;
      }

      function processQueuedICECandidates(peerConection) {
        if (pendingICECandidates.current.length > 0) {
          pendingICECandidates.current.forEach(async (candidate) => {
            try {
              await peerConection.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            } catch (error) {
              console.error("Error adding received ICE candidate", error);
            }
          });
        }
        pendingICECandidates.current = [];
      }

      const closeConnection = () => {
        localStream.getTracks().forEach((track) => track.stop());
        pc.close();
      };

      const handleNewCandidate = async (candidate) => {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      };

      return {
        pc,
        createOffer,
        handleAnswer,
        handleOffer,
        closeConnection,
        localStream,
        remoteStream,
        handleNewCandidate,
        processQueuedICECandidates,
      };
    } catch (error) {
      console.log(error);
    }
    //cau hinh peer connection
  };

  async function startCall(userId) {
    try {
      const res = await initiateCall(userId);
      if (res.error) {
        dispatch(
          openSnackbar({ type: "error", message: res.error?.data?.message })
        );
        return;
      }
      const peerConection = await setupPeerConnection({
        callId: res.data?.callId,
        remoteUserId: userId,
      });

      setIsInCall(true);
      setConnection(peerConection);
      setCallId(res.data?.callId);

      const offder = await peerConection.createOffer();
      socket.emit("SDP_OFFER", {
        targetUserId: userId,
        sdp: offder,
        callId: res.data.callId,
      });

      return res.data.callId;
    } catch (error) {
      dispatch(openSnackbar({ type: "error", message: error.message }));
    }
  }

  async function acceptCall() {
    if (!isComingCall) return;

    await answerCall(callId).unwrap();

    const connection = await setupPeerConnection({
      callId,
      remoteUserId: callerInfo._id,
    });

    setConnection(connection);

    if (pendingSdpOffer.current) {
      const answer = await connection.handleOffer(pendingSdpOffer.current);

      socket.emit("SDP_ANSWER", {
        targetUserId: callerInfo._id,
        sdp: answer,
        callId,
      });
      pendingSdpOffer.current = null;
      connection.processQueuedICECandidates(connection.pc);
    }

    setIsInCall(true);
    setIsComingCall(false);

    dispatch(closeDialog());
  }

  async function rejectCall() {
    if (!isComingCall) return;

    try {
      await rejectIncomingcall(callId).unwrap();

      cleanupCall();

      dispatch(closeDialog());
    } catch (error) {
      console.log("error reject", error);
    }
  }

  const handleIncomingCall = async (data) => {
    setIsInCall(false);
    setIsComingCall(true);
    setCallId(data.callId);
    setCallerInfo(data.caller);

    dispatch(
      openDialog({
        title: "Incoming Call",
        content: "INCOMING_CALL_DIALOG",
        closeActionType: "CALL_REJECTED",
      })
    );
  };

  // const handleSdpOffer = async (data) => {
  //   if (!connection || !isInCall) {
  //     return;
  //   }

  //   const answer = await connection.handleOffer(data.sdp);

  //   socket.emit("SDP_ANSWER", {
  //     targetUserId: callerInfo._id,
  //     sdp: answer,
  //     callId,
  //   });
  // };

  useEffect(() => {
    socket.on("INCOMING_CALL", handleIncomingCall);
    //tren user b
    socket.on("SDP_OFFER", (data) => {
      pendingSdpOffer.current = data.sdp;
    });

    socket.on("SDP_ANSWER", async (data) => {
      if (!connection || !isInCall) return;

      await connection.handleAnswer(data.sdp);
    });

    socket.on("ICE_CANDIDATE", async (data) => {
      if (!connection || !isInCall || !connection.pc.remoteDescription) {
        pendingICECandidates.current.push(data.candidate);
        return;
      }

      await connection.handleNewCandidate(data.candidate);
    });

    socket.on("CALL_ENDED", () => {
      cleanupCall();
    });

    socket.on("CALL_REJECTED", () => {
      cleanupCall();
      dispatch(
        openSnackbar({
          type: "info",
          message: "Your call was declined",
        })
      );
    });
    return () => {
      socket.off("INCOMING_CALL");
      socket.off("SDP_OFFER");
      socket.off("SDP_ANSWER");
      socket.off("ICE_CANDIDATE");
      socket.off("CALL_ENDED");
      socket.off("CALL_REJECTED");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callId, callerInfo, connection, isInCall]);

  useEffect(() => {
    if (isInCall && callId) {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        endCurrentCall();
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [isInCall, callId]);

  async function endCurrentCall() {
    if (!isInCall) return;

    await endCall(callId).unwrap();
    cleanupCall();
  }

  function cleanupCall() {
    if (connection) {
      connection.closeConnection();
    }
    setConnection(null);
    setIsInCall(false);
    setIsComingCall(false);
    setCallId(null);
    setCallerInfo(null);
  }

  return (
    <VideoCallContext.Provider
      value={{
        isInCall,
        setIsInCall,
        startCall,
        localStream: connection?.localStream,
        remoteStream: connection?.remoteStream,
        endCurrentCall,
        callerInfo,
        acceptCall,
        rejectCall,
      }}
    >
      {children}
      <VideoCallRoom />
    </VideoCallContext.Provider>
  );
};

export default VideoCallProvider;
