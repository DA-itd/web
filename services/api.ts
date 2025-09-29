import type { FormData, Course } from '../types';

interface SubmissionData {
    timestamp: string;
    fullName: string;
    curp: string;
    email: string;
    gender: string;
    department: string;
    selectedCourses: {
        id: string;
        name: string;
        schedule: string;
        dates: string;
        location: string;
    }[];
}

interface ApiResponse {
    status: 'success' | 'error';
    message?: string;
    registrationId?: string;
}

export const submitRegistration = async (url: string, formData: FormData, allCourses: Course[]): Promise<ApiResponse> => {
    if (!url || url.includes('YOUR_DEPLOYMENT_ID')) {
        // --- MODO DE SIMULACIÓN ACTIVO ---
        // La URL de Google Apps Script no ha sido configurada en App.tsx.
        // Se simulará una respuesta exitosa para fines de desarrollo.
        // No se enviarán datos reales.
        console.warn("MODO DE SIMULACIÓN: La URL de Google Apps Script no está configurada. Se devolverá una respuesta simulada.");
        return new Promise(resolve => setTimeout(() => resolve({
            status: 'success',
            registrationId: `DEV-TNM-054-${formData.selectedCourses[0] || 'XX'}-2026-${Math.floor(Math.random() * 30)}`
        }), 1000));
    }

    const selectedCourseDetails = formData.selectedCourses.map(id => {
        const course = allCourses.find(c => c.id_curso === id);
        return {
            id: course?.id_curso || '',
            name: course?.nombre_curso || '',
            schedule: course?.horario || '',
            dates: course?.fechas || '',
            location: course?.lugar || '',
        };
    }).filter(c => c.id);

    const payload: SubmissionData = {
        timestamp: new Date().toISOString(),
        fullName: formData.fullName,
        curp: formData.curp,
        email: formData.email,
        gender: formData.gender,
        department: formData.department,
        selectedCourses: selectedCourseDetails
    };

    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Apps Script quirk
        },
        body: JSON.stringify(payload),
        redirect: 'follow',
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    return response.json() as Promise<ApiResponse>;
};