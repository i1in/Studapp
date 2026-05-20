import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useGetProfileQuery } from '../../features/api/user/userApi';
import { useAppSelector } from '../../store/hooks';
import { useParams } from 'react-router-dom';
import { Logo } from "../../components/logo/logo";
import { UserCardList } from '../../components/user-posts-list/user-posts-list';
import { UserProfile } from '../../components/user-profile-component/user-profile-component';
import { UserPost } from '../../components/user-profile-component/user-post';
import { ProfileButton } from '../../components/profile-button/profile-button';
import { LogoutButton } from '../../components/logout/logout';
import { AdminButton } from '../../components/admin-button/admin-button';
import NotFound from '../not-found/not-found';
function ProfilePage() {
    const { username } = useParams();
    const { data: user, isLoading, error } = useGetProfileQuery(username);
    const currentUserId = useAppSelector((state) => state.auth.userId);
    if (isLoading) {
        return (_jsx("div", { className: "loading", children: _jsx("p", { className: "loading-title", children: "Loading" }) }));
    }
    if (!user) {
        return _jsx(NotFound, {});
    }
    const isOwner = user?.id === currentUserId;
    return (_jsxs(_Fragment, { children: [_jsxs("header", { className: "header", children: [_jsx("div", { className: "header__wrapper", children: _jsx("div", { className: "header__left", children: _jsx(Logo, {}) }) }), _jsxs("div", { className: "user-buttons", style: { display: 'flex', gap: '.5rem' }, children: [isOwner && user?.role === 'admin' && (_jsx(AdminButton, {})), isOwner && (_jsx(LogoutButton, {}))] })] }), _jsxs("div", { className: "layout", children: [_jsxs("nav", { className: "menu", children: [_jsxs("a", { href: "/search", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { width: "24px", height: "24px", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: [_jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { d: "M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z", fill: "currentColor" }) })] }) }), _jsx("span", { className: "label", children: "\u041F\u043E\u0438\u0441\u043A" })] }), _jsxs("a", { href: "/feed", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { fill: "currentColor", version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", width: "32px", height: "24px", viewBox: "0 0 92 92", enableBackground: "new 0 0 92 92", xmlSpace: "preserve", children: [_jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { id: "XMLID_1210_", d: "M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z" }) })] }) }), _jsx("span", { className: "label", children: "\u041B\u0435\u043D\u0442\u0430" })] }), _jsx(ProfileButton, { active: true })] }), _jsx("main", { className: "content", children: _jsxs("div", { className: "user-section", children: [_jsx(UserProfile, {}), isOwner && (_jsx(UserPost, {})), _jsxs("div", { className: "post-section", children: [_jsx("p", { className: "section-title", children: "\u0417\u0430\u043C\u0435\u0442\u043A\u0438" }), _jsx(UserCardList, {})] })] }) })] })] }));
}
export default ProfilePage;
