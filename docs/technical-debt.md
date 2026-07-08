# Deuda técnica — Mezcla de Casos de Uso y Repositories en la capa de Presentación

**Estado:** Aceptado temporalmente (no bloqueante)
**Fecha:** 2026-07-07

---

## Contexto

El proyecto define una capa de **casos de uso** (`src/domain/use-cases/`) pensada para orquestar reglas de negocio que involucran múltiples repositorios o pasos (ej: crear un artículo y registrar la actividad en el mismo flujo, o eliminar un empleado limpiando también sus imágenes).

Sin embargo, en la práctica, los `*.service.ts` de `src/presentation/` **no siguen un patrón único**: dentro del mismo service, algunos métodos instancian y ejecutan un caso de uso, mientras que otros llaman directamente a los métodos del repository. No hay una regla clara de cuándo corresponde una cosa u otra — el criterio real terminó siendo "si el flujo tiene varios pasos, seguramente hay un use-case; si es un CRUD simple, se llama al repository".

## Estado actual (relevado en el código)

### Use cases existentes y dónde se usan

| Use case | Usado en | Notas |
|---|---|---|
| `CreateArticuloUseCase` | `ArticuloService.createArticulo` | Orquesta `ArticuloRepository` + `ActividadRepository` |
| `UpdateArticuloUseCase` | `ArticuloService.updateArticulo` | Ídem |
| `DeleteArticuloUseCase` | `ArticuloService.deleteArticulo` | Orquesta `ArticuloRepository` + `ActividadRepository` + `ImageStorage` + `UsuarioRepository` |
| `CreateProyectoUseCase` | `ProyectoService.create` | Orquesta 6 repositorios (proyecto, equipo, servicios, articulo, testimonios, usuario) |
| `DeleteEmpleadoUseCase` | `EquipoService.removeEmpleado` | Orquesta `EquipoRepository` + `ImageStorage` + `UsuarioRepository` |
| `DeleteServicioUseCase` | `ServiciosService.removeServicio` | Ver anomalía abajo ⚠️ |
| `CreateUsuarioUseCase` | **Ninguno** | Código muerto — existe en `domain/use-cases` pero no se importa en ningún service |

### Services con lógica mixta (use-case + repository directo, en el mismo archivo)

- `articulo.service.ts` — `createArticulo`/`updateArticulo`/`deleteArticulo` usan use-case; `createArticulos`, `findArticulos`, `updateArticulos`, `findArticuloById`, `updateArticuloStatus`, `findArticulosPublic`, `findArticuloByIdPublic` llaman al repository directo.
- `equipo.service.ts` — `removeEmpleado` usa use-case; el resto de los métodos (`create`, `find`, `update`, `createEmpleado`, `findEmpleado`, `updateEmpleado`, `updateEmpleadoOrden`, `findEquipoPublic`) llaman al repository directo.
- `servicios.service.ts` — `removeServicio` usa use-case; el resto llama al repository directo.
- `proyecto.service.ts` — `create` usa use-case; `findAll`, `findOne`, `update`, `remove` llaman al repository directo.

### Services que no usan casos de uso en absoluto (solo repository)

- `usuario.service.ts`
- `actividad.service.ts`
- `testimonios.service.ts`
- `auth.service.ts`

### Anomalía puntual detectada

En `src/presentation/servicios/servicios.service.ts`, el método `removeServicio` tiene una línea de código **inalcanzable**:

```typescript
removeServicio(id_usuario: string, id_servicio: string) {
    return new DeleteServicioUseCase(this.serviciosRepository, this.imageStorage, this.usuarioRepository).execute(id_usuario, id_servicio)
    return this.serviciosRepository.deleteServicio(id_usuario, id_servicio); // nunca se ejecuta
}
```

## Decisión

Por el momento, **se mantiene la mezcla tal cual está**. El sistema funciona correctamente y no hay planes de expandir significativamente esta capa de dominio en el corto plazo, por lo que el costo de refactorizar ahora no se justifica frente a otras prioridades.

Este documento deja constancia formal de que la inconsistencia es conocida y no es un descuido no identificado.

## Consecuencias

**Ahora mismo:**
- Un desarrollador nuevo no tiene forma de predecir, sin leer el código, si un método de un service resuelve la lógica él mismo o delega a un use-case.
- El criterio "multi-repositorio → use-case, CRUD simple → repository" nunca quedó escrito, así que cada aporte nuevo puede reinterpretarlo distinto.
- `CreateUsuarioUseCase` es código muerto que puede confundir sobre si `UsuarioService.create` debería usarlo.

**A futuro:**
- Si el proyecto crece (más reglas de negocio multi-paso, más entidades relacionadas), esta inconsistencia se va a volver más costosa de mantener y más proclive a bugs como el de `servicios.service.ts`.
- Se recomienda normalizar hacia **una sola estrategia**:
  - Opción A: todo pasa por casos de uso (incluso los CRUD simples se modelan como use-case, aunque sea un wrapper delgado sobre el repository).
  - Opción B: se elimina la capa de casos de uso y toda la orquestación multi-repositorio se mueve a los services (perdiendo el aislamiento/testeabilidad que da `domain/use-cases`, ver [`docs/architecture/layers.md`](./architecture/layers.md)).
- Al normalizar, también corresponde: eliminar o conectar `CreateUsuarioUseCase`, y limpiar la línea muerta en `servicios.service.ts`.

Ninguna opción se implementa en este documento — es una decisión de diseño a tomar cuando se priorice esta refactorización.
