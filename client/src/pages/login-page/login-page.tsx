import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { setToken } from '../../features/api/auth/authSlice';
import { Logo } from '../../components/logo/logo';
import { ErrorMessage } from '../../components/error-message/error-message';
import { useLoginMutation } from '../../features/api/auth/authApi';
import { AppRoute } from '../../const';

interface ApiError {
    status: number;
    data: {
        message?: string;
    };
}

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'data' in error
    );
}

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const [getToken, { isLoading }] = useLoginMutation();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const finalEmail = email;
            const finalPassword = password;

            const response = await getToken({
                email: finalEmail,
                password: finalPassword,
            }).unwrap();

            console.log('SUCCESS: ', response);

            localStorage.setItem('token', response.token);

            dispatch(setToken(response.token));

            navigate(AppRoute.Main);
        } catch (error) {
            if (isApiError(error)) {
                const message = error.data?.message || 'UNKNOWN_ERROR';

                setErrorMsg(message);
                console.log('ERROR: ' + message);
            }
        }
    };

    return (
        <>
            <header className="header">
                <div className="header__wrapper">
                    <div className="header__left">
                        <Logo />
                    </div>
                </div>
            </header>
            <div className="page">
                <div className="container">
                    <div className="login-wrapper">
                        <div className="login-image">
                            <img src="img/login_image.jpg" alt="login_image" />
                        </div>
                        <div className="login-form__main">
                            <div className="login-form__labels">
                                <p className="login-form__title">Логин</p>
                                <p className="login-form__subtitle">
                                    Вход в форум для студентов
                                </p>
                            </div>
                            <form
                                className="login-form"
                                onSubmit={handleSubmit}
                            >
                                <input
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                {errorMsg && <ErrorMessage error={errorMsg} />}
                                <button type="submit" disabled={isLoading}>
                                    Войти
                                </button>
                                <p className="login_tip">
                                    <span style={{ color: 'red' }}>(!) </span>
                                    Используйте выданные данные
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
                <footer className="footer">
                    <p>© 2026</p>
                </footer>
            </div>
        </>
    );
}

export default LoginPage;
