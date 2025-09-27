// This single file contains all the application logic, "bundled" together.
// This approach avoids module resolution issues in the problematic environment.

(() => {
    //================================================
    // From: services/csvApiService.ts
    //================================================
    const csvApi = (() => {
        const BASE_URL = 'https://raw.githubusercontent.com/DA-itd/web/main/';

        const parseCSV = (csvText) => {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) return [];
            
            const headers = lines[0].split(',').map(h => h.trim());
            const data = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim());
                const entry = {};
                headers.forEach((header, index) => {
                    entry[header] = values[index];
                });
                return entry;
            });
            return data;
        };

        return {
            fetchTeachers: async () => {
                const response = await fetch(`${BASE_URL}docentes.csv`);
                if (!response.ok) throw new Error('Failed to fetch teachers data');
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                return parsedData.map(t => ({
                    id: parseInt(t.id, 10),
                    name: t.name,
                    curp: t.curp || undefined,
                    email: t.email || undefined,
                    departmentId: parseInt(t.departmentId, 10),
                }));
            },
            fetchDepartments: async () => {
                const response = await fetch(`${BASE_URL}departamentos.csv`);
                if (!response.ok) throw new Error('Failed to fetch departments data');
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                return parsedData.map(d => ({
                    id: parseInt(d.id, 10),
                    name: d.name,
                }));
            },
            fetchCourses: async () => {
                const response = await fetch(`${BASE_URL}cursos.csv`);
                if (!response.ok) throw new Error('Failed to fetch courses data');
                const csvText = await response.text();
                const parsedData = parseCSV(csvText);
                return parsedData.map(c => ({
                    id: parseInt(c.id, 10),
                    name: c.name,
                    schedule: {
                        day: c.day,
                        startTime: c.startTime,
                        endTime: c.endTime,
                        date: c.date,
                    },
                    capacity: 30, // Capacidad actualizada a 30
                    registered: 0, // Contador inicial de inscritos
                }));
            },
            sendConfirmationEmail: async (data) => {
                console.log("Simulating sending email with data:", data);
                return new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000));
            }
        };
    })();

    //================================================
    // From: components/ReviewModal.tsx
    //================================================
    const ReviewModal = ({ isOpen, onCancel, onConfirm, isSubmitting, registrationData, courses }) => {
        if (!isOpen) return null;

        const PencilSquareIcon = (props) => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        );
         const XMarkIcon = (props) => (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        );

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <PencilSquareIcon className="h-12 w-12 text-brand-accent mr-4"/>
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-dark">Revisar y Confirmar</h2>
                                    <p className="text-gray-600">Verifique sus datos antes de finalizar la inscripción.</p>
                                </div>
                            </div>
                            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
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
                            <h3 className="text-lg font-semibold text-gray-800">Cursos Seleccionados</h3>
                            <ul className="mt-3 space-y-2">
                                {courses.map(course => (
                                    <li key={course.id} className="p-3 bg-gray-50 rounded-md border">
                                        <p className="font-medium text-brand-dark">{course.name}</p>
                                        <p className="text-xs text-gray-500">{course.schedule.day}, {course.schedule.date} de {course.schedule.startTime} a {course.schedule.endTime}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-8 flex justify-end space-x-4">
                            <button onClick={onCancel} className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                                Modificar
                            </button>
                            <button onClick={onConfirm} disabled={isSubmitting} className="px-6 py-2 bg-brand-blue text-white font-semibold rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isSubmitting ? 'Confirmando...' : 'Confirmar Inscripción'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    //================================================
    // From: components/ConfirmationModal.tsx
    //================================================
    const ConfirmationModal = ({ isOpen, onClose, registrationData, courses }) => {
        if (!isOpen) return null;
        
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
        const EnvelopeIcon = (props) => (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
          </svg>
        );

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                    <div className="p-8">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center">
                                <CheckCircleIcon className="h-12 w-12 text-green-500 mr-4"/>
                                <div>
                                    <h2 className="text-2xl font-bold text-brand-dark">¡Registro Exitoso!</h2>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="h-7 w-7"/>
                            </button>
                        </div>
                        
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-4">
                            <EnvelopeIcon className="h-8 w-8 text-blue-500 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="font-semibold text-blue-800">Confirmación enviada</h4>
                                <p className="text-sm text-blue-700 mt-1">
                                    Hemos enviado un correo a <strong className="font-bold">{registrationData.email}</strong> con todos los detalles de tu inscripción.
                                </p>
                                <p className="text-xs text-blue-600 mt-2 italic">
                                    Por favor, revisa tu bandeja de entrada y la carpeta de spam.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6 space-y-4">
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

    //================================================
    // From: components/CourseSelector.tsx
    //================================================
    const CourseSelector = ({ allCourses, selectedCourses, setSelectedCourses }) => {
        const { useState } = React;
        const { toast } = window; // Use global toast

        const XCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
        const PlusCircleIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
        const BookOpenIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6-2.292m0 0V21M12 6.042A8.967 8.967 0 0 1 6 3.75m0 14.25a8.967 8.967 0 0 1-5.982 2.292" /></svg>);
        const ClockIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>);
        const CalendarIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h18" /></svg>);

        const MAX_COURSES = 3;

        const checkConflict = (newCourse, existingCourses) => {
            for (const existingCourse of existingCourses) {
                if (newCourse.schedule.date === existingCourse.schedule.date) {
                    const newStart = new Date(`1970-01-01T${newCourse.schedule.startTime}`);
                    const newEnd = new Date(`1970-01-01T${newCourse.schedule.endTime}`);
                    const existingStart = new Date(`1970-01-01T${existingCourse.schedule.startTime}`);
                    const existingEnd = new Date(`1970-01-01T${existingCourse.schedule.endTime}`);
                    if (newStart < existingEnd && newEnd > existingStart) {
                        return true;
                    }
                }
            }
            return false;
        };

        const [courseToAdd, setCourseToAdd] = useState('');

        const handleAddCourse = () => {
            if (!courseToAdd) {
                toast.error('Por favor, seleccione un curso para agregar.');
                return;
            }
            const course = allCourses.find(c => c.id === parseInt(courseToAdd));
            if (!course) return;

            if (selectedCourses.length >= MAX_COURSES) {
                toast.error(`No puede registrar más de ${MAX_COURSES} cursos.`);
                return;
            }
             if (course.registered >= course.capacity) {
                toast.error(`El curso "${course.name}" ya no tiene cupo.`);
                setCourseToAdd('');
                return;
            }
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

        const handleRemoveCourse = (courseId) => {
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
                        <select id="course" value={courseToAdd} onChange={(e) => setCourseToAdd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue bg-white">
                            <option value="" disabled>Seleccione un curso</option>
                            {availableCourses.map(course => {
                                const isFull = course.registered >= course.capacity;
                                const displayText = `${course.name} (${course.registered}/${course.capacity} cupos)${isFull ? ' - LLENO' : ''}`;
                                return (<option key={course.id} value={course.id} disabled={isFull}>{displayText}</option>);
                            })}
                        </select>
                    </div>
                    <button type="button" onClick={handleAddCourse} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-accent hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent">
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

    //================================================
    // From: components/AutocompleteInput.tsx
    //================================================
    const AutocompleteInput = ({ teachers, onTeacherSelect, value, onChange }) => {
        const { useState, useRef, useEffect } = React;
        const UserIcon = (props) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>);
        
        const [suggestions, setSuggestions] = useState([]);
        const [showSuggestions, setShowSuggestions] = useState(false);
        const containerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (event) => {
                if (containerRef.current && !containerRef.current.contains(event.target)) {
                    setShowSuggestions(false);
                }
            };
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }, []);

        const handleInputChange = (e) => {
            const inputValue = e.target.value;
            onChange(e); 
            const upperInputValue = inputValue.toUpperCase();
            if (inputValue.length > 2) {
                const filtered = teachers.filter(teacher => teacher.name.toUpperCase().includes(upperInputValue));
                setSuggestions(filtered);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        };

        const handleSelect = (teacher) => {
            onTeacherSelect(teacher);
            setShowSuggestions(false);
        };

        return (
            <div className="relative" ref={containerRef}>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input type="text" name="name" id="name" value={value} onChange={handleInputChange} placeholder="Empiece a escribir su nombre..." className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" autoComplete="off" required/>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                        {suggestions.map(teacher => (
                            <li key={teacher.id} onClick={() => handleSelect(teacher)} className="cursor-pointer px-4 py-2 hover:bg-brand-lightblue">
                                {teacher.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    };

    //================================================
    // From: components/RegistrationForm.tsx
    //================================================
    const RegistrationForm = () => {
        const { useState, useEffect, useCallback } = React;
        const { toast } = window; // Use global toast

        const [teachers, setTeachers] = useState([]);
        const [departments, setDepartments] = useState([]);
        const [allCourses, setAllCourses] = useState([]);
        
        const [formData, setFormData] = useState({ name: '', curp: '', email: '', departmentId: '' });
        const [selectedCourses, setSelectedCourses] = useState([]);
        const [isSubmitting, setIsSubmitting] = useState(false);
        const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
        const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
        const [isLoading, setIsLoading] = useState(true);
        
        useEffect(() => {
            const fetchData = async () => {
                try {
                    setIsLoading(true);
                    const [teachersData, departmentsData, coursesData] = await Promise.all([
                        csvApi.fetchTeachers(),
                        csvApi.fetchDepartments(),
                        csvApi.fetchCourses(),
                    ]);
                    setTeachers(teachersData);
                    setDepartments(departmentsData);
                    setAllCourses(coursesData);
                } catch (error) {
                    toast.error('Error al cargar los datos iniciales.');
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchData();
        }, []);
        
        const handleTeacherSelect = useCallback((teacher) => {
            setFormData({
                name: teacher.name.toUpperCase(),
                curp: (teacher.curp || '').toUpperCase(),
                email: teacher.email || '',
                departmentId: teacher.departmentId.toString(),
            });
        }, []);
        
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            const finalValue = name !== 'email' ? value.toUpperCase() : value;
            setFormData(prev => ({ ...prev, [name]: finalValue }));
        };
        
        const resetForm = useCallback(() => {
            setFormData({ name: '', curp: '', email: '', departmentId: '' });
            setSelectedCourses([]);
        }, []);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (selectedCourses.length === 0) {
                toast.error('Debe seleccionar al menos un curso.');
                return;
            }
            setIsReviewModalOpen(true);
        };
        
        const handleConfirmAndSubmit = async () => {
            setIsSubmitting(true);
            const submissionData = {
                ...formData,
                department: departments.find(d => d.id === parseInt(formData.departmentId))?.name || 'N/A',
                courses: selectedCourses,
            };
            try {
                await csvApi.sendConfirmationEmail(submissionData);
                toast.success('¡Registro completado exitosamente!');
                
                const updatedCourses = allCourses.map(course => {
                    if (selectedCourses.some(sc => sc.id === course.id)) {
                        return { ...course, registered: course.registered + 1 };
                    }
                    return course;
                });
                setAllCourses(updatedCourses);
                
                setIsReviewModalOpen(false);
                setIsSuccessModalOpen(true);
            } catch (error) {
                toast.error('Hubo un error al enviar el registro.');
                console.error(error);
            } finally {
                setIsSubmitting(false);
            }
        };
        
        const handleCloseReviewModal = () => {
            setIsReviewModalOpen(false);
        };
        
        const handleCloseSuccessModal = () => {
            setIsSuccessModalOpen(false);
            resetForm();
        };

        if (isLoading) {
            return <div className="text-center p-10">Cargando...</div>;
        }

        const registrationDataForModal = {
             ...formData,
             department: departments.find(d => d.id === parseInt(formData.departmentId))?.name || 'N/A',
        };

        return (
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-gray-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-b pb-8">
                        <h2 className="text-2xl font-bold text-brand-dark col-span-1 md:col-span-2">Datos del Docente</h2>
                        <AutocompleteInput teachers={teachers} onTeacherSelect={handleTeacherSelect} value={formData.name} onChange={handleInputChange} />
                        <div>
                            <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                            <input type="text" name="curp" id="curp" value={formData.curp} onChange={handleInputChange} placeholder="CURP (Opcional)" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} placeholder="correo@ejemplo.com" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" required />
                        </div>
                        <div>
                            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                            <select name="departmentId" id="departmentId" value={formData.departmentId} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue bg-white" required>
                                <option value="" disabled>Seleccione un departamento</option>
                                {departments.map(dep => (<option key={dep.id} value={dep.id}>{dep.name}</option>))}
                            </select>
                        </div>
                    </div>
                    <CourseSelector allCourses={allCourses} selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} />
                    <div className="flex justify-end pt-6 border-t">
                        <button type="submit" disabled={isReviewModalOpen || isSuccessModalOpen} className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Finalizar Registro
                        </button>
                    </div>
                </form>
                <ReviewModal 
                  isOpen={isReviewModalOpen} 
                  onCancel={handleCloseReviewModal} 
                  onConfirm={handleConfirmAndSubmit} 
                  isSubmitting={isSubmitting} 
                  registrationData={registrationDataForModal} 
                  courses={selectedCourses} 
                />
                <ConfirmationModal 
                  isOpen={isSuccessModalOpen} 
                  onClose={handleCloseSuccessModal} 
                  registrationData={registrationDataForModal} 
                  courses={selectedCourses} 
                />
            </div>
        );
    };

    //================================================
    // From: App.tsx
    //================================================
    const App = () => {
        const { Toaster } = window; // Use global Toaster
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 font-sans">
                <Toaster position="top-center" reverseOrder={false} />
                <header className="w-full max-w-4xl mx-auto mb-8 text-center">
                    <h1 className="text-4xl font-bold text-brand-dark">Sistema de Registro de Cursos</h1>
                    <p className="text-lg text-gray-600 mt-2">Plataforma de actualización para docentes</p>
                </header>
                <main className="w-full">
                    <RegistrationForm />
                </main>
                <footer className="w-full max-w-4xl mx-auto mt-8 text-center text-gray-500 text-sm">
                    <p>&copy; 2024 Desarrollo Profesional Docente. Todos los derechos reservados.</p>
                </footer>
            </div>
        );
    };

    //================================================
    // From: index.tsx
    //================================================
    const rootElement = document.getElementById('root');
    if (!rootElement) {
        throw new Error("Could not find root element to mount to");
    }
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

})();