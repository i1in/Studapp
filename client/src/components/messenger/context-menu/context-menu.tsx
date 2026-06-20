import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './context-menu.module.css';

interface Props {
    coords: { x: number; y: number; isOpen: boolean };
    onClose: () => void;
    children: React.ReactNode;
}

export function ContextMenu({
    onClose,
    children,
    coords,
}: Props) {
    const { x, y, isOpen } = coords;

    const [shouldRender, setShouldRender] = useState(isOpen);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [isPositioned, setIsPositioned] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        setShouldRender(true);
        setIsPositioned(false);
    }, [isOpen, x, y]);

    useEffect(() => {
        if (!shouldRender || !menuRef.current || isPositioned) return;

        const menu = menuRef.current.getBoundingClientRect();
        const W = window.innerWidth;
        const H = window.innerHeight;
        const GAP = 8;

        // если не влезает справа, открывается левее курсора
        let left = x;
        if (left + menu.width + GAP > W) {
            left = x - menu.width;
        }

        left = Math.max(GAP, left);

        // если не влезает снизу, открывается выше курсора
        let top = y;
        if (top + menu.height + GAP > H) {
            top = y - menu.height;
        }

        top = Math.max(GAP, top);

        setPosition({ top, left });
        setIsPositioned(true);
    }, [shouldRender, isPositioned, x, y]);

    useEffect(() => {
        if (!isOpen) return;

        const handleClose = () => onClose();
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        }

        const timer = setTimeout(() => {
            window.addEventListener('click', handleClose);
            window.addEventListener('keydown', handleKey);
        }, 0);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', handleClose);
            window.removeEventListener('keydown', handleKey);
        };
    }, [isOpen, onClose]);

    const handleAnimationEnd = () => {
        if (!isOpen) setShouldRender(false);
    };

    if (!shouldRender) return null;

    return createPortal(
        <div
            ref={menuRef}
            className={`${styles.menu} ${isOpen ? styles.visible : ''}`}
            role="menu"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                visibility: isPositioned ? 'visible' : 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
            onAnimationEnd={handleAnimationEnd}
        >
            {children}
        </div>,
        document.body
    )
}