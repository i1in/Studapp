import { Link } from "react-router-dom";

function Logo() {
    return (
        <Link to='/feed' className="header__logo-link header__logo-link--active">
            <p className="header__logo">Studapp</p>
        </Link>
    );
}

export { Logo };