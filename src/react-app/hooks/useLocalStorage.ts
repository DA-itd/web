// Este archivo se mantiene para compatibilidad con el panel de admin
// que aún puede mostrar registros guardados localmente

import { useState } from 'react';

// Hook simple para localStorage (solo para compatibilidad del admin)
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    try {
      const valueToStore = newValue instanceof Function ? newValue(value) : newValue;
      setValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  };

  return [value, setStoredValue] as const;
}

// Tipos para registros históricos en localStorage
export interface StoredRegistration {
  id: string;
  timestamp: string;
  nombre_completo: string;
  curp: string;
  email: string;
  genero: string;
  departamento_seleccionado: string;
  cursos: Array<{
    id_curso: string;
    nombre_curso: string;
    fecha_visible: string;
    lugar: string;
    horario: string;
    periodo: string;
    tipo: string;
    horas: string;
  }>;
  created_at: string;
}

// Hook para registros históricos (solo lectura)
export function useLocalRegistrations() {
  const [registrations] = useLocalStorage<StoredRegistration[]>('inscripciones', []);

  const clearRegistrations = () => {
    localStorage.removeItem('inscripciones');
    window.location.reload();
  };

  return {
    registrations,
    clearRegistrations
  };
}
