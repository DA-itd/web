const DOCENTES_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/docentes.csv";
const DEPARTAMENTOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/departamentos.csv";
const CURSOS_CSV = "https://raw.githubusercontent.com/DA-itd/web/main/cursos.csv";

let docentes = [];
let departamentos = [];
let cursos = [];

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

async function init() {
  try {
    docentes = await cargarCSV(DOCENTES_CSV);
    departamentos = await cargarCSV(DEPARTAMENTOS_CSV);
    cursos = await cargarCSV(CURSOS_CSV);

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

// Autocompletado docente
document.getElementById("nombre").addEventListener("blur", (e) => {
  const nombreInput = e.target;
  nombreInput.value = nombreInput.value.toUpperCase();
  const nombre = nombreInput.value;

  const doc = docentes.find(d => d.nombre && d.nombre.toUpperCase() === nombre);
  if (doc) {
    document.getElementById("curp").value = doc.curp || "";
    document.getElementById("email").value = doc.email || "";
  }
});