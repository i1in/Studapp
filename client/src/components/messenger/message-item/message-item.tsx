import React, { useRef } from 'react';
import { ContextMenu } from '../context-menu/context-menu';
import { useAppSelector } from '../../../store/hooks';
import { useContextMenu } from '../../../hooks/useContextMenu';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import styles from './message-item.module.css';
import { MessagePayload } from '../../../types/chat';
import { getMemberRole } from '../../../const';

interface Props {
    message: MessagePayload;
    onEditInit: (messageId: number, text: string) => void;
}

export function MessageItem({ message, onEditInit }: Props) {
    const myId = useAppSelector((s) => s.auth.userId);
    const chat = useAppSelector((s) =>
        s.messenger.chats.find((c) => c.id === message.chatId),
    );
    const { onContextMenu, close, coords } = useContextMenu();
    console.log('[ATTACHMENTS]', message.id, message.attachments);

    const isOwn = message.sender?.id === myId;
    const isSystem = message.type === 'system';

    const handleDelete = () => {
        socketEmitters.deleteMessage(message.id);
        close();
    };

    const handleEdit = () => {
        onEditInit(message.id, message.text);
        close();
    };

    if (isSystem) {
        return <div className={styles.system}>{message.text}</div>;
    }

    if (message.deletedAt) {
        return (
            <div
                className={`${styles.wrap} ${isOwn ? styles.own : styles.other}`}
            >
                <div className={`${styles.bubble} ${styles.deleted}`}>
                    Сообщение удалено
                </div>
            </div>
        );
    }

    const time = new Date(message.createdAt).toLocaleTimeString('ru', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const senderMemberInfo = chat?.allMembers?.find(
        (m) => m.userId === message.sender?.id,
    );
    const senderRoomRole = senderMemberInfo?.role || 'member';

    return (
        <div className={`${styles.wrap} ${isOwn ? styles.own : styles.other}`}>
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
                    <div className={styles.senderInfo}>
                        <div className={styles.senderFullName}>
                            <span className={styles.senderFirstName}>
                                {message.sender?.firstName}
                            </span>
                            <span className={styles.senderlastName}>
                                {message.sender?.lastName}
                            </span>
                        </div>
                        <span className={styles.senderRole}>
                            {getMemberRole(senderRoomRole)}
                        </span>
                    </div>
                )}
                <div
                    className={`${styles.bubble} ${isOwn ? styles.ownBubble : styles.otherBubble}`}
                    onContextMenu={onContextMenu}
                    style={{ position: 'relative' }}
                >
                    {message.attachments && message.attachments.length > 0 && (
                        <>
                            {(() => {
                                const images = message.attachments.filter(
                                    (file) =>
                                        file.mimeType?.startsWith('image/') ||
                                        /\.(jpg|jpeg|png|webp|gif)$/i.test(
                                            file.url,
                                        ),
                                );
                                const documents = message.attachments.filter(
                                    (file) => !images.includes(file),
                                );

                                const serverUrl =
                                    import.meta.env.VITE_API_URL ||
                                    'http://78.17.43.237:5001';

                                return (
                                    <>
                                        {images.length > 0 && (
                                            <div
                                                className={styles.imagesGridRow}
                                            >
                                                {images.map((file) => {
                                                    const fileFullUrl = `${serverUrl}${file.url}`;
                                                    return (
                                                        <div
                                                            key={file.id}
                                                            className={
                                                                styles.imageMiniWrap
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    fileFullUrl
                                                                }
                                                                className={
                                                                    styles.attachedImageMini
                                                                }
                                                                alt={
                                                                    file.originalName
                                                                }
                                                                loading="lazy"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    window.open(
                                                                        fileFullUrl,
                                                                        '_blank',
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}

                                        {documents.length > 0 && (
                                            <div
                                                className={
                                                    styles.docsStackColumn
                                                }
                                            >
                                                {documents.map((file) => {
                                                    const fileFullUrl = `${serverUrl}${file.url}`;
                                                    const fileSizeKb = file.size
                                                        ? `${Math.round(file.size / 1024)} KB`
                                                        : '';
                                                    const ext =
                                                        file.originalName
                                                            ?.split('.')
                                                            .pop()
                                                            ?.toUpperCase() ||
                                                        'FILE';

                                                    return (
                                                        <a
                                                            key={file.id}
                                                            href={fileFullUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={
                                                                styles.docAttachmentLink
                                                            }
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles.docFileIcon
                                                                }
                                                            >
                                                                <span
                                                                    className={
                                                                        styles.docExtBadge
                                                                    }
                                                                >
                                                                    {ext}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles.docFileInfo
                                                                }
                                                            >
                                                                <span
                                                                    className={
                                                                        styles.docOriginalName
                                                                    }
                                                                >
                                                                    {
                                                                        file.originalName
                                                                    }
                                                                </span>
                                                                <span
                                                                    className={
                                                                        styles.docFileSize
                                                                    }
                                                                >
                                                                    {fileSizeKb}
                                                                </span>
                                                            </div>
                                                        </a>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </>
                    )}
                    <div className={styles.textContent}>
                        <span className={styles.text}>{message.text}</span>
                        <span className={styles.meta}>
                            {message.editedAt && (
                                <span className={styles.edited}>ред. </span>
                            )}
                            {time}
                        </span>
                    </div>
                    <ContextMenu onClose={close} coords={coords}>
                        <div className={styles.reactionRow}>
                            {['👍', '🔥', '❤️', '😂', '😮'].map((emoji) => (
                                <button
                                    key={emoji}
                                    className={styles.menuBtn}
                                    onClick={() => {
                                        console.log(
                                            `[REACTION] Отправляем эмодзи ${emoji} для сообщения ${message.id}`,
                                        );
                                        socketEmitters.reactMessage(
                                            message.id,
                                            emoji,
                                        );
                                        close();
                                    }}
                                >
                                    <span className={styles.emojiText}>
                                        {emoji}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div role="divider" />
                        {isOwn && (
                            <>
                                <button role="menuitem" onClick={handleEdit}>
                                    Редактировать
                                </button>
                                <button
                                    role="menuitem"
                                    data-danger="true"
                                    onClick={handleDelete}
                                >
                                    Удалить
                                </button>
                            </>
                        )}
                    </ContextMenu>
                </div>

                {message.reactions && message.reactions.length > 0 && (
                    <div className={styles.deployedReactions}>
                        {(() => {
                            const grouped: Record<string, number[]> = {};

                            message.reactions.forEach((r) => {
                                if (r.userId === null || r.userId === undefined)
                                    return;

                                if (!grouped[r.emoji]) grouped[r.emoji] = [];

                                if (!grouped[r.emoji].includes(r.userId)) {
                                    grouped[r.emoji].push(r.userId);
                                }
                            });

                            return Object.entries(grouped).map(
                                ([emoji, userIds]) => {
                                    if (myId === null) return;
                                    const isMyReaction = userIds
                                        .filter(
                                            (id): id is number => id !== null,
                                        )
                                        .includes(myId);
                                    const count = userIds.length;

                                    const usersToShow = userIds.slice(0, 3);

                                    return (
                                        <button
                                            key={`group-react-${emoji}`}
                                            className={`${styles.emojiBadge} ${isMyReaction ? styles.myReaction : ''}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                socketEmitters.reactMessage(
                                                    message.id,
                                                    emoji,
                                                );
                                            }}
                                        >
                                            <span
                                                className={
                                                    styles.activeEmojiBadge
                                                }
                                            >
                                                {emoji}
                                            </span>

                                            <div className={styles.avatarStack}>
                                                {usersToShow.map(
                                                    (userId, idx) => {
                                                        const member =
                                                            chat?.allMembers?.find(
                                                                (m) =>
                                                                    m.userId ===
                                                                    userId,
                                                            );
                                                        const user =
                                                            member?.user;
                                                        const fallbackLetter =
                                                            user?.firstName?.[0]?.toUpperCase() ||
                                                            '?';

                                                        return (
                                                            <div
                                                                key={userId}
                                                                className={
                                                                    styles.avatarWrap
                                                                }
                                                                style={{
                                                                    zIndex:
                                                                        10 -
                                                                        idx,
                                                                    marginLeft:
                                                                        idx > 0
                                                                            ? '-5px'
                                                                            : '0px',
                                                                }}
                                                            >
                                                                {user?.avatarUrl ? (
                                                                    <img
                                                                        src={
                                                                            user.avatarUrl
                                                                        }
                                                                        className={
                                                                            styles.miniAvatar
                                                                        }
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <span
                                                                        className={
                                                                            styles.avatarFallback
                                                                        }
                                                                    >
                                                                        {
                                                                            fallbackLetter
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        );
                                                    },
                                                )}
                                            </div>

                                            {count > 3 && (
                                                <span
                                                    className={
                                                        styles.reactionCount
                                                    }
                                                >
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                },
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
}
