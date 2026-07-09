# Guía de CI/CD — Integración y Validación Continua

Estrategia de validación automática implementada con **GitHub Actions** (servidor) y **Husky** (local). El objetivo es garantizar que ningún código defectuoso llegue a las ramas principales.

---

## Resumen del flujo

```
git push
    │
    └─ pre-push (Husky)
           └─ npm run test:ci   ← Jest en modo CI
                  │
                  ├─ ✅ Push ejecutado → GitHub Actions se dispara
                  └─ ❌ Push cancelado si algún test falla

GitHub Actions (CI pipeline)
    │
    ├─ Checkout + Node 20 + npm ci
    ├─ prisma generate
    ├─ npm run build             ← Valida compilación TypeScript
    └─ npm run test:ci           ← Segunda barrera de tests en el servidor
           │
           ├─ ✅ Pipeline verde → PR puede ser mergeado
           └─ ❌ Pipeline rojo → merge bloqueado (con branch protection activa)
```

---

## Archivos de configuración

### `.github/workflows/ci.yml` — Pipeline de GitHub Actions

Se dispara automáticamente en:
- **Push** a cualquier rama
- **Pull Request** hacia `main` o `develop`

#### Pasos del pipeline

| Paso | Descripción |
|------|-------------|
| `actions/checkout@v4` | Clona el repositorio en el runner de Ubuntu |
| `actions/setup-node@v4` | Configura Node.js 20 con caché de npm |
| `npm ci` | Instalación limpia y determinista (usa `package-lock.json`) |
| `npx prisma generate` | Genera el cliente Prisma (necesario antes de compilar) |
| `npm run build` | Valida que el TypeScript compile sin errores |
| `npm run test:ci` | Ejecuta la suite completa de tests unitarios |

---

### `.husky/pre-push` — Hook local de pre-push

Ejecuta los tests antes de permitir el push:

```bash
npm run test:ci
```

Si algún test falla, Git cancela el push con exit code distinto de 0. El desarrollador debe corregir los tests antes de poder subir el código.

---

### Script `test:ci` en `package.json`

```json
"test:ci": "jest --runInBand --forceExit --passWithNoTests"
```

| Flag | Propósito |
|------|-----------|
| `--runInBand` | Ejecuta todos los tests en un único proceso (sin workers paralelos). Más estable en entornos CI y evita conflictos con conexiones a base de datos |
| `--forceExit` | Fuerza el cierre de Jest al terminar. Evita que el proceso quede colgado por handles abiertos (frecuente con Prisma) |
| `--passWithNoTests` | No falla si no existe ningún test. Útil durante el inicio del proyecto o en ramas de scaffolding |

---

### Script `prepare` en `package.json`

```json
"prepare": "husky"
```

Se ejecuta automáticamente al correr `npm install`. Instala los hooks de Husky en la carpeta `.git/hooks/` de cualquier máquina que clone el repositorio. Esto garantiza que todos los colaboradores tengan los hooks activos sin pasos manuales adicionales.

---

## Saltarse los hooks (emergencias)

```bash
# Saltar solo el pre-commit
git commit --no-verify -m "mensaje"

# Saltar solo el pre-push (tests)
git push --no-verify
```

> Usar únicamente en situaciones justificadas. El pipeline de GitHub Actions ejecutará los mismos checks en el servidor, así que el código defectuoso será detectado de igual manera.

---

## Configurar branch protection en GitHub (paso posterior al primer push)

Una vez que el pipeline haya corrido al menos una vez en GitHub, activar la protección de ramas para que los PRs no puedan mergearse si el CI falla:

1. Ir a **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main` (repetir para `dev` si aplica)
3. Activar:
   - ✅ **Require a pull request before merging**
   - ✅ **Require status checks to pass before merging**
     - Buscar y seleccionar el check: `CI / test`
4. Guardar la regla

> El check `CI / test` solo aparece disponible después de que el workflow haya corrido al menos una vez.

---

## Dependencias instaladas

| Paquete | Versión | Tipo | Propósito |
|---------|---------|------|-----------|
| `husky` | `^9.1.7` | devDependency | Gestión de Git hooks |

GitHub Actions no requiere instalación de dependencias adicionales; usa los runners y actions provistas por GitHub.
