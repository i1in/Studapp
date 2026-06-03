import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../../store/hooks";
import { socketEmitters } from "../../../hooks/shared/socketEmitters";
import styles from './message-item.module.css';

interface Props {
    message: MessagePayload;
    onEditInit: (messageId: number, text: string) => void;
    isMenuOpen: boolean;
    onOpenMenu: () => void;
    onCloseMenu: () => void;
}

export function MessageItem({ message, onEditInit, isMenuOpen, onOpenMenu, onCloseMenu }: Props) {
    const myId = useAppSelector(s => s.auth.userId);
    const chat = useAppSelector(s => s.messenger.chats.find(c => c.id === message.chatId));
    const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
    const [shouldRender, setShouldRender] = useState(false);

    const isOwn = message.sender?.id === myId;
    const isSystem = message.type === 'system';

    useEffect(() => {
        if (isMenuOpen) setShouldRender(true);
    }, [isMenuOpen]);

    const handleAnimationEnd = () => {
        if (!isMenuOpen) setShouldRender(false);
    }

    useEffect(() => {
        if (!isMenuOpen) return;

        const closeMenu = () => onCloseMenu();

        window.addEventListener('click', closeMenu);

        return () => window.removeEventListener('click', closeMenu);
    }, [isMenuOpen, onCloseMenu]);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        console.log(`Context menu opened for message:`, message);

        if (message.deletedAt || isSystem) return;

        const menuWidth = 160;
        const menuHeight = isOwn ? 180 : 100;

        const left = e.clientX + menuWidth > window.innerWidth
            ? window.innerWidth - menuWidth
            : e.clientX;

        const top = e.clientY + menuHeight > window.innerHeight
            ? window.innerHeight - menuHeight
            : e.clientY;

        setMenuCoords({
            top,
            left,
        });

        onOpenMenu();
    };

    const handleDelete = () => {
        socketEmitters.deleteMessage(message.id);
        onCloseMenu();
    };

    const handleEdit = () => {
        onEditInit(message.id, message.text);
        onCloseMenu();
    }

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
        <div
            className={`${styles.wrap} ${isOwn ? styles.own : styles.other}`}
        >
            {!isOwn && message.sender?.avatarUrl && (
                <img
                    src={message.sender?.avatarUrl ?? ''}
                    className={styles.avatar}
                    width="36"
                    height="36"
                    alt=""
                />
            )}
            <div className={styles.content}>
                {!isOwn && chat?.type !== 'direct' && (
                    <span className={styles.senderName}>
                        {message.sender?.firstName} {message.sender?.lastName}
                    </span>
                )}
                <div
                    className={`${styles.bubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}
                    onContextMenu={handleContextMenu}
                >
                    <span className={styles.text}>{message.text}</span>
                    <span className={styles.meta}>
                        {message.editedAt && <span className={styles.edited}>ред. </span>}
                        {time}
                    </span>

                    {shouldRender && (
                        <div
                            className={`${styles.contextMenu} ${isMenuOpen ? styles.visible : ''}`}
                            style={{
                                top: `${menuCoords.top}px`,
                                left: `${menuCoords.left}px`
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onAnimationEnd={handleAnimationEnd}
                        >
                            <div className={styles.reactionRow}>
                                {['👍', '🔥', '❤️', '😂', '😮'].map(emoji => (
                                    <button
                                        key={emoji}
                                        className={styles.menuBtn}
                                        onClick={() => {
                                            console.log(`[REACTION] Отправляем эмодзи ${emoji} для сообщения ${message.id}`);
                                            socketEmitters.reactMessage(message.id, emoji);
                                            onCloseMenu();
                                        }}
                                    >
                                        <span className={styles.emojiText}>{emoji}</span>
                                    </button>
                                ))}
                            </div>
                            {isOwn && (
                                <div className={styles.contextBtns}>
                                    <button className={styles.menuBtn} onClick={handleEdit}>
                                        Редактировать
                                    </button>
                                    <button className={`${styles.menuBtn} ${styles.deleteBtn}`} onClick={handleDelete}>
                                        Удалить
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {message.reactions && message.reactions.length > 0 && (
                    <div className={styles.deployedReactions}>
                        {(() => {
                            const grouped: Record<string, number[]> = {};

                            message.reactions.forEach(r => {
                                if (r.userId === null || r.userId === undefined) return;

                                if (!grouped[r.emoji]) grouped[r.emoji] = [];

                                if (!grouped[r.emoji].includes(r.userId)) {
                                    grouped[r.emoji].push(r.userId);
                                }
                            });

                            return Object.entries(grouped).map(([emoji, userIds]) => {
                                if (myId === null) return;
                                const isMyReaction = userIds.filter((id): id is number => id !== null).includes(myId);
                                const count = userIds.length;

                                const usersToShow = userIds.slice(0, 3);

                                return (
                                    <button
                                        key={`group-react-${emoji}`}
                                        className={`${styles.emojiBadge} ${isMyReaction ? styles.myReaction : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            socketEmitters.reactMessage(message.id, emoji);
                                        }}
                                    >
                                        <span className={styles.activeEmojiBadge}>{emoji}</span>

                                        <div className={styles.avatarStack}>
                                            {usersToShow.map((userId, idx) => {
                                                const member = chat?.allMembers?.find(m => m.userId === userId);
                                                const user = member?.user;
                                                const fallbackLetter = user?.firstName?.[0]?.toUpperCase() || '?';

                                                return (
                                                    <div
                                                        key={userId}
                                                        className={styles.avatarWrap}
                                                        style={{
                                                            zIndex: 10 - idx,
                                                            marginLeft: idx > 0 ? '-5px' : '0px'
                                                        }}
                                                    >
                                                        {user?.avatarUrl ? (
                                                            <img src={user.avatarUrl} className={styles.miniAvatar} alt="" />
                                                        ) : (
                                                            <span className={styles.avatarFallback}>
                                                                {fallbackLetter}
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {count > 3 && (
                                            <span className={styles.reactionCount}>{count}</span>
                                        )}
                                    </button>
                                );
                            })
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}