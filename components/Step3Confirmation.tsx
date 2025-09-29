
import React from 'react';
import type { FormData, Course } from '../types';

interface Props {
    formData: FormData;
    courses: Course[];
    onConfirm: () => void;
    onBack: () => void;
    isLoading: boolean;
}

const InfoItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-gray-800">{value}</p>
    </div>
);

const Step3Confirmation: React.FC<Props> = ({ formData, courses, onConfirm, onBack, isLoading }) => {
    const selectedCoursesDetails = formData.selectedCourses
        .map(id => courses.find(c => c.id_curso === id))
        .filter((c): c is Course => c !== undefined);

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirmación de Registro</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Resumen de su Registro</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoItem label="Nombre" value={formData.fullName} />
                    <InfoItem label="Email" value={formData.email} />
                    <InfoItem label="CURP" value={formData.curp} />
                    <InfoItem label="Departamento" value={formData.department} />
                    <InfoItem label="Género" value={formData.gender} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Cursos Seleccionados</h3>
                <div className="space-y-4">
                    {selectedCoursesDetails.length > 0 ? selectedCoursesDetails.map(course => (
                        <div key={course.id_curso} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <h4 className="font-bold text-blue-800">{course.nombre_curso}</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                                <div><span className="font-medium">Horario:</span> {course.horario}</div>
                                <div><span className="font-medium">Periodo:</span> {course.periodo}</div>
                                <div><span className="font-medium">Fechas:</span> {course.fechas}</div>
                                <div><span className="font-medium">Lugar:</span> {course.lugar}</div>
                                <div><span className="font-medium">Tipo:</span> {course.tipo}</div>
                                <div><span className="font-medium">Horas:</span> 30</div>
                            </div>
                        </div>
                    )) : (
                       <p className="text-gray-500">No ha seleccionado ningún curso.</p> 
                    )}
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={onBack}
                    disabled={isLoading}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors disabled:opacity-50"
                >
                    Regresar
                </button>
                <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="bg-green-600 text-white font-bold py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-green-400 flex items-center"
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Procesando...
                        </>
                    ) : 'Confirmar Registro'}
                </button>
            </div>
        </div>
    );
};

export default Step3Confirmation;
