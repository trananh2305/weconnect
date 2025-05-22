import { useUserInfo } from "@hooks/index";
import { TextField } from "@mui/material";
import {
  useGetMessagesQuery,
  useSendMessageMutation,
} from "@services/messageApi";
import classNames from "classnames";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Button from "./Button";
import { useState } from "react";

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id } = useUserInfo();

  const [newMessage, setNewMessage] = useState("");

  const { data = { messages: [], panigation: {} } } = useGetMessagesQuery({
    userId,
    offset: 0,
    limit: 10,
  });
  console.log("data", data)

  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async () => {
    await sendMessage({ message: newMessage, receiver: userId }).unwrap();
    setNewMessage("");
  };

  return (
    <div
      className={classNames(
        "card min-h-[calc(100vh-150px)] bg-dark-600 flex flex-col justify-between  rounded-l-none"
      )}
    >
      <div className="space-y-1">
        {data?.messages.map((msg) => {
          return (
            <div
              key={msg._id}
              className={classNames(
                "flex  ",
                msg.sender._id === _id ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={classNames(
                  " max-w-[70%] px-4 py-2 rounded-lg",
                  msg.sender._id === _id
                    ? " bg-primary-main text-white rounded-tr-none"
                    : "bg-white shadow rounded-tl-none"
                )}
              >
                <p>{msg.message}</p>
                <p
                  className={classNames(
                    "mt-1 text-right text-xs",
                    msg.sender._id === _id ? "  text-white/80" : "text-dark-400"
                  )}
                >
                  {dayjs(msg.createdAt).format("HH:mm")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="card flex gap-2 p-2 ">
        {/* <AccountCircle /> */}
        <TextField
          className="flex-1"
          size="small"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button
          variant="contained"
          inputProps={{ disabled: !newMessage.trim() }}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatDetail;
