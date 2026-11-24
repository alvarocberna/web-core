# Arquitectura — Capas

El proyecto sigue una arquitectura en capas inspirada en **Clean Architecture** y los patrones nativos de NestJS. Cada capa tiene responsabilidades bien delimitadas y solo conoce a la capa inmediatamente inferior.

```
src/
├── domain/            ← Capa de Dominio
├── infrastructure/    ← Capa de Infraestructura
└── presentation/      ← Capa de Presentación
```

---

## 1. Capa de Dominio (`src/domain/`)

Contiene las reglas de negocio puras, independientes de frameworks, bases de datos o HTTP.

### Subdirectorios

| Directorio | Contenido |
|-----------|-----------|
| `entities/` | Clases que representan los conceptos del negocio (no son modelos de Prisma) |
| `dtos/` | Data Transfer Objects; uno por operación (crear, actualizar, etc.). Funcionan como modelo para los DTOs de presentation |
| `datasources/` | Interfaces abstractas de acceso a datos (contratos que la infraestructura debe cumplir) |
| `repository/` | Interfaces abstractas de repositorio (capa de acceso a datos orientada al dominio) |
| `use-cases/` | Casos de uso específicos (ej: `create-articulo.use-case.ts`) que orquestan la lógica de negocio |
| `enums/` | Enumeraciones de dominio (ej: `ValidRoles` con `USER`, `ADMIN`, `SUPERADMIN`) |

### Principio clave

Nada en `domain/` importa de NestJS, Prisma ni Express. Es código portable y testeable de forma aislada.

---

## 2. Capa de Infraestructura (`src/infrastructure/`)

Implementa los contratos definidos en el dominio usando tecnologías concretas.

### Subdirectorios

| Directorio | Contenido |
|-----------|-----------|
| `datasources/` | Implementaciones de las interfaces del dominio usando Prisma |
| `repository/` | Implementaciones de los repositorios que usan los datasources |
| `orm/prisma/` | `PrismaService` (singleton que gestiona la conexión a PostgreSQL) |
| `adapters/pass-hasher/` | `BcryptAdapter` — hashea y verifica contraseñas con bcryptjs |
| `adapters/uuid/` | `UuidAdapter` — genera UUIDs para IDs de entidades |

### Datasources disponibles

| Datasource | Modelo Prisma |
|-----------|---------------|
| `UsuarioDatasource` | `Usuario` |
| `ProyectoDatasource` | `Proyecto` |
| `ArticuloDatasource` | `Articulo`, `Articulos`, `SecArticulo` |
| `EquipoDatasource` | `Equipo`, `Empleado` |
| `ServiciosDatasource` | `Servicios`, `Servicio` |
| `TestimoniosDatasource` | `Testimonios`, `Testimonio` |
| `ActividadDatasource` | `Actividad` |
| `AwsStorageDatasource` | AWS S3 |
| `LocalStorageDatasource` | Sistema de archivos local (`/uploads`) |

---

## 3. Capa de Presentación (`src/presentation/`)

Gestiona la entrada/salida HTTP: rutas, guards, filtros, serialización de respuestas.

### Estructura de cada módulo

Cada módulo de presentación sigue el mismo patrón:

```
presentation/<modulo>/
├── <modulo>.module.ts      ← Registra providers, importa dependencias
├── <modulo>.controller.ts  ← Define rutas HTTP y decoradores
└── <modulo>.service.ts     ← Orquesta llamadas al repositorio/datasource
```

### Elementos transversales

| Directorio | Descripción |
|-----------|-------------|
| `auth/guards/` | `JwtAuthGuard` (extiende `AuthGuard('jwt')`) |
| `auth/strategies/` | `JwtStrategy` (valida el access_token de la cookie) |
| `guards/` | `CsrfGuard`, `RolesGuard` (aplicados globalmente en `AppModule`) |
| `filters/` | `HttpExceptionFilter` — normaliza todas las respuestas de error |
| `decorators/` | `@Public()`, `@Roles()`, `@SkipCsrf()` |

### Guards globales (orden de ejecución)

```
Request entrante
    ↓
CsrfGuard          ← ¿El header x-csrf-token es válido? (excepto rutas @SkipCsrf)
    ↓
JwtAuthGuard       ← ¿El cookie access_token tiene un JWT válido? (excepto rutas @Public)
    ↓
RolesGuard         ← ¿El usuario tiene el rol mínimo requerido? (si hay @Roles declarado)
    ↓
Controller handler
```

### Módulos de presentación

| Módulo | Prefijo de ruta | Descripción |
|--------|----------------|-------------|
| `AuthModule` | `/auth` | Login, logout, refresh, CSRF token |
| `UsuarioModule` | `/usuario` | Gestión de usuarios (perfil propio *rol user* y otros usuarios *rol admin*) |
| `ProyectoModule` | `/proyecto` | Gestión de proyectos (solo SUPERADMIN) |
| `ArticuloModule` | `/articulos` | Sección de artículos + artículos individuales |
| `EquipoModule` | `/equipo` | Sección de equipo + empleados |
| `ServiciosModule` | `/servicios` | Sección de servicios + servicios individuales |
| `TestimoniosModule` | `/testimonios` | Sección de testimonios + testimoniales |
| `ActividadModule` | `/actividad` | Log de auditoría (solo lectura) |
| `HealthModule` | `/health` | Health check |

---

## Flujo de una solicitud típica

```
HTTP POST /articulos/articulo/create
    │
    ├─ CsrfGuard         → valida x-csrf-token header
    ├─ JwtAuthGuard      → extrae usuario del access_token cookie
    ├─ RolesGuard        → verifica que el usuario sea ADMIN o SUPERADMIN
    │
    ├─ ArticuloController.createArticulo()
    │       └─ ArticuloService.createArticulo(dto, file, user)
    │               ├─ AwsStorageDatasource.upload(file)   → URL de imagen
    │               └─ ArticuloRepository.createArticulo(dto)        → Prisma INSERT
    │
    └─ Respuesta JSON { id, titulo, ... }
```

---

## 4. Capa Común (`src/common/`)

Utilidades y decoradores transversales compartidos por todas las capas. No pertenecen a ningún módulo de negocio concreto.

```
src/common/
├── decorators/
│   └── sanitize.decorator.ts   ← Decoradores de transformación para DTOs
└── utils/
    └── sanitize.util.ts        ← Funciones de sanitización basadas en sanitize-html
```

### Sanitización de entrada

Todos los datos de texto que llegan a la API son sanitizados en los DTOs antes de alcanzar la capa de dominio. La sanitización se aplica mediante decoradores de `class-transformer` y se ejecuta automáticamente en el pipe global de validación.

#### Utilidades (`sanitize.util.ts`)

| Función | Descripción | Uso recomendado |
|---------|-------------|-----------------|
| `stripHtml(value)` | Elimina todas las etiquetas HTML; devuelve texto plano | Nombres, títulos, descripciones |
| `sanitizeRichHtml(value)` | Permite un subconjunto seguro de etiquetas HTML; bloquea scripts, event handlers y protocolos peligrosos | Contenido de secciones con editor rich-text |
| `sanitizeUrl(value)` | Elimina URLs con protocolos peligrosos (`javascript:`, `data:`, `vbscript:`); devuelve cadena vacía si el protocolo es peligroso | Campos `imgUrl`, `imageUrl` |

**Etiquetas permitidas por `sanitizeRichHtml`:** `p`, `h1`–`h6`, `strong`, `em`, `b`, `i`, `u`, `s`, `mark`, `code`, `pre`, `blockquote`, `ul`, `ol`, `li`, `a`, `br`, `hr`, `span`, `div`, `img`, `table`, `thead`, `tbody`, `tr`, `th`, `td`.

**Esquemas de URL permitidos:** `http`, `https`, `mailto`.

#### Decoradores (`sanitize.decorator.ts`)

| Decorador | Función subyacente | Cuándo usarlo |
|-----------|-------------------|---------------|
| `@Sanitize()` | `stripHtml` | Cualquier campo de texto plano |
| `@SanitizeRich()` | `sanitizeRichHtml` | Campos con contenido HTML de editores rich-text |
| `@SanitizeUrl()` | `sanitizeUrl` | Campos que contienen URLs de imágenes o enlaces |

**Ejemplo de uso en un DTO:**

```typescript
import { Sanitize, SanitizeRich, SanitizeUrl } from 'src/common/decorators/sanitize.decorator';

export class CreateArticuloDto {
  @Sanitize()
  titulo: string;

  @SanitizeRich()
  contenidoSec: string;

  @SanitizeUrl()
  imgUrl: string;
}
```

---

## Convenciones de código

- Clases, métodos y funciones en inglés, salvo el vocabulario que deriva de las entidades Prisma (`Proyecto`, `Articulo`, `Empleado`, `Servicio`, `Testimonio`, etc.), que se mantiene en español (ej. `ArticuloController.createArticulo`).
- Propiedades de objetos (DTOs, entities, params/query) en camelCase, conservando el vocabulario español de dominio cuando aplica (ej. `proyectoId`, `nombreProyecto`). Los campos del schema de Prisma usan `@map` para exponer camelCase en el código sin alterar las columnas físicas de la base de datos.
- Los DTOs usan `class-validator` con `whitelist: true` (propiedades no declaradas son ignoradas).
- Los IDs son UUIDs v4 generados con `UuidAdapter`.
- Las contraseñas nunca se retornan en las respuestas (excluidas manualmente en el servicio).
- Los tokens se almacenan únicamente como hash (bcrypt) en la base de datos.
- Los campos de texto en los DTOs se sanitizan con los decoradores de `src/common/decorators/sanitize.decorator.ts` antes de llegar a la capa de dominio.
