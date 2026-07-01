import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setActiveChat,
    setChats,
} from '../../features/api/messenger/messengerSlice';
import { useGetProfileByIdQuery } from '../../features/api/user/userApi';
import { ChatList } from '../../components/messenger/chat-list/chat-list';
import { ChatWindow } from '../../components/messenger/chat-window/chat-window';
import { SideDrawer } from '../../components/shared/side-drawer/side-drawer';
import { GroupCreatePanel } from '../../components/messenger/group-create-panel/group-create-panel';
import { useDrawer } from '../../hooks/useDrawer';
import { useMenuSlot } from '../../hooks/useMenuSlot';

import styles from './messenger.module.css';

export type SidebarMode = 'chats' | 'create_group' | 'create_channel';

export default function MessengerPage() {
    const dispatch = useAppDispatch();
    const activeChatId = useAppSelector((s) => s.messenger.activeChatId);

    const drawer = useDrawer();
    const { data: currentUser, isLoading } = useGetProfileByIdQuery();
    const [sidebarMode, setSidebarMode] = useState<SidebarMode>('chats');

    const { setSlot } = useMenuSlot();

    const slotRefCallback = useCallback(
        (el: HTMLDivElement | null) => {
            setSlot(el);
        },
        [setSlot],
    );

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
                            onOpenDrawer={drawer.open}
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
                <div ref={slotRefCallback} className={styles.menuSlot} />
            </aside>

            <main className={styles.main}>
                {activeChatId ? (
                    <ChatWindow key={activeChatId} chatId={activeChatId} />
                ) : (
                    <span className={styles.empty}>Выберите чат</span>
                )}
            </main>

            <SideDrawer
                isOpen={drawer.isOpen}
                onClose={drawer.close}
                currentUser={currentUser}
                isLoading={isLoading}
            />
        </div>
    );
}
