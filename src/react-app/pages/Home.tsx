import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '@/react-app/components/Header';
import Footer from '@/react-app/components/Footer';
import AutocompleteInput from '@/react-app/components/AutocompleteInput';
import CourseCard from '@/react-app/components/CourseCard';
import type { DocenteType, InscripcionType, DepartamentoType, CursoType } from '@/shared/types';

// TODO: Reemplaza esta URL con la tuya
const API_URL = 'https://script.google.com/macros/s/AKfycbw80C0X4JpzMSnF7sZgD6-TiLAgg5RJEVPKaqYXbrYAoyhOpwRF-JuI0m1rXFH6rUI/exec';

export default function Home() {
  const [docentes, setDocentes] = useState<DocenteType[]>([]);
  const [departamentos, setDepartamentos] = useState<DepartamentoType[]>([]);
  const [cursos, setCursos] = useState<CursoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InscripcionType>>({
    nombre_completo: '',
    curp: '',
    email_institucional: '',
    departamento: '',
    telefono: '',
    cursos_seleccionados: [],
    id: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(API_URL, { method: 'GET' });
        if (!response.ok) {
          throw new Error('Error al cargar los datos del servidor.');
        }
        const data = await response.json();
        setDocentes(data.docentes);
        setDepartamentos(data.departamentos);
        setCursos(data.cursos);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('No se pudieron cargar los datos. Por favor, intente de nuevo más tarde.');
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const generateUniqueId = () => {
    const courseCount = formData.cursos_seleccionados?.length || 0;
    const consecutivo = Math.floor(Math.random() * 30) + 1;
    return `TNM-054-${courseCount.toString().padStart(2, '0')}-2026-${consecutivo.toString().padStart(2, '0')}`;
  };

  const handleDocenteSelect = (docente: DocenteType) => {
    setFormData(prev => ({
      ...prev,
      nombre_completo: docente.NombreCompleto,
      curp: docente.Curp,
      email_institucional: docente.Email,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseToggle = (cursoId: string) => {
    setFormData(prev => {
      const selectedCourses = prev.cursos_seleccionados || [];
      const newCourses = selectedCourses.includes(cursoId)
        ? selectedCourses.filter(id => id !== cursoId)
        : [...selectedCourses, cursoId];
      return {
        ...prev,
        cursos_seleccionados: newCourses,
      };
    });
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.nombre_completo) errors.nombre_completo = 'El nombre es obligatorio.';
    if (!formData.curp) errors.curp = 'La CURP es obligatoria.';
    if (!formData.email_institucional) errors.email_institucional = 'El correo institucional es obligatorio.';
    if (!formData.departamento) errors.departamento = 'El departamento es obligatorio.';
    if (!formData.telefono) errors.telefono = 'El teléfono es obligatorio.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.cursos_seleccionados || formData.cursos_seleccionados.length === 0) {
      errors.cursos_seleccionados = 'Debe seleccionar al menos un curso.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    }
  };

  const handleReviewStep = () => {
    if (validateStep2()) {
      setFormData(prev => ({
        ...prev,
        id: generateUniqueId(),
      }));
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Google Apps Script responde con una respuesta opaca en modo 'no-cors'
      // El éxito se determina si no hay errores en la petición.
      if (response) {
        setCurrentStep(4);
      } else {
        throw new Error('No se pudo completar el registro. Intente de nuevo.');
      }
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
      setError('Hubo un error al guardar la inscripción. Por favor, intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const selectedCoursesData = cursos.filter(curso => formData.cursos_seleccionados?.includes(curso.Id_Curso));

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto py-12 px-4">
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-6">
            <div className={`flex flex-col items-center relative ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-current'}`}>1</div>
              <span className="mt-2 text-sm font-medium hidden sm:block">Datos Personales</span>
            </div>
            <div className={`flex-1 w-24 h-1 rounded-full ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center relative ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-current'}`}>2</div>
              <span className="mt-2 text-sm font-medium hidden sm:block">Selección de Cursos</span>
            </div>
            <div className={`flex-1 w-24 h-1 rounded-full ${currentStep > 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex flex-col items-center relative ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-colors ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-white border-2 border-current'}`}>3</div>
              <span className="mt-2 text-sm font-medium hidden sm:block">Revisar y Confirmar</span>
            </div>
          </div>
        </div>
        
        {/* Step 1: Personal Data */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">1. Datos Personales</h2>
            
            <div>
              <label htmlFor="nombre" className="block text-gray-700 font-medium mb-2">Nombre Completo</label>
              <AutocompleteInput
                value={formData.nombre_completo || ''}
                onChange={value => setFormData(prev => ({ ...prev, nombre_completo: value }))}
                onDocenteSelect={handleDocenteSelect}
                docentes={docentes}
                placeholder="Busca por tu nombre completo..."
              />
              {formErrors.nombre_completo && <p className="text-red-500 text-sm mt-1">{formErrors.nombre_completo}</p>}
            </div>

            <div>
              <label htmlFor="curp" className="block text-gray-700 font-medium mb-2">CURP</label>
              <input
                type="text"
                id="curp"
                name="curp"
                value={formData.curp || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingrese su CURP"
              />
              {formErrors.curp && <p className="text-red-500 text-sm mt-1">{formErrors.curp}</p>}
            </div>

            <div>
              <label htmlFor="email_institucional" className="block text-gray-700 font-medium mb-2">Correo Institucional</label>
              <input
                type="email"
                id="email_institucional"
                name="email_institucional"
                value={formData.email_institucional || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ejemplo@itdurango.edu.mx"
              />
              {formErrors.email_institucional && <p className="text-red-500 text-sm mt-1">{formErrors.email_institucional}</p>}
            </div>

            <div>
              <label htmlFor="departamento" className="block text-gray-700 font-medium mb-2">Departamento</label>
              <select
                id="departamento"
                name="departamento"
                value={formData.departamento || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Seleccione su departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.NombreDepartamento} value={dep.NombreDepartamento}>{dep.NombreDepartamento}</option>
                ))}
              </select>
              {formErrors.departamento && <p className="text-red-500 text-sm mt-1">{formErrors.departamento}</p>}
            </div>

            <div>
              <label htmlFor="telefono" className="block text-gray-700 font-medium mb-2">Teléfono</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Teléfono de contacto"
              />
              {formErrors.telefono && <p className="text-red-500 text-sm mt-1">{formErrors.telefono}</p>}
            </div>

            <div className="text-right">
              <button
                onClick={handleNextStep}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Course Selection */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">2. Selección de Cursos</h2>
            <div className="space-y-4">
              {cursos.map(curso => (
                <CourseCard
                  key={curso.Id_Curso}
                  curso={curso}
                  isSelected={formData.cursos_seleccionados?.includes(curso.Id_Curso) || false}
                  onToggle={handleCourseToggle}
                />
              ))}
            </div>
            {formErrors.cursos_seleccionados && <p className="text-red-500 text-sm mt-1 text-center">{formErrors.cursos_seleccionados}</p>}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
              >
                Regresar
              </button>
              <button
                onClick={handleReviewStep}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Revisar Registro
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review and Confirm */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">3. Revisar y Confirmar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Datos Personales</h3>
                <p className="text-sm text-gray-600 mb-1"><strong>Nombre:</strong> {formData.nombre_completo}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>CURP:</strong> {formData.curp}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Correo:</strong> {formData.email_institucional}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Departamento:</strong> {formData.departamento}</p>
                <p className="text-sm text-gray-600 mb-1"><strong>Teléfono:</strong> {formData.telefono}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Cursos Seleccionados</h3>
                <div className="space-y-2">
                  {selectedCoursesData.length > 0 ? (
                    selectedCoursesData.map(curso => (
                      <CourseCard key={curso.Id_Curso} curso={curso} isSelected={true} onToggle={() => {}} disabled={true} simplified={true} />
                    ))
                  ) : (
                    <p className="text-gray-500">No ha seleccionado ningún curso.</p>
                  )}
                </div>
              </div>
            </div>

            {isSubmitting ? (
              <div className="flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-8 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Regresar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Confirmar Registro
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Success */}
        {currentStep === 4 && (
          <div className="bg-white rounded-lg shadow-lg p-6 lg:p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-green-600 mb-4">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-6">
              Su registro ha sido procesado correctamente. Recibirá un correo de confirmación 
              con los detalles de sus cursos seleccionados.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>ID de Registro:</strong> {formData.id}
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentStep(1);
                setFormData({
                  nombre_completo: '',
                  curp: '',
                  email_institucional: '',
                  departamento: '',
                  telefono: '',
                  cursos_seleccionados: [],
                  id: '',
                });
              }}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Registrar Otro
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}