import { initializeApp, FirebaseApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
    getAuth, 
    Auth,
    createUserWithEmailAndPassword,
    User
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
import { 
    getFirestore, 
    Firestore,
    collection, 
    getDocs, 
    query, 
    where, 
    doc, 
    setDoc, 
    getDoc,
    runTransaction,
    addDoc,
    serverTimestamp,
    deleteDoc,
    getCountFromServer
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

import type { Departamento, Docente, Curso, Inscripcion } from '../types';

// =================================================================
// INICIALIZACIÓN DE FIREBASE (VERSIÓN ROBUSTA)
// =================================================================

// Declarar la propiedad en el objeto global Window para que TypeScript la reconozca.
declare global {
  interface Window { __firebase_config?: string; }
}

let auth: Auth;
let db: Firestore;

try {
    const configString = window.__firebase_config;
    if (!configString) {
        throw new Error("La variable global '__firebase_config' no fue encontrada. Asegúrate de que el script de configuración en index.html se está ejecutando correctamente.");
    }

    const firebaseConfig = JSON.parse(configString);
    const app: FirebaseApp = initializeApp(firebaseConfig);
    
    auth = getAuth(app);
    db = getFirestore(app);

} catch (error) {
    console.error("ERROR FATAL: La inicialización de Firebase falló.", error);
    // En caso de un error crítico, se muestra un mensaje en la pantalla para evitar la página en blanco.
    const rootElement = document.getElementById('root');
    if (rootElement) {
        rootElement.innerHTML = `
            <div style="font-family: sans-serif; text-align: center; padding: 2rem; color: #b91c1c;">
                <h1 style="font-size: 1.5rem; font-weight: bold;">Error Crítico de Aplicación</h1>
                <p style="margin-top: 1rem;">No se pudo inicializar la conexión con la base de datos (Firebase).</p>
                <p style="margin-top: 0.5rem; font-size: 0.875rem; color: #4b5563;">Por favor, revisa la consola del desarrollador (F12) para más detalles técnicos.</p>
                <p style="margin-top: 1rem; font-size: 0.8rem; background-color: #fee2e2; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #fecaca;">
                    <strong>Mensaje de error:</strong> ${(error as Error).message}
                </p>
            </div>
        `;
    }
    // Detener la ejecución del resto del script para prevenir más errores.
    throw new Error("Deteniendo ejecución debido a un fallo en la inicialización de Firebase.");
}

// Exportar las instancias ya inicializadas para que el resto de la app las use.
export { auth, db };


// --- COLECCIONES ---
const docentesCollection = collection(db, 'docentes');
const departamentosCollection = collection(db, 'departamentos');
const cursosCollection = collection(db, 'cursos');
const inscripcionesCollection = collection(db, 'inscripciones');

// --- SERVICIOS DE AUTENTICACIÓN Y DOCENTES ---

/**
 * Registra un nuevo docente, validando la unicidad de CURP y email.
 * Si el registro es exitoso, crea el usuario en Firebase Auth y su perfil en Firestore.
 */
export const registerTeacher = async (data: Omit<Docente, 'id'>): Promise<User> => {
    // 1. Validar unicidad de CURP y email
    const curpQuery = query(docentesCollection, where("curp", "==", data.curp));
    const emailQuery = query(docentesCollection, where("email", "==", data.email));

    const [curpSnapshot, emailSnapshot] = await Promise.all([
        getDocs(curpQuery),
        getDocs(emailQuery)
    ]);

    if (!curpSnapshot.empty) {
        throw new Error("El CURP ya está registrado.");
    }
    if (!emailSnapshot.empty) {
        throw new Error("El correo electrónico ya está registrado.");
    }

    // 2. Crear usuario en Firebase Auth (se necesita una contraseña temporal o generada)
    // Para este caso, usaremos una contraseña temporal que el usuario deberá cambiar.
    const tempPassword = `${data.curp.substring(0, 4)}${new Date().getFullYear()}`;
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, tempPassword);
    const user = userCredential.user;

    // 3. Crear el documento del docente en Firestore
    const docenteData: Docente = {
        id: user.uid,
        ...data
    };
    await setDoc(doc(db, "docentes", user.uid), docenteData);

    return user;
};


/**
 * Obtiene el perfil de un docente desde Firestore.
 */
export const getDocente = async (uid: string): Promise<Docente | null> => {
    const docRef = doc(db, "docentes", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Docente;
    }
    return null;
};


// --- SERVICIOS DE DATOS (DEPARTAMENTOS, CURSOS, INSCRIPCIONES) ---

/**
 * Obtiene la lista de todos los departamentos.
 */
export const getDepartamentos = async (): Promise<Departamento[]> => {
    const snapshot = await getDocs(departamentosCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Departamento));
};

/**
 * Obtiene la lista de todos los cursos.
 */
export const getCursos = async (): Promise<Curso[]> => {
    const snapshot = await getDocs(cursosCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Curso));
};

/**
 * Obtiene todas las inscripciones (para calcular cupos).
 */
export const getAllInscripciones = async (): Promise<Inscripcion[]> => {
    const snapshot = await getDocs(inscripcionesCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inscripcion));
};

/**
 * Obtiene las inscripciones de un docente específico.
 */
export const getInscripcionesPorDocente = async (docenteId: string): Promise<Inscripcion[]> => {
    const q = query(inscripcionesCollection, where("docenteId", "==", docenteId));
    const snapshot = await getDocs(q);
    
    const inscripciones = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inscripcion));
    
    // Opcional: enriquecer cada inscripción con los datos del curso
    for (const inscripcion of inscripciones) {
        if (inscripcion.cursoId) {
            const cursoDoc = await getDoc(doc(db, "cursos", inscripcion.cursoId));
            if (cursoDoc.exists()) {
                inscripcion.curso = { id: cursoDoc.id, ...cursoDoc.data() } as Curso;
            }
        }
    }
    
    return inscripciones;
};

/**
 * Inscribe a un docente en un curso usando una transacción para garantizar la integridad de los datos.
 */
export const inscribirEnCurso = async (docenteId: string, curso: Curso): Promise<void> => {
    try {
        await runTransaction(db, async (transaction) => {
            // 1. Verificar que el docente no exceda el límite de 3 cursos.
            const inscripcionesDocenteQuery = query(inscripcionesCollection, where("docenteId", "==", docenteId));
            const inscripcionesDocenteSnapshot = await getDocs(inscripcionesDocenteQuery); // Nota: getDocs no se puede usar en transacciones, se hace antes.
            if (inscripcionesDocenteSnapshot.size >= 3) {
                throw new Error("Límite de 3 cursos alcanzado. No puedes inscribirte a más cursos.");
            }

            // 2. Verificar el cupo del curso (máximo 30).
            const inscripcionesCursoQuery = query(inscripcionesCollection, where("cursoId", "==", curso.id));
            const inscripcionesCursoSnapshot = await getCountFromServer(inscripcionesCursoQuery);
            const cupoActual = inscripcionesCursoSnapshot.data().count;

            if (cupoActual >= 30) {
                throw new Error("El curso ya no tiene cupo disponible.");
            }
            
            // 3. Generar el ID de registro único: TNM-054-XX-2026-WW
            const XX = curso.idCurso.toString().padStart(2, '0');
            const WW = (cupoActual + 1).toString().padStart(2, '0');
            const idRegistro = `TNM-054-${XX}-2026-${WW}`;

            // 4. Crear el nuevo documento de inscripción.
            const nuevaInscripcionRef = doc(collection(db, "inscripciones"));
            transaction.set(nuevaInscripcionRef, {
                docenteId,
                cursoId: curso.id,
                idRegistro,
                fechaInscripcion: serverTimestamp()
            });
        });
    } catch (e) {
        // Re-lanzar el error para que el componente lo maneje
        if (e instanceof Error) {
            throw new Error(e.message);
        }
        throw new Error("Ocurrió un error durante la inscripción.");
    }
};

/**
 * Elimina la inscripción de un docente a un curso.
 */
export const anularInscripcion = async (inscripcionId: string): Promise<void> => {
    const inscripcionRef = doc(db, "inscripciones", inscripcionId);
    await deleteDoc(inscripcionRef);
};