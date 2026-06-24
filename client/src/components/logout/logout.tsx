import { useDispatch } from 'react-redux';
import { logout } from '../../features/api/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/api/auth/authApi';

interface Props {
    role?: 'menuitem' | null;
    danger: boolean;
}

export function LogoutButton({ role, danger }: Props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutUser] = useLogoutMutation();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
        navigate('/login');
    };

    return (
        <button
            {...(role && { 'role': `${role}` })}
            {...(danger && { 'data-danger': 'true' })}
            onClick={handleLogout}
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
                <path d="M10 3H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/>
                <path d="M15 17l5-5-5-5" />
                <path d="M8 12h12" />

            </svg>
            Выйти
        </button>
    );
}
