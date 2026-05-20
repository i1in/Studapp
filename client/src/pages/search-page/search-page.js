import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { Faculty } from '../../components/post-card/post-faculty';
import { ProfileButton } from '../../components/profile-button/profile-button';
export default function UserSearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const fetchUsers = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setResults([]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`api/users?query=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            if (!res.ok) {
                throw new Error(`Server responded ${res.status}`);
            }
            const data = await res.json();
            console.log(data);
            setResults(data);
        }
        catch (e) {
            if (e instanceof Response) {
                const errorData = await e.json();
                console.error(errorData.message);
                setError(errorData.message || 'Ошибка сервера');
            }
            else if (e instanceof Error) {
                console.error(e.message);
                setError(e.message);
            }
            else {
                setError('Неизвестная ошибка');
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "header", children: _jsx("div", { className: "header__wrapper", children: _jsx("div", { className: "header__left", children: _jsx(Logo, {}) }) }) }), _jsxs("div", { className: "layout", children: [_jsxs("nav", { className: "menu", children: [_jsxs("a", { href: "/search", className: "menu-item active", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { width: "24px", height: "24px", viewBox: "0 0 1024 1024", version: "1.1", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", children: [_jsx("g", { id: "SVGRepo_bgCarrier", "stroke-width": "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", "stroke-linecap": "round", "stroke-linejoin": "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { d: "M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z", fill: "currentColor" }) })] }) }), _jsx("span", { className: "label", children: "\u041F\u043E\u0438\u0441\u043A" })] }), _jsxs("a", { href: "/feed", className: "menu-item", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { fill: "currentColor", version: "1.1", id: "Layer_1", xmlns: "http://www.w3.org/2000/svg", width: "32px", height: "24px", viewBox: "0 0 92 92", enableBackground: "new 0 0 92 92", xmlSpace: "preserve", children: [_jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("g", { id: "SVGRepo_iconCarrier", children: _jsx("path", { id: "XMLID_1210_", d: "M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z" }) })] }) }), _jsx("span", { className: "label", children: "\u041B\u0435\u043D\u0442\u0430" })] }), _jsx(ProfileButton, { active: false })] }), _jsxs("main", { className: "content", children: [_jsxs("div", { className: "search-input-wrapper", children: [_jsx("p", { className: "search-header", children: "\u041F\u043E\u0438\u0441\u043A \u0441\u0442\u0443\u0434\u0435\u043D\u0442\u0430" }), _jsx("input", { ref: inputRef, type: "text", placeholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043C\u044F \u0438\u043B\u0438 \u043D\u0438\u043A\u043D\u0435\u0439\u043C...", value: query, onChange: (e) => setQuery(e.target.value), className: "search-input" })] }), isLoading && _jsx("p", { className: "search-loading", children: "\u0418\u0434\u0435\u0442 \u043F\u043E\u0438\u0441\u043A..." }), error && _jsx("p", { className: "search-error", children: error }), _jsx("ul", { className: "search-results", children: results.map((user) => (_jsx("li", { className: "search-result-item", children: _jsxs(Link, { to: `/${user.username || user.id}`, className: "search-result-link", children: [_jsx("div", { className: "search-result-avatar", children: _jsx("img", { src: user.avatarUrl ? user.avatarUrl : 'img/defaultavatar.png', alt: user.username || `${user.firstName} ${user.lastName}`, className: "avatar-img" }) }), _jsx("div", { className: "post-author__name", children: _jsxs("a", { href: `${user.username}`, className: "author-name__url", children: [_jsxs("p", { className: "author-name", children: [user.firstName, " ", user.lastName, user.username && (_jsxs("span", { className: "search-result-username", children: [" (@", user.username, ")"] }))] }), _jsx(Faculty, { faculty: user.faculty })] }) })] }) }, user.id))) }), query.trim() && !isLoading && results.length === 0 && (_jsx("p", { className: "search-no-results", children: "\u041D\u0438\u0447\u0435\u0433\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E" }))] })] })] }));
}
