import React, { useState, useMemo, useRef } from 'react';
import { getFaculty } from '../../../const';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import {
    useGetProfileByIdQuery,
    useGetFacultySuggestionsQuery,
} from '../../../features/api/user/userApi';
import styles from './group-create-panel.module.css';
import { useUploadGroupAvatarMutation } from '../../../features/api/messenger/messengerApi';

interface Props {
    type: 'group' | 'channel';
    onBackToChats: () => void;
}

export function GroupCreatePanel({ type, onBackToChats }: Props) {
    const [groupName, setGroupName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

    const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(
        null,
    );
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadGroupAvatar, { isLoading: isUploading }] =
        useUploadGroupAvatarMutation();

    const serverUrl = import.meta.env.VITE_API_URL;

    const { data: currentUser } = useGetProfileByIdQuery();

    const { data: studentsData = [], isLoading } =
        useGetFacultySuggestionsQuery(currentUser?.faculty ?? '', {
            skip: !currentUser?.faculty,
        });

    const availableStudents = useMemo(() => {
        return studentsData.filter((u: any) => u.id !== currentUser?.id);
    }, [studentsData, currentUser?.id]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery.trim()) return availableStudents;
        return availableStudents.filter((u: any) =>
            `${u.firstName} ${u.lastName}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
        );
    }, [availableStudents, searchQuery]);

    const selectedUsersObjects = useMemo(() => {
        return availableStudents.filter((u) =>
            selectedUserIds.includes(Number(u.id)),
        );
    }, [availableStudents, selectedUserIds]);

    const handleToggleUser = (userId: number) => {
        setSelectedUserIds((prev) =>
            prev.includes(Number(userId))
                ? prev.filter((id) => id !== Number(userId))
                : [...prev, Number(userId)],
        );
    };

    const handleCreate = () => {
        if (!groupName.trim() || selectedUserIds.length === 0) return;

        console.log(
            `[WS] Отправляем запрос на создание ${type}:`,
            groupName,
            selectedUserIds,
        );

        socketEmitters.createChat({
            type: type,
            userIds: selectedUserIds,
            name: groupName.trim(),
            avatarUrl: uploadedAvatarUrl,
            firstMessageText: `Группа "${groupName.trim()}" успешно создана!`,
        } as any);

        onBackToChats();
    };

    const handleAvatarChange = async (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const response = await uploadGroupAvatar(formData).unwrap();

            if (response.success && response.avatarUrl) {
                setUploadedAvatarUrl(response.avatarUrl);
                console.log(
                    '[RTK QUERY UPLOAD SUCCESS] Путь к аватарке чата:',
                    response.avatarUrl,
                );
            }
        } catch (err) {
            console.error(
                'Не удалось загрузить аватарку группы через RTK Query:',
                err,
            );
        }
    };

    const title = type === 'group' ? 'Новая группа' : 'Новый канал';
    const fullPreviewUrl = uploadedAvatarUrl
        ? `${serverUrl}${uploadedAvatarUrl}`
        : '';

    return (
        <div className={styles.wrap}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <button
                        className={styles.headerBtn}
                        onClick={onBackToChats}
                        title="Назад"
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                    </button>
                    <span className={styles.title}>{title}</span>
                </div>
                <button
                    className={styles.createSubmitBtn}
                    onClick={handleCreate}
                    disabled={!groupName.trim() || selectedUserIds.length === 0}
                    title="Создать"
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </button>
            </header>
            <div className={styles.groupInfoBlock}>
                <div className={styles.groupInfoInputs}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />

                    <div
                        className={styles.avatarPlaceholder}
                        onClick={() => fileInputRef.current?.click()}
                        title="Выбрать аватарку"
                    >
                        {isUploading ? (
                            <div className={styles.loaderMini}></div>
                        ) : uploadedAvatarUrl ? (
                            <img
                                src={fullPreviewUrl}
                                className={styles.groupPreviewImg}
                                alt=""
                            />
                        ) : (
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                <circle cx="12" cy="13" r="4"></circle>
                            </svg>
                        )}
                    </div>
                    <input
                        type="text"
                        name="groupName"
                        className={styles.groupNameInput}
                        placeholder={
                            type === 'group'
                                ? 'Название группы'
                                : 'Название канала'
                        }
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        maxLength={60}
                        autoFocus
                    />
                </div>
            </div>
            {selectedUsersObjects.length > 0 && (
                <div className={styles.selectedCarousel}>
                    {selectedUsersObjects.map((user) => {
                        const fallbackLetter =
                            user.firstName?.[0]?.toUpperCase() || '?';
                        return (
                            <div
                                key={`carousel-${user.id}`}
                                className={styles.carouselItem}
                            >
                                <div className={styles.avatarContainer}>
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            className={styles.userAvatar}
                                            alt=""
                                        />
                                    ) : (
                                        <span className={styles.userFallback}>
                                            {fallbackLetter}
                                        </span>
                                    )}
                                    <button
                                        className={styles.removeUserBadgeBtn}
                                        onClick={() =>
                                            handleToggleUser(user.id)
                                        }
                                        title="Удалить"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <span className={styles.userNameSummary}>
                                    {user.firstName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className={styles.searchBlock}>
                <div className={styles.searchInnerWrapper}>
                    <input
                        type="text"
                        className={styles.panelSearchInput}
                        placeholder="Поиск студентов..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            className={styles.clearSearchBtn}
                            onClick={() => setSearchQuery('')}
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
            {isLoading ? (
                <span className={styles.panelLoading}>
                    Загрузка списка студентов
                </span>
            ) : (
                <div className={styles.studentsVerticalList}>
                    {filteredStudents.length === 0 ? (
                        <span className={styles.panelListEmpty}>
                            Студенты не найдены
                        </span>
                    ) : (
                        filteredStudents.map((user) => {
                            const isChecked = selectedUserIds.includes(
                                Number(user.id),
                            );
                            const fallbackLetter =
                                user.firstName?.[0]?.toUpperCase() || '?';

                            return (
                                <div
                                    key={`row-${user.id}`}
                                    className={`${styles.studentRow} ${isChecked ? styles.rowSelected : ''}`}
                                    onClick={() => handleToggleUser(user.id)}
                                >
                                    <div className={styles.rowMetadataBlock}>
                                        <div className={styles.rowAvatarFrame}>
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    className={styles.rowImg}
                                                    alt=""
                                                />
                                            ) : (
                                                <span
                                                    className={
                                                        styles.rowFallback
                                                    }
                                                >
                                                    {fallbackLetter}
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.rowTextData}>
                                            <span
                                                className={styles.rowFullName}
                                            >
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <span
                                                className={
                                                    styles.rowFacultyName
                                                }
                                            >
                                                {getFaculty(user.faculty) ||
                                                    'Студент'}
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className={`${styles.circleCheckbox} ${isChecked ? styles.checked : ''}`}
                                    >
                                        {isChecked && (
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#fff"
                                                strokeWidth="4"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
