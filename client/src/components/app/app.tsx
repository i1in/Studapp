import MainPage from '../../pages/main-page/main-page';
import ProfilePage from '../../pages/profile-page/profile-page';
import LoginPage from '../../pages/login-page/login-page';
import PostPage from '../../pages/post-page/post-page';
import NotFound from '../../pages/not-found/not-found';
import UserSearchPage from '../../pages/search-page/search-page';
import AdminPage from '../../pages/admin-page/admin-page';
import MessengerPage from '../../pages/messenger-page/messenger-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const';
import { useState, useEffect } from 'react';
import { PrivateRoute } from '../../components/private-route/private-route';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
    setToken,
    logout,
    selectAuthorizationStatus,
} from '../../features/api/auth/authSlice';
import { useRefreshMutation } from '../../features/api/auth/authApi';

import { usePresence } from '../../hooks/usePresence';
import { useCoreSocket } from '../../hooks/shared/socket/core/useCoreSocket';

function App(): JSX.Element {
    const authorizationStatus = useAppSelector(selectAuthorizationStatus);
    const dispatch = useAppDispatch();
    usePresence();
    useCoreSocket();

    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const [refresh] = useRefreshMutation();

    useEffect(() => {
        const tryRefresh = async () => {
            try {
                const result = await refresh().unwrap();
                dispatch(setToken(result.token));
            } catch (error) {
                dispatch(logout());
            } finally {
                setIsAuthLoaded(true);
            }
        };

        tryRefresh();
    }, [dispatch]);

    if (!isAuthLoaded) return <div></div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path={AppRoute.Redirect}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <MainPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Main}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <MainPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Profile}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <ProfilePage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Login}
                    element={
                        authorizationStatus === AuthorizationStatus.Auth ? (
                            <Navigate to={AppRoute.Main} replace />
                        ) : (
                            <LoginPage />
                        )
                    }
                />
                <Route
                    path={`${AppRoute.Post}/:id`}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <PostPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Search}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <UserSearchPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Admin}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <AdminPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Chats}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <MessengerPage />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export { App };
