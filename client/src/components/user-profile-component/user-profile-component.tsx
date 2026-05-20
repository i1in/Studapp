import { useState, useEffect } from 'react';
import { useGetProfileQuery, usePostStatusMutation } from '../../features/api/user/userApi';
import { useAppSelector } from '../../store/hooks';
import { useParams } from 'react-router-dom';
import { UserFaculty } from './user-faculty';
import { UserRole } from './user-roles';
import { UserFollow } from './user-follow';

export function UserProfile() {
    const { username } = useParams<{ username: string }>();
    const currentUserId = useAppSelector((state) => state.auth.userId);
    const { data: user, isLoading, error } = useGetProfileQuery(username!);
    const [updateStatus, { isLoading: statusLoading, error: statusError }] = usePostStatusMutation();
    const [status, setStatus] = useState(user?.status || '');

    useEffect(() => {
        if (user?.status !== undefined) {
            setStatus(user.status);
        }
    }, [user?.status]);

    const handleStatusChange = async () => {
        try {
            const response = await updateStatus(status).unwrap();
            setStatus(response.status);
        } catch (error) {
            console.log(error)
        }
    };
    const isOwner = user?.id === currentUserId;

    return (
        <div className={`user-profile ${user?.role}-bg`}>
            <div className="user-bio">
                <div className="user-avatar">
                    <img
                        className="user-avatar__img rounded"
                        src={user?.avatarUrl ? user?.avatarUrl : "img/defaultavatar.png"}
                        alt="user avatar" />
                </div>
                <div className="user-bio__block">
                    <p className="user-names">{user?.firstName} {user?.lastName}</p>
                    <input
                        className={`user-status__text ${!status && !isOwner ? 'collapsed' : ''}`}
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        onBlur={handleStatusChange}
                        disabled={!isOwner}
                        placeholder={isOwner ? "Изменить статус" : ""}
                    />
                </div>
                <div className="user-additional">
                    <div className="user-additional__block">
                        <p className="user-additional__label">Статус</p>
                        <UserRole role={user?.role} />
                    </div>
                    <div className="user-additional__block">
                        <p className="user-additional__label">
                            <span className="icon">@</span>
                            Юзернейм
                        </p>
                        <span className="user-additional__text">{user?.username}</span>
                    </div>
                    <div className="user-additional__block">
                        <p className="user-additional__label">
                            <span className="icon">
                                <svg width="16px" height="18px" viewBox="0 -2.4 26.40 28.80" fill="currentColor">
                                    <path d="M2 19h20v3H2zM12 2L2 6v2h20V6M17 10h3v7h-3zM10.5 10h3v7h-3zM4 10h3v7H4z" />
                                </svg>
                            </span>
                            Факультет
                        </p>
                        <UserFaculty faculty={user?.faculty} />
                    </div>
                </div>
            </div>
            <UserFollow
                id={user?.id ?? 0}
                followCount={user?.followCount ?? 0}
                isFollowedByCurrentUser={user?.isFollowedByCurrentUser ?? false}
            />
        </div>
    )
}