import React, { useState } from 'react';
import type { Course } from '../types.ts';
// FIX: Import toast from react-hot-toast to display notifications.
import toast from 'react-hot-toast';
// import { XCircleIcon, PlusCircleIcon, BookOpenIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline'; // Replaced

// Inlined SVGs to remove external dependencies
const XCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const PlusCircleIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const BookOpenIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21M12 6.042A8.967 8.967 0 0 1 6 3.75m0 14.25a8.967 8.967 0 0 1-5.982 2.292" />
  </svg>
);
const ClockIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);
const CalendarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h18" />
  </svg>
);

interface CourseSelectorProps {
    allCourses: Course[];
    selectedCourses: Course[];
    setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const MAX_COURSES = 3;

const checkConflict = (newCourse: Course, existingCourses: Course[]): boolean => {
    for (const existingCourse of existingCourses) {
        if (newCourse.schedule.date === existingCourse.schedule.date) {
            const newStart = new Date(`1970-01-01T${newCourse.schedule.startTime}`);
            const newEnd = new Date(`1970-01-01T${newCourse.schedule.endTime}`);
            const existingStart = new Date(`1970-01-01T${existingCourse.schedule.startTime}`);
            const existingEnd = new Date(`1970-01-01T${existingCourse.schedule.endTime}`);

            // Check for overlap: (StartA < EndB) and (EndA > StartB)
            if (newStart < existingEnd && newEnd > existingStart) {
                return true;
            }
        }
    }
    return false;
};

const CourseSelector: React.FC<CourseSelectorProps> = ({ allCourses, selectedCourses, setSelectedCourses }) => {
    const [courseToAdd, setCourseToAdd] = useState('');

    const handleAddCourse = () => {
        if (!courseToAdd) {
            toast.error('Por favor, seleccione un curso para agregar.');
            return;
        }

        if (selectedCourses.length >= MAX_COURSES) {
            toast.error(`No puede registrar más de ${MAX_COURSES} cursos.`);
            return;
        }

        const course = allCourses.find(c => c.id === parseInt(courseToAdd));
        if (!course) return;

        if (selectedCourses.some(c => c.id === course.id)) {
            toast.error('Este curso ya ha sido agregado.');
            return;
        }

        if (checkConflict(course, selectedCourses)) {
            toast.error(`El curso "${course.name}" tiene un conflicto de horario con otro curso seleccionado.`);
            return;
        }
        
        setSelectedCourses(prev => [...prev, course]);
        toast.success(`Curso "${course.name}" agregado.`);
        setCourseToAdd('');
    };

    const handleRemoveCourse = (courseId: number) => {
        const course = selectedCourses.find(c => c.id === courseId);
        setSelectedCourses(prev => prev.filter(c => c.id !== courseId));
        if(course) toast.success(`Curso "${course.name}" eliminado.`);
    };
    
    const availableCourses = allCourses.filter(c => !selectedCourses.some(sc => sc.id === c.id));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-brand-dark col-span-1 md:col-span-2 border-b pb-4">Selección de Cursos</h2>
            <div className="flex items-end space-x-4">
                <div className="flex-grow">
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">Cursos Disponibles</label>
                    <select
                        id="course"
                        value={courseToAdd}
                        onChange={(e) => setCourseToAdd(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue bg-white"
                    >
                        <option value="" disabled>Seleccione un curso</option>
                        {availableCourses.map(course => (
                           <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    type="button"
                    onClick={handleAddCourse}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2"/>
                    Agregar Curso
                </button>
            </div>
            <div>
                <h3 className="text-lg font-medium text-gray-800">Cursos Seleccionados ({selectedCourses.length}/{MAX_COURSES})</h3>
                {selectedCourses.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                        {selectedCourses.map(course => (
                            <li key={course.id} className="flex items-center justify-between bg-brand-lightblue p-4 rounded-lg border border-brand-blue/30">
                                <div className="flex-grow">
                                    <p className="font-semibold text-brand-dark flex items-center"><BookOpenIcon className="h-5 w-5 mr-2 text-brand-blue"/>{course.name}</p>
                                    <p className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                                      <span className="inline-flex items-center"><CalendarIcon className="h-4 w-4 mr-1"/>{course.schedule.day}, {course.schedule.date}</span>
                                      <span className="inline-flex items-center"><ClockIcon className="h-4 w-4 mr-1"/>{course.schedule.startTime} - {course.schedule.endTime}</span>
                                    </p>
                                </div>
                                <button type="button" onClick={() => handleRemoveCourse(course.id)} className="text-red-500 hover:text-red-700">
                                    <XCircleIcon className="h-6 w-6"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="mt-4 text-center py-6 border-2 border-dashed rounded-lg text-gray-500">
                        <p>No ha seleccionado ningún curso.</p>
                        <p className="text-sm">Agregue hasta {MAX_COURSES} cursos de la lista anterior.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseSelector;