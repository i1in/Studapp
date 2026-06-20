import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { AuthorizationStatus } from '../../../const';
import type { RootState } from '../../../store/store';
import { UserRooler } from '../../../types/user';

interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    userId: number | null;
}

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    userId: null,
};

interface JwtPayload {
    id: number;
    iat: number;
    exp: number;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            const decoded = jwtDecode<JwtPayload>(action.payload);
            console.log(decoded);
            state.token = action.payload;
            state.isAuthenticated = true;
            state.userId = decoded.id;
        },
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.userId = null;
        },
    },
});

export const selectToken = (state: RootState) => state.auth.token;
export const selectIsAuthenticated = (state: RootState) =>
    state.auth.isAuthenticated;
export const selectUserId = (state: RootState) => state.auth.userId;
export const selectAuthorizationStatus = (state: RootState) =>
    state.auth.isAuthenticated
        ? AuthorizationStatus.Auth
        : AuthorizationStatus.NoAuth;

export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
