import { api } from '../apiSlice';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<
            { token: string },
            { email: string; password: string }
        >({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        refresh: builder.mutation<{ token: string }, void>({
            query: () => ({
                url: '/refresh',
                method: 'POST',
            }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const { useLoginMutation, useRefreshMutation, useLogoutMutation } =
    authApi;
