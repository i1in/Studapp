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
import { OptionIcon } from '../shared/app-icons/option-icon';

type MenuVariant = 'sidebar' | 'inline' | 'messenger';

interface Props {
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
    onOpenDrawer: () => void;
    hideOnMobile?: boolean;
    variant?: MenuVariant;
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

    const isChatsPage = location.pathname === AppRoute.Chats;

    const menuClassName = [
        styles.bottomBar,
        hideOnMobile ? styles.mobileHidden : '',
        variant === 'inline' ? styles.floatingInline : styles.floating,
        variant === 'sidebar' ? styles.sidebarVariant : '',
        variant === 'messenger' ? styles.messengerMode : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <nav className={`${menuClassName}`} data-variant={variant}>
            <div className={styles.navLinks}>
                <MenuButton
                    to={AppRoute.Main}
                    icon={<BrandIcon />}
                    label="Studapp"
                    variant={variant}
                    sidebarOnly
                />

                {variant === 'sidebar' && (
                    <hr
                        className={`${styles.sidebarDivider} ${styles.sidebarOnly}`}
                    />
                )}

                <MenuButton
                    to={AppRoute.Search}
                    isActive={location.pathname === AppRoute.Search}
                    icon={<SearchIcon />}
                    label="Поиск"
                    variant={variant}
                />

                <MenuButton
                    to={AppRoute.Main}
                    isActive={location.pathname === AppRoute.Main}
                    icon={<FeedIcon />}
                    label="Лента"
                    variant={variant}
                />

                <MenuButton
                    to={AppRoute.Chats}
                    isActive={location.pathname === AppRoute.Chats}
                    icon={<ChatsIcon />}
                    label="Чаты"
                    variant={variant}
                />

                <MenuButton
                    to={`/${currentUser?.username}`}
                    icon={<ProfileAvatar />}
                    label="Профиль"
                    variant={variant}
                />

                <AdditionalMenu
                    currentUser={currentUser}
                    icon={<OptionIcon />}
                    label="Опции"
                    variant={variant}
                    className={styles.sidebarOnly}
                />
            </div>
        </nav>
    );
}
