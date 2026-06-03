import { useGetProfileByIdQuery } from '../../features/api/user/userApi';

function ProfileAvatar() {
    const { data: user, isLoading, error } = useGetProfileByIdQuery();

    return (
        <div className="profile-avatar__wrapper">
            <img className="profile-avatar__img rounded"
                src={user?.avatarUrl ? user?.avatarUrl : "/img/defaultavatar.png"}
                alt={`${user?.firstName} ${user?.lastName}`} />
        </div>
    );
}

export { ProfileAvatar };