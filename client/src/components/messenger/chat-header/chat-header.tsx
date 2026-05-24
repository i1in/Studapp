import { setActiveChat } from "../../../features/api/messenger/messengerSlice";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import styles from './chat-header.module.css';

interface Props {
    chatId: number;
}

export function ChatHeader({ chatId }: Props) {
    const dispatch = useAppDispatch();
    const chat = useAppSelector(s => s.messenger.chats.find(c => c.id === chatId));
    const presence = useAppSelector(
        s => s.messenger.users[chat?.companion?.id ?? -1]?.presence
    );

    const handleBack = () => {
        dispatch(setActiveChat(null))
    }

    if (!chat) return null;

    const displayName = chat.type === 'direct'
        ? `${chat.companion?.firstName} ${chat.companion?.lastName}`
        : chat.name ?? 'Группа';
    
    const avatar = chat.type === 'direct'
        ? chat.companion?.avatarUrl
        : chat.avatarUrl;

    const subtitle = chat.type === 'direct'
        ? presence?.status === 'online'
            ? 'в сети'
            : presence?.lastSeen
                ? `был(а) в сети ${new Date(presence.lastSeen).toLocaleTimeString('ru', {
                    hour: '2-digit', minute: '2-digit'
                })}`
            : 'не в сети'
        : 'группа';
    
    const isOnline = presence?.status === 'online';

    return (
        <div className={styles.header}>
            <button className={styles.backBtn} onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
            </button>
            <div className={styles.avatarWrap}>
                {avatar
                    ? <img src={avatar} className={styles.avatar} alt="" />
                    : <div className={styles.avatarFallback}>
                        {displayName[0]?.toUpperCase()}
                    </div>
                }
            </div>
            <div className={styles.info}>
                <span className={styles.name}>{displayName}</span>
                <span className={`${styles.subtitle} ${isOnline ? styles.online : ''}`}>
                    {subtitle}
                </span>
            </div>
        </div>
    );
}