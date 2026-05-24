import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setActiveChat, setChats } from "../../features/api/messenger/messengerSlice";
import { ChatList } from "../../components/messenger/chat-list/chat-list";
import { ChatWindow } from "../../components/messenger/chat-window/chat-window";
import styles from './messenger.module.css';
import { ChatMenu } from "../../components/messenger/chat-menu/chat-menu";

export default function MessengerPage() {
    const dispatch = useAppDispatch();
    const activeChatId = useAppSelector(s => s.messenger.activeChatId);

    useEffect(() => {
        return () => {
            dispatch(setActiveChat(null));
        }
    }, [dispatch])

    const layoutClassName = `${styles.layout} ${activeChatId ? styles.hasActiveChat : ''}`;
    const menuClassName = `menu ${activeChatId ? styles.mobileHidden : ''}`;

    return (
        <div className={layoutClassName}>
            <ChatMenu menuClassName={menuClassName} />

            <div className={styles.workspace}>
                <aside className={styles.sidebar}>
                    <ChatList />
                </aside>
                <main className={styles.main}>
                    {activeChatId ? (
                        <ChatWindow chatId={activeChatId} />
                    ) : (
                        <div className={styles.empty}>Выберите чат</div>
                    )}
                </main>
            </div>
        </div>
    );
}