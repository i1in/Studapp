import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { selectMessagesByChat } from "../../../features/api/messenger/messagesSlice";
import { ChatHeader } from "../chat-header/chat-header";
import { MessageItem } from '../message-item/message-item';
import { MessageInput } from '../message-input/message-input';
import { ChatHello } from "../chat-hello/chat-hello";
import styles from './chat-window.module.css';
import { useChatRoomSocket } from "../../../hooks/shared/socket/chat/chat-room/useChatRoomSocket";
import { messengerApi } from "../../../features/api/messenger/messengerApi";

interface Props {
    chatId: number;
}

export function ChatWindow({ chatId }: Props) {
    useChatRoomSocket(chatId);

    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);
    const prevLengthRef = useRef<number>(0);
    const isInitialLoadRef = useRef<boolean>(true);

    const hasScrolledInitiallyRef = useRef(false);

    const [editingMessage, setEditingMessage] = useState<{ id: number; text: string } | null>(null);
    const [inputHeight, setInputHeight] = useState(70);
    const [showScrollDownBtn, setShowScrollDownBtn] = useState(false);
    const [unreadScrolledCount, setUnreadScrolledCount] = useState(0);
    const [activeMenuMessageId, setActiveMenuMessageId] = useState<number | null>(null);

    const isHistoryLoading = useAppSelector(s => s.messages.isCurrentChatLoading);
    const messages = useAppSelector(s => selectMessagesByChat(s, chatId));
    const currentUserId = useAppSelector(s => s.auth.userId);

    useEffect(() => {
        hasScrolledInitiallyRef.current = false;
        isInitialLoadRef.current = true;
        prevLengthRef.current = 0;
        setEditingMessage(null);
        setShowScrollDownBtn(false);
        setUnreadScrolledCount(0);
    }, [chatId]);


    useEffect(() => {
        const el = inputRef.current;
        if (!el) return;
        const observer = new ResizeObserver(() => setInputHeight(el.clientHeight));
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const scrollToBottom = (behavior: ScrollBehavior = 'auto') => {
        const container = messagesContainerRef.current;
        if (!container) return;
        requestAnimationFrame(() => {
            container.scrollTo({ top: container.scrollHeight, behavior });
        });
    };

    const handleEditInit = (messageId: number, text: string) => {
        setEditingMessage({ id: messageId, text });
    };

    const handleScrollTracking = () => {
        const container = messagesContainerRef.current;
        if (!container) return;

        const distanceToBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
        
        if (distanceToBottom > 300) {
            setShowScrollDownBtn(true);
        } else {
            setShowScrollDownBtn(false);
            setUnreadScrolledCount(0);
        }
    };

    useEffect(() => {
        if (isHistoryLoading) return;
        if (hasScrolledInitiallyRef.current) return;
        if (messages.length === 0) return;

        const container = messagesContainerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            const c = messagesContainerRef.current;
            if (!c) return;

            if (c.scrollHeight > c.clientHeight) {
                c.scrollTop = c.scrollHeight;
                hasScrolledInitiallyRef.current = true;
                observer.disconnect();
            }
        });

        observer.observe(container);

        return () => observer.disconnect();
    }, [isHistoryLoading, messages.length]);

    useEffect(() => {
        const container = messagesContainerRef.current;
        if (!container || isHistoryLoading) return;
        if (!hasScrolledInitiallyRef.current) return;

        if (messages.length > prevLengthRef.current) {
            const lastMessage = messages[messages.length - 1];
            const isMyMessage =
                lastMessage?.senderId === currentUserId ||
                (lastMessage as any)?.sender?.id === currentUserId;

            const distanceToBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;

            if (isMyMessage || distanceToBottom < 200) {
                requestAnimationFrame(() => {
                    const c = messagesContainerRef.current;
                    if (c) c.scrollTo({
                        top: c.scrollHeight,
                        behavior: 'smooth',
                    });
                    setUnreadScrolledCount(0);
                })
            } else {
                if (prevLengthRef.current > 0) {
                    const delta = messages.length - prevLengthRef.current;
                    setUnreadScrolledCount(prev => prev + delta);
                }
            }
        } else {
            const distanceToBottom =
                container.scrollHeight - container.scrollTop - container.clientHeight;

            if (distanceToBottom < 150) {
                container.scrollTop = container.scrollHeight;
            }
        }

        prevLengthRef.current = messages.length;
    }, [messages.length, inputHeight, isHistoryLoading, currentUserId]);

    const handleScrollToBottom = () => {
        scrollToBottom('smooth');
        setUnreadScrolledCount(0);
        setShowScrollDownBtn(false);
    };

    const handleCloseAllMenus = () => setActiveMenuMessageId(null);

    return (
        <div className={styles.window}>
            <ChatHeader chatId={chatId} />
            <div
                ref={messagesContainerRef}
                className={styles.messages}
                onScroll={() => {
                    handleScrollTracking();
                    setActiveMenuMessageId(null);
                }}
                style={{ paddingBottom: `${inputHeight + 15}px` }}
            >
                {isHistoryLoading ? (
                    <div className={styles.loadingHistoryPlaceholder} />
                ) : messages.length === 0 ? (
                    <ChatHello />
                ) : (
                    messages.map((msg) => (
                        <MessageItem
                            key={`${chatId}-${msg.id}`}
                            message={msg}
                            onEditInit={handleEditInit}
                            isMenuOpen={activeMenuMessageId === msg.id}
                            onOpenMenu={() => setActiveMenuMessageId(msg.id)}
                            onCloseMenu={() => setActiveMenuMessageId(null)}
                        />
                    ))
                )}
            </div>

            {showScrollDownBtn && (
                <button
                    className={styles.scrollDownBtn}
                    onClick={handleScrollToBottom}
                    style={{ bottom: `${inputHeight + 20}px` }}
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                    {unreadScrolledCount > 0 && (
                        <span className={styles.scrollBadge}>{unreadScrolledCount}</span>
                    )}
                </button>
            )}
            <div className={styles.inputContainer} ref={inputRef}>
                <MessageInput
                    chatId={chatId}
                    editingMessage={editingMessage}
                    onCancelEdit={() => setEditingMessage(null)}
                />
            </div>
        </div>
    );
}