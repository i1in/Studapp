import { useAppSelector } from "../../../store/hooks";
import styles from './message-item.module.css';

interface Props {
    message: MessagePayload;
}

export function MessageItem({ message }: Props) {
    const myId = useAppSelector(s => s.auth.userId);
    const isOwn = message.sender?.id === myId;
    const isSystem = message.type === 'system';

    if (isSystem) {
        return <div className={styles.system}>{message.text}</div>
    }

    if (message.deletedAt) {
        return (
            <div className={`${styles.wrap} ${isOwn ? styles.own : styles.other}`}>
                <div className={`${styles.bubble} ${styles.deleted}`}>
                    Сообщение удалено
                </div>
            </div>
        );
    }

    const time = new Date(message.createdAt).toLocaleTimeString('ru', {
        hour: '2-digit', minute: '2-digit',
    });

    return (
        <div className={`${styles.wrap} ${isOwn ? styles.own : styles.other}`}>
            {!isOwn && message.sender?.avatarUrl && (
                <img
                    src={message.sender?.avatarUrl ?? ''}
                    className={styles.avatar}
                    alt=""
                />
            )}
            <div className={styles.content}>
                {!isOwn && (
                    <span className={styles.senderName}>
                        {message.sender?.firstName} {message.sender?.lastName}
                    </span>
                )}
                {/* {message.replyToId && (
                    <div className={styles.reply}>
                        <span className={styles.replyAuthor}>
                            {message.replyToId.sender?.firstName}
                        </span>
                        <span className={styles.replyText}>
                            {message.replyToId.text}
                        </span>
                    </div>
                )} */}
                <div className={`${styles.bubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}>
                    <span className={styles.text}>{message.text}</span>
                    <span className={styles.meta}>
                        {message.editedAt && <span className={styles.edited}>ред. </span>}
                        {time}
                    </span>
                </div>
            </div>
        </div>
    );
}