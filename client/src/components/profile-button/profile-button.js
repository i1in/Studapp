import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { useAppSelector } from '../../store/hooks';
import { useGetProfileByIdQuery } from '../../features/api/user/userApi';
function ProfileButton({ active }) {
    const userId = useAppSelector((state) => state.auth.userId);
    const { data: user, isLoading, error } = useGetProfileByIdQuery(userId);
    return (_jsxs(Link, { to: `/${user?.username}`, className: `profile-avatar menu-item ${active ? 'active' : ''}`, children: [_jsx("div", { className: "profile-avatar__wrapper", children: _jsx("img", { className: "profile-avatar__img rounded", src: user?.avatarUrl ? user?.avatarUrl : "/img/defaultavatar.png", alt: `${user?.firstName} ${user?.lastName}` }) }), _jsx("span", { className: "label", children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" })] }));
}
export { ProfileButton };
