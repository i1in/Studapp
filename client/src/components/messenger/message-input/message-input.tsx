import React, { useState, useRef, useEffect } from 'react';
import { useCoreSocket } from '../../../hooks/shared/socket/core/useCoreSocket';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import styles from './message-input.module.css';

interface Props {
    chatId: number;
    editingMessage: { id: number; text: string } | null;
    onCancelEdit: () => void;
}

export function MessageInput({ chatId, editingMessage, onCancelEdit }: Props) {
    const [text, setText] = useState('');
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';

        const newHeight = Math.min(textarea.scrollHeight, 150);
        textarea.style.height = `${newHeight}px`;
    }, [text]);

    useEffect(() => {
        if (editingMessage && editingMessage.text === text) return;

        if (editingMessage) {
            setText(editingMessage.text);
        } else {
            setText('');
        }
    }, [editingMessage])

    const stopTyping = () => {
        socketEmitters.sendTyping(chatId, false);
        if (typingTimer.current) clearTimeout(typingTimer.current);
    }

    const handleSend = () => {
        if (!text.trim()) return;
        if (editingMessage && editingMessage.text === text) return;

        if (chatId < 0) {
            const targetUserId = Math.abs(chatId);

            socketEmitters.createChat({
                type: 'direct',
                userIds: [targetUserId],
                name: undefined,
                firstMessageText: text.trim()
            } as any);

        } else if (editingMessage) {
            socketEmitters.editMessage(editingMessage.id, text.trim());

            onCancelEdit();
        } else {
            socketEmitters.sendMessage(chatId, text.trim());
        }

        setText('');
        stopTyping();
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        if (!editingMessage) {
            socketEmitters.sendTyping(chatId, true);
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(stopTyping, 1500);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className={styles.messageInput}>
            <div className={styles.wrap}>
                {editingMessage && (
                    <div className={styles.editBar}>
                        <div className={styles.editInfo}>
                            <span className={styles.editTitle}>Редактирование</span>
                            <span className={styles.editText}>{editingMessage.text}</span>
                        </div>
                        <button className={styles.cancelEditBtn} onClick={onCancelEdit}>✕</button>
                    </div>
                )}
                <div className={styles.messageArea}>
                    <textarea
                        ref={textareaRef}
                        className={styles.input}
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={editingMessage ? 'Редактировать сообщение' : 'Сообщение'}
                        rows={1}
                    />
                    <button
                        className={styles.btn}
                        onClick={handleSend}
                        disabled={!text.trim() || text.trim() === editingMessage?.text}
                    >
                        {editingMessage ? '✓' : '➤'}
                    </button>
                </div>
            </div>
        </div>
    );
}