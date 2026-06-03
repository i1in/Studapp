import styles from './chat-hello.module.css';

export function ChatHello() {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeBox}>
                <div className={styles.welcomeIcon}>👋</div>
                <span className={styles.welcomeTitle}>Начало диалога</span>
                <p className={styles.welcomeText}>
                    Напишите сообщение для начала диалога
                </p>
            </div>
        </div>
    )
}