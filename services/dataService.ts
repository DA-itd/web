import { Course, Docente } from '../types';

// URLs de los archivos de datos en GitHub
const COURSES_URL = 'https://raw.githubusercontent.com/DA-itd/web/main/cursos.csv';
const DEPARTMENTS_URL = 'https://raw.githubusercontent.com/DA-itd/web/main/departamentos.csv';
const DOCENTES_URL = 'https://raw.githubusercontent.com/DA-itd/web/main/docentes.csv';
export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyxWZVL33x5pXJQ01Bug4ALTVT43xSSBzoZr1D5A58wlU4Tnvxj9AomY/exec';


/**
 * Normaliza un string: convierte a mayúsculas, recorta espacios, y elimina acentos.
 */
export function normalizeString(str: string | undefined | null): string {
    if (!str) return '';
    return String(str)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

/**
 * Parsea texto CSV a un array de objetos. Es flexible con el número de columnas y asume una fila de encabezado.
 */
function parseCSV<T>(csvText: string, expectedColumns: (keyof T)[]): T[] {
    const lines = csvText.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    if (lines.length < 2) return []; // Necesita al menos un encabezado y una línea de datos

    const dataLines = lines.slice(1); // Omitir la fila del encabezado
    const separatorRegex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const result: T[] = [];

    for (const line of dataLines) {
        let values = line.split(separatorRegex);

        const obj = {} as T;
        for (let j = 0; j < expectedColumns.length; j++) {
            let val = (values[j] || '').trim();
            // Limpiar comillas
            if (val.startsWith('"') && val.endsWith('"')) {
                val = val.substring(1, val.length - 1).replace(/""/g, '"');
            }
            obj[expectedColumns[j]] = val as any;
        }
        result.push(obj);
    }
    return result;
}


async function fetchAndParseCSV<T>(url: string, columns: (keyof T)[]): Promise<T[]> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Fallo al cargar la URL: ${url} (Estado: ${response.status})`);
    }
    const csvText = await response.text();
    return parseCSV(csvText, columns);
};

export const loadCourses = async (): Promise<Course[]> => {
    // Columnas en el orden esperado en el archivo CSV
    const columns: (keyof Omit<Course, 'Codigo'>)[] = ['NombreCurso', 'FechaVisible', 'Lugar', 'Horario', 'Capacidad', 'Inscritos'];
    const rawCourses = await fetchAndParseCSV<Omit<Course, 'Codigo'>>(COURSES_URL, columns);
    
    return rawCourses.map(c => {
        const rawNombreCurso = c.NombreCurso || '';
        // Regex para separar el código (primera palabra) del resto del nombre
        const match = rawNombreCurso.match(/^(\S+)\s+(.*)$/);
        
        const codigo = match ? match[1] : '';
        const nombre = match ? match[2] : rawNombreCurso; // Usar el nombre completo si no hay código

        return {
            ...c,
            Codigo: codigo,
            NombreCurso: nombre,
            // FIX: Explicitly convert to string before passing to parseInt to resolve type error.
            Capacidad: parseInt(String(c.Capacidad || '30'), 10) || 30, // Default a 30 si es inválido
            // FIX: Explicitly convert to string before passing to parseInt to resolve type error.
            Inscritos: parseInt(String(c.Inscritos || '0'), 10) || 0,   // Default a 0 si es inválido
        };
    }).filter(c => c.NombreCurso);
};

export const loadDepartments = async (): Promise<string[]> => {
    const response = await fetch(DEPARTMENTS_URL);
    if (!response.ok) throw new Error(`Failed to fetch departments: ${response.status}`);
    const text = await response.text();
    // Omitir encabezado si existe y filtrar líneas vacías
    return text.split(/\r?\n/).slice(1).map(line => line.trim()).filter(Boolean);
};

export const loadDocentes = async (): Promise<Docente[]> => {
    const columns: (keyof Docente)[] = ['NombreCompleto', 'Curp', 'Email'];
    const rawDocentes = await fetchAndParseCSV<Docente>(DOCENTES_URL, columns);
    return rawDocentes.map(doc => ({
        NombreCompleto: normalizeString(doc.NombreCompleto),
        Curp: normalizeString(doc.Curp),
        Email: (doc.Email || '').toLowerCase().trim(),
    })).filter(d => d.NombreCompleto);
};
