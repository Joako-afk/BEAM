# SIB — Sistema de Ingreso de Beneficios

## Contexto y Objetivo

El SIB es el panel de administración que permite a los gestores del sistema BEAM cargar, editar y eliminar las entidades que alimentan la plataforma pública de beneficios para adultos mayores. Actualmente, los datos se cargan directamente con SQL (INSERT/UPDATE/DELETE), lo que limita la velocidad de actualización y requiere conocimiento técnico. El SIB reemplaza esa carga manual con una interfaz web que cualquiera pueda usar sin saber SQL.

El objetivo es proveer CRUD completo para las 6 entidades principales del sistema (beneficio, categoría, institución, organismo, territorio y evento), junto con la gestión de las relaciones entre ellas.

## Usuarios

- **Gestor del sistema:** Persona que carga y mantiene la información de beneficios. No necesita conocimientos técnicos. Accede al panel desde cualquier navegador sin autenticación (por ahora).

## Requisitos Funcionales

### Gestión de Beneficios

**RF-01: Crear beneficio**
CUANDO el gestor complete el formulario de creación con NOMBRE, DESCRIPCIÓN, REQUISITOS, COSTO y EDAD_MÍNIMA válidos, ENTONCES el sistema guarda el beneficio y genera automáticamente un SLUG a partir del NOMBRE.

*Critérios de aceptación:*
- DADO un formulario con todos los campos obligatorios completos, CUANDO se envía, ENTONCES se crea el beneficio con SLUG generado correctamente (sin tildes, espacios reemplazados por guiones, todo en minúsculas).
- DADO que el NOMBRE contiene tildes, CUANDO se genera el SLUG, ENTONCES las tildes se eliminan y se usa guión medio como separador.

**RF-02: Editar beneficio**
CUANDO el gestor modifique los campos de un beneficio existente y guarde los cambios, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-03: Eliminar beneficio con relaciones**
CUANDO el gestor intente eliminar un beneficio que tiene comunas o organismos asignados, ENTONCES el sistema muestra un mensaje de advertencia indicando cuántas relaciones se eliminarán.
CUANDO el gestor confirme la eliminación, ENTONCES el sistema elimina el beneficio y todas sus relaciones en cascada (BENEFICIO_COMUNA, BENEFICIO_ORGANISMO, INFORMACION_BENEFICIO).
CUANDO el gestor cancele, ENTONCES no se realiza ninguna eliminación.

**RF-04: Asignar comunas a beneficio**
CUANDO el gestor esté editando un beneficio y seleccione comunas del listado disponible, ENTONCES el sistema crea las relaciones en BENEFICIO_COMUNA con HABILITADO = TRUE por defecto.

**RF-05: Eliminar asignación de comuna desde beneficio**
CUANDO el gestor elimine una comuna asignada desde el formulario de edición del beneficio, ENTONCES el sistema elimina el registro correspondiente de BENEFICIO_COMUNA.

**RF-06: Asignar organismos (sucursales) a beneficio**
CUANDO el gestor esté editando un beneficio y seleccione organismos del listado disponible, ENTONCES el sistema crea las relaciones en BENEFICIO_ORGANISMO.

**RF-07: Eliminar asignación de organismo desde beneficio**
CUANDO el gestor elimine un organismo asignado desde el formulario de edición del beneficio, ENTONCES el sistema elimina el registro correspondiente de BENEFICIO_ORGANISMO.

**RF-08: Gestionar bloques de información extra del beneficio**
CUANDO el gestor agregue un bloque de información extra desde el formulario de edición del beneficio, ENTONCES el sistema crea el registro en INFORMACION y lo asocia en INFORMACION_BENEFICIO.
CUANDO el gestor edite el nombre o contenido de un bloque existente, ENTONCES el sistema actualiza el registro en INFORMACION.
CUANDO el gestor elimine un bloque, ENTONCES el sistema elimina la relación en INFORMACION_BENEFICIO y el registro en INFORMACION.

**RF-09: Subir icono de beneficio**
CUANDO el gestor suba una imagen y le asigne un nombre, ENTONCES el sistema almacena el archivo con ese nombre y guarda el nombre en ICON_NAME.

### Gestión de Categorías

**RF-10: Crear categoría**
CUANDO el gestor complete el formulario con NOMBRE, DESCRIPCIÓN, COLOR_PRIMARY (hex) y suba una imagen de icono con nombre personalizado, ENTONCES el sistema crea la categoría con ICON_NAME establecido al nombre asignado por el gestor y genera el SLUG automáticamente.

**RF-11: Editar categoría**
CUANDO el gestor modifique los campos de una categoría existente, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-12: Eliminar categoría sin beneficios**
CUANDO el gestor intente eliminar una categoría que NO tiene beneficios asociados, ENTONCES el sistema elimina la categoría directamente.

**RF-12b: Bloquear eliminación de categoría con beneficios**
CUANDO el gestor intente eliminar una categoría que tiene beneficios asociados, ENTONCES el sistema muestra un mensaje de error indicando cuántos beneficios tiene asignados y bloquea la eliminación.
CUANDO el gestor vea el mensaje, ENTONCES debe reasignar los beneficios a otra categoría antes de poder eliminar la categoría.

### Gestión de Instituciones

**RF-13: Crear institución**
CUANDO el gestor complete el formulario con NOMBRE, DESCRIPCIÓN, PÁGINA_WEB, LOGO_URL y EMAIL_CONTACTO, ENTONCES el sistema crea la institución y genera el SLUG automáticamente.

**RF-14: Editar institución**
CUANDO el gestor modifique los campos de una institución existente, ENTONCES el sistema actualiza el registro y recalcula el SLUG si el NOMBRE cambió.

**RF-15: Eliminar institución con organismos**
CUANDO el gestor intente eliminar una institución que tiene organismos (sucursales) asociados, ENTONCES el sistema muestra un mensaje de advertencia.
CUANDO el gestor confirme, ENTONCES se elimina la institución y todos sus organismos en cascada.

*Nota: la creación de organismos se realiza exclusivamente desde /admin/organismos, no desde el formulario de institución.*

### Gestión de Organismos (Sucursales)

**RF-16: Crear organismo**
CUANDO el gestor complete el formulario con NOMBRE_SUCURSAL, TIPO, DIRECCION, TELÉFONO, COORDENADAS (latitud, longitud), la institución a la que pertenece y la comuna a la que pertenece, ENTONCES el sistema crea el organismo con coordenadas PostGIS POINT.

**RF-17: Editar organismo**
CUANDO el gestor modifique los campos de un organismo existente, ENTONCES el sistema actualiza el registro incluyendo las coordenadas PostGIS.

**RF-18: Eliminar organismo con relaciones**
CUANDO el gestor intente eliminar un organismo que tiene beneficios o eventos asociados, ENTONCES el sistema muestra un mensaje de advertencia.
CUANDO el gestor confirme, ENTONCES se elimina el organismo y todas sus relaciones en cascada.

### Gestión de Territorios (Regiones y Comunas)

**RF-19: Crear territorio**
CUANDO el gestor seleccione TIPO = "REGIÓN" y complete el NOMBRE, ENTONCES el sistema crea la región sin padre.
CUANDO el gestor seleccione TIPO = "COMUNA", seleccione la región padre y complete el NOMBRE, ENTONCES el sistema crea la comuna asociada a esa región.

**RF-20: Editar territorio**
CUANDO el gestor modifique el nombre de un territorio, ENTONCES el sistema actualiza el registro.

**RF-21: Eliminar territorio con relaciones**
CUANDO el gestor intente eliminar una región que tiene comunas asociadas, ENTONCES el sistema muestra un mensaje de advertencia.
CUANDO el gestor confirme, ENTONCES se eliminan la región y todas sus comunas en cascada.
CUANDO el gestor intente eliminar una comuna que tiene beneficios o organismos asignados, ENTONCES el sistema muestra un mensaje de advertencia.
CUANDO el gestor confirme, ENTONCES se elimina la comuna y todas sus relaciones en cascada.

### Gestión de Eventos

**RF-22: Crear evento**
CUANDO el gestor complete el formulario con NOMBRE, DESCRIPCIÓN y FECHA, ENTONCES el sistema crea el evento.

**RF-23: Editar evento**
CUANDO el gestor modifique los campos de un evento existente, ENTONCES el sistema actualiza el registro.

**RF-24: Eliminar evento con organismos**
CUANDO el gestor intente eliminar un evento que tiene organismos asociados, ENTONCES el sistema muestra un mensaje de advertencia.
CUANDO el gestor confirme, ENTONCES se elimina el evento y la relación ORGANISMO_EVENTO.

### Navegación del Panel

**RF-25: Acceso al panel de administración**
CUANDO el gestor acceda a /admin, ENTONCES el sistema muestra el listado de entidades con acceso rápido a cada sección.

**RF-26: Navegación por secciones**
CUANDO el gestor acceda a /admin/beneficios, /admin/categorias, /admin/instituciones, /admin/organismos, /admin/territorios o /admin/eventos, ENTONCES el sistema muestra el listado correspondiente con opciones de crear, editar y eliminar.

**RF-27: Listado con búsqueda**
CUANDO el gestor esté en la vista de listado de cualquier entidad, ENTONCES el sistema permite filtrar por nombre u otros campos relevantes.

**RF-28: Paginación de listados**
CUANDO una entidad tenga más de 20 registros, ENTONCES el sistema muestra paginación con navegación entre páginas.

## Requisitos No Funcionales

**RNF-01: Independencia de paquetes**
El SIB forma parte del FRONTEND existente. No se crean paquetes nuevos.

**RNF-02: Patrón MVC**
La lógica de negocio (controllers/models) se separa de la presentación (componentes React), siguiendo el patrón establecido en el proyecto.

**RNF-03: SQL crudo**
Todas las queries se escriben con pool.query(). No se instalan ORMs.

**RNF-04: Accesibilidad WCAG AA**
El panel de administración cumple con contraste mínimo de 4.5:1, etiquetas en todos los campos de formulario, y navegación por teclado.

**RNF-05: Sin dependencias nuevas**
No se agregan librerías externas para el SIB. Se usa el stack existente (React, Tailwind CSS, Express, PostgreSQL).

## Casos Límite

- **CL-01:** Beneficio sin categoría asignada al crear (ID_CATEGORIA = NULL).
- **CL-02:** Categoría sin beneficios al eliminar (eliminación directa sin advertencia).
- **CL-03:** Institución sin organismos al eliminar (eliminación directa sin advertencia).
- **CL-04:** Comuna sin beneficios ni organismos al eliminar (eliminación directa sin advertencia).
- **CL-05:** Nombre duplicado en categorías, instituciones o eventos (el sistema debe rechazar la creación y mostrar error).
- **CL-06:** Coordenadas PostGIS inválidas al crear/editar organismo.
- **CL-07:** Archivo de icono no válido (formato incorrecto o tamaño excesivo).
- **CL-08:** Región con comunas asociadas: eliminación en cascada tras confirmación.
- **CL-09:** Evento sin organismos asociados: eliminación directa sin advertencia.
- **CL-10:** Beneficio con múltiples bloques de información extra.

## Fuera de Alcance (MVP)

- **Gestión de usuarios:** No se implementa autenticación ni gestión de usuarios en este MVP.
- **Gestión de redes sociales de instituciones:** La tabla INSTITUCION_REDES no se gestiona desde el SIB en este MVP.
- **Gestión de notificaciones:** La tabla NOTIFICACION no se gestiona desde el SIB en este MVP.
- **Edición masiva:** No se permite editar o eliminar múltiples registros a la vez.
- **Importación/exportación de datos:** No se permite importar CSV ni exportar datos.
- **Historial de cambios:** No se almacena un log de quién modificó qué ni cuándo.
- **Permisos por entidad:** Todos los usuarios ven todas las entidades (no hay roles granulares).
- **Creación de organismos desde instituciones:** Los organismos solo se crean desde /admin/organismos.

## Criterios de Finalización

1. CRUD funcional para las 6 entidades (crear, listar, editar, eliminar).
2. Eliminación con advertencia y cascada confirmada en todas las entidades con relaciones.
3. Bloqueo de eliminación de categoría si tiene beneficios asociados.
4. Asignación de comunas y organismos desde el formulario de beneficio.
5. Gestión de bloques de información extra desde el formulario de beneficio.
6. Subida de iconos con nombre personalizado (beneficios y categorías).
7. SLUG auto-generado desde el NOMBRE en todas las entidades que lo requieran.
8. Búsqueda en listados de cada entidad.
9. Paginación en listados con más de 20 registros.
10. Accesibilidad WCAG AA verificada (labels, contraste, navegación por teclado).
11. Todos los tests existentes siguen pasando (lint → build → test).

## Dudas Abiertas

- ~~[NECESITA ACLARACION]~~ Resuelto: ICON_NAME de categorías usa la misma lógica de subida de imagen que beneficios.
- ~~[NECESITA ACLARACION]~~ Resuelto: la creación de organismos se realiza exclusivamente desde /admin/organismos.
- ~~[NECESITA ACLARACION]~~ Resuelto: no se permite eliminar una categoría si tiene beneficios asociados. El gestor debe reasignarlos primero.
