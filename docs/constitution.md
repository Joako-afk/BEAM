# Constitución del Proyecto BEAM

Principios innegociables. Si un cambio viola alguno, no se aprueba.

---

## 1. Stack fijo, sin expansiones

El stack es: Node.js + Express 5, React 19 + Vite 7 + Tailwind CSS 4, PostgreSQL + PostGIS. No se agregan dependencias nuevas (ni frameworks, ni ORMs, ni librerías auxiliares) sin aprobación explícita por escrito. Cada paquete (`BACKEND/`, `FRONTEND/`) es autónomo con su propio `package.json`.

## 2. AGENTS.md como fuente de verdad

Todo lo que el código debe hacer y no debe hacer está en `AGENTS.md`. Si hay contradicción entre el código existente y `AGENTS.md`, se corrige el código. Cualquier cambio de convención, stack o política se documenta primero en `AGENTS.md` antes de implementarse.

## 3. Separación lógica e interfaz

Los controllers exportan funciones async. Los models ejecutan SQL crudo con `pool.query()`. Los componentes React solo manejan presentación y estado de UI. No se mezcla lógica de negocio en componentes ni queries SQL en componentes. El patrón MVC sin frameworks se mantiene.

## 4. Tests obligatorios antes de merges

El flujo de verificación es `lint → build → test` (frontend). Playwright cubre E2E, Vitest cubre unit tests, axe-core cubre accesibilidad (WCAG AA). Un test roto bloquea el merge. El backend actualmente no tiene tests — si se agregan, siguen la misma política.

## 5. Persistencia: SQL crudo, sin ORM

Todos los queries van directos a PostgreSQL via `pool.query()`. No se instalan ni usan ORMs (Prisma, Sequelize, TypeORM, etc.). PostGIS (`GEOMETRY(Point, 4326)`) es parte central del sistema — las queries geoespaciales se escriben en SQL nativo. El esquema de referencia está en `BD/Proyecto.sql`.

## 6. Código en inglés, dominio en español

El código fuente, nombres de variables, funciones, archivos y comentarios están en inglés. Los textos visibles al usuario, mensajes de error al usuario, labels, y contenido del dominio están en español. Los archivos del backend usan `.js`, los del frontend `.jsx`. Sin TypeScript.
