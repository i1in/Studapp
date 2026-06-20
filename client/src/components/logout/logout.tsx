import { useDispatch } from 'react-redux';
import { logout } from '../../features/api/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../features/api/auth/authApi';

function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [logoutUser] = useLogoutMutation();

    const handleLogout = async () => {
        await logoutUser();
        dispatch(logout());
        navigate('/login');
    };

    return (
        <button className="logout" onClick={handleLogout}>
            <p className="logout-text">Выйти</p>
        </button>
    );
}

export { LogoutButton };
