import { logout } from "@redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useGetPostQuery } from "@services/rootApi";
import { useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { throttle } from "lodash";
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
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isSuccess, isFetching } = useGetPostQuery({ offset, limit });

  const preDataRef = useRef();

  useEffect(() => {
    if (isSuccess && data && preDataRef.current !== data) {
      if (!data.length) {
        setHasMore(false);
        return;
      }
      preDataRef.current = data;
      setPosts((prev) => {
        return [...prev, ...data];
      });
    }
  }, [isSuccess, data]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);
  useInfiniteScroll({hasMore, loadMore, isFetching});
  return { hasMore, loadMore, isFetching, posts };
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
