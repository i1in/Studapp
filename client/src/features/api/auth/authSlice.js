import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import { AuthorizationStatus } from '../../../const';
const initialState = {
    token: null,
    isAuthenticated: false,
    userId: null,
};
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action) {
            const decoded = jwtDecode(action.payload);
            console.log(decoded);
            state.token = action.payload;
            state.isAuthenticated = true;
            state.userId = decoded.id;
        },
        logout(state) {
            state.token = null;
            state.isAuthenticated = false;
            state.userId = null;
            localStorage.removeItem('token');
        },
    },
});
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserId = (state) => state.auth.userId;
export const selectAuthorizationStatus = (state) => state.auth.isAuthenticated ? AuthorizationStatus.Auth : AuthorizationStatus.NoAuth;
export const { setToken, logout } = authSlice.actions;
export default authSlice.reducer;
