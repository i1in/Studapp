import { MenuButton } from '../menu-button/menu-button';
import { ContextMenu } from '../../../messenger/context-menu/context-menu';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { AdminButton } from '../../app-buttons/admin-button/admin-button';
import { LogoutButton } from '../../app-buttons/logout-button/logout-button';
import styles from './additional-button.module.css';
import { OptionIcon } from '../../app-icons/option-icon';

interface Props {
    currentUser: any;
    variant?: 'sidebar' | 'inline';
    className?: string;
    showText?: boolean;
}

export function AdditionalMenu({
    currentUser,
    variant,
    className,
    showText = true,
}: Props) {
    const { onContextMenu, close, coords } = useContextMenu();

    const itemClass =
        variant === 'sidebar'
            ? `${styles.sidebarItem} ${className || ''}`
            : `${styles.inlineItem} ${className || ''}`;

    const handleTrigger = (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenu(e as any);
    };

    return (
        <>
            <MenuButton onClick={handleTrigger} className={itemClass}>
                <span className={styles.tabIcon}>
                    <OptionIcon />
                </span>
                {showText && <span className={styles.tabText}>Опции</span>}
            </MenuButton>

            <ContextMenu onClose={close} coords={coords}>
                {currentUser?.role === 'admin' && (
                    <AdminButton role="menuitem" danger={false} />
                )}
                <LogoutButton role="menuitem" danger={true} />
            </ContextMenu>
        </>
    );
}
