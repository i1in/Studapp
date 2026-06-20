import React, { useState, useRef, useEffect } from 'react';
import { useUploadAttachmentsMutation } from '../../../features/api/messenger/messengerApi';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import styles from './message-input.module.css';

interface Props {
    chatId: number;
    editingMessage: { id: number; text: string } | null;
    onCancelEdit: () => void;
}

interface PreviewFile {
    id: string;
    file: File;
    localUrl: string;
    isImage: boolean;
}

export function MessageInput({ chatId, editingMessage, onCancelEdit }: Props) {
    const [text, setText] = useState('');
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
    const [uploadAttachments, { isLoading: isUploading }] =
        useUploadAttachmentsMutation();

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
    }, [editingMessage]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setErrorMsg('');

        if (previewFiles.length + files.length > 6) {
            setErrorMsg('Максимум 6 вложений');
            return;
        }

        const newPreviewItems: PreviewFile[] = Array.from(files).map((file) => {
            const isImg = file.type.startsWith('image/');
            return {
                id: `${file.name}-${Date.now()}-${Math.random()}`,
                file: file,
                localUrl: isImg ? URL.createObjectURL(file) : '',
                isImage: isImg,
            };
        });

        setPreviewFiles((prev) => [...prev, ...newPreviewItems]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = (idToRemove: string, localUrl: string) => {
        if (localUrl) URL.revokeObjectURL(localUrl);
        setPreviewFiles((prev) => prev.filter((f) => f.id !== idToRemove));
    };

    const clearAllFiles = () => {
        previewFiles.forEach(
            (f) => f.localUrl && URL.revokeObjectURL(f.localUrl),
        );
        setPreviewFiles([]);
        setErrorMsg('');
    };

    const stopTyping = () => {
        socketEmitters.sendTyping(chatId, false);
        if (typingTimer.current) clearTimeout(typingTimer.current);
    };

    const handleSend = async () => {
        const hasFiles = previewFiles.length > 0;

        if (!text.trim() && !hasFiles) return;
        if (editingMessage && editingMessage.text === text) return;

        let finalAttachmentsToSend: any[] = [];

        if (hasFiles) {
            const formData = new FormData();
            previewFiles.forEach((p) => formData.append('files', p.file));

            try {
                const response = await uploadAttachments(formData).unwrap();

                if (response.success && response.files) {
                    finalAttachmentsToSend = response.files;
                    console.log(
                        '[INPUT SUCCESS] Файлы успешно загружены на сервер, готовим к сокету:',
                        finalAttachmentsToSend,
                    );
                }
            } catch (err) {
                console.error('[ATTACHMENT UPLOAD ERROR]:', err);
                setErrorMsg('Не удалось загрузить файлы');
                return;
            }
        }

        if (chatId < 0) {
            const targetUserId = Math.abs(chatId);

            socketEmitters.createChat({
                type: 'direct',
                userIds: [targetUserId],
                name: undefined,
                firstMessageText: text.trim(),
            } as any);
        } else if (editingMessage) {
            socketEmitters.editMessage(editingMessage.id, text.trim());

            onCancelEdit();
        } else {
            console.log(
                '[SOCKET SEND] Отправляем сокет пакет с вложениями:',
                finalAttachmentsToSend,
            );
            socketEmitters.sendMessage(
                chatId,
                text.trim(),
                finalAttachmentsToSend,
            );
        }

        setText('');
        clearAllFiles();
        stopTyping();
    };

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
    };

    return (
        <div className={styles.messageInput}>
            <div className={styles.wrap}>
                {editingMessage && (
                    <div className={styles.editBar}>
                        <div className={styles.editInfo}>
                            <span className={styles.editTitle}>
                                Редактирование
                            </span>
                            <span className={styles.editText}>
                                {editingMessage.text}
                            </span>
                        </div>
                        <button
                            className={styles.cancelEditBtn}
                            onClick={onCancelEdit}
                        >
                            ✕
                        </button>
                    </div>
                )}
                {previewFiles.length > 0 && (
                    <div className={styles.attachmentsPreviewContainer}>
                        <div className={styles.previewCarousel}>
                            {previewFiles.map((item) => (
                                <div
                                    key={item.id}
                                    className={styles.previewCard}
                                >
                                    {item.isImage ? (
                                        <img
                                            src={item.localUrl}
                                            className={styles.previewImg}
                                            alt=""
                                        />
                                    ) : (
                                        <div className={styles.previewDocIcon}>
                                            <span
                                                className={styles.docExtLabel}
                                            >
                                                {item.file.name
                                                    .split('.')
                                                    .pop()
                                                    ?.toUpperCase() || 'FILE'}
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        className={styles.removePreviewItemBtn}
                                        onClick={() =>
                                            handleRemoveFile(
                                                item.id,
                                                item.localUrl,
                                            )
                                        }
                                        title="Удалить файл"
                                    >
                                        ✕
                                    </button>
                                    <span
                                        className={
                                            styles.previewFileNameSummary
                                        }
                                    >
                                        {item.file.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {errorMsg && (
                    <div className={styles.inputErrorMsg}>✕ {errorMsg}</div>
                )}
                <div className={styles.messageArea}>
                    <label
                        className={styles.fileInputLabel}
                        title="Прикрепить файлы"
                    >
                        <svg
                            width="24px"
                            height="24px"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                        </svg>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            multiple
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                        />
                    </label>
                    <textarea
                        ref={textareaRef}
                        className={styles.input}
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            editingMessage
                                ? 'Редактировать сообщение'
                                : 'Сообщение'
                        }
                        rows={1}
                    />
                    <button
                        className={styles.btn}
                        onClick={handleSend}
                        disabled={
                            !text.trim() ||
                            text.trim() === editingMessage?.text ||
                            isUploading
                        }
                    >
                        {editingMessage ? '✓' : '➤'}
                    </button>
                </div>
            </div>
        </div>
    );
}
