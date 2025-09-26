// types.ts

export interface Docente {
    NombreCompleto: string;
    Curp: string;
    Email: string;
}

export interface Course {
    NombreCurso: string;
    FechaVisible: string;
    Lugar: string;
    Horario: string;
    Codigo: string;
    Capacidad: number;
    Inscritos: number;
}

export interface RegisteredCourse {
    nombreCompleto: string;
    curp: string;
    email: string;
    genero: string;
    departamento: string;
    cursoSeleccionado: string;
    fechaVisible: string;
    lugar: string;
    horario: string;
    codigoInscripcion: string;
}

export interface ModalInfo {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm?: () => void;
    onCancel?: () => void;
}
