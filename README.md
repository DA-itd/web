# Sistema de Inscripción a Cursos de Actualización Docente

¡Felicidades! Tienes los archivos finales para desplegar tu aplicación. Este documento te guiará paso a paso para poner tu sistema en línea.

El despliegue consta de 3 partes principales:
1.  **Configurar la Hoja de Cálculo** (Donde se guardarán los datos).
2.  **Desplegar el Backend** (El script de Google que procesa los datos).
3.  **Desplegar el Frontend** (La página web que los usuarios verán).

---

## Parte 1: Configurar la Hoja de Cálculo de Google

Esta hoja será tu base de datos donde se guardarán todas las inscripciones.

1.  **Crear la Hoja:** Ve a [sheets.google.com](https://sheets.google.com) y crea una nueva "Hoja de cálculo en blanco".
2.  **Cambiar Nombre de la Pestaña:** En la parte inferior, haz clic derecho en "Hoja 1" y selecciona "Cambiar nombre". Nómbrala exactamente `inscripciones`.
3.  **Copiar el ID:** Mira la URL en la barra de direcciones de tu navegador. Se verá algo así: `https://docs.google.com/spreadsheets/d/ID_LARGO_DE_LETRAS_Y_NUMEROS/edit`. Copia esa parte del medio (el ID). **Guárdalo, lo necesitarás en la siguiente parte.**
4.  **Añadir las Columnas:** En la primera fila de la hoja `inscripciones`, escribe los siguientes encabezados, cada uno en una columna separada (de la A a la J):
    - `Timestamp`
    - `Id_Curso`
    - `NombreCompleto`
    - `Curp`
    - `Email`
    - `Genero`
    - `CursoSeleccionado`
    - `DepartamentoSeleccionado`
    - `FechaVisible`
    - `Lugar`

---

## Parte 2: Desplegar el Backend (Google Apps Script)

Este script será el cerebro de tu aplicación. Recibirá los datos, los guardará en la hoja y enviará los correos.

1.  **Crear el Script:** Ve a [script.google.com](https://script.google.com) y haz clic en "**Nuevo proyecto**".
2.  **Pegar el Código:** Borra todo el código que aparece por defecto en el editor. Abre el archivo `Code.gs` que te proporcioné, copia todo su contenido y pégalo en el editor de Apps Script.
3.  **Configurar el ID de la Hoja:** Dentro del código que acabas de pegar, busca esta línea:
    ```javascript
    var SPREADSHEET_ID = 'TU_ID_DE_HOJA_DE_CALCULO_AQUI';
    ```
    Reemplaza `'TU_ID_DE_HOJA_DE_CALCULO_AQUI'` con el ID que copiaste en el paso anterior.
4.  **Guardar:** Haz clic en el ícono de guardar (disquete) en la parte superior.
5.  **Implementar la Aplicación Web:**
    -   Haz clic en el botón azul **"Implementar"** en la esquina superior derecha.
    -   Selecciona **"Nueva implementación"**.
    -   Haz clic en el ícono de engranaje (⚙️) junto a "Seleccionar tipo" y elige **"Aplicación web"**.
    -   En la configuración que aparece:
        -   **Descripción:** Pon algo como "API para Formulario de Inscripción".
        -   **Ejecutar como:** Déjalo en **"Yo (...)"**.
        -   **Quién tiene acceso:** Cámbialo a **"Cualquier persona"**. ¡Esto es muy importante para que funcione!
    -   Haz clic en el botón **"Implementar"**.
6.  **Autorizar Permisos:**
    -   Google te pedirá que revises y autorices los permisos. Haz clic en **"Autorizar el acceso"**.
    -   Elige tu cuenta de Google.
    -   Verás una pantalla de advertencia que dice "Google no ha verificado esta aplicación". No te preocupes, es normal. Haz clic en **"Configuración avanzada"** y luego en **"Ir a [Nombre de tu proyecto] (no seguro)"**.
    -   Finalmente, haz clic en **"Permitir"**.
7.  **Copiar la URL del Backend:**
    -   Después de autorizar, aparecerá una ventana con la **"URL de la aplicación web"**.
    -   **¡COPIA ESTA URL!** Es la dirección de tu backend. Guárdala para la siguiente parte.

---

## Parte 3: Desplegar el Frontend (GitHub Pages)

Ahora vamos a publicar la página web para que todo el mundo pueda verla.

1.  **Actualizar el Frontend:**
    -   Abre el archivo `index.html` en un editor de texto.
    -   Busca el bloque de **CONFIGURACIÓN OBLIGATORIA** que se ve así:
        ```html
        <script>
          window.CONFIG = {
            APPS_SCRIPT_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
          };
        </script>
        ```
    -   Reemplaza la URL de ejemplo (`https://.../YOUR_DEPLOYMENT_ID/exec`) con la **URL de la aplicación web** que copiaste en el último paso de la Parte 2.
    -   Guarda el archivo `index.html`.
2.  **Subir a GitHub:**
    -   Ve a [github.com](https://github.com) y crea un **"Nuevo repositorio"**.
    -   Dale un nombre (ej. `inscripcion-cursos`). Asegúrate de que sea **Público**.
    -   Una vez creado, haz clic en **"uploading an existing file"**.
    -   Arrastra tu archivo `index.html` (ya actualizado con la URL correcta) a la página y confirma la subida.
3.  **Activar GitHub Pages:**
    -   En tu repositorio de GitHub, ve a la pestaña **"Settings"** (Configuración).
    -   En el menú de la izquierda, haz clic en **"Pages"**.
    -   Bajo "Branch", asegúrate de que esté seleccionada la rama `main` (o `master`) y la carpeta `/ (root)`.
    -   Haz clic en **"Save"**.
4.  **¡Listo!**
    -   GitHub te mostrará un enlace a tu sitio publicado (puede tardar un par de minutos en activarse). La URL será algo como `https://tu-usuario.github.io/tu-repositorio/`.
    -   ¡Visita el enlace y tu sistema de inscripción estará en línea y funcionando!
