
import { Comment, ThumbUp } from "@mui/icons-material";
import {  Button, IconButton, TextField } from "@mui/material";
import classNames from "classnames";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { Link } from "react-router-dom";
import AvatarUser from "./Avatar";
import TimeAgo from "./TimeAgo";

const Post = ({
  postId,
  fullName = "",
  userId,
  createdAt,
  avatarSrc,
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
  return (
    <div className="card">
      <div className="flex gap-3 mb-3">
        <Link to={`/users/${userId}`}>
          <AvatarUser name={fullName} imageUrl={avatarSrc} />
        </Link>
        <div>
          <Link to={`/users/${userId}`}>
            <p className="font-bold">{fullName}</p>
          </Link>
          <div className="text-dark-400 text-sm">
            <TimeAgo date={createdAt}/>
          </div>
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
                <AvatarUser
                  name={comment.author?.fullName}
                  imageUrl={comment.author?.image}
                  className="!size-6"
                />
                <div>
                  <div className="flex gap-1 items-center">
                    <p className="font-bold">{comment.author.fullName}</p>
                    <div className="text-dark-400 text-xs">
                      <TimeAgo date={comment.createdAt}/>
                    </div>
                  </div>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="card flex gap-2 ">
            {/* <AccountCircle /> */}
            <AvatarUser isMyAvtar={true} className="!size-6"/>
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
                // setIsCommentBoxOpen(false);
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
