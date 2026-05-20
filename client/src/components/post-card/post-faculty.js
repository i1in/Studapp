import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function Faculty({ faculty }) {
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
    return (_jsxs("p", { className: "author-faculty", children: [_jsx("span", { className: "icon", children: _jsxs("svg", { width: "16px", height: "18px", viewBox: "0 -2.4 26.40 28.80", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", stroke: "#000000", strokeWidth: "0.00024000000000000003", transform: "matrix(1, 0, 0, 1, 0, 0)", children: [_jsx("g", { id: "SVGRepo_bgCarrier", strokeWidth: "0" }), _jsx("g", { id: "SVGRepo_tracerCarrier", strokeLinecap: "round", strokeLinejoin: "round", stroke: "#CCCCCC", strokeWidth: "0.048" }), _jsxs("g", { id: "SVGRepo_iconCarrier", children: [_jsx("rect", { x: "0", fill: "none", width: "24", height: "24" }), _jsxs("g", { children: [" ", _jsx("path", { d: "M2 19h20v3H2zM12 2L2 6v2h20V6M17 10h3v7h-3zM10.5 10h3v7h-3zM4 10h3v7H4z" }), " "] })] })] }) }), faculties[facultyKey]] }));
}
export { Faculty };
