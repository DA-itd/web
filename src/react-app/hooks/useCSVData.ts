import { useState, useEffect } from 'react';
import type { DocenteType, DepartamentoType, CursoType } from '@/shared/types';
import { 
  loadDataFromGitHub, 
  docentesDataFallback, 
  departamentosDataFallback, 
  cursosDataFallback 
} from '@/react-app/data/csvData';

export function useCSVData() {
  const [docentes, setDocentes] = useState<DocenteType[]>([]);
  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [cursos, setCursos] = useState<CursoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Cargando datos desde GitHub...');
        
        // Intentar cargar datos desde GitHub
        const data = await loadDataFromGitHub();
        
        console.log('Datos cargados desde GitHub:', {
          docentes: data.docentes.length,
          departamentos: data.departamentos.length,
          cursos: data.cursos.length
        });
        
        setDocentes(data.docentes);
        setDepartamentos(data.departamentos);
        setCursos(data.cursos);
        setUsingFallback(false);
        
      } catch (err) {
        console.warn('Error al cargar desde GitHub, usando datos de respaldo:', err);
        
        // Si falla GitHub, usar datos de respaldo
        setDocentes(docentesDataFallback);
        setDepartamentos(departamentosDataFallback);
        setCursos(cursosDataFallback);
        setUsingFallback(true);
        
        setError('No se pudieron cargar los datos más recientes desde GitHub. Usando datos de respaldo.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { 
    docentes, 
    departamentos, 
    cursos, 
    loading, 
    error, 
    usingFallback 
  };
}
