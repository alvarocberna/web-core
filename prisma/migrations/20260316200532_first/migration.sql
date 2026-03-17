-- CreateTable
CREATE TABLE "public"."Proyecto" (
    "id" TEXT NOT NULL,
    "nombre_proyecto" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cliente" TEXT NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proyecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL,
    "password" TEXT NOT NULL,
    "hashedRt" TEXT,
    "rol" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Articulo" (
    "id" TEXT NOT NULL,
    "nro_articulo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "autor" TEXT NOT NULL,
    "fecha_publicacion" TIMESTAMP(3) NOT NULL,
    "fecha_actualizacion" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "image_url" TEXT,
    "image_alt" TEXT,
    "image_position" TEXT,
    "usuario_id" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SecArticulo" (
    "id" TEXT NOT NULL,
    "nro_seccion" INTEGER NOT NULL,
    "titulo_sec" TEXT NOT NULL,
    "contenido_sec" TEXT NOT NULL,
    "image_url" TEXT,
    "image_alt" TEXT,
    "image_position" TEXT,
    "articulo_id" TEXT NOT NULL,

    CONSTRAINT "SecArticulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Equipo" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Empleado" (
    "id" TEXT NOT NULL,
    "nombre_primero" TEXT NOT NULL,
    "nombre_segundo" TEXT,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT,
    "profesion" TEXT NOT NULL,
    "especialidad" TEXT,
    "descripcion" TEXT,
    "orden" TEXT,
    "activo" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "img_alt" TEXT NOT NULL,
    "slug" TEXT,
    "equipo_id" TEXT NOT NULL,

    CONSTRAINT "Empleado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Servicios" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "icono" TEXT,
    "activo" TEXT NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Servicio" (
    "id" TEXT NOT NULL,
    "nombre_servicio" TEXT NOT NULL,
    "descripcion" TEXT,
    "valor" TEXT,
    "nombre_promocion" TEXT,
    "porcentaje_descuento" TEXT,
    "destacado" BOOLEAN,
    "icono" TEXT,
    "orden" TEXT,
    "activo" TEXT NOT NULL,
    "img_url" TEXT NOT NULL,
    "img_alt" TEXT NOT NULL,
    "servicios_id" TEXT NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonios" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL,
    "proyecto_id" TEXT NOT NULL,

    CONSTRAINT "Testimonios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "calificacion" INTEGER,
    "aprobado" BOOLEAN NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Usuario" ADD CONSTRAINT "Usuario_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Articulo" ADD CONSTRAINT "Articulo_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SecArticulo" ADD CONSTRAINT "SecArticulo_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Equipo" ADD CONSTRAINT "Equipo_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Empleado" ADD CONSTRAINT "Empleado_equipo_id_fkey" FOREIGN KEY ("equipo_id") REFERENCES "public"."Equipo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servicios" ADD CONSTRAINT "Servicios_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servicio" ADD CONSTRAINT "Servicio_servicios_id_fkey" FOREIGN KEY ("servicios_id") REFERENCES "public"."Servicios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonios" ADD CONSTRAINT "Testimonios_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonio" ADD CONSTRAINT "Testimonio_testimonios_id_fkey" FOREIGN KEY ("testimonios_id") REFERENCES "public"."Testimonios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_proyecto_id_fkey" FOREIGN KEY ("proyecto_id") REFERENCES "public"."Proyecto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Actividad" ADD CONSTRAINT "Actividad_articulo_id_fkey" FOREIGN KEY ("articulo_id") REFERENCES "public"."Articulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
