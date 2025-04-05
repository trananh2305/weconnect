import { rootApi } from "./rootApi";

const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      getUserInfoById: builder.query({
        query: (userId) => {
          return `/users/${userId}`;
        },
        // keepUnusedDataFor:30
        //,
        providesTags: (result) => [
          { type: "GET_USER_INFO_BY_ID", id: result._id },
        ],
      }),
      //   createNotification: builder.mutation({
      //     query: ({ userId, postId, notificationType, notificationTypeId }) => {
      //       return {
      //         url: "/notifications/create",
      //         method: "POST",
      //         body: { userId, postId, notificationType, notificationTypeId },
      //       };
      //     },
      //   }),
    };
  },
});

export const { useGetUserInfoByIdQuery } = userApi;
