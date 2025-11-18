# Analizador Inteligente de Contenido de Imágenes

Aplicación **full-stack** que permite subir una imagen desde el navegador, enviarla a un backend Node.js y obtener etiquetas generadas por servicios de IA de análisis de imágenes (**Google Cloud Vision** e **Imagga**).  
Si un proveedor falla o no devuelve etiquetas útiles, el backend intenta de forma automática con el proveedor alternativo.

---

## Arquitectura general

Monorepo con dos aplicaciones:

- `frontend/` – SPA en **Angular** (standalone components, Angular Material, Atomic Design).
- `backend/` – API REST en **Node.js + Express + TypeScript** con arquitectura tipo **hexagonal (Ports & Adapters)**.

Comunicación:

- Front → Backend: `POST http://localhost:3000/api/analyze` (multipart/form-data con `image`).
- Backend → Proveedores IA: Google Vision / Imagga.

---

## Tecnologías utilizadas

**Frontend**

- Angular 20
- TypeScript
- RxJS
- Tailwind CSS 3 (dark mode por clase)
- PostCSS 8 + Autoprefixer
- Atomic Design (átomos / organismos / pages)

**Backend**

- Node.js 20+
- Express
- TypeScript
- Multer (subida de archivos en memoria)
- Sharp (conversión de imágenes AVIF/WEBP → JPEG)
- dotenv (gestión de variables de entorno)
- cors (CORS para desarrollo)
- fetch nativo de Node 20
- Integraciones externas:
    - Google Cloud Vision API
    - Imagga Image Tagging API

---

## Requisitos previos

- **Node.js** v20 o superior
- **npm** v10 o superior
- Cuenta en:
    - **Google Cloud Platform** con la API de Vision habilitada
    - **Imagga** (cuenta gratuita de desarrollador)

---

## Variables de entorno (backend)

Las credenciales y endpoints de los servicios de IA **no se hardcodean**; se gestionan por variables de entorno en un archivo `.env` dentro de `backend/` (este archivo está ignorado por `.gitignore`).

Crear el archivo:

`backend/.env`

con el siguiente contenido:

```env
# Puerto del backend
PORT=3000

# ---------- Google Cloud Vision ----------
# API Key de un proyecto con la Vision API habilitada
GOOGLE_VISION_API_KEY=tu_api_key_de_google_vision
# Endpoint REST (opcional – por defecto usa el estándar v1/images:annotate)
GOOGLE_VISION_ENDPOINT=https://vision.googleapis.com/v1/images:annotate

# ---------- Imagga ----------
# Credenciales Basic Auth
IMAGGA_API_KEY=tu_api_key_de_imagga
IMAGGA_API_SECRET=tu_api_secret_de_imagga
# Endpoint REST (opcional – por defecto usa el estándar v2/tags)
IMAGGA_BASE_URL=https://api.imagga.com/v2/tags
```

Notas:
- No subas este archivo al repositorio.
- El backend fallará al iniciar si faltan `GOOGLE_VISION_API_KEY`, `IMAGGA_API_KEY` o `IMAGGA_API_SECRET`.

---

## Instalación y ejecución local

Clona el repo y, en dos terminales, levanta backend y frontend por separado.

### 1) Backend (API REST)

Ubicación: `backend/`

Requisitos: Node.js 20+, npm 10+.

Pasos:
1. Instalar dependencias
   ```bash
   cd backend
   npm install
   ```
2. Crear `.env` como se indica arriba.
3. Ejecutar en modo producción (compilado a JS)
   ```bash
   npm run build
   npm start
   ```
   El servidor escuchará en `http://localhost:3000` por defecto.

   Opcional (desarrollo en caliente):
   ```bash
   npx ts-node-dev src/main.ts
   ```

Endpoints útiles:
- Healthcheck: `GET http://localhost:3000/health` → `{ "status": "ok" }`
- Análisis de imagen: `POST http://localhost:3000/api/analyze`
  - Content-Type: `multipart/form-data`
  - Campo del archivo: `image`
  - Límite de tamaño: 5 MB
  - Tipos permitidos: JPEG, PNG, WEBP, AVIF (AVIF/WEBP se convierten a JPEG para compatibilidad con Imagga)
  - Respuestas de error comunes
    - `400 NO_FILE_UPLOADED`: no se adjuntó archivo
    - `415 UNSUPPORTED_MEDIA_TYPE`: el mimetype no es una imagen (p. ej. PDF)
    - `415 UNSUPPORTED_IMAGE_TYPE`: imagen no permitida (solo JPEG, PNG, WEBP, AVIF)
    - `413 FILE_TOO_LARGE`: excede 5 MB
    - `400 IMAGE_CONVERSION_FAILED`: fallo al convertir AVIF/WEBP a JPEG
  - Respuesta exitosa (200)
    ```json
    {
      "tags": [{ "label": "cat", "confidence": 0.92 }],
      "provider": "google_vision"
    }
    ```
    Nota: `provider` puede ser `"google_vision"`, `"imagga"` o `null`.

### 2) Frontend (SPA Angular)

Ubicación: `frontend/`

Requisitos: Node.js 20+, npm 10+.

Pasos:
1. Instalar dependencias
   ```bash
   cd frontend
   npm install
   ```
2. Iniciar el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
   La app estará en `http://localhost:4200`.
   
   Nota: El backend expone CORS permitiendo `http://localhost:4200` y `http://localhost:8080`, por lo que puedes llamar directamente a `http://localhost:3000/api/...` desde el frontend sin proxy.

Notas (estilos):
- La app usa Tailwind CSS con dark mode activado por clase. En `src/index.html`, el `<html>` tiene `class="dark"` y el `<body>` usa utilidades Tailwind para fondo y color de texto oscuros.
- Los estilos globales y utilidades personalizadas (`.card`, `.btn-primary`, `.btn-tonal`, `.pill`) se definen en `src/styles.css` dentro de `@layer components` junto con `@tailwind base`, `@tailwind components`, `@tailwind utilities`.

Flujo de uso:
1. Abre `http://localhost:4200`.
2. Selecciona una imagen (hasta 5 MB; JPEG/PNG/WEBP/AVIF).
3. Presiona “Analizar”. El front enviará `multipart/form-data` a `POST /api/analyze`.
4. Comportamiento de la UI:
   - Se muestra un indicador de carga “Analizando imagen…”.
   - La imagen de previsualización NO se muestra hasta que el backend devuelva etiquetas válidas.
   - Al recibir etiquetas, se muestra la imagen y los tags; si no hay etiquetas útiles, se muestra un mensaje de aviso.
   - Si seleccionas una nueva imagen, se limpian inmediatamente la previsualización, tags, proveedor y errores anteriores (se revoca la URL anterior para evitar fugas de memoria).

---

## Detalles de implementación relevantes

- Arquitectura backend: puertos/adaptadores (hexagonal). Caso de uso: `AnalyzeImageUseCase` que orquesta proveedores y aplica filtros (`minConfidence`, `maxTags`).
- Proveedores de IA:
  - Google Vision REST `images:annotate` con API Key.
  - Imagga `v2/tags` con Basic Auth (key/secret).
- Normalización de formatos: si subes AVIF/WEBP, el backend los convierte a JPEG con Sharp para asegurar compatibilidad con Imagga.
- CORS:
  - El backend Express incluye CORS habilitado para los orígenes `http://localhost:4200` (desarrollo local) y `http://localhost:8080` (Docker).
  - Desde el frontend puedes llamar al backend usando URLs absolutas como `http://localhost:3000/api/analyze` sin errores de CORS.
  - Si necesitas permitir otros orígenes, ajusta la lista `origin` en `backend/src/infrastructure/rest/express/app.ts`.

---

## Ejecución con Docker

Se proveen Dockerfiles multietapa y un `docker-compose.yml` para levantar frontend y backend.

### Requisitos
- Docker y Docker Compose
- Archivo `backend/.env` con las variables descritas en la sección de entorno

### Levantar servicios
```bash
docker compose up -d --build
```

### Acceso
- Frontend (Nginx): `http://localhost:8080`
- Backend (Express): `http://localhost:3000`
- Health de frontend: `http://localhost:8080/health` (devuelto por Nginx)
- Health de backend: `http://localhost:3000/health`

### Comunicación en Docker
- Frontend en `http://localhost:8080` llama al backend en `http://localhost:3000`.
- El backend incluye CORS para `http://localhost:8080`, por lo que no se requiere proxy en Nginx.

### Builds más rápidos
- Los Dockerfiles están optimizados con `npm ci`, multietapa y podado de dependencias (`npm prune --omit=dev` en backend).
- Se recomienda añadir `.dockerignore` en `backend/` y `frontend/` para excluir `node_modules`, `dist`, `.git`, etc., y acelerar el envío de contexto.

### UI (Atomic Design con Tailwind)
- Átomos: `ui-primary-button`, `ui-file-input`, `ui-loading` (spinner), `ui-tag`.
- Organismo: `ui-image-upload-panel`.
- Página: `ImageAnalyzerPage` compone el organismo y muestra resultados debajo del panel de análisis.

Notas UX recientes:
- Previsualización de imagen: Angular `NgOptimizedImage` no soporta URLs `blob:`. Para el preview se reemplazó `ngSrc` por `src` en el `<img>` de la página para evitar el error `NG02952` y permitir blobs.
- La previsualización se retrasa hasta que existan etiquetas (mejor percepción de “análisis en progreso”).
- Al seleccionar un nuevo archivo, se limpia el resultado anterior y se revoca la `ObjectURL` para liberar memoria.
- Accesibilidad y responsive: en móviles los botones son de ancho completo (`w-full`) con texto centrado y salto de línea para evitar desbordes; a partir de `md` vuelven a ancho natural.

---

## Resolución de problemas (FAQ)

- 415/400 al subir imagen: verifica que el campo sea `image` y que el archivo sea de tipo imagen permitido y menor a 5 MB.
- 401/403 de proveedores: comprueba las variables de entorno y que tu proyecto de GCP tenga la Vision API habilitada; en Imagga, revisa que key/secret sean válidos.
- CORS bloqueado: confirma que el front corre en `http://localhost:4200` o `http://localhost:8080` y el backend en `http://localhost:3000`. Si usas otros puertos/orígenes, ajusta `cors()` en `backend/src/infrastructure/rest/express/app.ts`.
- 500 del backend: mira la consola del backend; si un proveedor falla, el caso de uso intenta el alternativo. Si ambos fallan, se retorna error.
- Tema oscuro no aplicado: Tailwind usa `darkMode: 'class'`. Asegúrate de que en `frontend/src/index.html` el elemento `<html>` tenga `class="dark"` y que `src/styles.css` cargue correctamente con `@tailwind`.

### Errores de TypeScript/Vitest frecuentes

- TS2307: "Cannot find module 'vite-tsconfig-paths'" al ejecutar pruebas en `backend/`:
  - Instala el plugin en el backend: `cd backend && npm i -D vite-tsconfig-paths`.
  - El archivo `backend/vitest.config.ts` usa `plugins: [tsconfigPaths()]`.

- TS7016: "Could not find a declaration file for module 'supertest'":
  - Instala tipos: `cd backend && npm i -D @types/supertest`.
  - Asegúrate que `backend/tsconfig.json` incluya `"types": ["vitest", "node"]`.

### Pruebas (backend)

El backend usa **Vitest** + **Supertest**. Pruebas incluidas:
- `src/aplication/service/AnalyzeImageUseCase.spec.ts`: orquestación de proveedores y filtros.
- `src/infrastructure/rest/routes/imageAnalyzerRouter.spec.ts`: validaciones de la ruta `/api/analyze` (mimetype y tamaño).

Comandos:
```bash
cd backend
npm test           # Ejecuta las pruebas (modo run)
npm run test:watch # Modo watch con Vitest UI opcional
npm run test:ui    # Abre la UI de Vitest
```

Cobertura: configurada con `@vitest/coverage-v8` (report `text` y `html`). El reporte HTML se genera en `backend/coverage/`.

Nota CI: si ejecutas pruebas en CI, instala también `devDependencies` (no uses `--only=production`) para disponer de `vitest`, `supertest`, `@types/supertest` y `vite-tsconfig-paths`.

### Convenciones de commits

Se sigue un formato estilo Conventional Commits en minúsculas. Ejemplos recientes:
- `fix(frontend): show preview only after tags and clear previous result on new selection`
- `test(backend): add route specs for /api/analyze (media type and size limits)`
- `chore(backend): add @types/supertest and enable Vitest types in tsconfig`

---

## Scripts principales

Frontend:
- `npm start` → `ng serve` (dev en `http://localhost:4200`).
- `npm run build` → build de producción.

Backend:
- `npm run build` → compila TypeScript a `dist/`.
- `npm start` → ejecuta `node dist/main.js`.
- Desarrollo opcional: `npx ts-node-dev src/main.ts` (hot reload).