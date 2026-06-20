import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Faculty } from '../post-card/post-faculty';
import { ConvertTime } from '../time-converter/time-converter';
import { usePostCommentMutation } from '../../features/api/posts/postsApi';
import { Comment } from '../../types/comment';
import styles from './comment-section.module.css';

interface CommentProps {
    comments: Comment[];
}

interface TreeComment extends Comment {
    childrenReplies?: TreeComment[];
}

export function CommentSection({ comments }: CommentProps) {
    const { username, id } = useParams<{ username: string; id: string }>();
    const [commentText, setCommentText] = useState('');

    const [replyingToId, setReplyingToId] = useState<number | null>(null);
    const [expandedThreads, setExpandedThreads] = useState<Set<number>>(
        new Set(),
    );
    const MAX_DEPTH = 3;

    const [postComment, { isLoading }] = usePostCommentMutation();

    const handleSubmit = async (e: React.FormEvent, parentId?: number) => {
        e.preventDefault();
        if (!username || !id || !commentText.trim()) return;

        try {
            await postComment({
                username,
                id: Number(id),
                content: commentText.trim(),
                replyToId: parentId,
            }).unwrap();

            setCommentText('');
            setReplyingToId(null);
        } catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        }
    };

    function countReplies(item: TreeComment): number {
        if (!item.childrenReplies?.length) return 0;
        return item.childrenReplies.reduce(
            (acc, reply) => acc + 1 + countReplies(reply),
            0,
        );
    }

    const commentTree = useMemo(() => {
        if (!comments || comments.length === 0) return [];

        const map: Record<number, TreeComment> = {};
        const roots: TreeComment[] = [];

        comments.forEach((comment) => {
            map[comment.id] = { ...comment, childrenReplies: [] };
        });

        comments.forEach((comment) => {
            const mappedComment = map[comment.id];

            if (comment.replyToId && map[comment.replyToId]) {
                map[comment.replyToId].childrenReplies?.push(mappedComment);
            } else {
                roots.push(mappedComment);
            }
        });

        return roots;
    }, [comments]);

    const renderInputForm = (parentId?: number) => (
        <form
            className={`${styles.commentForm} ${parentId ? styles.inlineReplyForm : ''}`}
            onSubmit={(e) => handleSubmit(e, parentId)}
        >
            <div className={styles.commentFormInputsRow}>
                <textarea
                    className={styles.commentInput}
                    placeholder={
                        parentId ? 'Напишите ответ' : 'Оставьте комментарий'
                    }
                    rows={parentId ? 1 : 2}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    disabled={isLoading}
                    autoFocus={!!parentId}
                />
                <div className={styles.formActionsGroup}>
                    {parentId && (
                        <button
                            type="button"
                            className={styles.cancelInlineReplyBtn}
                            onClick={() => {
                                setReplyingToId(null);
                                setCommentText('');
                            }}
                        >
                            Отмена
                        </button>
                    )}
                    <button
                        type="submit"
                        className={styles.commentSubmitButton}
                        disabled={!commentText.trim() || isLoading}
                    >
                        {isLoading ? '...' : 'Отправить'}
                    </button>
                </div>
            </div>
        </form>
    );

    const renderCommentNode = (
        item: TreeComment,
        isReplyNode: boolean = false,
        depth: number = 0,
    ) => {
        const isFormActiveUnderThisComment = replyingToId === item.id;
        const isMobile = window.innerWidth <= 480;
        const step = isMobile ? 5 : 10;
        const maxIndent = isMobile ? 15 : 30;
        const paddingLeft = depth > 0 ? Math.min(depth * step, maxIndent) : 0;

        return (
            <div
                key={item.id}
                className={styles.commentNodeGroup}
                style={{
                    paddingLeft: depth > 0 ? `${paddingLeft}px` : undefined,
                }}
            >
                <div
                    className={`${styles.commentItem} ${isReplyNode ? styles.commentItemReply : ''}`}
                >
                    <div className={styles.postContent}>
                        <div className={styles.postAuthor}>
                            <div className={styles.postAuthorAvatar}>
                                <img
                                    className={`${styles.profileAvatarImg} ${styles.rounded} ${styles.postAvatar}`}
                                    src={
                                        item.author?.avatarUrl
                                            ? item.author.avatarUrl
                                            : '/img/defaultavatar.png'
                                    }
                                    alt={`${item.author?.firstName} ${item.author?.lastName}`}
                                />
                            </div>
                            <div className={styles.postAuthorName}>
                                <div className={styles.authorMetaNameWrapper}>
                                    <a
                                        href={`/${item.author?.username}`}
                                        className={styles.authorNameUrl}
                                    >
                                        <span className={styles.authorName}>
                                            {item.author?.firstName}{' '}
                                            {item.author?.lastName}
                                        </span>
                                    </a>
                                    <Faculty
                                        faculty={item.author?.faculty}
                                    />{' '}
                                </div>
                            </div>
                            {isReplyNode && item.replyTo?.author && (
                                <span className={styles.commentReplyTargetTag}>
                                    в ответ{' '}
                                    <a
                                        href={`/${item.replyTo.author.username}`}
                                        className={styles.targetUserLink}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {item.replyTo.author.firstName}
                                    </a>
                                </span>
                            )}
                        </div>
                    </div>

                    <p className={styles.commentContent}>{item.content}</p>

                    <div className={styles.commentFooterActions}>
                        <button
                            type="button"
                            className={styles.commentReplyActionBtn}
                            onClick={() => {
                                setReplyingToId(item.id);
                                setCommentText('');
                            }}
                        >
                            Ответить
                        </button>
                        <div className={styles.commentMeta}>
                            <ConvertTime time={item.createdAt} />
                        </div>
                    </div>
                </div>

                {isFormActiveUnderThisComment && (
                    <div
                        className={`${styles.inlineFormContainer} ${isReplyNode ? styles.commentItemReply : ''}`}
                    >
                        {renderInputForm(item.id)}
                    </div>
                )}

                {item.childrenReplies && item.childrenReplies.length > 0 && (
                    <div className={styles.repliesBranchChildrenWrapper}>
                        {item.childrenReplies.map((reply) => {
                            if (
                                depth >= MAX_DEPTH &&
                                !expandedThreads.has(reply.id)
                            ) {
                                return (
                                    <button
                                        key={reply.id}
                                        className={styles.continueThreadBtn}
                                        style={{
                                            paddingLeft:
                                                depth > 0
                                                    ? `${paddingLeft}px`
                                                    : undefined,
                                        }}
                                        onClick={() =>
                                            setExpandedThreads((prev) =>
                                                new Set(prev).add(reply.id),
                                            )
                                        }
                                    >
                                        ↳ Показать ещё {countReplies(reply) + 1}{' '}
                                        {countReplies(reply) + 1 === 1
                                            ? 'ответ'
                                            : 'ответов'}
                                    </button>
                                );
                            }
                            return renderCommentNode(reply, true, depth + 1);
                        })}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={styles.commentsSection}>
            <p className={styles.sectionTitle}>
                Комментарии — {comments.length}
            </p>

            {replyingToId === null && renderInputForm()}

            {commentTree.length > 0 ? (
                <div className={styles.commentsListWrapper}>
                    {commentTree.map((rootComment) => (
                        <React.Fragment key={rootComment.id}>
                            {renderCommentNode(rootComment, false)}
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <p className={styles.emptyCommentsLabel}>
                    Комментариев пока нет. Напишите что-нибудь!
                </p>
            )}
        </div>
    );
}
