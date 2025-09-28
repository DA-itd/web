import React, { useState, useEffect, useCallback } from 'react';
// FIX: Import toast from react-hot-toast to display notifications.
import toast from 'react-hot-toast';
import type { Teacher, Department, Course } from '../types.ts';
import api from '../services/csvApiService.ts';
import AutocompleteInput from './AutocompleteInput.tsx';
import CourseSelector from './CourseSelector.tsx';
import ConfirmationModal from './ConfirmationModal.tsx';

const RegistrationForm = () => {
    // State for data
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    
    // State for form
    const [formData, setFormData] = useState({
        name: '',
        curp: '',
        email: '',
        departmentId: '',
    });
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [teachersData, departmentsData, coursesData] = await Promise.all([
                    api.fetchTeachers(),
                    api.fetchDepartments(),
                    api.fetchCourses(),
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
    
    const handleTeacherSelect = useCallback((teacher: Teacher) => {
        setFormData({
            name: teacher.name.toUpperCase(),
            curp: (teacher.curp || '').toUpperCase(),
            email: teacher.email || '',
            departmentId: teacher.departmentId.toString(),
        });
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name !== 'email' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };
    
    const resetForm = useCallback(() => {
        setFormData({ name: '', curp: '', email: '', departmentId: '' });
        setSelectedCourses([]);
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (selectedCourses.length === 0) {
            toast.error('Debe seleccionar al menos un curso.');
            return;
        }

        setIsSubmitting(true);
        const submissionData = {
            ...formData,
            department: departments.find(d => d.id === parseInt(formData.departmentId))?.name || 'N/A',
            courses: selectedCourses,
        };

        try {
            await api.sendConfirmationEmail(submissionData);
            toast.success('¡Registro completado exitosamente!');
            setIsModalOpen(true);
            // Don't reset form here, data is needed for the modal
        } catch (error) {
            toast.error('Hubo un error al enviar el registro.');
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        resetForm();
    };

    if (isLoading) {
        return <div className="text-center p-10">Cargando...</div>;
    }

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 border-b pb-8">
                     <h2 className="text-2xl font-bold text-brand-dark col-span-1 md:col-span-2">Datos del Docente</h2>
                    <AutocompleteInput 
                        teachers={teachers} 
                        onTeacherSelect={handleTeacherSelect}
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    <div>
                        <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-1">CURP</label>
                        <input
                            type="text"
                            name="curp"
                            id="curp"
                            value={formData.curp}
                            onChange={handleInputChange}
                            placeholder="CURP (Opcional)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                         <input
                            type="email"
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="correo@ejemplo.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                        <select
                            name="departmentId"
                            id="departmentId"
                            value={formData.departmentId}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue bg-white"
                            required
                        >
                            <option value="" disabled>Seleccione un departamento</option>
                            {departments.map(dep => (
                                <option key={dep.id} value={dep.id}>{dep.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <CourseSelector 
                    allCourses={allCourses}
                    selectedCourses={selectedCourses}
                    setSelectedCourses={setSelectedCourses}
                />
                
                <div className="flex justify-end pt-6 border-t">
                    <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto inline-flex justify-center items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Registrando...' : 'Finalizar Registro'}
                    </button>
                </div>
            </form>
            
            <ConfirmationModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                registrationData={{
                    ...formData,
                    department: departments.find(d => d.id === parseInt(formData.departmentId))?.name || 'N/A',
                }}
                courses={selectedCourses}
            />
        </div>
    );
};

export default RegistrationForm;