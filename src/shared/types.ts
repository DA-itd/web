// Tipos para la aplicación de inscripciones ITD
export interface DocenteType {
  NombreCompleto: string;
  Curp?: string;
  Email?: string;
}

export interface DepartamentoType {
  NombreDepartamento: string;
}

export interface CursoType {
  Id_Curso: string;
  Nombre_curso: string;
  FechaVisible: string;
  Periodo: string;
  Horas: string;
  Lugar: string;
  Horario: string;
  Tipo: string;
}

export interface InscripcionType {
  id: string;
  nombre: string;
  curp: string;
  email: string;
  genero: 'Mujer' | 'Hombre' | 'Otro';
  departamento: string;
  cursos: string[];
}

// Validaciones básicas
export const validateCURP = (curp: string): boolean => {
  return curp.length === 18;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && 
         (email.endsWith('@itdurango.edu.mx') || email.endsWith('@gmail.com'));
};

export const validateForm = (data: Partial<InscripcionType>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  if (!data.nombre?.trim()) errors.nombre = 'Nombre es requerido';
  if (!data.curp?.trim()) errors.curp = 'CURP es requerido';
  else if (!validateCURP(data.curp)) errors.curp = 'CURP debe tener 18 caracteres';
  
  if (!data.email?.trim()) errors.email = 'Email es requerido';
  else if (!validateEmail(data.email)) {
    errors.email = 'Email debe ser del dominio @itdurango.edu.mx o @gmail.com';
  }
  
  if (!data.genero) errors.genero = 'Género es requerido';
  if (!data.departamento) errors.departamento = 'Departamento es requerido';
  if (!data.cursos || data.cursos.length === 0) errors.cursos = 'Debe seleccionar al menos 1 curso';
  if (data.cursos && data.cursos.length > 3) errors.cursos = 'Máximo 3 cursos permitidos';

  return errors;
};
