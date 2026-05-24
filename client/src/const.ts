export const AppRoute = { 
    Redirect: '/',
    Main: '/feed',
    Login: '/login',
    Profile: '/:username',
    Post: '/:username/post',
    Search: '/search',
    Chats: '/chats',
    Admin: '/admin',
} as const;

export const AuthorizationStatus = {
    Auth: 'AUTH',
    NoAuth: 'NO_AUTH',
    Unknown: 'Unknown',
}