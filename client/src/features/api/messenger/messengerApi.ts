import { api } from "../apiSlice";
import { setChats } from "./messengerSlice";
import { Chat } from "../../../types/messenger";
import { MessageAttachment } from "../../../types/chat";

export const messengerApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<Chat[], void>({
            query: () => ({
                url: 'chats',
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(setChats(data));
                } catch (err) {
                    console.error('Ошибка загрузки чатов в RTK Query: ', err);
                }
            },

            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Chat' as const , id })),
                        { type: 'Chat' as const, id: 'LIST' }
                      ]
                    : [{ type: 'Chat' as const, id: 'LIST' }],
        }),

        uploadGroupAvatar: builder.mutation<{ success: boolean; avatarUrl: string }, FormData>({
            query: (formData) => ({
                url: 'upload/group-avatar',
                method: 'POST',
                body: formData,
            }),
        }),

        uploadAttachments: builder.mutation<{ success: boolean; files: MessageAttachment[] }, FormData>({
            query: (formData) => ({
                url: 'upload/attachments',
                method: 'POST',
                body: formData
            }),
        }),
    }),
});

export const { useGetChatsQuery, useUploadGroupAvatarMutation, useUploadAttachmentsMutation } = messengerApi;