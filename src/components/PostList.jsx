import Post from "./Post";
import Loading from "./Loading";
import { useLazyLoadPosts } from "@hooks/index";

const PostList = () => {
  const { isFetching, posts } = useLazyLoadPosts();
  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post.id}
          fullName={post.author?.fullName}
          createAt={post.createAt}
          content={post?.content}
          image={post?.image}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
      {isFetching && <Loading />}
    </div>
  );
};

export default PostList;
