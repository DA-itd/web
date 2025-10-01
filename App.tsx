import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Stepper from './components/Stepper';
import Step1PersonalInfo from './components/Step1PersonalInfo';
import Step2CourseSelection from './components/Step2CourseSelection';
import Step3Confirmation from './components/Step3Confirmation';
import Step4Success from './components/Step4Success';
import { loadInitialData, submitRegistration } from './services/api';
import { FormData, Course, Teacher } from './types';

declare global {
  interface Window {
    CONFIG: {
      APPS_SCRIPT_URL: string;
    }
  }
}

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    curp: '',
    email: '',
    gender: 'Mujer',
    department: '',
    selectedCourses: [],
  });

  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departments, setDepartments] = useState<string[]>([
      "DEPARTAMENTO DE SISTEMAS Y COMPUTACION",
      "DEPARTAMENTO DE INGENIERÍA ELÉCTRICA Y ELECTRÓNICA",
      "DEPARTAMENTO DE CIENCIAS ECONOMICO-ADMINISTRATIVAS",
      "DEPARTAMENTO DE INGENIERÍA QUÍMICA-BIOQUÍMICA",
      "DEPARTAMENTO DE CIENCIAS DE LA TIERRA",
      "DEPARTAMENTO DE CIENCIAS BASICAS",
      "DEPARTAMENTO DE METAL-MECÁNICA",
      "DEPARTAMENTO DE INGENIERÍA INDUSTRIAL",
      "DIVISION DE ESTUDIOS DE POSGRADO E INVESTIGACION",
      "ADMINISTRATIVO",
      "EXTERNO"
  ]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { courses, teachers } = await loadInitialData();
        setCourses(courses);
        setTeachers(teachers);
      } catch (err: any) {
        console.error("Error loading initial data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    setError(null);
    try {
      const response = await submitRegistration(formData, courses);
      if (response.status === 'success' && response.registrationId) {
        setFormData(prev => ({ ...prev, registrationId: response.registrationId }));
        setStep(4);
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1PersonalInfo
            formData={formData}
            setFormData={setFormData}
            departments={departments}
            teachers={teachers}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <Step2CourseSelection
            courses={courses}
            selectedCourses={courses.filter(c => formData.selectedCourses.includes(c.id))}
            setSelectedCourses={(selected) => {
              const selectedIds = selected.map(c => c.id);
              setFormData(prev => ({ ...prev, selectedCourses: selectedIds }));
            }}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3Confirmation
            formData={formData}
            courses={courses.filter(c => formData.selectedCourses.includes(c.id))}
            onBack={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        );
      case 4:
        return <Step4Success registrationId={formData.registrationId || ''} />;
      default:
        return null;
    }
  };

  const steps = ["Información Personal", "Selección de Cursos", "Confirmación", "Registro Completo"];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="border-b-8 border-blue-800" />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper currentStep={step} steps={steps} />
        {loading ? (
          <div className="text-center text-gray-500">Cargando datos...</div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-4xl mx-auto" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            {renderStep()}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;