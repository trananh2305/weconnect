import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts, useUserInfo } from "@hooks/index";
import { useLikesPostMutation } from "@services/postApi";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  const [likesPost] = useLikesPostMutation();
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
          onLike={(postId) => {
            likesPost(postId);
          }}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};

export default PostList;
