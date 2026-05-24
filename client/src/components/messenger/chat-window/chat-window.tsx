import { useEffect, useMemo, useRef } from "react";
import { useAppSelector } from "../../../store/hooks";
import { selectMessagesByChat } from "../../../features/api/messenger/messagesSlice";
import { ChatHeader } from "../chat-header/chat-header";
import { MessageItem } from '../message-item/message-item';
import { MessageInput } from '../message-input/message-input';
import { TypingIndicator } from '../typing-indicator/typing-indicator';
import styles from './chat-window.module.css';
import { useChatRoomSocket } from "../../../hooks/shared/socket/chat/chat-room/useChatRoomSocket";

interface Props {
    chatId: number;
}

export function ChatWindow({ chatId }: Props) {
    useChatRoomSocket(chatId);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messages = useAppSelector(s => selectMessagesByChat(s, chatId));

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={styles.window}>
            <ChatHeader chatId={chatId} />
            <div className={styles.messages}>
                {messages.map(msg => (
                    <MessageItem key={msg.id} message={msg} />
                ))}
                <div ref={bottomRef}></div>
            </div>
            <TypingIndicator chatId={chatId} />
            <MessageInput chatId={chatId}/>
        </div>
    )
}