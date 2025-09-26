
import React, { useState, useEffect, useCallback } from 'react';
import { getInscripcionesPorDocente, anularInscripcion } from '../services/firebaseService';
import type { Inscripcion, Docente } from '../types';
import Spinner from './common/Spinner';
import Alert from './common/Alert';

interface MyCoursesViewProps {
    docenteProfile: Docente;
}

const MyCoursesView: React.FC<MyCoursesViewProps> = ({ docenteProfile }) => {
    const [misInscripciones, setMisInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);

    const fetchMyCourses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getInscripcionesPorDocente(docenteProfile.id);
            setMisInscripciones(data);
        } catch (err) {
            setError('No se pudieron cargar tus cursos.');
        } finally {
            setLoading(false);
        }
    }, [docenteProfile.id]);

    useEffect(() => {
        fetchMyCourses();
    }, [fetchMyCourses]);

    const handleAnular = async (inscripcion: Inscripcion) => {
        if (window.confirm(`¿Estás seguro de que quieres anular tu inscripción al curso "${inscripcion.curso?.nombre}"?`)) {
            setUnsubscribingId(inscripcion.id);
            setError('');
            setSuccess('');
            try {
                await anularInscripcion(inscripcion.id);
                setSuccess('Inscripción anulada correctamente.');
                // Recargar la lista de cursos
                fetchMyCourses();
            } catch (err) {
                setError('Error al anular la inscripción.');
            } finally {
                setUnsubscribingId(null);
            }
        }
    };
    
    if (loading) {
        return <div className="flex justify-center mt-10"><Spinner /></div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Mis Cursos Inscritos</h2>
            {error && <div className="mb-4"><Alert message={error} type="error" onClose={() => setError('')} /></div>}
            {success && <div className="mb-4"><Alert message={success} type="success" onClose={() => setSuccess('')} /></div>}

            {misInscripciones.length === 0 ? (
                <p className="text-center text-gray-600 bg-white p-8 rounded-lg shadow">No estás inscrito en ningún curso.</p>
            ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <ul className="divide-y divide-gray-200">
                        {misInscripciones.map(inscripcion => (
                            <li key={inscripcion.id} className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-lg font-semibold text-gray-800">{inscripcion.curso?.nombre || 'Cargando nombre...'}</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        <span className="font-medium">ID de Registro:</span> {inscripcion.idRegistro}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {inscripcion.curso?.fecha} &bull; {inscripcion.curso?.horario} &bull; {inscripcion.curso?.tipo}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleAnular(inscripcion)}
                                    disabled={unsubscribingId === inscripcion.id}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:bg-gray-400 w-full sm:w-auto"
                                >
                                    {unsubscribingId === inscripcion.id ? <Spinner/> : 'Anular Inscripción'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MyCoursesView;
