import { Link, useLocation } from 'react-router-dom';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ContextMenu } from '../messenger/context-menu/context-menu';
import { LogoutButton } from '../logout/logout';
import { useGetProfileByIdQuery } from '../../features/api/user/userApi';
import { ProfileAvatar } from '../profile-avatar/profile-avatar';
import { LinkToProfile } from '../shared/link-to-profile/link-to-profile';
import { AppRoute } from '../../const';
import styles from './app-menu.module.css';
import { AdminButton } from '../admin-button/admin-button';

interface Props {
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    onOpenDrawer: () => void;
    hideOnMobile?: boolean;
    variant?: 'fixed' | 'inline' | 'sidebar';
}

export function AppMenu({
    isDrawerOpen,
    onCloseDrawer,
    onOpenDrawer,
    hideOnMobile,
    variant = 'inline',
}: Props) {
    const location = useLocation();
    const { data: currentUser, isLoading } = useGetProfileByIdQuery();
    console.log(currentUser);
    const { onContextMenu, close, coords } = useContextMenu();

    const isFixed = variant === 'fixed' || variant === 'sidebar';
    const isChatsPage = location.pathname === AppRoute.Chats;

    const menuClassName = [
        styles.bottomBar,
        hideOnMobile ? styles.mobileHidden : '',
        variant === 'sidebar' ? styles.sidebarVariant : '',
    ]
        .filter(Boolean)
        .join(' ');

    const isMessenger = location.pathname === AppRoute.Chats;

    return (
        <nav className={`${menuClassName} ${isMessenger ? styles.messengerMode : ''}`}>
            <div className={styles.navLinks}>
                <Link
                    to={AppRoute.Main}
                    className={`${styles.tabItem} ${styles.sidebarOnly} ${
                        location.pathname === AppRoute.Main ? styles.active : ''
                    }`}
                >
                    <span className={styles.tabIcon}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="2"
                                y="2"
                                width="18"
                                height="18"
                                rx="5"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M11 16V8M11 16C9 16 6 14.5 6 14.5V6.5C6 6.5 9 8 11 8C13 8 16 6.5 16 6.5V14.5C16 14.5 13 16 11 16Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <span className={styles.tabText}>Studapp</span>
                </Link>

                {variant === 'sidebar' && (
                    <hr
                        className={`${styles.sidebarDivider} ${styles.sidebarOnly}`}
                    />
                )}

                <Link
                    to={AppRoute.Search}
                    className={`${styles.tabItem} ${location.pathname === AppRoute.Search ? styles.active : ''}`}
                >
                    <span className={styles.tabIcon}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 1024 1024"
                            fill="currentColor"
                        >
                            <path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z" />
                        </svg>
                    </span>
                    <span className={styles.tabText}>Поиск</span>
                </Link>

                <Link
                    to={AppRoute.Main}
                    className={`${styles.tabItem} ${location.pathname === AppRoute.Main ? styles.active : ''}`}
                >
                    <span className={styles.tabIcon}>
                        <svg
                            fill="currentColor"
                            width="28"
                            height="22"
                            viewBox="0 0 92 92"
                        >
                            <path d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z" />
                        </svg>
                    </span>
                    <span className={styles.tabText}>Лента</span>
                </Link>

                <Link
                    to={AppRoute.Chats}
                    className={`${styles.tabItem} ${location.pathname === AppRoute.Chats ? styles.active : ''}`}
                >
                    <span className={styles.tabIcon}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M8,4 H16 A5,5 0 0 1 21,9 V12 A5,5 0 0 1 16,17 L12,17 L7,21 L8,17 A5,5 0 0 1 3,12 V9 A5,5 0 0 1 8,4 Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="9"
                                cy="10.5"
                                r="1"
                                fill="currentColor"
                            />
                            <circle
                                cx="12"
                                cy="10.5"
                                r="1"
                                fill="currentColor"
                            />
                            <circle
                                cx="15"
                                cy="10.5"
                                r="1"
                                fill="currentColor"
                            />
                        </svg>
                    </span>
                    <span className={styles.tabText}>Чаты</span>
                </Link>

                <LinkToProfile
                    userOrUsername={currentUser}
                    className={styles.tabItem}
                >
                    <span className={styles.tabIcon}>
                        <ProfileAvatar />
                    </span>
                    <span className={styles.tabText}>Профиль</span>
                </LinkToProfile>

                <button
                    className={`${styles.tabItem} ${styles.sidebarOnly}`}
                    style={{ marginTop: 'auto' }}
                    onContextMenu={onContextMenu}
                    onClick={(e) => {
                        e.stopPropagation();
                        onContextMenu(e as any);
                    }}
                    title="Опции"
                >
                    <span className={styles.tabIcon}>
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 8H20" />
                            <path d="M4 16H20" />
                        </svg>
                    </span>
                    <span className={styles.tabText}>Опции</span>
                </button>
                <ContextMenu onClose={close} coords={coords}>
                    <div className={`${styles.createMenu}`}>
                        {currentUser?.role === 'admin' && (
                            <AdminButton role={'menuitem'} danger={false} />
                        )}
                        <LogoutButton role={'menuitem'} danger={true} />
                    </div>
                </ContextMenu>
            </div>

            {isChatsPage && (
                <>
                    <div
                        className={`${styles.overlay} ${isDrawerOpen ? styles.overlayVisible : ''}`}
                        onClick={onCloseDrawer}
                    />
                    <aside
                        className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}
                    >
                        <div className={styles.drawerHeader}>
                            <div className={styles.userAvatar}>
                                <ProfileAvatar />
                            </div>
                            <div className={styles.userInfo}>
                                <span className={styles.userName}>
                                    {isLoading
                                        ? 'Загрузка...'
                                        : `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`.trim() ||
                                          'Пользователь'}
                                </span>
                                <span className={styles.userStatus}>
                                    В сети
                                </span>
                            </div>
                        </div>

                        <div className={styles.drawerContent}>
                            <LinkToProfile
                                userOrUsername={currentUser}
                                className={styles.drawerItem}
                            >
                                <ProfileAvatar />
                                <span className={styles.drawerText}>
                                    Мой профиль
                                </span>
                            </LinkToProfile>
                            <Link to="/settings" className={styles.drawerItem}>
                                <span className={styles.drawerIcon}>⚙️</span>
                                <span className={styles.drawerText}>
                                    Настройки
                                </span>
                            </Link>
                            <div className={styles.drawerDivider} />
                            <div className={styles.drawerFooter}>
                                <LogoutButton danger={true} />
                            </div>
                        </div>
                    </aside>
                </>
            )}
        </nav>
    );
}
