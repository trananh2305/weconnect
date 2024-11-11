import { login, logout } from "@redux/slices/authSlice";
// import { persistor } from "@redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  // console.log({ api });

  if (
    result?.error?.status === 401 &&
    result?.error?.data?.message === "Token has expired"
  ) {
    // api.dispatch(logout());
    // clear het du lieu trong storage
    // await persistor.purge();
    // window.location.href = "/login";
    const refreshToken = api.getState().auth.refreshToken;
    if (refreshToken) {
      // goi den server de verify de nhan lai access token moi
      const refreshResult = await baseQuery(
        {
          url: "/refresh-token",
          body: { refreshToken },
          method: "POST",
        },
        api,
        extraOptions
      );
      const newAccessToken = refreshResult?.data?.accessToken;
      if (newAccessToken) {
        api.dispatch(
          login({
            accessToken: newAccessToken,
            refreshToken,
          })
        );
        result = await baseQuery({ args, api, extraOptions });
      } else {
        api.dispatch(logout());
        // clear het du lieu trong storage
        // await persistor.purge();
        window.location.href = "/login";
      }
    }
  }
  return result;
};
export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => {
    return {
      // mutation laf thay doi du lieu vi du nhu post con query la get
      register: builder.mutation({
        query: ({ fullName, email, password }) => {
          return {
            // nhu lam postman
            url: "/signup",
            body: { fullName, email, password },
            method: "POST",
          };
        },
      }),
      login: builder.mutation({
        query: ({ email, password }) => {
          return {
            url: "/login",
            body: { email, password },
            method: "POST",
          };
        },
      }),
      verifyOTP: builder.mutation({
        query: ({ email, otp }) => {
          return {
            url: "/verify-otp",
            body: { email, otp },
            method: "POST",
          };
        },
      }),
      refreshToken: builder.mutation({
        query: (refreshToken) => {
          return {
            url: "/refresh-token",
            body: { refreshToken },
            method: "POST",
          };
        },
      }),
      getAuthUser: builder.query({
        // tu hieu la get nho RTK
        query: () => {
          return "/auth-user";
        },
      }),
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            body: formData,
            method: "POST",
          };
        },
        // trigger tu dong goi api lay lai post
        invalidatesTags: ['POSTS']
      }),
      getPost: builder.query({
        // tu hieu la get nho RTK
        query: ({limit, offset} = {}) => {
          return {
            url: "/posts",
            method: "GET",
            params: { limit, offset },
          };
        },
        providesTags: ['POSTS']
      }), 
    };
  },
});

// use+Ten endpoint + mutation or query
export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useGetAuthUserQuery,
  useCreatePostMutation,
  useRefreshTokenMutation,
  useGetPostQuery
} = rootApi;
