import { rootApi } from "./rootApi";

export const friendApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      sendFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/request",
            body: {
              friendId: userId,
            },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [{ type: "USERS", id: args }],
      }),
      getPendingRequest: builder.query({
        query: () => {
          return "/friends/pending";
        },
        // keepUnusedDataFor:30
        //,
        providesTags: (result) =>
          result
            ? [
                ...result.map(({ _id }) => ({
                  type: "PENDING_FRIEND_REQUEST",
                  id: _id,
                })),
                { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
              ]
            : [{ type: "PENDING_FRIEND_REQUEST", id: "LIST" }],
      }),
      acceptFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/accept",
            body: {
              friendId: userId,
            },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "PENDING_FRIEND_REQUEST", id: args },
          { type: "USERS", id: args },
        ],
      }),
      cancelFriendRequest: builder.mutation({
        query: (userId) => {
          return {
            url: "/friends/cancel",
            body: {
              friendId: userId,
            },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, args) => [
          { type: "PENDING_FRIEND_REQUEST", id: args },
          { type: "USERS", id: args },
        ],
      }),
    };
  },
});

export const {
  useSendFriendRequestMutation,
  useGetPendingRequestQuery,
  useAcceptFriendRequestMutation,
  useCancelFriendRequestMutation,
} = friendApi;
