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
- Nombres de ruta y de propiedades en inglés/camelCase; el vocabulario de dominio (entidades Prisma y sus derivados: `proyecto`, `articulo`, `empleado`, `servicio`, `testimonio`, etc.) se mantiene en español.

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
| POST | `/usuario/admin/create` | `[ADMIN]` | Crear nuevo usuario en el proyecto |
| GET | `/usuario/admin/all` | `[ADMIN]` | Listar todos los usuarios del proyecto |
| GET | `/usuario/admin/view/:usuarioId` | `[ADMIN]` | Ver un usuario específico |
| PATCH | `/usuario/admin/update/:usuarioId` | `[ADMIN]` | Actualizar datos de un usuario |
| DELETE | `/usuario/admin/delete/:usuarioId` | `[ADMIN]` | Eliminar un usuario |

### POST /usuario/admin/create — Body

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@ejemplo.com",
  "password": "contraseña_segura",
  "rol": "USER",
  "proyectoId": "uuid-del-proyecto"
}
```

### Endpoints de usuario autenticado

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/usuario/user/authenticated` | `[USER]` | Obtener perfil del usuario autenticado |
| PATCH | `/usuario/user/update` | `[USER]` | Actualizar nombre, apellido, email propios |
| PATCH | `/usuario/user/password` | `[USER]` | Cambiar contraseña propia |

---

## Proyecto (`/proyecto`)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/proyecto/create` | `[SUPERADMIN]` | Crear nuevo proyecto |
| GET | `/proyecto/all` | `[SUPERADMIN]` | Listar todos los proyectos |
| GET | `/proyecto/view/:proyectoId` | `[ADMIN]` | Ver un proyecto |
| PATCH | `/proyecto/update/:proyectoId` | `[SUPERADMIN]` | Actualizar proyecto |
| DELETE | `/proyecto/delete/:proyectoId` | `[SUPERADMIN]` | Eliminar proyecto (CASCADE) |

### POST /proyecto/create — Body

```json
{
  "nombreProyecto": "Mi Sitio Web",
  "descripcion": "Descripción del proyecto",
  "cliente": "Nombre del cliente",
  "fechaInicio": "2025-01-01T00:00:00.000Z"
}
```

---

## Artículos (`/articulos`)

### Sección de artículos (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/articulos/create` | `[ADMIN]` | Crear sección de artículos para un proyecto |
| GET | `/articulos/all` | `[USER]` | Obtener la sección con todos los artículos |
| PUT | `/articulos/update` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/articulos/project/all` | `[PUBLIC]` | Ver artículos públicos (query: `?proyectoId=...`) |

### Artículo individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/articulos/articulo/create` | `[ADMIN]` | Crear artículo con imagen (`multipart/form-data`) |
| GET | `/articulos/articulo/view/:articuloId` | `[USER]` | Ver artículo con sus secciones |
| PUT | `/articulos/articulo/update/:articuloId` | `[ADMIN]` | Actualizar artículo con imagen (`multipart/form-data`) |
| PATCH | `/articulos/articulo/update-status/:articuloId` | `[ADMIN]` | Actualizar solo el status del artículo |
| DELETE | `/articulos/articulo/delete/:articuloId` | `[ADMIN]` | Eliminar artículo |
| GET | `/articulos/project/view/:proyectoId` | `[PUBLIC]` | Ver artículo público por proyecto |

### POST /articulos/articulo/create — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `titulo` | string | Sí | Título del artículo |
| `subtitulo` | string | No | Subtítulo |
| `autor` | string | Sí | Nombre del autor |
| `fechaPublicacion` | ISO date | Sí | Fecha de publicación |
| `status` | string | Sí | Estado (ej: `publicado`, `borrador`) |
| `activo` | boolean | Sí | Si el artículo está activo |
| `slug` | string | Sí | URL amigable única |
| `articulosId` | uuid | Sí | ID de la sección de artículos |
| `imageFile` | file | No | Imagen de portada |
| `imageAlt` | string | No | Texto alternativo de la imagen |
| `imagePosition` | string | No | Posición CSS de la imagen |
| `secImages` | file(s) | No | Imágenes de las secciones (hasta 20) |

---

## Equipo (`/equipo`)

### Sección de equipo (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/equipo/create` | `[ADMIN]` | Crear sección de equipo para un proyecto |
| GET | `/equipo/all` | `[USER]` | Obtener sección con todos los empleados |
| PUT | `/equipo/update` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/equipo/project/all` | `[PUBLIC]` | Ver equipo público (query: `?proyectoId=...`) |

### Empleado

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/equipo/empleado/create` | `[ADMIN]` | Crear empleado con imagen (`multipart/form-data`) |
| GET | `/equipo/empleado/view/:empleadoId` | `[USER]` | Ver datos de un empleado |
| PUT | `/equipo/empleado/update/:empleadoId` | `[ADMIN]` | Actualizar empleado con imagen (`multipart/form-data`) |
| PATCH | `/equipo/empleado/update/order/:empleadoId` | `[ADMIN]` | Actualizar orden de visualización |
| DELETE | `/equipo/empleado/delete/:empleadoId` | `[ADMIN]` | Eliminar empleado |

### POST /equipo/empleado/create — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombrePrimero` | string | Sí | Primer nombre |
| `nombreSegundo` | string | No | Segundo nombre |
| `apellidoPaterno` | string | Sí | Apellido paterno |
| `apellidoMaterno` | string | No | Apellido materno |
| `profesion` | string | Sí | Profesión |
| `especialidad` | string | No | Especialidad |
| `descripcion` | string | No | Descripción |
| `orden` | number | No | Orden de visualización |
| `activo` | boolean | Sí | Si está activo |
| `slug` | string | No | URL amigable |
| `equipoId` | uuid | Sí | ID de la sección de equipo |
| `imageFile` | file | No | Foto del empleado |
| `imgAlt` | string | No | Texto alternativo de la imagen |

---

## Servicios (`/servicios`)

### Sección de servicios (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/servicios/create` | `[ADMIN]` | Crear sección de servicios |
| GET | `/servicios/all` | `[USER]` | Obtener sección con todos los servicios |
| PUT | `/servicios/update` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/servicios/project/all` | `[PUBLIC]` | Ver servicios públicos (query: `?proyectoId=...`) |

### Servicio individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/servicios/servicio/create` | `[ADMIN]` | Crear servicio con imagen (`multipart/form-data`) |
| GET | `/servicios/servicio/view/:servicioId` | `[USER]` | Ver un servicio |
| PUT | `/servicios/servicio/update/:servicioId` | `[ADMIN]` | Actualizar servicio con imagen (`multipart/form-data`) |
| PATCH | `/servicios/servicio/update/order/:servicioId` | `[ADMIN]` | Actualizar orden de visualización |
| DELETE | `/servicios/servicio/delete/:servicioId` | `[ADMIN]` | Eliminar servicio |

### POST /servicios/servicio/create — Form data

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `nombreServicio` | string | Sí | Nombre del servicio |
| `descripcion` | string | No | Descripción |
| `valor` | string | No | Precio / valor |
| `nombrePromocion` | string | No | Nombre de promoción activa |
| `porcentajeDescuento` | number | No | % de descuento (0–100) |
| `destacado` | boolean | No | Si el servicio es destacado |
| `icono` | string | No | Clase de ícono o URL |
| `orden` | number | No | Orden de visualización |
| `activo` | boolean | Sí | Si el servicio está activo |
| `serviciosId` | uuid | Sí | ID de la sección de servicios |
| `imageFile` | file | No | Imagen del servicio |
| `imgAlt` | string | No | Texto alternativo de la imagen |

---

## Testimonios (`/testimonios`)

### Sección de testimonios (contenedor)

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/testimonios/create` | `[ADMIN]` | Crear sección de testimonios |
| GET | `/testimonios/all` | `[USER]` | Obtener sección con todos los testimonios |
| PUT | `/testimonios/update` | `[ADMIN]` | Actualizar configuración de la sección |
| GET | `/testimonios/project/all` | `[PUBLIC]` | Ver testimonios públicos (query: `?proyectoId=...`) |

### Testimonio individual

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/testimonios/testimonio/create` | `[ADMIN]` | Crear testimonio desde el panel de administración |
| POST | `/testimonios/project/testimonio/create` | `[PUBLIC]` | Crear testimonio (formulario público del sitio, query: `?proyectoId=...`) |
| PATCH | `/testimonios/testimonio/update/:testimonioId` | `[ADMIN]` | Aprobar/actualizar status de un testimonio |
| DELETE | `/testimonios/testimonio/delete/:testimonioId` | `[ADMIN]` | Eliminar testimonio |

### POST /testimonios/project/testimonio/create — Body

```json
{
  "nombre": "María",
  "apellido": "González",
  "correo": "maria@ejemplo.com",
  "descripcion": "Excelente servicio, muy recomendado.",
  "calificacion": 5,
  "testimoniosId": "uuid-de-la-seccion"
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
    "tituloArticulo": "Mi artículo",
    "responsable": "admin@ejemplo.com",
    "fecha": "2025-03-20T10:00:00.000Z",
    "proyectoId": "uuid",
    "usuarioId": "uuid",
    "articuloId": "uuid"
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
  "path": "/articulos/articulo/create"
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
