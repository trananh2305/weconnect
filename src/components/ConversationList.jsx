import { useGetConversationsQuery } from "@services/messageApi";
import Loading from "./Loading";
import { Link, useParams } from "react-router-dom";
import { useUserInfo } from "@hooks/index";
import AvatarUser from "./Avatar";
import TimeAgo from "./TimeAgo";
import classNames from "classnames";
import { Circle } from "@mui/icons-material";

const ConversationList = () => {
  // pollingInterval: 2000 => moi 2s no se tu dong goi lai api 1 lan
  // const { data = [], isLoading } = useGetConversationsQuery(undefined, {pollingInterval:2000});
  const { data = [], isLoading } = useGetConversationsQuery();

  const { _id } = useUserInfo();

  const { userId } = useParams();

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="card !flex-col  flex !p-0 h-[calc(100vh-150px)] rounded-r-none overflow-y-auto">
      {data.map((conversation) => {
        const partner =
          conversation.sender._id === _id
            ? conversation.receiver
            : conversation.sender;

        const isActive = userId === partner._id;

        const isUnread = !conversation.seen && conversation.sender._id !== _id;

        return (
          <Link to={`/messages/${partner._id}`} key={partner._id}>
            <div
              className={classNames("flex items-center gap-2 px-4 py-2", {
                "bg-primary-main text-white transition-all relative ": isActive,
              })}
            >
              <AvatarUser
                name={partner.fullName}
                imageUrl={partner.image}
                className={classNames({
                  " text-white border-2 border-white ": isActive,
                })}
              />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="inline-block font-semibold">
                    {" "}
                    {partner.fullName}
                  </p>{" "}
                  <TimeAgo
                    date={conversation.createdAt}
                    className={classNames("text-xs text-dark-400", {
                      " text-white ": isActive,
                    })}
                  />
                </div>
                <p
                  className={classNames("text-sm text-dark-400", {
                    " text-white ": isActive,
                    "text-black font-medium": isUnread,
                  })}
                >
                  {conversation.sender._id === _id ? "You: " : null}
                  {conversation.message}
                </p>
              </div>
              {isUnread && (
                <Circle className="ml-1 !h-2 !w-2 text-primary-main absolute right-4 top-1/2" />
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
