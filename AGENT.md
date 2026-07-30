AGENT.md

Resumen
------
Este repositorio contiene una aplicación de dos capas: un frontend en React (Vite + Tailwind) y un backend en Node.js (Express) que persiste datos en PostgreSQL. El objetivo de este documento es servir como guía para desarrolladores: describir el stack, la arquitectura, comandos comunes para desarrollar y desplegar, reglas de estilo, y buenas prácticas a seguir.

Identidad del agente
--------------------
Soy un agente de desarrollo (AI assistant usando Copilot CLI runtime en VS Code) que analiza el proyecto y proporciona esta guía.

Stack de tecnologías
--------------------
- Frontend
  - React 19 + Vite (dev server, build rápido)
  - Tailwind CSS
  - ESLint (configuración base incluida)
  - Bibliotecas: leaflet, react-leaflet, react-router-dom, lucide-react
- Backend
  - Node.js + Express (import/ES Modules) (Express v5 en package.json)
  - PostgreSQL (conexión via pg)
  - bcrypt, cors, dotenv
  - nodemon (dev)
- Infra / Contenedores
  - Docker / docker-compose con servicios: db (postgres), backend, frontend
- Nota: Repositorio incluye [docker-compose.yml](/D:/PROYECTO.worktrees/agent-md-documentation-creation/docker-compose.yml) que orquesta el stack completo.

Arquitectura
------------
- Separación en 3 servicios (desarrollo local via docker-compose o en carpetas separadas):
  - db: PostgreSQL (volumen persistente pgdata y script init.sql)
  - backend: API REST con rutas registradas en [BACKEND/server.js](/D:/PROYECTO.worktrees/agent-md-documentation-creation/BACKEND/server.js)
    - Rutas expuestas: /api/categorias, /api/usuarios, /api/beneficios (ver [BACKEND/src/routes/])
  - frontend: SPA React servido por Vite (puerto 5173 por defecto)
- Comunicación: frontend ↔ backend por HTTP (VITE_API_URL configurado), backend ↔ db por host/credenciales del docker-compose.

Estructura de carpetas (resumen relevante)
------------------------------------------
- /BACKEND
  - server.js — punto de entrada (registra rutas y monta middleware)
  - package.json — scripts y dependencias
  - src/
    - controllers/ — lógica de negocio por recurso
    - models/ — modelos (actualmente adaptados a pg manualmente)
    - routes/ — definiciones de rutas (categoriaRouter, usuarioRoutes, beneficioRoutes)
    - config/db.js — configuración de conexión a PostgreSQL
    - utils/ — utilidades (slugify, palette, ...)
- /FRONTEND
  - src/ — componentes React, layouts y páginas
  - public/ — assets y icons
  - package.json — scripts y dependencias (vite, tailwind, eslint)
- docker-compose.yml — orquestación local

Comandos comunes
----------------
Nota: abrir terminal en la carpeta correspondiente antes de ejecutar comandos (BACKEND o FRONTEND).

1) Desarrollo local sin Docker
- Backend (dev):
  - Windows / PowerShell:
    cd BACKEND
    npm install
    npm run dev
  - Esto ejecuta nodemon y recarga al guardar.
- Frontend (dev):
  - Windows / PowerShell:
    cd FRONTEND
    npm install
    npm run dev
- Visitar frontend: http://localhost:5173 (o el puerto que indique Vite)
- Llamadas API esperan backend corriendo (server.js actualmente usa puerto 4000 por defecto).

2) Con Docker Compose (stack completo)
- Levantar todo (build y crear contenedores):
  docker-compose up --build
- Bajar: docker-compose down
- Logs: docker-compose logs -f backend
- Nota: docker-compose.yml define credenciales y variables de entorno para servicios.

3) Scripts útiles
- Backend: npm start (producción), npm run dev (desarrollo)
- Frontend: npm run dev, npm run build, npm run lint

4) Tests
- No existen tests automáticos en el repositorio hoy. Recomendado: añadir Jest + supertest (backend) y Vitest + Testing Library (frontend).

Reglas de estilo y linteo
-------------------------
- Frontend ya incluye ESLint y plugins relevantes. Ejecutar "npm run lint" desde /FRONTEND.
- Recomendaciones generales:
  - Formato: usar Prettier (añadir configuración .prettierrc) para formato consistente.
  - ESLint: extender con reglas de React y hooks (ya hay plugins listados en package.json de frontend).
  - Commits: mensajes claros, tiempo presente, tipo breve. Ejemplo: "feat: agregar endpoint de búsquedas".
  - Branches: usar feature/*, fix/*, chore/* y abrir PRs para revisión.
  - Añadir hooks pre-commit (husky + lint-staged) para correr lint y tests antes de commit.

Buenas prácticas específicas del repo
------------------------------------
- Variables de entorno y secretos
  - No subir contraseñas o claves en el repositorio. docker-compose.yml actualmente contiene credenciales en texto plano — moverlas a un .env (ignorado) y referenciarlas desde docker-compose con env_file.
  - Usar .env para configuraciones locales y never commit.
- Backend ES Modules
  - server.js usa sintaxis import/export. Asegurarse de que el backend soporte ES Modules:
    - Añadir "type": "module" en BACKEND/package.json o ejecutar Node con la bandera adecuada.
    - Recomendación: actualizar BACKEND/package.json con "type": "module" para consistencia.
- Puerto y variables
  - server.js actualmente fija const PORT = 4000. Cambiar a usar process.env.PORT || 4000 para permitir configuración via env/Docker.
  - Ejemplo (mejor):
    const PORT = process.env.PORT || 4000;
- Conexión a la BD
  - Guardar parámetros de conexión (host, user, password, db, port) en variables de entorno y no en código.
- Manejo de errores y validación
  - Validar y sanear entrada en controladores (no confiar en input del cliente)
  - Centralizar manejo de errores (middleware) y devolver códigos HTTP apropiados.
- Seguridad
  - No exponer JWT secrets ni credenciales en el código. Usar variables de entorno seguras.
  - Limitar CORS a orígenes confiables en producción.
  - Rate limiting y protección básica (helmet, express-rate-limit) en producción.
- Base de datos y migraciones
  - Añadir sistema de migraciones (knex, sequelize-cli, or dbmate) para versionar la estructura de la base.

Mejoras recomendadas a corto plazo
----------------------------------
- Añadir tests automatizados para rutas críticas (usuarios, autenticación, operaciones CRUD).
- Añadir CI (GitHub Actions) que corra lint, tests y build para PRs.
- Añadir Prettier y hooks con husky + lint-staged.
- Mover secrets fuera de docker-compose.yml y usar .env y variables en CI/CD.
- Corregir servidor para usar process.env.PORT y asegurar ES modules en BACKEND/package.json.

Checklist de PR / Code Review
-----------------------------
- [ ] ¿Agrega/actualiza tests para la funcionalidad nueva?
- [ ] ¿Pasa lint localmente (frontend/backend)?
- [ ] ¿No se agregaron secretos al repo? (.env no incluido)
- [ ] ¿Mensajes de commit claros y rama nombrada siguiendo convención?
- [ ] ¿Cambios explicados en la descripción del PR y con pasos para reproducir?

Recursos / Archivos relevantes
-----------------------------
- docker-compose: [docker-compose.yml](/D:/PROYECTO.worktrees/agent-md-documentation-creation/docker-compose.yml)
- Backend entrada: [BACKEND/server.js](/D:/PROYECTO.worktrees/agent-md-documentation-creation/BACKEND/server.js)
- Backend package: [BACKEND/package.json](/D:/PROYECTO.worktrees/agent-md-documentation-creation/BACKEND/package.json)
- Frontend package: [FRONTEND/package.json](/D:/PROYECTO.worktrees/agent-md-documentation-creation/FRONTEND/package.json)
- Frontend README: [FRONTEND/README.md](/D:/PROYECTO.worktrees/agent-md-documentation-creation/FRONTEND/README.md)

Contacto / Soporte
------------------
Si necesitas que actualice el código para aplicar algunas de las mejoras (por ejemplo: usar process.env.PORT en server.js, añadir "type": "module" al BACKEND/package.json, o mover variables del docker-compose a un .env), indicar cuáles cambios quieres que realice y los aplico.

Licencia de este documento
--------------------------
Documento generado por un agente de desarrollo (AI assistant usando Copilot CLI runtime en VS Code). Si quieres un AGENT.md con otro idioma, formato o más detalle (diagramas, checklist extendida, plantillas de PR/commit), pedirlo y lo adapto.
