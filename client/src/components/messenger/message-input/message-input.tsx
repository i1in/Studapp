import React, { useState, useRef } from 'react';
import { useCoreSocket } from '../../../hooks/shared/socket/core/useCoreSocket';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import styles from './message-input.module.css';

interface Props {
    chatId: number;
}

export function MessageInput({ chatId }: Props) {
    const [text, setText] = useState('');
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stopTyping = () => {
        socketEmitters.sendTyping(chatId, false);
        if (typingTimer.current) clearTimeout(typingTimer.current);
    }

    const handleSend = () => {
        if (!text.trim()) return;
        socketEmitters.sendMessage(chatId, text.trim());
        setText('');
        stopTyping();
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        socketEmitters.sendTyping(chatId, true);
        if (typingTimer.current) clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(stopTyping, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className={styles.wrap}>
            <textarea
                className={styles.input}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder='Сообщение'
                rows={1}
            />
            <button
                className={styles.btn}
                onClick={handleSend}
                disabled={!text.trim()}
            >
                ➤
            </button>
        </div>
    );
}