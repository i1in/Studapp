import { api } from '../apiSlice';
export const postsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: () => ({
                url: 'feed',
            }),
            transformResponse: (baseQueryReturnValue) => {
                if (Array.isArray(baseQueryReturnValue)) {
                    return baseQueryReturnValue;
                }
                if (baseQueryReturnValue?.posts) {
                    return baseQueryReturnValue.posts;
                }
                return [];
            },
            providesTags: (result) => result
                ? [...result.map(({ id }) => ({ type: 'Post', id })), 'Post']
                : [],
        }),
        getUserPosts: builder.query({
            query: (username) => ({
                url: `/${username}/posts`,
            }),
            transformResponse: (baseQueryReturnValue) => {
                if (Array.isArray(baseQueryReturnValue)) {
                    return baseQueryReturnValue;
                }
                if (baseQueryReturnValue?.posts) {
                    return baseQueryReturnValue.posts;
                }
                return [];
            },
            providesTags: (result) => result
                ? [...result.map(({ id }) => ({ type: 'Post', id })), 'Post']
                : [],
        }),
        addPost: builder.mutation({
            query: ({ content, attachments }) => {
                const formData = new FormData();
                formData.append('content', content);
                attachments.forEach((file) => formData.append('attachment', file));
                return {
                    url: 'post',
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Post'],
        }),
        getFullPost: builder.query({
            query: ({ username, id }) => ({
                url: `/${username}/posts/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, { id }) => [{ type: 'Post', id }]
        }),
        likePost: builder.mutation({
            query: (postId) => ({
                url: `post/${postId}/like`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, postId) => [
                { type: 'Like', id: postId }
            ]
        }),
        postComment: builder.mutation({
            query: ({ username, id, content }) => ({
                url: `/${username}/posts/${id}/comments`,
                method: 'POST',
                body: { content }
            }),
            invalidatesTags: [{ type: 'Comment' }]
        })
    }),
});
export const { useGetPostsQuery, useAddPostMutation, useLikePostMutation, useGetUserPostsQuery, useGetFullPostQuery, usePostCommentMutation } = postsApi;
