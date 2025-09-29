
CREATE TABLE departamentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre_departamento TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_departamentos_nombre ON departamentos(nombre_departamento);
