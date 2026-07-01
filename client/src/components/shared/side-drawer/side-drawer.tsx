import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { LogoutButton } from '../../shared/app-buttons/logout-button/logout-button';
import { ProfileAvatar } from '../../profile-avatar/profile-avatar';
import { LinkToProfile } from '../../shared/link-to-profile/link-to-profile';
import styles from './side-drawer.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    currentUser: any;
    isLoading: boolean;
}

export function SideDrawer({ isOpen, onClose, currentUser, isLoading }: Props) {
    return createPortal(
        <>
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={onClose}
            />
            <aside
                className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
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
                        <span className={styles.userStatus}>В сети</span>
                    </div>
                </div>

                <div className={styles.drawerContent}>
                    <LinkToProfile
                        userOrUsername={currentUser}
                        className={styles.drawerItem}
                    >
                        <ProfileAvatar />
                        <span className={styles.drawerText}>Мой профиль</span>
                    </LinkToProfile>
                    <Link to="/settings" className={styles.drawerItem}>
                        <span className={styles.drawerIcon}>⚙️</span>
                        <span className={styles.drawerText}>Настройки</span>
                    </Link>
                    <div className={styles.drawerDivider} />
                    <div className={styles.drawerFooter}>
                        <LogoutButton danger={true} />
                    </div>
                </div>
            </aside>
        </>,
        document.body,
    );
}
