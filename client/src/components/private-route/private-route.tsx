import { Navigate } from "react-router-dom";
import { PropsWithChildren } from "react";
import { AppRoute, AuthorizationStatus } from "../../const";
import { useAppSelector } from "../../store/hooks";
import { selectIsAuthenticated } from '../../features/api/auth/authSlice';

type AuthorizationStatusEnum = typeof AuthorizationStatus[keyof typeof AuthorizationStatus];

type PrivateRouteProps = {
    authorizationStatus: AuthorizationStatusEnum;
}

function PrivateRoute(props: PropsWithChildren<PrivateRouteProps>): JSX.Element {
    const { authorizationStatus, children } = props;
    const isAuth = useAppSelector(selectIsAuthenticated);

    return (
        isAuth
        ? <>{children}</>
        : <Navigate to={AppRoute.Login} replace />
    )
}

export { PrivateRoute };