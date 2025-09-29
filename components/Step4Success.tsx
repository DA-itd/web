
import React from 'react';

interface Props {
    registrationId: string | null;
}

const Step4Success: React.FC<Props> = ({ registrationId }) => {
    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                 <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-700">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mt-2 max-w-prose mx-auto">
                Su registro ha sido procesado correctamente. Recibirá un correo de confirmación con los detalles de sus cursos seleccionados.
            </p>
            {registrationId && (
                <div className="mt-6 bg-gray-100 border border-dashed border-gray-300 rounded-md p-3 inline-block">
                    <span className="text-sm text-gray-500">ID de Registro:</span>
                    <p className="font-mono text-lg text-gray-800 tracking-wider">{registrationId}</p>
                </div>
            )}
        </div>
    );
};

export default Step4Success;
