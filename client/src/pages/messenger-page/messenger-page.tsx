import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveChat, setChats } from "../../features/api/messenger/messengerSlice";
import { ChatList } from "../../components/messenger/chat-list/chat-list";
import { ChatWindow } from "../../components/messenger/chat-window/chat-window";
import { ChatMenu } from "../../components/messenger/chat-menu/chat-menu";

import styles from './messenger.module.css';

export default function MessengerPage() {
    const dispatch = useAppDispatch();
    const activeChatId = useAppSelector(s => s.messenger.activeChatId);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        return () => {
            dispatch(setActiveChat(null));
        }
    }, [dispatch])

    const layoutClassName = `${styles.layout} ${activeChatId ? styles.hasActiveChat : ''}`;

    return (
        <div className={layoutClassName}>

            <aside className={`${styles.sidebarColumn} ${activeChatId ? styles.mobileHidden : ''}`}>
                <div className={styles.chatListArea}>
                    <ChatList onOpenDrawer={() => setIsDrawerOpen(true)} />
                </div>
                <ChatMenu 
                    isChatActive={!!activeChatId}
                    isDrawerOpen={isDrawerOpen}
                    onCloseDrawer={() => setIsDrawerOpen(false)}
                />
            </aside>

            <main className={styles.main}>
                {activeChatId ? (
                    <ChatWindow key={activeChatId} chatId={activeChatId} />
                ) : (
                    <span className={styles.empty}>Выберите чат</span>
                )}
            </main>
        </div>
    );
}