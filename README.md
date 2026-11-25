# web-core

API REST multi-tenant del sisteema CMS: gestiona proyectos, usuarios, artículos, equipo, servicios, testimonios y actividad, con autenticación JWT por cookies y RBAC.
Es el **backend** del sistema; lo consumen [`web-admin-panel`](../web-admin-panel) (panel de administración) y los sitios web públicos de cada cliente (endpoints públicos filtrados por `proyectoId`).

## Stack

- **Lenguaje / runtime:** TypeScript 5 sobre Node.js 20
- **Framework:** NestJS 11 (Express), documentación con Swagger (`@nestjs/swagger`)
- **Base de datos:** PostgreSQL con Prisma 6 (Supabase en producción, Docker en local)
- **Auth:** JWT access + refresh en cookies HTTP-only (Passport), CSRF guard, bcrypt, roles `USER` / `ADMIN` / `SUPERADMIN`
- **Almacenamiento:** AWS S3 para imágenes, con alternativa en disco local (`/uploads`)
- **Seguridad:** Helmet, CORS con lista blanca, rate limiting en rutas sensibles, sanitización de HTML (`sanitize-html`)
- **Validación:** `class-validator` en DTOs y `joi` para las variables de entorno
- **Testing:** Jest + ts-jest (unitarios); Supertest disponible para e2e

## Requisitos previos

- Node.js **20.x** (la versión del CI) y npm 10+
- PostgreSQL 14+; lo más simple es el contenedor de `../database/db-docker-local` (Postgres 17.5, requiere Docker)
- Cuenta AWS con un bucket S3 *(opcional en local)*
- Proyecto en Supabase *(solo producción)*

## Puesta en marcha

```bash
# 1. Base de datos local (desde la raíz del monorepo; requiere su propio .env con POSTGRES_*)
cd ../database/db-docker-local && docker compose up -d && cd -

# 2. Variables de entorno: crea .env con las variables de la tabla de abajo
#    (no hay .env.example; docs/guides/setup.md trae un ejemplo comentado)

# 3. Dependencias (también instala los hooks de Husky)
npm install

# 4. Migraciones + cliente de Prisma
npx prisma migrate dev

# 5. Arrancar con hot-reload
npm run start:dev
```

- API: `http://localhost:3001`
- Swagger: `http://localhost:3001/api/docs`
- Health check: `http://localhost:3001/health`

La base de datos arranca vacía: el primer `Proyecto` y el usuario `SUPERADMIN` se crean a mano con `npx prisma studio` (ver [docs/guides/setup.md](docs/guides/setup.md#7-crear-el-primer-superadmin)).

## Variables de entorno

Se validan al arrancar con Joi en [`src/app.module.ts`](src/app.module.ts); si falta una obligatoria, la app no arranca y lista todos los errores juntos. El detalle y los ejemplos están en [docs/guides/setup.md](docs/guides/setup.md#3-configurar-variables-de-entorno).

| Variable | Obligatoria | Para qué sirve |
|---|---|---|
| `DATABASE_URL` | Sí | Conexión a PostgreSQL (en Supabase, la URL del pooler) |
| `DIRECT_URL` | Sí para Prisma CLI | Conexión directa usada por `prisma migrate` (en local, igual que `DATABASE_URL`) |
| `JWT_ACCESS_SECRET` | Sí | Firma del access token (mín. 32 caracteres) |
| `JWT_REFRESH_SECRET` | Sí | Firma del refresh token (mín. 32 caracteres) |
| `JWT_ACCESS_EXPIRATION` | No (`900s`) | Duración del access token |
| `JWT_REFRESH_EXPIRATION` | No (`7d`) | Duración del refresh token |
| `BCRYPT_SALT_OR_ROUNDS` | No (`10`) | Coste del hash de contraseñas y tokens |
| `PORT` | No (`3001`) | Puerto HTTP |
| `NODE_ENV` | No (`development`) | `development` / `production` / `test`; cambia flags `Secure` y `SameSite` de las cookies |
| `CORS_ORIGINS` | En la práctica, sí | Orígenes permitidos separados por coma (p. ej. el panel en `http://localhost:3000`) |
| `URL_FRONTEND` | No | URL del panel; validada por Joi pero hoy sin uso en el código |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | No | Credenciales para subir imágenes a S3 |
| `AWS_REGION` | No (`us-east-1`) | Región del bucket |
| `AWS_S3_BUCKET` | No | Nombre del bucket de imágenes |
| `BASE_URL` | No (`http://localhost:3000`) | URL pública usada al construir las rutas de imágenes guardadas en disco |
| `DATABASE_NAME` | No | Solo informativa; el código no la lee |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run start:dev` | Servidor en modo watch |
| `npm run start:debug` | Watch + inspector de Node |
| `npm run build` | `prisma generate` + `nest build` → `dist/` |
| `npm run start:prod` | Ejecuta `dist/main.js` (requiere build previo) |
| `npm run lint` | ESLint con `--fix` sobre `src`, `test`... |
| `npm run format` | Prettier sobre `src` y `test` |
| `npm test` | Tests unitarios (`*.spec.ts` dentro de `src/`) |
| `npm run test:ci` | Unitarios en un solo proceso con `--forceExit`; lo usan CI y el hook `pre-push` |
| `npm run test:watch` / `test:cov` | Tests en modo watch / con cobertura en `coverage/` |
| `npm run test:e2e` | Tests e2e de `test/` (hoy solo el ejemplo inicial de Nest) |
| `npx prisma migrate dev --name <nombre>` | Crea y aplica una migración nueva |
| `npx prisma migrate deploy` | Aplica migraciones pendientes (producción) |
| `npx prisma studio` | Explorador visual de la base de datos |

## Arquitectura

Arquitectura por capas (estilo clean architecture) sobre módulos de NestJS:

```
src/
├── domain/            # Núcleo sin dependencias de framework
│   ├── entities/      #   modelos de dominio
│   ├── dtos/          #   DTOs de entrada/salida con class-validator
│   ├── datasources/   #   contratos abstractos de acceso a datos
│   ├── repository/    #   contratos abstractos de repositorios
│   ├── use-cases/     #   flujos que coordinan varios repositorios
│   └── enums/         #   roles, estados, etc.
├── infrastructure/    # Implementaciones concretas
│   ├── orm/prisma/    #   PrismaService (módulo global)
│   ├── datasources/   #   acceso a Prisma, S3 y disco local
│   ├── repository/    #   repositorios que delegan en los datasources
│   └── adapters/      #   bcrypt (pass-hasher) y UUID
├── presentation/      # Un módulo Nest por recurso: controller + service + module
│   ├── guards/        #   CsrfGuard y RolesGuard (globales)
│   ├── filters/       #   HttpExceptionFilter (incluye errores de Prisma)
│   └── decorators/    #   @Public(), @Roles(), etc.
└── common/            # Sanitización (util + decoradores) y config de Multer
prisma/                # schema.prisma, migraciones y SQL de seguridad de Supabase
docs/                  # Documentación técnica detallada
```

Reglas que no se deducen del código:

- **Dependencias hacia dentro:** `presentation` → `infrastructure` → `domain`. El dominio no importa nada de Nest ni de Prisma.
- **Multi-tenancy por `proyectoId`:** las rutas privadas sacan `usuarioId` del JWT y de ahí el proyecto; las públicas reciben `proyectoId` por query o parámetro. Nunca hay que confiar en un `proyectoId` del body en rutas privadas.
- **Guards globales en orden fijo:** CSRF → JWT → Roles. Una ruta pública se marca con `@Public()`, no quitando guards.
- **Idioma:** clases y métodos en inglés; el vocabulario de dominio que viene de Prisma (`Proyecto`, `Articulo`, `Empleado`…) se mantiene en español. Las columnas usan `@map` en snake_case.
- **Textos de entrada:** todo campo de texto libre de un DTO lleva un decorador de sanitización de `src/common/decorators`.

Más detalle en [docs/architecture/layers.md](docs/architecture/layers.md), [docs/architecture/overview.md](docs/architecture/overview.md) y la referencia de endpoints en [docs/api/endpoints.md](docs/api/endpoints.md). Índice general: [docs/README.md](docs/README.md).

## Despliegue y CI

- **Despliegue:** API en Node 20 (build `npm run build` + `npx prisma migrate deploy` + `node dist/main.js`), base de datos en Supabase e imágenes en S3; el panel admin consume la URL pública de la API. Pasos, Dockerfile de referencia, Nginx y checklist en [docs/guides/deploy.md](docs/guides/deploy.md).
- **CI:** GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) en cada push y en PRs a `main`/`dev`: `npm ci` → `prisma generate` → `npm run build` → `npm run test:ci`. En local, Husky ejecuta `npm run test:ci` en `pre-push`. Ver [docs/guides/ci-cd.md](docs/guides/ci-cd.md).

## Problemas conocidos

- **`Environment variable not found: DIRECT_URL` al migrar**: `schema.prisma` declara `directUrl`. En local, define `DIRECT_URL` con el mismo valor que `DATABASE_URL`.
- **La app no arranca y muestra `"JWT_ACCESS_SECRET" length must be at least 32...`**: la validación Joi exige secretos largos. Genera uno con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- **El panel recibe errores de CORS o no se guardan las cookies**: falta su origen en `CORS_ORIGINS` (sin `/` final). En producción las cookies son `Secure` + `SameSite=None`, así que requieren HTTPS.
- **`403 Forbidden` en peticiones POST/PUT/PATCH/DELETE**: el `CsrfGuard` no encontró el header `x-csrf-token` que coincida con la cookie. Desde Postman/curl, pide antes el token en `GET /auth/csrf-token`.
- **`429 Too Many Requests` en login**: `/auth/login`, `/auth/refresh` y la creación de usuarios/testimonios permiten 10 peticiones cada 15 min por IP. Reinicia el servidor en local para resetear el contador.
- **Imágenes locales con URL rota**: sin credenciales de AWS se guardan en `uploads/images` y la URL se arma con `BASE_URL`, cuyo valor por defecto apunta al puerto 3000. En local, define `BASE_URL=http://localhost:3001`.
- **Error de tipos con `@prisma/client` tras cambiar el schema**: el cliente está desactualizado. Ejecuta `npx prisma generate` (o `npm run build`).
- **`npm run test:e2e` falla**: `test/app.e2e-spec.ts` es el ejemplo de Nest y espera `GET /` → `Hello World!`, una ruta que no existe. No hay suite e2e real todavía.

## Contribuir

- **Ramas:** `main` (producción) y `dev` (integración). Trabaja en una rama desde `dev`, abre PR hacia `dev` y después de `dev` a `main`. El CI debe quedar en verde.
- **Commits:** `tipo: descripción` en español y en minúsculas, como en el historial. Tipos usados: `feature`, `fix`, `refactor`, `test`, `doc`, `ci`, `chore` (se admite ámbito: `chore(articulo): ...`).
  ```
  feature: nuevo endpoint para modificar campo 'orden' de modulo equipo
  fix: ruta de prisma client corregida
  ```
- **Cambios de contrato con otros repos:** cualquier cambio en rutas, DTOs, nombres de cookies, header CSRF o forma de las respuestas rompe `web-admin-panel` y los sitios públicos que usan los endpoints `*/project/*`. En esos casos:
  1. Actualiza [docs/api/endpoints.md](docs/api/endpoints.md) en el mismo PR.
  2. Prefiere cambios aditivos (campos o rutas nuevas) antes que renombrar o borrar.
  3. Abre el PR del panel en paralelo y despliega primero el backend.
- **Migraciones:** nunca edites una migración ya aplicada; crea una nueva con `prisma migrate dev --name ...` y súbela junto con el cambio del schema.
- Corre `npm run lint` y `npm run test:ci` antes de abrir el PR (el hook `pre-push` ya ejecuta los tests).

## Deuda técnica

- Uso mixto de *use cases* y llamadas directas a repositorios en los services de `presentation/`, sin un criterio escrito.
- `CreateUsuarioUseCase` es código muerto y `ServiciosService.removeServicio` tiene una línea inalcanzable.
- El bucket S3 es público; debería ser privado y servirse vía CloudFront.
- Sin tests de integración (datasources/repositories contra Postgres real) ni e2e HTTP; tampoco hay tests de DTOs ni de `HttpExceptionFilter`.
- No existe `.env.example`; la plantilla vive solo en la documentación.
- Swagger expuesto también en producción.

Detalle en [docs/technical-debt.md](docs/technical-debt.md) y [docs/tests/unit-tests.md](docs/tests/unit-tests.md#5-qué-no-está-cubierto-todavía).
