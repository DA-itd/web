import { useState, useEffect } from 'react';
import type { DocenteType } from '@/shared/types';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onDocenteSelect: (docente: DocenteType) => void;
  docentes: DocenteType[];
  placeholder: string;
  className?: string;
}

export default function AutocompleteInput({
  value,
  onChange,
  onDocenteSelect,
  docentes,
  placeholder,
  className = ''
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<DocenteType[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (value.length >= 2) {
      const filtered = docentes.filter(docente =>
        docente.NombreCompleto.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [value, docentes]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.toUpperCase();
    onChange(newValue);
  };

  const handleSuggestionClick = (docente: DocenteType) => {
    onChange(docente.NombreCompleto);
    onDocenteSelect(docente);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      />
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((docente, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(docente)}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              <div className="font-medium">{docente.NombreCompleto}</div>
              {docente.Email && (
                <div className="text-sm text-gray-600">{docente.Email}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
