import { MenuButton } from '../menu-button/menu-button';
import { ContextMenu } from '../../../messenger/context-menu/context-menu';
import { useContextMenu } from '../../../../hooks/useContextMenu';
import { AdminButton } from '../../app-buttons/admin-button/admin-button';
import { LogoutButton } from '../../app-buttons/logout-button/logout-button';
import styles from './additional-button.module.css';
import { OptionIcon } from '../../app-icons/option-icon';

type MenuVariant = 'sidebar' | 'inline' | 'messenger';

interface Props {
    currentUser: any;
    icon?: React.ReactNode;
    label: string;
    variant?: MenuVariant;
    className?: string;
}

export function AdditionalMenu({
    currentUser,
    variant,
    className,
    icon,
    label,
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
            <MenuButton
                icon={icon}
                label={label}
                onClick={handleTrigger}
                className={itemClass}
                variant={variant === 'sidebar' ? 'sidebar' : 'inline'}
                sidebarOnly
            />

            <ContextMenu onClose={close} coords={coords}>
                {currentUser?.role === 'admin' && (
                    <AdminButton role="menuitem" danger={false} />
                )}
                <LogoutButton role="menuitem" danger={true} />
            </ContextMenu>
        </>
    );
}
