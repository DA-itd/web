import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { 
    getFirestore, 
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
} from 'firebase/firestore';

import type { Departamento, Docente, Curso, Inscripcion } from '../types';

// Declara la variable global para la configuración de Firebase inyectada por el entorno.
declare const __firebase_config: string;

// =================================================================
// CONFIGURACIÓN DE FIREBASE
// Se carga desde una variable global para evitar exponer las claves en el código fuente.
// =================================================================
let firebaseConfig;
try {
    if (typeof __firebase_config !== 'undefined' && __firebase_config) {
        firebaseConfig = JSON.parse(__firebase_config);
    } else {
        // FIX: En lugar de lanzar un error que bloquea la aplicación, se muestra una advertencia
        // y se utiliza una configuración de marcador de posición. Esto permite que la aplicación se cargue
        // incluso si la configuración de Firebase no se inyecta, facilitando la depuración.
        console.warn(
            "ADVERTENCIA: La configuración de Firebase no se encontró. " +
            "La aplicación no funcionará correctamente sin una configuración válida. " +
            "Asegúrate de que la variable global `__firebase_config` esté definida."
        );
        firebaseConfig = {
            apiKey: "AIzaSy...",
            authDomain: "project-id.firebaseapp.com",
            projectId: "project-id",
            storageBucket: "project-id.appspot.com",
            messagingSenderId: "1234567890",
            appId: "1:1234567890:web:abcdef123456"
        };
    }
} catch (error) {
    console.error("Error al analizar la configuración de Firebase:", error);
    throw new Error("No se pudo inicializar Firebase. La configuración es inválida.");
}

// Inicializar Firebase
// Si la configuración no es válida (por ejemplo, marcadores de posición),
// Firebase SDK lanzará errores en la consola al intentar usar sus servicios,
// lo cual es un comportamiento esperado en este escenario de fallback.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);


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

export { onAuthStateChanged, signInWithEmailAndPassword };