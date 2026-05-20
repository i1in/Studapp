import { jsx as _jsx } from "react/jsx-runtime";
import { Link } from "react-router-dom";
function Logo() {
    return (_jsx(Link, { to: '/feed', className: "header__logo-link header__logo-link--active", children: _jsx("p", { className: "header__logo", children: "Studapp" }) }));
}
export { Logo };
