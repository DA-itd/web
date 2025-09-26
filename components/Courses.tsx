
import React, { useState, useEffect, useCallback } from 'react';
import { getCursos, getAllInscripciones, inscribirEnCurso } from '../services/firebaseService';
import type { Curso, Inscripcion, Docente } from '../types';
import Spinner from './common/Spinner';
import Alert from './common/Alert';

interface CoursesViewProps {
    docenteProfile: Docente;
}

const CoursesView: React.FC<CoursesViewProps> = ({ docenteProfile }) => {
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [cursosData, inscripcionesData] = await Promise.all([
                getCursos(),
                getAllInscripciones()
            ]);
            setCursos(cursosData);
            setInscripciones(inscripcionesData);
        } catch (err) {
            setError('Error al cargar los datos. Intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleInscribir = async (curso: Curso) => {
        setEnrollingCourseId(curso.id);
        setError('');
        setSuccess('');
        try {
            await inscribirEnCurso(docenteProfile.id, curso);
            setSuccess(`¡Inscripción exitosa al curso "${curso.nombre}"!`);
            // Volver a cargar los datos para reflejar el nuevo cupo
            fetchData();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado durante la inscripción.');
            }
        } finally {
            setEnrollingCourseId(null);
        }
    };

    const getCupoPorCurso = (cursoId: string) => {
        return inscripciones.filter(i => i.cursoId === cursoId).length;
    };
    
    const docenteInscritoEn = (cursoId: string) => {
        return inscripciones.some(i => i.cursoId === cursoId && i.docenteId === docenteProfile.id);
    };

    if (loading && cursos.length === 0) {
        return <div className="flex justify-center mt-10"><Spinner /></div>;
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Cursos Disponibles</h2>
            {error && <div className="mb-4"><Alert message={error} type="error" onClose={() => setError('')} /></div>}
            {success && <div className="mb-4"><Alert message={success} type="success" onClose={() => setSuccess('')} /></div>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map(curso => {
                    const cupoActual = getCupoPorCurso(curso.id);
                    const isFull = cupoActual >= 30;
                    const isEnrolled = docenteInscritoEn(curso.id);
                    const isEnrolling = enrollingCourseId === curso.id;
                    
                    return (
                        <div key={curso.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{curso.nombre}</h3>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Fecha:</span> {curso.fecha}</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Horario:</span> {curso.horario}</p>
                                <p className="text-sm text-gray-600 mb-4"><span className="font-medium">Modalidad:</span> {curso.tipo}</p>
                                
                                <div className="flex justify-between items-center">
                                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${isFull ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        Cupo: {cupoActual} / 30
                                    </div>
                                    <button
                                        onClick={() => handleInscribir(curso)}
                                        disabled={isFull || isEnrolled || isEnrolling}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isEnrolling ? <Spinner/> : (isEnrolled ? 'Inscrito' : (isFull ? 'Cupo lleno' : 'Inscribirme'))}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CoursesView;
