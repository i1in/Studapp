import { useParams, useLocation } from 'react-router-dom';
import { useGetProfileQuery } from '../../features/api/user/userApi';
import { useAppSelector } from '../../store/hooks';
import { UserCardList } from '../../components/user-posts-list/user-posts-list';
import { UserProfile } from '../../components/user-profile-component/user-profile-component';
import { UserPost } from '../../components/user-profile-component/user-post';
import NotFound from '../not-found/not-found';
import { AppLayout } from '../../components/shared/app-layout/app-layout';

function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const location = useLocation();

    const { data: user, isLoading, error } = useGetProfileQuery(username!);
    const currentUserId = useAppSelector((state) => state.auth.userId);
    if (isLoading) {
        return (
            <div className="loading">
                <p className="loading-title">Loading</p>
            </div>
        );
    }

    if (!user) {
        return <NotFound />;
    }

    const isOwner = user?.id === currentUserId;
    const hasBack = Boolean(location.state?.from);

    return (
        <AppLayout title={username} hasBack={hasBack}>
            <div className="user-section">
                <UserProfile />
                {isOwner && <UserPost />}

                <div className="post-section">
                    <p className="section-title">Заметки</p>
                    <UserCardList />
                </div>
            </div>
        </AppLayout>
    );
}

export default ProfilePage;
