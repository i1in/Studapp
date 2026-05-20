import { onlineUsers } from "./presence.store.js";

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const AWAY_TIME    = 15 * 60 * 1000; // 15 minutes

export function statePresenceWatcher() {
    setInterval(() => {
        const now = Date.now();

        for (const [userId, state] of onlineUsers.entries()) {

            if (state.hideOnline) {
                state.status = 'hidden';
                continue;
            }

            const diff = now - state.lastActivity;

            if (diff >= AWAY_TIME) {
                state.status = 'away';
            } else if (diff >= IDLE_TIMEOUT) {
                state.status = 'idle';
            } else {
                state.status = 'online';
            }
        }
    }, 10000);
}