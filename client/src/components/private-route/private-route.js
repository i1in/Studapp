import { Fragment as _Fragment, jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { AppRoute } from "../../const";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated } from '../../features/api/auth/authSlice';
function PrivateRoute(props) {
    const { authorizationStatus, children } = props;
    const isAuth = useAppSelector(selectIsAuthenticated);
    return (isAuth
        ? _jsx(_Fragment, { children: children })
        : _jsx(Navigate, { to: AppRoute.Login, replace: true }));
}
export { PrivateRoute };
