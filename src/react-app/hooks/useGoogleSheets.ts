import { GOOGLE_SHEETS_URL } from '@/react-app/data/csvData';

export interface GoogleSheetsRegistration {
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
}

export function useGoogleSheets() {
  const submitRegistration = async (registrationData: Omit<GoogleSheetsRegistration, 'id' | 'timestamp'>) => {
    try {
      // Generar ID único
      const id = `ITD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const timestamp = new Date().toISOString();
      
      const fullData: GoogleSheetsRegistration = {
        id,
        timestamp,
        ...registrationData
      };

      // Verificar que la URL esté configurada
      if (GOOGLE_SHEETS_URL.includes('TU_SCRIPT_ID_AQUI')) {
        console.warn('Google Sheets URL no configurada. Datos:', fullData);
        // En desarrollo, solo simular éxito
        return { success: true, id };
      }

      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData)
      });

      // Con mode: 'no-cors', no podemos leer la respuesta
      // Asumimos éxito si no hay error de red
      return { success: true, id };
      
    } catch (error) {
      console.error('Error submitting to Google Sheets:', error);
      throw new Error('Error al enviar la inscripción. Por favor intente de nuevo.');
    }
  };

  return { submitRegistration };
}
