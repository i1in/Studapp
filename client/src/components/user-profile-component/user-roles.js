import { jsx as _jsx } from "react/jsx-runtime";
function UserRole({ role }) {
    const roles = {
        student: 'Студент',
        teacher: 'Преподаватель',
        admin: 'Администратор',
    };
    if (!role || !(role in roles)) {
        return null;
    }
    const RoleKey = role;
    return (_jsx("span", { className: `user-role ${role}`, children: roles[RoleKey] }));
}
export { UserRole };
