import { jsx as _jsx } from "react/jsx-runtime";
function UserFaculty({ faculty }) {
    const faculties = {
        ivmiit: 'ИВМиИТ',
        itis: 'ИТиС',
        iir: 'ИМО',
        imef: 'ИУЭиФ',
        ifmb: 'ИФМиБ',
        ignt: 'ИГиНТ'
    };
    if (!faculty || !(faculty in faculties)) {
        return null;
    }
    const facultyKey = faculty;
    return (_jsx("span", { className: "user-additional__text", children: faculties[facultyKey] }));
}
export { UserFaculty };
