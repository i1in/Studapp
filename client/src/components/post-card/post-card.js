import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Faculty } from "./post-faculty";
import { ShowAttachmentBlock } from './post-attachments';
import { useState } from 'react';
import { ConvertTime } from "../time-converter/time-converter";
import { useLikePostMutation } from '../../features/api/posts/postsApi';
function PostCard({ id, content, createdAt, attachmentsCount, attachmentsTotalSize, likesCount, isLikedByCurrentUser, author }) {
    const [likePost, { isLoading }] = useLikePostMutation();
    const [isLiked, setIsLiked] = useState(isLikedByCurrentUser);
    const [localLikeCount, setLocalLikeCount] = useState(likesCount);
    const handleLike = async (e) => {
        const postId = Number(e.currentTarget.dataset.id);
        if (!postId)
            return;
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
        }
        catch (error) {
            console.error('Ошибка при лайке:', error);
        }
    };
    return (_jsxs("div", { className: "post", children: [_jsxs("div", { className: "post-author", children: [_jsx("div", { className: "post-author__avatar", children: _jsx("img", { className: "profile-avatar__img rounded post-avatar", src: author.avatarUrl ? author.avatarUrl : "img/defaultavatar.png", alt: `${author.firstName} ${author.lastName}` }) }), _jsx("div", { className: "post-author__name", children: _jsxs("a", { href: `${author.username}`, className: "author-name__url", children: [_jsxs("p", { className: "author-name", children: [author.firstName, " ", author.lastName] }), _jsx(Faculty, { faculty: author.faculty })] }) })] }), _jsxs("div", { className: "post-content", children: [_jsx("div", { className: "post-content__title", children: _jsx("p", { className: "content-text", children: content }) }), attachmentsCount > 0 && (_jsx(ShowAttachmentBlock, { postId: id, username: author.username, attachmentsCount: attachmentsCount, attachmentsTotalSize: attachmentsTotalSize })), _jsx(ConvertTime, { time: createdAt })] }), _jsx("div", { className: "additional", children: _jsxs("div", { className: "interaction-buttons", children: [_jsxs("div", { className: "interaction-buttons__button", children: [_jsx("button", { className: `reaction-button ${isLiked ? 'active' : ''}`, "aria-pressed": isLiked, "data-id": id, onClick: handleLike, disabled: isLoading, children: _jsx("svg", { viewBox: "0 0 24 24", className: "reaction-icon", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5\n                                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09\n                                        C13.09 3.81 14.76 3 16.5 3\n                                        19.58 3 22 5.42 22 8.5\n                                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", fill: "currentColor" }) }) }), localLikeCount > 0 && (_jsx("p", { className: "buttons__count", children: localLikeCount }))] }), _jsx("div", { className: "interaction-buttons__button comment", children: _jsx("a", { href: `${author.username}/post/${id}`, className: "reaction-button", "aria-pressed": "false", children: _jsx("svg", { viewBox: "2 2 22 22", className: "reaction-icon", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M21 6h-18c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h4v4l4-4h10c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z", fill: "currentColor" }) }) }) })] }) })] }));
}
export default PostCard;
