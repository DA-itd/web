import type { Teacher, Department, Course } from '../types.ts';

const BASE_URL = 'https://raw.githubusercontent.com/DA-itd/web/main/';

/**
 * A simple CSV parser. It takes CSV text, splits it into lines,
 * and creates an array of objects based on the headers.
 * @param csvText The raw CSV string.
 * @returns An array of objects.
 */
const parseCSV = <T>(csvText: string): T[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const entry = {} as any;
        headers.forEach((header, index) => {
            entry[header] = values[index];
        });
        return entry as T;
    });
    return data;
};

const api = {
    fetchTeachers: async (): Promise<Teacher[]> => {
        const response = await fetch(`${BASE_URL}docentes.csv`);
        if (!response.ok) throw new Error('Failed to fetch teachers data');
        const csvText = await response.text();
        const parsedData = parseCSV<any>(csvText);
        // Map to Teacher type, ensuring correct data types
        return parsedData.map(t => ({
            id: parseInt(t.id, 10),
            name: t.name,
            curp: t.curp || undefined,
            email: t.email || undefined,
            departmentId: parseInt(t.departmentId, 10),
        }));
    },
    fetchDepartments: async (): Promise<Department[]> => {
        const response = await fetch(`${BASE_URL}departamentos.csv`);
        if (!response.ok) throw new Error('Failed to fetch departments data');
        const csvText = await response.text();
        const parsedData = parseCSV<any>(csvText);
        return parsedData.map(d => ({
            id: parseInt(d.id, 10),
            name: d.name,
        }));
    },
    fetchCourses: async (): Promise<Course[]> => {
        const response = await fetch(`${BASE_URL}cursos.csv`);
        if (!response.ok) throw new Error('Failed to fetch courses data');
        const csvText = await response.text();
        const parsedData = parseCSV<any>(csvText);
        return parsedData.map(c => ({
            id: parseInt(c.id, 10),
            name: c.name,
            schedule: {
                day: c.day as Course['schedule']['day'],
                startTime: c.startTime,
                endTime: c.endTime,
                date: c.date,
            },
        }));
    },
    // Simulate sending an email
    sendConfirmationEmail: async (data: any): Promise<{ success: true }> => {
        console.log("Simulating sending email with data:", data);
        return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
    }
};

export default api;