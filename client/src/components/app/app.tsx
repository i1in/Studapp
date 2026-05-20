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

import { useSocket } from "../../hooks/useSocket";
import { connectSocket } from '../../hooks/shared/socket';
import { usePresence } from "../../hooks/usePresence";

function App(): JSX.Element {
    const authorizationStatus = useAppSelector(selectAuthorizationStatus);
    const dispatch = useAppDispatch();
    usePresence();
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const socket = useSocket();
    
    const user = useAppSelector(state => state.messenger.users[2]); // убрать
    console.log(user); // убрать

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) dispatch(setToken(token));
        setIsAuthLoaded(true);

        connectSocket();

        socket.emitJoinChat(1); // убрать
        socket.emitSendTyping(1, true); // убрать
        socket.emitToggleHidden(false); // убрать
    }, [dispatch]);

    if (!isAuthLoaded) return <div>LOADING</div>;

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