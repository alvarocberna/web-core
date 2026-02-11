# Etapa 1 - Obj: instalar dependencias
FROM node:20-bookworm-slim AS deps
# Define el directorio de trabajo dentro de la imagen.
WORKDIR /app
# Instala OpenSSL necesario para Prisma y limpia la cache de apt.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# Copia solo los manifiestos de dependencias para aprovechar la cache de capas.
COPY package*.json ./
# Instala todas las dependencias exactamente desde el lockfile.
RUN npm ci

# Etapa 2 - Obj: Compilar Nest y generar prisma client
FROM node:20-bookworm-slim AS build
# Define el directorio de trabajo dentro de la imagen.
WORKDIR /app
# Instala OpenSSL necesario para Prisma y limpia la cache de apt.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# Reutiliza las dependencias instaladas desde la etapa deps.
COPY --from=deps /app/node_modules ./node_modules
# Copia todo el codigo fuente del proyecto dentro de la imagen.
COPY . .
# Compila la aplicacion NestJS a dist/.
RUN npm run build
# Genera el cliente de Prisma en generated/prisma.
RUN npx prisma generate

# Etapa 3 (runtime) - Obj: Ejecutar la app en producción
FROM node:20-bookworm-slim AS runtime
# Define el directorio de trabajo dentro de la imagen.
WORKDIR /app
# Instala OpenSSL necesario para Prisma y limpia la cache de apt.
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
# Define el entorno de produccion para Node.
ENV NODE_ENV=production
# Copia los manifiestos de dependencias para la instalacion de produccion.
COPY package*.json ./
# Instala solo dependencias de produccion.
RUN npm ci --omit=dev
# Copia la app compilada desde la etapa de build.
COPY --from=build /app/dist ./dist
# Copia el cliente de Prisma generado.
COPY --from=build /app/generated ./generated
# Copia el schema y las migraciones de Prisma (usado en runtime).
COPY --from=build /app/prisma ./prisma
# Copia la carpeta de uploads para uso en runtime.
COPY --from=build /app/uploads ./uploads
# Expone el puerto por defecto de NestJS.
EXPOSE 3000
# Inicia la app compilada.
CMD ["node", "dist/main"]
