import { Link } from "react-router-dom";
import { useAppSelector } from '../../store/hooks';
import { useGetProfileByIdQuery } from '../../features/api/user/userApi';

function ProfileButton({ active }: { active: boolean }) {
    const userId = useAppSelector((state) => state.auth.userId);
    const { data: user, isLoading, error } = useGetProfileByIdQuery(userId!);

    return (
        <Link to={`/${user?.username}`} className={`profile-avatar menu-item ${active ? 'active' : ''}`}>
            <div className="profile-avatar__wrapper">
                <img className="profile-avatar__img rounded"
                    src={user?.avatarUrl ? user?.avatarUrl : "/img/defaultavatar.png"}
                    alt={`${user?.firstName} ${user?.lastName}`} />
            </div>
            <span className="label">Профиль</span>
        </Link>
    );
}

export { ProfileButton };