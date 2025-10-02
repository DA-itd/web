import React, { useState } from 'react';
import { Course } from '../types.ts';

interface Step2Props {
    courses: Course[];
    selectedCourses: Course[];
    setSelectedCourses: (courses: Course[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const Step2CourseSelection: React.FC<Step2Props> = ({ courses, selectedCourses, setSelectedCourses, onNext, onBack }) => {
    const [error, setError] = useState<string | null>(null);

    const handleSelectCourse = (course: Course) => {
        const isSelected = selectedCourses.some(c => c.id === course.id);
        let newSelection = [...selectedCourses];
        setError(null); // Clear previous errors on a new action

        if (isSelected) {
            newSelection = newSelection.filter(c => c.id !== course.id);
        } else {
            // Check for max courses
            if (selectedCourses.length >= 3) {
                setError("No puede seleccionar más de 3 cursos.");
                return;
            }
            // Check for period conflict
            const hasPeriodConflict = selectedCourses.some(c => c.period === course.period);
            if (hasPeriodConflict) {
                setError("Ya ha seleccionado un curso para este periodo.");
                return;
            }
            // Check for time conflict
            const hasTimeConflict = selectedCourses.some(selected => {
                const selectedTimes = selected.schedule.split(' a ').map(t => parseInt(t.replace(':', '')));
                const courseTimes = course.schedule.split(' a ').map(t => parseInt(t.replace(':', '')));
                return selected.dates === course.dates && Math.max(selectedTimes[0], courseTimes[0]) < Math.min(selectedTimes[1], courseTimes[1]);
            });
            if (hasTimeConflict) {
                setError("El horario de este curso se solapa con otro curso seleccionado.");
                return;
            }
            newSelection.push(course);
        }
        
        setSelectedCourses(newSelection);
    };
    
    const getCourseCardClass = (course: Course) => {
        const hasPeriodConflict = selectedCourses.some(c => c.period === course.period && c.id !== course.id);
        const isSelected = selectedCourses.some(c => c.id === course.id);

        if (isSelected) {
            return `ring-2 ring-offset-2 ${course.period === 'PERIODO_1' ? 'ring-teal-500' : 'ring-indigo-500'}`;
        }
        if (hasPeriodConflict) {
            return "opacity-50 bg-gray-200 cursor-not-allowed";
        }
        return "bg-white";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCourses.length > 0) {
            onNext();
        } else {
            setError("Debe seleccionar al menos un curso.");
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Selección de Cursos</h2>
            <p className="text-gray-600 mb-6">Seleccione hasta 3 cursos de actualización. Los cursos están organizados por periodo.</p>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md" role="alert">
                <p className="font-bold">Cursos seleccionados: {selectedCourses.length} / 3</p>
            </div>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                    <p>{error}</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => handleSelectCourse(course)}
                        className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${getCourseCardClass(course)} ${course.period === 'PERIODO_1' ? 'border-teal-300 hover:border-teal-500 bg-teal-50' : 'border-indigo-300 hover:border-indigo-500 bg-indigo-50'}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-grow pr-2">
                                <h3 className="font-bold text-sm text-gray-800">{course.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">Fechas: {course.dates}</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={selectedCourses.some(c => c.id === course.id)}
                                readOnly
                                className="form-checkbox h-5 w-5 text-blue-600 rounded cursor-pointer"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit}>
                <div className="mt-8 flex justify-between">
                    <button type="button" onClick={onBack} className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg hover:bg-gray-400">Regresar</button>
                    <button type="submit" className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900">Continuar</button>
                </div>
            </form>
        </div>
    );
};

export default Step2CourseSelection;