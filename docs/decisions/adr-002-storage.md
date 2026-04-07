# ADR-002 — Almacenamiento de Imágenes: AWS S3 + Fallback Local

**Estado:** Aceptado
**Fecha:** 2026

---

## Contexto

Varios módulos (artículos, equipo, servicios) requieren subir imágenes asociadas a sus entidades. Se necesita una solución que funcione tanto en desarrollo local como en producción, y que sea escalable.

---

## Decisión

Se implementa un patrón de **estrategia intercambiable** para el almacenamiento con dos implementaciones:

1. **`AwsStorageDatasource`** — sube archivos a AWS S3 y retorna una URL pública
2. **`LocalStorageDatasource`** — guarda archivos en `./uploads/` y retorna una ruta relativa

Ambas implementan la misma interfaz de dominio, permitiendo cambiar la estrategia sin modificar el código de los módulos.

### Configuración de Multer

Las rutas de subida usan `multer` con almacenamiento en memoria (`memoryStorage`) para:
- No escribir archivos temporales en disco
- Pasar el buffer directamente al datasource de almacenamiento elegido

```typescript
// Ejemplo en controller
@Post('crear')
@UseInterceptors(FileInterceptor('image'))
async crear(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateEmpleadoDto
) { ... }
```

### Decisión de qué datasource usar

Actualmente la selección se hace en el módulo según las variables de entorno disponibles:
- Si `AWS_ACCESS_KEY_ID` está configurado → `AwsStorageDatasource`
- Fallback → `LocalStorageDatasource`

---

## Estructura de las imágenes en DB

Cada entidad con imagen almacena tres campos:

| Campo | Descripción |
|-------|-------------|
| `img_url` / `image_url` | URL completa (S3) o ruta relativa (`/uploads/...`) |
| `img_alt` / `image_alt` | Texto alternativo para accesibilidad |
| `image_position` | Posición CSS (ej: `center`, `top`) para control visual. Solo aplicado en la entidad SecArticulo |

---

## Servir imágenes locales

En `main.ts` se configura la carpeta `uploads/` como assets estáticos:

```typescript
app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads/',
});
```

Esto permite acceder a imágenes en `http://localhost:3001/uploads/nombre-archivo.jpg`.

---

## Consecuencias

**Positivas:**
- Desarrollo sin necesidad de credenciales AWS.
- Producción con almacenamiento escalable y CDN de AWS.
- Cambio de proveedor de storage sin impacto en los módulos de negocio.

**Negativas / Consideraciones:**
- Los archivos subidos localmente no se replican en S3 automáticamente.
- La carpeta `uploads/` no debe commitearse al repositorio (agregar a `.gitignore`).
- En producción con múltiples instancias, el almacenamiento local no es viable (usar siempre S3).

---

## Implementación

- `src/infrastructure/datasources/aws-storage.datasource/` — implementación S3
- `src/infrastructure/datasources/local-storage.datasource/` — implementación local
- `src/domain/datasources/` — interfaz abstracta de storage
