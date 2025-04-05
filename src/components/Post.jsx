import { useUserInfo } from "@hooks/index";
import { Comment, ThumbUp } from "@mui/icons-material";
import { Avatar, Button, IconButton, TextField } from "@mui/material";
import classNames from "classnames";
import dayjs from "dayjs";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Link } from "react-router-dom";

const Post = ({
  postId,
  fullName = "",
  userId,
  createAt,
  content,
  image,
  likes = [],
  comments = [],
  isLike = false,
  onLike = () => {},
  onUnLike = () => {},
  onComment = () => {},
}) => {
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [comment, setComment] = useState("");
  const userInfo = useUserInfo();
  return (
    <div className="card">
      <div className="flex gap-3 mb-3">
        <Link to={`/users/${userId}`}>
          <Avatar className="!bg-primary-main">
            {fullName?.[0].toUpperCase()}
          </Avatar>
        </Link>
        <div>
          <Link to={`/users/${userId}`}>
            <p className="font-bold">{fullName}</p>
          </Link>
          <p className="text-dark-400 text-sm">
            {dayjs(createAt).format("DD/MM/YYYY HH:MM")}
          </p>
        </div>
      </div>
      <p className="mb-1">{content}</p>
      {image && <img src={image} />}
      <div className="flex justify-between my-2">
        <div className="flex gap-1 text-sm">
          <ThumbUp fontSize="small" className="text-primary-main" />
          <p>{likes.length}</p>
        </div>
        <div>
          <p>{comments.length} comments</p>
        </div>
      </div>
      <div className="border-y border-dark-300 py-1 flex ">
        <Button
          size="small"
          className={classNames("flex-1 !text-dark-100", {
            "!text-primary-main": isLike,
          })}
          onClick={isLike ? () => onUnLike(postId) : () => onLike(postId)}
        >
          <ThumbUp
            fontSize="small"
            // className={`mr-1 ${isLike ? "text-primary-main" : ""}`}
            className={classNames("mr-1", { "text-primary-main": isLike })}
          />{" "}
          Like
        </Button>
        <Button
          size="small"
          className="flex-1 !text-dark-100"
          onClick={() => setIsCommentBoxOpen(!isCommentBoxOpen)}
        >
          <Comment fontSize="small" className="mr-1" /> Comment
        </Button>
      </div>
      {isCommentBoxOpen && (
        <>
          <div
            className="py-2 max-h-48 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {[...comments].reverse().map((comment) => (
              <div key={comment._id} className="flex gap-2 px-4 py-2">
                <Avatar className="!bg-primary-main !size-6">
                  {comment.author.fullName?.[0].toUpperCase()}
                </Avatar>
                <div>
                  <div className="flex gap-1 items-center">
                    <p className="font-bold">{comment.author.fullName}</p>
                    <p className="text-dark-400 text-xs">
                      {dayjs(createAt).format("DD/MM/YYYY HH:MM")}
                    </p>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card flex gap-2 ">
            {/* <AccountCircle /> */}
            <Avatar className="!bg-primary-main !size-6">
              {userInfo.fullName?.[0]?.toUpperCase()}
            </Avatar>
            <TextField
              className="flex-1"
              size="small"
              placeholder="Comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <IconButton
              onClick={() => {
                onComment(postId, comment);
                setComment("");
                setIsCommentBoxOpen(false);
              }}
              disabled={!comment}
              data-testid="send-comment"
            >
              <SendIcon className="text-primary-main" />
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
