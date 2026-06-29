import { useState } from 'react';
import { AppMenu } from '../../app-menu/app-menu';
import styles from './app-layout.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { BackIcon } from '../app-icons/back-icon';

interface Props {
    title?: string;
    headerExtra?: React.ReactNode;
    padded?: boolean;
    hasBack?: boolean;
    fallbackTo?: string;
    children: React.ReactNode;
}

export function AppLayout({
    title,
    headerExtra,
    padded = true,
    hasBack = false,
    fallbackTo = '/',
    children,
}: Props) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const from = location.state?.from;

        if (from) {
            navigate(-1);
        } else {
            navigate(fallbackTo);
        }
    };

    return (
        <>
            <div className={styles.layout}>
                {title && (
                    <header className={styles.header}>
                        <div className={styles.headerLeft}>
                            {hasBack && (
                                <button
                                    className={styles.backBtn}
                                    onClick={handleBack}
                                >
                                    <BackIcon />
                                </button>
                            )}
                            <span className={styles.title}>{title}</span>
                        </div>
                        {headerExtra && (
                            <div
                                className={`${styles.headerExtra} ${styles.headerExtraMobile}`}
                            >
                                {headerExtra}
                            </div>
                        )}
                    </header>
                )}

                <div
                    className={`${styles.content} ${padded ? styles.padded : ''}`}
                >
                    {children}
                </div>
            </div>

            <AppMenu
                variant="sidebar"
                isDrawerOpen={isDrawerOpen}
                onOpenDrawer={() => setIsDrawerOpen(true)}
                onCloseDrawer={() => setIsDrawerOpen(false)}
            />
        </>
    );
}
