import { Logo } from "../../components/logo/logo";
import { ProfileButton } from "../../components/profile-button/profile-button";
import { Faculty } from '../../components/post-card/post-faculty';
import { ConvertTime } from "../../components/time-converter/time-converter";
import { ShowFullAttachments } from '../../components/full-post-attachment/full-post-attachs';
import { useGetFullPostQuery, useLikePostMutation } from "../../features/api/posts/postsApi";
import { CommentSection } from "../../components/comment-section/comment-section";
import { useAppSelector } from "../../store/hooks";
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import NotFound from "../not-found/not-found";

function PostPage() {
    const params = useParams<{ username: string; id: string }>();
    const postId = Number(params.id);

    const {
        data: post,
        isLoading,
        isError,
        error
    } = useGetFullPostQuery({
        username: params.username!,
        id: postId
    }, {
        skip: !params.username || isNaN(postId)
    });

    const [likePost, { isLoading: likeIsLoading }] = useLikePostMutation();
    const currentUserId = useAppSelector((state) => state.auth.userId);

    const [isLiked, setIsLiked] = useState(false);
    const [localLikeCount, setLocalLikeCount] = useState(0);

    useEffect(() => {
        if (post) {
            setIsLiked(post.likes.some(item => item.author.id === currentUserId));
            setLocalLikeCount(post.likes.length);
        }
    }, [post, currentUserId]);

    if (isLoading) return <div>Загрузка...</div>;
    if (!post) return <NotFound />;
    console.log(post)

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const postId = Number(e.currentTarget.dataset.id);
        if (!postId) return;

        try {
            await likePost(postId).unwrap();
            setIsLiked(prev => !prev);
            setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        } catch (error) {
            console.error('Ошибка при лайке:', error);
        }
    };

    return (
        <>
            <header className="header">
                <div className="header__wrapper">
                    <div className="header__left">
                        <Logo />
                    </div>
                </div>
            </header>

            <div className="layout">
                <nav className="menu">
                    <a href="/search" className="menu-item">
                        <span className="icon">
                            <svg width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z" fill="currentColor"></path></g></svg>
                        </span>
                        <span className="label">Поиск</span>
                    </a>
                    <a href="/feed" className="menu-item">
                        <span className="icon">
                            <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="32px"
                                height="24px" viewBox="0 0 92 92" enableBackground="new 0 0 92 92" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path id="XMLID_1210_"
                                        d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                        <span className="label">Лента</span>
                    </a>
                    <ProfileButton active={true} />
                </nav>

                <main className="content">
                    <div className="breadcrumbs">
                        <a href="/feed" className="breadcrumb">
                            Лента &gt;
                        </a>
                        <p className="breadcrumb active">
                            Заметка
                        </p>
                    </div>
                    <div className="full-post">
                        <div className="post-author">
                            <div className="post-author__avatar">
                                <img className="profile-avatar__img rounded post-avatar"
                                    src={post.author.avatarUrl ? post.author.avatarUrl : "/img/defaultavatar.png"}
                                    alt={`${post.author.firstName} ${post.author.lastName}`} />
                            </div>
                            <div className="post-author__name">
                                <a href={`/${post.author.username}`} className="author-name__url">
                                    <p className="author-name">{post.author.firstName} {post.author.lastName}</p>
                                    <Faculty faculty={post.author.faculty} />
                                </a>
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
                                    <svg viewBox="0 0 24 24" className="reaction-icon" xmlns="http://www.w3.org/2000/svg">
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
                </main>
            </div>
        </>
    );
}

export default PostPage;