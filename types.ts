export interface Teacher {
  nombreCompleto: string;
  curp: string;
  email: string;
}

export interface Course {
  id: string;
  name: string;
  dates: string;
  period: string;
  hours?: number;
  location: string;
  schedule: string;
  type: string;
}

export interface FormData {
  fullName: string;
  curp: string;
  email: string;
  gender: string;
  department: string;
  selectedCourses: string[];
}

export interface RegistrationResult {
  courseName: string;
  registrationId: string;
}

// FIX: Omitted 'selectedCourses' from FormData to avoid type conflict.
export interface SubmissionData extends Omit<FormData, 'selectedCourses'> {
  timestamp: string;
  selectedCourses: {
    id: string;
    name: string;
    dates: string;
    location: string;
    schedule: string;
  }[];
}