import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { User } from '../../../types/user';
import { setActiveChat } from '../../../features/api/messenger/messengerSlice';
import { useGetUsersListQuery, useGetProfileByIdQuery } from '../../../features/api/user/userApi';
import { socketEmitters } from '../../../hooks/shared/socketEmitters';
import styles from './search-user-modal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchUsersModal({ isOpen, onClose }: Props) {
    const dispatch = useAppDispatch();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFaculty, setSelectedFaculty] = useState('');

    const { data: currentUser, isLoading: isUserLoading } = useGetProfileByIdQuery();

    const isSearching = !!searchQuery || !!selectedFaculty;

    const { data: suggestionsData = [], isFetching: isSuggestionsLoading } = useGetUsersListQuery(
        { faculty: currentUser?.faculty ?? undefined },
        { skip: !isOpen || isSearching || !currentUser?.faculty }
    );

    const { data: searchData = [], isFetching: isSearchLoading } = useGetUsersListQuery(
        { search: searchQuery || undefined, faculty: selectedFaculty || undefined },
        { skip: !isOpen || !isSearching }
    );

    const isContentLoading = isSearching ? isSearchLoading : isSuggestionsLoading;
    const suggestions = suggestionsData.filter((u: any) => u.id !== currentUser?.id);
    const usersList = searchData.filter((u: any) => u.id != currentUser?.id);

    const handleStartChat = (targetUserId: number) => {
        socketEmitters.createChat({
            type: 'direct',
            userIds: [targetUserId],
        });

        onClose();
        setSearchQuery('');
        setSelectedFaculty('');
    };

    if (!isOpen || isUserLoading) return null;

    return (
        <div className={styles.backdrop} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Новый диалог</h3>
                    <button className={styles.closeBtn} onClick={onClose}>✕</button>
                </div>

                <div className={styles.filters}>
                    <input 
                        type="text" 
                        className={styles.input}
                        placeholder="Поиск по имени или @username..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    
                    <select 
                        className={styles.select}
                        value={selectedFaculty}
                        onChange={e => setSelectedFaculty(e.target.value)}
                    >
                        <option value="">Все факультеты</option>
                        <option value="ИКТ">Информационные технологии</option>
                        <option value="Экономика">Экономический</option>
                        <option value="Юриспруденция">Юридический</option>
                    </select>
                </div>

                <div className={styles.content}>
                    {isContentLoading && <div className={styles.loading}>Поиск контактов...</div>}

                    {!isContentLoading && !isSearching && (
                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>Рекомендуем ({(currentUser as any)?.faculty}):</span>
                            <div className={styles.userList}>
                                {suggestions.map(user => (
                                    <div key={user.id} className={styles.userItem} onClick={() => handleStartChat(user.id)}>
                                        <div className={styles.avatarFallback}>
                                            {user.firstName ? user.firstName[0].toUpperCase() : '?'}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                                            <span className={styles.userMeta}>@{user.username} • {user.faculty || 'Без факультета'}</span>
                                        </div>
                                    </div>
                                ))}
                                {suggestions.length === 0 && <p className={styles.empty}>Нет предложений</p>}
                            </div>
                        </div>
                    )}

                    {!isContentLoading && isSearching && (
                        <div className={styles.section}>
                            <span className={styles.sectionTitle}>Найдено пользователей:</span>
                            <div className={styles.userList}>
                                {usersList.map(user => (
                                    <div key={user.id} className={styles.userItem} onClick={() => handleStartChat(user.id)}>
                                        <div className={styles.avatarFallback}>
                                            {user.firstName ? user.firstName[0].toUpperCase() : '?'}
                                        </div>
                                        <div className={styles.userInfo}>
                                            <span className={styles.userName}>{user.firstName} {user.lastName}</span>
                                            <span className={styles.userMeta}>@{user.username} • {user.faculty || 'Без факультета'}</span>
                                        </div>
                                    </div>
                                ))}
                                {usersList.length === 0 && <p className={styles.empty}>Никого не найдено</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}