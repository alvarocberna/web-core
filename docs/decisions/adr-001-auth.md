# ADR-001 — Estrategia de Autenticación: JWT + CSRF + Cookies HTTP-only

**Estado:** Aceptado
**Fecha:** 2026

---

## Contexto

La API necesita autenticar peticiones provenientes de un panel de administración (SPA en Vercel) y potencialmente de sitios web de clientes. El sistema debe ser seguro ante ataques comunes (XSS, CSRF, token hijacking) y funcionar correctamente en entornos cross-origin con HTTPS.

---

## Decisión

Se usa **JWT con dos tokens** (access + refresh) almacenados en **cookies HTTP-only**, complementado con un **CSRF token** en header para mitigar ataques CSRF.

### Tokens

| Token | TTL | Almacenamiento cliente | Almacenamiento servidor |
|-------|-----|----------------------|------------------------|
| `access_token` | 15 minutos | Cookie HTTP-only | No se persiste |
| `refresh_token` | 7 días | Cookie HTTP-only | Hash bcrypt en `Usuario.hashedRt` |

### Flujo completo

```
1. GET /auth/csrf-token
   ← Responde con { csrfToken: "..." }
   (Se guarda en cookies)

2. POST /auth/login  { email, password }
   Header: x-csrf-token: <token>
   ← Set-Cookie: access_token=...; HttpOnly; SameSite=None; Secure
   ← Set-Cookie: refresh_token=...; HttpOnly; SameSite=None; Secure

3. Requests autenticados
   → Cookie se envía automáticamente por el browser
   Header: x-csrf-token: <token>

4. POST /auth/refresh (cuando access_token expira)
   → Cookie refresh_token
   Header: x-csrf-token: <token>
   ← Nuevos cookies access_token y refresh_token

5. POST /auth/logout
   ← Cookies eliminadas (max-age=0)
   ← hashedRt = null en DB
```

---

## Consecuencias

**Positivas:**
- Los tokens no son accesibles desde JavaScript (protección XSS).
- El CSRF token en header evita ataques CSRF (los browsers no envían headers custom en requests cross-site automáticos).
- El refresh token se invalida en logout (hash eliminado de DB).
- Compatible con múltiples orígenes via CORS + `credentials: true`.

**Negativas / Consideraciones:**
- Requiere que el cliente maneje la obtención del CSRF token antes de cualquier mutación.
- En producción, las cookies requieren `SameSite=None; Secure`, lo que exige HTTPS obligatorio.
- Añade una round-trip adicional en el primer uso (obtener CSRF token).

---

## Implementación

- `src/presentation/auth/` — módulo de autenticación
- `src/presentation/auth/strategies/jwt.strategy.ts` — extrae JWT de la cookie
- `src/presentation/guards/csrf.guard.ts` — valida x-csrf-token header
- `src/presentation/auth/guards/jwt-auth.guard.ts` — protege rutas con JWT
- `src/presentation/decorators/public.decorator.ts` — marca rutas sin auth
- `src/presentation/decorators/skip-csrf.decorator.ts` — marca rutas sin CSRF check
