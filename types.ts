
export interface Departamento {
    id: string;
    nombre: string;
}

export interface Docente {
    id: string; // Corresponds to Firebase Auth UID
    nombreCompleto: string;
    curp: string;
    email: string;
    genero: 'Masculino' | 'Femenino' | 'Otro';
    departamentoId: string;
}

export interface Curso {
    id: string;
    nombre: string;
    fecha: string; // Using string for simplicity, can be parsed
    horario: string;
    tipo: 'Presencial' | 'En línea' | 'Híbrido';
    idCurso: number; // The 'XX' part for the registration ID
}

export interface Inscripcion {
    id: string; // Firestore document ID
    docenteId: string;
    cursoId: string;
    idRegistro: string; // The unique 'TNM-054-XX-2026-WW' ID
    fechaInscripcion: any; // Firestore Timestamp
    curso?: Curso; // Optional: populated for 'My Courses' view
}
