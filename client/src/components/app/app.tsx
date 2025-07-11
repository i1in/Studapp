import MainPage from "../../pages/main-page/main-page"
import ProfilePage from "../../pages/profile-page/profile-page";
import LoginPage from "../../pages/login-page/login-page";
import PostPage from "../../pages/post-page/post-page";
import NotFound from "../../pages/not-found/not-found";
import UserSearchPage from "../../pages/search-page/search-page";
import AdminPage from '../../pages/admin-page/admin-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute, AuthorizationStatus } from '../../const'
import React, { useState, useEffect } from "react";
import { PrivateRoute } from '../../components/private-route/private-route';
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setToken, selectAuthorizationStatus } from '../../features/api/auth/authSlice';

function App(): JSX.Element {
    const authorizationStatus = useAppSelector(selectAuthorizationStatus);
    const dispatch = useAppDispatch();
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) dispatch(setToken(token));
        setIsAuthLoaded(true);
    }, [dispatch]);

    if (!isAuthLoaded) return null;

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
                <Route path={AppRoute.Login} element={
                    localStorage.getItem('token') 
                    ? <Navigate to={AppRoute.Main} replace /> 
                    : <LoginPage />
                } />
                <Route
                    path={`${AppRoute.Post}/:id`}
                    element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <PostPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path={AppRoute.Search} element={
                        <PrivateRoute authorizationStatus={authorizationStatus}>
                            <UserSearchPage />
                        </PrivateRoute>
                    }
                />
                <Route path={AppRoute.Admin} element={
                    <PrivateRoute authorizationStatus={authorizationStatus}>
                        <AdminPage />
                    </PrivateRoute>
                } />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export { App };