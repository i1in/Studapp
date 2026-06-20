import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { setActiveChat } from '../../../features/api/messenger/messengerSlice';
import { SidebarMode } from '../../../pages/messenger-page/messenger-page';
import { ChatListItem } from '../chat-list-item/chat-list-item';
import { ChatSuggestItem } from '../chat-suggest-item/chat-suggest-item';
import { ContextMenu } from '../context-menu/context-menu';
import { useGetChatsQuery } from '../../../features/api/messenger/messengerApi';
import {
    useGetProfileByIdQuery,
    useGetFacultySuggestionsQuery,
    useGetSearchUsersQuery,
    userApi,
} from '../../../features/api/user/userApi';

import styles from './chat-list.module.css';
import { getFaculty } from '../../../const';
import { useContextMenu } from '../../../hooks/useContextMenu';

interface Props {
    onOpenDrawer: () => void;
    onSwitchMode: (mode: SidebarMode) => void;
}

const SEARCH_STORAGE_KEY = 'messenger_search_history';

function getSearchHistory(): any[] {
    try {
        const data = localStorage.getItem(SEARCH_STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveToSearchHistory(user: any) {
    try {
        const history = getSearchHistory();

        const filtered = history.filter((u: any) => u.id !== user.id);

        const newHistory = [user, ...filtered].slice(0, 20);
        localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newHistory));
    } catch (e) {
        console.error('Failed to save search history: ', e);
    }
}

function removeFromSearchHistory(userId: number): any[] {
    try {
        const history = getSearchHistory();
        const newHistory = history.filter((u: any) => u.id !== userId);

        localStorage.setItem(SEARCH_STORAGE_KEY, JSON.stringify(newHistory));

        return newHistory;
    } catch (e) {
        return [];
    }
}

export function ChatList({ onOpenDrawer, onSwitchMode }: Props) {
    const dispatch = useAppDispatch();
    const { isLoading, isError } = useGetChatsQuery();

    const [searchQuery, setSearchQuery] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [historyList, setHistoryList] = useState<any[]>([]);

    const chats = useAppSelector((s) => s.messenger.chats);
    const activeChatId = useAppSelector((s) => s.messenger.activeChatId);
    const { onContextMenu, close, coords } = useContextMenu();

    const { data: currentUser } = useGetProfileByIdQuery();

    const isSearching = searchQuery.trim().length > 0;

    useEffect(() => {
        setHistoryList(getSearchHistory());
    }, []);

    const { data: suggestionsData = [] } = useGetFacultySuggestionsQuery(
        currentUser?.faculty ?? '',
        { skip: !currentUser?.faculty },
    );

    const { data: searchData = [], isFetching: isSearchLoading } =
        useGetSearchUsersQuery(searchQuery, { skip: !isSearching });

    const suggestions = useMemo(() => {
        return suggestionsData.filter((u: any) => u.id !== currentUser?.id);
    }, [suggestionsData, currentUser?.id]);

    const globalUsers = useMemo(() => {
        return searchData.filter((u: any) => u.id !== currentUser?.id);
    }, [searchData, currentUser?.id]);

    const sortedChats = useMemo(() => {
        return [...chats].sort((a, b) => {
            const dateA = a.lastMessage
                ? new Date(a.lastMessage.createdAt).getTime()
                : 0;
            const dateB = b.lastMessage
                ? new Date(b.lastMessage.createdAt).getTime()
                : 0;

            return dateB - dateA;
        });
    }, [chats]);

    const handleSelect = useCallback(
        (chatId: number) => {
            dispatch(setActiveChat(chatId));
        },
        [dispatch],
    );

    const handleStartChat = useCallback(
        (targetUser: any) => {
            saveToSearchHistory(targetUser);
            setHistoryList(getSearchHistory());

            dispatch(setActiveChat(-targetUser.id));
            setSearchQuery('');
            setIsInputFocused(false);
        },
        [globalUsers, suggestions, dispatch],
    );

    const handleClearHistoryItem = (e: React.MouseEvent, userId: number) => {
        e.stopPropagation();

        const freshHistory = removeFromSearchHistory(userId);
        setHistoryList(freshHistory);
    };

    const handleSelectMode = (mode: SidebarMode, e: React.MouseEvent) => {
        e.stopPropagation();
        onSwitchMode(mode);
    };

    if (isLoading) {
        return <div className={styles.loading}>Загрузка</div>;
    }

    if (isError) {
        return <div className={styles.error}>Не удалось загрузить чаты</div>;
    }

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button
                        className={styles.headerBtn}
                        onClick={onOpenDrawer}
                        title="Меню"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                    <span className={styles.title}>Чаты</span>
                </div>
                <button
                    className={styles.headerBtn}
                    onContextMenu={onContextMenu}
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(e as any);
                    }}
                    title="Создать чат"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                </button>
                <ContextMenu onClose={close} coords={coords}>
                    <div className={`${styles.createMenu}`}>
                        <button
                            role="menuitem"
                            onClick={(e) => handleSelectMode('create_group', e)}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: '8px' }}
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Новая группа
                        </button>
                        <button
                            role="menuitem"
                            onClick={(e) =>
                                handleSelectMode('create_channel', e)
                            }
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ marginRight: '8px' }}
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Новый канал
                        </button>
                    </div>
                </ContextMenu>
            </header>
            <div className={styles.searchHeader}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsInputFocused(true)}
                        onBlur={() =>
                            setTimeout(() => setIsInputFocused(false), 10)
                        }
                    />
                    {isSearching && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => setSearchQuery('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

            <div className={styles.list}>
                {!isSearching && !isInputFocused && (
                    <>
                        {!sortedChats.length && (
                            <span className={styles.empty}>Нет чатов</span>
                        )}
                        {sortedChats.map((chat) => (
                            <ChatListItem
                                key={chat.id}
                                chat={chat}
                                isActive={chat.id === activeChatId}
                                onSelect={() => handleSelect(chat.id)}
                            />
                        ))}
                    </>
                )}

                {!isSearching && isInputFocused && (
                    <div className={styles.historyResults}>
                        <span className={styles.sectionTitle}>Недавние</span>
                        {historyList.length === 0 ? (
                            <span className={styles.miniEmpty}>
                                История поиска пуста
                            </span>
                        ) : (
                            historyList.map((user) => (
                                <div
                                    key={`history-${user.id}`}
                                    style={{ position: 'relative' }}
                                    onMouseDown={(e) => e.preventDefault()}
                                >
                                    <ChatListItem
                                        chat={
                                            {
                                                id: -user.id,
                                                type: 'direct',
                                                companion: user,
                                                lastMessage: null,
                                                unreadCount: 0,
                                            } as any
                                        }
                                        isActive={activeChatId === -user.id}
                                        onSelect={() => handleStartChat(user)}
                                    />
                                    <button
                                        className={styles.deleteHistoryBtn}
                                        onClick={(e) =>
                                            handleClearHistoryItem(e, user.id)
                                        }
                                        onMouseDown={(e) => e.preventDefault()}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {isSearching && (
                    <div className={styles.searchResults}>
                        {suggestions.length > 0 && (
                            <div className={styles.suggestionsBlock}>
                                <div className={styles.suggestionsInfo}>
                                    <span className={styles.sectionTitle}>
                                        Предложенные по факультету
                                    </span>
                                    <span className={styles.sectionTitle}>
                                        {getFaculty(currentUser?.faculty)}
                                    </span>
                                </div>
                                <div className={styles.suggestionsList}>
                                    {suggestions.map((user) => (
                                        <ChatSuggestItem
                                            key={`suggest-${user.id}`}
                                            chat={
                                                {
                                                    id: -user.id,
                                                    type: 'direct',
                                                    companion: user,
                                                    lastMessage: null,
                                                    unreadCount: 0,
                                                } as any
                                            }
                                            isActive={activeChatId === -user.id}
                                            onSelect={() =>
                                                handleStartChat(user)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        <span className={styles.sectionTitle}>
                            Глобальный поиск
                        </span>

                        {isSearchLoading ? (
                            <span className={styles.miniLoading}></span>
                        ) : (
                            globalUsers.map((user) => (
                                <ChatListItem
                                    key={`search-${user.id}`}
                                    chat={
                                        {
                                            id: -user.id,
                                            type: 'direct',
                                            companion: user,
                                            lastMessage: null,
                                            unreadCount: 0,
                                        } as any
                                    }
                                    isActive={activeChatId === -user.id}
                                    onSelect={() => handleStartChat(user)}
                                />
                            ))
                        )}

                        {!isSearchLoading && globalUsers.length === 0 && (
                            <span className={styles.miniEmpty}>
                                Никого не найдено
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
