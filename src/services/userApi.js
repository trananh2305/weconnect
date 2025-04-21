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
      uploadPhoto: builder.mutation({
        query: (formData) => {
          return {
            url: "/users/upload-photo",
            method: "POST",
            body: formData,
          };
        },
        invalidatesTags: [
          { type: "GET_AUTH_USER" },
          { type: "GET_USER_INFO_BY_ID" },
        ],
      }),
      deletedPhoto: builder.mutation({
        query: (isCover) => {
          return {
            url: "/users/reset-photo",
            method: "DELETE",
            body: {isCover},
          };
        },
        invalidatesTags: [
          { type: "GET_AUTH_USER" },
          { type: "GET_USER_INFO_BY_ID" },
        ],
      }),
      uploadInformProfile: builder.mutation({
        query: (payload) => {
          return {
            url: "/users/update-profile",
            method: "PATCH",
            body: payload,
          };
        },
        invalidatesTags: [{ type: "GET_AUTH_USER" }],
      }),
    };
  },
});

export const {
  useGetUserInfoByIdQuery,
  useUploadInformProfileMutation,
  useDeletedPhotoMutation,
  useUploadPhotoMutation
} = userApi;
