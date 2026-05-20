import { jsx as _jsx } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
function AdminButton() {
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate('/admin');
    };
    return (_jsx("button", { className: "logout", style: { backgroundColor: '#202020' }, onClick: handleRedirect, children: _jsx("p", { className: "logout-text", children: "\u0410\u0434\u043C\u0438\u043D-\u043F\u0430\u043D\u0435\u043B\u044C" }) }));
}
export { AdminButton };
