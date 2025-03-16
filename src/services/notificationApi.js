import { rootApi } from "./rootApi";

const nontificationApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getNotifications: builder.query({
        query: () => {
          return "/notifications";
        },
        // keepUnusedDataFor:30
        //,
        providesTags: (result) =>
          result
            ? [
                ...result.notifications.map(({ _id }) => ({
                  type: "GET_NOTI",
                  id: _id,
                })),
                { type: "GET_NOTI", id: "LIST" },
              ]
            : [{ type: "GET_NOTI", id: "LIST" }],
      }),
      createNotification: builder.mutation({
        query: ({userId, postId, notificationType, notificationTypeId}) => {
          return {
            url: "/notifications/create",
            method: "POST",
            body: {userId, postId, notificationType, notificationTypeId}
          }
        }
      })
    };
  },
});

export const {useGetNotificationsQuery, useCreateNotificationMutation} = nontificationApi;
