// Fix: Defining and exporting types required by the application.
export interface ModalInfo {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'confirm' | 'alert';
    onConfirm?: () => void;
    onCancel?: () => void;
}

export interface Course {
    id: string;
    name: string;
    instructor: string;
    schedule: string;
    department: string;
}

export interface RegistrationData {
    teacherName: string;
    rfc: string;
    department: string;
    selectedCourses: Course[];
}
