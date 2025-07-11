type AttachmentBlock = {
    postId: number;
    username: string;
    attachmentsCount: number;
    attachmentsTotalSize: number;
}

function getAttachmentWord(count: number): string {
    if (count % 100 >= 11 && count % 100 <= 14) {
        return 'вложений';
    }

    switch (count % 10) {
        case 1:
            return 'вложение';
        case 2:
        case 3:
        case 4:
            return 'вложения';
        default:
            return 'вложений';
    }
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function ShowAttachmentBlock({ postId, username, attachmentsCount, attachmentsTotalSize }: AttachmentBlock) {
    return (
        <a href={`${username}/post/${postId}`} className="post-content__url">
            <div className="post-content__attachments">
                <div className="attachment-preview">
                    <svg width="28px" height="28px" viewBox="-1.5 -1.5 18.00 18.00" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"
                            stroke="#CCCCCC" strokeWidth="0.09"></g>
                        <g id="SVGRepo_iconCarrier">
                            <path
                                d="M0.5 0V4.5C0.5 5.60457 1.39543 6.5 2.5 6.5C3.60457 6.5 4.5 5.60457 4.5 4.5V1.5C4.5 0.947715 4.05228 0.5 3.5 0.5C2.94772 0.5 2.5 0.947715 2.5 1.5V5M6 0.5H12.5C13.0523 0.5 13.5 0.947715 13.5 1.5V13.5C13.5 14.0523 13.0523 14.5 12.5 14.5H2.5C1.94772 14.5 1.5 14.0523 1.5 13.5V8M11 4.5H7M11 7.5H7M11 10.5H4"
                                stroke="currentColor"></path>
                        </g>
                    </svg>
                </div>
                <div className="attachment-details">
                    <p className="attachment-details__title">
                        {`${attachmentsCount} ${getAttachmentWord(attachmentsCount)}, ${formatSize(attachmentsTotalSize)}`}
                    </p>
                    <p className="attachment-details__direct">Перейти &gt;</p>
                </div>
            </div>
        </a>
    );
}

export { ShowAttachmentBlock };