import { useNavigate } from 'react-router-dom';

function AdminButton() {
    const navigate = useNavigate();
    

    const handleRedirect = () => {
        navigate('/admin');
    };

    return (
        <button
            className="logout"
            style={{backgroundColor: '#202020'}}
            onClick={handleRedirect}>
            <p className="logout-text">
                Админ-панель
            </p>
        </button>
    );
}

export { AdminButton };