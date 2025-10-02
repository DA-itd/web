// FIX: Import React and useState hook to fix UMD global error.
import React, { useState } from 'react';
import { Course, FormData } from '../types.ts';

interface Step3Props {
    formData: FormData;
    courses: Course[];
    onBack: () => void;
    onSubmit: () => Promise<void>;
}

const Step3Confirmation: React.FC<Step3Props> = ({ formData, courses, onBack, onSubmit }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmit();
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Confirmación de Registro</h2>

            <div className="border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumen de su Registro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p><strong>Nombre: </strong>{formData.fullName}</p>
                        <p><strong>CURP: </strong>{formData.curp}</p>
                        <p><strong>Género: </strong>{formData.gender}</p>
                    </div>
                    <div>
                        <p><strong>Email: </strong>{formData.email}</p>
                        <p><strong>Departamento: </strong>{formData.department}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Cursos Seleccionados</h3>
                <div className="space-y-4">
                    {courses.map(course => (
                        <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-gray-800">{course.name}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                <div><strong>Horario: </strong>{course.schedule}</div>
                                <div><strong>Lugar: </strong>{course.location}</div>
                                <div><strong>Fechas: </strong>{course.dates}</div>
                                <div><strong>Horas: </strong>{course.hours || 30}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400" disabled={isSubmitting}>
                    Regresar
                </button>
                <button onClick={handleSubmit} className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900 flex items-center justify-center" disabled={isSubmitting}>
                    {isSubmitting && (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {isSubmitting ? 'Procesando...' : 'Confirmar Registro'}
                </button>
            </div>
        </div>
    );
};

export default Step3Confirmation;