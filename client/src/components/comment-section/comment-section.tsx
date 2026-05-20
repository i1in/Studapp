import { Faculty } from "../post-card/post-faculty";
import { ConvertTime } from "../time-converter/time-converter";
import { usePostCommentMutation } from '../../features/api/posts/postsApi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

type CommentAuthor = {
    avatarUrl: string;
    faculty: string;
    id: number;
    firstName: string;
    lastName: string;
    username: string;
}

type Comment = {
    author: CommentAuthor;
    content: string;
    createdAt: string;
}

interface CommentProps {
    comments: Comment[]
}

function CommentSection({ comments }: CommentProps) {
    const { username, id } = useParams<{ username: string; id: string }>();
    const [commentText, setCommentText] = useState('');
    const [postComment, { isLoading }] = usePostCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !id) {
            console.error('username или id поста не найдены в URL');
            return;
        }

        if (!commentText.trim()) return;

        try {
            await postComment({
                username,
                id: Number(id),
                content: commentText
            }).unwrap();

            setCommentText('');
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        }
    };

    return (
        <div className="comments-section">
            <p className="section-title">
                Комментарии — {comments.length}
            </p>
            <form className="comment-form" onSubmit={handleSubmit}>
                <textarea
                    className="comment-input"
                    placeholder="Оставьте комментарий"
                    rows={2}
                    value={commentText}
                    onChange={(e) => { setCommentText(e.target.value); console.log(commentText) }}
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="comment-submit-button"
                    disabled={!commentText.trim() || isLoading}
                >
                    {isLoading ? 'Отправка...' : 'Отправить'}
                </button>
            </form>

            {comments.length > 0 && (
                comments.map((item) => (
                    <div className="comment-item">
                        <div className="post-author">
                            <div className="post-author__avatar">
                                <img className="profile-avatar__img rounded post-avatar"
                                    src={item.author.avatarUrl ? item.author.avatarUrl : "/img/defaultavatar.png"}
                                    alt={`${item.author.firstName} ${item.author.lastName}`} />
                            </div>
                            <div className="post-author__name">
                                <a href={`/${item.author.username}`} className="author-name__url">
                                    <p className="author-name">{item.author.firstName} {item.author.lastName}</p>
                                    <Faculty faculty={item.author.faculty} />
                                </a>
                            </div>
                        </div>
                        <p className="comment-content">
                            {item.content}
                        </p>
                        <ConvertTime time={item.createdAt} />
                    </div>
                ))
            )}
        </div>
    );
}

export { CommentSection };