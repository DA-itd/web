
CREATE TABLE inscripciones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  id_curso TEXT,
  nombre_completo TEXT,
  curp TEXT,
  email TEXT,
  genero TEXT,
  curso_seleccionado TEXT,
  departamento_seleccionado TEXT,
  fecha_visible TEXT,
  lugar TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
