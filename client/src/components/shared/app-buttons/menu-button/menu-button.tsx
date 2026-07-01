import React from 'react';
import { Link } from 'react-router-dom';
import styles from './menu-button.module.css';

type MenuVariant = 'sidebar' | 'inline' | 'messenger';

interface Props {
    to?: string;
    onClick?: (e: any) => void;
    className?: string;
    icon?: React.ReactNode;
    label: string;
    showText?: boolean;
    isActive?: boolean;
    variant: MenuVariant;
    sidebarOnly?: boolean;
}

export function MenuButton({
    to,
    onClick,
    className,
    icon,
    label,
    showText = true,
    isActive,
    variant,
    sidebarOnly,
}: Props) {
    const isSidebar = variant === 'sidebar';

    const baseClass = [
        styles.tabItem,
        isActive ? styles.active : '',
        isSidebar ? styles.sidebarItem : '',
        sidebarOnly ? styles.sidebarOnly : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const content = (
        <>
            <span className={styles.tabIcon} data-menu-icon>
                {icon}
            </span>

            {showText && (
                <span className={styles.tabText} data-menu-label>
                    {label}
                </span>
            )}
        </>
    );

    if (to) {
        return (
            <Link to={to} className={baseClass}>
                {content}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseClass} type="button">
            {content}
        </button>
    );
}
