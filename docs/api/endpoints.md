# API — Referencia de Endpoints

**Base URL (desarrollo):** `http://localhost:3001`

**Autenticación:** JWT vía cookie HTTP-only `access_token`. Todas las rutas requieren autenticación salvo que se indique `[PUBLIC]`.

**CSRF:** Todas las rutas que mutan estado (POST, PUT, PATCH, DELETE) requieren el header `x-csrf-token`. Obtenerlo con `GET /auth/csrf-token`.

---

## Convenciones

- `[PUBLIC]` — No requiere autenticación ni csrf-token.
- `[USER]` — Rol mínimo: `USER`.
- `[ADMIN]` — Rol mínimo: `ADMIN`.
- `[SUPERADMIN]` — Solo accesible por `SUPERADMIN`.
- `multipart/form-data` — El endpoint acepta archivos.

---

## Health

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET   |`/health`|`[PUBLIC]`|Estado del servidor y uptime|

**Respuesta:**
```json
{ "status": "ok", "uptime": 12345 }
```

---

## Auth (`/auth`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/auth/csrf-token` | `[PUBLIC]` | Retorna un CSRF token para incluir en el header `x-csrf-token` |
| POST | `/auth/login` | `[PUBLIC]` | Inicia sesión; establece cookies `access_token` y `refresh_token` |
| POST | `/auth/logout` | `[USER]` | Cierra sesión; borra cookies y hash de refresh token |
| POST | `/auth/refresh` | `[PUBLIC]` | Renueva el access token usando el refresh token cookie |

### POST /auth/login — Body

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

**Rate limit:** 10 requests / 15 minutos.

---

## Usuario (`/usuario`)

### Endpoints de administrador

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/usuario/admin/crear` | `[ADMIN]` | Crear nuevo usuario en el proyecto |
| GET | `/usuario/admin/ver-todo` | `[ADMIN]` | Listar todos los usuarios del proyecto |
| GET | `/usuario/admin/ver/:usuario_id` | `[ADMIN]` | Ver un usuario específico |
| PATCH | `/usuario/admin/editar/:usuario_id` | `[ADMIN]` | Actualizar datos de un usuario |
| DELETE | `/usuario/admin/eliminar/:usuario_id` | `[ADMIN]` | Eliminar un usuario |

### POST /usuario/admin/crear — Body

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña_segura",
  "rol": "USER",
  "proyecto_id": "uuid-del-proyecto"
}
```

### Endpoints de usuario autenticado

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/usuario/user/authenticated` | `[USER]` | Obtener perfil del usuario autenticado |
| PATCH | `/usuario/user/editar` | `[USER]` | Actualizar nombre, apellido, email propios |
| PATCH | `/usuario/user/password` | `[USER]` | Cambiar contraseña propia |

---

## Proyecto (`/proyecto`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/proyecto/crear` | `[SUPERADMIN]` | Crear nuevo proyecto |
| GET | `/proyecto/ver-todo` | `[SUPERADMIN]` | Listar todos los proyectos |
| GET | `/proyecto/ver/:proyecto_id` | `[ADMIN]` | Ver un proyecto |
| PATCH | `/proyecto/editar/:proyecto_id` | `[SUPERADMIN]` | Actualizar proyecto |
| DELETE | `/proyecto/eliminar/:proyecto_id` | `[SUPERADMIN]` | Eliminar proyecto (CASCADE) |

### POST /proyecto/crear — Body

```json
{
  "nombre_proyecto": "Mi Sitio Web",
  "descripcion": "Descripción del proyecto",
  "cliente": "Nombre del cliente",
  "fecha_inicio": "2025-01-01T00:00:00.000Z"
}
```

---

## Artículos (`/articulos`)

### Sección de artículos (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/articulos/crear` | `[ADMIN]` | Crear sección de artículos para un proyecto |
| GET | `/articulos/ver-todo` | `[USER]` | Obtener la sección con todos los artículos |
| PUT | `/articulos/editar` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/articulos/project/ver-todo` | `[PUBLIC]` | Ver artículos públicos (query: `?usuario_id=...`) |

### Artículo individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/articulos/articulo/crear` | `[ADMIN]` | Crear artículo con imagen (`multipart/form-data`) |
| GET | `/articulos/articulo/ver/:id_articulo` | `[USER]` | Ver artículo con sus secciones |
| PUT | `/articulos/articulo/editar/:id_articulo` | `[ADMIN]` | Actualizar artículo con imagen (`multipart/form-data`) |
| DELETE | `/articulos/articulo/eliminar/:id_articulo` | `[ADMIN]` | Eliminar artículo |
| GET | `/articulos/project/ver/:id_articulo` | `[PUBLIC]` | Ver artículo público |

### POST /articulos/articulo/crear — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `titulo` | string | Sí | Título del artículo |
| `subtitulo` | string | No | Subtítulo |
| `autor` | string | Sí | Nombre del autor |
| `fecha_publicacion` | ISO date | Sí | Fecha de publicación |
| `status` | string | Sí | Estado (ej: `publicado`, `borrador`) |
| `activo` | boolean | Sí | Si el artículo está activo |
| `slug` | string | Sí | URL amigable única |
| `articulos_id` | uuid | Sí | ID de la sección de artículos |
| `image` | file | No | Imagen de portada |
| `image_alt` | string | No | Texto alternativo de la imagen |
| `image_position` | string | No | Posición CSS de la imagen |

---

## Equipo (`/equipo`)

### Sección de equipo (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/equipo/crear` | `[ADMIN]` | Crear sección de equipo para un proyecto |
| GET | `/equipo/ver-todo` | `[USER]` | Obtener sección con todos los empleados |
| PUT | `/equipo/editar` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/equipo/project/ver-todo` | `[PUBLIC]` | Ver equipo público (query: `?usuario_id=...`) |

### Empleado

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/equipo/empleado/crear` | `[ADMIN]` | Crear empleado con imagen (`multipart/form-data`) |
| GET | `/equipo/empleado/ver/:id_empleado` | `[USER]` | Ver datos de un empleado |
| PUT | `/equipo/empleado/editar/:id_empleado` | `[ADMIN]` | Actualizar empleado con imagen (`multipart/form-data`) |
| DELETE | `/equipo/empleado/eliminar/:id_empleado` | `[ADMIN]` | Eliminar empleado |

### POST /equipo/empleado/crear — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre_primero` | string | Sí | Primer nombre |
| `nombre_segundo` | string | No | Segundo nombre |
| `apellido_paterno` | string | Sí | Apellido paterno |
| `apellido_materno` | string | No | Apellido materno |
| `profesion` | string | Sí | Profesión |
| `especialidad` | string | No | Especialidad |
| `descripcion` | string | No | Descripción |
| `orden` | number | No | Orden de visualización |
| `activo` | boolean | Sí | Si está activo |
| `slug` | string | No | URL amigable |
| `equipo_id` | uuid | Sí | ID de la sección de equipo |
| `image` | file | No | Foto del empleado |
| `img_alt` | string | No | Texto alternativo de la imagen |

---

## Servicios (`/servicios`)

### Sección de servicios (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/servicios/crear` | `[ADMIN]` | Crear sección de servicios |
| GET | `/servicios/ver-todo` | `[USER]` | Obtener sección con todos los servicios |
| PUT | `/servicios/editar` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/servicios/project/ver-todo` | `[PUBLIC]` | Ver servicios públicos (query: `?usuario_id=...`) |

### Servicio individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/servicios/servicio/crear` | `[ADMIN]` | Crear servicio con imagen (`multipart/form-data`) |
| GET | `/servicios/servicio/ver/:id_servicio` | `[USER]` | Ver un servicio |
| PUT | `/servicios/servicio/editar/:id_servicio` | `[ADMIN]` | Actualizar servicio con imagen (`multipart/form-data`) |
| DELETE | `/servicios/servicio/eliminar/:id_servicio` | `[ADMIN]` | Eliminar servicio |

### POST /servicios/servicio/crear — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombre_servicio` | string | Sí | Nombre del servicio |
| `descripcion` | string | No | Descripción |
| `valor` | string | No | Precio / valor |
| `nombre_promocion` | string | No | Nombre de promoción activa |
| `porcentaje_descuento` | number | No | % de descuento (0–100) |
| `destacado` | boolean | No | Si el servicio es destacado |
| `icono` | string | No | Clase de ícono o URL |
| `orden` | number | No | Orden de visualización |
| `activo` | boolean | Sí | Si el servicio está activo |
| `servicios_id` | uuid | Sí | ID de la sección de servicios |
| `image` | file | No | Imagen del servicio |
| `img_alt` | string | No | Texto alternativo de la imagen |

---

## Testimonios (`/testimonios`)

### Sección de testimonios (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/testimonios/crear` | `[ADMIN]` | Crear sección de testimonios |
| GET | `/testimonios/ver-todo` | `[USER]` | Obtener sección con todos los testimonios |
| PUT | `/testimonios/editar` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/testimonios/project/ver-todo` | `[PUBLIC]` | Ver testimonios públicos (query: `?usuario_id=...`) |

### Testimonio individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/testimonios/testimonio/crear` | `[PUBLIC]` | Crear testimonio (formulario público del sitio) |
| DELETE | `/testimonios/testimonio/eliminar/:id_testimonio` | `[ADMIN]` | Eliminar testimonio |

### POST /testimonios/testimonio/crear — Body

```json
{
  "nombre": "María",
  "apellido": "González",
  "correo": "maria@ejemplo.com",
  "descripcion": "Excelente servicio, muy recomendado.",
  "calificacion": 5,
  "testimonios_id": "uuid-de-la-seccion"
}
```

> Los testimonios creados públicamente quedan en `status: pendiente` hasta que un admin los apruebe (campo `aprobar` en la tabla `Testimonios`).

---

## Actividad (`/actividad`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/actividad/all` | `[ADMIN]` | Obtener log de actividad del proyecto |

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "accion": "crear",
    "titulo_articulo": "Mi artículo",
    "responsable": "admin@ejemplo.com",
    "fecha": "2025-03-20T10:00:00.000Z",
    "proyecto_id": "uuid",
    "usuario_id": "uuid",
    "articulo_id": "uuid"
  }
]
```

---

## Formatos de respuesta de error

Todos los errores son normalizados por `HttpExceptionFilter`:

```json
{
  "statusCode": 400,
  "message": "Descripción del error",
  "error": "Bad Request",
  "timestamp": "2025-03-20T10:00:00.000Z",
  "path": "/articulos/articulo/crear"
}
```

| Código | Causa típica |
|--------|-------------|
| 400 | Validación de DTO fallida |
| 401 | Token JWT inválido o expirado |
| 403 | CSRF token inválido o rol insuficiente |
| 404 | Recurso no encontrado |
| 409 | Conflicto (ej: email duplicado) |
| 500 | Error interno del servidor |
