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

### 2) Frontend (SPA Angular)

Ubicación: `frontend/`

Requisitos: Node.js 20+, npm 10+.

Pasos:
1. Instalar dependencias
   ```bash
   cd frontend
   npm install
   ```
2. Configurar la URL del backend para desarrollo local. Edita:
   `src/environments/environment.development.ts`
   y asegúrate de que apunte a tu API local:
   ```ts
   export const environment = {
     production: false,
     apiBaseUrl: 'http://localhost:3000/api',
   };
   ```
   Nota: El backend permite CORS desde `http://localhost:4200`.
3. Iniciar el servidor de desarrollo de Angular:
   ```bash
   npm start
   ```
   La app estará en `http://localhost:4200`.

Notas (estilos):
- La app usa Tailwind CSS con dark mode activado por clase. En `src/index.html`, el `<html>` tiene `class="dark"` y el `<body>` usa utilidades Tailwind para fondo y color de texto oscuros.
- Los estilos globales y utilidades personalizadas (`.card`, `.btn-primary`, `.btn-tonal`, `.pill`) se definen en `src/styles.css` dentro de `@layer components` junto con `@tailwind base`, `@tailwind components`, `@tailwind utilities`.

Flujo de uso:
1. Abre `http://localhost:4200`.
2. Selecciona una imagen (hasta 5 MB; JPEG/PNG/WEBP/AVIF).
3. Presiona “Analizar”. El front enviará `multipart/form-data` a `POST /api/analyze`.
4. Verás etiquetas con su confianza y el proveedor que respondió.

---

## Detalles de implementación relevantes

- Arquitectura backend: puertos/adaptadores (hexagonal). Caso de uso: `AnalyzeImageUseCase` que orquesta proveedores y aplica filtros (`minConfidence`, `maxTags`).
- Proveedores de IA:
  - Google Vision REST `images:annotate` con API Key.
  - Imagga `v2/tags` con Basic Auth (key/secret).
- Normalización de formatos: si subes AVIF/WEBP, el backend los convierte a JPEG con Sharp para asegurar compatibilidad con Imagga.
- CORS: habilitado para `http://localhost:4200` (métodos GET/POST/OPTIONS y cabecera `Content-Type`).

### UI (Atomic Design con Tailwind)
- Átomos: `ui-primary-button`, `ui-file-input`, `ui-loading` (spinner), `ui-tag`.
- Organismo: `ui-image-upload-panel`.
- Página: `ImageAnalyzerPage` compone el organismo y muestra resultados debajo del panel de análisis.

---

## Resolución de problemas (FAQ)

- 415/400 al subir imagen: verifica que el campo sea `image` y que el archivo sea de tipo imagen permitido y menor a 5 MB.
- 401/403 de proveedores: comprueba las variables de entorno y que tu proyecto de GCP tenga la Vision API habilitada; en Imagga, revisa que key/secret sean válidos.
- CORS bloqueado: confirma que el front corre en `http://localhost:4200` y el backend en `http://localhost:3000`. Si usas otros puertos, ajusta `cors()` en `backend/src/infrastructure/rest/express/app.ts`.
- 500 del backend: mira la consola del backend; si un proveedor falla, el caso de uso intenta el alternativo. Si ambos fallan, se retorna error.
- Tema oscuro no aplicado: Tailwind usa `darkMode: 'class'`. Asegúrate de que en `frontend/src/index.html` el elemento `<html>` tenga `class="dark"` y que `src/styles.css` cargue correctamente con `@tailwind`.

---

## Scripts principales

Frontend:
- `npm start` → `ng serve` (dev en `http://localhost:4200`).
- `npm run build` → build de producción.

Backend:
- `npm run build` → compila TypeScript a `dist/`.
- `npm start` → ejecuta `node dist/main.js`.
- Desarrollo opcional: `npx ts-node-dev src/main.ts` (hot reload).