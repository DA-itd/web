// Fix: Implementing the main App component with form logic, state management, and data fetching.
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import { getCourses, submitRegistration } from './services/dataService';
import { Course, ModalInfo, RegistrationData } from './types';

const App: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [teacherName, setTeacherName] = useState('');
    const [rfc, setRfc] = useState('');
    const [department, setDepartment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalInfo, setModalInfo] = useState<ModalInfo>({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert',
    });

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setModalInfo({
                    isOpen: true,
                    title: 'Error',
                    message: 'No se pudieron cargar los cursos. Por favor, intente de nuevo más tarde.',
                    type: 'alert',
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const resetForm = useCallback(() => {
        setTeacherName('');
        setRfc('');
        setDepartment('');
        setSelectedCourses([]);
        // Uncheck all checkboxes
        const checkboxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
    }, []);

    const handleCourseChange = (course: Course) => {
        setSelectedCourses(prev =>
            prev.some(c => c.id === course.id)
                ? prev.filter(c => c.id !== course.id)
                : [...prev, course]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedCourses.length === 0) {
            setModalInfo({
                isOpen: true,
                title: 'Información Incompleta',
                message: 'Debe seleccionar al menos un curso para registrarse.',
                type: 'alert',
            });
            return;
        }

        setIsSubmitting(true);
        const registrationData: RegistrationData = {
            teacherName,
            rfc,
            department,
            selectedCourses,
        };

        try {
            const response = await submitRegistration(registrationData);
            if (response.success) {
                setModalInfo({
                    isOpen: true,
                    title: 'Registro Exitoso',
                    message: `Se ha registrado a <b>${teacherName}</b> exitosamente. ¿Desea realizar otro registro?`,
                    type: 'confirm',
                    onConfirm: resetForm, // "Sí, agregar otro"
                    onCancel: () => {},   // "No, finalizar" - just closes modal
                });
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            setModalInfo({
                isOpen: true,
                title: 'Error en el Registro',
                message: error instanceof Error ? error.message : 'Ocurrió un error inesperado.',
                type: 'alert',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setModalInfo(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <main className="container mx-auto p-4 md:p-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 max-w-4xl mx-auto">
                    <Header />
                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <fieldset className="space-y-4 border p-4 rounded-lg">
                            <legend className="text-lg font-semibold px-2">Datos del Docente</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="teacherName" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        id="teacherName"
                                        value={teacherName}
                                        onChange={(e) => setTeacherName(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="rfc" className="block text-sm font-medium text-gray-700 mb-1">RFC</label>
                                    <input
                                        type="text"
                                        id="rfc"
                                        value={rfc}
                                        onChange={(e) => setRfc(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Departamento de Adscripción</label>
                                <input
                                    type="text"
                                    id="department"
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        </fieldset>

                        <fieldset className="space-y-4 border p-4 rounded-lg">
                            <legend className="text-lg font-semibold px-2">Cursos Disponibles</legend>
                            {isLoading ? (
                                <p>Cargando cursos...</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {courses.map(course => (
                                        <div key={course.id} className="flex items-start bg-gray-50 p-3 rounded-lg border">
                                            <input
                                                type="checkbox"
                                                id={course.id}
                                                onChange={() => handleCourseChange(course)}
                                                className="h-5 w-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <div className="ml-3 text-sm">
                                                <label htmlFor={course.id} className="font-bold text-gray-900">{course.name}</label>
                                                <p className="text-gray-600">Instructor: {course.instructor}</p>
                                                <p className="text-gray-600">Horario: {course.schedule}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </fieldset>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition duration-150"
                            >
                                {isSubmitting ? 'Registrando...' : 'Registrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            <Modal modalInfo={modalInfo} closeModal={closeModal} />
        </div>
    );
};

export default App;
