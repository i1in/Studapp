import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { ProfileButton } from '../../components/profile-button/profile-button';
const FACULTIES = [
    { value: 'ivmiit', label: 'ИВМиИТ' },
    { value: 'itis', label: 'ИТиИС' },
    { value: 'iir', label: 'ИМО' },
    { value: 'imef', label: 'ИУЭФ' },
    { value: 'ifmb', label: 'ИФМБ' },
    { value: 'ignt', label: 'ИГНТ' },
    { value: 'iec', label: 'ИЭиЦ' }
];
const ROLES = [
    { value: 'student', label: 'Студент' },
    { value: 'teacher', label: 'Преподаватель' },
    { value: 'admin', label: 'Админ' }
];
export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [faculty, setFaculty] = useState(FACULTIES[0].value);
    const [role, setRole] = useState(ROLES[0].value);
    const [registerError, setRegisterError] = useState(null);
    const [registerSuccess, setRegisterSuccess] = useState(null);
    const [registerSuccessData, setRegisterSuccessData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const response = await res.json();
            if (response.user === null) {
                navigate('/feed');
            }
            if (res.status === 401) {
                navigate('/');
                throw new Error(`Ошибка сервера: ${res.status}`);
            }
            const data = await res.json();
            setUsers(data);
        }
        catch (e) {
            setError(e.message);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    const handleRegister = async (e) => {
        e.preventDefault();
        setRegisterError(null);
        setRegisterSuccess(null);
        if (!email || !firstName || !lastName) {
            setRegisterError('Заполните все обязательные поля');
            return;
        }
        try {
            const res = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    faculty,
                    role
                })
            });
            if (res.status === 403) {
                throw new Error('Доступ запрещён');
            }
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || `Ошибка сервера: ${res.status}`);
            }
            const response = await res.json();
            setRegisterSuccess('Студент зарегистрирован.');
            setRegisterSuccessData(response.user);
            setEmail('');
            setFirstName('');
            setLastName('');
            setFaculty(FACULTIES[0].value);
            setRole(ROLES[0].value);
            fetchUsers();
        }
        catch (e) {
            setRegisterError(e.message);
        }
    };
    return (_jsxs("div", { className: "page", children: [_jsx("header", { className: "header", children: _jsx("div", { className: "header__wrapper", children: _jsx("div", { className: "header__left", children: _jsx(Logo, {}) }) }) }), _jsxs("div", { className: "layout", children: [_jsxs("nav", { className: "menu", children: [_jsxs("a", { href: "/search", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { width: "24px", height: "24px", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: [_jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { d: "M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z", fill: "currentColor" }) })] }) }), _jsx("span", { className: "label", children: "\u041F\u043E\u0438\u0441\u043A" })] }), _jsxs("a", { href: "/feed", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { fill: "currentColor", version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", width: "32px", height: "24px", viewBox: "0 0 92 92", enableBackground: "new 0 0 92 92", xmlSpace: "preserve", children: [_jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { id: "XMLID_1210_", d: "M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z" }) })] }) }), _jsx("span", { className: "label", children: "\u041B\u0435\u043D\u0442\u0430" })] }), _jsx(ProfileButton, { active: true })] }), _jsx("main", { className: "content", children: _jsxs("div", { className: "admin-panel", style: { padding: '1rem' }, children: [_jsx("h2", { className: "admin-title", children: "\u0410\u0434\u043C\u0438\u043D-\u043F\u0430\u043D\u0435\u043B\u044C" }), _jsxs("section", { style: { marginBottom: '2rem' }, children: [_jsx("h3", { className: "admin-subtitle", children: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F" }), _jsxs("form", { className: "admin-form", onSubmit: handleRegister, style: { maxWidth: '400px' }, children: [_jsx("div", { style: { marginBottom: '0.5rem' }, children: _jsxs("label", { children: ["Email*:", _jsx("br", {}), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, style: { width: '100%', padding: '0.4rem' } })] }) }), _jsx("div", { style: { marginBottom: '0.5rem' }, children: _jsxs("label", { children: ["\u0418\u043C\u044F*:", _jsx("br", {}), _jsx("input", { type: "text", value: firstName, onChange: (e) => setFirstName(e.target.value), required: true, style: { width: '100%', padding: '0.4rem' } })] }) }), _jsx("div", { style: { marginBottom: '0.5rem' }, children: _jsxs("label", { children: ["\u0424\u0430\u043C\u0438\u043B\u0438\u044F*:", _jsx("br", {}), _jsx("input", { type: "text", value: lastName, onChange: (e) => setLastName(e.target.value), required: true, style: { width: '100%', padding: '0.4rem' } })] }) }), _jsx("div", { style: { marginBottom: '0.5rem' }, children: _jsxs("label", { children: ["\u0424\u0430\u043A\u0443\u043B\u044C\u0442\u0435\u0442*:", _jsx("br", {}), _jsx("select", { value: faculty, onChange: (e) => setFaculty(e.target.value), required: true, style: { width: '100%', padding: '0.4rem' }, children: FACULTIES.map((f) => (_jsx("option", { value: f.value, children: f.label }, f.value))) })] }) }), _jsx("div", { style: { marginBottom: '0.5rem' }, children: _jsxs("label", { children: ["\u0420\u043E\u043B\u044C*:", _jsx("br", {}), _jsx("select", { value: role, onChange: (e) => setRole(e.target.value), required: true, style: { width: '100%', padding: '0.4rem' }, children: ROLES.map((r) => (_jsx("option", { value: r.value, children: r.label }, r.value))) })] }) }), registerError && (_jsx("p", { style: { color: 'red', marginTop: '0.5rem' }, children: registerError })), registerSuccess && (_jsx("p", { style: { color: 'green', marginTop: '0.5rem' }, children: registerSuccess })), registerSuccessData && (_jsxs("div", { style: { color: 'green', marginTop: '0.5rem' }, children: [_jsxs("p", { children: ["Email: ", registerSuccessData.email] }), _jsxs("p", { children: ["Password: ", registerSuccessData.password] })] })), _jsx("button", { type: "submit", style: { marginTop: '1rem', padding: '0.5rem 1rem' }, children: "\u0417\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C" })] })] })] }) })] })] }));
}
