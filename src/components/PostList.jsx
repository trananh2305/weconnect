import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useUserInfo } from "@hooks/index";
import {
  useLikesPostMutation,
  useUnLikesPostMutation,
} from "@services/postApi";
import { useCreateNotificationMutation } from "@services/notificationApi";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  const [likesPost] = useLikesPostMutation();
  const [unLikesPost] = useUnLikesPostMutation();
  const [createNotification] = useCreateNotificationMutation();
  const { _id } = useUserInfo();
  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post._id}
          fullName={post.author?.fullName}
          createAt={post.createAt}
          content={post?.content}
          image={post?.image}
          likes={post.likes}
          comments={post.comments}
          postId={post._id}
          isLike={post.likes.some((like) => like.author?._id === _id)}
          onLike={async (postId) => {
            const res = await likesPost(postId).unwrap();

            console.log("id",res)
            if (post.author?._id !== _id) {
              createNotification({
                userId: post.author?._id,
                postId,
                notificationType: "like",
                notificationTypeId: res._id,
              });
            }
          }}
          onUnLike={(postId) => {
            unLikesPost(postId);
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};

export default PostList;
