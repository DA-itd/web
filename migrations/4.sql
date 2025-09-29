
CREATE TABLE cursos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_curso TEXT NOT NULL,
  nombre_curso TEXT NOT NULL,
  fecha_visible TEXT NOT NULL,
  periodo TEXT NOT NULL,
  horas TEXT NOT NULL,
  lugar TEXT NOT NULL,
  horario TEXT NOT NULL,
  tipo TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cursos_id_curso ON cursos(id_curso);
CREATE INDEX idx_cursos_periodo ON cursos(periodo);
