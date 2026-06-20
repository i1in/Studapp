import styles from './time-convert.module.css';

export function ConvertTime({ time }: { time: string }) {
    if (!time) return null;

    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    let label: string;

    if (diffSec < 60) {
        label = 'только что';
    } else if (diffMin < 60) {
        label = `${diffMin} ${pluralize(diffMin, 'минуту', 'минуты', 'минут')} назад`;
    } else if (diffHour < 24) {
        label = `${diffHour} ${pluralize(diffHour, 'час', 'часа', 'часов')} назад`;
    } else if (diffDay < 7) {
        label = `${diffDay} ${pluralize(diffDay, 'день', 'дня', 'дней')} назад`;
    } else {
        label = date.toLocaleString('ru-RU', {
            timeZone: 'Europe/Moscow',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <div className={styles.postTimestamp}>
            <span className={styles.timestamp}>{label}</span>
        </div>
    );
}

function pluralize(n: number, one: string, few: string, many: string): string {
    const mod10 = n % 10;
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 14) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}
