import React from "react";
import { useAppSelector } from "../../../store/hooks";
import { Chat } from "../../../types/messenger";
import styles from './chat-list-item.module.css';

interface Props {
    chat: Chat;
    isActive: boolean;
    onSelect: (chatId: number) => void;
}

export const ChatListItem = React.memo(({ chat, isActive, onSelect }: Props) => {
    const presence = useAppSelector(
        s => s.messenger.users[chat.companion?.id ?? -1]?.presence
    );

    const displayName = chat.type === 'direct'
        ? `${chat.companion?.firstName ?? ''} ${chat.companion?.lastName ?? ''}`.trim()
        : chat.name ?? 'Группа';

    const avatar = chat.type === 'direct'
        ? chat.companion?.avatarUrl
        : chat.avatarUrl;

    const isOnline = presence?.status === 'online';

    const lastText = !chat.lastMessage
        ? 'Нет сообщений'
        : chat.lastMessage?.type === 'system'
            ? chat.lastMessage.text
            : (
                <div className={styles.message__payload}>
                    <span className={styles.message__author}>{`${chat.lastMessage.sender?.firstName ?? ''}: `}</span>
                    <span className={styles.preview}>{chat.lastMessage.text}</span>
                </div>
            );

    const lastTime = chat.lastMessage?.createdAt
        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('ru', {
            hour: '2-digit', minute: '2-digit'
        })
        : '';

    return (
        <div
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={() => onSelect(chat.id)}
        >
            <div className={styles.avatarWrap} >
                {avatar
                    ? <img src={avatar} className={styles.avatar} alt="" />
                    : <div className={styles.avatarFallback}>
                        <span className={styles.avatarFallback__text}>{displayName[0] ?? '?'}</span>
                    </div>
                }
                {chat.type === 'direct' && isOnline && (
                    <span className={`${styles.dot} ${styles.online}`} />
                )}
            </div>

            <div className={styles.info}>
                <div className={styles.top}>
                    <span className={styles.name}>{displayName}</span>
                    <span className={styles.time}>{lastTime}</span>
                </div>
                <div className={styles.bottom}>
                    <span className={styles.preview}>{lastText}</span>

                    {(chat.unreadCount ?? 0) > 0 && (
                        <span className={styles.badge}>{chat.unreadCount}</span>
                    )}
                </div>
            </div>
        </div>
    );
});