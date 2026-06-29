import { Link, useLocation } from 'react-router-dom';
import { LogoutButton } from '../shared/app-buttons/logout-button/logout-button';
import { useGetProfileByIdQuery } from '../../features/api/user/userApi';
import { ProfileAvatar } from '../profile-avatar/profile-avatar';
import { LinkToProfile } from '../shared/link-to-profile/link-to-profile';
import { AppRoute } from '../../const';
import { MenuButton } from '../shared/app-buttons/menu-button/menu-button';
import { AdditionalMenu } from '../shared/app-buttons/additional-button/additional-button';
import { BrandIcon } from '../shared/app-icons/brand-icon';
import { SearchIcon } from '../shared/app-icons/search-icon';
import { FeedIcon } from '../shared/app-icons/feed-icon';
import { ChatsIcon } from '../shared/app-icons/chats-icon';

import styles from './app-menu.module.css';

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
        <nav
            className={`${menuClassName} ${isMessenger ? styles.messengerMode : ''}`}
            data-variant={variant}
        >
            <div className={styles.navLinks}>
                <MenuButton
                    to={AppRoute.Main}
                    isActive={location.pathname === AppRoute.Main}
                    className={styles.sidebarOnly}
                >
                    <span className={styles.tabIcon}>
                        <BrandIcon />
                    </span>
                    <span className={styles.tabText}>Studapp</span>
                </MenuButton>

                {variant === 'sidebar' && (
                    <hr
                        className={`${styles.sidebarDivider} ${styles.sidebarOnly}`}
                    />
                )}

                <MenuButton
                    to={AppRoute.Search}
                    isActive={location.pathname === AppRoute.Search}
                >
                    <span className={styles.tabIcon}>
                        <SearchIcon />
                    </span>
                    <span className={styles.tabText}>Поиск</span>
                </MenuButton>

                <MenuButton
                    to={AppRoute.Main}
                    isActive={location.pathname === AppRoute.Main}
                >
                    <span className={styles.tabIcon}>
                        <FeedIcon />
                    </span>
                    <span className={styles.tabText}>Лента</span>
                </MenuButton>

                <MenuButton
                    to={AppRoute.Chats}
                    isActive={location.pathname === AppRoute.Chats}
                >
                    <span className={styles.tabIcon}>
                        <ChatsIcon />
                    </span>
                    <span className={styles.tabText}>Чаты</span>
                </MenuButton>

                <LinkToProfile userOrUsername={currentUser}>
                    <span className={styles.tabIcon}>
                        <ProfileAvatar />
                    </span>
                    <span className={styles.tabText}>Профиль</span>
                </LinkToProfile>

                <AdditionalMenu
                    currentUser={currentUser}
                    variant={variant === 'sidebar' ? 'sidebar' : 'inline'}
                    className={styles.sidebarOnly}
                />
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
