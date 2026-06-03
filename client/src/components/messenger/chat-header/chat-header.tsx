import { useMemo } from "react";
import { Companion } from "../../../types/messenger";
import { setActiveChat } from "../../../features/api/messenger/messengerSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { LinkToProfile } from "../../shared/link-to-profile/link-to-profile";
import { TypingIndicator } from "../typing-indicator/typing-indicator";
import styles from './chat-header.module.css';

interface Props {
    chatId: number;
}

export function ChatHeader({ chatId }: Props) {
    const dispatch = useAppDispatch();
    const chat = useAppSelector(s => s.messenger.chats.find(c => c.id === chatId));

    const queries = useAppSelector(s => s.api.queries);
    const globalUser = useMemo(() => {
        if (chatId >= 0) return null;
        const targetUserId = Math.abs(chatId);
        for (const key in queries) {
            const endpointName = queries[key]?.endpointName;

            if ((endpointName === 'getSearchUsers' || endpointName === 'getFacultySuggestions') && queries[key]?.data) {
                const user = (queries[key].data as any[]).find(u => u.id === targetUserId);
                if (user) return user;
            }
        }
        return null;
    }, [queries, chatId]);

    const chatCompanion: Companion = chat ? chat.companion : globalUser;
    // console.log('Chat Companion: ', chatCompanion);
    const companionId = chatCompanion?.id ?? null;

    const presence = useAppSelector(
        s => companionId ? s.messenger.users[companionId]?.presence : null
    );

    const handleBack = () => {
        dispatch(setActiveChat(null))
    }

    if (chatId > 0 && !chat) {
        return (
            <div className={styles.header}>
                <div className={styles.headerInfo}>Загрузка...</div>
            </div>
        )
    };

    const isGroup = chat?.type === 'group';

    const displayName = isGroup
        ? (chat?.name ?? 'Группа')
        : chatCompanion
            ? `${chatCompanion.firstName ?? ''} ${chatCompanion.lastName ?? ''}`.trim()
            : 'Собеседник';

    // console.log('Display Name: ', displayName);

    const avatar = isGroup
        ? chat?.avatarUrl
        : chatCompanion?.avatarUrl;

    const isOnline = presence?.status === 'online';

    const subtitle = isGroup
        ? 'группа'
        : isOnline
            ? 'в сети'
            : presence?.lastSeen
                ? `был(а) в сети ${new Date(presence.lastSeen).toLocaleTimeString('ru', {
                    hour: '2-digit', minute: '2-digit'
                })}`
                : 'не в сети';

    const typingUserIds = useAppSelector(s => s.messenger.typingUsers[chatId] ?? []);
    const isSomeoneTyping = typingUserIds.length > 0;

    return (
        <div className={styles.header}>
            <div className={styles.headerInfo}>
                <button className={styles.backBtn} onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                </button>
                <div className={styles.avatarWrap}>
                    {avatar
                        ? <img src={avatar} className={styles.avatar} alt="" />
                        : <span className={styles.avatarFallback}>
                            {displayName[0]?.toUpperCase()}
                        </span>
                    }
                </div>
                <div className={styles.info}>
                    <LinkToProfile userOrUsername={chatCompanion} className={styles.name}>
                        <span className={styles.name}>{displayName}</span>
                    </LinkToProfile>
                    <div className={`${styles.statusSlider} ${isSomeoneTyping ? styles.typingActive : ''}`}>

                        <span className={`${styles.subtitle}`}>
                            {subtitle}
                        </span>

                        <TypingIndicator
                            chatId={chatId}
                            className={styles.typingStatus}
                            chatType={chat?.type ?? 'direct'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}