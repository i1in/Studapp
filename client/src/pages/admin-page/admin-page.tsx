import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/logo/logo';
import { ProfileAvatar } from '../../components/profile-avatar/profile-avatar';

type User = {
    id: number;
    username: string;
    isAdmin: boolean;
};

type NewUser = {
    id: number;
    email: string;
    publicId: string;
    role: string;
    faculty: string;
    password: string;
}

type NewUserData = {
    user: NewUser;
}

const FACULTIES = [
    { value: 'ivmiit', label: 'ИВМиИТ' },
    { value: 'itis', label: 'ИТиИС' },
    { value: 'iir', label: 'ИМО' },
    { value: 'imef', label: 'ИУЭФ' },
    { value: 'ifmb', label: 'ИФМБ' },
    { value: 'ignt', label: 'ИГНТ' },
    { value: 'iec', label: 'ИЭиЦ' }
];

const ROLES = [
    { value: 'student', label: 'Студент' },
    { value: 'teacher', label: 'Преподаватель' },
    { value: 'admin', label: 'Админ' }
];

export default function AdminPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [faculty, setFaculty] = useState(FACULTIES[0].value);
    const [role, setRole] = useState(ROLES[0].value);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);
    const [registerSuccessData, setRegisterSuccessData] = useState<NewUser | null>(null);

    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/admin', {
                headers: { Authorization: `Bearer ${token}` }
            });

            const response = await res.json()
            if (response.user === null) {
                navigate('/feed');
            }

            if (res.status === 401) {
                navigate('/');
                throw new Error(`Ошибка сервера: ${res.status}`);
            }
            const data: User[] = await res.json();
            setUsers(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError(null);
        setRegisterSuccess(null);

        if (!email || !firstName || !lastName) {
            setRegisterError('Заполните все обязательные поля');
            return;
        }

        try {
            const res = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    faculty,
                    role
                })
            });

            if (res.status === 403) {
                throw new Error('Доступ запрещён');
            }
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || `Ошибка сервера: ${res.status}`);
            }

            const response: NewUserData = await res.json();

            setRegisterSuccess('Студент зарегистрирован.');
            setRegisterSuccessData(response.user);
            setEmail('');
            setFirstName('');
            setLastName('');
            setFaculty(FACULTIES[0].value);
            setRole(ROLES[0].value);

            fetchUsers();
        } catch (e: any) {
            setRegisterError(e.message);
        }
    };

    return (
        <div className="page">
            <header className="header">
                <div className="header__wrapper">
                    <div className="header__left">
                        <Logo />
                    </div>
                </div>
            </header>

            <div className="layout">
                <nav className="menu">
                    <a href="/search" className="menu-item">
                        <span className="icon">
                            <svg width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z" fill="currentColor"></path></g></svg>
                        </span>
                        <span className="label">Поиск</span>
                    </a>
                    <a href="/feed" className="menu-item">
                        <span className="icon">
                            <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="32px"
                                height="24px" viewBox="0 0 92 92" enableBackground="new 0 0 92 92" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path id="XMLID_1210_"
                                        d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                        <span className="label">Лента</span>
                    </a>
                    <ProfileAvatar />
                </nav>
                <main className="content">
                    <div className="admin-panel" style={{ padding: '1rem' }}>
                        <h2 className="admin-title">Админ-панель</h2>

                        <section style={{ marginBottom: '2rem' }}>
                            <h3 className="admin-subtitle">Зарегистрировать нового пользователя</h3>
                            <form className="admin-form" onSubmit={handleRegister} style={{ maxWidth: '400px' }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        Email*:<br />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.4rem' }}
                                        />
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        Имя*:<br />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.4rem' }}
                                        />
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        Фамилия*:<br />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.4rem' }}
                                        />
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        Факультет*:<br />
                                        <select
                                            value={faculty}
                                            onChange={(e) => setFaculty(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.4rem' }}
                                        >
                                            {FACULTIES.map((f) => (
                                                <option key={f.value} value={f.value}>
                                                    {f.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <label>
                                        Роль*:<br />
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            required
                                            style={{ width: '100%', padding: '0.4rem' }}
                                        >
                                            {ROLES.map((r) => (
                                                <option key={r.value} value={r.value}>
                                                    {r.label}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                </div>
                                {registerError && (
                                    <p style={{ color: 'red', marginTop: '0.5rem' }}>{registerError}</p>
                                )}
                                {registerSuccess && (
                                    <p style={{ color: 'green', marginTop: '0.5rem' }}>{registerSuccess}</p>
                                )}
                                {registerSuccessData && (
                                    <div style={{ color: 'green', marginTop: '0.5rem' }}>
                                        <p>Email: {registerSuccessData.email}</p>
                                        <p>Password: {registerSuccessData.password}</p>
                                    </div>
                                )}
                                <button type="submit" style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
                                    Зарегистрировать
                                </button>
                            </form>
                        </section>

                    </div>
                </main>
            </div>
        </div>
    );
}
