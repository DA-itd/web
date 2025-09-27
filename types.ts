
export interface Teacher {
  id: number;
  name: string;
  curp?: string;
  email?: string;
  departmentId: number;
}

export interface Department {
  id: number;
  name:string;
}

export interface Course {
  id: number;
  name: string;
  schedule: {
    day: 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';
    startTime: string; // "HH:mm"
    endTime: string; // "HH:mm"
    date: string; // "YYYY-MM-DD"
  };
}
