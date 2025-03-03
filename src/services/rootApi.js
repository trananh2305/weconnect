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

  if (result?.error?.status === 401) {
    if (result?.error?.data?.message === "Token has expired") {
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
          result = await baseQuery(args, api, extraOptions);
        } else {
          await api.dispatch(logout());
          window.location.href = "/login";
        }
      }
    } else {
      window.location.href = "/login";
    }
  }
  return result;
};
export const rootApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["POSTS", "USERS", "PENDING_FRIEND_REQUEST"],
  //c1: tu dong xoa du lieu cu khi vuot qua thoi gian 20s ko truy cap
  // keepUnusedDataFor: 20,
  //c2: tu dong xoa du lieu cu khi vuot qua thoi gian 20s ko truy cap
  // refetchOnMountOrArgChange: true,
  //c3: tu dong xoa du lieu cu khi vuot qua thoi gian 20s ko truy cap, quay lai trc 20s van tu dong xoa de goi api moi, khi focus lai trang web
  // refetchOnFocus: true,
  // c4: tu dong refetch lai du lieu khi mat mang
  // refetchOnReconnect: true,
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
      searchUsers: builder.query({
        query: ({ limit, offset, searchQuery } = {}) => {
          //ma hoa chuoi de xu li
          const encodeQuery = encodeURIComponent(searchQuery.trim());
          return {
            url: `search/users/${encodeQuery}`,
            method: "GET",
            params: { limit, offset },
          };
        },
        providesTags: (result) =>
          result
            ? [
                ...result.users.map(({ _id }) => ({ type: "USERS", id: _id })),
                { type: "USERS", id: "LIST" },
              ]
            : [{ type: "USERS", id: "LIST" }],
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
  useRefreshTokenMutation,
  useSearchUsersQuery,
  
} = rootApi;
