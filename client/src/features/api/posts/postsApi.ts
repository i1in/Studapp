import { api } from '../apiSlice';
import { FullPost, PostList, Attachments } from '../../../types/post';
import { Like } from '../../../types/like';
import { Comment } from '../../../types/comment';

export const postsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<PostList[], void>({
            query: () => ({
                url: 'feed',
            }),
            transformResponse: (baseQueryReturnValue: any) => {
                if (Array.isArray(baseQueryReturnValue)) {
                    return baseQueryReturnValue;
                }

                if (baseQueryReturnValue?.posts) {
                    return baseQueryReturnValue.posts;
                }

                return [];
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), 'Post']
                    : [],
        }),
        getUserPosts: builder.query<PostList[], string>({
            query: (username) => ({
                url: `/${username}/posts`,
            }),
            transformResponse: (baseQueryReturnValue: any) => {
                if (Array.isArray(baseQueryReturnValue)) {
                    return baseQueryReturnValue;
                }
                if (baseQueryReturnValue?.posts) {
                    return baseQueryReturnValue.posts;
                }
                return [];
            },
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), 'Post']
                    : [],
        }),
        addPost: builder.mutation<FullPost, { content: string; attachments: File[] }>({
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
        getFullPost: builder.query<FullPost, { username: string; id: number }>({
            query: ({username, id}) => ({
                url: `/${username}/posts/${id}`,
                method: 'GET'
            }),
            providesTags: (result, error, { id }) => [{ type: 'Post', id }]
        }),
        likePost: builder.mutation<Like, number>({
            query: (postId) => ({
                url: `post/${postId}/like`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, postId) => [
                { type: 'Like', id: postId }
            ]
        }),
        postComment: builder.mutation<Comment, { 
            username: string; id: number; content: string;
        }>({
            query: ({username, id, content}) => ({
                url: `/${username}/posts/${id}/comments`,
                method: 'POST',
                body: { content }
            }),
            invalidatesTags: [{type: 'Comment'}]
        })
    }),
});

export const { useGetPostsQuery, useAddPostMutation, 
                useLikePostMutation, useGetUserPostsQuery,
                useGetFullPostQuery, usePostCommentMutation } = postsApi;