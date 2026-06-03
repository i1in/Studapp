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

export const getFaculty = (facultyString: string | undefined) => {
    const Faculty = {
        ivmiit: 'ИВМиИТ',
        itis: 'ИТиИС',
        iir: 'ИМО',
        imef: 'ИУЭФ',
        ifmb: 'ИФМБ',
        ignt: 'ИГНТ',
        iec: 'ИЭиЦ',
    };

    const facultyDict = Faculty as Record<string, string>;
    
    const humanReadableFaculty = facultyString ? facultyDict[facultyString] : '';

    return humanReadableFaculty;
}