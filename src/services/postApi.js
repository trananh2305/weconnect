import { rootApi } from "./rootApi";

// injectEndpoints de them cac endpoint moi vao rootApi
export const postApi = rootApi.injectEndpoints({
  endpoints: (builder) => {
    return {
      createPost: builder.mutation({
        query: (formData) => {
          return {
            url: "/posts",
            body: formData,
            method: "POST",
          };
        },
        // trigger tu dong goi api lay lai post
        // invalidatesTags: ["POSTS"],
        // mỗi khi post mới được tạo, chúng ta cần cập nhật lại danh sách bài viết
        //args: là tham số truyền vào mutation
        //dispatch: là hàm dispatch của Redux Toolkit
        //queryFulfilled: là hàm callback được gọi khi query hoặc mutation hoàn thành
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState }
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          console.log("store", store);
          // newPost là một object chứa thông tin của bài viết mới
          const newPost = {
            _id: tempId,
            likes: [],
            comments: [],
            content: args.get("content"),
            author: {
              notifications: [],
              _id: store.auth.userInfo._id,
              fullName: store.auth.userInfo.fullName,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _v: 0,
          };

          const patchResult = dispatch(
            // Cập nhật danh sách bài viết dựa trên query "getPost" trước đó
            rootApi.util.updateQueryData(
              "getPost",
              { limit: 10, offset: 0 },
              (draft) => {
                //draft là một mảng chứa danh sách bài viết dựa trên query "getPost" trước đó
                draft.unshift(newPost);
              }
            )
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData(
                "getPost",
                { limit: 10, offset: 0 },
                (draft) => {
                  const index = draft.findIndex((post) => post._id === tempId);
                  if (index !== -1) {
                    draft[index] = data;
                  }
                }
              )
            );
          } catch (error) {
            // Nếu có lỗi xảy ra, chúng ta sẽ undo lại việc thêm bài viết mới vào danh sách
            console.log(error);
            patchResult.undo();
          }
        },
      }),
      getPost: builder.query({
        // tu hieu la get nho RTK
        query: ({ limit, offset } = {}) => {
          return {
            url: "/posts",
            method: "GET",
            params: { limit, offset },
          };
        },
        providesTags: [{ type: "POSTS" }],
      }),
      likesPost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/like`,
            method: "POST",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState }
        ) => {
          const store = getState();
          const tempId = crypto.randomUUID();
          console.log("store", store);
          const patchResult = dispatch(
            // Cập nhật danh sách bài viết dựa trên query "getPost" trước đó
            rootApi.util.updateQueryData(
              "getPost",
              { limit: 10, offset: 0 },
              (draft) => {
                //draft là một mảng chứa danh sách bài viết dựa trên query "getPost" trước đó
                // draft.unshift(newPost);
                const currentPost = draft.find((p) => p._id === args);
                if (currentPost) {
                  currentPost.likes.push({
                    author: {
                      _id: store.auth.userInfo._id,
                      fullName: store.auth.userInfo.fullName,
                    },
                    _id: tempId,
                  });
                }
              }
            )
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData(
                "getPost",
                { limit: 10, offset: 0 },
                (draft) => {
                  const currentPost = draft.find((p) => p._id === args);
                  if (currentPost) {
                    let currentLike = currentPost.likes.find(
                      (like) => like._id === tempId
                    );
                    if (currentLike) {
                      currentPost.likes[currentLike] = {
                        author: {
                          _id: store.auth.userInfo._id,
                          fullName: store.auth.userInfo.fullName,
                        },
                        _id: data._id,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                      };
                    }
                  }
                }
              )
            );
          } catch (error) {
            // Nếu có lỗi xảy ra, chúng ta sẽ undo lại việc thêm bài viết mới vào danh sách
            console.log(error);
            patchResult.undo();
          }
        },
      }),
      unLikesPost: builder.mutation({
        query: (postId) => {
          return {
            url: `/posts/${postId}/likes`,
            method: "DELETE",
          };
        },
      }),
    };
  },
});

export const {
  useCreatePostMutation,
  useGetPostQuery,
  useLikesPostMutation,
  useUnLikesPostMutation,
} = postApi;
