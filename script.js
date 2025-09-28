import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBYC-9dyv1Ulp9Oe13ePDJoahWBZNJ6-Wc",
  authDomain: "actualizacion-docente-itd.firebaseapp.com",
  projectId: "actualizacion-docente-itd",
  storageBucket: "actualizacion-docente-itd.firebasestorage.app",
  messagingSenderId: "979604726632",
  appId: "1:979604726632:web:7e5cdd2d8f4b8cb9a32cdd",
  measurementId: "G-V2V4CT2C69"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nombreInput = document.getElementById("nombre");
const curpInput = document.getElementById("curp");
const emailInput = document.getElementById("email");
const generoSelect = document.getElementById("genero");
const deptoSelect = document.getElementById("departamento");
const cursoSelect = document.getElementById("curso");
const form = document.getElementById("registroForm");
const mensaje = document.getElementById("mensaje");

// Convertir a mayúsculas automáticamente
[nombreInput, curpInput].forEach(input => {
  input.addEventListener("input", () => {
    input.value = input.value.toUpperCase();
  });
});

// Cargar departamentos
async function cargarDepartamentos() {
  deptoSelect.innerHTML = `<option value="">Seleccione...</option>`;
  const snapshot = await getDocs(collection(db, "departamentos"));
  snapshot.forEach(doc => {
    const data = doc.data();
    const option = document.createElement("option");
    option.value = data.Nombre || doc.id;
    option.textContent = data.Nombre || doc.id;
    deptoSelect.appendChild(option);
  });
}

// Cargar cursos
async function cargarCursos() {
  cursoSelect.innerHTML = `<option value="">Seleccione...</option>`;
  const snapshot = await getDocs(collection(db, "cursos"));
  const cursosOrdenados = [];
  snapshot.forEach(doc => cursosOrdenados.push(doc.data()));

  // Ordenar primero periodo_1
  cursosOrdenados.sort((a, b) => a.Periodo.localeCompare(b.Periodo));

  cursosOrdenados.forEach(data => {
    const option = document.createElement("option");
    option.value = data.Id_Curso;
    option.textContent = `${data.Nombre_curso} (${data.FechaVisible})`;
    option.style.color = data.Periodo === "PERIODO_1" ? "blue" : "green";
    cursoSelect.appendChild(option);
  });
}

// Registrar
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (curpInput.value.length !== 18) {
    mensaje.textContent = "❌ La CURP debe tener 18 caracteres.";
    mensaje.style.color = "red";
    return;
  }

  try {
    await addDoc(collection(db, "inscripciones"), {
      nombre: nombreInput.value,
      curp: curpInput.value,
      email: emailInput.value,
      genero: generoSelect.value,
      departamento: deptoSelect.value,
      curso: cursoSelect.value,
      fecha: new Date().toISOString()
    });
    mensaje.textContent = "✅ Registro guardado correctamente.";
    mensaje.style.color = "green";
    form.reset();
  } catch (error) {
    mensaje.textContent = "❌ Error al registrar: " + error.message;
    mensaje.style.color = "red";
  }
});

// Ejecutar al cargar
cargarDepartamentos();
cargarCursos();