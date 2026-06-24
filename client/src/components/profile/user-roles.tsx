type RoleKey = 'student' | 'teacher' | 'admin' ;

type RoleNames = {
    [key in RoleKey]: string;
};

function UserRole({ role }: { role?: RoleKey | string }) {
    
    const roles: RoleNames = {
        student: 'Студент',
        teacher: 'Преподаватель',
        admin: 'Администратор',
        
    };

    if (!role || !(role in roles)) {
        return null;
    }

    const RoleKey = role as RoleKey;

    return (
        <span className={`user-role ${role}`}>{roles[RoleKey]}</span>
    );
}

export { UserRole };