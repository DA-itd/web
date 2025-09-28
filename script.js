const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbzmsbmlBizGWA58RXn8-8Y7scW5hwakCSMNAwFQ0rCnN1Eu49QdaYl8lfWpEm21R3C2/exec";

let docentes = [];
let departamentos = [];
let cursos = [];

// Cargar archivos JSON locales
async function cargarJSON(url) {
  const resp = await fetch(url);
  return await resp.json();
}

async function init() {
  try {
    docentes = await cargarJSON('./docentes.json');
    departamentos = await cargarJSON('./departamentos.json');
    cursos = await cargarJSON('./cursos.json');

    // Llenar departamentos
    const deptSelect = document.getElementById("departamento");
    departamentos.forEach(d => {
      deptSelect.innerHTML += `<option value="${d.departamento}">${d.departamento}</option>`;
    });

    // Llenar cursos
    const cursosSelect = document.getElementById("cursos");
    cursos.forEach(c => {
      const clase = c.periodo === "periodo_1" ? "periodo_1" : "periodo_2";
      cursosSelect.innerHTML += `<option value="${c.id}" class="${clase}">${c.nombre}</option>`;
    });
  } catch (e) {
    console.error("Error cargando JSON:", e);
  }
}

init();

// Autocompletar datos
document.getElementById("nombre").addEventListener("input", (e) => {
  const input = e.target;
  input.value = input.value.toUpperCase();
  const doc = docentes.find(d => d.nombre.toUpperCase() === input.value.trim());
  if (doc) {
    document.getElementById("curp").value = doc.curp || "";
    document.getElementById("email").value = doc.email || "";
  }
});

// Validación de CURP
function validarCURP(curp) {
  return curp.length === 18;
}

// Generar ID
function generarID(consec) {
  return `TNM-054-01-2026-${consec}`;
}

// Enviar formulario
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
    alert("La CURP debe tener 18 caracteres.");
    return;
  }
  if (cursosSelect.length > 3) {
    alert("Solo puedes seleccionar máximo 3 cursos.");
    return;
  }

  // Mostrar confirmación
  document.getElementById("formRegistro").classList.add("hidden");
  const resumen = document.getElementById("resumen");
  resumen.innerHTML = `
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