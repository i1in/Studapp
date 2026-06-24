import { Link, useLocation } from 'react-router-dom';
import { Faculty } from '../../components/post-card/post-faculty';
import { ConvertTime } from '../../components/time-converter/time-converter';
import { ShowFullAttachments } from '../../components/full-post-attachment/full-post-attachs';
import {
    useGetFullPostQuery,
    useLikePostMutation,
} from '../../features/api/posts/postsApi';
import { CommentSection } from '../../components/comment-section/comment-section';
import { useAppSelector } from '../../store/hooks';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NotFound from '../not-found/not-found';
import { AppLayout } from '../../components/shared/app-layout/app-layout';
import { Loader } from '../../components/shared/loader-circle/loader-circle';

function PostPage() {
    const location = useLocation();

    const params = useParams<{ username: string; id: string }>();
    const postId = Number(params.id);

    const {
        data: post,
        isLoading,
        isError,
        error,
    } = useGetFullPostQuery(
        {
            username: params.username!,
            id: postId,
        },
        {
            skip: !params.username || isNaN(postId),
        },
    );

    const [likePost, { isLoading: likeIsLoading }] = useLikePostMutation();
    const currentUserId = useAppSelector((state) => state.auth.userId);

    const [isLiked, setIsLiked] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(0);

    useEffect(() => {
        if (post) {
            setIsLiked(
                post.likes.some((item) => item.author.id === currentUserId),
            );
            setLocalLikeCount(post.likes.length);
        }
    }, [post, currentUserId]);

    if (isLoading) return <Loader />;
    if (!post) return <NotFound />;
    console.log(post);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const postId = Number(e.currentTarget.dataset.id);
        if (!postId) return;

        try {
            await likePost(postId).unwrap();
            setIsLiked((prev) => !prev);
            setLocalLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
        } catch (error) {
            console.error('Ошибка при лайке:', error);
        }
    };

    return (
        <AppLayout
            title={`Заметка ${post.author.firstName}`}
            hasBack
            fallbackTo="/feed"
        >
            <div className="full-post">
                <div className="post-author">
                    <div className="post-author__avatar">
                        <img
                            className="profile-avatar__img rounded post-avatar"
                            src={
                                post.author.avatarUrl
                                    ? post.author.avatarUrl
                                    : '/img/defaultavatar.png'
                            }
                            alt={`${post.author.firstName} ${post.author.lastName}`}
                        />
                    </div>
                    <div className="post-author__name">
                        <Link
                            to={`/${post.author.username}`}
                            state={{ from: location.pathname }}
                            className="author-name__url"
                        >
                            <p className="author-name">
                                {post.author.firstName} {post.author.lastName}
                            </p>
                            <Faculty faculty={post.author.faculty} />
                        </Link>
                    </div>
                </div>

                <div className="post-content">
                    <div className="post-content__title">
                        <p className="content-text">{post.content}</p>
                    </div>
                </div>

                <ShowFullAttachments attachments={post.attachments} />

                <ConvertTime time={post.createdAt} />
            </div>
            <div className="additional">
                <div className="interaction-buttons">
                    <div className="interaction-buttons__button">
                        <button
                            className={`reaction-button ${isLiked ? 'active' : ''}`}
                            aria-pressed={isLiked}
                            data-id={post.id}
                            onClick={handleLike}
                            disabled={isLoading}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="reaction-icon"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5
                                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09
                                        C13.09 3.81 14.76 3 16.5 3
                                        19.58 3 22 5.42 22 8.5
                                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                        {localLikeCount > 0 && (
                            <p className="buttons__count">{localLikeCount}</p>
                        )}
                    </div>
                </div>
            </div>
            <CommentSection comments={post.comments} />
        </AppLayout>
    );
}

export default PostPage;
