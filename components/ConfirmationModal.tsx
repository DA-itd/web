import React from 'react';
import type { Course } from '../types.ts';
// import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'; // Replaced

// Inlined SVGs to remove external dependencies
const CheckCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.06-1.06L10.5 14.156l-1.591-1.59a.75.75 0 0 0-1.06 1.061l2.121 2.12a.75.75 0 0 0 1.06 0l4.243-4.242Z" clipRule="evenodd" />
  </svg>
);
const XMarkIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);


interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    registrationData: {
        name: string;
        curp: string;
        email: string;
        department: string;
    };
    courses: Course[];
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, registrationData, courses }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center">
                            <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4"/>
                            <div>
                                <h2 className="text-2xl font-bold text-brand-dark">¡Registro Exitoso!</h2>
                                <p className="text-gray-600">Se ha enviado una confirmación a su correo electrónico.</p>
                            </div>
                        </div>
                         <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="h-7 w-7"/>
                        </button>
                    </div>

                    <div className="mt-8 border-t pt-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Resumen del Registro</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div><strong>Nombre:</strong> <span className="text-gray-700">{registrationData.name}</span></div>
                            <div><strong>CURP:</strong> <span className="text-gray-700">{registrationData.curp}</span></div>
                            <div><strong>Correo:</strong> <span className="text-gray-700">{registrationData.email}</span></div>
                            <div><strong>Departamento:</strong> <span className="text-gray-700">{registrationData.department}</span></div>
                        </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-6">
                         <h3 className="text-lg font-semibold text-gray-800">Cursos Registrados</h3>
                         <ul className="mt-3 space-y-2">
                            {courses.map(course => (
                                <li key={course.id} className="p-3 bg-gray-50 rounded-md border">
                                    <p className="font-medium text-brand-dark">{course.name}</p>
                                    <p className="text-xs text-gray-500">{course.schedule.day}, {course.schedule.date} de {course.schedule.startTime} a {course.schedule.endTime}</p>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="mt-8 flex justify-end">
                         <button onClick={onClose} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue">
                           Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;