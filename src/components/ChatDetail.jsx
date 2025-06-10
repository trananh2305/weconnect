import { useUserInfo } from "@hooks/index";
import { TextField } from "@mui/material";
import {
  useGetMessagesQuery,
  useMarkConversationAsSeenMutation,
  useSendMessageMutation,
} from "@services/messageApi";
import classNames from "classnames";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import Button from "./Button";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";

const ChatDetail = () => {
  const { userId } = useParams();
  const { _id } = useUserInfo();

  const [newMessage, setNewMessage] = useState("");

  const messageEnd = useRef();

  const { data = { messages: [], panigation: {} } } = useGetMessagesQuery({
    userId,
    offset: 0,
    limit: 10,
  });

  const [sendMessage] = useSendMessageMutation();
  const [markConversation] = useMarkConversationAsSeenMutation();

  useEffect(() => {
    if (userId) {
      markConversation({ userId }).unwrap();
      messageEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userId, markConversation]);

  const handleSendMessage = async () => {
    await sendMessage({ message: newMessage, receiver: userId }).unwrap();
    setNewMessage("");

    messageEnd.current.scrollIntoView({ behavior: "smooth" });
  };

  const getGroupedMessages = (messages) => {
    const groupedByDate = messages.reduce((groups, msg) => {
      const date = dayjs(msg.createdAt).format("MM-DD-YYYY");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
      return groups;
    }, {});

    const fullyGrouped = {};
    //chuyển đổi object thành mảng tham số đầu tiền là key và thứ 2 là value
    Object.entries(groupedByDate).forEach(([date, msgs]) => {
      fullyGrouped[date] = [];
      let groupedByMinutes = null;
      msgs.forEach((msg) => {
        const time = dayjs(msg.createdAt);
        // kt xem có nên tạo mới không
        if (
          !groupedByMinutes ||
          groupedByMinutes.sender !== msg.sender._id ||
          time.diff(dayjs(groupedByMinutes.endTime), "minute") > 2
        ) {
          groupedByMinutes = {
            sender: msg.sender._id,
            startTime: msg.createdAt,
            endTime: msg.createdAt,
            messages: [msg],
          };
          fullyGrouped[date].push(groupedByMinutes);
        } else {
          groupedByMinutes.messages.push(msg);
          groupedByMinutes.endTime = msg.createdAt;
        }
      });
    });
    return fullyGrouped;
  };

  const groupedMessages = getGroupedMessages(data.messages);

  return (
    <div
      className={classNames(
        "card h-[calc(100vh-150px)] bg-dark-600 flex flex-col justify-between  rounded-l-none"
      )}
    >
      <div className="space-y-1 overflow-y-auto pb-4 flex-1">
        {Object.entries(groupedMessages).map(([date, groupedByMinutes]) => {
          return (
            <div key={date}>
              <div className="flex justify-center">
                <p className="rounded-full bg-dark-100 px-3 py-1 text-xs text-dark-600">
                  {dayjs(date).format("MMMM D, YYYY")}
                </p>
              </div>
              <div className="space-y-2">
                {groupedByMinutes.map((group) => {
                  return (
                    <div key={group.startTime} className="space-y-0.5">
                      {group.messages.map((msg, index) => {
                        const isLastIndex =
                          index === group.messages.length - 1;
                        const isFirstIndex = index === 0;

                        return (
                          <div
                            key={msg._id}
                            className={classNames(
                              "flex  ",
                              msg.sender._id === _id
                                ? "justify-end"
                                : "justify-start"
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
                              {isLastIndex && (
                                <p
                                  className={classNames(
                                    "mt-1 text-right text-xs",
                                    msg.sender._id === _id
                                      ? "  text-white/80"
                                      : "text-dark-400"
                                  )}
                                >
                                  {dayjs(msg.createdAt).format("HH:mm")}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {/* {data?.messages.map((msg) => {
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
        })} */}
        <div ref={messageEnd} />
      </div>
      <div className="card flex gap-2 p-2 ">
        {/* <AccountCircle /> */}
        <TextField
          className="flex-1"
          size="small"
          placeholder="Type your message here..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete="off"
          onKeyDown={(e) => {
            if (e.key === "Enter" && newMessage.trim()) {
              handleSendMessage();
            }
          }}
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
