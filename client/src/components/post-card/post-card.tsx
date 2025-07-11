import { Faculty } from "./post-faculty";
import { ShowAttachmentBlock } from './post-attachments'
import { useState } from 'react';
import { Link } from "react-router-dom";
import { AppRoute } from "../../const";
import { ConvertTime } from "../time-converter/time-converter";
import { useLikePostMutation } from '../../features/api/posts/postsApi';

type Author = {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    faculty: string;
    avatarUrl: string;
};

type PostCardProps = {
    id: number;
    content: string;
    createdAt: string;
    attachmentsCount: number;
    attachmentsTotalSize: number;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    author: Author
}

function PostCard({ id, content, createdAt, attachmentsCount, attachmentsTotalSize,
    likesCount, isLikedByCurrentUser, author }: PostCardProps) {
    const [likePost, { isLoading }] = useLikePostMutation();
    const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
    const [localLikeCount, setLocalLikeCount] = useState(likesCount);

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const postId = Number(e.currentTarget.dataset.id);
        if (!postId) return;
    
        try {
            await likePost(postId).unwrap();

            if (isLiked) {
                setIsLiked(false);
                setLocalLikeCount((prev) => prev - 1);

                return;
            }
            
            setIsLiked(true);
            setLocalLikeCount((prev) => prev + 1);
            return;
        } catch (error) {
            console.error('Ошибка при лайке:', error);
        }
    };

    return (
        <div className="post">
            <div className="post-author">
                <div className="post-author__avatar">
                    <img
                        className="profile-avatar__img rounded post-avatar"
                        src={author.avatarUrl ? author.avatarUrl : "img/defaultavatar.png"}
                        alt={`${author.firstName} ${author.lastName}`}
                    />
                </div>
                <div className="post-author__name">
                    <a href={`${author.username}`} className="author-name__url">
                        <p className="author-name">
                            {author.firstName} {author.lastName}
                        </p>
                        <Faculty faculty={author.faculty} />
                    </a>
                </div>
            </div>

            <div className="post-content">
                <div className="post-content__title">
                    <p className="content-text">
                        {content}
                    </p>
                </div>

                {attachmentsCount > 0 && (
                    <ShowAttachmentBlock postId={id} username={author.username} 
                                        attachmentsCount={attachmentsCount} attachmentsTotalSize={attachmentsTotalSize}/>
                )}

                <ConvertTime time={createdAt} />
            </div>

            <div className="additional">
                <div className="interaction-buttons">
                    <div className="interaction-buttons__button">
                        <button
                            className={`reaction-button ${isLiked ? 'active' : ''}`}
                            aria-pressed={isLiked}
                            data-id={id}
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

                    <div className="interaction-buttons__button comment">
                        <a href={`${author.username}/post/${id}`} className="reaction-button" aria-pressed="false">
                            <svg viewBox="2 2 22 22" className="reaction-icon" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M21 6h-18c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v4l4-4h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"
                                    fill="currentColor"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostCard;