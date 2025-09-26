import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import { loadCourses, loadDepartments, loadDocentes, normalizeString, SCRIPT_URL } from './services/dataService';
import { Course, Docente, ModalInfo, RegisteredCourse } from './types';

const App: React.FC = () => {
    // Data stores
    const [allCourses, setAllCourses] = useState<Course[]>([]);
    const [allDepartments, setAllDepartments] = useState<string[]>([]);
    const [allDocentes, setAllDocentes] = useState<Docente[]>([]);

    // Form state
    const [nombreCompleto, setNombreCompleto] = useState('');
    const [curp, setCurp] = useState('');
    const [email, setEmail] = useState('');
    const [genero, setGenero] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [cursoSeleccionado, setCursoSeleccionado] = useState('');

    // Logic state
    const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourse[]>([]);
    const [areFieldsLocked, setAreFieldsLocked] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Cargando datos de cursos y docentes desde GitHub...');
    const [modalInfo, setModalInfo] = useState<ModalInfo>({ isOpen: false, title: '', message: '', type: 'alert' });

    // Memoized derived data for performance
    const docentesMap = useMemo(() => {
        return allDocentes.reduce((acc, doc) => {
            acc[doc.NombreCompleto] = doc;
            return acc;
        }, {} as Record<string, Docente>);
    }, [allDocentes]);

    const coursesByDate = useMemo(() => {
        return allCourses.reduce((acc, course) => {
            const dateKey = course.FechaVisible || 'Sin Fecha';
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(course);
            return acc;
        }, {} as Record<string, Course[]>);
    }, [allCourses]);

    const selectedCourseDetails = useMemo(() => {
        return allCourses.find(c => c.NombreCurso === cursoSeleccionado);
    }, [cursoSeleccionado, allCourses]);


    // Data loading effect
    useEffect(() => {
        const loadAllData = async () => {
            try {
                const [coursesData, departmentsData, docentesData] = await Promise.all([
                    loadCourses(),
                    loadDepartments(),
                    loadDocentes()
                ]);

                if (coursesData.length === 0 || departmentsData.length === 0 || docentesData.length === 0) {
                    throw new Error("Faltan datos esenciales (cursos, docentes o departamentos). Verifica los archivos CSV.");
                }
                
                setAllCourses(coursesData);
                setAllDepartments(departmentsData);
                setAllDocentes(docentesData);
                setLoadingMessage('');

            } catch (error) {
                setLoadingMessage(error instanceof Error ? error.message : "Ocurrió un error desconocido al cargar los datos.");
            }
        };
        loadAllData();
    }, []);

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = normalizeString(e.target.value);
        setNombreCompleto(newName);

        const docente = docentesMap[newName];
        if (docente) {
            setCurp(docente.Curp);
            setEmail(docente.Email);
            setAreFieldsLocked(true);
        } else {
            setCurp('');
            setEmail('');
            setAreFieldsLocked(false);
        }
    };

    const closeModal = () => setModalInfo(prev => ({ ...prev, isOpen: false }));

    const showModal = (title: string, message: string, type: 'alert' | 'confirm' = 'alert', onConfirm?: () => void, onCancel?: () => void) => {
        setModalInfo({ isOpen: true, title, message, type, onConfirm, onCancel });
    };

    const removeCourse = (index: number) => {
        const newRegisteredCourses = [...registeredCourses];
        newRegisteredCourses.splice(index, 1);
        setRegisteredCourses(newRegisteredCourses);
        if (newRegisteredCourses.length === 0) {
            setAreFieldsLocked(false); // Unlock fields if all courses are removed
        }
    };
    
    const resetFullForm = () => {
        setNombreCompleto('');
        setCurp('');
        setEmail('');
        setGenero('');
        setDepartamento('');
        setCursoSeleccionado('');
        setRegisteredCourses([]);
        setAreFieldsLocked(false);
    }
    
    const startFinalSubmission = async () => {
        if (registeredCourses.length === 0) {
            showModal('Atención', 'No tienes cursos en tu lista de inscripción. Selecciona al menos uno.');
            return;
        }

        setIsSubmitting(true);
        let successCount = 0;
        const totalCourses = registeredCourses.length;

        for (const courseData of registeredCourses) {
            const individualFormData = new FormData();
            Object.entries(courseData).forEach(([key, value]) => {
                individualFormData.append(key, value);
            });

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: individualFormData,
                    mode: 'no-cors'
                });
                successCount++;
            } catch (error) {
                console.error("Error al enviar el curso:", courseData.cursoSeleccionado, error);
            }
        }
        
        setIsSubmitting(false);

        if (successCount === totalCourses) {
            showModal('¡Registro Completado!', 'Tus cursos han sido inscritos. Revisa tu correo electrónico para las confirmaciones.', 'alert', resetFullForm);
        } else {
            showModal('Error Parcial', `Solo se lograron enviar <b>${successCount} de ${totalCourses}</b> cursos. Por favor, vuelve a intentarlo.`);
        }
    };

    const handleAceptarClick = () => {
        // --- VALIDACIONES ---
        // 1. Campos personales requeridos
        if (!nombreCompleto || !curp || !email || !genero || !departamento) {
            showModal('Campos Incompletos', 'Por favor, llena todos tus datos personales antes de agregar un curso.');
            return;
        }
        // 2. Docente debe existir
        if (!docentesMap[nombreCompleto]) {
            showModal('Acceso Denegado', 'Tu <b>Nombre Completo</b> no fue encontrado en la base de datos de Docentes. Por favor, verifica tu nombre.');
            return;
        }
        // 3. Curso debe ser seleccionado
        if (!cursoSeleccionado || !selectedCourseDetails) {
            showModal('Curso no seleccionado', 'Debes seleccionar un curso de la lista.');
            return;
        }
        // 4. Límite de cursos
        if (registeredCourses.length >= 3) {
            showModal('Límite Alcanzado', 'Has alcanzado el límite máximo de 3 cursos.');
            return;
        }
        // 5. Curso ya registrado
        if (registeredCourses.some(rc => rc.cursoSeleccionado === cursoSeleccionado)) {
            showModal('Curso Duplicado', `El curso <b>"${cursoSeleccionado}"</b> ya está en tu lista.`);
            return;
        }
        // 6. Traslape de horario
        const overlap = registeredCourses.find(rc =>
            rc.fechaVisible === selectedCourseDetails.FechaVisible && rc.horario === selectedCourseDetails.Horario
        );
        if (overlap) {
            showModal('Traslape de Horario', `El curso se empalma con <b>"${overlap.cursoSeleccionado}"</b>, que tiene la misma fecha y horario.`);
            return;
        }
        // 7. Cupo del curso
        if (selectedCourseDetails.Inscritos >= selectedCourseDetails.Capacidad) {
            showModal('Curso Lleno', `Lo sentimos, el curso <b>"${selectedCourseDetails.NombreCurso}"</b> ya no tiene cupo disponible.`);
            return;
        }

        // --- SI TODO ES VÁLIDO ---
        const newCourse: RegisteredCourse = {
            nombreCompleto, curp, email, genero, departamento,
            cursoSeleccionado: selectedCourseDetails.NombreCurso,
            fechaVisible: selectedCourseDetails.FechaVisible,
            lugar: selectedCourseDetails.Lugar,
            horario: selectedCourseDetails.Horario,
            codigoInscripcion: `${selectedCourseDetails.Codigo}-${String(registeredCourses.length + 1).padStart(2, '0')}-${String(selectedCourseDetails.Inscritos + 1).padStart(2, '0')}`
        };

        const newRegisteredCourses = [...registeredCourses, newCourse];
        setRegisteredCourses(newRegisteredCourses);
        setCursoSeleccionado('');
        setAreFieldsLocked(true); // Bloquear campos después de agregar el primer curso

        if (newRegisteredCourses.length >= 3) {
            showModal('Límite Alcanzado', 'Has alcanzado el máximo de 3 cursos. Procede al envío final.', 'alert', startFinalSubmission);
        } else {
            showModal(
                'Curso Agregado',
                `El curso ha sido agregado a tu lista. Tienes ${newRegisteredCourses.length} de 3 cursos. ¿Deseas inscribirte a otro?`,
                'confirm',
                () => {}, // "Sí, agregar otro" - solo cierra el modal
                startFinalSubmission // "No, finalizar" - inicia el envío
            );
        }
    };
    
    if (loadingMessage) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className={`p-4 rounded-xl text-center font-semibold ${loadingMessage.includes('Error') || loadingMessage.includes('Faltan') ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {loadingMessage}
                </div>
            </div>
        );
    }

    const buttonText = registeredCourses.length === 0 ? 'Agregar Curso' :
                       registeredCourses.length >= 3 ? 'Finalizar Registro (3 Cursos)' :
                       'Agregar Otro Curso';

    const handleButtonClick = registeredCourses.length >= 3 ? startFinalSubmission : handleAceptarClick;

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
             <div className="bg-white p-6 md:p-10 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-200">
                <Header />
                
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    {/* --- DATOS PERSONALES --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl bg-blue-50/50">
                        <div>
                            <label htmlFor="nombreCompleto" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                            <input type="text" id="nombreCompleto" list="docentesList" value={nombreCompleto} onChange={handleNombreChange} readOnly={areFieldsLocked} className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase ${areFieldsLocked ? 'bg-gray-200 cursor-not-allowed' : ''}`} required />
                            <datalist id="docentesList">
                                {allDocentes.map(d => <option key={d.NombreCompleto} value={d.NombreCompleto} />)}
                            </datalist>
                        </div>
                        <div>
                            <label htmlFor="curp" className="block text-sm font-medium text-gray-700">CURP</label>
                            <input type="text" id="curp" value={curp} onChange={(e) => setCurp(e.target.value.toUpperCase())} readOnly={areFieldsLocked} maxLength={18} className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase ${areFieldsLocked ? 'bg-gray-200 cursor-not-allowed' : ''}`} required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} readOnly={areFieldsLocked} className={`mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${areFieldsLocked ? 'bg-gray-200 cursor-not-allowed' : ''}`} required />
                        </div>
                        <div>
                            <label htmlFor="genero" className="block text-sm font-medium text-gray-700">Género</label>
                            <select id="genero" value={genero} onChange={e => setGenero(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="">Selecciona tu género</option>
                                <option value="Femenino">Femenino</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Otro">Otro</option>
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                             <label htmlFor="departamento" className="block text-sm font-medium text-gray-700">Departamento</label>
                             <select id="departamento" value={departamento} onChange={e => setDepartamento(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                 <option value="">Selecciona un departamento</option>
                                 {allDepartments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                             </select>
                        </div>
                    </div>

                    {/* --- SELECCIÓN DE CURSO --- */}
                    <div className="p-4 border rounded-xl bg-green-50/50">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Selección de Curso</h3>
                         <div className="mb-4">
                             <label htmlFor="curso" className="block text-sm font-medium text-gray-700">Curso a Inscribir</label>
                             <select id="curso" value={cursoSeleccionado} onChange={e => setCursoSeleccionado(e.target.value)} className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" required>
                                <option value="">Selecciona un curso</option>
                                {Object.entries(coursesByDate).map(([date, coursesInGroup], index) => (
                                    <optgroup key={date} label={`--- ${date} ---`} className={`course-option-group-${index % 2 + 1}`}>
                                        {coursesInGroup.map(c => <option key={c.NombreCurso} value={c.NombreCurso}>{c.NombreCurso}</option>)}
                                    </optgroup>
                                ))}
                             </select>
                         </div>
                        {selectedCourseDetails && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3 bg-green-100 rounded-xl border border-green-300">
                                <div><label className="block text-xs font-medium text-gray-600">Fecha</label><p className="text-sm font-semibold">{selectedCourseDetails.FechaVisible}</p></div>
                                <div><label className="block text-xs font-medium text-gray-600">Lugar</label><p className="text-sm font-semibold">{selectedCourseDetails.Lugar}</p></div>
                                <div><label className="block text-xs font-medium text-gray-600">Horario</label><p className="text-sm font-semibold">{selectedCourseDetails.Horario}</p></div>
                            </div>
                        )}
                    </div>
                    
                    {/* --- CURSOS REGISTRADOS --- */}
                    {registeredCourses.length > 0 && (
                        <div className="p-4 border border-yellow-300 bg-yellow-50 rounded-xl">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Cursos Agregados (Máx. 3)</h3>
                            <ul className="list-disc list-inside text-sm text-gray-600 ml-4 space-y-2">
                                {registeredCourses.map((reg, index) => (
                                    <li key={index}>
                                        <span className="font-bold">{reg.cursoSeleccionado}</span> ({reg.fechaVisible} | {reg.horario})
                                        <button onClick={() => removeCourse(index)} className="ml-2 text-red-500 hover:text-red-700 text-xs font-bold transition">BORRAR</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* --- BOTÓN DE ENVÍO --- */}
                    <div className="pt-4">
                        <button type="button" onClick={handleButtonClick} disabled={isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-blue-300 disabled:scale-100">
                            {isSubmitting ? 'Enviando...' : buttonText}
                        </button>
                    </div>
                </form>
             </div>
            <Modal modalInfo={modalInfo} closeModal={closeModal} />
        </div>
    );
};

export default App;
