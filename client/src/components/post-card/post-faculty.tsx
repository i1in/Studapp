type FacultyKey = 'ivmiit' | 'itis' | 'iir' | 'imef' | 'ifmb' | 'ignt';

type FacultyNames = {
    [key in FacultyKey]: string;
};

function Faculty({ faculty }: { faculty?: FacultyKey | string }) {

    const faculties: FacultyNames = {
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

    const facultyKey = faculty as FacultyKey;

    return (
        <p className="author-faculty">
            <span className="icon">
                <svg width="16px" height="18px" viewBox="0 -2.4 26.40 28.80" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="#000000" strokeWidth="0.00024000000000000003" transform="matrix(1, 0, 0, 1, 0, 0)">
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.048"></g>
                    <g id="SVGRepo_iconCarrier">
                        <rect x="0" fill="none" width="24" height="24"></rect>
                        <g> <path d="M2 19h20v3H2zM12 2L2 6v2h20V6M17 10h3v7h-3zM10.5 10h3v7h-3zM4 10h3v7H4z"></path> </g>
                    </g>
                </svg>
            </span>
            {faculties[facultyKey]}
        </p>
    );
}

export { Faculty };