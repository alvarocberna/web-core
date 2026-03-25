# web-core — Documentación

API backend multi-tenant con esquemas compartidos construida con **NestJS**, **Prisma** y **PostgreSQL**. Provee gestión de contenido (artículos, equipo, servicios, testimonios) con autenticación JWT, control de acceso basado en roles (RBAC) y subida de imágenes a AWS S3.

---

## Índice

| Sección | Descripción |
|---------|-------------|
| [Arquitectura / Overview](./architecture/overview.md) | Visión general del sistema, stack y decisiones de diseño |
| [Arquitectura / Capas](./architecture/layers.md) | Descripción de cada capa y su responsabilidad |
| [API / Endpoints](./api/endpoints.md) | Referencia completa de todos los endpoints |
| [Guía / Setup](./guides/setup.md) | Instalación y configuración del entorno local |
| [Guía / Deploy](./guides/deploy.md) | Despliegue en producción |
| [Decisions / ADR-001](./decisions/adr-001-auth.md) | Decisión: estrategia de autenticación JWT + CSRF |
| [Decisions / ADR-002](./decisions/adr-002-storage.md) | Decisión: almacenamiento de imágenes S3 + local |

---

## Inicio rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env   # editar con tus valores

# 3. Aplicar migraciones de base de datos
npx prisma migrate dev

# 4. Iniciar en modo desarrollo
npm run start:dev
```

Swagger disponible en `http://localhost:3001/api/docs`.

---

## Stack principal

- **Runtime:** Node.js + TypeScript
- **Framework:** NestJS 11
- **ORM:** Prisma 6 + PostgreSQL
- **Auth:** JWT (access 15 min / refresh 7 días) vía cookies HTTP-only
- **Storage:** AWS S3 (fallback: disco local `/uploads`)
- **Seguridad:** Helmet, CSRF guard, Rate limiting, CORS
