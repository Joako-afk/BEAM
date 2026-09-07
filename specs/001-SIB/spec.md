# SIB — Sistema de Ingreso de Beneficios

## Contexto y Objetivo

El SIB es el panel de administración que permite a los gestores del sistema BEAM cargar, editar y eliminar las entidades que alimentan la plataforma pública de beneficios para adultos mayores. Actualmente, los datos se cargan directamente con SQL (INSERT/UPDATE/DELETE), lo que limita la velocidad de actualización y requiere conocimiento técnico. El SIB reemplaza esa carga manual con una interfaz web que cualquiera pueda usar sin saber SQL.

El objetivo es proveer CRUD completo para las 6 entidades principales del sistema (beneficio, categoría, institución, organismo, territorio y evento), junto con la gestión de las relaciones entre ellas.

## Usuarios

- **Gestor del sistema:** Persona que carga y mantiene la información de beneficios. No necesita conocimientos técnicos. Accede al panel desde cualquier navegador sin autenticación (por ahora — ver "Fuera de Alcance").

## Requisitos Funcionales

### Gestión de Beneficios

**RF-01: Crear beneficio**
CUANDO el gestor complete el formulario de creación con NOMBRE, DESCRIPCIÓN, REQUISITOS, COSTO, EDAD_MÍNIMA y seleccione una CATEGORÍA válidos, ENTONCES el sistema guarda el beneficio y genera automáticamente un SLUG a partir del NOMBRE usando la función slugify (que conserva paréntesis).

*Campos obligatorios:* NOMBRE (máx. 200 caracteres), DESCRIPCIÓN (máx. 2000 caracteres), REQUISITOS (máx. 2000 caracteres), COSTO (entero ≥ 0), EDAD_MÍNIMA (entero ≥ 0), ID_CATEGORÍA (debe existir).

*Campos auto-generados:* SLUG (desde NOMBRE, sin tildes, paréntesis conservados, guiones como separadores, minúsculas).

*Nota:* El formulario de creación también incluye secciones para asignar comunas (RF-04), organismos (RF-06) y bloques de información extra (RF-08).

*Critérios de aceptación:*
- DADO un formulario con todos los campos obligatorios completos y una categoría seleccionada, CUANDO se envía, ENTONCES se crea el beneficio con SLUG generado correctamente.
- DADO que el NOMBRE contiene tildes, CUANDO se genera el SLUG, ENTONCES las tildes se eliminan y se usa guión medio como separador.
- DADO que el NOMBRE contiene paréntesis (ej: "Examen Médico (EMPAM)"), CUANDO se genera el SLUG, ENTONCES los paréntesis se conservan (ej: "examen-medico-(empam)").
- DADO que no se selecciona categoría, CUANDO se envía, ENTONCES el sistema muestra error de validación "La categoría es obligatoria".

**RF-02: Editar beneficio**
CUANDO el gestor modifique los campos de un beneficio existente y guarde los cambios, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-03: Eliminar beneficio con relaciones**
CUANDO el gestor intente eliminar un beneficio que tiene comunas, organismos o bloques de información asignados, ENTONCES el sistema muestra un mensaje de advertencia con el desglose: "Este beneficio tiene X comunas, Y organismos y Z bloques de información asociados. ¿Está seguro de eliminarlo? Se eliminarán todas las relaciones."
CUANDO el gestor confirme la eliminación, ENTONCES el sistema elimina el beneficio y todas sus relaciones en cascada (BENEFICIO_COMUNA, BENEFICIO_ORGANISMO, INFORMACION_BENEFICIO y los registros en INFORMACION que solo estén asociados a este beneficio).
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

**RF-04: Gestionar comunas del beneficio**
CUANDO el gestor esté creando o editando un beneficio y seleccione comunas del listado disponible (mostrado como checkboxes con búsqueda por nombre), ENTONCES el sistema crea las relaciones en BENEFICIO_COMUNA con HABILITADO = TRUE por defecto.
CUANDO el gestor deseleccione una comuna ya asignada, ENTONCES el sistema elimina el registro correspondiente de BENEFICIO_COMUNA.
*Si no existen comunas disponibles, la sección muestra el mensaje "No hay comunas disponibles".*

**RF-06: Gestionar organismos del beneficio**
CUANDO el gestor esté creando o editando un beneficio y seleccione organismos del listado disponible (mostrado como checkboxes con búsqueda por NOMBRE_SUCURSAL o DIRECCION), ENTONCES el sistema crea las relaciones en BENEFICIO_ORGANISMO.
CUANDO el gestor deseleccione un organismo ya asignado, ENTONCES el sistema elimina el registro correspondiente de BENEFICIO_ORGANISMO.
*Si no existen organismos disponibles, la sección muestra el mensaje "No hay organismos disponibles".*

**RF-08: Gestionar bloques de información extra del beneficio**
CUANDO el gestor agregue un bloque de información extra desde el formulario de creación o edición del beneficio, ENTONCES el sistema crea el registro en INFORMACION (con campos NOMBRE y CONTENIDO) y lo asocia en INFORMACION_BENEFICIO.
CUANDO el gestor edite el NOMBRE o CONTENIDO de un bloque existente, ENTONCES el sistema actualiza el registro en INFORMACION.
CUANDO el gestor elimine un bloque, ENTONCES el sistema elimina la relación en INFORMACION_BENEFICIO y el registro en INFORMACION.
*No hay límite máximo de bloques de información por beneficio.*

**RF-09: Subir icono de beneficio**
CUANDO el gestor suba una imagen (formatos permitidos: SVG, PNG, JPG; máximo 2MB) y le asigne un nombre personalizado, ENTONCES el sistema almacena el archivo en `FRONTEND/public/icons/` con ese nombre y guarda el nombre en ICON_NAME.
*El icono requiere texto alternario (alt) para accesibilidad WCAG AA.*

### Gestión de Categorías

**RF-10: Crear categoría**
CUANDO el gestor complete el formulario con NOMBRE (máx. 100 caracteres), DESCRIPCIÓN (máx. 500 caracteres), COLOR_PRIMARY (hex válido) y suba una imagen de icono con nombre personalizado (mismas restricciones que RF-09), ENTONCES el sistema crea la categoría con ICON_NAME establecido al nombre asignado por el gestor y genera el SLUG automáticamente (misma lógica que beneficios: conserva paréntesis).

**RF-11: Editar categoría**
CUANDO el gestor modifique los campos de una categoría existente, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-12: Eliminar categoría**
CUANDO el gestor intente eliminar una categoría que NO tiene beneficios asociados, ENTONCES el sistema muestra un diálogo de confirmación "¿Está seguro de eliminar la categoría [NOMBRE]?".
CUANDO el gestor confirme, ENTONCES se elimina la categoría.
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

**RF-12b: Bloquear eliminación de categoría con beneficios**
CUANDO el gestor intente eliminar una categoría que tiene beneficios asociados, ENTONCES el sistema muestra un mensaje de error "No se puede eliminar la categoría [NOMBRE] porque tiene [X] beneficios asignados. Reasigne los beneficios a otra categoría antes de eliminar."
CUANDO el gestor vea el mensaje, ENTONCES debe editar cada beneficio asignado a esta categoría y cambiar su categoría desde el formulario de edición (RF-11) antes de poder eliminar la categoría.

### Gestión de Instituciones

**RF-13: Crear institución**
CUANDO el gestor complete el formulario con NOMBRE (máx. 100 caracteres), DESCRIPCIÓN (máx. 2000 caracteres), PÁGINA_WEB (URL válida), LOGO_URL (URL válida) y EMAIL_CONTACTO (email válido), ENTONCES el sistema crea la institución y genera el SLUG automáticamente.

**RF-14: Editar institución**
CUANDO el gestor modifique los campos de una institución existente, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-15: Eliminar institución con organismos**
CUANDO el gestor intente eliminar una institución que tiene organismos (sucursales) asociados, ENTONCES el sistema muestra un mensaje de advertencia "Esta institución tiene [X] organismos asociados. ¿Está seguro de eliminarla? Se eliminarán la institución y todos sus organismos, junto con las relaciones de esos organismos con beneficios y eventos."
CUANDO el gestor confirme, ENTONCES se elimina la institución y todos sus organismos en cascada, junto con las relaciones BENEFICIO_ORGANISMO y ORGANISMO_EVENTO de esos organismos.
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

*Nota: la creación de organismos se realiza exclusivamente desde /admin/organismos, no desde el formulario de institución.*

### Gestión de Organismos (Sucursales)

**RF-16: Crear organismo**
CUANDO el gestor complete el formulario con NOMBRE_SUCURSAL (máx. 100 caracteres), TIPO (texto, máx. 100 caracteres), DIRECCION (máx. 200 caracteres), TELÉFONO (máx. 20 caracteres), COORDENADAS (latitud y longitud en campos de texto numéricos), la INSTITUCIÓN a la que pertenece (seleccionada de un dropdown) y la COMUNA a la que pertenece (seleccionada de un dropdown), ENTONCES el sistema crea el organismo con coordenadas PostGIS POINT.
*Las coordenadas se validan: latitud entre -90 y 90, longitud entre -180 y 180. Si son inválidas, el sistema muestra error de validación.*
*Si no existen instituciones o comunas, el botón "Crear organismo" se deshabilita con tooltip "Primero debe crear instituciones y comunas".*

**RF-17: Editar organismo**
CUANDO el gestor modifique los campos de un organismo existente, ENTONCES el sistema actualiza el registro incluyendo las coordenadas PostGIS.

**RF-18: Eliminar organismo con relaciones**
CUANDO el gestor intente eliminar un organismo que tiene beneficios o eventos asociados, ENTONCES el sistema muestra un mensaje de advertencia con el desglose: "Este organismo tiene [X] beneficios y [Y] eventos asociados. ¿Está seguro de eliminarlo?"
CUANDO el gestor confirme, ENTONCES se elimina el organismo y todas sus relaciones en cascada (BENEFICIO_ORGANISMO, ORGANISMO_EVENTO).
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

**RF-16b: Validación de duplicados en organismos**
CUANDO el gestor intente crear o editar un organismo con un NOMBRE_SUCURSAL que ya existe en la misma comuna, ENTONCES el sistema muestra error de validación "Ya existe un organismo con el nombre [NOMBRE] en esta comuna. Elija un nombre diferente."
*No se validan duplicados entre distintas comunas ni entre distintas instituciones.*

### Gestión de Territorios (Regiones y Comunas)

**RF-19: Crear territorio**
CUANDO el gestor seleccione TIPO = "Región" desde un dropdown y complete el NOMBRE (máx. 100 caracteres), ENTONCES el sistema crea la región sin padre.
CUANDO el gestor seleccione TIPO = "Comuna" desde un dropdown, seleccione la región padre de un dropdown (solo se muestran regiones existentes) y complete el NOMBRE (máx. 100 caracteres), ENTONCES el sistema crea la comuna asociada a esa región.
*Si no existen regiones, el dropdown de región padre se muestra vacío con mensaje "Primero debe crear una región" y la opción "Comuna" se deshabilita en el selector de tipo.*
*El tipo de territorio (Región/Comuna) es inmutable una vez creado. No se puede cambiar desde el formulario de edición.*

**RF-20: Editar territorio**
CUANDO el gestor modifique el nombre de un territorio, ENTONCES el sistema actualiza el registro.
*Solo se permite editar el NOMBRE de un territorio. El tipo (Región/Comuna) es inmutable una vez creado.*

**RF-21: Eliminar territorio con relaciones**
CUANDO el gestor intente eliminar una región que tiene comunas asociadas, ENTONCES el sistema muestra un mensaje de advertencia "Esta región tiene [X] comunas asociadas. ¿Está seguro de eliminarla? Se eliminarán la región y todas sus comunas."
CUANDO el gestor confirme, ENTONCES se eliminan la región y todas sus comunas en cascada, junto con las relaciones de esas comunas con beneficios y organismos.
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.
CUANDO el gestor intente eliminar una comuna que tiene beneficios o organismos asignados, ENTONCES el sistema muestra un mensaje de advertencia "Esta comuna tiene [X] beneficios y [Y] organismos asociados. ¿Está seguro de eliminarla?"
CUANDO el gestor confirme, ENTONCES se elimina la comuna y todas sus relaciones en cascada.
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

### Gestión de Eventos

**RF-22: Crear evento**
CUANDO el gestor complete el formulario con NOMBRE (máx. 150 caracteres), DESCRIPCIÓN (máx. 2000 caracteres) y FECHA (fecha y hora futura), ENTONCES el sistema crea el evento.
*La FECHA debe ser igual o posterior a la fecha actual. Si es anterior, el sistema muestra error de validación "La fecha del evento debe ser futura".*

**RF-23: Editar evento**
CUANDO el gestor modifique los campos de un evento existente, ENTONCES el sistema actualiza el registro.
*Si se cambia la FECHA, se valida que sea futura (misma regla que RF-22).*

**RF-24: Eliminar evento con organismos**
CUANDO el gestor intente eliminar un evento que tiene organismos asociados, ENTONCES el sistema muestra un mensaje de advertencia "Este evento tiene [X] organismos asociados. ¿Está seguro de eliminarlo?"
CUANDO el gestor confirme, ENTONCES se elimina el evento y la relación ORGANISMO_EVENTO.
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

### Navegación del Panel

**RF-25: Acceso al panel de administración**
CUANDO el gestor acceda a /admin, ENTONCES el sistema muestra una vista de dashboard con tarjetas de acceso a cada sección (Beneficios, Categorías, Instituciones, Organismos, Territorios, Eventos).

**RF-26: Navegación por secciones**
CUANDO el gestor acceda a /admin/beneficios, /admin/categorias, /admin/instituciones, /admin/organismos, /admin/territorios o /admin/eventos, ENTONCES el sistema muestra el listado correspondiente con opciones de crear, editar y eliminar.

**RF-27: Listado con búsqueda**
CUANDO el gestor esté en la vista de listado de cualquier entidad, ENTONCES el sistema permite filtrar por los siguientes campos:
- **Beneficios:** NOMBRE, REQUISITOS
- **Categorías:** NOMBRE
- **Instituciones:** NOMBRE, DESCRIPCIÓN
- **Organismos:** NOMBRE_SUCURSAL, DIRECCION
- **Territorios:** NOMBRE
- **Eventos:** NOMBRE, DESCRIPCIÓN

*La búsqueda es en tiempo real (al escribir), case-insensitive y parcial (contiene). No hay botón de buscar. Si no hay resultados, se muestra el mensaje "No se encontraron resultados".*

**RF-28: Paginación de listados**
CUANDO una entidad tenga más de 20 registros, ENTONCES el sistema muestra paginación con navegación entre páginas (20 registros por página).
*Cuando una entidad no tiene registros, el listado muestra el mensaje "No hay [entidades] registradas".*

## Requisitos No Funcionales

**RNF-01: Independencia de paquetes**
El SIB forma parte del FRONTEND existente. No se crean paquetes nuevos.

**RNF-02: Patrón MVC**
La lógica de negocio (controllers/models) se separa de la presentación (componentes React), siguiendo el patrón establecido en el proyecto.

**RNF-03: SQL crudo**
Todas las queries se escriben con pool.query(). No se instalan ORMs.

**RNF-04: Accesibilidad WCAG AA**
El panel de administración cumple con contraste mínimo de 4.5:1, etiquetas en todos los campos de formulario, texto alternario en imágenes y navegación por teclado.

**RNF-05: Sin dependencias nuevas**
No se agregan librerías externas para el SIB. Se usa el stack existente (React, Tailwind CSS, Express, PostgreSQL).

**RNF-06: Idioma del dominio en español**
Todos los textos visibles al usuario (labels de formularios, mensajes de error, mensajes de confirmación, placeholders, textos de botones) deben estar en español. El código fuente, nombres de variables y comentarios están en inglés (ver constitution.md #6).

## Casos Límite

- **CL-01:** Beneficio sin categoría asignada al crear: se muestra error de validación "La categoría es obligatoria".
- **CL-02:** Categoría sin beneficios al eliminar: eliminación directa tras confirmación.
- **CL-03:** Institución sin organismos al eliminar: eliminación directa tras confirmación.
- **CL-04:** Comuna sin beneficios ni organismos al eliminar: eliminación directa tras confirmación.
- **CL-05:** Nombre duplicado en categorías, instituciones o eventos: el sistema rechaza la creación y muestra error "Ya existe un registro con ese nombre".
- **CL-06:** Coordenadas PostGIS inválidas al crear/editar organismo: se muestra error de validación "Las coordenadas no son válidas".
- **CL-07:** Archivo de icono no válido (formato distinto de SVG/PNG/JPG o tamaño mayor a 2MB): se muestra error de validación.
- **CL-08:** Región con comunas asociadas al eliminar: cascada tras confirmación.
- **CL-09:** Evento sin organismos asociados al eliminar: eliminación directa tras confirmación.
- **CL-10:** Beneficio con múltiples bloques de información extra: permitido, sin límite máximo.
- **CL-11:** Nombre duplicado en organismos dentro de la misma comuna: se bloquea con error "Ya existe un organismo con el nombre [NOMBRE] en esta comuna".
- **CL-12:** Beneficio sin comunas ni organismos: se bloquea guardado con error "Debe asignar al menos una comuna o un organismo".
- **CL-13:** Error de red o base de datos al guardar: se muestra toast de error "Ocurrió un error al guardar. Intente nuevamente.", el formulario se mantiene con los datos intactos.
- **CL-14:** Evento con fecha pasada: se bloquea creación/edición con error "La fecha del evento debe ser futura".
- **CL-15:** Campos de texto exceden límite de caracteres: se muestra error de validación indicando el límite.

## Fuera de Alcance (MVP)

- **Gestión de usuarios:** No se implementa autenticación ni gestión de usuarios en este MVP. *Nota: esto contradice temporalmente a AGENTS.md línea 24 ("Panel de Administración: Acceso seguro (bcrypt) para gestores"). Se implementará auth en una iteración futura.*
- **Gestión de redes sociales de instituciones:** La tabla INSTITUCION_REDES no se gestiona desde el SIB en este MVP.
- **Gestión de notificaciones:** La tabla NOTIFICACION no se gestiona desde el SIB en este MVP.
- **Edición masiva:** No se permite editar o eliminar múltiples registros a la vez.
- **Importación/exportación de datos:** No se permite importar CSV ni exportar datos.
- **Historial de cambios:** No se almacena un log de quién modificó qué ni cuándo.
- **Permisos por entidad:** Todos los usuarios ven todas las entidades (no hay roles granulares).
- **Creación de organismos desde instituciones:** Los organismos solo se crean desde /admin/organismos.
- **Mapa interactivo para coordenadas:** Las coordenadas se ingresan manualmente (lat/lng). Un mapa Leaflet para hacer clic se implementará en una iteración futura.

## Criterios de Finalización

1. CRUD funcional para las 6 entidades (crear, listar, editar, eliminar).
2. Eliminación con advertencia, desglose y cascada confirmada en todas las entidades con relaciones.
3. Bloqueo de eliminación de categoría si tiene beneficios asociados.
4. Asignación de comunas y organismos desde el formulario de beneficio (con checkboxes y búsqueda).
5. Gestión de bloques de información extra desde el formulario de beneficio.
6. Subida de iconos con nombre personalizado (beneficios y categorías), restricciones de formato y tamaño.
7. SLUG auto-generado desde el NOMBRE en todas las entidades que lo requieran, conservando paréntesis.
8. Validación de duplicados en organismos dentro de la misma comuna.
9. Validación de fecha futura en eventos.
10. Límites de caracteres visibles en todos los campos de formulario.
11. Búsqueda por campos específicos en listados de cada entidad (en tiempo real, case-insensitive, parcial).
12. Paginación en listados con más de 20 registros.
13. Estado vacío con mensaje "No hay [entidades] registradas".
14. Manejo de errores de red con toast y formulario intacto.
15. Accesibilidad WCAG AA verificada (labels, contraste, alt text, navegación por teclado).
16. Todos los textos de UI en español (labels, mensajes, placeholders).
17. Tests E2E (Playwright) para CRUD de cada entidad, paginación, búsqueda y eliminación con cascada.
18. Tests de accesibilidad (axe-core) para 7 rutas: /admin, /admin/beneficios, /admin/categorias, /admin/instituciones, /admin/organismos, /admin/territorios, /admin/eventos.
19. Tests de API (Playwright) para endpoints del SIB con validaciones.
20. Tests unitarios (Vitest) para slugify con paréntesis y utilidades nuevas.
21. Todos los tests existentes siguen pasando (lint → build → test).

## Notas de Implementación

*Los siguientes detalles son de implementación y deben definirse en el plan de arquitectura, no en el spec.*

- **Ruta de almacenamiento de iconos:** `FRONTEND/public/icons/` — si ya existe un archivo con el mismo nombre, se sobrescribe. → Ver plan de arquitectura.
- **Campos de coordenadas:** latitud y longitud se ingresan en campos de texto numéricos separados. → Ver plan de arquitectura.
- **Validación de coordenadas:** latitud entre -90 y 90, longitud entre -180 y 180. → Ver plan de arquitectura.
- **Función slugify modificada:** se debe modificar la función slugify existente para conservar paréntesis (agregar `(` y `)` al regex `/[^a-z0-9]+/g`). → Ver plan de arquitectura.
- **Migración de slugs existentes:** crear migración que actualice los slugs existentes al nuevo formato (guiones medios, paréntesis conservados). Agregar redirecciones 301 en el backend para los slugs viejos. → Ver plan de arquitectura.
- **Transacción de creación de beneficio:** el backend crea el beneficio primero, obtiene el ID, y luego crea las asignaciones (comunas, organismos, información extra) en la misma transacción. → Ver plan de arquitectura.

## Dudas Abiertas

- ~~[NECESITA ACLARACION]~~ Resuelto: ICON_NAME de categorías usa la misma lógica de subida de imagen que beneficios.
- ~~[NECESITA ACLARACION]~~ Resuelto: la creación de organismos se realiza exclusivamente desde /admin/organismos.
- ~~[NECESITA ACLARACION]~~ Resuelto: no se permite eliminar una categoría si tiene beneficios asociados. El gestor debe reasignarlos primero.
