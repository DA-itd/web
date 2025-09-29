// URL de Google Apps Script para enviar inscripciones
export const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID_AQUI/exec';

// URLs de las bases de datos en GitHub
export const CSV_URLS = {
  docentes: 'https://raw.githubusercontent.com/DA-itd/DA-itd-web/refs/heads/main/docentes.csv',
  departamentos: 'https://raw.githubusercontent.com/DA-itd/DA-itd-web/refs/heads/main/departamentos.csv',
  cursos: 'https://raw.githubusercontent.com/DA-itd/DA-itd-web/refs/heads/main/cursos.csv'
};

// Función para parsear CSV
export function parseCSV(csvText: string): any[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
    if (values.length === headers.length) {
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
}

// Función para cargar datos desde GitHub
export async function loadDataFromGitHub() {
  try {
    const [docentesResponse, departamentosResponse, cursosResponse] = await Promise.all([
      fetch(CSV_URLS.docentes),
      fetch(CSV_URLS.departamentos),
      fetch(CSV_URLS.cursos)
    ]);

    if (!docentesResponse.ok || !departamentosResponse.ok || !cursosResponse.ok) {
      throw new Error('Error al cargar datos desde GitHub');
    }

    const [docentesCSV, departamentosCSV, cursosCSV] = await Promise.all([
      docentesResponse.text(),
      departamentosResponse.text(),
      cursosResponse.text()
    ]);

    const docentes = parseCSV(docentesCSV);
    const departamentos = parseCSV(departamentosCSV);
    const cursos = parseCSV(cursosCSV);

    return {
      docentes,
      departamentos,
      cursos
    };
  } catch (error) {
    console.error('Error loading data from GitHub:', error);
    throw error;
  }
}

// Datos de respaldo (fallback) en caso de error al cargar desde GitHub
export const docentesDataFallback = [
  { NombreCompleto: "MARIA ELENA GONZALEZ LOPEZ", Curp: "GOLM850615MDFLPR03", Email: "maria.gonzalez@itdurango.edu.mx" },
  { NombreCompleto: "JOSE CARLOS MARTINEZ PEREZ", Curp: "MAPJ800420HDFRRS08", Email: "jose.martinez@itdurango.edu.mx" },
  { NombreCompleto: "ANA PATRICIA RODRIGUEZ SILVA", Curp: "ROSA751130MDFDRN07", Email: "ana.rodriguez@itdurango.edu.mx" },
  { NombreCompleto: "LUIS FERNANDO HERNANDEZ GARCIA", Curp: "HEGL850320HDFRRR05", Email: "luis.hernandez@itdurango.edu.mx" },
  { NombreCompleto: "CARMEN SOFIA MORALES TORRES", Curp: "MOTC790815MDFRMR02", Email: "carmen.morales@itdurango.edu.mx" },
  { NombreCompleto: "RICARDO ALEJANDRO RUIZ MENDEZ", Curp: "RUMR820705HDFZND09", Email: "ricardo.ruiz@itdurango.edu.mx" },
  { NombreCompleto: "LAURA BEATRIZ JIMENEZ CASTRO", Curp: "JICL881012MDFMSR04", Email: "laura.jimenez@itdurango.edu.mx" },
  { NombreCompleto: "PEDRO ANTONIO SANCHEZ FLORES", Curp: "SAFP830228HDFNLR01", Email: "pedro.sanchez@itdurango.edu.mx" },
  { NombreCompleto: "SILVIA GUADALUPE VARGAS LUNA", Curp: "VALS870503MDFRRN08", Email: "silvia.vargas@itdurango.edu.mx" },
  { NombreCompleto: "MIGUEL ANGEL TORRES RAMIREZ", Curp: "TORM810918HDFRMG06", Email: "miguel.torres@itdurango.edu.mx" },
];

export const departamentosDataFallback = [
  { NombreDepartamento: "DEPARTAMENTO DE SISTEMAS Y COMPUTACIÓN" },
  { NombreDepartamento: "DEPARTAMENTO DE INGENIERÍA INDUSTRIAL" },
  { NombreDepartamento: "DEPARTAMENTO DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA" },
  { NombreDepartamento: "DEPARTAMENTO DE INGENIERÍA MECÁNICA" },
  { NombreDepartamento: "DEPARTAMENTO DE INGENIERÍA QUÍMICA Y BIOQUÍMICA" },
  { NombreDepartamento: "DEPARTAMENTO DE CIENCIAS BÁSICAS" },
  { NombreDepartamento: "DEPARTAMENTO DE DESARROLLO ACADÉMICO" },
  { NombreDepartamento: "DEPARTAMENTO DE GESTIÓN TECNOLÓGICA Y VINCULACIÓN" },
];

export const cursosDataFallback = [
  {
    Id_Curso: "CAD-001",
    Nombre_curso: "Metodologías Ágiles en el Desarrollo de Software",
    FechaVisible: "13 al 17 de enero de 2025",
    Periodo: "PERIODO_1",
    Horas: "40",
    Lugar: "Laboratorio de Cómputo A",
    Horario: "8:00 a 12:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-002",
    Nombre_curso: "Inteligencia Artificial Aplicada a la Educación",
    FechaVisible: "13 al 17 de enero de 2025",
    Periodo: "PERIODO_1",
    Horas: "40",
    Lugar: "Laboratorio de Cómputo B",
    Horario: "14:00 a 18:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-003",
    Nombre_curso: "Diseño Instruccional para Entornos Virtuales",
    FechaVisible: "20 al 24 de enero de 2025",
    Periodo: "PERIODO_1",
    Horas: "40",
    Lugar: "Aula Virtual",
    Horario: "8:00 a 12:00",
    Tipo: "Virtual"
  },
  {
    Id_Curso: "CAD-004",
    Nombre_curso: "Evaluación por Competencias",
    FechaVisible: "20 al 24 de enero de 2025",
    Periodo: "PERIODO_1",
    Horas: "40",
    Lugar: "Sala de Conferencias",
    Horario: "14:00 a 18:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-005",
    Nombre_curso: "Tecnologías Emergentes en Ingeniería",
    FechaVisible: "27 al 31 de enero de 2025",
    Periodo: "PERIODO_1",
    Horas: "40",
    Lugar: "Laboratorio de Ingeniería",
    Horario: "8:00 a 12:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-006",
    Nombre_curso: "Innovación y Emprendimiento Tecnológico",
    FechaVisible: "3 al 7 de febrero de 2025",
    Periodo: "PERIODO_2",
    Horas: "40",
    Lugar: "Centro de Innovación",
    Horario: "8:00 a 12:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-007",
    Nombre_curso: "Sustentabilidad en Procesos Industriales",
    FechaVisible: "3 al 7 de febrero de 2025",
    Periodo: "PERIODO_2",
    Horas: "40",
    Lugar: "Laboratorio de Química",
    Horario: "14:00 a 18:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-008",
    Nombre_curso: "Gestión de Proyectos con Metodologías PMI",
    FechaVisible: "10 al 14 de febrero de 2025",
    Periodo: "PERIODO_2",
    Horas: "40",
    Lugar: "Aula Magna",
    Horario: "8:00 a 12:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-009",
    Nombre_curso: "Comunicación Efectiva y Liderazgo",
    FechaVisible: "10 al 14 de febrero de 2025",
    Periodo: "PERIODO_2",
    Horas: "40",
    Lugar: "Sala de Juntas",
    Horario: "14:00 a 18:00",
    Tipo: "Presencial"
  },
  {
    Id_Curso: "CAD-010",
    Nombre_curso: "Análisis de Datos y Business Intelligence",
    FechaVisible: "17 al 21 de febrero de 2025",
    Periodo: "PERIODO_2",
    Horas: "40",
    Lugar: "Laboratorio de Cómputo C",
    Horario: "8:00 a 12:00",
    Tipo: "Presencial"
  }
];
