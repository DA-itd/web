// FIX: Add React to import to resolve namespace errors.
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import Stepper from './components/Stepper.tsx';
import Step1PersonalInfo from './components/Step1PersonalInfo.tsx';
import Step2CourseSelection from './components/Step2CourseSelection.tsx';
import Step3Confirmation from './components/Step3Confirmation.tsx';
import Step4Success from './components/Step4Success.tsx';
import { FormData, Course, Teacher, RegistrationResult, SubmissionData } from './types.ts';
import { getTeachers, getCourses, getDepartments, submitRegistration } from './services/api.ts';

const initialFormData: FormData = {
    fullName: '',
    curp: '',
    email: '',
    gender: 'Mujer',
    department: '',
    selectedCourses: []
};

const App: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
    const [registrationResult, setRegistrationResult] = useState<RegistrationResult[]>([]);

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [teachersData, coursesData, departmentsData] = await Promise.all([
                    getTeachers(),
                    getCourses(),
                    getDepartments()
                ]);
                setTeachers(teachersData);
                setCourses(coursesData);
                setDepartments(departmentsData);
            } catch (err) {
                setError("No se pudieron cargar los datos necesarios para la inscripción. Por favor, intente de nuevo más tarde.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const steps = ["Información Personal", "Selección de Cursos", "Confirmación", "Registro Exitoso"];

    const handleNext = () => setCurrentStep(prev => prev + 1);
    const handleBack = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async () => {
        const submissionData: SubmissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            selectedCourses: selectedCourses.map(c => ({
                id: c.id,
                name: c.name,
                dates: c.dates,
                location: c.location,
                schedule: c.schedule,
            })),
        };

        // Update formData to store just the IDs, matching the type definition
        const updatedFormData = { ...formData, selectedCourses: selectedCourses.map(c => c.id) };
        setFormData(updatedFormData);

        try {
            const result = await submitRegistration(submissionData);
            setRegistrationResult(result);
            handleNext();
        } catch (error) {
            console.error("Error submitting registration:", error);
            setError("Hubo un error al procesar su registro. Intente de nuevo.");
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1PersonalInfo formData={formData} setFormData={setFormData} departments={departments} teachers={teachers} onNext={handleNext} />;
            case 2:
                return <Step2CourseSelection courses={courses} selectedCourses={selectedCourses} setSelectedCourses={setSelectedCourses} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Step3Confirmation formData={formData} courses={selectedCourses} onBack={handleBack} onSubmit={handleSubmit} />;
            case 4:
                return <Step4Success registrationResult={registrationResult} applicantName={formData.fullName} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Stepper currentStep={currentStep} steps={steps} />
                <div className="mt-8">
                    {isLoading ? (
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-700">Cargando datos...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    ) : (
                        renderStep()
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;