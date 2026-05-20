import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useGetProfileQuery, usePostStatusMutation } from '../../features/api/user/userApi';
import { useAppSelector } from '../../store/hooks';
import { useParams } from 'react-router-dom';
import { UserFaculty } from './user-faculty';
import { UserRole } from './user-roles';
import { UserFollow } from './user-follow';
export function UserProfile() {
    const { username } = useParams();
    const currentUserId = useAppSelector((state) => state.auth.userId);
    const { data: user, isLoading, error } = useGetProfileQuery(username);
    const [updateStatus, { isLoading: statusLoading, error: statusError }] = usePostStatusMutation();
    const [status, setStatus] = useState(user?.status || '');
    useEffect(() => {
        if (user?.status !== undefined) {
            setStatus(user.status);
        }
    }, [user?.status]);
    const handleStatusChange = async () => {
        try {
            const response = await updateStatus(status).unwrap();
            setStatus(response.status);
        }
        catch (error) {
            console.log(error);
        }
    };
    const isOwner = user?.id === currentUserId;
    return (_jsxs("div", { className: `user-profile ${user?.role}-bg`, children: [_jsxs("div", { className: "user-bio", children: [_jsx("div", { className: "user-avatar", children: _jsx("img", { className: "user-avatar__img rounded", src: user?.avatarUrl ? user?.avatarUrl : "img/defaultavatar.png", alt: "user avatar" }) }), _jsxs("div", { className: "user-bio__block", children: [_jsxs("p", { className: "user-names", children: [user?.firstName, " ", user?.lastName] }), _jsx("input", { className: `user-status__text ${!status && !isOwner ? 'collapsed' : ''}`, value: status, onChange: (e) => setStatus(e.target.value), onBlur: handleStatusChange, disabled: !isOwner, placeholder: isOwner ? "Изменить статус" : "" })] }), _jsxs("div", { className: "user-additional", children: [_jsxs("div", { className: "user-additional__block", children: [_jsx("p", { className: "user-additional__label", children: "\u0421\u0442\u0430\u0442\u0443\u0441" }), _jsx(UserRole, { role: user?.role })] }), _jsxs("div", { className: "user-additional__block", children: [_jsxs("p", { className: "user-additional__label", children: [_jsx("span", { className: "icon", children: "@" }), "\u042E\u0437\u0435\u0440\u043D\u0435\u0439\u043C"] }), _jsx("span", { className: "user-additional__text", children: user?.username })] }), _jsxs("div", { className: "user-additional__block", children: [_jsxs("p", { className: "user-additional__label", children: [_jsx("span", { className: "icon", children: _jsx("svg", { width: "16px", height: "18px", viewBox: "0 -2.4 26.40 28.80", fill: "currentColor", children: _jsx("path", { d: "M2 19h20v3H2zM12 2L2 6v2h20V6M17 10h3v7h-3zM10.5 10h3v7h-3zM4 10h3v7H4z" }) }) }), "\u0424\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442"] }), _jsx(UserFaculty, { faculty: user?.faculty })] })] })] }), _jsx(UserFollow, { id: user?.id ?? 0, followCount: user?.followCount ?? 0, isFollowedByCurrentUser: user?.isFollowedByCurrentUser ?? false })] }));
}
