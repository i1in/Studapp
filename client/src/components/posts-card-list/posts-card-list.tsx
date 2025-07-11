import { PostList } from "../../types/post";
import PostCard from '../post-card/post-card';
import { useGetPostsQuery } from '../../features/api/posts/postsApi';
import { EmptyPreview } from "../empty-preview/empty-preview";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../features/api/auth/authSlice';

function PostCardList() {
    const { data: posts, isLoading, error } = useGetPostsQuery();
    if (isLoading) return (
        <div className="loading">
            <p className="loading-title">Loading</p>
        </div>
    );

    if (error) {
        if ('status' in error) {
            return (
                <div className="error-message">
                    {`Error ${error.status}: ${JSON.stringify(error.data)}`}
                </div>
            );
        }
    }

    if (posts?.length === 0) {
        return (
            <EmptyPreview isProfile={false}/>
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

export { PostCardList };