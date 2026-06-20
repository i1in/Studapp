import { useState, useCallback, useEffect } from 'react';

let currentCloseMenu: (() => void) | null = null;

export function useContextMenu() {
    const [coords, setCoords] = useState({ x: 0, y: 0, isOpen: false });

    const close = useCallback(() => {
        setCoords(prev => ({ ...prev, isOpen: false }));
    }, []);

    const onContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        if (currentCloseMenu && currentCloseMenu !== close) {
            currentCloseMenu();
        }

        currentCloseMenu = close;

        setCoords({ x: e.clientX, y: e.clientY, isOpen: true });
    }, []);

    useEffect(() => {
        return () => {
            if (currentCloseMenu === close) {
                currentCloseMenu = null;
            }
        }
    }, [close])

    return { onContextMenu, close, coords };
}