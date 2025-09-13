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
        // invalidatesTags: (result, error, { receiver }) => [
        //   { type: "MESSAGES", id: receiver },
        //   "CONVERSATIONS",
        // ],
        async onQueryStarted(
        { message, receiver },
        { dispatch, queryFulfilled, getState },
      ) {
        const { auth } = getState();
        const currentUser = auth.userInfo;

        const tempId = crypto.randomUUID();
        const now = new Date().toISOString();

        const optimisticMessage = {
          seen: false,
          _id: tempId,
          message: message,
          sender: currentUser,
          receiver: {
            _id: receiver,
          },
          createdAt: now,
          updatedAt: now,
        };

        const messagesUpdatePatch = dispatch(
          messageApi.util.updateQueryData(
            "getMessages",
            { userId: receiver },
            (draft) => {
              if (draft.messages) {
                draft.messages.push(optimisticMessage);
              }
            },
          ),
        );

        const conversationsUpdatePatch = dispatch(
          rootApi.util.updateQueryData(
            "getConversations",
            undefined,
            (draft) => {
              let currentConversationIndex = draft.findIndex(
                (message) =>
                  message.sender._id === receiver ||
                  message.receiver._id === receiver,
              );

              console.log({ currentConversationIndex });

              let receiverInfo = {};
              if (currentConversationIndex !== -1) {
                receiverInfo = draft[currentConversationIndex].receiver;
                draft.splice(currentConversationIndex, 1);
              }

              draft.unshift({ ...optimisticMessage, receiver: receiverInfo });
            },
          ),
        );

        try {
          const response = await queryFulfilled;
          // update draft message with real message from backend

          console.log("[messageApi]", { response });

          dispatch(
            messageApi.util.updateQueryData(
              "getMessages",
              { userId: receiver },
              (draft) => {
                if (draft.messages) {
                  const messageIndex = draft.messages.findIndex(
                    (msg) => msg._id === tempId,
                  );

                  if (messageIndex !== -1) {
                    draft.messages[messageIndex] = response.data;
                  }
                }
              },
            ),
          );

          dispatch(
            rootApi.util.updateQueryData(
              "getConversations",
              undefined,
              (draft) => {
                const conversationIndex = draft.findIndex(
                  (msg) => msg._id === tempId,
                );

                if (conversationIndex !== -1) {
                  draft[conversationIndex] = response.data;
                }
              },
            ),
          );
        } catch (error) {
          messagesUpdatePatch.undo();
          conversationsUpdatePatch.undo();

          console.error({ error });
        }
      },
      }),
      markConversationAsSeen: builder.mutation({
        query: (sender) => {
          return {
            url: "/messages/update-seen",
            body: { sender },
            method: "PUT",
          };
        },
        invalidatesTags: ["CONVERSATIONS"],
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
        keepUnusedDataFor: 0,
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
