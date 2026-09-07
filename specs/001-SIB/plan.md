# Plan de Arquitectura — SIB

## Resumen

8 tareas para implementar el SIB completo. Dependencias: T1→T2, T3/T4→T5→T6→T8, T3/T4→T7→T8.

---

## Tarea 1 — Modificar slugify para conservar paréntesis

**Archivos afectados:**
- `BACKEND/src/utils/slugify.js`
- `FRONTEND/tests/unit/slugify.spec.js` (función inline + tests)

**Cambio en backend:**
```js
// Antes
.replace(/[^a-z0-9]+/g, "-")
// Después
.replace(/[^a-z0-9()]+/g, "-")
```

**Resultado:** `"Examen Médico (EMPAM)"` → `"examen-medico-(empam)"`

**Tests:** Agregar caso de prueba para nombres con paréntesis.

---

## Tarea 2 — Migración de slugs + redirecciones 301

**Nuevo archivo:** `BACKEND/src/scripts/migrateSlugs.js`
- Importa slugify desde `../utils/slugify.js`
- Consulta todos los registros con SLUG de: beneficio, categoria, institucion
- Para cada registro, calcula el nuevo slug con slugify y ejecuta UPDATE solo si difiere
- Ejecuta desde consola con `node src/scripts/migrateSlugs.js`

**Archivo:** `BACKEND/server.js`
- Agregar ruta legacy: `GET /api/legacy/:entity/:oldSlug`
- Busca el registro por slug viejo, obtiene el slug actual, retorna 301 con Location al nuevo slug
- Entidades soportadas: `beneficios`, `categorias`, `instituciones`

---

## Tarea 3 — CRUD completo para eventos

**Nuevo archivo:** `BACKEND/src/models/eventoModel.js`

Funciones:
- `obtenerTodosLosEventos()` — SELECT * ORDER BY fecha DESC
- `buscarEventos(busqueda, page, limit)` — ILIKE por NOMBRE, DESCRIPCIÓN + paginación
- `contarEventos(busqueda)` — COUNT para paginación
- `crearEvento(nombre, descripcion, fecha)` — INSERT RETURNING *
- `actualizarEvento(id, nombre, descripcion, fecha)` — UPDATE RETURNING *
- `eliminarEvento(id)` — DELETE RETURNING *
- `contarOrganismosPorEvento(id)` — COUNT de ORGANISMO_EVENTO
- `eliminarOrganismosPorEvento(id)` — DELETE de ORGANISMO_EVENTO

**Archivo:** `BACKEND/src/controllers/adminController.js`
- Agregar: `adminListarEventos`, `adminCrearEvento`, `adminActualizarEvento`, `adminEliminarEvento`
- Validación en crear/actualizar: FECHA >= NOW()
- Eliminar: primero contar relaciones, luego eliminar en cascada

**Archivo:** `BACKEND/src/routes/adminRoutes.js`
- `GET /api/admin/eventos` → adminListarEventos (acepta query param `?search=`)
- `POST /api/admin/eventos` → adminCrearEvento
- `PUT /api/admin/eventos/:id` → adminActualizarEvento
- `DELETE /api/admin/eventos/:id` → adminEliminarEvento

---

## Tarea 4 — CRUD completo para territorios

**Archivo:** `BACKEND/src/models/organismoModel.js`
- Agregar: `crearTerritorio(nombre, tipo, idPadre)`, `actualizarTerritorio(id, nombre)`, `eliminarTerritorio(id)`
- Agregar: `contarComunasPorRegion(id)` — COUNT de division_territorial donde id_padre = id
- Agregar: `contarRelacionesComuna(id)` — COUNT de beneficio_comuna + organismo para una comuna
- Agregar: `buscarTerritorios(busqueda, page, limit)` + `contarTerritorios(busqueda)`

**Archivo:** `BACKEND/src/controllers/adminController.js`
- Agregar: `adminCrearTerritorio`, `adminActualizarTerritorio`, `adminEliminarTerritorio`
- Validar: si tipo es COMUNA, idPadre obligatorio; si REGION, idPadre NULL
- Validar: tipo inmutable (solo NOMBRE editable)
- Eliminación REGION: eliminar comunas hijas y sus relaciones en cascada
- Eliminación COMUNA: eliminar beneficio_comuna y organismo que la referencien

**Archivo:** `BACKEND/src/routes/adminRoutes.js`
- `GET /api/admin/territorios` → adminListarTerritorios (con `?search=`)
- `POST /api/admin/territorios` → adminCrearTerritorio
- `PUT /api/admin/territorios/:id` → adminActualizarTerritorio
- `DELETE /api/admin/territorios/:id` → adminEliminarTerritorio

---

## Tarea 5 — Búsqueda, paginación y validación de duplicados

### Búsqueda (ILIKE por campos específicos)

| Entidad | Campos de búsqueda |
|---------|-------------------|
| Beneficios | NOMBRE, REQUISITOS |
| Categorías | NOMBRE |
| Instituciones | NOMBRE, DESCRIPCIÓN |
| Organismos | NOMBRE_SUCURSAL, DIRECCION |
| Territorios | NOMBRE |
| Eventos | NOMBRE, DESCRIPCIÓN |

Patrón de query:
```sql
WHERE (nombre ILIKE '%' || $1 || '%' OR requisitos ILIKE '%' || $1 || '%')
LIMIT $2 OFFSET $3
```

### Paginación

- 20 registros por página
- Respuesta estándar: `{ data: [...], total: N, page: N, totalPages: N }`
- Query: `LIMIT $1 OFFSET $2` donde OFFSET = (page - 1) * limit

### Validación de duplicados (organismos)

```sql
SELECT COUNT(*) FROM organismo
WHERE nombre_sucursal = $1 AND id_divter = $2 AND id_organismo != $3
```
Si COUNT > 0, retornar 409 con mensaje de error.

### Conteo de relaciones para cascada

Cada endpoint de DELETE consulta cuántas relaciones existen antes de eliminar:
- Beneficio: comunas, organismos, bloques info
- Categoría: beneficios
- Institución: organismos
- Organismo: beneficios, eventos
- Territorio (región): comunas
- Territorio (comuna): beneficios, organismos
- Evento: organismos

---

## Tarea 6 — Transacción para creación/edición de beneficio

**Archivo:** `BACKEND/src/models/beneficioModel.js`

### Crear beneficio (transacción)
```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // 1. INSERT beneficio → obtener id_beneficio
  // 2. INSERT beneficio_comuna (por cada comuna seleccionada)
  // 3. INSERT beneficio_organismo (por cada organismo seleccionado)
  // 4. INSERT informacion + informacion_beneficio (por cada bloque)
  await client.query('COMMIT');
  return beneficio;
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

### Editar beneficio (transacción)
```js
const client = await pool.connect();
try {
  await client.query('BEGIN');
  // 1. UPDATE beneficio
  // 2. DELETE beneficio_comuna WHERE id_beneficio = $1 → INSERT nuevas
  // 3. DELETE beneficio_organismo WHERE id_beneficio = $1 → INSERT nuevos
  // 4. Para info: eliminar bloques que ya no están, actualizar existentes, crear nuevos
  await client.query('COMMIT');
} catch (e) {
  await client.query('ROLLBACK');
  throw e;
} finally {
  client.release();
}
```

**Endpoint:** `POST /api/admin/beneficios` y `PUT /api/admin/beneficios/:id`
- Body incluye: campos del beneficio + `comunas: [id, ...]` + `organismos: [id, ...]` + `info_bloques: [{nombre, contenido}, ...]`

---

## Tarea 7 — Frontend: Formularios de eventos y territorios

**Nuevo archivo:** `FRONTEND/src/components/admin/EventoForm.jsx`
- Campos: NOMBRE (text, máx 150), DESCRIPCIÓN (textarea, máx 2000), FECHA (datetime-local)
- Validación: fecha >= now en submit
- Props: `data` (para editar), `onSubmit`, `onCancel`

**Nuevo archivo:** `FRONTEND/src/components/admin/TerritorioForm.jsx`
- Campos: NOMBRE (text, máx 100), TIPO (select: Región/Comuna), ID_PADRE (select de regiones, solo si tipo=Comuna)
- Si no hay regiones, opción "Comuna" se deshabilita
- En edición: TIPO se muestra pero está deshabilitado (inmutable)
- Props: `data`, `onSubmit`, `onCancel`, `regiones`

**Archivo:** `FRONTEND/src/pages/configuraciones.jsx`
- Agregar tabs de "Eventos" y "Territorios"
- Agregar tab content con listado, búsqueda y formularios modales

---

## Tarea 8 — Frontend: Mejoras al panel admin

**Archivo:** `FRONTEND/src/pages/configuraciones.jsx`

### Búsqueda en tiempo real
- Input de búsqueda por encima de cada listado
- Debounce de 300ms antes de enviar al backend
- Query param: `?search=valor`
- Clear button para borrar búsqueda

### Paginación
- Controles al final de cada listado: ← Anterior | Página X de Y | Siguiente →
- Mostrar "Mostrando X-Y de Z registros"
- Deshabilitar Anterior en página 1, Siguiente en última página

### Estados vacíos
- Sin registros: "No hay [entidades] registradas"
- Sin resultados de búsqueda: "No se encontraron resultados"

### Eliminación con desglose de cascada
- Modal de confirmación: "Este [entidad] tiene X [relaciones] asociados. ¿Está seguro?"
- Botones: "Sí, eliminar" / "Cancelar"
- Si no tiene relaciones: "¿Está seguro de eliminar [entidad] [nombre]?"

### Formulario de beneficio mejorado
- Debajo de los campos básicos, agregar sección "Comunas" con:
  - Checkbox list con búsqueda
  - Mensaje "No hay comunas disponibles" si no existen
- Sección "Organismos" con:
  - Checkbox list con búsqueda por NOMBRE_SUCURSAL o DIRECCION
  - Mensaje "No hay organismos disponibles" si no existen
- Sección "Información Extra" con:
  - Lista de bloques (NOMBRE + CONTENIDO) con botón "Agregar bloque"
  - Cada bloque tiene botón de eliminar
  - Sin límite máximo de bloques
- Validación: si no hay al menos una comuna o un organismo seleccionado, bloquear guardado con error

---

## Orden de implementación

| Paso | Tarea | Dependencias |
|------|-------|--------------|
| 1 | T1: slugify | Ninguna |
| 2 | T3: eventos backend | Ninguna |
| 3 | T4: territorios backend | Ninguna |
| 4 | T5: búsqueda/paginación/duplicados | T3, T4 |
| 5 | T6: transacción beneficio | T5 |
| 6 | T2: migración slugs + 301 | T1 |
| 7 | T7: formularios frontend | T3, T4 |
| 8 | T8: mejoras frontend | T5, T6, T7 |

---

## Archivos a crear/modificar

### Nuevos
- `BACKEND/src/models/eventoModel.js`
- `BACKEND/src/scripts/migrateSlugs.js`
- `FRONTEND/src/components/admin/EventoForm.jsx`
- `FRONTEND/src/components/admin/TerritorioForm.jsx`

### Modificados
- `BACKEND/src/utils/slugify.js` (paréntesis)
- `BACKEND/src/controllers/adminController.js` (eventos, territorios, búsqueda, paginación)
- `BACKEND/src/routes/adminRoutes.js` (nuevas rutas)
- `BACKEND/src/models/beneficioModel.js` (transacción)
- `BACKEND/src/models/organismoModel.js` (territorios, búsqueda)
- `BACKEND/src/models/categoriaModel.js` (búsqueda)
- `BACKEND/server.js` (ruta legacy 301)
- `FRONTEND/src/pages/configuraciones.jsx` (mejoras completas)
- `FRONTEND/src/components/admin/BeneficioForm.jsx` (secciones comunas/organismos/info)
- `FRONTEND/tests/unit/slugify.spec.js` (paréntesis)
