import { useState, useMemo } from 'react';
import { AppLayout } from '../../components/shared/app-layout/app-layout';
import { UserResultItem } from '../../components/user-result-item/user-result-item';
import {
    useGetProfileByIdQuery,
    useGetFacultySuggestionsQuery,
    useGetSearchUsersQuery,
} from '../../features/api/user/userApi';
import { getFaculty } from '../../const';
import styles from './search-page.module.css';

export default function UserSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const isSearching = searchQuery.trim().length > 0;

    const { data: currentUser } = useGetProfileByIdQuery();

    const { data: suggestionsData = [] } = useGetFacultySuggestionsQuery(
        currentUser?.faculty ?? '',
        { skip: !currentUser?.faculty || isSearching },
    );

    const { data: searchData = [], isFetching: isSearchLoading } =
        useGetSearchUsersQuery(searchQuery, { skip: !isSearching });

    const suggestions = useMemo(
        () => suggestionsData.filter((u) => u.id !== currentUser?.id),
        [suggestionsData, currentUser?.id],
    );

    const globalUsers = useMemo(
        () => searchData.filter((u) => u.id !== currentUser?.id),
        [searchData, currentUser?.id],
    );

    return (
        <AppLayout title="Поиск">
            <div className={styles.searchHeader}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Поиск"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
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
                {!isSearching && (
                    <div className={styles.suggestionsBlock}>
                        <div className={styles.suggestionsInfo}>
                            <span className={styles.sectionTitle}>
                                Предложенные по факультету
                            </span>
                            <span className={styles.sectionTitle}>
                                {getFaculty(currentUser?.faculty)}
                            </span>
                        </div>
                        {suggestions.length === 0 ? (
                            <span className={styles.miniEmpty}>
                                Нет предложений
                            </span>
                        ) : (
                            suggestions.map((user) => (
                                <UserResultItem key={user.id} user={user} />
                            ))
                        )}
                    </div>
                )}

                {isSearching && (
                    <div className={styles.searchResults}>
                        <span className={styles.sectionTitle}>
                            Результаты поиска
                        </span>
                        {isSearchLoading ? (
                            <span className={styles.miniLoading} />
                        ) : globalUsers.length === 0 ? (
                            <span className={styles.miniEmpty}>
                                Никого не найдено
                            </span>
                        ) : (
                            globalUsers.map((user) => (
                                <UserResultItem key={user.id} user={user} />
                            ))
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
