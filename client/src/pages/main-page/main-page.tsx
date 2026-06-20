import { PostCardList } from '../../components/posts-card-list/posts-card-list';
import { AppLayout } from '../../components/shared/app-layout/app-layout';

function MainPage() {
    return (
        <>
            <AppLayout title="Лента">
                <PostCardList />
            </AppLayout>
        </>
    );
}

export default MainPage;
