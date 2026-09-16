# A.md — Contexto Completo del Proyecto BEAM

> Este archivo contiene el contexto completo del proyecto BEAM para uso de herramientas de IA y desarrolladores. Última actualización: Septiembre 2026.

---

## 1. Identificación del Proyecto

- **Nombre:** BEAM — Beneficios Estatales para el Adulto Mayor
- **Tipo:** Plataforma web SPA + API REST
- **Stack:** Node.js + Express 5, React 19 + Vite 7 + Tailwind CSS 4, PostgreSQL + PostGIS
- **Lenguaje:** JavaScript (ESM). Sin TypeScript
- **Estado:** En desarrollo activo. SIB (panel admin) funcional, sitio público funcional

---

## 2. Problema y Objetivo

**Problema:** En Chile, el envejecimiento acelerado ha generado una brecha crítica de comunicación entre la oferta de beneficios estatales y el acceso efectivo por parte de adultos mayores (60+). Muchos beneficios tienen requisitos temporales estrictos y se pierden por desinformación.

**Objetivo:** Desarrollar una plataforma virtual con diseño centrado en el usuario para entregar información y geolocalización de beneficios estatales, mejorando el conocimiento y acceso de los adultos mayores.

---

## 3. Principios Innegociables (constitution.md)

| # | Principio | Resumen |
|---|-----------|---------|
| 1 | Stack fijo | No se agregan dependencias sin aprobación explícita por escrito |
| 2 | AGENTS.md como fuente de verdad | Si hay contradicción entre código y AGENTS.md, se corrige el código |
| 3 | Separación lógica e interfaz | Controllers async, models SQL crudo, components solo UI. MVC sin frameworks |
| 4 | Tests obligatorios | Flujo: `lint → build → test`. Un test roto bloquea el merge |
| 5 | SQL crudo, sin ORM | `pool.query()` directo. PostGIS es central. Sin Prisma/Sequelize/TypeORM |
| 6 | Código en inglés, dominio en español | Variables/funcs/archivos en inglés. UI textos en español |

---

## 4. Arquitectura del Proyecto

### 4.1 Estructura de Directorios

```
D:\PROYECTO\
├── AGENTS.md                    # Convenciones y reglas del proyecto
├── docs/
│   └── constitution.md          # 6 principios innegociables
├── specs/
│   └── 001-SIB/
│       ├── spec.md              # Spec funcional del SIB (RF-01 a RF-28)
│       └── plan.md              # Plan de arquitectura (8 tareas)
├── BD/
│   └── Proyecto.sql             # Schema SQL completo de la BD
├── BACKEND/
│   ├── package.json             # Dependencias backend (Express 5, pg, etc.)
│   ├── server.js                # Entry point, monta rutas en /api/*
│   └── src/
│       ├── config/db.js         # Pool de conexión PostgreSQL
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── beneficioController.js
│       │   ├── categoriaController.js
│       │   ├── organismoController.js
│       │   └── usuarioController.js
│       ├── models/
│       │   ├── beneficioModel.js
│       │   ├── categoriaModel.js
│       │   ├── eventoModel.js
│       │   └── organismoModel.js
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── beneficioRoutes.js
│       │   ├── categoriaRoutes.js
│       │   ├── legacyRoutes.js
│       │   ├── organismoRoutes.js
│       │   └── usuarioRoutes.js
│       ├── scripts/
│       │   └── migrateSlugs.js
│       └── utils/
│           └── slugify.js
├── FRONTEND/
│   ├── package.json             # Dependencias frontend (React 19, Vite 7, etc.)
│   ├── vite.config.js
│   ├── playwright.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/
│       │   ├── inicio.jsx
│       │   ├── categoria.jsx
│       │   ├── beneficio.jsx
│       │   ├── institucion.jsx
│       │   ├── configuraciones.jsx   # Panel admin (SIB)
│       │   ├── login.jsx
│       │   └── presentacion.jsx
│       ├── components/
│       │   ├── admin/
│       │   │   ├── BeneficioForm.jsx
│       │   │   ├── CategoriaForm.jsx
│       │   │   ├── EventoForm.jsx
│       │   │   ├── InstitucionForm.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── OrganismoForm.jsx
│       │   │   ├── TerritorioForm.jsx
│       │   │   └── MapPicker.jsx
│       │   ├── card.jsx
│       │   ├── carddesign.jsx
│       │   ├── footer.jsx
│       │   └── navbar.jsx
│       ├── layouts/
│       │   ├── basic.jsx
│       │   └── internal.jsx
│       ├── styles/
│       │   └── index.css
│       └── utils/
│           ├── generatePalette.js
│           ├── PDF.js
│           └── textToList.js
└── tests/
    ├── unit/
    │   └── slugify.spec.js
    ├── api/
    ├── accessibility/
    └── e2e/
```

### 4.2 Convenciones de Archivos

| Directorio | Patrón | Ejemplo |
|------------|--------|---------|
| BACKEND/controllers/ | `<nombre>Controller.js` | `adminController.js` |
| BACKEND/models/ | `<nombre>Model.js` | `beneficioModel.js` |
| BACKEND/routes/ | `<nombre>Routes.js` | `adminRoutes.js` |
| FRONTEND/components/admin/ | `<Nombre>Form.jsx` | `BeneficioForm.jsx` |
| FRONTEND/pages/ | `<nombre>.jsx` | `configuraciones.jsx` |

---

## 5. Base de Datos

### 5.1 Schema (17 tablas)

| Tabla | Descripción | PK |
|-------|-------------|-----|
| `USUARIO` | Gestores del sistema | `ID_USUARIO` |
| `DIVISION_TERRITORIAL` | Regiones y comunas (auto-referenciada) | `ID_DIVTER` |
| `CATALOGO_REDES` | Catálogo de redes sociales | `ID_RED` |
| `INSTITUCION` | Instituciones públicas | `ID_INSTITUCION` |
| `INSTITUCION_REDES` | Redes de cada institución | `(ID_INSTITUCION, ID_RED)` |
| `ORGANISMO` | Sucursales físicas (con PostGIS POINT) | `ID_ORGANISMO` |
| `CATEGORIA` | Categorías de beneficios | `ID_CATEGORIA` |
| `BENEFICIO` | Beneficios sociales | `ID_BENEFICIO` |
| `INFORMACION` | Bloques de contenido extra | `ID_INFO` |
| `EVENTO` | Eventos | `ID_EVENTO` |
| `NOTIFICACION` | Alertas del sistema | `ID_NOTIFICACION` |
| `BENEFICIO_ORGANISMO` | Relación N:M beneficio-organismo | `(ID_BENEFICIO, ID_ORGANISMO)` |
| `BENEFICIO_COMUNA` | Relación N:M beneficio-comuna | `(ID_BENEFICIO, ID_DIVTER)` |
| `INFORMACION_BENEFICIO` | Relación N:M info-beneficio | `(ID_INFO, ID_BENEFICIO)` |
| `INFORMACION_INSTITUCION` | Relación N:M info-institución | `(ID_INFO, ID_INSTITUCION)` |
| `INFORMACION_ORGANISMO` | Relación N:M info-organismo | `(ID_INFO, ID_ORGANISMO)` |
| `ORGANISMO_EVENTO` | Relación N:M organismo-evento | `(ID_ORGANISMO, ID_EVENTO)` |

### 5.2 Jerarquía Territorial

```
DIVISION_TERRITORIAL (auto-referenciada)
├── REGION (id_padre = NULL)
│   ├── COMUNA (id_padre = ID de la región)
│   └── COMUNA ...
└── REGION ...
```

- CHECK constraint: REGION tiene `id_padre = NULL`, COMUNA tiene `id_padre NOT NULL`

### 5.3 Coordenadas PostGIS

- `ORGANISMO.COORDENADAS` es `GEOMETRY(Point, 4326)`
- Se inserta con: `ST_SetSRID(ST_MakePoint(lng, lat), 4326)`
- Se lee con: `ST_X(o.coordenadas) AS lng, ST_Y(o.coordenadas) AS lat`

### 5.4 Datos Actuales (Septiembre 2026)

| Entidad | Registros | Notas |
|---------|-----------|-------|
| Categorías | 4 | Salud, Tiempo Libre, Organizaciones, Eventos |
| Beneficios | 1 | EMPAM (Examen Médico Preventivo del Adulto Mayor) |
| Instituciones | 1 | ChileAtiende |
| Organismos | 1 | Sucursal ChileAtiende Puerto Varas |
| Territorios | 3 | Región Los Lagos, Maullín, Puerto Varas |
| Redes sociales | 3 | Facebook, Instagram, Twitter |
| Información extra | 1 | "¿Dónde está presente?" |

### 5.5 Slugs

- Se generan automáticamente desde el NOMBRE usando `slugify.js`
- Conservan paréntesis: `"Examen Médico (EMPAM)"` → `"examen-medico-(empam)"`
- Se usan en URLs: `/beneficio/:slug`, `/categoria/:slug`, `/institucion/:slug`
- Redirecciones 301 en `GET /api/legacy/:entity/:oldSlug`

---

## 6. API Backend

### 6.1 Endpoints Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/categorias` | Listar categorías |
| GET | `/api/beneficios` | Listar beneficios |
| GET | `/api/beneficios/:slug` | Detalle de beneficio por slug |
| GET | `/api/instituciones` | Listar instituciones |
| GET | `/api/instituciones/:slug` | Detalle de institución por slug |
| GET | `/api/organismos` | Listar organismos (para mapa) |
| GET | `/api/legacy/:entity/:oldSlug` | Redirect 301 a slug actualizado |

### 6.2 Endpoints Admin (SIB)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/categorias` | Listar con `?search=&page=` |
| POST | `/api/admin/categorias` | Crear categoría |
| PUT | `/api/admin/categorias/:id` | Editar categoría |
| DELETE | `/api/admin/categorias/:id` | Eliminar (bloqueada si tiene beneficios) |
| GET | `/api/admin/beneficios` | Listar con `?search=&page=` |
| POST | `/api/admin/beneficios` | Crear (transaccional: comunas, organismos, info) |
| PUT | `/api/admin/beneficios/:id` | Editar (transaccional) |
| DELETE | `/api/admin/beneficios/:id` | Eliminar en cascada |
| GET | `/api/admin/instituciones` | Listar con `?search=&page=` |
| POST | `/api/admin/instituciones` | Crear institución |
| PUT | `/api/admin/instituciones/:id` | Editar institución |
| DELETE | `/api/admin/instituciones/:id` | Eliminar (cascada con organismos) |
| GET | `/api/admin/organismos` | Listar con `?search=&page=` |
| POST | `/api/admin/organismos` | Crear organismo (valida duplicados) |
| PUT | `/api/admin/organismos/:id` | Editar organismo |
| DELETE | `/api/admin/organismos/:id` | Eliminar en cascada |
| GET | `/api/admin/territorios` | Listar con `?search=&page=` |
| POST | `/api/admin/territorios` | Crear territorio |
| PUT | `/api/admin/territorios/:id` | Editar (solo nombre) |
| DELETE | `/api/admin/territorios/:id` | Eliminar (cascada región→comunas) |
| GET | `/api/admin/eventos` | Listar con `?search=&page=` |
| POST | `/api/admin/eventos` | Crear evento (fecha futura) |
| PUT | `/api/admin/eventos/:id` | Editar evento |
| DELETE | `/api/admin/eventos/:id` | Eliminar en cascada |

### 6.3 Respuesta Estándar de Listados

```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### 6.4 Formato de Body (Crear/Editar Beneficio)

```json
{
  "nombre": "...",
  "descripcion": "...",
  "requisitos": "...",
  "costo": 0,
  "edad_minima": 65,
  "icon_name": "examen.svg",
  "id_categoria": 1,
  "comunas": [1, 2, 3],
  "organismos": [1],
  "info_bloques": [
    { "nombre": "¿Dónde está presente?", "contenido": "..." }
  ]
}
```

---

## 7. Frontend

### 7.1 Rutas Principales

| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Catálogo de categorías, buscador |
| `/categoria/:slug` | Categoría | Beneficios e instituciones de una categoría |
| `/beneficio/:slug` | Beneficio | Detalle completo del beneficio |
| `/institucion/:slug` | Institución | Detalle de la institución |
| `/login` | Login | Acceso al panel admin |
| `/presentacion` | Presentación | Landing page |

### 7.2 Rutas Admin (SIB)

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard con tarjetas de acceso |
| `/admin/configuraciones` | Panel de configuraciones (CRUD 6 entidades) |

### 7.3 Diseño Centrado en el Adulto Mayor

- **Legibilidad:** Letra mínimo 16px, interlineado 130%-150%, alto contraste
- **Navegación:** Botones tipo tarjetas grandes con iconografía clara
- **Accesibilidad:** Text-to-Speech, descarga PDF, WCAG AA
- **Colores por categoría:** Salud=azul (#011991), Tiempo Libre=verde (#669101), Organizaciones=rojo (#860707), Eventos=púrpura (#860784)
- **Temas:** Light/Dark/Daltonic vía CSS variables (`--primary`, `--secondary`, etc.)

### 7.4 Componentes Admin

| Componente | Props | Función |
|------------|-------|---------|
| `BeneficioForm` | `data`, `categorias`, `comunas`, `organismos`, `onSubmit`, `onCancel` | Formulario con comunas (checkboxes), organismos (checkboxes), info blocks (dynamic) |
| `CategoriaForm` | `data`, `onSubmit`, `onCancel` | Upload de icono SVG, selector de color |
| `InstitucionForm` | `data`, `categorias`, `onSubmit`, `onCancel` | Upload de logo |
| `OrganismoForm` | `data`, `instituciones`, `territorios`, `onSubmit`, `onCancel` | MapPicker con Leaflet |
| `TerritorioForm` | `data`, `regiones`, `onSubmit`, `onCancel` | Tipo inmutable en edición |
| `EventoForm` | `data`, `onSubmit`, `onCancel` | Validación fecha futura |
| `MapPicker` | `lat`, `lng`, `onChange` | Mapa Leaflet click-to-place + flyTo en edición |
| `Modal` | `isOpen`, `onClose`, `title`, `children` | Modal genérico |

### 7.5 Búsqueda y Paginación

- **Debounce:** 300ms antes de enviar al backend
- **Paginación:** 20 registros por página
- **Estados vacíos:** "No hay [entidades] registradas" / "No se encontraron resultados"
- **Implementación:** `searchRef` para evitar re-renders, `fetchAll` sin `search` en dependencies

---

## 8. Funcionalidades Implementadas (SIB)

### 8.1 CRUD Completo

| Entidad | Crear | Listar | Editar | Eliminar |
|---------|-------|--------|--------|----------|
| Beneficios | ✅ | ✅ | ✅ | ✅ con cascada |
| Categorías | ✅ | ✅ | ✅ | ✅ bloqueada si tiene beneficios |
| Instituciones | ✅ | ✅ | ✅ | ✅ con cascada |
| Organismos | ✅ | ✅ | ✅ | ✅ con cascada |
| Territorios | ✅ | ✅ | ✅ | ✅ con cascada |
| Eventos | ✅ | ✅ | ✅ | ✅ con cascada |

### 8.2 Funcionalidades Adicionales

- **Transacciones:** Creación/edición de beneficio con comunas, organismos e info blocks en una transacción SQL
- **Validación de duplicados:** Organismos no pueden duplicarse dentro de la misma comuna
- **Iconos y logos:** Upload de archivos SVG/PNG/JPG (máx 2MB) con preview
- **Mapa:** Leaflet con click-to-place para coordenadas, flyTo al editar
- **Slugs:** Auto-generados con paréntesis conservados, redirecciones 301
- **Eliminación en cascada:** Advertencia con desglose de relaciones antes de eliminar

### 8.3 Mapa de Relaciones para Eliminación en Cascada

```
Categoría ──(1:N)──> Beneficio
    │                    ├─── (N:M) ──> Comunas (BENEFICIO_COMUNA)
    │                    ├─── (N:M) ──> Organismos (BENEFICIO_ORGANISMO)
    │                    └─── (N:M) ──> Información (INFORMACION_BENEFICIO)
    │
Institución ──(1:N)──> Organismo
    │                    ├─── (N:M) ──> Beneficios (BENEFICIO_ORGANISMO)
    │                    └─── (N:M) ──> Eventos (ORGANISMO_EVENTO)
    │
Territorio (Región) ──(1:N)──> Territorio (Comuna)
    │                              ├─── (N:M) ──> Beneficios (BENEFICIO_COMUNA)
    │                              └─── (1:N) ──> Organismos (ORGANISMO)
    │
Evento ──(N:M)──> Organismos (ORGANISMO_EVENTO)
```

---

## 9. Convenciones de Código

### 9.1 Generales

- **ESM:** `import`/`export` en todos los archivos. Sin `require()`
- **Sin TypeScript:** Solo `.js` (backend) y `.jsx` (frontend)
- **Tailwind CSS 4:** `@import "tailwindcss"` en CSS (sintaxis v4, no v3)
- **CSS variables:** `--primary`, `--secondary`, `--tertiary` en `:root`
- **Fetch:** `fetch()` nativo contra `http://localhost:4000/api/...`

### 9.2 Backend

- Controllers: funciones async que reciben `(req, res)`
- Models: `pool.query()` directo, SQL crudo
- Routes: Express Router con prefijo `/api/admin/`
- Validaciones: en el controller antes del model
- Errores: `{ error: "mensaje" }` con status code apropiado

### 9.3 Frontend

- Components: React function components, hooks
- State: `useState`/`useEffect`/`useCallback`/`useRef`
- Estilos: Tailwind utility classes
- Modals: componente `Modal.jsx` reutilizable
- Forms: controlled components con `onChange`

### 9.4 Tests

- **E2E:** Playwright (`FRONTEND/tests/`)
- **Unit:** Vitest (`FRONTEND/tests/unit/`)
- **API:** Playwright (`FRONTEND/tests/api/`)
- **Accessibility:** axe-core (`FRONTEND/tests/accessibility/`)
- **Configuración Vitest:** `include: ['tests/unit/**/*.spec.js']`
- **Verificación:** `lint → build → test`

---

## 10. Archivos Clave para Referencia

| Archivo | Propósito |
|---------|-----------|
| `AGENTS.md` | Fuente de verdad para convenciones y reglas |
| `docs/constitution.md` | 6 principios innegociables |
| `BD/Proyecto.sql` | Schema completo de la BD (17 tablas + datos) |
| `specs/001-SIB/spec.md` | Spec funcional: RF-01 a RF-28, RNF-01 a RNF-06, CL-01 a CL-15 |
| `specs/001-SIB/plan.md` | Plan de arquitectura: 8 tareas con dependencias |
| `BACKEND/src/utils/slugify.js` | Generador de slugs (conserva paréntesis) |
| `BACKEND/src/models/beneficioModel.js` | Transacciones de beneficio |
| `BACKEND/src/models/organismoModel.js` | CRUD organismos y territorios |
| `BACKEND/src/controllers/adminController.js` | Todos los handlers admin |
| `BACKEND/src/routes/adminRoutes.js` | Todas las rutas admin |
| `FRONTEND/src/pages/configuraciones.jsx` | Panel admin principal (6 tabs) |
| `FRONTEND/src/components/admin/BeneficioForm.jsx` | Formulario con comunas/organismos/info |
| `FRONTEND/src/components/admin/MapPicker.jsx` | Mapa Leaflet con flyTo |

---

## 11. Fuera de Alcance (MVP Actual)

- Autenticación/usuarios (contradice AGENTS.md línea 24 temporalmente)
- Redes sociales de instituciones (tabla `INSTITUCION_REDES`)
- Notificaciones (tabla `NOTIFICACION`)
- Edición masiva
- Importación/exportación CSV
- Historial de cambios
- Permisos por entidad

---

## 12. Comandos Útiles

```bash
# Backend
cd BACKEND && npm run dev          # Servidor con nodemon (puerto 4000)
cd BACKEND && npm start            # Servidor sin nodemon

# Frontend
cd FRONTEND && npm run dev         # Vite dev server
cd FRONTEND && npm run build       # Build de producción
cd FRONTEND && npm run lint        # ESLint
cd FRONTEND && npm test            # Tests E2E (Playwright)
cd FRONTEND && npm run test:unit   # Unit tests (Vitest)
cd FRONTEND && npm run test:ui     # UI visual de Playwright

# Verificación obligatoria antes de cada PR
cd FRONTEND && npm run lint && npm run build && npm test
```

---

## 13. Notas para el Desarrollador

- **No tocar `.env`:** Credenciales reales de PostgreSQL y URLs de API
- **No instalar dependencias sin preguntar:** Los `package.json` son estables
- **No subir `.env`, `Proyecto.sql` ni `node_modules/`:** Ya están en `.gitignore`
- **Frontend hardcodea `localhost:4000`:** Verificar antes de cambiar puertos
- **BD se edita por SQL directo:** No hay migraciones automáticas
- **El mapa del organismo usa PostGIS POINT:** Las coordenadas se insertan como `ST_SetSRID(ST_MakePoint(lng, lat), 4326)`
