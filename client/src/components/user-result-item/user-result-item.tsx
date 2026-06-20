import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks';
import { getFaculty } from '../../const';
import { User } from '../../types/user';
import styles from './user-result-item.module.css';

interface Props {
    user: User;
}

export function UserResultItem({ user }: Props) {
    const location = useLocation();

    const presence = useAppSelector(
        (s) => s.messenger.users[user.id]?.presence,
    );
    const isOnline = presence?.status === 'online';

    const displayName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

    return (
        <Link
            to={`/${user.username || user.id}`}
            state={{ from: location.pathname }}
            className={styles.item}
        >
            <div className={styles.avatarWrap}>
                {user.avatarUrl ? (
                    <img
                        src={user.avatarUrl}
                        className={styles.avatar}
                        alt=""
                    />
                ) : (
                    <div className={styles.avatarFallback}>
                        <span className={styles.avatarFallback__text}>
                            {displayName[0] ?? '?'}
                        </span>
                    </div>
                )}
                {isOnline && (
                    <span className={`${styles.dot} ${styles.online}`} />
                )}
            </div>

            <div className={styles.info}>
                <span className={styles.name}>{displayName}</span>
                <span className={styles.meta}>
                    {user.username && `@${user.username} • `}
                    {getFaculty(user.faculty)}
                </span>
            </div>
        </Link>
    );
}
