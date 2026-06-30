import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setActiveChat,
    setChats,
} from '../../features/api/messenger/messengerSlice';
import { ChatList } from '../../components/messenger/chat-list/chat-list';
import { ChatWindow } from '../../components/messenger/chat-window/chat-window';
import { AppMenu } from '../../components/app-menu/app-menu';
import { GroupCreatePanel } from '../../components/messenger/group-create-panel/group-create-panel';

import styles from './messenger.module.css';

export type SidebarMode = 'chats' | 'create_group' | 'create_channel';

export default function MessengerPage() {
    const dispatch = useAppDispatch();
    const activeChatId = useAppSelector((s) => s.messenger.activeChatId);

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<SidebarMode>('chats');

    useEffect(() => {
        return () => {
            dispatch(setActiveChat(null));
        };
    }, [dispatch]);

    const layoutClassName = `${styles.layout} ${activeChatId ? styles.hasActiveChat : ''}`;

    return (
        <div className={layoutClassName}>
            <aside
                className={`${styles.sidebarColumn} ${activeChatId ? styles.mobileHidden : ''}`}
            >
                <div className={styles.chatListArea}>
                    {sidebarMode === 'chats' && (
                        <ChatList
                            onOpenDrawer={() => setIsDrawerOpen(true)}
                            onSwitchMode={(mode) => setSidebarMode(mode)}
                        />
                    )}

                    {sidebarMode === 'create_group' && (
                        <GroupCreatePanel
                            type="group"
                            onBackToChats={() => setSidebarMode('chats')}
                        />
                    )}

                    {sidebarMode === 'create_channel' && (
                        <GroupCreatePanel
                            type="channel"
                            onBackToChats={() => setSidebarMode('chats')}
                        />
                    )}
                </div>
                <AppMenu
                    variant="messenger"
                    hideOnMobile={!!activeChatId}
                    isDrawerOpen={isDrawerOpen}
                    onOpenDrawer={() => setIsDrawerOpen(true)}
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
