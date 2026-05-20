import { jsx as _jsx } from "react/jsx-runtime";
import { useDispatch } from 'react-redux';
import { logout } from '../../features/api/auth/authSlice';
import { useNavigate } from 'react-router-dom';
function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };
    return (_jsx("button", { className: "logout", onClick: handleLogout, children: _jsx("p", { className: "logout-text", children: "\u0412\u044B\u0439\u0442\u0438" }) }));
}
export { LogoutButton };
