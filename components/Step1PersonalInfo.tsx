import React, { useState } from 'react';
import { FormData, Teacher } from '../types.ts';
import AutocompleteInput from './AutocompleteInput.tsx';

interface Step1Props {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    departments: string[];
    teachers: Teacher[];
    onNext: () => void;
}

const Step1PersonalInfo: React.FC<Step1Props> = ({ formData, setFormData, departments, teachers, onNext }) => {
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.fullName) newErrors.fullName = "Este campo es obligatorio.";
        if (!formData.curp) newErrors.curp = "Este campo es obligatorio.";
        if (formData.curp.length < 18) newErrors.curp = "El CURP debe tener 18 caracteres.";
        if (!formData.email) newErrors.email = "Este campo es obligatorio.";
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "El formato del email no es válido.";
        if (!formData.department) newErrors.department = "Este campo es obligatorio.";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onNext();
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue = value;

        if (name === 'email') {
            finalValue = value.toLowerCase();
        } else if (name === 'curp' || name === 'fullName') {
            finalValue = value.toUpperCase();
        }

        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleTeacherSelect = (teacher: Teacher) => {
        const { nombreCompleto, curp, email } = teacher;
        setFormData(prev => ({
            ...prev,
            fullName: (nombreCompleto || '').toUpperCase(),
            curp: curp || '',
            email: email || '',
        }));
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Información Personal</h2>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nombre Completo *</label>
                        <AutocompleteInput 
                            teachers={teachers} 
                            onSelect={handleTeacherSelect} 
                            value={formData.fullName}
                            onChange={handleChange}
                            name="fullName"
                            placeholder="Escriba su nombre completo"
                        />
                        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label htmlFor="curp" className="block text-sm font-medium text-gray-700">CURP *</label>
                        <input type="text" name="curp" id="curp" value={formData.curp} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="18 caracteres" maxLength={18} required />
                        {errors.curp && <p className="text-red-500 text-xs mt-1">{errors.curp}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Institucional *</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="nombre@itdurango.edu.mx" required />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Género *</label>
                        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
                            <option>Mujer</option>
                            <option>Hombre</option>
                            <option>Otro</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento *</label>
                        <select name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" required>
                            <option value="">Seleccione un departamento</option>
                            {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                        </select>
                        {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
                    </div>
                </div>
                <div className="mt-8 flex justify-end">
                    <button type="submit" className="bg-rose-800 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-700">Continuar</button>
                </div>
            </form>
        </div>
    );
};

export default Step1PersonalInfo;