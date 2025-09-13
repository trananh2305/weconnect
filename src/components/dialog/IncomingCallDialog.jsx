import AvatarUser from "@components/Avatar";
import Button from "@components/Button";
import { useVideoCallContext } from "@context/VideoCallProvider";
import { Call, CallEnd } from "@mui/icons-material";

const IncomingCallDialog = () => {
  const {
    callerInfo = {},
    incomingCall,
    acceptCall,
    callId,
    rejectCall,
  } = useVideoCallContext();


  
  return (
    <div className="flex flex-col items-center p-6">
      <AvatarUser
        name={callerInfo?.fullName}
        imageUrl={callerInfo?.image}
        className="mb-3 !h-16 !w-16"
      />
      <p className="mb-1 text-xl font-semibold">{callerInfo?.fullName}</p>
      <p className="mb-4 text-dark-400">Incoming call...</p>
      <div className="flex w-full gap-6 justify-around">
        <Button
          variant="contained"
          inputProps={{ startIcon: <Call /> }}
          onClick={acceptCall}
        >
          Accept
        </Button>
        <Button
          variant="contained"
          inputProps={{ startIcon: <CallEnd />, color: "error" }}
          onClick={rejectCall}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};

export default IncomingCallDialog;
