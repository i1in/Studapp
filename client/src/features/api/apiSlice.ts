import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store/store';

const baseQuery = fetchBaseQuery({
  baseUrl: "/api",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
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
  keepUnusedDataFor: 120, // Глобальные настройки (секунды)
  refetchOnMountOrArgChange: 1, // Автозапрос при изменении аргументов
});