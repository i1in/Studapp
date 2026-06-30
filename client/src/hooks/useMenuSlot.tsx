import React, { createContext, useContext, useState, useCallback } from 'react';

const MenuSlotContext = createContext<{
    slot: HTMLElement | null;
    setSlot: (el: HTMLElement | null) => void;
}>({ slot: null, setSlot: () => {} });

export function MenuSlotProvider({ children }: { children: React.ReactNode }) {
    const [slot, setSlot] = useState<HTMLElement | null>(null);

    const setSlotCallback = useCallback((el: HTMLElement | null) => {
        setSlot(el);
    }, []);

    return (
        <MenuSlotContext.Provider value={{ slot, setSlot: setSlotCallback }}>
            {children}
        </MenuSlotContext.Provider>
    );
}

export const useMenuSlot = () => useContext(MenuSlotContext);
