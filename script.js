// --- CONFIGURACIÓN ---
const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmsbmlBizGWA58RXn8-8Y7scW5hwakCSMNAwFQ0rCnN1Eu49QdaYl8lfWpEm21R3C2/exec";

const DOCENTES_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/docentes.csv";
const DEPARTAMENTOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/departamentos.csv";
const CURSOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/cursos.csv";

let docentes = [];
let departamentos = [];
let cursos = [];

// --- CARGAR CSV ---
async function cargarCSV(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (err) => reject(err)
    });
  });
}

// --- INICIALIZACIÓN ---
async function init() {
  try {
    docentes = await cargarCSV(DOCENTES_CSV);
    departamentos = await cargarCSV(DEPARTAMENTOS_CSV);
    cursos = await cargarCSV(CURSOS_CSV);

    // Normalizar claves a minúsculas para evitar undefined
    docentes = docentes.map(d => ({
      nombre: d.nombre?.trim() || "",
      curp: d.curp?.trim() || "",
      email: d.email?.trim() || ""
    }));

    departamentos = departamentos.map(d => ({
      departamento: d.departamento?.trim() || ""
    }));

    cursos = cursos.map(c => ({
      id: c.id?.trim() || "",
      nombre: c.nombre?.trim() || "",
      periodo: c.periodo?.trim() || ""
    }));

    // Llenar departamentos
    const deptSelect = document.getElementById("departamento");
    departamentos.forEach(d => {
      if(d.departamento) deptSelect.innerHTML += `<option value="${d.departamento}">${d.departamento}</option>`;
    });

    // Llenar cursos
    const cursosSelect = document.getElementById("cursos");
    cursos.forEach(c => {
      if(c.id && c.nombre){
        const periodoClass = c.periodo === "periodo_1" ? "periodo_1" : "periodo_2";
        cursosSelect.innerHTML += `<option value="${c.id}" class="${periodoClass}">${c.nombre}</option>`;
      }
    });

  } catch (error) {
    console.error("Error cargando CSV:", error);
  }
}

init();

// --- AUTOCOMPLETADO DOCENTE ---
document.getElementById("nombre").addEventListener("input", (e) => {
  const input = e.target;
  // Convertir a mayúsculas mientras se escribe
  input.value = input.value.toUpperCase();

  const nombre = input.value.trim();
  if(nombre.length === 0) return;

  const doc = docentes.find(d => d.nombre.toUpperCase() === nombre);
  if (doc) {
    document.getElementById("curp").value = doc.curp;
    document.getElementById("email").value = doc.email;
  }
});

// --- VALIDACIONES ---
function validarCURP(curp) { return curp.length === 18; }
function generarID(consecutivo) { return `TNM-054-01-2026-${consecutivo}`; }

// --- SUBMIT FORM ---
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
  if (!validarCURP(curp)) { alert("CURP debe tener 18 caracteres."); return; }
  if (cursosSelect.length > 3) { alert("Solo puedes seleccionar máximo 3 cursos."); return; }

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

  document.getElementById("regresar").onclick = () => {
    document.getElementById("formRegistro").classList.remove("hidden");
    document.getElementById("confirmacion").classList.add("hidden");
  };

  document.getElementById("enviar").onclick = async () => {
    const idGenerado = generarID(Math.floor(Math.random() * 30 + 1));
    const data = { id: idGenerado, nombre, curp, email, departamento, genero, cursos: cursosSelect };

    try {
      const resp = await fetch(URL_SCRIPT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await resp.json();
      alert(result.status === "success" ? "Inscripción guardada correctamente." : "Error: " + result.message);
      window.location.reload();
    } catch (error) {
      alert("Error al enviar la inscripción: " + error.message);
    }
  };
});