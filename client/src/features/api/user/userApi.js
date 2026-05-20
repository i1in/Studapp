import { api } from '../apiSlice';
export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query({
            query: (username) => `/u/${username}`,
            providesTags: ['User'],
            keepUnusedDataFor: 3600,
        }),
        getProfileById: builder.query({
            query: (id) => `/user`,
            providesTags: ['User'],
            keepUnusedDataFor: 3600,
        }),
        postStatus: builder.mutation({
            query: (status) => ({
                url: `/edit/status`,
                method: 'POST',
                body: { status }
            }),
            invalidatesTags: [{ type: 'User' }]
        }),
        postFollow: builder.mutation({
            query: (followeeId) => ({
                url: `${followeeId}/followers`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, followeeId) => [
                { type: 'User', id: followeeId },
            ]
        })
    }),
});
export const { useGetProfileQuery, usePostFollowMutation, usePostStatusMutation, useGetProfileByIdQuery } = userApi;
