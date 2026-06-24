import styles from './loader-circle.module.css';

interface Props {
    className?: string;
}

export function Loader({ className }: Props) {
    return (
        <div className={`${styles.loader} ${className ?? ''}`}>
            <div className={styles.spinner} />
        </div>
    )
}
