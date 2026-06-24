import { useNavigate } from 'react-router-dom';

interface Props {
    role?: 'menuitem' | null;
    danger: boolean;
}

export function AdminButton({ role, danger }: Props) {
    const navigate = useNavigate();


    const handleRedirect = () => {
        navigate('/admin');
    };

    return (
        <button
            {...(role && { 'role': `${role}` })}
            {...(danger && { 'data-danger': 'true' })}
            onClick={handleRedirect}
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '8px' }}

            >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <path d="M8 8l2 2-2 2" />
                <path d="M12 12h4" />
            </svg>
            Админ-панель
        </button>
    );
}