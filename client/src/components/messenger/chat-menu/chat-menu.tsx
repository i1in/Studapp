import { LogoutButton } from "../../logout/logout";
import { useGetProfileByIdQuery } from "../../../features/api/user/userApi";
import styles from './chat-menu.module.css';
import { ProfileAvatar } from "../../profile-avatar/profile-avatar";
import { LinkToProfile } from "../../shared/link-to-profile/link-to-profile";

interface Props {
    isChatActive: boolean;
    isDrawerOpen: boolean;
    onCloseDrawer: () => void;
}

export function ChatMenu({ isChatActive, isDrawerOpen, onCloseDrawer }: Props) {
    const { data: currentUser, isLoading } = useGetProfileByIdQuery();

    const menuClassName = `${styles.bottomBar} ${isChatActive ? styles.mobileHidden : ''}`;

    return (
        <nav className={menuClassName}>

            <div className={styles.navLinks}>
                <button
                    className={styles.tabItem}
                >
                    <span className={styles.tabIcon}>
                        <svg width="22" height="22" viewBox="0 0 1024 1024" fill="currentColor"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z"></path></svg>
                    </span>
                </button>

                <a href="/feed" className={styles.tabItem}>
                    <span className={styles.tabIcon}>
                        <svg fill="currentColor" width="28" height="22" viewBox="0 0 92 92"><path d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z"></path></svg>
                    </span>
                </a>

                <LinkToProfile userOrUsername={currentUser} className={styles.tabItem}>
                    <span className={styles.tabIcon}>
                        <ProfileAvatar />
                    </span>
                </LinkToProfile>
            </div>

            <div className={`${styles.overlay} ${isDrawerOpen ? styles.overlayVisible : ''}`} onClick={onCloseDrawer} />
            <aside className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <div className={styles.userAvatar}>
                        <ProfileAvatar />
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>
                            {isLoading
                                ? 'Загрузка...'
                                : `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`.trim() || 'Пользователь'
                            }
                        </span>
                        <span className={styles.userStatus}>В сети</span>
                    </div>
                </div>

                <div className={styles.drawerContent}>
                    <LinkToProfile userOrUsername={currentUser} className={styles.drawerItem}>
                        <ProfileAvatar />
                        <span className={styles.drawerText}>Мой профиль</span>
                    </LinkToProfile>
                    <a href="/settings" className={styles.drawerItem}>
                        <span className={styles.drawerIcon}>⚙️</span>
                        <span className={styles.drawerText}>Настройки</span>
                    </a>
                    <div className={styles.drawerDivider} />
                    <div className={styles.drawerFooter}>
                        <LogoutButton />
                    </div>
                </div>
            </aside>
        </nav>
    );
}