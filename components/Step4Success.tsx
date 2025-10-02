import React from 'react';
import { RegistrationResult } from '../types.ts';

interface Step4Props {
    registrationResult: RegistrationResult[];
    applicantName: string;
}

const Step4Success: React.FC<Step4Props> = ({ registrationResult, applicantName }) => {
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto text-center">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">¡Registro Exitoso!</h2>
            <p className="mt-2 text-gray-600">
                Gracias, <strong>{applicantName}</strong>. Tu solicitud de inscripción ha sido procesada correctamente.
            </p>
            <div className="mt-6 text-left border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Detalles de la Inscripción:</h3>
                <ul className="space-y-3">
                    {registrationResult.map((result) => (
                        <li key={result.registrationId} className="p-3 bg-gray-50 rounded-md border border-gray-100">
                            <p className="font-semibold text-gray-800">{result.courseName}</p>
                            <p className="text-sm text-gray-500">Folio: <span className="font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">{result.registrationId}</span></p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mt-8 border-t pt-6">
                <p className="text-sm text-gray-500">
                    El proceso ha finalizado. Puede cerrar esta ventana de forma segura.
                </p>
            </div>
        </div>
    );
};

export default Step4Success;