// --- CONFIGURACIÓN ---
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmsbmlBizGWA58RXn8-8Y7scW5hwakCSMNAwFQ0rCnN1Eu49QdaYl8lfWpEm21R3C2/exec";

const DOCENTES_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/docentes.csv";
const DEPARTAMENTOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/departamentos.csv";
const CURSOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/cursos.csv";

let docentes = [];
let departamentos = [];
let cursos = [];

// --- FUNCIONES AUXILIARES ---
async function cargarCSV(url) {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split("\n");
  return lines.map(line => line.split(","));
}

function autocompletarDocente(nombre) {
  const doc = docentes.find(d => d[0].toUpperCase() === nombre.toUpperCase());
  if (doc) {
    document.getElementById("curp").value = doc[1] || "";
    document.getElementById("email").value = doc[2] || "";
  }
}

function validarCURP(curp) {
  return curp.length === 18;
}

function generarID(consecutivo) {
  return `TNM-054-01-2026-${consecutivo}`;
}

// --- CARGAR DATOS INICIALES ---
async function init() {
  docentes = await cargarCSV(DOCENTES_CSV);
  departamentos = await cargarCSV(DEPARTAMENTOS_CSV);
  cursos = await cargarCSV(CURSOS_CSV);

  // Llenar departamentos
  const deptSelect = document.getElementById("departamento");
  departamentos.forEach(d => {
    deptSelect.innerHTML += `<option value="${d[0]}">${d[0]}</option>`;
  });

  // Llenar cursos
  const cursosSelect = document.getElementById("cursos");
  cursos.forEach(c => {
    const periodoClass = c[2] === "periodo_1" ? "periodo_1" : "periodo_2";
    cursosSelect.innerHTML += `<option value="${c[0]}" class="${periodoClass}">${c[1]}</option>`;
  });
}

init();

// --- EVENTOS ---
document.getElementById("nombre").addEventListener("blur", (e) => {
  e.target.value = e.target.value.toUpperCase();
  autocompletarDocente(e.target.value);
});

document.getElementById("formRegistro").addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim().toUpperCase();
  const curp = document.getElementById("curp").value.trim().toUpperCase();
  const email = document.getElementById("email").value.trim();
  const departamento = document.getElementById("departamento").value;
  const genero = document.getElementById("genero").value;
  const cursosSelect = Array.from(document.getElementById("cursos").selectedOptions).map(opt => opt.value);

  if (!nombre || !curp || !email || !departamento || !genero || cursosSelect.length === 0) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  if (!validarCURP(curp)) {
    alert("CURP debe tener 18 caracteres.");
    return;
  }

  if (cursosSelect.length > 3) {
    alert("Solo puedes seleccionar máximo 3 cursos.");
    return;
  }

  // Mostrar confirmación
  document.getElementById("formRegistro").classList.add("hidden");
  const resumenDiv = document.getElementById("resumen");
  resumenDiv.innerHTML = `
    <p><strong>Nombre:</strong> ${nombre}</p>
    <p><strong>CURP:</strong> ${curp}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Departamento:</strong> ${departamento}</p>
    <p><strong>Género:</strong> ${genero}</p>
    <p><strong>Cursos:</strong> ${cursosSelect.join(", ")}</p>
  `;
  document.getElementById("confirmacion").classList.remove("hidden");

  // Botones
  document.getElementById("regresar").onclick = () => {
    document.getElementById("formRegistro").classList.remove("hidden");
    document.getElementById("confirmacion").classList.add("hidden");
  };

  document.getElementById("enviar").onclick = async () => {
    const idGenerado = generarID(Math.floor(Math.random()*30 + 1));

    const data = {
      id: idGenerado,
      nombre,
      curp,
      email,
      departamento,
      genero,
      cursos: cursosSelect
    };

    const resp = await fetch(URL_SCRIPT, {
      method: "POST",
      headers: { "Content-Type": "application/json