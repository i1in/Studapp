import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function formatSize(bytes) {
    if (bytes < 1024)
        return `${bytes} Б`;
    if (bytes < 1024 * 1024)
        return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}
function ShowFullAttachments({ attachments }) {
    const images = attachments.filter(att => att.mimeType.startsWith('image/'));
    const files = attachments.filter(att => !att.mimeType.startsWith('image/'));
    if (attachments.length === 0) {
        return (_jsx(_Fragment, {}));
    }
    return (_jsx("div", { className: "post-attachments", children: attachments.length > 0 && (_jsxs("div", { className: "attachments-list", children: [images.length > 0 && (_jsx("div", { className: "attachments-img", children: images.map((image) => (_jsx("div", { className: "attachment-item", children: _jsx("a", { className: "attachment-link", href: image.fileUrl, target: "_blank", rel: "noopener noreferrer", children: _jsx("img", { className: "attachment-image", src: image.fileUrl, alt: image.originalName }) }) }, image.id))) })), files.length > 0 && (_jsx("div", { className: "attachments-file", children: files.map((file) => (_jsx("div", { className: "attachment-item", children: _jsxs("div", { className: "attachment-file", children: [_jsx("span", { className: "icon-file", children: file.originalName.split('.')[1].toUpperCase() || 'FILE' }), _jsxs("a", { className: "attachment-link", href: file.fileUrl, download: file.originalName, children: [_jsx("p", { className: "attachment-name", children: file.originalName }), _jsx("p", { className: "attachment-size", children: formatSize(file.size) })] })] }) }, file.id))) }))] })) }));
}
export { ShowFullAttachments };
