
import React, { useState } from 'react';
import type { FormData, Course } from '../types';

interface Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    courses: Course[];
    onNext: () => void;
    onBack: () => void;
}

const parseTime = (timeStr: string): [number, number] | null => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/g);
    if (!match || match.length < 2) return null;

    const [start, end] = match.map(t => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    });
    return [start, end];
};

const checkConflict = (newCourse: Course, selectedCourses: Course[]): boolean => {
    const newCourseTimes = parseTime(newCourse.horario);

    for (const selected of selectedCourses) {
        if (selected.fechas.trim().toLowerCase() === newCourse.fechas.trim().toLowerCase()) {
            const selectedTimes = parseTime(selected.horario);
            if (newCourseTimes && selectedTimes) {
                // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
                if (newCourseTimes[0] < selectedTimes[1] && newCourseTimes[1] > selectedTimes[0]) {
                    return true;
                }
            }
        }
    }
    return false;
};


const Step2CourseSelection: React.FC<Props> = ({ formData, updateFormData, courses, onNext, onBack }) => {
    const [error, setError] = useState<string | null>(null);

    const handleSelectCourse = (courseId: string) => {
        setError(null);
        const isSelected = formData.selectedCourses.includes(courseId);
        let newSelectedCourses: string[];

        if (isSelected) {
            newSelectedCourses = formData.selectedCourses.filter(id => id !== courseId);
        } else {
            if (formData.selectedCourses.length >= 3) {
                setError('Puede seleccionar un máximo de 3 cursos.');
                return;
            }

            const courseToAdd = courses.find(c => c.id_curso === courseId);
            const currentlySelected = formData.selectedCourses.map(id => courses.find(c => c.id_curso === id)).filter(Boolean) as Course[];
            
            if (courseToAdd && checkConflict(courseToAdd, currentlySelected)) {
                setError('El horario de este curso se empalma con otro curso ya seleccionado.');
                return;
            }
            newSelectedCourses = [...formData.selectedCourses, courseId];
        }
        updateFormData({ selectedCourses: newSelectedCourses });
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Selección de Cursos</h2>
            <p className="text-gray-600 mb-4">Seleccione hasta 3 cursos de actualización. Los cursos están organizados por periodo.</p>
            <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-md px-4 py-2 mb-6">
                Cursos seleccionados: {formData.selectedCourses.length} / 3
            </div>

            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-md">{error}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => {
                    const isSelected = formData.selectedCourses.includes(course.id_curso);
                    const isPeriod1 = course.periodo.trim() === 'PERIODO 1';
                    return (
                        <div
                            key={course.id_curso}
                            onClick={() => handleSelectCourse(course.id_curso)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105
                                ${isSelected 
                                    ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-400' 
                                    : `bg-white hover:shadow-md ${isPeriod1 ? 'border-teal-300' : 'border-indigo-300'}`
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-800'}`}>{course.nombre_curso}</h3>
                                <div className={`w-5 h-5 border rounded flex items-center justify-center ml-2 flex-shrink-0 ${isSelected ? 'bg-white border-blue-600' : 'border-gray-400'}`}>
                                    {isSelected && <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            </div>
                            <p className={`text-xs mt-2 ${isSelected ? 'text-blue-100' : 'text-gray-600'}`}>Fechas: {course.fechas}</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-3 inline-block ${isPeriod1 ? (isSelected ? 'bg-teal-400 text-teal-900' : 'bg-teal-100 text-teal-800') : (isSelected ? 'bg-indigo-400 text-indigo-900' : 'bg-indigo-100 text-indigo-800')}`}>
                                {course.periodo}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 flex justify-between">
                <button
                    onClick={onBack}
                    className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                    Regresar
                </button>
                <button
                    onClick={onNext}
                    disabled={formData.selectedCourses.length === 0}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Step2CourseSelection;
