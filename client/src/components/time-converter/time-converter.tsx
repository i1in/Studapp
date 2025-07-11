function ConvertTime({ time }: { time: string }) {
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

    return (
        <div className="post-timestamp">
            <p className="timestamp">
                {date.toLocaleString('ru-RU', options)}
            </p>
        </div>
    );
}

export { ConvertTime };