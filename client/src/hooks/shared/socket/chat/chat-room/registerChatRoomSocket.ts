import { setHistory } from "../../../../../features/api/messenger/messagesSlice";
import { MessagePayload } from "../../../../../types/chat";
import { AppDispatch } from "../../../../../store/store";
import { socket } from "../../../socket";

export function registerChatRoomListeners(dispatch: AppDispatch) {

    const onHistory = (messages: MessagePayload[]) => {
        console.log(messages);
        dispatch(setHistory(messages));
    };

    socket.on('history', onHistory);

    return () => {
        socket.off('history', onHistory);
    };
}