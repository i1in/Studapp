type Attachment = {
    id: number;
    fileUrl: string;
    filename: string;
    mimeType: string;
    originalName: string;
    size: number;
};

interface ShowFullAttachmentsProps {
    attachments: Attachment[];
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} Б`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function ShowFullAttachments({ attachments }: ShowFullAttachmentsProps): JSX.Element {
    const images = attachments.filter(att => att.mimeType.startsWith('image/'));
    const files = attachments.filter(att => !att.mimeType.startsWith('image/'));

    if (attachments.length === 0) {
        return (<></>)
    }

    return (
        <div className="post-attachments">
            {attachments.length > 0 && (
                <div className="attachments-list">
                    {images.length > 0 && (
                        <div className="attachments-img">
                            {images.map((image) => (
                                <div key={image.id} className="attachment-item">
                                    <a
                                        className="attachment-link"
                                        href={image.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            className="attachment-image"
                                            src={image.fileUrl}
                                            alt={image.originalName}
                                        />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                    {files.length > 0 && (
                        <div className="attachments-file">
                            {files.map((file) => (
                                <div key={file.id} className="attachment-item">
                                    <div className="attachment-file">
                                        <span className="icon-file">
                                            {file.originalName.split('.')[1].toUpperCase() || 'FILE'}
                                        </span>
                                        <a
                                            className="attachment-link"
                                            href={file.fileUrl}
                                            download={file.originalName}
                                        >
                                            <p className="attachment-name">{file.originalName}</p>
                                            <p className="attachment-size">{formatSize(file.size)}</p>
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export { ShowFullAttachments }