# Guía de Setup — Entorno Local

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|---------------|
| Node.js | 20.x LTS |
| npm | 10.x |
| PostgreSQL | 14+ |
| Git | Cualquiera |

> Opcional: Docker para levantar PostgreSQL sin instalar nada localmente.

---

## 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd web-core
```

---

## 2. Instalar dependencias

```bash
npm install
```

---

## 3. Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```env
# ── Servidor ────────────────────────────────────────────────
PORT=3001
NODE_ENV=development

# ── Base de datos ────────────────────────────────────────────
# Formato: postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public
DATABASE_URL=postgresql://postgres:tu_password@localhost:5432/db-web-core?schema=public

# ── JWT ──────────────────────────────────────────────────────
# Genera valores seguros con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_ACCESS_SECRET="cadena_aleatoria_larga_1"
JWT_REFRESH_SECRET="cadena_aleatoria_larga_2"

# ── AWS S3 (opcional en desarrollo) ─────────────────────────
# Si no se configura, las imágenes se guardan en /uploads localmente
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=nombre-de-tu-bucket

# ── CORS ─────────────────────────────────────────────────────
# Lista de orígenes separados por coma
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## 4. Levantar PostgreSQL con Docker (opcional)

```bash
docker run --name web-core-db \
  -e POSTGRES_PASSWORD=tu_password \
  -e POSTGRES_DB=db-web-core \
  -p 5432:5432 \
  -d postgres:16
```

---

## 5. Aplicar migraciones de Prisma

```bash
# Aplicar migraciones existentes y generar el cliente Prisma
npx prisma migrate dev

# Si quieres explorar la base de datos visualmente
npx prisma studio
```

---

## 6. Iniciar el servidor

```bash
# Modo desarrollo (hot-reload)
npm run start:dev

# Modo debug
npm run start:debug
```

El servidor queda disponible en `http://localhost:3001`.

Swagger UI: `http://localhost:3001/api/docs`

---

## 7. Crear el primer SUPERADMIN

La base de datos arranca vacía. Para crear el primer proyecto y usuario SUPERADMIN puedes usar Prisma Studio o un seed script:

```bash
# Abrir Prisma Studio
npx prisma studio
```

1. Crear un registro en `Proyecto`.
2. Crear un registro en `Usuario` con:
   - `rol`: `SUPERADMIN`
   - `proyecto_id`: ID del proyecto recién creado
   - `password`: hash bcrypt de la contraseña (generarlo postman)

---

## 8. Verificar la instalación

```bash
# Health check
curl http://localhost:3001/health

# Obtener CSRF token
curl -c cookies.txt http://localhost:3001/auth/csrf-token

# Login
curl -b cookies.txt -c cookies.txt -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: <token_del_paso_anterior>" \
  -d '{"email":"admin@example.com","password":"tu_password"}'
```

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila el proyecto (`prisma generate` + `nest build`) |
| `npm run start:prod` | Inicia el build de producción (`dist/main.js`) |
| `npm run test` | Ejecuta tests unitarios |
| `npm run test:cov` | Tests con reporte de cobertura |
| `npm run lint` | Linting y auto-fix con ESLint |

---

## Estructura de archivos generados

```
web-core/
├── dist/              ← Build de producción (generado con npm run build)
├── generated/prisma/  ← Cliente Prisma generado (no commitear)
└── uploads/           ← Imágenes almacenadas localmente (no commitear)
```

Asegurarse de que `dist/`, `generated/` y `uploads/` están en `.gitignore`.
