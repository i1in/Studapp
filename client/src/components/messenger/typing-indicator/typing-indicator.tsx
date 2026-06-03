import React from "react";
import { useAppSelector } from "../../../store/hooks";
import styles from './typing-indicator.module.css';

interface Props {
    chatId: number;
    className?: string;
    chatType?: string;
}

export function TypingIndicator({ chatId, className, chatType }: Props) {
    // id печатающих
    const typingUserIds = useAppSelector(
        s => s.messenger.typingUsers[chatId] ?? []
    );

    const currentChat = useAppSelector(
        s => s.messenger.chats.find(c => c.id === chatId)
    );

    if (!typingUserIds.length) return null;

    let text = 'печатает...';

    if (chatType !== 'direct' && currentChat?.allMembers) {
        const names = typingUserIds
        .map(typingId => {
            const member = currentChat.allMembers?.find(m => m.userId === typingId);
            return member?.user ? `${member.user.firstName}` : 'Кто-то';
        })
        .filter(Boolean)
        .join(', ')

        text = names ? `${names} печатают...` : 'печатает...'
    }

    return (
        <div className={className}>
            <span className={styles.dots}>
                <span /><span /><span />
            </span>
            <span>{text}</span>
        </div>
    );
}