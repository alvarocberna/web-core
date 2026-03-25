# Guía de Deploy — Producción

## Stack de producción actual

| Componente | Servicio |
|-----------|---------|
| API | Node.js (proceso PM2 o contenedor Docker) |
| Base de datos | Supabase PostgreSQL (connection pooling vía PgBouncer) |
| Imágenes | AWS S3 (`web-core-storage`) |
| Frontend / Proxy | Vercel (panel admin) + servidor con reverse proxy Nginx/Caddy |

---

## Variables de entorno de producción

```env
PORT=3001
NODE_ENV=production

# Supabase — usar la URL de connection pooling (puerto 6543)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true

# JWT — valores distintos a los de desarrollo
JWT_ACCESS_SECRET="<valor_seguro_aleatorio>"
JWT_REFRESH_SECRET="<valor_seguro_aleatorio>"

# AWS S3
AWS_ACCESS_KEY_ID=<tu_key>
AWS_SECRET_ACCESS_KEY=<tu_secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=web-core-storage

# CORS — solo orígenes de producción
CORS_ORIGINS=https://tu-admin-panel.vercel.app,https://www.tu-sitio.cl
```

## Proceso de deploy

### 1. Build

```bash
npm run build
# Esto ejecuta: prisma generate && nest build
# Genera: dist/ y generated/prisma/
```

### 2. Aplicar migraciones

```bash
# Aplicar migraciones pendientes sin interacción
npx prisma migrate deploy
```

> Usar `migrate deploy` (no `migrate dev`) en producción. No genera nuevas migraciones, solo aplica las pendientes.

### 3. Iniciar el proceso

```bash
# Con PM2 (recomendado para VPS)
pm2 start dist/main.js --name web-core
pm2 save
pm2 startup   # configurar auto-start

# O directamente
node dist/main.js
```

---

## Deploy con Docker

### Dockerfile de referencia

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

```bash
docker build -t web-core:latest .
docker run -d \
  --name web-core \
  -p 3001:3001 \
  --env-file .env.production \
  web-core:latest
```

---

## Configuración de Nginx (reverse proxy)

```nginx
server {
    listen 443 ssl;
    server_name api.tu-dominio.cl;

    ssl_certificate     /etc/letsencrypt/live/api.tu-dominio.cl/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.tu-dominio.cl/privkey.pem;

    location / {
        proxy_pass         http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Servir archivos de uploads directamente (optimización)
    location /uploads/ {
        alias /ruta/al/proyecto/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

> La API ya tiene `app.set('trust proxy', 1)` para leer correctamente el header `X-Forwarded-Proto` y emitir cookies `Secure` en producción.

---

## Checklist de producción

- [ ] `NODE_ENV=production` configurado
- [ ] Secrets JWT distintos a los de desarrollo
- [ ] `CORS_ORIGINS` contiene solo los orígenes reales de producción
- [ ] `prisma migrate deploy` ejecutado antes de iniciar
- [ ] HTTPS habilitado (los cookies son `Secure` + `SameSite=None` en producción)
- [ ] Rate limiting activo en `/auth/login`
- [ ] Bucket S3 con políticas de acceso correctas
- [ ] Logs y monitoring configurados (PM2, Datadog, Sentry, etc.)
- [ ] Backups automáticos de la base de datos habilitados en Supabase

---

## Comportamiento por entorno

El código en `main.ts` y la estrategia JWT detectan el entorno automáticamente:

| Variable | `development` | `production` |
|----------|--------------|-------------|
| Cookie `Secure` | `false` | `true` |
| Cookie `SameSite` | `lax` | `none` |
| Swagger UI | Habilitado | Habilitado (considerar deshabilitar) |
| `trust proxy` | Activo | Activo |
