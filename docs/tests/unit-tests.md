# Tests Unitarios

Estado de la suite de tests unitarios (Jest), qué cubre cada archivo y cómo extenderla.

**Última actualización:** 2026-07-07
**Estado de la suite:** 18 suites / 127 tests, todos en verde (`npm test`).

---

## 1. Cómo correr los tests

```bash
npm test              # corre toda la suite una vez
npm run test:watch    # modo watch
npm run test:cov      # con reporte de cobertura (carpeta coverage/)
npm run test:debug    # con el debugger de Node adjunto
```

No requieren base de datos ni variables de entorno: son tests unitarios puros, con todas las dependencias externas (repositorios, `JwtService`, `bcryptjs`, etc.) mockeadas con `jest.fn()`. Ver [`technical-debt.md`](../technical-debt.md) y la sección 6 de este documento para lo que **no** está cubierto todavía (integración contra base de datos real, tests e2e HTTP).

---

## 2. Configuración de Jest (`package.json`)

```json
"jest": {
  "rootDir": "src",
  "moduleNameMapper": {
    "^src/(.*)$": "<rootDir>/$1",
    "^uuid$": "<rootDir>/__mocks__/uuid.ts"
  }
}
```

---

## 3. Convención usada en los tests

Todos los tests siguen el mismo patrón, para que sea fácil escribir uno nuevo copiando uno existente:

1. **Instanciación manual, sin `@nestjs/testing`.** Se hace `new XService(mockDep1, mockDep2, ...)` directamente en vez de `Test.createTestingModule(...)`. Es más rápido y suficiente porque estos servicios no usan otras features de Nest (guards, interceptors) dentro de sí mismos.
2. **Mocks tipados con `jest.Mocked<T>`**, construidos a mano en `beforeEach` con un `jest.fn()` por cada método de la interfaz/clase real (no solo los que usa el test), para que el mock seas intercambiable si el test crece.
3. **`import type`** para cualquier import que solo se use como tipo (p. ej. `import type { UsuarioRepositoryService } from '...'`). Evita arrastrar cadenas de imports pesadas (Prisma, datasources) al test.
4. **`afterEach(() => jest.clearAllMocks())`** en todos los archivos, para que un test no contamine al siguiente.
5. Estructura AAA (Arrange / Act / Assert) con comentarios cuando el test no es trivial.

---

## 4. Inventario de tests

### 4.1 Casos de uso (`src/domain/use-cases/`)

Lógica de negocio pura (sin NestJS, sin Prisma). Se mockean los repositorios abstractos del dominio.

| Archivo | Tests | Cubre |
|---|---|---|
| `articulo/create-articulo.use-case.spec.ts` | 1 | Creación de artículo + registro de actividad. |
| `articulo/update-articulo.use-case.spec.ts` | 1 | Actualización de artículo + registro de actividad (`'modificado'`). |
| `articulo/delete-articulo.use-case.spec.ts` | 3 | Caso feliz (borra imagen + actividad + artículo), usuario inexistente (`NotFoundException`), fallo al borrar la imagen no debe borrar el artículo. |
| `proyecto/create-proyecto.use-case.spec.ts` | 4 | Todas las secciones habilitadas, ninguna habilitada, habilitación independiente por sección, propagación de error si falla la creación del usuario. |
| `usuarios/delete-empleado.use-case.spec.ts` | 3 | Mismo patrón que `delete-articulo` para empleados. |
| `servicio/delete-servicio.use-case.spec.ts` | 3 | Mismo patrón que `delete-articulo` para servicios. |

### 4.2 Guards (`src/presentation/guards/`)

Autorización — ejecutan `canActivate` con un `ExecutionContext` construido a mano.

| Archivo | Tests | Cubre |
|---|---|---|
| `csrf.guard.spec.ts` | 9 | `@SkipCsrfCheck()`, métodos seguros (GET/HEAD/OPTIONS) sin token, token de header/cookie faltante, tokens que no matchean, tokens de distinta longitud, token válido en POST/PUT/DELETE. |
| `roles.guard.spec.ts` | 5 | Sin `@Roles()` (pasa), `@Roles()` vacío (pasa), rol correcto, rol incorrecto (`ForbiddenException`), sin usuario en el request (`ForbiddenException`). |

### 4.3 Utilidad de sanitización (`src/common/utils/sanitize.util.ts`)

| Archivo | Tests | Cubre |
|---|---|---|
| `sanitize.util.spec.ts` | 17 | `stripHtml`: texto plano, remoción de tags, `<script>`, `onerror=`. `sanitizeRichHtml`: subset permitido, `<script>`, `onclick=`, tags no permitidos (`<iframe>`), `javascript:` en `href`, links seguros, atributo `class`. `sanitizeUrl`: URLs seguras, `javascript:`/`data:`/`vbscript:` (incluye variación de mayúsculas), rutas relativas. |

### 4.4 Servicios de presentación (`src/presentation/*/`)

Se mockean los `*RepositoryService` (y `ImageStorageRepositoryService`/`UsuarioRepositoryService` donde aplica). Donde el service instancia un caso de uso internamente (`new XUseCase(...)`), el test lo ejerce con los repositorios mockeados en vez de intentar interceptar la clase — así se valida también el cableado service → use case → repository.

| Archivo | Tests | Foco principal |
|---|---|---|
| `auth.service.spec.ts` | 11 | `validateUserByPassword` (usuario inexistente, password incorrecto, credenciales válidas), `login` (firma de tokens, hash y persistencia del refresh token), `logout`, `verifyRefreshToken` (secret no configurado → `UnauthorizedException`), `refresh` (usuario inexistente, sin `hashedRt`, rt inválido, rotación exitosa de tokens). `bcryptjs` mockeado con `jest.mock('bcryptjs')`. |
| `articulo.service.spec.ts` | 17 | Pass-through de métodos simples + **lógica real de manejo de imágenes**: subida de imagen principal, subida de imágenes de secciones por índice, `size === 0` se salta sin llamar al storage, en `updateArticulo` reemplazo de imagen principal (borra la vieja, sube la nueva) y borrado de imágenes de secciones eliminadas del DTO. |
| `equipo.service.spec.ts` | 14 | Mismo foco que `articulo.service` pero para empleados (`sec_empleado`, `img_url`). |
| `servicios.service.spec.ts` | 14 | Mismo foco que `articulo.service` pero para servicios (`sec_servicio`, `img_url`). Incluye un test que **documenta explícitamente** el código muerto de `removeServicio` (ver [`technical-debt.md`](../technical-debt.md)): confirma que `deleteServicio` solo se invoca a través del use case y no por la segunda línea inalcanzable. |
| `proyecto.service.spec.ts` | 5 | `create` (delega en `CreateProyectoUseCase` con habilitación selectiva de secciones) + pass-through de `findAll`/`findOne`/`update`/`remove`. |
| `testimonios.service.spec.ts` | 8 | Pass-through de los 8 métodos (no tiene lógica propia más allá de delegar al repositorio). |
| `usuario.service.spec.ts` | 7 | Pass-through de 5 métodos + 2 tests sobre `create`, uno de los cuales **documenta un bug**: el método no retorna el usuario creado (`await this.usuarioService.createUsuario(...)` sin `return`), así que el controller siempre recibe `undefined`. No se corrigió — está señalado explícitamente para que se decida si se arregla. |
| `actividad.service.spec.ts` | 4 | `findAll` (delega al repositorio) + 3 tests que documentan que `findOneByArticuloId`, `findOneById` y `remove` son placeholders del CLI de Nest sin implementar (devuelven un string literal). |

### 4.5 Pre-existentes (no tocados en esta ronda)

| Archivo | Tests | Nota |
|---|---|---|
| `infrastructure/adapters/pass-hasher/pass-hasher.service.spec.ts` | 1 | Ya existía y pasaba. |

---

## 5. Qué NO está cubierto todavía

Ver el análisis completo de priorización en la conversación de diseño de esta suite; resumen:

- **Datasources y repositories** (`src/infrastructure/datasources/`, `src/infrastructure/repository/`): son wrappers delgados sobre Prisma. Mockear Prisma ahí solo testea el mock. Les corresponde **test de integración** contra una base Postgres real (Docker), no unitario.
- **Controllers** (`src/presentation/*/*.controller.ts`): bajo valor unitario (solo reenvían al service ya testeado). Mejor cubiertos por un test e2e HTTP con `supertest`.
- **DTOs con `class-validator`**: no hay tests que verifiquen que `class-validator` rechaza/acepta payloads según las reglas declaradas (`@MaxLength`, `@IsEnum`, etc.).
- **`http-exception.filter.ts`**: pendiente.
- **Multi-tenancy / aislamiento por `proyecto_id`**, flujos HTTP completos, `local-storage`/`aws-storage` datasource: requieren infraestructura real o emulada (Postgres, filesystem temporal, LocalStack/MinIO) — están fuera del alcance de tests unitarios.

Estos quedaron fuera porque se priorizó primero lo marcado como "prioridad alta" en unitarios; son candidatos naturales para la siguiente ronda (integración/e2e).
