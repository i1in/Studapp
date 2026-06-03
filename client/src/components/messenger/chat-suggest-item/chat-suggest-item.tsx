import React from "react";
import { useAppSelector } from "../../../store/hooks";
import { getFaculty } from "../../../const";
import { Chat } from "../../../types/messenger";
import styles from './chat-suggest-item.module.css';

interface Props {
    chat: Chat;
    isActive: boolean;
    onSelect: () => void;
}

export const ChatSuggestItem = React.memo(({ chat, isActive, onSelect }: Props) => {
    const companionId = chat.companion?.id;

    const presence = useAppSelector(s =>
        companionId ? s.messenger.users[companionId]?.presence : null
    );

    const displayName = chat.type === 'direct'
        ? `${chat.companion?.firstName ?? ''} ${chat.companion?.lastName ?? ''}`.trim()
        : chat.name ?? 'Группа';

    const avatar = chat.type === 'direct'
        ? chat.companion?.avatarUrl
        : chat.avatarUrl;

    const isOnline = presence?.status === 'online';

    const previewText = () => {
        if (chat.id < 0) {
            return `@${chat.companion?.username} • ${getFaculty(chat.companion?.faculty)}`
        }

        if (!chat.lastMessage) return 'Нет сообщений';

        const textByMimeType: Record<string, string> = {
            image: '📷 Фотография',
            file: '📁 Файл',
            text: chat.lastMessage?.text 
        };

        return textByMimeType[chat.lastMessage.type] ?? chat.lastMessage.text;
    }

    const lastTime = chat.lastMessage?.createdAt
        ? new Date(chat.lastMessage.createdAt).toLocaleTimeString('ru', {
            hour: '2-digit', minute: '2-digit'
        })
        : '';

    const senderFirstName = chat.lastMessage?.sender?.firstName ?? (chat.lastMessage as any)?.user?.firstName;

    return (
        <div
            className={`${styles.item} ${isActive ? styles.active : ''}`}
            onClick={onSelect}
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
                </div>

                <div className={styles.bottom}>
                    <span className={styles.preview}>
                        {previewText()}
                    </span>
                </div>
            </div>
        </div>
    );
});