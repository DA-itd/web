
export interface Department {
    departamento: string;
}

export interface Course {
    id_curso: string;
    nombre_curso: string;
    horario: string;
    fechas: string;
    lugar: string;
    tipo: string;
    periodo: string;
}

export interface Teacher {
    nombreCompleto: string;
    curp: string;
    email: string;
}

export interface FormData {
    fullName: string;
    curp: string;
    email: string;
    gender: string;
    department: string;
    selectedCourses: string[];
    registrationId: string;
}

export enum Step {
    PersonalInfo = 1,
    CourseSelection = 2,
    Confirmation = 3,
    Success = 4
}