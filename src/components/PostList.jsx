import { useGetPostQuery } from "@services/rootApi";
import Post from "./Post";
import Loading from "./Loading";
import { useState } from "react";
import { useEffect } from "react";

const PostList = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState([]);

  const { data, isSuccess, isFetching } = useGetPostQuery({ offset, limit });

  useEffect(() => {
    if (isSuccess && data) {
      setPosts((prev) => {
        return [...prev, ...data];
      });
    }
  }, [isSuccess, data]);
  if (isFetching) {
    return <Loading />;
  }
  return (
    <div className="flex flex-col gap-4">
      {(data || []).map((post) => (
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
    </div>
  );
};

export default PostList;
