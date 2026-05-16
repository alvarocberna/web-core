
# Arquitectura — Visión General

## Propósito del sistema

**web-core** es una API REST multi-tenant con esquemas compartidos para gestión de contenido web (CMS). Cada *proyecto* es un tenant 
independiente que puede tener su propio conjunto de artículos, equipo, servicios, testimonios y usuarios. El objetivo es proveer un 
backend headless que alimente múltiples sitios web desde una sola instancia.

---

## Diagrama de alto nivel

```
┌─────────────────────────────────────────────────────────────┐
│                      Clientes HTTP                          │
│        (Panel Admin / Sitio Público / Herramientas)         │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS + Cookies HTTP-only
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    web-core API (NestJS)                    │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │   Auth   │  │ Proyecto │  │Articulos │  │  Equipo  │     │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │Servicios │  │Testimonios│ │ Usuario  │  │Actividad │     │
│  │  Module  │  │  Module  │  │  Module  │  │  Module  │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Infrastructure Layer                   │    │
│  │   Prisma ORM │ AWS S3 │ Bcrypt │ UUID │ JWT         │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────────┬────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌─────────────────┐          ┌──────────────────┐
     │   PostgreSQL    │          │    AWS S3 /      │
     │   (Supabase     │          │  /uploads local  │
     │   en prod)      │          └──────────────────┘
     └─────────────────┘
```

---

## Modelo de datos — relaciones principales

```
Proyecto
├── Usuario[]          (N usuarios por proyecto, rol: USER | ADMIN | SUPERADMIN)
├── Articulos          (sección de artículos del proyecto)
│   └── Articulo[]
│       └── SecArticulo[]   (secciones del artículo)
├── Equipo             (sección de equipo del proyecto)
│   └── Empleado[]
├── Servicios          (sección de servicios del proyecto)
│   └── Servicio[]
├── Testimonios        (sección de testimonios del proyecto)
│   └── Testimonio[]
└── Actividad[]        (log de auditoría del proyecto)
```

Todas las relaciones usan `onDelete: Cascade`, de modo que eliminar un `Proyecto` elimina toda su información.

---

## Flujo de autenticación

```
1. Cliente solicita CSRF token   GET /auth/csrf-token
2. Cliente hace login             POST /auth/login  { email, password, x-csrf-token header }
3. Servidor valida credenciales
4. Servidor emite:
   - access_token  cookie HTTP-only (15 min)
   - refresh_token cookie HTTP-only (7 días, hash guardado en DB)
5. Requests autenticados llevan el cookie automáticamente
6. Al expirar el access_token:   POST /auth/refresh  → nuevo par de tokens
7. Logout:                        POST /auth/logout   → cookies borradas, hash eliminado en DB
```

---

## Roles y permisos

| Rol | Alcance |
|-----|---------|
| `USER` | Solo puede leer su propio perfil y hacer CRUD de artículos del proyecto al que pertenece |
| `ADMIN` | Gestiona contenido de su proyecto (artículos, equipo, servicios, testimonios, usuarios) |
| `SUPERADMIN` | Gestiona todos los proyectos así como sus usuarios |

Los roles se verifican en cascada mediante tres guards globales:
1. **CsrfGuard** — verifica token CSRF en headers
2. **JwtAuthGuard** — verifica JWT en cookie; rutas con `@Public()` lo omiten
3. **RolesGuard** — verifica rol mínimo declarado con `@Roles()`

---

## Endpoints públicos (sin autenticación)

Los siguientes endpoints no requieren JWT y están pensados para el consumo desde el sitio web público:

- `GET /articulos/project/ver-todo?proyecto_id=...`
- `GET /articulos/project/ver/:proyecto_id`
- `GET /equipo/project/ver-todo?proyecto_id=...`
- `GET /servicios/project/ver-todo?proyecto_id=...`
- `GET /testimonios/project/ver-todo?proyecto_id=...`
- `POST /testimonios/project/testimonio/crear`

Nota: Los endpoints privados obtienen el `usuario_id` del payload del JWT. En cambio, los endpoints públicos reciben el `proyecto_id` directamente desde el cliente como query param (o param de ruta).
---

## Subida de imágenes

Los módulos `articulo`, `empleado` y `servicio` aceptan `multipart/form-data`. La imagen es procesada por el `AwsStorageDatasource`; si falla, se usa `LocalStorageDatasource` como fallback y se sirve en `/uploads/`.

---

## Documentación interactiva

Swagger UI disponible en `/api/docs` (cualquier entorno).
