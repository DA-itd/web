
import type { Teacher, Department, Course } from '../types.ts';

const teachers: Teacher[] = [
  { id: 1, name: 'Dra. Ana María López Hernández', curp: 'LOHA800115HMCXXXX', email: 'ana.lopez@example.com', departmentId: 1 },
  { id: 2, name: 'Mtro. Carlos Alberto Ramírez Gutiérrez', curp: 'RAGC850320HDFXXXX', email: 'carlos.ramirez@example.com', departmentId: 2 },
  { id: 3, name: 'Lic. Sofía Isabel Torres Romero', email: 'sofia.torres@example.com', departmentId: 3 },
  { id: 4, name: 'Dr. Javier Francisco Morales Castillo', curp: 'MOCJ780901HNLXXXX', departmentId: 1 },
  { id: 5, name: 'Ing. Laura Elena Vargas Peña', curp: 'VAPL901110MJLXXXX', email: 'laura.vargas@example.com', departmentId: 4 },
  { id: 6, name: 'Mtra. Patricia Mendoza Cruz', departmentId: 2 },
];

const departments: Department[] = [
    { id: 1, name: 'Ciencias Exactas' },
    { id: 2, name: 'Humanidades y Ciencias Sociales' },
    { id: 3, name: 'Ingeniería y Tecnología' },
    { id: 4, name: 'Ciencias de la Salud' },
    { id: 5, name: 'Artes y Diseño' },
];

const courses: Course[] = [
    { id: 101, name: 'Inteligencia Artificial en el Aula', schedule: { day: 'Lunes', startTime: '16:00', endTime: '18:00', date: '2024-09-02' } },
    { id: 102, name: 'Estrategias de Evaluación Formativa', schedule: { day: 'Lunes', startTime: '17:00', endTime: '19:00', date: '2024-09-02' } }, // Conflict with 101
    { id: 103, name: 'Herramientas Digitales para la Enseñanza', schedule: { day: 'Martes', startTime: '10:00', endTime: '12:00', date: '2024-09-03' } },
    { id: 104, name: 'Psicología del Aprendizaje Adolescente', schedule: { day: 'Miércoles', startTime: '09:00', endTime: '11:00', date: '2024-09-04' } },
    { id: 105, name: 'Desarrollo de Material Didáctico Interactivo', schedule: { day: 'Jueves', startTime: '16:00', endTime: '18:00', date: '2024-09-05' } },
    { id: 106, name: 'Liderazgo y Gestión de Proyectos Educativos', schedule: { day: 'Viernes', startTime: '11:00', endTime: '13:00', date: '2024-09-06' } },
    { id: 107, name: 'Introducción a la Gamificación', schedule: { day: 'Jueves', startTime: '16:30', endTime: '18:30', date: '2024-09-05' } }, // Conflict with 105
    { id: 108, name: 'Técnicas de Debate y Oratoria', schedule: { day: 'Viernes', startTime: '11:00', endTime: '13:00', date: '2024-09-06' } }, // Conflict with 106
];

const api = {
  fetchTeachers: async (): Promise<Teacher[]> => {
    return new Promise(resolve => setTimeout(() => resolve(teachers), 300));
  },
  fetchDepartments: async (): Promise<Department[]> => {
    return new Promise(resolve => setTimeout(() => resolve(departments), 300));
  },
  fetchCourses: async (): Promise<Course[]> => {
    return new Promise(resolve => setTimeout(() => resolve(courses), 300));
  },
  // Simulate sending an email
  sendConfirmationEmail: async (data: any): Promise<{ success: true }> => {
    console.log("Simulating sending email with data:", data);
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
  }
};

export default api;