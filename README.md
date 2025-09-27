# Sistema de Registro de Cursos para Docentes

Una aplicación web moderna y responsiva diseñada para facilitar el proceso de registro de docentes en cursos de actualización profesional. La plataforma autocompleta la información del docente, permite una selección de cursos intuitiva y valida en tiempo real los conflictos de horario para asegurar una inscripción sin problemas.

![Captura de pantalla de la aplicación](https://i.imgur.com/uG9Xg7c.png)

## ✨ Características Principales

- **Formulario de Registro Dinámico**: Interfaz limpia e intuitiva para una experiencia de usuario fluida.
- **Autocompletado Inteligente**: Al empezar a escribir un nombre, el sistema sugiere docentes y rellena automáticamente sus datos (CURP, email, departamento) si existen en la base de datos.
- **Selección de Cursos Interactiva**: Los docentes pueden seleccionar hasta 3 cursos de una lista de opciones disponibles.
- **Validación de Conflictos de Horario**: El sistema previene la doble inscripción en cursos que se empalmen en fecha y hora, mostrando una notificación al usuario.
- **Diseño Responsivo**: Totalmente funcional en dispositivos de escritorio, tabletas y móviles gracias a Tailwind CSS.
- **Notificaciones en Tiempo Real**: Usa `react-hot-toast` para dar feedback instantáneo al usuario sobre sus acciones (cursos agregados, errores, registro exitoso).
- **Modal de Confirmación**: Al completar el registro, se muestra un resumen detallado con toda la información y los cursos seleccionados.
- **Simulación de Backend**: Utiliza un servicio mock para simular la obtención de datos y el envío de correos, facilitando el desarrollo y las pruebas sin necesidad de un backend real.

## 🚀 Stack Tecnológico

- **Frontend**: [React](https://react.dev/) (con Hooks)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Iconos**: [Heroicons](https://heroicons.com/)
- **Notificaciones**: [React Hot Toast](https://react-hot-toast.com/)

## 📂 Estructura del Proyecto

El proyecto está organizado de manera modular para facilitar su mantenimiento y escalabilidad.

```
/
├── index.html                # Punto de entrada HTML
├── metadata.json             # Metadatos de la aplicación
├── README.md                 # Documentación del proyecto
└── src/
    ├── App.tsx               # Componente principal que organiza el layout
    ├── index.tsx             # Punto de entrada de React
    ├── types.ts              # Definiciones de tipos de TypeScript
    ├── components/
    │   ├── AutocompleteInput.tsx # Input con lógica de autocompletado para nombres
    │   ├── ConfirmationModal.tsx # Modal de resumen de registro
    │   ├── CourseSelector.tsx    # Lógica para seleccionar cursos y validar conflictos
    │   └── RegistrationForm.tsx  # Componente central del formulario
    └── services/
        └── mockApiService.ts     # Simulación de llamadas a una API
```

## 🛠️ Instalación y Puesta en Marcha

Este proyecto está configurado para funcionar directamente en un navegador moderno sin necesidad de un proceso de `build` (compilación), ya que utiliza importaciones de módulos ES nativas (import maps) y un CDN para las dependencias.

La forma más sencilla de ejecutarlo es utilizando un servidor de desarrollo local.

### Usando Visual Studio Code y Live Server

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/tu-repositorio.git
    cd tu-repositorio
    ```

2.  **Abre el proyecto en VS Code:**
    ```bash
    code .
    ```

3.  **Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)** desde el panel de Extensiones de VS Code.

4.  **Inicia el servidor:**
    - Haz clic derecho sobre el archivo `index.html` en el explorador de archivos.
    - Selecciona la opción **"Open with Live Server"**.

¡Listo! La aplicación se abrirá automáticamente en tu navegador web.

## ⚙️ Cómo Usar la Aplicación

1.  **Autocompletar Datos**: Comienza a escribir el nombre de un docente en el campo "Nombre Completo". Si el nombre existe, aparecerá una lista de sugerencias. Al hacer clic en una, los campos CURP, Correo Electrónico y Departamento se llenarán automáticamente.
2.  **Completar Manualmente**: Si un docente no está en la lista o le faltan datos (como la CURP), puedes escribirlos directamente en los campos correspondientes.
3.  **Seleccionar Cursos**:
    - Elige un curso del menú desplegable "Cursos Disponibles".
    - Haz clic en el botón "Agregar Curso".
    - Puedes agregar un máximo de 3 cursos. El sistema no te permitirá agregar cursos con horarios conflictivos.
4.  **Registrarse**: Una vez que hayas completado todos los datos y seleccionado al menos un curso, haz clic en el botón "Registrar".
5.  **Confirmación**: Aparecerá un resumen de tu registro. Cierra el modal para realizar una nueva inscripción.
