import { createEntityAdapter } from "@reduxjs/toolkit";
import { rootApi } from "./rootApi";

//postsAdapter ko lưu một kiểu dữ liệu nào hết
const postsAdapter = createEntityAdapter({
  // định nghĩa id
  selectId: (post) => post._id,
  sortComparer: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
});

// tạo initial state
const initialState = postsAdapter.getInitialState();

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
            rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
              //draft là một mảng chứa danh sách bài viết dựa trên query "getPost" trước đó
              // draft.unshift(newPost);
              postsAdapter.addOne(draft, newPost);
            })
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
                // const index = draft.findIndex((post) => post._id === tempId);
                // if (index !== -1) {
                //   // draft[index] = data;
                postsAdapter.removeOne(draft, tempId);
                postsAdapter.addOne(draft, data);
                // }
              })
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
        transformResponse: (response) => {
          // hàm để đẩy dữ liệu mới vào entities, lấy dữ liệu cữ và so sánh sau đó gộp lại với dữ liệu mới
          return postsAdapter.upsertMany(initialState, response);
        },
        // để 1 key duy nhất cho api
        serializeQueryArgs: () => "allPosts",
        // currentCache là dữ liệu đã caching trước đó, newItems: là dữ liệu ở lần gọi Api mới nhất, dùng merge để gộp lại
        merge: (currentCache, newItems) => {
          return postsAdapter.upsertMany(currentCache, newItems.entities);
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
            rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
              //draft là một mảng chứa danh sách bài viết dựa trên query "getPost" trước đó
              // draft.unshift(newPost);
              const currentPost = draft.entities[args];
              if (currentPost) {
                currentPost.likes.push({
                  author: {
                    _id: store.auth.userInfo._id,
                    fullName: store.auth.userInfo.fullName,
                  },
                  _id: tempId,
                });
              }
            })
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(
              rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
                const currentPost = draft.entities[args];
                if (currentPost) {
                  currentPost.likes = currentPost.likes.map((like) => {
                    if (like._id === tempId) {
                      return {
                        author: {
                          _id: store.auth.userInfo._id,
                          fullName: store.auth.userInfo.fullName,
                        },
                        _id: data._id,
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                      };
                    }
                    return like;
                  });
                  // let currentLike = currentPost.likes.find(
                  //   (like) => like._id === tempId
                  // );
                  // if (currentLike) {
                  //   currentPost.likes[currentLike] = {
                  //     author: {
                  //       _id: store.auth.userInfo._id,
                  //       fullName: store.auth.userInfo.fullName,
                  //     },
                  //     _id: data._id,
                  //     createdAt: data.createdAt,
                  //     updatedAt: data.updatedAt,
                  //   };
                  // }
                }
              })
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
            url: `/posts/${postId}/like`,
            method: "DELETE",
          };
        },
        onQueryStarted: async (
          args,
          { dispatch, queryFulfilled, getState }
        ) => {
          const store = getState();

          const patchResult = dispatch(
            // Cập nhật danh sách bài viết dựa trên query "getPost" trước đó
            rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
              //draft là một mảng chứa danh sách bài viết dựa trên query "getPost" trước đó
              // draft.unshift(newPost);
              const currentPost = draft.entities[args];
              if (currentPost) {
                currentPost.likes = currentPost.likes.filter((like) => {
                  return like.author._id !== store.auth.userInfo._id;
                });
              }
            })
          );
          try {
            const { data } = await queryFulfilled;
            console.log("data",data)
            dispatch(
              rootApi.util.updateQueryData("getPost", "allPosts", (draft) => {
                const currentPost = draft.entities[args];
                if (currentPost) {
                  currentPost.likes = data.likes;
                }
              })
            );
          } catch (error) {
            // Nếu có lỗi xảy ra, chúng ta sẽ undo lại việc thêm bài viết mới vào danh sách
            console.log(error);
            patchResult.undo();
          }
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
