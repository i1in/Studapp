import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import MainPage from "../../pages/main-page/main-page";
import ProfilePage from "../../pages/profile-page/profile-page";
import LoginPage from "../../pages/login-page/login-page";
import PostPage from "../../pages/post-page/post-page";
import NotFound from "../../pages/not-found/not-found";
import UserSearchPage from "../../pages/search-page/search-page";
import AdminPage from '../../pages/admin-page/admin-page';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute } from '../../const';
import { useState, useEffect } from "react";
import { PrivateRoute } from '../../components/private-route/private-route';
import { Navigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setToken, selectAuthorizationStatus } from '../../features/api/auth/authSlice';
import { useSocket } from "../../hooks/useSocket";
import { connectSocket } from '../../hooks/shared/socket';
import { usePresence } from "../../hooks/usePresence";
function App() {
    const authorizationStatus = useAppSelector(selectAuthorizationStatus);
    const dispatch = useAppDispatch();
    usePresence();
    const [isAuthLoaded, setIsAuthLoaded] = useState(false);
    const socket = useSocket();
    const user = useAppSelector(state => state.messenger.users[2]); // убрать
    console.log(user); // убрать
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token)
            dispatch(setToken(token));
        setIsAuthLoaded(true);
        connectSocket();
        socket.emitJoinChat(1); // убрать
        socket.emitSendTyping(1, true); // убрать
        socket.emitToggleHidden(false); // убрать
    }, [dispatch]);
    if (!isAuthLoaded)
        return _jsx("div", { children: "LOADING" });
    return (_jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: AppRoute.Redirect, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(MainPage, {}) }) }), _jsx(Route, { path: AppRoute.Main, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(MainPage, {}) }) }), _jsx(Route, { path: AppRoute.Profile, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(ProfilePage, {}) }) }), _jsx(Route, { path: AppRoute.Login, element: localStorage.getItem('token')
                        ? _jsx(Navigate, { to: AppRoute.Main, replace: true })
                        : _jsx(LoginPage, {}) }), _jsx(Route, { path: `${AppRoute.Post}/:id`, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(PostPage, {}) }) }), _jsx(Route, { path: AppRoute.Search, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(UserSearchPage, {}) }) }), _jsx(Route, { path: AppRoute.Admin, element: _jsx(PrivateRoute, { authorizationStatus: authorizationStatus, children: _jsx(AdminPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
export { App };
