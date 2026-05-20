import { useEffect } from "react";
import { useSocket } from "./useSocket";

export function usePresence() {
    const socket = useSocket();

    useEffect(() => {
        const handleVisibilityChange = () => {
            const status = document.visibilityState === 'visible' ? 'online' : 'offline';

            socket.emitPresenceState(status);
        };

        document.addEventListener(
            'visibilitychange', handleVisibilityChange
        );

        handleVisibilityChange();

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, []);
}