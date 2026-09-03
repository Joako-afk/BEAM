# Proyecto BEAM

**Beneficios Estatales para el Adulto Mayor** — Plataforma web que lista beneficios sociales para adultos mayores (60+), organizados por categorías, instituciones y zonas geográficas. Incluye mapa interactivo con Leaflet/PostGIS.

## Contexto del Proyecto

**Problema:** En Chile, el envejecimiento acelerado ha generado una brecha crítica de comunicación entre la oferta de beneficios estatales y el acceso efectivo por parte de adultos mayores. Muchos beneficios (como la atención odontológica garantizada a los 60 años) tienen requisitos temporales estrictos y se pierden por desinformación. Aunque hay alta adopción de smartphones en este grupo, las plataformas existentes no están adaptadas a sus necesidades.

**Objetivo General:** Desarrollar una plataforma virtual con diseño centrado en el usuario para entregar información y geolocalización de beneficios estatales, mejorando el conocimiento y acceso de los adultos mayores.

## Diseño Centrado en el Adulto Mayor

El proyecto implementa reglas específicas para personas mayores:
- **Legibilidad:** Letra mínimo 16px, interlineado 130%-150%, alto contraste, opciones para daltonismo
- **Navegación Simple:** Botones tipo tarjetas (grandes, con iconografía clara), códigos de colores por categoría (Salud=azul, Eventos=morado)
- **Accesibilidad:** Botones de Text-to-Speech integrados, opción de descargar fichas en PDF

## Funcionalidades Principales

1. **Buscador y Filtros:** Por palabra clave, costo, edad mínima
2. **Geolocalización Dinámica:** Mapa con sucursales donde se tramitan beneficios + ubicación del usuario
3. **Módulo de Notificaciones:** Alertas sobre beneficios nuevos, modificados o eliminados
4. **Postulación y Contacto:** Llamadas directas a organismos, formularios de postulación
5. **Panel de Administración:** Acceso seguro (bcrypt) para gestores

## Comandos

### Backend (`BACKEND/`)
- `cd BACKEND && npm run dev` — arranca el servidor con nodemon en puerto 4000
- `cd BACKEND && npm start` — arranca sin nodemon

### Frontend (`FRONTEND/`)
- `cd FRONTEND && npm run dev` — arranca Vite dev server
- `cd FRONTEND && npm run build` — compila para producción
- `cd FRONTEND && npm run lint` — ejecuta ESLint (debe pasar antes de cada PR)
- `cd FRONTEND && npm run preview` — vista previa del build
- `cd FRONTEND && npm test` — ejecuta tests E2E con Playwright
- `cd FRONTEND && npm run test:ui` — abre la UI visual de Playwright
- `cd FRONTEND && npm run test:report` — muestra el reporte de tests
- `cd FRONTEND && npm run test:unit` — ejecuta unit tests con Vitest
- `cd FRONTEND && npm run test:unit:watch` — Vitest en modo watch

### Orden de verificación
Ejecutar: `lint -> build -> test` (frontend). El backend no tiene lint ni tests configurados.

## Estructura del proyecto
- `BACKEND/` — API Express, autónomo (su propio `package.json`)
- `BACKEND/server.js` — punto de entrada, configura rutas en `/api/*`
- `BACKEND/src/config/db.js` — conexión al pool de PostgreSQL
- `BACKEND/src/controllers/` — lógica de cada recurso
- `BACKEND/src/models/` — queries SQL directas con `pool.query()`
- `BACKEND/src/routes/` — definición de endpoints Express
- `BACKEND/src/utils/slugify.js` — generador de slugs (quita tildes, normaliza)
- `FRONTEND/` — SPA React, autónomo (su propio `package.json`)
- `FRONTEND/src/pages/` — páginas (inicio, categoría, beneficio, institución, login, presentación)
- `FRONTEND/src/components/` — componentes reutilizables (cards, navbar, mapa, etc.)
- `FRONTEND/src/layouts/` — layouts: `basic.jsx` (con navbar+footer) e `internal.jsx`
- `FRONTEND/src/styles/` — CSS global (`index.css`), paletas de colores, temas (light/dark/daltonic)
- `FRONTEND/src/utils/` — helpers (paletas, PDF, conversión texto a lista)
- `BD/Proyecto.sql` — script SQL de creación de la base de datos completa
- `database/init.sql/` — directorio vacío (reservado para inicialización)
- `FRONTEND/tests/` — tests E2E con Playwright
- `FRONTEND/tests/unit/` — unit tests con Vitest (slugify, generatePalette)
- `FRONTEND/tests/api/` — API tests para endpoints del backend
- `FRONTEND/tests/accessibility/` — accessibility tests con axe-core
- `FRONTEND/playwright.config.js` — configuración de Playwright

## Convenciones
- **ESM en todo:** todos los archivos usan `import`/`export`, no `require()`
- **Slugs para rutas:** las URLs usan slugs (`/beneficio/:slug`), no IDs numéricos
- **Tailwind CSS 4:** usa `@import "tailwindcss"` en CSS (sintaxis v4, no v3)
- **CSS variables para temas:** colores controlados via `--primary`, `--secondary`, `--tertiary`, etc. en `:root`
- **Archivos:** `.js` para backend, `.jsx` para frontend. **Sin TypeScript**
- **Nombre de archivos:** inconsistente — ver `usuariocontroller.js` (minúsculas) vs `beneficioController.js` (camelCase). Seguir el patrón existente del directorio donde se trabaje
- **WCAG AA en colores:** `generatePalette` ajusta automáticamente `primary` y `secondary` para cumplir contraste 4.5:1 con blanco. Los colores oscurecidos se aplican a cards, header y footer de cada categoría

## Accesibilidad (WCAG AA)
- **`generatePalette`** usa `ensureContrastWithWhite()` para oscurecer colores que no pasan 4.5:1 con texto blanco
- **Leaflet CSS overrides** en `src/styles/index.css` corrigen contraste de controles de zoom y atribución
- **Tests de accesibilidad** cubren: Inicio, las 4 categorías (Salud, Tiempo Libre, Organizaciones, Eventos) y Beneficio — 30 tests en total
- Login excluido de tests de accesibilidad por ahora (falta agregar labels a inputs)
- Vitest configurado con `include: ['tests/unit/**/*.spec.js']` para ignorar archivos de Playwright

## No hagas
- **No toques `.env`:** contienen credenciales reales de PostgreSQL y URLs de API. Ya están en `.gitignore`
- **No instales dependencias sin preguntar:** los `package.json` son estables
- **No subas nunca archivos `.env`, `Proyecto.sql` ni `node_modules/`**

## Flujo de trabajo
- Antes de una tarea no trivial, propón un plan y espera mi OK.
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo revise.
- Si no estás seguro al 80%, pregunta. No inventes.

## Documentación
- El esquema de BD completo está en `BD/Proyecto.sql` — léelo antes de tocar modelos o crear migraciones
- El frontend hardcodea `http://localhost:4000/api/...` en algunos componentes (verificar antes de cambiar puertos)

## Estado Actual de la BD (Agosto 2026)

### Datos cargados
- **4 categorías:** Salud (#011991), Tiempo Libre (#669101), Organizaciones (#860707), Eventos (#860784)
- **1 beneficio:** EMPAM (Examen Médico Preventivo del Adulto Mayor) — categoría Salud
- **1 institución:** ChileAtiende — categoría Organizaciones Sociales
- **1 organismo:** Sucursal ChileAtiende Puerto Varas (con coordenadas PostGIS: -41.6168, -73.5956)
- **1 territorio:** Región Los Lagos → Maullín, Puerto Varas
- **3 redes sociales:** Facebook, Instagram, Twitter (de ChileAtiende)
- **1 información extra:** "¿Dónde está presente?"

### Tablas vacías
- `evento`, `notificacion`, `usuario`, `beneficio_comuna`, `organismo_evento`

### Relaciones clave
- EMPAM (beneficio) → Salud (categoría)
- ChileAtiende (institución) → Organizaciones Sociales (categoría)
- Sucursal Puerto Varas (organismo) → ChileAtiende (institución) + Puerto Varas (territorio)
- La sucursal tiene PostGIS POINT para el mapa
