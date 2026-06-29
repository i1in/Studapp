import { Link } from 'react-router-dom';
import styles from './menu-button.module.css';
import React from 'react';

interface Props {
    to?: string;
    onClick?: (e: any) => void;
    className?: string;
    label?: string;
    showText?: boolean;
    isActive?: boolean;
    children: React.ReactNode;
}

export function MenuButton({
    to,
    onClick,
    className,
    label,
    showText = true,
    isActive,
    children,
}: Props) {
    const baseClass = [
        styles.tabItem,
        isActive ? styles.active : '',
        className || '',
    ]
        .filter(Boolean)
        .join(' ');

    console.log(isActive);

    if (to) {
        return (
            <Link to={to} className={baseClass}>
                {children}
                {showText && <span className={styles.tabText}>{label}</span>}
            </Link>
        );
    }

    return (
        <button onClick={onClick} className={baseClass} type="button">
            {children}
            {showText && <span className={styles.tabText}>{label}</span>}
        </button>
    );
}
