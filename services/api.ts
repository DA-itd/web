import { Course, Teacher, FormData, SubmissionData } from '../types';

const URLS = {
  COURSES: 'https://raw.githubusercontent.com/DA-itd/web/main/cursos.json',
  TEACHERS: 'https://raw.githubusercontent.com/DA-itd/web/main/docentes.json',
};

const fetchData = async (url: string) => {
    const response = await fetch(`${url}?v=${new Date().getTime()}`);
    if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
    }
    return response.text();
};

const safeJSONParse = (text: string) => {
    // Strip BOM
    let cleanedText = text.replace(/^\uFEFF/, '');
    try {
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Error parsing JSON:", e, cleanedText);
        throw new Error("A data file has an incorrect format.");
    }
};

const getProp = (obj: any, keys: string[]): any => {
    const key = Object.keys(obj).find(k => keys.includes(k.trim().replace(/\uFEFF/g, "").toLowerCase()));
    return key ? obj[key] : undefined;
};

const trimString = (value: any) => (value || "").trim();

export const loadInitialData = async (): Promise<{ courses: Course[], teachers: Teacher[] }> => {
    const [coursesText, teachersText] = await Promise.all([
        fetchData(URLS.COURSES),
        fetchData(URLS.TEACHERS),
    ]);

    const coursesData = safeJSONParse(coursesText);
    const teachersData = safeJSONParse(teachersText);
    
    const courses: Course[] = coursesData.map((item: any) => ({
        id: getProp(item, ["id_curso", "id"]),
        name: getProp(item, ["#", "nombre_curso", "nombre del curso", "nombre"]),
        dates: getProp(item, ["fechavisible", "fechas"]),
        period: getProp(item, ["periodo"]),
        hours: getProp(item, ["horas"]),
        location: getProp(item, ["lugar"]),
        schedule: getProp(item, ["horario"]),
        type: getProp(item, ["tipo"]),
    })).filter((c: Course) => c.id && c.name).sort((a,b) => a.period.localeCompare(b.period));

    const teachers: Teacher[] = teachersData.map((item: any) => ({
        nombreCompleto: trimString(getProp(item, ["nombre completo", "nombrecompleto", "nombre"])),
        curp: trimString(getProp(item, ["curp"])).toUpperCase(),
        email: trimString(getProp(item, ["email"])).toLowerCase(),
    })).filter((t: Teacher) => t.nombreCompleto);

    return { courses, teachers };
};

export const submitRegistration = async (formData: FormData, allCourses: Course[]): Promise<{ status: string, registrationId?: string, message?: string }> => {
    const scriptUrl = window.CONFIG.APPS_SCRIPT_URL;

    if (!scriptUrl || scriptUrl.includes('YOUR_DEPLOYMENT_ID')) {
      console.warn("SIMULATION MODE: Google Apps Script URL is not configured. Returning a mock response.");
      return new Promise(resolve => {
        setTimeout(() => {
          const courseId = formData.selectedCourses[0];
          let periodCode = "XX";
          if (courseId) {
            const courseParts = courseId.split('-');
            if (courseParts.length === 4) {
              periodCode = courseParts[2];
            }
          }
          const registrationId = `TNM-054-${periodCode}-2026-${Math.floor(Math.random() * 1000) + 1}`;
          resolve({ status: 'success', registrationId });
        }, 1000);
      });
    }

    const payload: SubmissionData = {
        fullName: formData.fullName,
        curp: formData.curp,
        email: formData.email,
        gender: formData.gender,
        department: formData.department,
        timestamp: new Date().toISOString(),
        selectedCourses: allCourses
            .filter(course => formData.selectedCourses.includes(course.id))
            .map(course => ({
                id: course.id,
                name: course.name,
                dates: course.dates,
                location: course.location,
                schedule: course.schedule
            })),
    };

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'error') {
            throw new Error(`Apps Script Error: ${result.message}`);
        }

        return result;

    } catch (error: any) {
        console.error("Error in submitRegistration:", error);
        let errorMessage = "Error submitting registration. Please try again later.";
        if (error.message === 'Failed to fetch') {
            errorMessage = 'Connection Error. Could not contact the registration server. Please check your internet connection and verify the Google Script URL is correct and deployed for "Anyone" access.';
        } else if (error.message.includes('Apps Script Error')) {
            errorMessage = error.message;
        }
        throw new Error(errorMessage);
    }
};