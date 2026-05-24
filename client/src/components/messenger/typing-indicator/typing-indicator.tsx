import { useAppSelector } from "../../../store/hooks";
import styles from './typing-indicator.module.css';

interface Props {
    chatId: number;
}

export function TypingIndicator({ chatId }: Props) {
    // id печатающих
    const typingUserIds = useAppSelector(
        s => s.messenger.typingUsers[chatId] ?? []
    );

    const currentChat = useAppSelector(
        s => s.messenger.chats.find(c => c.id === chatId)
    );

    if (!typingUserIds.length || !currentChat) {
        return <div className={styles.placeholder} />
    }

    const names = typingUserIds
        .map(typingId => {
            const member = currentChat.allMembers?.find(m => m.userId === typingId);
            return member?.user ? `${member.user.firstName}` : 'Кто-то';
        })
        .filter(Boolean)
        .join(', ')

    return (
        <div className={styles.indicator}>
            <span className={styles.dots}>
                <span /><span /><span />
            </span>
            {names} печатает...
        </div>
    );
}