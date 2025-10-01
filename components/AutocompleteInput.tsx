import React, { useState, useEffect } from 'react';
import { Teacher } from '../types';

interface AutocompleteProps {
    teachers: Teacher[];
    onSelect: (teacher: Teacher) => void;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    placeholder?: string;
}

const AutocompleteInput: React.FC<AutocompleteProps> = ({ teachers, onSelect, value, onChange, name, placeholder }) => {
    const [suggestions, setSuggestions] = useState<Teacher[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (value && value.length > 2) {
            const filteredTeachers = teachers.filter(teacher =>
                teacher.nombreCompleto.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(filteredTeachers);
            setShowSuggestions(filteredTeachers.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [value, teachers]);

    const handleSelect = (teacher: Teacher) => {
        onSelect(teacher);
        setShowSuggestions(false);
    };

    const handleFocus = () => {
      // Show suggestions on focus only if they already exist for the current value
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    };

    return (
        <div className="relative">
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder || "Escriba su nombre completo"}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-auto">
                    {suggestions.map((teacher) => (
                        <li
                            key={teacher.curp || teacher.nombreCompleto}
                            onMouseDown={() => handleSelect(teacher)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {teacher.nombreCompleto}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;