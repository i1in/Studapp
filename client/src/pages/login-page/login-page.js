import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from "../../store/hooks";
import { setToken } from '../../features/api/auth/authSlice';
import { Logo } from '../../components/logo/logo';
import { ErrorMessage } from '../../components/error-message/error-message';
import { useLoginMutation } from '../../features/api/auth/authApi';
import { AppRoute } from '../../const';
function isApiError(error) {
    return (typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'data' in error);
}
function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const [getToken, { isLoading }] = useLoginMutation();
    const [errorMsg, setErrorMsg] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalEmail = email;
            const finalPassword = password;
            const response = await getToken({
                email: finalEmail,
                password: finalPassword
            }).unwrap();
            console.log('SUCCESS: ', response);
            localStorage.setItem('token', response.token);
            dispatch(setToken(response.token));
            navigate(AppRoute.Main);
        }
        catch (error) {
            if (isApiError(error)) {
                const message = error.data?.message || 'UNKNOWN_ERROR';
                setErrorMsg(message);
                console.log('ERROR: ' + message);
            }
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "header", children: _jsx("div", { className: "header__wrapper", children: _jsx("div", { className: "header__left", children: _jsx(Logo, {}) }) }) }), _jsxs("div", { className: "page", children: [_jsx("div", { className: "container", children: _jsxs("div", { className: "login-wrapper", children: [_jsx("div", { className: "login-image", children: _jsx("img", { src: "img/login_image.jpg", alt: "login_image" }) }), _jsxs("div", { className: "login-form__main", children: [_jsxs("div", { className: "login-form__labels", children: [_jsx("p", { className: "login-form__title", children: "\u041B\u043E\u0433\u0438\u043D" }), _jsx("p", { className: "login-form__subtitle", children: "\u0412\u0445\u043E\u0434 \u0432 \u0444\u043E\u0440\u0443\u043C \u0434\u043B\u044F \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u043E\u0432" })] }), _jsxs("form", { className: "login-form", onSubmit: handleSubmit, children: [_jsx("input", { type: "text", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx("input", { type: "password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", value: password, onChange: (e) => setPassword(e.target.value), required: true }), errorMsg &&
                                                    _jsx(ErrorMessage, { error: errorMsg }), _jsx("button", { type: "submit", disabled: isLoading, children: "\u0412\u043E\u0439\u0442\u0438" }), _jsxs("p", { className: "login_tip", children: [_jsx("span", { style: { color: 'red' }, children: "(!) " }), "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0432\u044B\u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435"] })] })] })] }) }), _jsx("footer", { className: "footer", children: _jsx("p", { children: "\u00A9 2025" }) })] })] }));
}
export default LoginPage;
