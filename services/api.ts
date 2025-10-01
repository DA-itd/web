import { Teacher, Course, SubmissionData, RegistrationResult } from '../types';

// Mock data
const mockTeachers: Teacher[] = [
    { nombreCompleto: 'MARIA GUADALUPE SOTO', curp: 'SOMM800101HDFLRA01', email: 'maria.soto@itdurango.edu.mx' },
    { nombreCompleto: 'JUAN PEREZ GONZALEZ', curp: 'PEGJ750315HDFLRA02', email: 'juan.perez@itdurango.edu.mx' },
    { nombreCompleto: 'ANA KAREN MARTINEZ', curp: 'MAAK901220MDFLRA03', email: 'ana.martinez@itdurango.edu.mx' }
];

const mockCourses: Course[] = [
    { id: 'C1', name: 'Inteligencia Artificial', dates: '19-23 AGO', period: 'PERIODO_1', hours: 40, location: 'Sala A', schedule: '09:00 a 13:00', type: 'Presencial' },
    { id: 'C2', name: 'Desarrollo Web Moderno', dates: '19-23 AGO', period: 'PERIODO_1', hours: 40, location: 'Sala B', schedule: '14:00 a 18:00', type: 'Presencial' },
    { id: 'C3', name: 'Bases de Datos NoSQL', dates: '26-30 AGO', period: 'PERIODO_2', hours: 40, location: 'Sala A', schedule: '09:00 a 13:00', type: 'Presencial' },
    { id: 'C4', name: 'Gestión de Proyectos Ágiles', dates: '26-30 AGO', period: 'PERIODO_2', hours: 40, location: 'Sala C', schedule: '09:00 a 13:00', type: 'Presencial' }
];

const mockDepartments: string[] = [
    "Sistemas y Computación",
    "Ingeniería Industrial",
    "Ciencias Básicas",
    "Eléctrica y Electrónica",
    "Ciencias Económico Administrativas"
];


export const getTeachers = (): Promise<Teacher[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockTeachers), 500));
};

export const getCourses = (): Promise<Course[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockCourses), 500));
};

export const getDepartments = (): Promise<string[]> => {
    return new Promise(resolve => setTimeout(() => resolve(mockDepartments), 500));
};

export const submitRegistration = (submission: SubmissionData): Promise<RegistrationResult[]> => {
    console.log("Submitting registration:", submission);
    const results: RegistrationResult[] = submission.selectedCourses.map(course => ({
        courseName: course.name,
        registrationId: `REG-${course.id}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    }));
    return new Promise(resolve => setTimeout(() => resolve(results), 1500));
};
