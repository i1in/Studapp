// components/messenger/chat-menu/chat-menu.tsx
import { useState } from "react";
import { ProfileButton } from "../../profile-button/profile-button";
import { LogoutButton } from "../../logout/logout";
import { useGetProfileByIdQuery } from "../../../features/api/user/userApi"; 
import styles from './chat-menu.module.css';

interface Props {
    menuClassName: string; // Принимает внешнее состояние видимости (mobileHidden)
}

export function ChatMenu({ menuClassName }: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { data: currentUser, isLoading } = useGetProfileByIdQuery();

    return (
        // Объединяем класс скрытия и наш новый изолированный класс панели
        <nav className={`${menuClassName} ${styles.messengerNav}`}>
            
            {/* Кнопка-гамбургер «три полоски» */}
            <button className={styles.hamburgerBtn} onClick={() => setIsDrawerOpen(true)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
            </button>

            {/* Внутренние ссылки вкладок */}
            <div className={styles.navLinks}>
                <a href="/search" className={styles.navItem}>
                    <span className={styles.navIcon}>
                        <svg width="24px" height="24px" viewBox="0 0 1024 1024" fill="currentColor"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z"></path></svg>
                    </span>
                    <span className={styles.navLabel}>Поиск</span>
                </a>
                
                <a href="/feed" className={styles.navItem}>
                    <span className={styles.navIcon}>
                        <svg fill="currentColor" width="32px" height="24px" viewBox="0 0 92 92"><path d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z"></path></svg>
                    </span>
                    <span className={styles.navLabel}>Лента</span>
                </a>
                
                {/* Чтобы ProfileButton подцепил стили, обернем его в наш класс или передадим пропсы, если нужно */}
                <div className={styles.navItem}>
                    <ProfileButton active={false} />
                </div>
            </div>

            {/* Выдвижная шторка настроек (Drawer) */}
            <div 
                className={`${styles.overlay} ${isDrawerOpen ? styles.overlayVisible : ''}`} 
                onClick={() => setIsDrawerOpen(false)} 
            />
            
            <aside className={`${styles.drawer} ${isDrawerOpen ? styles.drawerOpen : ''}`}>
                <div className={styles.drawerHeader}>
                    <div className={styles.userAvatar}>
                        {currentUser?.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt="" />
                        ) : (
                            <div className={styles.avatarFallback}>
                                {currentUser?.firstName ? currentUser.firstName[0].toUpperCase() : '?'}
                            </div>
                        )}
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
                    <a href={`/profile/${currentUser?.username}`} className={styles.drawerItem}>
                        <span className={styles.drawerIcon}>👤</span>
                        <span className={styles.drawerText}>Мой профиль</span>
                    </a>
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
