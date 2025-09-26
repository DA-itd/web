// Fix: Implementing a mock data service to provide course data and handle form submissions.
import { Course, RegistrationData } from '../types';

const courses: Course[] = [
    { id: 'C1', name: 'Inteligencia Artificial Aplicada', instructor: 'Dr. Juan Pérez', schedule: 'L-V 9:00-11:00', department: 'Sistemas y Computación' },
    { id: 'C2', name: 'Nuevas Tecnologías en la Enseñanza', instructor: 'Dra. María García', schedule: 'L-M-V 11:00-13:00', department: 'Ciencias Básicas' },
    { id: 'C3', name: 'Desarrollo de Habilidades Blandas', instructor: 'Lic. Carlos Rodríguez', schedule: 'M-J 16:00-18:00', department: 'Todas las áreas' },
    { id: 'C4', name: 'Gestión de Proyectos Educativos', instructor: 'Ing. Ana López', schedule: 'S 9:00-14:00', department: 'Ciencias Económico-Administrativas' },
];

export const getCourses = async (): Promise<Course[]> => {
    // Simulate API call
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(courses);
        }, 500);
    });
};

export const submitRegistration = async (data: RegistrationData): Promise<{ success: boolean; message: string }> => {
    // Simulate API call
    console.log('Submitting registration:', data);
    return new Promise(resolve => {
        setTimeout(() => {
            if (data.teacherName && data.rfc && data.department && data.selectedCourses.length > 0) {
                resolve({ success: true, message: 'Registro exitoso.' });
            } else {
                resolve({ success: false, message: 'Faltan datos en el formulario.' });
            }
        }, 1000);
    });
};
