import { jsx as _jsx } from "react/jsx-runtime";
function ConvertTime({ time }) {
    if (!time) {
        return null;
    }
    const date = new Date(time);
    const options = {
        timeZone: 'Europe/Moscow',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    };
    return (_jsx("div", { className: "post-timestamp", children: _jsx("p", { className: "timestamp", children: date.toLocaleString('ru-RU', options) }) }));
}
export { ConvertTime };
