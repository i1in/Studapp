import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const baseQuery = fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});
export const api = createApi({
    reducerPath: 'api',
    baseQuery,
    tagTypes: ['Post', 'User', 'Like', 'Comment'],
    endpoints: () => ({}),
    keepUnusedDataFor: 120,
    refetchOnMountOrArgChange: 1, // Автозапрос при изменении аргументов
});
