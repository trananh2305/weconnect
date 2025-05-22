import { rootApi } from "./rootApi";

export const messageApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      sendMessage: builder.mutation({
        query: ({ message, receiver }) => {
          return {
            url: "/messages/create",
            body: {
              message,
              receiver,
            },
            method: "POST",
          };
        },
        invalidatesTags: (result, error, { receiver }) => [
          { type: "MESSAGES", id: receiver },
          "CONVERSATIONS",
        ],
      }),
      markConversationAsSeen: builder.mutation({
        query: (sender) => {
          return {
            url: "/messages/update-seen",
            body: { sender },
            method: "PUT",
          };
        },
      }),
      getConversations: builder.query({
        query: () => {
          return "/messages/conversations";
        },
        // keepUnusedDataFor:30
        //,
        // providesTags: (result) =>
        //   result
        //     ? [
        //         ...result.map(({ _id }) => ({
        //           type: "PENDING_FRIEND_REQUEST",
        //           id: _id,
        //         })),
        //         { type: "PENDING_FRIEND_REQUEST", id: "LIST" },
        //       ]
        //     : [{ type: "PENDING_FRIEND_REQUEST", id: "LIST" }],
      }),
      getMessages: builder.query({
        query: ({ userId, offset, limit }) => ({
          url: `/messages`,
          params: {
            userId,
            offset,
            limit,
          },
        }),
        // tao ra 1 cache cho userId
        serializeQueryArgs: ({ queryArgs }) => {
          return { userId: queryArgs.userId };
        },
        // keepUnusedDataFor:30
        //,
        providesTags: (result, error, { userId }) => {
          return [{ type: "MESSAGES", id: userId }];
        },
      }),
    };
  },
});

export const {
  useSendMessageMutation,
  useGetConversationsQuery,
  useGetMessagesQuery,
  useMarkConversationAsSeenMutation,
} = messageApi;
