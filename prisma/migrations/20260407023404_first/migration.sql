-- CreateTable
CREATE TABLE "public"."Proyecto" (
    "id" TEXT NOT NULL,
    "nombre_proyecto" VARCHAR(200) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "cliente" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "hashedRt" TEXT,
    "rol" TEXT NOT NULL,
    "img_url" TEXT DEFAULT '',
    "img_alt" VARCHAR(100) DEFAULT '',
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articulos" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL DEFAULT 'Articulos',
    "descripcion" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "aprobar" BOOLEAN NOT NULL DEFAULT false,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "notificacion" BOOLEAN NOT NULL DEFAULT false,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Articulos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articulo" (
    "id" TEXT NOT NULL,
    "nro_articulo" INTEGER NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "subtitulo" VARCHAR(500),
    "autor" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "slug" TEXT NOT NULL,
    "image_url" TEXT,
    "image_alt" TEXT,
    "image_position" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "articulos_id" TEXT NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecArticulo" (
    "id" TEXT NOT NULL,
    "nro_seccion" INTEGER NOT NULL,
    "titulo_sec" VARCHAR(200),
    "contenido_sec" TEXT,
    "image_url" TEXT,
    "image_alt" VARCHAR(100),
    "image_position" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "articulo_id" TEXT NOT NULL,

    CONSTRAINT "SecArticulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipo" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL DEFAULT 'Equipo',
    "descripcion" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notificacion" BOOLEAN NOT NULL DEFAULT false,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Empleado" (
    "id" TEXT NOT NULL,
    "nombre_primero" VARCHAR(50) NOT NULL,
    "nombre_segundo" VARCHAR(50),
    "apellido_paterno" VARCHAR(50) NOT NULL,
    "apellido_materno" VARCHAR(50),
    "profesion" VARCHAR(100),
    "especialidad" VARCHAR(200),
    "descripcion" VARCHAR(500),
    "orden" INTEGER,
    "activo" BOOLEAN NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '',
    "img_url" TEXT,
    "img_alt" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "equipo_id" TEXT NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecEmpleado" (
    "id" TEXT NOT NULL,
    "nro_seccion" INTEGER NOT NULL,
    "titulo_sec" VARCHAR(200),
    "contenido_sec" TEXT,
    "image_url" TEXT,
    "image_alt" VARCHAR(100),
    "image_position" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "empleado_id" TEXT NOT NULL,

    CONSTRAINT "SecEmpleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Servicios" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL DEFAULT 'Servicios',
    "descripcion" VARCHAR(500),
    "icono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notificacion" BOOLEAN NOT NULL DEFAULT false,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Servicio" (
    "id" TEXT NOT NULL,
    "nombre_servicio" VARCHAR(200) NOT NULL,
    "descripcion" VARCHAR(500),
    "valor" INTEGER,
    "nombre_promocion" VARCHAR(200),
    "porcentaje_descuento" INTEGER,
    "destacado" BOOLEAN NOT NULL,
    "icono" TEXT,
    "orden" INTEGER,
    "activo" BOOLEAN NOT NULL,
    "slug" TEXT NOT NULL DEFAULT '-',
    "img_url" TEXT,
    "img_alt" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "servicios_id" TEXT NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecServicio" (
    "id" TEXT NOT NULL,
    "nro_seccion" INTEGER NOT NULL,
    "titulo_sec" VARCHAR(200),
    "contenido_sec" TEXT,
    "image_url" TEXT,
    "image_alt" VARCHAR(100),
    "image_position" TEXT,
    "proyecto_id" TEXT NOT NULL,
    "servicio_id" TEXT NOT NULL,

    CONSTRAINT "SecServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonios" (
    "id" TEXT NOT NULL,
    "titulo" VARCHAR(200) NOT NULL DEFAULT 'Testimonios',
    "descripcion" VARCHAR(500),
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "aprobar" BOOLEAN NOT NULL DEFAULT false,
    "notificacion" BOOLEAN NOT NULL DEFAULT false,
    "habilitado" BOOLEAN NOT NULL DEFAULT true,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonio" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "apellido" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(500) NOT NULL,
    "calificacion" INTEGER,
    "status" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
    "proyecto_id" TEXT NOT NULL,
    "testimonios_id" TEXT NOT NULL,

    CONSTRAINT "Testimonio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Actividad" (
    "id" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "titulo_articulo" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "proyecto_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "articulo_id" TEXT,

    CONSTRAINT "Actividad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Click" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "entidad_nombre" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,
    "entidad_id" TEXT NOT NULL,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulos" ADD CONSTRAINT "Articulos_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_articulos_id_fkey" FOREIGN KEY ("articulos_id") REFERENCES "public"."Articulos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecArticulo" ADD CONSTRAINT "SecArticulo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecArticulo" ADD CONSTRAINT "SecArticulo_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Empleado" ADD CONSTRAINT "Empleado_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Empleado" ADD CONSTRAINT "Empleado_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "public"."Equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecEmpleado" ADD CONSTRAINT "SecEmpleado_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecEmpleado" ADD CONSTRAINT "SecEmpleado_empleado_id_fkey" FOREIGN KEY ("empleado_id") REFERENCES "public"."Empleado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servicios" ADD CONSTRAINT "Servicios_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servicio" ADD CONSTRAINT "Servicio_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servicio" ADD CONSTRAINT "Servicio_servicios_id_fkey" FOREIGN KEY ("servicios_id") REFERENCES "public"."Servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecServicio" ADD CONSTRAINT "SecServicio_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecServicio" ADD CONSTRAINT "SecServicio_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "public"."Servicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonios" ADD CONSTRAINT "Testimonios_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonio" ADD CONSTRAINT "Testimonio_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonio" ADD CONSTRAINT "Testimonio_testimonios_id_fkey" FOREIGN KEY ("testimonios_id") REFERENCES "public"."Testimonios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
