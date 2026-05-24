import { api } from '../apiSlice';
import { User } from '../../../types/user'
import { Followed } from '../../../types/follow'

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<User, string>({
      query: (username) => `/u/${username}`,
      providesTags: ['User'],
      keepUnusedDataFor: 3600,
    }),
    getProfileById: builder.query<User, void>({
      query: () => `/user`,
      providesTags: ['User'],
      keepUnusedDataFor: 3600,
    }),
    postStatus: builder.mutation<User, string>({
      query: (status) => ({
        url: `/edit/status`,
        method: 'POST',
        body: {status}
      }),
      invalidatesTags: [{ type: 'User' }]
    }),
    postFollow: builder.mutation<Followed, number>({
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

export const { useGetProfileQuery, usePostFollowMutation, 
              usePostStatusMutation, useGetProfileByIdQuery  } = userApi;