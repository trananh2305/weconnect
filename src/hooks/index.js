import { logout } from "@redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useSearchUsersQuery } from "@services/rootApi";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { throttle } from "lodash";
import { useGetPostQuery } from "@services/postApi";
export const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOut = () => {
    dispatch(logout());
    // xoa bo lich su duyet web trc do

    navigate("/login", { replace: true });
  };
  return { logOut };
};

export const useUserInfo = () => {
  return useSelector((state) => state.auth.userInfo);
};

export const useDetectLayout = () => {
  const theme = useTheme();
  const isMediumLayout = useMediaQuery(theme.breakpoints.down("md"));
  return { isMediumLayout };
};

export const useLazyLoadPosts = () => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const {
    data = { ids: [], entities: [] },
    isFetching,
    refetch,
  } = useGetPostQuery({ offset, limit });

  const posts = (data.ids || []).map((id) => data.entities[id]);

  const prePostCountRef = useRef(0);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      const currentPostCount = data.ids.length;
      const newFetchCount = currentPostCount - prePostCountRef.current;
      if (newFetchCount === 0) {
        setHasMore(false);
      } else {
        prePostCountRef.current = currentPostCount;
      }
    }
  }, [isFetching, data, hasMore]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);
  useEffect(() =>{
    refetch();
  }, [refetch, offset])
  useInfiniteScroll({
    hasMore,
    loadMore,
    isFetching,
    offset,
  });
  return { hasMore, loadMore, isFetching, posts };
};

export const useLazyLoadSearchFriends = ({ searchQuery }) => {
  const [offset, setOffset] = useState(0);
  let limit = 10;
  const [friends, setFriends] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isSuccess, isFetching } = useSearchUsersQuery({
    offset,
    limit,
    searchQuery,
  });
  console.log("data: ", data);
  const preDataRef = useRef();

  useEffect(() => {
    if ((isSuccess && data?.users) || preDataRef.current !== data?.users) {
      console.log("aaaaaa");

      preDataRef.current = data?.users;
      setFriends((prev) => {
        return [...prev, ...data.users];
      });
      if (data.total <= offset + data.users.length) {
        setHasMore(false);
        return;
      }
    }
  }, [isSuccess, data?.users, data?.total, offset]);

  const loadMore = useCallback(() => {
    if (hasMore && data?.users?.length) {
      setOffset((offset) => offset + limit);
    }
  }, [hasMore, data?.users?.length, limit]);
  useInfiniteScroll({
    hasMore,
    loadMore,
    isFetching,
  });
  return { hasMore, loadMore, isFetching, friends };
};

export const useInfiniteScroll = ({
  hasMore,
  loadMore,
  isFetching,
  threshold = 50,
  throttleTime = 300,
}) => {
  const handleScroll = useMemo(() => {
    return throttle(() => {
      if (!hasMore) {
        return;
      }
      const scrollTop = document.documentElement.scrollTop; // để lấy ra chiều cao từ giao diện đến top của root
      const scrollHeight = document.documentElement.scrollHeight; //  để lấy được chiều cao root
      const clientHeight = document.documentElement.clientHeight; // để  lấy chiều cao giao diện

      if (clientHeight + scrollTop + threshold >= scrollHeight && !isFetching) {
        loadMore();
      }
    }, throttleTime);
  }, [hasMore, isFetching, loadMore, threshold, throttleTime]);
  useEffect(() => {
    // lắng nghe sự kiện người dùng
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // xoa het loi goi trong throttle
      handleScroll.cancel();
    };
  }, [handleScroll]);
};
