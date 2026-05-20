import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const params = useParams();
    const postId = Number(params.id);
    const { data: post, isLoading, isError, error } = useGetFullPostQuery({
        username: params.username,
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
    if (isLoading)
        return _jsx("div", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    if (!post)
        return _jsx(NotFound, {});
    console.log(post);
    const handleLike = async (e) => {
        const postId = Number(e.currentTarget.dataset.id);
        if (!postId)
            return;
        try {
            await likePost(postId).unwrap();
            setIsLiked(prev => !prev);
            setLocalLikeCount(prev => isLiked ? prev - 1 : prev + 1);
        }
        catch (error) {
            console.error('Ошибка при лайке:', error);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "header", children: _jsx("div", { className: "header__wrapper", children: _jsx("div", { className: "header__left", children: _jsx(Logo, {}) }) }) }), _jsxs("div", { className: "layout", children: [_jsxs("nav", { className: "menu", children: [_jsxs("a", { href: "/search", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { width: "24px", height: "24px", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: [_jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { d: "M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z", fill: "currentColor" }) })] }) }), _jsx("span", { className: "label", children: "\u041F\u043E\u0438\u0441\u043A" })] }), _jsxs("a", { href: "/feed", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { fill: "currentColor", version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", width: "32px", height: "24px", viewBox: "0 0 92 92", enableBackground: "new 0 0 92 92", xmlSpace: "preserve", children: [_jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { id: "XMLID_1210_", d: "M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z" }) })] }) }), _jsx("span", { className: "label", children: "\u041B\u0435\u043D\u0442\u0430" })] }), _jsx(ProfileButton, { active: true })] }), _jsxs("main", { className: "content", children: [_jsxs("div", { className: "breadcrumbs", children: [_jsx("a", { href: "/feed", className: "breadcrumb", children: "\u041B\u0435\u043D\u0442\u0430 >" }), _jsx("p", { className: "breadcrumb active", children: "\u0417\u0430\u043C\u0435\u0442\u043A\u0430" })] }), _jsxs("div", { className: "full-post", children: [_jsxs("div", { className: "post-author", children: [_jsx("div", { className: "post-author__avatar", children: _jsx("img", { className: "profile-avatar__img rounded post-avatar", src: post.author.avatarUrl ? post.author.avatarUrl : "/img/defaultavatar.png", alt: `${post.author.firstName} ${post.author.lastName}` }) }), _jsx("div", { className: "post-author__name", children: _jsxs("a", { href: `/${post.author.username}`, className: "author-name__url", children: [_jsxs("p", { className: "author-name", children: [post.author.firstName, " ", post.author.lastName] }), _jsx(Faculty, { faculty: post.author.faculty })] }) })] }), _jsx("div", { className: "post-content", children: _jsx("div", { className: "post-content__title", children: _jsx("p", { className: "content-text", children: post.content }) }) }), _jsx(ShowFullAttachments, { attachments: post.attachments }), _jsx(ConvertTime, { time: post.createdAt })] }), _jsx("div", { className: "additional", children: _jsx("div", { className: "interaction-buttons", children: _jsxs("div", { className: "interaction-buttons__button", children: [_jsx("button", { className: `reaction-button ${isLiked ? 'active' : ''}`, "aria-pressed": isLiked, "data-id": post.id, onClick: handleLike, disabled: isLoading, children: _jsx("svg", { viewBox: "0 0 24 24", className: "reaction-icon", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5\n                                        2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09\n                                        C13.09 3.81 14.76 3 16.5 3\n                                        19.58 3 22 5.42 22 8.5\n                                        c0 3.78-3.4 6.86-8.55 11.54L12 21.35z", fill: "currentColor" }) }) }), localLikeCount > 0 && (_jsx("p", { className: "buttons__count", children: localLikeCount }))] }) }) }), _jsx(CommentSection, { comments: post.comments })] })] })] }));
}
export default PostPage;
