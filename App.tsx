import React, { useState, useEffect, useCallback } from 'react';
import type { Department, Course, Teacher, FormData } from './types';
import { Step } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Stepper from './components/Stepper';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2CourseSelection from './components/Step2CourseSelection';
import Step3Confirmation from './components/Step3Confirmation';
import Step4Success from './components/Step4Success';
import { submitRegistration } from './services/api';

// ====================================================================================
// ====================================================================================
// ==  ¡ACCIÓN REQUERIDA! REEMPLACE LA URL DEL SCRIPT DE GOOGLE APPS            ==
// ====================================================================================
// Para que el formulario envíe datos reales, debe:
// 1. Ir al archivo `google-apps-script/Code.gs` que se encuentra en el proyecto.
// 2. Seguir las instrucciones de despliegue que están en los comentarios de ese archivo.
// 3. Copiar la URL de la aplicación web que se genera al desplegar.
// 4. Pegar esa URL aquí, reemplazando el valor de ejemplo de abajo.
//
// MIENTRAS TANTO, LA APLICACIÓN FUNCIONARÁ EN MODO DE SIMULACIÓN.
// No se enviarán datos reales, pero podrá probar el flujo completo.
// ====================================================================================
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';

const DATA_URLS = {
    courses: 'https://raw.githubusercontent.com/DA-itd/web/main/cursos.json',
    teachers: 'https://raw.githubusercontent.com/DA-itd/web/main/docentes.json'
};

const hardcodedDepartments: Department[] = [
    { departamento: 'DEPARTAMENTO DE SISTEMAS Y COMPUTACION' },
    { departamento: 'DEPARTAMENTO DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA' },
    { departamento: 'DEPARTAMENTO DE CIENCIAS ECONOMICO-ADMINISTRATIVAS' },
    { departamento: 'DEPARTAMENTO DE INGENIERÍA QUÍMICA-BIOQUÍMICA' },
    { departamento: 'DEPARTAMENTO DE CIENCIAS DE LA TIERRA' },
    { departamento: 'DEPARTAMENTO DE CIENCIAS BASICAS' },
    { departamento: 'DEPARTAMENTO DE METAL-MECÁNICA' },
    { departamento: 'DEPARTAMENTO DE INGENIERÍA INDUSTRIAL' },
    { departamento: 'DIVISION DE ESTUDIOS DE POSGRADO E INVESTIGACION' },
    { departamento: 'ADMINISTRATIVO' },
    { departamento: 'EXTERNO' },
];

// Function to add a cache-busting query parameter
const bustCache = (url: string) => `${url}?t=${new Date().getTime()}`;

const App: React.FC = () => {
    const [step, setStep] = useState<Step>(Step.PersonalInfo);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        curp: '',
        email: '',
        gender: '',
        department: '',
        selectedCourses: [],
        registrationId: ''
    });

    const [courses, setCourses] = useState<Course[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [crssRes, tchrsRes] = await Promise.all([
                fetch(bustCache(DATA_URLS.courses)),
                fetch(bustCache(DATA_URLS.teachers))
            ]);

            if (!crssRes.ok || !tchrsRes.ok) {
                 throw new Error(`Error de red al cargar los archivos de datos (códigos: ${crssRes.status}, ${tchrsRes.status}).`);
            }

            const [crssData, tchrsData] = await Promise.all([
                crssRes.json(),
                tchrsRes.json()
            ]);

            if (!Array.isArray(crssData) || !Array.isArray(tchrsData)) {
                throw new Error("El formato de los datos JSON es incorrecto. Se esperaba un array.");
            }
            
            // --- Robust Data Transformation Layer ---
            const mappedTeachers: Teacher[] = (tchrsData as any[])
                .map(t => {
                    if (!t || typeof t !== 'object') return null;
                    
                    // Look for common key variations
                    const nombre = t['Nombre Completo'] || t['nombreCompleto'] || t['nombre'];
                    const curpVal = t['CURP'] || t['curp'];
                    const emailVal = t['email'] || t['Email'];

                    // Only include if a name is present
                    if (!nombre) return null;

                    return {
                        nombreCompleto: String(nombre).trim(),
                        curp: String(curpVal || '').trim(),
                        email: String(emailVal || '').trim(),
                    };
                })
                .filter((t): t is Teacher => t !== null && t.nombreCompleto !== '');


            const mappedCourses: Course[] = (crssData as any[])
                 .map(c => {
                    if (!c || typeof c !== 'object') return null;

                    // Look for common key variations and check for essential data
                    const id = c['id_curso'] || c['id'];
                    const periodo = c['periodo'] || c['Periodo'];

                    if (!id || !periodo) return null;

                    const nombre = c['nombre_curso'] || c['nombre'];
                    const horario = c['horario'] || c['Horario'];
                    const fechas = c['fechas'] || c['Fechas'];
                    const lugar = c['lugar'] || c['Lugar'];
                    const tipo = c['tipo'] || c['Tipo'];

                    return {
                        id_curso: String(id).trim(),
                        nombre_curso: String(nombre || '').trim(),
                        horario: String(horario || '').trim(),
                        fechas: String(fechas || '').trim(),
                        lugar: String(lugar || '').trim(),
                        tipo: String(tipo || '').trim(),
                        periodo: String(periodo).trim()
                    };
                })
                .filter((c): c is Course => c !== null);
            
            mappedCourses.sort((a, b) => a.periodo.localeCompare(b.periodo));

            setCourses(mappedCourses);
            setTeachers(mappedTeachers);

        } catch (e) {
            if (e instanceof Error) {
                setError(`Error al cargar los datos: ${e.message}. Asegúrese de que los archivos JSON estén disponibles en GitHub y su formato sea correcto.`);
            } else {
                setError('Ocurrió un error desconocido al cargar los datos.');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const handlePrevStep = () => setStep(prev => Math.max(prev - 1, 1));
    
    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await submitRegistration(APPS_SCRIPT_URL, formData, courses);
            if (result.status === 'success') {
                updateFormData({ registrationId: result.registrationId });
                handleNextStep();
            } else {
                throw new Error(result.message || 'An unknown error occurred during registration.');
            }
        } catch (e) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError('Failed to submit registration.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderStep = () => {
        switch(step) {
            case Step.PersonalInfo:
                return <Step1PersonalInfo 
                          formData={formData} 
                          updateFormData={updateFormData} 
                          departments={hardcodedDepartments} 
                          teachers={teachers} 
                          onNext={handleNextStep} />;
            case Step.CourseSelection:
                return <Step2CourseSelection 
                          formData={formData}
                          updateFormData={updateFormData}
                          courses={courses}
                          onNext={handleNextStep}
                          onBack={handlePrevStep} />;
            case Step.Confirmation:
                return <Step3Confirmation
                          formData={formData}
                          courses={courses}
                          onConfirm={handleConfirm}
                          onBack={handlePrevStep}
                          isLoading={isLoading} />;
            case Step.Success:
                return <Step4Success registrationId={formData.registrationId} />;
            default:
                return <div>Invalid Step</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <Stepper currentStep={step} />
                    {isLoading && step === 1 && <div className="text-center p-8"><p className="text-xl text-gray-600">Cargando datos...</p></div>}
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4" role="alert"><p>{error}</p></div>}
                    {!isLoading && !error && renderStep()}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;