
import React, { useState, useEffect, useMemo } from 'react';
import type { FormData, Department, Teacher } from '../types';
import AutocompleteInput from './AutocompleteInput';

interface Props {
    formData: FormData;
    updateFormData: (data: Partial<FormData>) => void;
    departments: Department[];
    teachers: Teacher[];
    onNext: () => void;
}

const Step1PersonalInfo: React.FC<Props> = ({ formData, updateFormData, departments, teachers, onNext }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});

    const teacherNames = useMemo(() => teachers.map(t => t.nombreCompleto), [teachers]);
    
    const handleSelectTeacher = (name: string) => {
        const teacher = teachers.find(t => t.nombreCompleto === name);
        if (teacher) {
            updateFormData({
                fullName: teacher.nombreCompleto.toUpperCase(),
                curp: teacher.curp || '',
                email: teacher.email || ''
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let processedValue = value;
        if (name === 'fullName' || name === 'curp') {
            processedValue = value.toUpperCase();
        }
        updateFormData({ [name]: processedValue });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'El nombre completo es obligatorio.';
        if (!formData.curp.trim()) {
            newErrors.curp = 'El CURP es obligatorio.';
        } else if (formData.curp.length !== 18) {
            newErrors.curp = 'El CURP debe tener 18 caracteres.';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio.';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El formato del email no es válido.';
        }
        if (!formData.gender) newErrors.gender = 'Seleccione un género.';
        if (!formData.department) newErrors.department = 'Seleccione un departamento.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validate()) {
            onNext();
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                    <AutocompleteInput
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        onSelect={handleSelectTeacher}
                        suggestions={teacherNames}
                        placeholder="Escriba su nombre completo"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                    <label htmlFor="curp" className="block text-sm font-medium text-gray-700 mb-1">CURP *</label>
                    <input
                        type="text"
                        id="curp"
                        name="curp"
                        value={formData.curp}
                        onChange={handleChange}
                        maxLength={18}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="18 caracteres"
                    />
                    {errors.curp && <p className="text-red-500 text-xs mt-1">{errors.curp}</p>}
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Institucional *</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="nombre@itdurango.edu.mx"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Género *</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="Mujer">Mujer</option>
                        <option value="Hombre">Hombre</option>
                        <option value="Otro">Otro</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
                    <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Seleccione un departamento</option>
                        {departments.map(d => <option key={d.departamento} value={d.departamento}>{d.departamento}</option>)}
                    </select>
                    {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                </div>
            </div>
            <div className="mt-8 text-right">
                <button
                    onClick={handleNext}
                    className="bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default Step1PersonalInfo;