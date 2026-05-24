import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setActiveChat } from "../../../features/api/messenger/messengerSlice";
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import { ChatListItem } from "../chat-list-item/chat-list-item";
import styles from './chat-list.module.css';
import { useCallback, useMemo } from "react";
import { useGetChatsQuery } from "../../../features/api/messenger/messengerApi";

export function ChatList() {
    const dispatch = useAppDispatch();
    const { isLoading, isError } = useGetChatsQuery();

    const chats = useAppSelector(s => s.messenger.chats);
    const activeChatId = useAppSelector(s => s.messenger.activeChatId);

    const sortedChats = useMemo(() => {
        return [...chats].sort((a, b) => {
            const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;

            return dateB - dateA;
        })
    }, [chats]);

    const handleSelect = useCallback((chatId: number) => {
        dispatch(setActiveChat(chatId));
    }, [dispatch])

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (isError) {
        return <div className={styles.error}>Не удалось загрузить чаты</div>;
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.header}>
                <span className={styles.title}>Сообщения</span>
            </div>
            <div className={styles.list}>
                {!sortedChats.length && (
                    <p className={styles.empty}>Нет чатов</p>
                )}
                {sortedChats.map(chat => (
                    <ChatListItem 
                        key={chat.id}
                        chat={chat}
                        isActive={chat.id === activeChatId}
                        onSelect={handleSelect}
                    />
                ))}
            </div>
        </div>
    )
}
