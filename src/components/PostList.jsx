/* eslint-disable react-hooks/exhaustive-deps */
import { useGetPostQuery } from "@services/rootApi";
import Post from "./Post";
import Loading from "./Loading";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useCallback } from "react";

const PostList = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isSuccess, isFetching } = useGetPostQuery({ offset, limit });

  const preDataRef = useRef();

  useEffect(() => {
    if (isSuccess && data && preDataRef.current !== data) {
      if (!data.length){
        setHasMore(false)
        return;
      }
      preDataRef.current = data;
      setPosts((prev) => {
        return [...prev, ...data];
      });
    }
  }, [isSuccess, data]);

  console.log("data", data)

  const handleScroll = useCallback(() => {
    if (!hasMore){
      return;
    }
    const scrollTop = document.documentElement.scrollTop; // để lấy ra chiều cao từ giao diện đến top của root
    const scrollHeight = document.documentElement.scrollHeight; //  để lấy được chiều cao root
    const clientHeight = document.documentElement.clientHeight; // để  lấy chiều cao giao diện

    if (clientHeight + scrollTop + 50 >= scrollHeight && !isFetching) {
      console.log("first");
      setOffset(offset => offset + limit);
    }
  }, [hasMore, isFetching, offset]);
  useEffect(() => {
    // lắng nghe sự kiện người dùng
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);
  // if (isFetching) {
  //   return <Loading />;
  // }

  return (
    <div className="flex flex-col gap-4">
      {(posts || []).map((post) => (
        <Post
          key={post.id }
          fullName={post.author?.fullName}
          createAt={post.createAt}
          content={post?.content}
          image={post?.image}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
      {isFetching && <Loading/>}
    </div>
  );
};

export default PostList;
