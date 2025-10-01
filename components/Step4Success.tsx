import React from 'react';

interface Step4Props {
    registrationId: string;
}

const Step4Success: React.FC<Step4Props> = ({ registrationId }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-green-700">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-6">
                Su registro ha sido procesado correctamente. Recibirá un correo de confirmación con los detalles de sus cursos seleccionados.
            </p>
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-500">ID de Registro:</p>
                <p className="text-lg font-mono text-gray-800 font-semibold">{registrationId}</p>
            </div>
        </div>
    );
};

export default Step4Success;