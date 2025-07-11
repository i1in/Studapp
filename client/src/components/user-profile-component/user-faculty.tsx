type FacultyKey = 'ivmiit' | 'itis' | 'iir' | 'imef' | 'ifmb' | 'ignt';

type FacultyNames = {
    [key in FacultyKey]: string;
};

function UserFaculty({ faculty }: { faculty?: FacultyKey | string }) {
    
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
        <span className="user-additional__text">{faculties[facultyKey]}</span>
    );
}

export { UserFaculty };