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
    getSearchUsers: builder.query<User[], string>({
      query: (searchString) => ({
        url: `/users`,
        method: 'GET',
        params: { query: searchString }
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 60,
    }),
    getFacultySuggestions: builder.query<User[], string>({
      query: (facultyName) => ({
        url: `/users/faculty`,
        method: 'GET',
        params: { faculty: facultyName }
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 300,
    }),
    postStatus: builder.mutation<User, string>({
      query: (status) => ({
        url: `/edit/status`,
        method: 'POST',
        body: { status }
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

export const {
  useGetProfileQuery,
  usePostFollowMutation,
  usePostStatusMutation,
  useGetProfileByIdQuery,
  useGetFacultySuggestionsQuery,
  useGetSearchUsersQuery,
} = userApi;