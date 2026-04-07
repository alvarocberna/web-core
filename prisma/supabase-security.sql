-- ============================================================
-- SUPABASE SECURITY — web-core
-- Row Level Security, Constraints, Functions & Triggers
--
-- INSTRUCCIONES:
--   1. Ejecuta este script en el SQL Editor de Supabase
--      DESPUÉS de que Prisma haya creado las tablas.
--   2. El backend NestJS usa el service_role key, el cual
--      bypass RLS por diseño. Las politicas de RLS protegen 
--      accesos directos (anon key, dashboard, APIs externas).
--   3. Para que las políticas de "authenticated" funcionen con
--      tu JWT personalizado, configura en tu NestJS que el
--      JWT secret coincida con el de Supabase (JWT_SECRET),
--      e incluye "proyecto_id" y "rol" en el payload del token.
-- ============================================================


-- ============================================================
-- SECCIÓN 1: CONSTRAINTS
-- ============================================================

DO $$ BEGIN

-- ── Usuario ───────────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_usuario_rol'
) THEN
  ALTER TABLE "Usuario"
    ADD CONSTRAINT ck_usuario_rol
    CHECK (rol IN ('USER', 'ADMIN', 'SUPERADMIN'));
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_usuario_email'
) THEN
  ALTER TABLE "Usuario"
    ADD CONSTRAINT ck_usuario_email
    CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');
END IF;


-- ── Articulos / Articulo ──────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'uq_articulos_proyecto'
) THEN
  ALTER TABLE "Articulos"
    ADD CONSTRAINT uq_articulos_proyecto
    UNIQUE (proyecto_id);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_articulo_status'
) THEN
  ALTER TABLE "Articulo"
    ADD CONSTRAINT ck_articulo_status
    CHECK (status IN ('rejected', 'pending', 'approved'));
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_articulo_nro'
) THEN
  ALTER TABLE "Articulo"
    ADD CONSTRAINT ck_articulo_nro
    CHECK (nro_articulo > 0);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_articulo_image_position'
) THEN
  ALTER TABLE "Articulo"
    ADD CONSTRAINT ck_articulo_image_position
    CHECK (image_position IS NULL OR image_position IN ('left', 'right', 'full', 'none'));
END IF;


-- ── SecArticulo ───────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secarticulo_nro_sec'
) THEN
  ALTER TABLE "SecArticulo"
    ADD CONSTRAINT ck_secarticulo_nro_sec
    CHECK (nro_seccion > 0);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secarticulo_image_position'
) THEN
  ALTER TABLE "SecArticulo"
    ADD CONSTRAINT ck_secarticulo_image_position
    CHECK (image_position IS NULL OR image_position IN ('left', 'right', 'full', 'none'));
END IF;


-- ── Empleado ──────────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_empleado_orden'
) THEN
  ALTER TABLE "Empleado"
    ADD CONSTRAINT ck_empleado_orden
    CHECK (orden IS NULL OR orden > 0);
END IF;


-- ── SecEmpleado ───────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secempleado_nro_sec'
) THEN
  ALTER TABLE "SecEmpleado"
    ADD CONSTRAINT ck_secempleado_nro_sec
    CHECK (nro_seccion > 0);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secempleado_image_position'
) THEN
  ALTER TABLE "SecEmpleado"
    ADD CONSTRAINT ck_secempleado_image_position
    CHECK (image_position IS NULL OR image_position IN ('left', 'right', 'full', 'none'));
END IF;


-- ── Servicios / Servicio ──────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'uq_servicios_proyecto'
) THEN
  ALTER TABLE "Servicios"
    ADD CONSTRAINT uq_servicios_proyecto
    UNIQUE (proyecto_id);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_servicio_valor'
) THEN
  ALTER TABLE "Servicio"
    ADD CONSTRAINT ck_servicio_valor
    CHECK (valor IS NULL OR valor >= 0);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_servicio_descuento'
) THEN
  ALTER TABLE "Servicio"
    ADD CONSTRAINT ck_servicio_descuento
    CHECK (porcentaje_descuento IS NULL OR (porcentaje_descuento >= 0 AND porcentaje_descuento <= 100));
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_servicio_orden'
) THEN
  ALTER TABLE "Servicio"
    ADD CONSTRAINT ck_servicio_orden
    CHECK (orden IS NULL OR orden > 0);
END IF;


-- ── SecServicio ───────────────────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secservicio_nro_sec'
) THEN
  ALTER TABLE "SecServicio"
    ADD CONSTRAINT ck_secservicio_nro_sec
    CHECK (nro_seccion > 0);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_secservicio_image_position'
) THEN
  ALTER TABLE "SecServicio"
    ADD CONSTRAINT ck_secservicio_image_position
    CHECK (image_position IS NULL OR image_position IN ('left', 'right', 'full', 'none'));
END IF;


-- ── Testimonios / Testimonio ──────────────────────────────

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'uq_testimonios_proyecto'
) THEN
  ALTER TABLE "Testimonios"
    ADD CONSTRAINT uq_testimonios_proyecto
    UNIQUE (proyecto_id);
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_testimonio_status'
) THEN
  ALTER TABLE "Testimonio"
    ADD CONSTRAINT ck_testimonio_status
    CHECK (status IN ('pending', 'approved', 'rejected'));
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_testimonio_calificacion'
) THEN
  ALTER TABLE "Testimonio"
    ADD CONSTRAINT ck_testimonio_calificacion
    CHECK (calificacion IS NULL OR (calificacion >= 1 AND calificacion <= 5));
END IF;

IF NOT EXISTS (
  SELECT 1 FROM pg_constraint WHERE conname = 'ck_testimonio_correo'
) THEN
  ALTER TABLE "Testimonio"
    ADD CONSTRAINT ck_testimonio_correo
    CHECK (correo ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$');
END IF;

END $$;

-- ============================================================
-- SECCIÓN 2: ÍNDICES DE RENDIMIENTO
-- (PostgreSQL NO indexa FK automáticamente)
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_usuario_proyecto    ON "Usuario"     (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_articulos_proyecto  ON "Articulos"   (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_articulo_articulos  ON "Articulo"    (articulos_id);
CREATE INDEX IF NOT EXISTS idx_articulo_usuario    ON "Articulo"    (usuario_id);
CREATE INDEX IF NOT EXISTS idx_articulo_status     ON "Articulo"    (status);
CREATE INDEX IF NOT EXISTS idx_articulo_slug       ON "Articulo"    (slug);
CREATE INDEX IF NOT EXISTS idx_secarticulo_art     ON "SecArticulo" (articulo_id);
CREATE INDEX IF NOT EXISTS idx_equipo_proyecto     ON "Equipo"      (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_empleado_equipo     ON "Empleado"    (equipo_id);
CREATE INDEX IF NOT EXISTS idx_empleado_slug       ON "Empleado"    (slug);
CREATE INDEX IF NOT EXISTS idx_secempleado_emp     ON "SecEmpleado" (empleado_id);
CREATE INDEX IF NOT EXISTS idx_servicios_proyecto  ON "Servicios"   (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_servicio_servicios  ON "Servicio"    (servicios_id);
CREATE INDEX IF NOT EXISTS idx_servicio_slug       ON "Servicio"    (slug);
CREATE INDEX IF NOT EXISTS idx_secservicio_ser     ON "SecServicio" (servicio_id);
CREATE INDEX IF NOT EXISTS idx_testimonios_proy    ON "Testimonios" (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_testimonio_testis   ON "Testimonio"  (testimonios_id);
CREATE INDEX IF NOT EXISTS idx_testimonio_status   ON "Testimonio"  (status);
CREATE INDEX IF NOT EXISTS idx_actividad_proyecto  ON "Actividad"   (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_actividad_usuario   ON "Actividad"   (usuario_id);
CREATE INDEX IF NOT EXISTS idx_click_proyecto      ON "Click"       (proyecto_id);
CREATE INDEX IF NOT EXISTS idx_click_entidad       ON "Click"       (entidad_id);


-- ============================================================
-- SECCIÓN 3: FUNCIONES
-- ============================================================

-- ── Helpers RLS: leer claims del JWT ──────────────────────
-- Requiere que el JWT del backend incluya "proyecto_id" y "rol"
-- en su payload. El secret del JWT debe coincidir con
-- el "JWT Secret" configurado en Supabase (Settings > API).

CREATE OR REPLACE FUNCTION current_proyecto_id()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'proyecto_id',
    current_setting('request.jwt.claims', true)::jsonb ->> 'proyecto_id'
  );
$$;

CREATE OR REPLACE FUNCTION current_usuario_rol()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    auth.jwt() ->> 'rol',
    current_setting('request.jwt.claims', true)::jsonb ->> 'rol'
  );
$$;


-- ── Trigger: prevenir eliminar el último admin del proyecto ──

CREATE OR REPLACE FUNCTION trg_fn_prevent_delete_last_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  remaining_admins INT;
BEGIN
  IF OLD.rol IN ('ADMIN', 'SUPERADMIN') THEN
    SELECT COUNT(*) INTO remaining_admins
    FROM "Usuario"
    WHERE proyecto_id = OLD.proyecto_id
      AND rol IN ('ADMIN', 'SUPERADMIN')
      AND id <> OLD.id;

    IF remaining_admins = 0 THEN
      RAISE EXCEPTION 'No se puede eliminar al único administrador del proyecto. Asigna otro admin primero.';
    END IF;
  END IF;
  RETURN OLD;
END;
$$;


-- ============================================================
-- SECCIÓN 4: TRIGGERS
-- ============================================================

-- Eliminar antes de recrear (idempotente)
DROP TRIGGER IF EXISTS trg_usuario_last_admin ON "Usuario";


-- Proteger último admin
CREATE TRIGGER trg_usuario_last_admin
  BEFORE DELETE ON "Usuario"
  FOR EACH ROW EXECUTE FUNCTION trg_fn_prevent_delete_last_admin();


-- ============================================================
-- SECCIÓN 5: ROW LEVEL SECURITY (RLS)
-- ============================================================
-- NOTA: El service_role key del backend bypass RLS por diseño.
--       Estas políticas protegen accesos directos con anon key
--       o con tokens JWT del frontend/usuarios autenticados.
-- ============================================================

ALTER TABLE "Proyecto"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Usuario"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Articulos"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Articulo"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecArticulo" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Equipo"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Empleado"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecEmpleado" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Servicios"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Servicio"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SecServicio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonios" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Testimonio"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Actividad"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Click"       ENABLE ROW LEVEL SECURITY;


-- ── PROYECTO ───────────────────────────────────────────────
-- Cada usuario solo ve su propio proyecto
CREATE POLICY "proyecto_select_own" ON "Proyecto"
  FOR SELECT TO authenticated
  USING (id = current_proyecto_id());

-- Solo admin o superadmin puede modificar datos del proyecto
CREATE POLICY "proyecto_update_admin" ON "Proyecto"
  FOR UPDATE TO authenticated
  USING  (id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Crear y borrar proyectos solo por service role (backend)


-- ── USUARIO ────────────────────────────────────────────────
CREATE POLICY "usuario_select_own_project" ON "Usuario"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "usuario_insert_admin" ON "Usuario"
  FOR INSERT TO authenticated
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

CREATE POLICY "usuario_update_admin" ON "Usuario"
  FOR UPDATE TO authenticated
  USING  (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

CREATE POLICY "usuario_delete_admin" ON "Usuario"
  FOR DELETE TO authenticated
  USING (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));


-- ── ARTICULOS (módulo) ─────────────────────────────────────
CREATE POLICY "articulos_select_own" ON "Articulos"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "articulos_insert_editor" ON "Articulos"
  FOR INSERT TO authenticated
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

CREATE POLICY "articulos_update_editor" ON "Articulos"
  FOR UPDATE TO authenticated
  USING  (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

CREATE POLICY "articulos_delete_admin" ON "Articulos"
  FOR DELETE TO authenticated
  USING (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Lectura pública del módulo activo
CREATE POLICY "articulos_select_public" ON "Articulos"
  FOR SELECT TO anon
  USING (activo = true AND habilitado = true);


-- ── ARTICULO ───────────────────────────────────────────────
CREATE POLICY "articulo_select_own" ON "Articulo"
  FOR SELECT TO authenticated
  USING (
    articulos_id IN (SELECT id FROM "Articulos" WHERE proyecto_id = current_proyecto_id())
  );

CREATE POLICY "articulo_insert_editor" ON "Articulo"
  FOR INSERT TO authenticated
  WITH CHECK (
    articulos_id IN (SELECT id FROM "Articulos" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  );

CREATE POLICY "articulo_update_editor" ON "Articulo"
  FOR UPDATE TO authenticated
  USING (
    articulos_id IN (SELECT id FROM "Articulos" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    articulos_id IN (SELECT id FROM "Articulos" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  );

CREATE POLICY "articulo_delete_admin" ON "Articulo"
  FOR DELETE TO authenticated
  USING (
    articulos_id IN (SELECT id FROM "Articulos" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  );

-- Lectura pública solo de artículos publicados
CREATE POLICY "articulo_select_public" ON "Articulo"
  FOR SELECT TO anon
  USING (status = 'approved' AND activo = true);


-- ── SECARTICULO ────────────────────────────────────────────
CREATE POLICY "secarticulo_select_own" ON "SecArticulo"
  FOR SELECT TO authenticated
  USING (
    articulo_id IN (
      SELECT a.id FROM "Articulo" a
      JOIN "Articulos" arts ON arts.id = a.articulos_id
      WHERE arts.proyecto_id = current_proyecto_id()
    )
  );

CREATE POLICY "secarticulo_write_editor" ON "SecArticulo"
  FOR ALL TO authenticated
  USING (
    articulo_id IN (
      SELECT a.id FROM "Articulo" a
      JOIN "Articulos" arts ON arts.id = a.articulos_id
      WHERE arts.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    articulo_id IN (
      SELECT a.id FROM "Articulo" a
      JOIN "Articulos" arts ON arts.id = a.articulos_id
      WHERE arts.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('USER', 'ADMIN', 'SUPERADMIN')
  );

-- Lectura pública de secciones de artículos publicados
CREATE POLICY "secarticulo_select_public" ON "SecArticulo"
  FOR SELECT TO anon
  USING (
    articulo_id IN (SELECT id FROM "Articulo" WHERE status = 'approved' AND activo = true)
  );


-- ── EQUIPO (módulo) ────────────────────────────────────────
CREATE POLICY "equipo_select_own" ON "Equipo"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "equipo_write_editor" ON "Equipo"
  FOR ALL TO authenticated
  USING  (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Lectura pública del módulo activo
CREATE POLICY "equipo_select_public" ON "Equipo"
  FOR SELECT TO anon
  USING (activo = true AND habilitado = true);


-- ── EMPLEADO ───────────────────────────────────────────────
CREATE POLICY "empleado_select_own" ON "Empleado"
  FOR SELECT TO authenticated
  USING (
    equipo_id IN (SELECT id FROM "Equipo" WHERE proyecto_id = current_proyecto_id())
  );

CREATE POLICY "empleado_write_editor" ON "Empleado"
  FOR ALL TO authenticated
  USING (
    equipo_id IN (SELECT id FROM "Equipo" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    equipo_id IN (SELECT id FROM "Equipo" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

-- Lectura pública de empleados activos
CREATE POLICY "empleado_select_public" ON "Empleado"
  FOR SELECT TO anon
  USING (activo = true);


-- ── SECEMPLEADO ────────────────────────────────────────────
CREATE POLICY "secempleado_select_own" ON "SecEmpleado"
  FOR SELECT TO authenticated
  USING (
    empleado_id IN (
      SELECT e.id FROM "Empleado" e
      JOIN "Equipo" eq ON eq.id = e.equipo_id
      WHERE eq.proyecto_id = current_proyecto_id()
    )
  );

CREATE POLICY "secempleado_write_editor" ON "SecEmpleado"
  FOR ALL TO authenticated
  USING (
    empleado_id IN (
      SELECT e.id FROM "Empleado" e
      JOIN "Equipo" eq ON eq.id = e.equipo_id
      WHERE eq.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    empleado_id IN (
      SELECT e.id FROM "Empleado" e
      JOIN "Equipo" eq ON eq.id = e.equipo_id
      WHERE eq.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

-- Lectura pública
CREATE POLICY "secempleado_select_public" ON "SecEmpleado"
  FOR SELECT TO anon
  USING (
    empleado_id IN (SELECT id FROM "Empleado" WHERE activo = true)
  );


-- ── SERVICIOS (módulo) ─────────────────────────────────────
CREATE POLICY "servicios_select_own" ON "Servicios"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "servicios_write_editor" ON "Servicios"
  FOR ALL TO authenticated
  USING  (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Lectura pública del módulo activo
CREATE POLICY "servicios_select_public" ON "Servicios"
  FOR SELECT TO anon
  USING (activo = true AND habilitado = true);


-- ── SERVICIO ───────────────────────────────────────────────
CREATE POLICY "servicio_select_own" ON "Servicio"
  FOR SELECT TO authenticated
  USING (
    servicios_id IN (SELECT id FROM "Servicios" WHERE proyecto_id = current_proyecto_id())
  );

CREATE POLICY "servicio_write_editor" ON "Servicio"
  FOR ALL TO authenticated
  USING (
    servicios_id IN (SELECT id FROM "Servicios" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    servicios_id IN (SELECT id FROM "Servicios" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

-- Lectura pública de servicios activos
CREATE POLICY "servicio_select_public" ON "Servicio"
  FOR SELECT TO anon
  USING (activo = true);


-- ── SECSERVICIO ────────────────────────────────────────────
CREATE POLICY "secservicio_select_own" ON "SecServicio"
  FOR SELECT TO authenticated
  USING (
    servicio_id IN (
      SELECT s.id FROM "Servicio" s
      JOIN "Servicios" svc ON svc.id = s.servicios_id
      WHERE svc.proyecto_id = current_proyecto_id()
    )
  );

CREATE POLICY "secservicio_write_editor" ON "SecServicio"
  FOR ALL TO authenticated
  USING (
    servicio_id IN (
      SELECT s.id FROM "Servicio" s
      JOIN "Servicios" svc ON svc.id = s.servicios_id
      WHERE svc.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    servicio_id IN (
      SELECT s.id FROM "Servicio" s
      JOIN "Servicios" svc ON svc.id = s.servicios_id
      WHERE svc.proyecto_id = current_proyecto_id()
    )
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

-- Lectura pública de secciones de servicios activos
CREATE POLICY "secservicio_select_public" ON "SecServicio"
  FOR SELECT TO anon
  USING (
    servicio_id IN (SELECT id FROM "Servicio" WHERE activo = true)
  );


-- ── TESTIMONIOS (módulo) ───────────────────────────────────
CREATE POLICY "testimonios_select_own" ON "Testimonios"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "testimonios_write_editor" ON "Testimonios"
  FOR ALL TO authenticated
  USING  (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'))
  WITH CHECK (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Lectura pública del módulo activo
CREATE POLICY "testimonios_select_public" ON "Testimonios"
  FOR SELECT TO anon
  USING (activo = true AND habilitado = true);


-- ── TESTIMONIO ─────────────────────────────────────────────
CREATE POLICY "testimonio_select_own" ON "Testimonio"
  FOR SELECT TO authenticated
  USING (
    testimonios_id IN (SELECT id FROM "Testimonios" WHERE proyecto_id = current_proyecto_id())
  );

-- Solo admin puede aprobar/rechazar/editar testimonios
CREATE POLICY "testimonio_update_admin" ON "Testimonio"
  FOR UPDATE TO authenticated
  USING (
    testimonios_id IN (SELECT id FROM "Testimonios" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  )
  WITH CHECK (
    testimonios_id IN (SELECT id FROM "Testimonios" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

CREATE POLICY "testimonio_delete_admin" ON "Testimonio"
  FOR DELETE TO authenticated
  USING (
    testimonios_id IN (SELECT id FROM "Testimonios" WHERE proyecto_id = current_proyecto_id())
    AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN')
  );

-- Visitantes pueden enviar testimonios en módulos activos (formulario público)
CREATE POLICY "testimonio_insert_public" ON "Testimonio"
  FOR INSERT TO anon
  WITH CHECK (
    testimonios_id IN (
      SELECT id FROM "Testimonios" WHERE activo = true AND habilitado = true
    )
  );

-- Lectura pública solo de testimonios aprobados
CREATE POLICY "testimonio_select_public" ON "Testimonio"
  FOR SELECT TO anon
  USING (status = 'approved');


-- ── ACTIVIDAD ──────────────────────────────────────────────
-- Solo lectura para usuarios del proyecto (log de auditoría)
CREATE POLICY "actividad_select_own" ON "Actividad"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

-- Admin puede purgar el historial
CREATE POLICY "actividad_delete_admin" ON "Actividad"
  FOR DELETE TO authenticated
  USING (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));

-- Solo el servicio backend (service_role) puede insertar actividades


-- ── CLICK ──────────────────────────────────────────────────
-- Analytics: inserción pública, lectura solo para el proyecto
CREATE POLICY "click_insert_anon" ON "Click"
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "click_insert_auth" ON "Click"
  FOR INSERT TO authenticated
  WITH CHECK (proyecto_id = current_proyecto_id());

CREATE POLICY "click_select_own" ON "Click"
  FOR SELECT TO authenticated
  USING (proyecto_id = current_proyecto_id());

CREATE POLICY "click_delete_admin" ON "Click"
  FOR DELETE TO authenticated
  USING (proyecto_id = current_proyecto_id() AND current_usuario_rol() IN ('ADMIN', 'SUPERADMIN'));
