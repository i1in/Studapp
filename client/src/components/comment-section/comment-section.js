import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Faculty } from "../post-card/post-faculty";
import { ConvertTime } from "../time-converter/time-converter";
import { usePostCommentMutation } from '../../features/api/posts/postsApi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
function CommentSection({ comments }) {
    const { username, id } = useParams();
    const [commentText, setCommentText] = useState('');
    const [postComment, { isLoading }] = usePostCommentMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !id) {
            console.error('username или id поста не найдены в URL');
            return;
        }
        if (!commentText.trim())
            return;
        try {
            await postComment({
                username,
                id: Number(id),
                content: commentText
            }).unwrap();
            setCommentText('');
        }
        catch (error) {
            console.error('Ошибка при отправке комментария:', error);
        }
    };
    return (_jsxs("div", { className: "comments-section", children: [_jsxs("p", { className: "section-title", children: ["\u041A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0438 \u2014 ", comments.length] }), _jsxs("form", { className: "comment-form", onSubmit: handleSubmit, children: [_jsx("textarea", { className: "comment-input", placeholder: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439", rows: 2, value: commentText, onChange: (e) => { setCommentText(e.target.value); console.log(commentText); }, disabled: isLoading }), _jsx("button", { type: "submit", className: "comment-submit-button", disabled: !commentText.trim() || isLoading, children: isLoading ? 'Отправка...' : 'Отправить' })] }), comments.length > 0 && (comments.map((item) => (_jsxs("div", { className: "comment-item", children: [_jsxs("div", { className: "post-author", children: [_jsx("div", { className: "post-author__avatar", children: _jsx("img", { className: "profile-avatar__img rounded post-avatar", src: item.author.avatarUrl ? item.author.avatarUrl : "/img/defaultavatar.png", alt: `${item.author.firstName} ${item.author.lastName}` }) }), _jsx("div", { className: "post-author__name", children: _jsxs("a", { href: `/${item.author.username}`, className: "author-name__url", children: [_jsxs("p", { className: "author-name", children: [item.author.firstName, " ", item.author.lastName] }), _jsx(Faculty, { faculty: item.author.faculty })] }) })] }), _jsx("p", { className: "comment-content", children: item.content }), _jsx(ConvertTime, { time: item.createdAt })] }))))] }));
}
export { CommentSection };
