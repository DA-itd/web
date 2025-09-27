import React, { useState, useRef, useEffect } from 'react';
import type { Teacher } from '../types.ts';
import { UserIcon } from '@heroicons/react/24/outline';

interface AutocompleteInputProps {
    teachers: Teacher[];
    onTeacherSelect: (teacher: Teacher) => void;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ teachers, onTeacherSelect, value, onChange }) => {
    const [suggestions, setSuggestions] = useState<Teacher[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        onChange(e); // Propagate change to parent which handles state and uppercasing

        // Use uppercase for filtering to ensure case-insensitivity
        const upperInputValue = inputValue.toUpperCase();

        if (inputValue.length > 2) {
            const filtered = teachers.filter(teacher =>
                teacher.name.toUpperCase().includes(upperInputValue) // Compare uppercase against uppercase
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSelect = (teacher: Teacher) => {
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
                <input
                    type="text"
                    name="name"
                    id="name"
                    value={value}
                    onChange={handleInputChange}
                    placeholder="Empiece a escribir su nombre..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue"
                    autoComplete="off"
                    required
                />
            </div>
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                    {suggestions.map(teacher => (
                        <li
                            key={teacher.id}
                            onClick={() => handleSelect(teacher)}
                            className="cursor-pointer px-4 py-2 hover:bg-brand-lightblue"
                        >
                            {teacher.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteInput;