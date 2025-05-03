import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useNotifications, useUserInfo } from "@hooks/index";
import {
  useCreateCommentMutation,
  useLikesPostMutation,
  useUnLikesPostMutation,
} from "@services/postApi";

const PostList = ({ userId }) => {
  const { isFetching, posts } = useLazyLoadPosts(userId);
  const [likesPost] = useLikesPostMutation();
  const [unLikesPost] = useUnLikesPostMutation();
  const [createComment] = useCreateCommentMutation();
  const { createNotification } = useNotifications({});
  const { _id } = useUserInfo();
  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          fullName={post.author?.fullName}
          avatarSrc={post.author?.image}
          userId={post.author?._id}
          createdAt={post.createdAt}
          content={post?.content}
          image={post?.image}
          likes={post.likes}
          comments={post.comments}
          postId={post._id}
          isLike={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (postId) => {
            const res = await likesPost(postId).unwrap();
            createNotification({
              userId: post.author?._id,
              postId,
              notificationType: "like",
              notificationTypeId: res._id,
            });
          }}
          onUnLike={(postId) => {
            unLikesPost(postId);
          }}
          onComment={async (postId, comment) => {
            const res = await createComment({ postId, comment }).unwrap();
            createNotification({
              userId: post.author?._id,
              postId,
              notificationType: "comment",
              notificationTypeId: res._id,
            });
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};

export default PostList;
