import { setHistory } from "../../../../../features/api/messenger/messagesSlice";
import { AppDispatch } from "../../../../../store/store";
import { socket } from "../../../socket";

export function registerChatRoomListeners(dispatch: AppDispatch) {

    const onHistory = (messages: MessagePayload[]) => {
        console.log(messages);
        dispatch(setHistory(messages));
    };

    socket.on('history', onHistory);

    // socket.onAny((event, data) => {
    //     console.log('[SOCKET EVENT]', event, data);
    //     console.log('SOCKET ID:', socket.id);
    // });

    return () => {
        socket.off('history', onHistory);
    };
}