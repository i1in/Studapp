import { Logo } from '../../components/logo/logo';
import { ProfileButton } from '../../components/profile-button/profile-button';
import { LogoutButton } from '../../components/logout/logout';

function NotFound() {
    return (
        <>
            <header className="header">
                <div className="header__wrapper">
                    <div className="header__left">
                        <Logo />
                    </div>
                </div>
            </header>
            <div className="layout">
                <nav className="menu">
                    <a href="/search" className="menu-item">
                        <span className="icon">
                            <svg width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z" fill="currentColor"></path></g></svg>
                        </span>
                        <span className="label">Поиск</span>
                    </a>
                    <a href="/feed" className="menu-item">
                        <span className="icon">
                            <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="32px"
                                height="24px" viewBox="0 0 92 92" enableBackground="new 0 0 92 92" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path id="XMLID_1210_"
                                        d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                        <span className="label">Лента</span>
                    </a>
                    <ProfileButton active={false} />
                </nav>

                <main className="content">
                    <div className="page__404">
                        <section className="not-found">
                            <p className="not-found__title">404</p>
                            <p className="not-found__subtitle">Страница не найдена</p>
                            <p className="not-found__text">
                                Страница, которую вы ищете, куда-то исчезла, и мы не собираемся её искать.
                            </p>
                            <a className="not-found__link button" href="/feed">
                                На главную
                            </a>
                        </section>
                    </div>
                </main>
            </div>
        </>
    );
}

export default NotFound;