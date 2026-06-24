import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/shared/app-layout/app-layout';
import { Loader } from '../../components/shared/loader-circle/loader-circle';

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
};

type NewUserData = {
    user: NewUser;
};

const FACULTIES = [
    { value: 'ivmiit', label: 'ИВМиИТ' },
    { value: 'itis', label: 'ИТиИС' },
    { value: 'iir', label: 'ИМО' },
    { value: 'imef', label: 'ИУЭФ' },
    { value: 'ifmb', label: 'ИФМБ' },
    { value: 'ignt', label: 'ИГНТ' },
    { value: 'iec', label: 'ИЭиЦ' },
];

const ROLES = [
    { value: 'student', label: 'Студент' },
    { value: 'teacher', label: 'Преподаватель' },
    { value: 'admin', label: 'Админ' },
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
    const [registerSuccessData, setRegisterSuccessData] =
        useState<NewUser | null>(null);

    const navigate = useNavigate();

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/admin', {
                credentials: 'include',
            });

            if (res.status === 401) {
                navigate('/');
                throw new Error(`Ошибка сервера: ${res.status}`);
            }

            const data = await res.json();

            if (data && data.user === null) {
                navigate('/feed');
                return;
            }

            setUsers(Array.isArray(data) ? data : []);
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
                },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    firstName,
                    lastName,
                    faculty,
                    role,
                }),
            });

            if (res.status === 403) {
                throw new Error('Доступ запрещён');
            }
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(
                    errData.message || `Ошибка сервера: ${res.status}`,
                );
            }

            const response: NewUserData = await res.json();

            setRegisterSuccess('Пользователь успешно зарегистрирован.');
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

    if (isLoading) return <Loader />;

    return (
        <AppLayout title="Админ-панель" hasBack fallbackTo="/feed">
            <div className="admin-panel" style={{ padding: '1rem' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <h3
                        className="admin-subtitle"
                        style={{ marginBottom: '1rem' }}
                    >
                        Завести в систему нового студента
                    </h3>
                    <form
                        className="admin-form"
                        onSubmit={handleRegister}
                        style={{ maxWidth: '400px' }}
                    >
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Email*:
                                <br />
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
                                Имя*:
                                <br />
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    required
                                    style={{ width: '100%', padding: '0.4rem' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Фамилия*:
                                <br />
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    required
                                    style={{ width: '100%', padding: '0.4rem' }}
                                />
                            </label>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <label>
                                Факультет*:
                                <br />
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
                                Роль*:
                                <br />
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
                            <p style={{ color: 'red', marginTop: '0.5rem' }}>
                                {registerError}
                            </p>
                        )}
                        {registerSuccess && (
                            <p style={{ color: 'green', marginTop: '0.5rem' }}>
                                {registerSuccess}
                            </p>
                        )}
                        {registerSuccessData && (
                            <div
                                style={{
                                    color: 'green',
                                    marginTop: '0.5rem',
                                    padding: '0.5rem',
                                    border: '1px solid green',
                                    borderRadius: '4px',
                                }}
                            >
                                <p>
                                    <strong>Email:</strong>{' '}
                                    {registerSuccessData.email}
                                </p>
                                <p>
                                    <strong>Пароль:</strong>{' '}
                                    {registerSuccessData.password}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                marginTop: '1rem',
                                padding: '0.5rem 1rem',
                                cursor: 'pointer',
                            }}
                        >
                            Зарегистрировать
                        </button>
                    </form>
                </section>
            </div>
        </AppLayout>
    );
}
