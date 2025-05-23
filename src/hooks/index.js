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
import { useGetPostByUserIdQuery, useGetPostQuery } from "@services/postApi";
import { useCreateNotificationMutation } from "@services/notificationApi";
import { socket } from "@context/SocketProvider";
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

export const useLazyLoadPosts = (userId) => {
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);

  const {
    data: userProfileData = { ids: [], entities: [] },
    isFetching: userProfileIsFetching,
    refetch: refetchUserProfile,
  } = useGetPostByUserIdQuery({ offset, limit, userId }, { skip: !userId });

  const {
    data: homePageData = { ids: [], entities: [] },
    isFetching: homePageIsFetching,
    refetch: homePageRefetch,
  } = useGetPostQuery({ offset, limit }, { skip: !!userId });

  const data = userId ? userProfileData : homePageData;
  const isFetching = userId ? userProfileIsFetching : homePageIsFetching;
  const refetch = userId ? refetchUserProfile : homePageRefetch;

  const posts = (data.ids || []).map((id) => data.entities[id]);

  const prePostCountRef = useRef(0);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      if (userId) {
        if (data.ids.length === data.meta.total) {
          setHasMore(false);
        }
      } else {
        const currentPostCount = data.ids.length;
        const newFetchCount = currentPostCount - prePostCountRef.current;
        if (newFetchCount === 0) {
          setHasMore(false);
        } else {
          prePostCountRef.current = currentPostCount;
        }
      }
    }
  }, [isFetching, data, hasMore, userId]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);
  useEffect(() => {
    refetch();
  }, [refetch, offset]);
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
  const limit = 10;
  const [hasMore, setHasMore] = useState(true);
  console.log("offset", offset);

  const { data, isFetching, refetch } = useSearchUsersQuery({
    offset,
    limit,
    searchQuery,
  });

  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (data) {
      setFriends((prev) => {
        const newFriends = data.users.filter(
          (friend) => !prev.some((f) => f._id === friend._id)
        );
        return [...prev, ...newFriends];
      });
    }
  }, [data]);

  useEffect(() => {
    if (!isFetching && data && hasMore) {
      if (friends.length === data.total) {
        setHasMore(false);
      }
    }
  }, [isFetching, data, hasMore]);

  const loadMore = useCallback(() => {
    setOffset((offset) => offset + limit);
  }, []);
  useEffect(() => {
    refetch();
  }, [refetch, offset]);
  useInfiniteScroll({
    hasMore,
    loadMore,
    isFetching,
    offset,
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

export const useNotifications = ({
  userId = null,
  postId = null,
  notificationType = null,
  notificationTypeId = null,
}) => {
  const [createNotificationMutation] = useCreateNotificationMutation();
  const { _id } = useUserInfo();
  async function createNotification() {
    if (userId === _id) return;

    const res = await createNotificationMutation({
      userId,
      postId,
      notificationType,
      notificationTypeId,
    }).unwrap();
    socket.emit("CREATE_NOTIFICATION", res);
  }

  return { createNotification };
};
