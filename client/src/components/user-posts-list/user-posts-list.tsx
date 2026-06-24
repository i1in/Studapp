import { PostList } from "../../types/post";
import PostCard from '../post-card/post-card';
import { useGetUserPostsQuery } from '../../features/api/posts/postsApi';
import { EmptyPreview } from "../empty-preview/empty-preview";
import { useParams } from 'react-router-dom';
import { Loader } from "../shared/loader-circle/loader-circle";

function UserCardList() {
    const { username } = useParams<{ username: string }>();
    const { data: posts, isLoading, error } = useGetUserPostsQuery(username!);
    
    if (error) {
        if ('status' in error) {
            return (
                <div className="error-message">
                    {`Error ${error.status}: ${JSON.stringify(error.data)}`}
                </div>
            );
        }
    }

    if (isLoading) return <Loader />;

    if (posts?.length === 0) {
        return (
            <EmptyPreview isProfile={true}/>
        )
    }

    return (
        <div className="post-list">
            {posts?.map((post) => (
                <PostCard
                    key={post.id}
                    id={post.id}
                    content={post.content}
                    createdAt={post.createdAt}
                    attachmentsCount={post.attachmentsCount}
                    attachmentsTotalSize={post.attachmentsTotalSize}
                    likesCount={post.likesCount}
                    isLikedByCurrentUser={post.isLikedByCurrentUser}
                    author={post.author}
                />
            ))}
        </div>
    );
}

export { UserCardList };